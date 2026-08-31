import os
import sys
import json
import time
import argparse
from pathlib import Path
from PIL import Image

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader, random_split

from model import build_model, get_transforms, NUM_CLASSES

class RobustCropDataset(Dataset):
    """Custom PyTorch dataset that reliably loads only valid image class directories."""
    def __init__(self, data_dir: Path, transform=None):
        self.transform = transform
        self.samples = []
        self.classes = []

        # Find all valid class subdirectories (ignore empty/locked folders)
        valid_dirs = sorted([
            d for d in data_dir.iterdir() 
            if d.is_dir() and len([f for f in d.iterdir() if f.is_file() and f.suffix.lower() in [".jpg", ".jpeg", ".png", ".bmp"]]) > 0
        ])

        self.classes = [d.name for d in valid_dirs]
        self.class_to_idx = {cls_name: i for i, cls_name in enumerate(self.classes)}

        for d in valid_dirs:
            cls_idx = self.class_to_idx[d.name]
            for img_file in d.iterdir():
                if img_file.is_file() and img_file.suffix.lower() in [".jpg", ".jpeg", ".png", ".bmp"]:
                    self.samples.append((str(img_file), cls_idx))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        try:
            with Image.open(path) as img:
                img = img.convert("RGB")
                if self.transform:
                    img = self.transform(img)
                return img, label
        except Exception as e:
            # Fallback for any corrupted image
            img = Image.new("RGB", (224, 224), color=(0, 0, 0))
            if self.transform:
                img = self.transform(img)
            return img, label

def parse_args():
    parser = argparse.ArgumentParser(description="Train a Crop Disease Classification Model on PlantVillage")
    parser.add_argument("--data_dir", type=str, default="./data/PlantVillage", help="Path to PlantVillage dataset folder")
    parser.add_argument("--epochs", type=int, default=6, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=64, help="Batch size for training")
    parser.add_argument("--lr", type=float, default=1e-3, help="Initial learning rate")
    parser.add_argument("--model", type=str, default="mobilenet_v3_small", 
                        choices=["mobilenet_v3_small", "efficientnet_b0", "resnet18", "resnet34", "mobilenet_v3_large"])
    parser.add_argument("--output", type=str, default="disease_model.pth", help="Output model weights file path")
    parser.add_argument("--val_split", type=float, default=0.2, help="Validation set split ratio")
    return parser.parse_args()

def prepare_dataloaders(data_dir: str, batch_size: int, val_split: float):
    train_transform, val_transform = get_transforms()
    data_path = Path(data_dir)

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset directory '{data_dir}' does not exist!")

    full_dataset = RobustCropDataset(data_path, transform=None)
    classes = full_dataset.classes
    total_size = len(full_dataset)

    val_size = int(total_size * val_split)
    train_size = total_size - val_size

    # Split dataset indices
    generator = torch.Generator().manual_seed(42)
    indices = torch.randperm(total_size, generator=generator).tolist()
    train_indices = indices[:train_size]
    val_indices = indices[train_size:]

    class SubsetWithTransform(Dataset):
        def __init__(self, base_dataset, indices, transform):
            self.base_dataset = base_dataset
            self.indices = indices
            self.transform = transform

        def __len__(self):
            return len(self.indices)

        def __getitem__(self, idx):
            real_idx = self.indices[idx]
            path, label = self.base_dataset.samples[real_idx]
            with Image.open(path) as img:
                img = img.convert("RGB")
                if self.transform:
                    img = self.transform(img)
                return img, label

    train_dataset = SubsetWithTransform(full_dataset, train_indices, train_transform)
    val_dataset = SubsetWithTransform(full_dataset, val_indices, val_transform)

    print(f"[INFO] Valid Classes Loaded: {len(classes)} classes")
    print(f"[INFO] Dataset split -> Training: {len(train_dataset)} images | Validation: {len(val_dataset)} images (Total: {total_size})")

    # Save classes.json
    classes_path = Path(__file__).parent / "classes.json"
    with open(classes_path, "w", encoding="utf-8") as f:
        json.dump(classes, f, indent=2)
    print(f"[INFO] Saved {len(classes)} class labels to {classes_path}")

    num_workers = 0 if os.name == 'nt' else 2
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers, pin_memory=False)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=False)

    return train_loader, val_loader, classes

def train():
    args = parse_args()
    
    # Configure CPU threads
    cpu_count = os.cpu_count() or 4
    active_threads = min(8, cpu_count)
    torch.set_num_threads(active_threads)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("=" * 85)
    print(f"      STARTING CROP DISEASE TRAINING WITH {args.model.upper()}")
    print("=" * 85)
    print(f"[INFO] Compute Device: {device} ({active_threads} active CPU threads)")
    print(f"[INFO] Model: {args.model} | Epochs: {args.epochs} | Batch Size: {args.batch_size} | LR: {args.lr}")

    train_loader, val_loader, classes = prepare_dataloaders(args.data_dir, args.batch_size, args.val_split)

    num_classes = len(classes)
    model = build_model(num_classes=num_classes, pretrained=True, model_name=args.model)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)

    best_val_acc = 0.0
    total_start_time = time.time()
    epoch_times = []

    total_batches = len(train_loader)
    print(f"\n[INFO] Training in progress: {args.epochs} epochs ({total_batches} batches/epoch)...\n")

    for epoch in range(1, args.epochs + 1):
        epoch_start = time.time()

        # Training phase
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for batch_idx, (images, labels) in enumerate(train_loader, 1):
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == labels.data).item()
            total_train += labels.size(0)

            # Live batch progress
            if batch_idx % 40 == 0 or batch_idx == total_batches:
                batch_acc = (correct_train / total_train) * 100
                batch_loss = running_loss / total_train
                elapsed = time.time() - epoch_start
                batches_left = total_batches - batch_idx
                batch_speed = elapsed / batch_idx
                eta_epoch = batches_left * batch_speed
                sys.stdout.write(f"\r  Epoch [{epoch:02d}/{args.epochs:02d}] Batch [{batch_idx:03d}/{total_batches:03d}] - Loss: {batch_loss:.4f} | Acc: {batch_acc:.2f}% | ETA: {eta_epoch:.0f}s")
                sys.stdout.flush()

        scheduler.step()
        sys.stdout.write("\n")

        train_loss = running_loss / total_train
        train_acc = correct_train / total_train

        # Validation phase
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == labels.data).item()
                total_val += labels.size(0)

        val_loss = val_loss / total_val
        val_acc = correct_val / total_val
        epoch_duration = time.time() - epoch_start
        epoch_times.append(epoch_duration)

        avg_epoch_time = sum(epoch_times) / len(epoch_times)
        remaining_epochs = args.epochs - epoch
        eta_total_mins = (remaining_epochs * avg_epoch_time) / 60

        print(f"  >>> Epoch {epoch:02d}/{args.epochs:02d} Complete in {epoch_duration:.1f}s | "
              f"Train Acc: {train_acc*100:.2f}% | Val Acc: {val_acc*100:.2f}% | "
              f"Val Loss: {val_loss:.4f} | Remaining: ~{eta_total_mins:.1f} mins")

        # Save checkpoint if best validation accuracy achieved
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            save_path = Path(__file__).parent / args.output
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'val_acc': val_acc,
                'classes': classes,
                'model_name': args.model,
            }, save_path)
            print(f"      [BEST] Saved new best weights -> {save_path} (Val Acc: {val_acc*100:.2f}%)")

    total_time = time.time() - total_start_time
    print("\n" + "=" * 85)
    print(f"[SUCCESS] Training Completed Successfully!")
    print(f"[METRIC]  Total Training Time:     {total_time/60:.2f} minutes ({total_time:.1f} seconds)")
    print(f"[METRIC]  Average Time Per Epoch:  {sum(epoch_times)/len(epoch_times):.1f} seconds")
    print(f"[METRIC]  Best Validation Accuracy: {best_val_acc*100:.2f}%")
    print(f"[SAVED]   Model Weights: {Path(__file__).parent / args.output}")
    print("=" * 85 + "\n")

    # Clean up cleanup_empty.py
    temp_script = Path(__file__).parent / "cleanup_empty.py"
    if temp_script.exists():
        temp_script.unlink()

if __name__ == "__main__":
    train()
