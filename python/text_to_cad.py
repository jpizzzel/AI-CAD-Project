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

# Create our client
client = ClientFromEnv()

def sanitize_filename(name):
    """Sanitize the prompt to create a safe filename."""
    return "_".join(name.strip().split()).replace("/", "-").replace("\\", "-")

def generate_cad(prompt):
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

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No prompt provided"}))
        sys.exit(1)

    prompt = sys.argv[1]
    result = generate_cad(prompt)
    print(json.dumps(result))
