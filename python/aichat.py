from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import sys
import json
import os

class AIChat:
    def __init__(self):
        try:
            # Create/use a local cache directory for the model
            cache_dir = os.path.join(os.path.dirname(__file__), 'model_cache')
            os.makedirs(cache_dir, exist_ok=True)
            
            # For quick testing, use a small model like "distilgpt2"
            self.model_name = "distilgpt2"
            print("Loading AI model and tokenizer...", file=sys.stderr)
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                cache_dir=cache_dir,
                local_files_only=False
            )
            # Set pad token if not provided to avoid attention_mask warnings
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token

            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float32,
                device_map=None,
                cache_dir=cache_dir,
                local_files_only=False
            ).to(torch.device('cpu'))
            
            print("AI Chat initialized successfully", file=sys.stderr)
        except Exception as e:
            print(f"Error initializing model: {e}", file=sys.stderr)
            import traceback
            print(traceback.format_exc(), file=sys.stderr)
            self.model = None
            self.tokenizer = None

    def get_response(self, message):
        if not self.model or not self.tokenizer:
            return {'error': 'AI Chat not properly initialized'}

        try:
            # Prepare input using the tokenizer
            inputs = self.tokenizer(message, return_tensors="pt", max_length=512, truncation=True)
            inputs = {k: v.to('cpu') for k, v in inputs.items()}
            
            # Generate response (use torch.no_grad() for inference)
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs["input_ids"],
                    max_length=150,  # Keeping it short for faster responses
                    num_return_sequences=1,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            response_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return {'response': response_text}
        except Exception as e:
            print(f"Error generating response: {e}", file=sys.stderr)
            return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No message provided'}))
        sys.exit(1)
        
    chat = AIChat()
    message = sys.argv[1]
    response = chat.get_response(message)
    print(json.dumps(response))