# Code from Design - AutoDev AI

Convert UI design images to HTML, CSS, and React code automatically using computer vision and rule-based code generation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Project Overview

**Code from Design** is a full-stack application that analyzes UI design images (mockups, wireframes, screenshots) and automatically generates production-ready frontend code. The system uses computer vision to detect UI elements and maps them to clean, semantic code templates.

### Key Features

- ✅ **Smart Image Validation** - Detects if uploaded image is actually a UI design
- 🔍 **UI Element Detection** - Identifies buttons, inputs, text, containers, and images
- 🎨 **Multi-Format Code Generation** - Generates HTML, CSS, and React code
- 👁️ **Live Preview** - Instant preview of generated UI
- 📋 **Copy & Download** - Easy code export functionality
- ⚡ **Fast Processing** - No heavy ML models, pure computer vision

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with Hooks
- Vite (build tool)
- Axios (HTTP client)
- Modern CSS with CSS Variables

**Backend:**
- FastAPI (Python web framework)
- OpenCV (computer vision)
- Pillow (image processing)
- Pydantic (data validation)

### System Flow

```
User Upload → Image Validation → UI Detection → Code Generation → Response
     ↓              ↓                 ↓              ↓              ↓
   File       Face Detection     Contours      Templates      JSON Response
             Color Analysis      Shapes        HTML/CSS
             Edge Detection      Position      React JSX
```

## 📁 Project Structure

```
code-from-design/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── models/
│   │   └── schemas.py            # Pydantic models
│   ├── services/
│   │   ├── image_validator.py   # Image validation logic
│   │   ├── ui_detector.py       # UI element detection
│   │   └── code_generator.py    # Code generation
│   └── utils/
│       └── image_processor.py   # Image processing utilities
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx               # Main component
│       ├── index.jsx             # Entry point
│       ├── components/
│       │   ├── ImageUploader.jsx
│       │   ├── CodeDisplay.jsx
│       │   ├── LivePreview.jsx
│       │   └── ErrorMessage.jsx
│       ├── services/
│       │   └── api.js            # API communication
│       └── styles/
│           └── App.css
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ (backend)
- Node.js 16+ (frontend)
- npm or yarn (frontend)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd code-from-design
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### Running the Application

#### Start Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

Backend will run on: `http://localhost:8000`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

### Access the Application

Open your browser and navigate to: `http://localhost:3000`

## 🔬 How It Works

### 1. Image Validation

The system validates uploaded images using multiple heuristics:

**Detection Methods:**
- **Face Detection**: Rejects images with human faces (likely photos)
- **Color Analysis**: UI designs have limited color palettes (< 150 unique colors)
- **Shape Detection**: UI designs contain rectangular elements (buttons, inputs)
- **Edge Density**: UI designs have moderate edge density (0.05 - 0.40)

**Validation Code Example:**
```python
# From services/image_validator.py
def validate(self, image):
    # Check for faces
    num_faces = detect_faces(image)
    if num_faces > 0:
        return ValidationResult(is_ui_design=False, reason="Contains faces")
    
    # Analyze colors
    unique_colors = count_unique_colors(image)
    if unique_colors > 150:
        return ValidationResult(is_ui_design=False, reason="Too many colors")
    
    # Detect shapes
    rectangles = detect_rectangles(image)
    if len(rectangles) < 3:
        return ValidationResult(is_ui_design=False, reason="No UI elements")
    
    return ValidationResult(is_ui_design=True)
```

### 2. UI Element Detection

Uses OpenCV to detect UI elements:

**Detection Process:**
1. Convert image to grayscale
2. Apply edge detection (Canny)
3. Find contours (connected regions)
4. Filter by size and shape
5. Classify by dimensions:
   - **Container**: Large area (> 15% of image)
   - **Header**: Top region, wide aspect ratio
   - **Button**: Medium size, roughly square
   - **Input**: Narrow height, wide aspect ratio
   - **Text**: Small area

**Classification Logic:**
```python
# From services/ui_detector.py
def classify_element(x, y, w, h, img_width, img_height):
    area_ratio = (w * h) / (img_width * img_height)
    aspect_ratio = w / h
    
    if area_ratio > 0.15:
        return 'container'
    elif 20 < h < 60 and aspect_ratio > 2:
        return 'input'
    elif 25 < h < 80 and 0.5 < aspect_ratio < 5:
        return 'button'
    else:
        return 'text'
```

### 3. Code Generation

Maps detected elements to code templates:

**Template System:**
- Each UI element type has predefined HTML/CSS/React templates
- Templates use semantic HTML5 elements
- CSS uses modern features (Flexbox, CSS Grid, CSS Variables)
- React components include state management and event handlers

**Code Generation Example:**
```python
# From services/code_generator.py
def element_to_html(element):
    templates = {
        'button': f'<button class="btn">{element.text}</button>',
        'input': f'<input type="text" placeholder="{element.placeholder}">',
        'text': f'<p class="text-content">{element.text}</p>',
    }
    return templates.get(element.type)
```

### 4. Response Structure

**Success Response:**
```json
{
  "valid": true,
  "message": "UI design successfully analyzed!",
  "elements": [
    {
      "type": "button",
      "x": 100,
      "y": 200,
      "width": 120,
      "height": 40,
      "text": "Click Here",
      "confidence": 0.95
    }
  ],
  "generated_code": {
    "html": "<!DOCTYPE html>...",
    "css": "* { margin: 0; }...",
    "react": "import React from 'react'..."
  },
  "preview_data": {
    "element_count": 5,
    "element_types": {
      "buttons": 2,
      "inputs": 1,
      "text": 2
    }
  }
}
```

**Error Response:**
```json
{
  "valid": false,
  "message": "Image contains human faces - this appears to be a photograph",
  "elements": null,
  "generated_code": null
}
```

## 📊 API Documentation

### Endpoints

#### POST `/api/analyze`

Analyze image and generate code.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "valid": boolean,
  "message": string,
  "elements": UIElement[] | null,
  "generated_code": GeneratedCode | null,
  "preview_data": object | null
}
```

#### POST `/api/validate`

Validate image only (no code generation).

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "is_ui_design": boolean,
  "confidence": float,
  "reason": string,
  "metrics": object
}
```

#### GET `/`

Health check endpoint.

**Response:**
```json
{
  "message": "Code from Design API",
  "status": "running",
  "version": "1.0.0"
}
```

## 🎓 Understanding the Code

### Backend Key Concepts

1. **Separation of Concerns**: Each service has a single responsibility
   - `ImageValidator`: Only validates images
   - `UIDetector`: Only detects UI elements
   - `CodeGenerator`: Only generates code

2. **Intermediate Representation**: Detected elements are stored as structured data before code generation
   - Allows different code formats from same detection
   - Makes system extensible (add new formats easily)

3. **Template-Based Generation**: Code is generated from templates, not AI
   - Predictable output
   - Easy to customize
   - No hallucinations

### Frontend Key Concepts

1. **Component-Based Architecture**: Each UI feature is a separate component
   - `ImageUploader`: Handles file upload
   - `CodeDisplay`: Shows generated code
   - `LivePreview`: Renders preview
   - `ErrorMessage`: Displays errors

2. **State Management**: React hooks manage application state
   - `useState` for local state
   - Props for parent-child communication

3. **Async Operations**: API calls handled with async/await
   - Loading states
   - Error handling
   - User feedback

## 🔧 Customization

### Adding New UI Element Types

1. Update `ui_detector.py`:
```python
def classify_element(x, y, w, h, img_width, img_height):
    # Add new classification logic
    if <your_condition>:
        return 'new_element_type'
```

2. Update `code_generator.py`:
```python
def element_to_html(element):
    templates = {
        'new_element_type': f'<div class="new-type">...</div>',
        # ... existing templates
    }
```

### Adjusting Validation Thresholds

Edit `image_validator.py`:
```python
self.thresholds = {
    'max_faces': 0,          # Increase to allow some faces
    'min_rectangles': 3,     # Adjust minimum shapes
    'max_unique_colors': 150, # Adjust color limit
}
```

## 🐛 Troubleshooting

### Backend Issues

**Import errors:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**OpenCV errors:**
```bash
# Install system dependencies (Ubuntu)
sudo apt-get install libgl1-mesa-glx libglib2.0-0

# Reinstall OpenCV
pip uninstall opencv-python
pip install opencv-python
```

### Frontend Issues

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
- Ensure backend is running on port 8000
- Check CORS configuration in `main.py`

## 📈 Future Enhancements

- [ ] Add OCR for text extraction (Tesseract)
- [ ] Support for more UI frameworks (Vue, Angular)
- [ ] Layout analysis (grid detection, spacing)
- [ ] Color palette extraction
- [ ] Export to Figma/Sketch
- [ ] ML model integration for better detection
- [ ] Batch processing multiple images

## 🤝 Contributing

This is an educational project suitable for internship demonstrations. Feel free to:
- Add new features
- Improve detection algorithms
- Enhance code templates
- Add tests
- Improve documentation

## 📄 License

MIT License - feel free to use for learning and projects.

## 👨‍💻 Developer Notes

### Why This Approach?

1. **Rule-Based vs ML**: Rule-based is faster, more predictable, and requires no training data
2. **Template System**: Ensures clean, consistent code output
3. **Modular Design**: Easy to understand, test, and extend
4. **Production-Ready**: Uses industry-standard libraries and patterns

### Learning Outcomes

By studying this project, you'll learn:
- FastAPI backend development
- React frontend development
- Computer vision with OpenCV
- REST API design
- Image processing techniques
- Code generation patterns
- Full-stack integration

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the code comments
3. Test with different UI design images

---

**Built with ❤️ for developers learning full-stack AI engineering in AutoDev AI Team 4**