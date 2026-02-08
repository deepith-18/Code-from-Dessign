"""
FastAPI Backend for Code from Design
Main application entry point
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from models.schemas import AnalysisResponse
from services.image_validator import ImageValidator
from services.ui_detector import UIDetector
from services.code_generator import CodeGenerator
from utils.image_processor import ImageProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Code from Design API",
    description="Convert UI design images to HTML, CSS, and React code",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
image_processor = ImageProcessor()
validator = ImageValidator()
detector = UIDetector()
generator = CodeGenerator()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Code from Design API",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Main endpoint: Analyze uploaded image and generate code
    
    Process Flow:
    1. Read uploaded image
    2. Validate it's a UI design (not a photo/irrelevant image)
    3. If valid:
       a. Detect UI elements
       b. Generate HTML/CSS/React code
       c. Return structured response
    4. If invalid:
       a. Return error message
    
    Args:
        file: Uploaded image file
        
    Returns:
        AnalysisResponse with validation status and generated code
    """
    try:
        logger.info(f"Received upload: {file.filename}")
        
        # Step 1: Read image file
        contents = await file.read()
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Step 2: Convert to OpenCV format
        try:
            image = image_processor.load_image_from_bytes(contents)
            logger.info(f"Image loaded: {image.shape}")
        except Exception as e:
            logger.error(f"Failed to load image: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid image file. Please upload a valid PNG, JPG, or JPEG image."
            )
        
        # Step 3: Validate image is a UI design
        validation_result = validator.validate(image)
        logger.info(f"Validation result: {validation_result.is_ui_design}, confidence: {validation_result.confidence}")
        
        # Step 4: If not a UI design, return error
        if not validation_result.is_ui_design:
            return AnalysisResponse(
                valid=False,
                message=validation_result.reason,
                elements=None,
                generated_code=None,
                preview_data=None
            )
        
        # Step 5: Detect UI elements
        elements = detector.detect_elements(image)
        logger.info(f"Detected {len(elements)} UI elements")
        
        # Step 6: Generate code from detected elements
        generated_code = generator.generate(elements)
        logger.info("Code generation complete")
        
        # Step 7: Prepare preview data
        preview_data = {
            "element_count": len(elements),
            "element_types": {
                "buttons": len([e for e in elements if e.type == 'button']),
                "inputs": len([e for e in elements if e.type == 'input']),
                "text": len([e for e in elements if e.type == 'text']),
                "containers": len([e for e in elements if e.type == 'container']),
                "images": len([e for e in elements if e.type == 'image']),
            },
            "validation_metrics": validation_result.metrics
        }
        
        # Step 8: Return success response
        return AnalysisResponse(
            valid=True,
            message="UI design successfully analyzed and code generated!",
            elements=elements,
            generated_code=generated_code,
            preview_data=preview_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.post("/api/validate")
async def validate_only(file: UploadFile = File(...)):
    """
    Endpoint to only validate if image is a UI design
    Useful for quick checks without full processing
    
    Args:
        file: Uploaded image file
        
    Returns:
        Validation result with metrics
    """
    try:
        contents = await file.read()
        image = image_processor.load_image_from_bytes(contents)
        
        validation_result = validator.validate(image)
        
        return {
            "is_ui_design": validation_result.is_ui_design,
            "confidence": validation_result.confidence,
            "reason": validation_result.reason,
            "metrics": validation_result.metrics
        }
        
    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)