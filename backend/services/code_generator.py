"""
Code Generator Service
Converts detected UI elements into HTML, CSS, and React code
"""
from typing import List
from models.schemas import UIElement, GeneratedCode


class CodeGenerator:
    """
    Generates frontend code from structured UI elements
    
    Strategy:
    1. Create intermediate representation (already done - UIElement list)
    2. Map each element type to code templates
    3. Generate HTML structure
    4. Generate corresponding CSS
    5. Generate React JSX component
    """
    
    def __init__(self):
        # CSS class counter for unique classes
        self.class_counter = 0
    
    def generate(self, elements: List[UIElement]) -> GeneratedCode:
        """
        Main code generation method
        
        Args:
            elements: List of detected UI elements
            
        Returns:
            GeneratedCode with HTML, CSS, and React
        """
        # Reset counter
        self.class_counter = 0
        
        # Generate code in three formats
        html = self._generate_html(elements)
        css = self._generate_css(elements)
        react = self._generate_react(elements)
        
        return GeneratedCode(
            html=html,
            css=css,
            react=react
        )
    
    def _generate_html(self, elements: List[UIElement]) -> str:
        """Generate semantic HTML5"""
        
        html_parts = ['<!DOCTYPE html>', '<html lang="en">', '<head>']
        html_parts.append('  <meta charset="UTF-8">')
        html_parts.append('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        html_parts.append('  <title>Generated UI</title>')
        html_parts.append('  <link rel="stylesheet" href="styles.css">')
        html_parts.append('</head>')
        html_parts.append('<body>')
        html_parts.append('  <div class="app-container">')
        
        # Group elements by type for better structure
        containers = [e for e in elements if e.type == 'container']
        headers = [e for e in elements if e.type == 'header']
        others = [e for e in elements if e.type not in ['container', 'header']]
        
        # Add header if exists
        if headers:
            html_parts.append('    <header class="app-header">')
            for header in headers:
                html_parts.append(f'      <h1>{header.text or "Page Title"}</h1>')
            html_parts.append('    </header>')
        
        # Add main content
        html_parts.append('    <main class="main-content">')
        
        # Process other elements
        for element in others:
            html_parts.append(self._element_to_html(element))
        
        html_parts.append('    </main>')
        html_parts.append('  </div>')
        html_parts.append('</body>')
        html_parts.append('</html>')
        
        return '\n'.join(html_parts)
    
    def _element_to_html(self, element: UIElement) -> str:
        """Convert a single UI element to HTML"""
        
        templates = {
            'button': f'      <button class="btn">{element.text or "Button"}</button>',
            'input': f'      <input type="text" class="input-field" placeholder="{element.placeholder or "Enter text"}">',
            'text': f'      <p class="text-content">{element.text or "Sample text content"}</p>',
            'image': f'      <div class="image-placeholder"></div>',
            'container': f'      <div class="container-box"></div>',
        }
        
        return templates.get(element.type, f'      <div class="element-{element.type}"></div>')
    
    def _generate_css(self, elements: List[UIElement]) -> str:
        """Generate modern CSS with Flexbox/Grid"""
        
        css_parts = [
            '/* Reset and Base Styles */',
            '* {',
            '  margin: 0;',
            '  padding: 0;',
            '  box-sizing: border-box;',
            '}',
            '',
            'body {',
            '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
            '  line-height: 1.6;',
            '  color: #333;',
            '  background: #f5f5f5;',
            '}',
            '',
            '.app-container {',
            '  max-width: 1200px;',
            '  margin: 0 auto;',
            '  padding: 20px;',
            '  background: white;',
            '  min-height: 100vh;',
            '}',
            '',
            '/* Header Styles */',
            '.app-header {',
            '  padding: 20px 0;',
            '  border-bottom: 2px solid #e0e0e0;',
            '  margin-bottom: 30px;',
            '}',
            '',
            '.app-header h1 {',
            '  font-size: 2rem;',
            '  font-weight: 600;',
            '  color: #1a1a1a;',
            '}',
            '',
            '/* Main Content */',
            '.main-content {',
            '  display: flex;',
            '  flex-direction: column;',
            '  gap: 20px;',
            '  padding: 20px 0;',
            '}',
            '',
            '/* Button Styles */',
            '.btn {',
            '  padding: 12px 24px;',
            '  font-size: 16px;',
            '  font-weight: 500;',
            '  color: white;',
            '  background: #007bff;',
            '  border: none;',
            '  border-radius: 6px;',
            '  cursor: pointer;',
            '  transition: background 0.3s ease;',
            '}',
            '',
            '.btn:hover {',
            '  background: #0056b3;',
            '}',
            '',
            '/* Input Field Styles */',
            '.input-field {',
            '  padding: 12px 16px;',
            '  font-size: 16px;',
            '  border: 1px solid #ddd;',
            '  border-radius: 6px;',
            '  width: 100%;',
            '  max-width: 400px;',
            '  transition: border-color 0.3s ease;',
            '}',
            '',
            '.input-field:focus {',
            '  outline: none;',
            '  border-color: #007bff;',
            '}',
            '',
            '/* Text Content */',
            '.text-content {',
            '  font-size: 16px;',
            '  color: #555;',
            '  line-height: 1.8;',
            '}',
            '',
            '/* Image Placeholder */',
            '.image-placeholder {',
            '  width: 200px;',
            '  height: 200px;',
            '  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
            '  border-radius: 8px;',
            '}',
            '',
            '/* Container Box */',
            '.container-box {',
            '  padding: 20px;',
            '  border: 1px solid #e0e0e0;',
            '  border-radius: 8px;',
            '  background: #fafafa;',
            '}',
            '',
            '/* Responsive Design */',
            '@media (max-width: 768px) {',
            '  .app-container {',
            '    padding: 15px;',
            '  }',
            '  ',
            '  .app-header h1 {',
            '    font-size: 1.5rem;',
            '  }',
            '}'
        ]
        
        return '\n'.join(css_parts)
    
    def _generate_react(self, elements: List[UIElement]) -> str:
        """Generate React functional component with hooks"""
        
        react_parts = [
            'import React, { useState } from "react";',
            'import "./styles.css";',
            '',
            'function GeneratedUI() {',
            '  // State management',
            '  const [formData, setFormData] = useState({});',
            '',
            '  // Event handlers',
            '  const handleInputChange = (e) => {',
            '    setFormData({',
            '      ...formData,',
            '      [e.target.name]: e.target.value',
            '    });',
            '  };',
            '',
            '  const handleButtonClick = () => {',
            '    console.log("Button clicked", formData);',
            '  };',
            '',
            '  return (',
            '    <div className="app-container">',
        ]
        
        # Group elements
        headers = [e for e in elements if e.type == 'header']
        others = [e for e in elements if e.type not in ['container', 'header']]
        
        # Add header
        if headers:
            react_parts.append('      <header className="app-header">')
            for header in headers:
                react_parts.append(f'        <h1>{header.text or "Page Title"}</h1>')
            react_parts.append('      </header>')
        
        # Add main content
        react_parts.append('      <main className="main-content">')
        
        input_counter = 0
        for element in others:
            if element.type == 'button':
                react_parts.append(f'        <button className="btn" onClick={{handleButtonClick}}>')
                react_parts.append(f'          {element.text or "Button"}')
                react_parts.append('        </button>')
            
            elif element.type == 'input':
                input_name = f'input{input_counter}'
                input_counter += 1
                react_parts.append(f'        <input')
                react_parts.append(f'          type="text"')
                react_parts.append(f'          name="{input_name}"')
                react_parts.append(f'          className="input-field"')
                react_parts.append(f'          placeholder="{element.placeholder or "Enter text"}"')
                react_parts.append(f'          onChange={{handleInputChange}}')
                react_parts.append(f'        />')
            
            elif element.type == 'text':
                react_parts.append(f'        <p className="text-content">')
                react_parts.append(f'          {element.text or "Sample text content"}')
                react_parts.append('        </p>')
            
            elif element.type == 'image':
                react_parts.append('        <div className="image-placeholder"></div>')
        
        react_parts.append('      </main>')
        react_parts.append('    </div>')
        react_parts.append('  );')
        react_parts.append('}')
        react_parts.append('')
        react_parts.append('export default GeneratedUI;')
        
        return '\n'.join(react_parts)