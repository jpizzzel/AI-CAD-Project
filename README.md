AI-Powered CAD Generator
This project is a full-stack application that uses AI to generate CAD models from user-provided text prompts. The generated CAD files can be downloaded and visualized directly on the page. It integrates Zoo.dev APIs for CAD generation and rendering, and uses React for the frontend and Node.js with Python for the backend.

Features
Generate CAD models from descriptive text prompts (e.g., "Design a gear with 40 teeth").
Download generated .step and .gltf files.
Real-time rendering of 3D models in the browser using Three.js.
Backend powered by Zoo.dev APIs for CAD operations.

Tech Stack

Frontend
React: UI framework.
Tailwind CSS: For responsive styling.
Three.js: 3D model rendering.

Backend
Node.js: Backend server for handling requests.
Express.js: REST API framework.
Python: CAD generation using Zoo.dev APIs.

API Integration:
Zoo.dev APIs: Text-to-CAD generation,
Hugging Face: AI Chat bot 

Setup Instructions
1. Clone the Repository
bash
Copy code
git clone https://github.com/jpizzzel/AI-CAD-Project
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
Then set proper Zoo.dev and Hugging Face API keys in .env

4. Frontend Setup
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
5. Access the Application
Frontend: http://localhost:3000
Backend: http://localhost:3001

How to Use
Enter a project idea (e.g., "Create a cube with 5 cm sides") into the text field on the frontend.
Submit the prompt to generate a CAD model.
Download the generated .step or .gltf files.
View the model directly in the 3D viewer.

Future Enhancements
Add support for editing CAD models in real-time.
Enable model sharing and collaboration.
Optimize performance for smoother rendering.
