# Sky Crop Health - Backend & Model Training 🌾🧠

This directory contains the Python FastAPI backend and deep learning model training pipeline for crop disease diagnosis using the **PlantVillage** dataset (38 disease and healthy classes).

---

## 📁 File Overview

- **`main.py`**: FastAPI server exposing `POST /predict` (image classification) and `HEAD /predict` (health check) consumed by `src/components/analyze/CameraUpload.tsx`.
- **`model.py`**: PyTorch vision backbones (`MobileNetV3-Small`, `EfficientNet-B0`, `ResNet18`, `ResNet34`) and data transformations.
- **`train.py`**: Model training script supporting data augmentation, validation splits, learning rate scheduling, and checkpoint saving.
- **`PLANT_DISEASE_PREDECTION.ipynb`**: Google Colab notebook for GPU training on the 38-class PlantVillage dataset (achieved 99.86% validation accuracy).
- **`disease_model.pth`**: Trained PyTorch weights from `PLANT_DISEASE_PREDECTION.ipynb` (MobileNetV3-Small, ~99.86% accuracy).
- **`classes.json`**: Class index mappings matching the 38 classes defined in the frontend knowledge base.
- **`requirements.txt`**: Python dependencies.

---

## 🚀 1. Setup & Installation

From your terminal in the root or `backend/` directory:

```bash
cd backend
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# Or on Command Prompt:
.venv\Scripts\activate.bat

pip install -r requirements.txt
```

---

## 🏃 2. Running the FastAPI Server

To start the local prediction API:

```bash
python main.py
```
Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

## 🏋️ 3. Training Your Own Custom Model

### Step A: Download PlantVillage Dataset
Download the PlantVillage dataset (or any custom crop dataset structured in subfolders by class) and place it inside `backend/data/`:

```
backend/
└── data/
    ├── Apple___Apple_scab/
    ├── Apple___Black_rot/
    ├── Tomato___Late_blight/
    └── ... (38 classes)
```

### Step B: Run Training
```bash
python train.py --data_dir ./data --epochs 15 --batch_size 32 --model mobilenet_v3_small
```

Options:
- `--data_dir`: Path to dataset folder (default: `./data`)
- `--epochs`: Number of training epochs (default: `15`)
- `--batch_size`: Batch size (default: `32`)
- `--lr`: Learning rate (default: `0.001`)
- `--model`: `mobilenet_v3_small` | `resnet34` | `resnet50`
- `--output`: File name to save weights (default: `disease_model.pth`)

Once trained, `disease_model.pth` will be automatically saved in `backend/` and loaded by `main.py`!
