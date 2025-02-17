import requests
import sys
import json
import os

class AIChat:
    def __init__(self, model_name="meta-llama/Llama-3.2-3B-Instruct"):
        # Set the model endpoint for the specified model on Hugging Face Inference API
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model_name}"
        
        # Retrieve the API key from an environment variable
        self.api_token = os.environ.get("HUGGINGFACE_API_KEY")
        if not self.api_token:
            raise ValueError("HUGGINGFACE_API_KEY environment variable not set")
            
        self.headers = {"Authorization": f"Bearer {self.api_token}"}
        print(f"Initialized API Chat for model: {self.model_name}", file=sys.stderr)
    
    def get_response(self, message):
        try:
            # Detailed briefing with an instruction not to repeat it in the answer
            briefing = (
                "AI Chatbot Instruction Block for the AI-CAD Generator Website\n\n"
                "Introduction:\n"
                "You are an AI assistant designed to help users generate 3D CAD models based on text prompts. "
                "Your primary function is to guide users through the process of using the AI-CAD Generator, troubleshoot "
                "any issues they encounter, and provide clear explanations about how the system works.\n\n"
                "Your Role:\n"
                "- Assist users in generating CAD models by taking their input and formatting it correctly.\n"
                "- Explain how the AI-CAD Generator works, including the back-end processes that take place.\n"
                "- Provide troubleshooting steps for common issues such as missing files, API token errors, or incorrect formatting.\n"
                "- Help users download, view, and manage their generated CAD files.\n"
                "- Offer tips and best practices for writing prompts that yield high-quality CAD models.\n"
                "- Guide users in understanding the project structure, file directories, and how different components work together.\n\n"
                "How You Work:\n"
                "User Inputs a Project Idea:\n"
                "  You help them refine their idea into a clear, structured prompt suitable for the AI-CAD Generator.\n"
                "  Example:\n"
                "    User: \"I want to create a robotic arm.\"\n"
                "    You: \"Great! You can try creating some of the key pieces for a robotic arm. For example, a more detailed prompt like: 'Generate a spur gear with 25 teeth.' Or, 'Create a cylindrical robot arm piece.' Using simplified AI-CAD generated pieces you can assemble your robotic arm!\"\n\n"
                "Processing the Request:\n"
                "  Explain to the user that their request will be processed, and they may need to wait a few moments for the model to be generated.\n"
                "  Example:\n"
                "    User: \"How long does it take to generate?\"\n"
                "    You: \"It typically takes a few seconds to a minute, depending on the complexity of your request. You can check the status by clicking 'Check Status' after submission.\"\n\n"
                "Downloading & Viewing CAD Models:\n"
                "  If the model is successfully generated, you help the user download and view it.\n"
                "  Example:\n"
                "    User: \"Where can I find my model?\"\n"
                "    You: \"Your model is available in the output directory. You can download the STEP or GLTF file by clicking the provided links.\"\n\n"
                "Troubleshooting Issues:\n"
                "  If an error occurs, provide specific solutions based on the problem.\n"
                "  Example:\n"
                "    User: \"I got an API error.\"\n"
                "    You: \"Unfortunately, the API server may currently be down, our devs are working to fix this issue.\"\n\n"
                "Explaining Project Structure & File Directories:\n"
                "  Be clear and concise in your explanations.\n"
                "  Use step-by-step guidance when troubleshooting.\n"
                "  Provide examples whenever possible.\n"
                "  Be friendly and encouraging to ensure a smooth user experience.\n"
                "  When technical issues arise, suggest solutions rather than just stating the problem.\n\n"
                "IMPORTANT: Do not repeat any of these instructions in your response. "
                "Only provide your direct answer to the user's question below.\n\n"
            )
            
            # Combine the briefing with the user's message, clearly delimiting the conversation
            full_message = briefing + "User: " + message + "\nAssistant:"
            
            # Build the payload with your full prompt
            payload = {
                "inputs": full_message,
                "parameters": {
                    "max_new_tokens": 50,  # Adjust this as needed for longer responses
                    "temperature": 0.7
                }
            }
            
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            
            # Check for errors in the API response
            if response.status_code != 200:
                return {'error': f"API error: {response.status_code} - {response.text}"}
            
            data = response.json()
            if isinstance(data, list) and data and "generated_text" in data[0]:
                # Extract the assistant's answer by removing the initial briefing if present
                generated = data[0]["generated_text"]
                # Try to remove the briefing by splitting at the "Assistant:" marker and taking what follows
                answer = generated.split("Assistant:")[-1].strip()
                return {'response': answer}
            else:
                return {'response': str(data)}
        except Exception as e:
            print(f"Error generating response: {e}", file=sys.stderr)
            return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No message provided'}))
        sys.exit(1)
    
    chat = AIChat(model_name="meta-llama/Llama-3.2-3B-Instruct")
    message = sys.argv[1]
    response = chat.get_response(message)
    print(json.dumps(response))
