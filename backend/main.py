import os
import uuid
import shutil
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import AnalysisResponse
from services.ui_detector import UIDetector
from services.code_generator import CodeGenerator
from utils.image_processor import ImageProcessor

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Code From Design (Local AI Edition)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
image_processor = ImageProcessor()
detector = UIDetector()
generator = CodeGenerator() 

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"status": "online", "engine": "Ollama (Local)"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    temp_path = None
    try:
        # 1. Save file locally
        file_ext = os.path.splitext(file.filename)[1]
        temp_filename = f"{uuid.uuid4()}{file_ext}"
        temp_path = os.path.join(TEMP_DIR, temp_filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Traditional CV Detection (Pre-processing)
        with open(temp_path, "rb") as f:
            contents = f.read()
            image_cv = image_processor.load_image_from_bytes(contents)

        elements = detector.detect_elements(image_cv)
        
        # 3. Generate Code using Local Ollama
        # Note: This might take 30-60 seconds on a laptop CPU
        generated_code = generator.generate(temp_path, elements)
        
        preview_data = {
            "element_count": len(elements),
            "engine": "Ollama CPU"
        }

        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

        return AnalysisResponse(
            valid=True,
            message="Local Analysis Complete",
            elements=elements,
            generated_code=generated_code,
            preview_data=preview_data
        )

    except Exception as e:
        if temp_path and os.path.exists(temp_path):
            try: os.remove(temp_path)
            except: pass
        logger.error(f"Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)