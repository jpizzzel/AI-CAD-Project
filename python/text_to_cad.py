import time
import sys
import json
import os
from kittycad.api.ml import create_text_to_cad, get_text_to_cad_model_for_user
from kittycad.client import ClientFromEnv
from kittycad.models import (
    ApiCallStatus,
    Error,
    FileExportFormat,
    TextToCad,
    TextToCadCreateBody,
)
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file
api_token = os.getenv('KITTYCAD_API_TOKEN')

# Create our client
client = ClientFromEnv()

def sanitize_filename(name):
    """Sanitize the prompt to create a safe filename."""
    return "_".join(name.strip().split()).replace("/", "-").replace("\\", "-")

def generate_cad(prompt):
    debug_logs = {}  # collect debug info
    # Log the current working directory
    current_dir = os.getcwd()
    debug_logs["working_directory"] = current_dir

    if not prompt.strip():
        debug_logs["error"] = "Empty prompt received."
        print(json.dumps(debug_logs))
        return {"status": "error", "message": "Empty prompt received."}
    
    # Use an absolute path for the output directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, "model.gltf")
    debug_logs["output_file"] = output_file

    try:
        # Submit the prompt to generate a 3D model
        response = create_text_to_cad.sync(
            client=client,
            output_format=FileExportFormat.STEP,
            body=TextToCadCreateBody(
                prompt=prompt,
            ),
        )

        if isinstance(response, Error) or response is None:
            return {"status": "error", "message": str(response)}

        result: TextToCad = response

        # Polling to check if the task is complete
        while result.completed_at is None:
            time.sleep(5)
            response = get_text_to_cad_model_for_user.sync(client=client, id=result.id)
            if isinstance(response, Error) or response is None:
                return {"status": "error", "message": str(response)}
            result = response

        if result.status == ApiCallStatus.FAILED:
            return {"status": "failed", "message": result.error}

        elif result.status == ApiCallStatus.COMPLETED:
            if result.outputs is None:
                return {"status": "error", "message": "No files were returned."}

            # Save files
            output_files = {}
            base_filename = sanitize_filename(prompt)
            output_dir = "./output"
            os.makedirs(output_dir, exist_ok=True)

            for name, file_data in result.outputs.items():
                extension = name.split('.')[-1]
                unique_filename = base_filename
                counter = 1
                output_file = os.path.join(output_dir, f"{unique_filename}.{extension}")

                # Ensure we do not overwrite existing files
                while os.path.exists(output_file):
                    unique_filename = f"{base_filename}_{counter}"
                    output_file = os.path.join(output_dir, f"{unique_filename}.{extension}")
                    counter += 1

                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(file_data.decode("utf-8"))
                output_files[name] = output_file

            return {"status": "completed", "files": output_files}

    except Exception as e:
        debug_logs["write_exception"] = str(e)
        print(json.dumps(debug_logs))
        return {"status": "error", "message": str(e)}
    
    # Print out debug logs to stderr (or stdout) 
    print(json.dumps(debug_logs))  # This helps capture environment details in the log.
    return {
        "status": "completed",
        "files": {
            "model.gltf": output_file
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No prompt provided."}))
        sys.exit(1)
    
    prompt = sys.argv[1]
    result = generate_cad(prompt)
    # Make sure to output only valid JSON (avoid extra prints)
    print(json.dumps(result))
