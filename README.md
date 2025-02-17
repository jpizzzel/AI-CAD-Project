AI-Powered CAD Generator
This project is a full-stack application that uses AI to generate CAD models from user-provided text prompts. The generated CAD files can be downloaded and visualized directly on the page. It integrates Zoo.dev APIs for CAD generation and rendering, and uses React for the frontend and Node.js with Python for the backend.

Features
Generate CAD models from descriptive text prompts (e.g., "Design a gear with 40 teeth").
Download generated .step and .gltf files.
Real-time rendering of 3D models in the browser using Three.js.
Backend powered by Zoo.dev APIs for CAD operations.
WebSocket support for interactive 3D rendering.

Project Structure
project-root/
├── backend/                  # Backend server and API integration
│   ├── index.js              # Main backend entry point
│   ├── output/               # Folder for storing generated CAD files
│   ├── python/               # Python scripts for CAD generation
│   │   └── text_to_cad.py
│   └── package.json          # Backend dependencies
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/                  # React components and logic
│   │   ├── components/       # Individual UI components
│   │   │   └── ...
│   │   └── App.js            # Main React app logic
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Tailwind CSS configuration
├── python
│   ├── model_cache/          # where ai chat models are stored
│   ├── venv/                 # virtual environment
│   ├── aichat.py             # ai hugging face model
│   ├── requirements.txt      # dependencies
│   └── text_to_cad.py        # Cad generation
├── .gitignore                # Ignored files for the whole repo
└── README.md                 # Project documentation

Tech Stack

Frontend
React: UI framework.
Tailwind CSS: For responsive styling.
Three.js: 3D model rendering.

Backend
Node.js: Backend server for handling requests.
Express.js: REST API framework.
Python: CAD generation using Zoo.dev APIs.

API Integration
Zoo.dev APIs: Text-to-CAD generation and WebSocket rendering.

Setup Instructions
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-repo-name.git
cd project-root
2. Backend Setup
Navigate to the backend folder:
bash
Copy code
cd backend
Install dependencies:
bash
Copy code
npm install
Ensure Python and required libraries are installed:
bash
Copy code
pip install -r requirements.txt
Start the backend server:
bash
Copy code
node index.js
3. Frontend Setup
Navigate to the frontend folder:
bash
Copy code
cd ../frontend
Install dependencies:
bash
Copy code
npm install
Start the frontend server:
bash
Copy code
npm start
4. Access the Application
Frontend: http://localhost:3000
Backend: http://localhost:5000

How to Use
Enter a project idea (e.g., "Create a cube with 5 cm sides") into the text field on the frontend.
Submit the prompt to generate a CAD model.
Download the generated .step or .gltf files.
View the model directly in the 3D viewer.

Future Enhancements
Add support for editing CAD models in real-time.
Enable model sharing and collaboration.
Optimize WebSocket performance for smoother rendering.