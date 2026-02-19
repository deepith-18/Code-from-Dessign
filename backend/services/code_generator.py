import base64
import json
import logging
import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class CodeGenerator:
    def __init__(self):
        self.token = os.getenv("HF_TOKEN")
        if not self.token:
            raise ValueError("HF_TOKEN not found in environment variables")

        self.client = InferenceClient(api_key=self.token)
        self.model = "Qwen/Qwen2.5-VL-7B-Instruct"

    def generate(self, image_path, elements=None):
        try:
            logger.info("Generating UI code using Qwen2.5-VL...")

            # Encode image
            with open(image_path, "rb") as f:
                base64_image = base64.b64encode(f.read()).decode("utf-8")

            prompt = """
You are a senior frontend engineer specialized in pixel-accurate UI reconstruction.

Analyze the provided UI image carefully.

STRICT REQUIREMENTS:
1. Output ONLY valid JSON.
2. JSON must contain EXACTLY:
{
  "html": "pure semantic HTML with class names only",
  "css": "complete CSS styling for the HTML",
  "react": "complete React functional component using same structure and CSS classes"
}
3. Do NOT use Tailwind.
4. Do NOT use inline styles.
5. Do NOT use explanations.
6. Preserve layout hierarchy exactly.
7. Extract all visible text exactly.
8. Use proper spacing, alignment, and typography.
9. Use modern CSS (flexbox or grid).

Return only the JSON.
"""


            response = self.client.chat_completion(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{base64_image}"
                                },
                            },
                        ],
                    }
                ],
                max_tokens=3000,
                temperature=0.1,
                top_p=0.9,
            )

            raw_output = response.choices[0].message.content.strip()

            # Clean possible formatting issues
            if raw_output.startswith("```"):
                raw_output = raw_output.strip("```")
            if raw_output.startswith("json"):
                raw_output = raw_output[4:]

            try:
                parsed = json.loads(raw_output)
            except json.JSONDecodeError:
                logger.warning("Model returned invalid JSON. Falling back.")
                parsed = {
                    "html": "",
                    "css": "",
                    "react": raw_output,
                }

            return parsed

        except Exception as e:
            logger.error(f"Code generation failed: {str(e)}")
            return {
                "html": "",
                "css": "",
                "react": "",
                "error": str(e),
            }
