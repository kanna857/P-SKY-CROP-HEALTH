import os
import io
import json
import torch
import torch.nn.functional as F
from pathlib import Path
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from model import build_model, get_transforms, NUM_CLASSES

app = FastAPI(
    title="Sky Crop Health - Plant Disease AI API",
    description="FastAPI Backend for Plant Disease Image Classification with PyTorch",
    version="2.0.0"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BASE_DIR = Path(__file__).parent
CLASSES_FILE = BASE_DIR / "classes.json"
MODEL_WEIGHTS_FILE = BASE_DIR / "disease_model.pth"

# Load class names
if CLASSES_FILE.exists():
    with open(CLASSES_FILE, "r", encoding="utf-8") as f:
        CLASSES = json.load(f)
else:
    CLASSES = [f"Class_{i}" for i in range(NUM_CLASSES)]

# Transforms
_, val_transform = get_transforms()

# Model instance
model = None
model_loaded = False

def load_inference_model():
    global model, model_loaded
    if MODEL_WEIGHTS_FILE.exists():
        try:
            print(f"[INFO] Loading weights from {MODEL_WEIGHTS_FILE}...")
            checkpoint = torch.load(MODEL_WEIGHTS_FILE, map_location=DEVICE)
            model_name = checkpoint.get("model_name", "mobilenet_v3_small")
            loaded_classes = checkpoint.get("classes", CLASSES)

            m = build_model(num_classes=len(loaded_classes), pretrained=False, model_name=model_name)
            m.load_state_dict(checkpoint["model_state_dict"])
            m = m.to(DEVICE)
            m.eval()

            model = m
            model_loaded = True
            print(f"[SUCCESS] Custom trained model loaded successfully ({model_name}).")
            return
        except Exception as e:
            print(f"[WARNING] Failed to load model weights: {e}. Falling back to default classifier.")

    # Fallback to pre-trained MobileNet backbone for zero-downtime testing
    print("[INFO] Initializing default vision classifier for testing...")
    m = build_model(num_classes=len(CLASSES), pretrained=True, model_name="mobilenet_v3_small")
    m = m.to(DEVICE)
    m.eval()
    model = m
    model_loaded = True

@app.on_event("startup")
def startup_event():
    load_inference_model()

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Sky Crop Health ML API",
        "model_loaded": model_loaded,
        "classes_count": len(CLASSES),
        "device": str(DEVICE)
    }

@app.head("/predict")
def predict_head():
    """Health check for HEAD /predict as expected by frontend CameraUpload.tsx"""
    return Response(status_code=200)

@app.post("/predict")
async def predict_crop_disease(file: UploadFile = File(...)):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Preprocess
        tensor = val_transform(image).unsqueeze(0).to(DEVICE)

        # Inference
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            top_prob, top_idx = torch.max(probabilities, dim=0)
            
            # Extract Top 5 candidate predictions
            k = min(5, len(CLASSES))
            topk_probs, topk_indices = torch.topk(probabilities, k=k)

        confidence = float(top_prob.item())
        class_idx = int(top_idx.item())
        class_name = CLASSES[class_idx] if class_idx < len(CLASSES) else f"Class_{class_idx}"

        # Parse primary plant and disease names
        is_healthy = "healthy" in class_name.lower()
        parts = class_name.split("___")
        plant = parts[0].replace("_", " ").strip()
        issue = parts[1].replace("_", " ").strip() if len(parts) > 1 else ("Healthy" if is_healthy else "Unknown Disease")
        severity = "Low" if is_healthy else ("High" if ("blight" in issue.lower() or "rot" in issue.lower() or "virus" in issue.lower()) else "Medium")

        # Build top-5 predictions list for the breakdown chart
        top_predictions = []
        for p, idx in zip(topk_probs, topk_indices):
            c_name = CLASSES[int(idx.item())] if int(idx.item()) < len(CLASSES) else f"Class_{int(idx.item())}"
            c_parts = c_name.split("___")
            c_plant = c_parts[0].replace("_", " ").strip()
            c_issue = c_parts[1].replace("_", " ").strip() if len(c_parts) > 1 else ("Healthy" if "healthy" in c_name.lower() else "Unknown")
            c_prob = float(p.item())
            top_predictions.append({
                "raw_class": c_name,
                "plant": c_plant,
                "issue": c_issue,
                "confidence": round(c_prob, 4),
                "percentage": round(c_prob * 100, 1)
            })

        return JSONResponse({
            "raw_class": class_name,
            "disease": class_name,
            "plant": plant,
            "issue": issue,
            "confidence": round(confidence, 4),
            "is_healthy": is_healthy,
            "severity": severity,
            "recommendation": "Consult local agricultural extension or follow recommended treatment procedures.",
            "top_predictions": top_predictions
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
