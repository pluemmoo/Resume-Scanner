# Resume Scanner
Resume Scanner is a web application that analyzes resumes using an LLM (e.g., LLaMA 3.1 via Ollama) and provides insights such as:
- Suggested job positions
- Candidate strengths and weaknesses
- Skill distribution (visualized with a chart)
- Soft skills
- Professional summary
- Resume improvement suggestions per role

## Features
- 📎 Upload PDF resumes with Dropzone.js
- 🤖 LLM-powered resume analysis using Langchain + Ollama
- 📊 Skill distribution visualized using Chart.js
- 🧠 Soft skill and summary generation
- 🌓 Light/Dark theme toggle
- 📥 JSON report download + Re-scan capability

## Tech Stack
Frontend:
- Dropzone.js – File uploader
- Chart.js – Skill chart
- Vanilla JS + SCSS (with theme support)

Backend (Python):
- langchain_ollama – LLM interface
- PyPDF2 – PDF text extraction
- fastapi – Web API
- uvicorn – ASGI server

## Getting Started
1. Clone this repo
```
git clone https://github.com/your-username/Resume-Scanner.git
cd resume-scanner
```
2. Setup Python environment
```
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

3. Pull LLM from Ollama
```
ollama run llama3.1:8b-instruct-q5_1
```

4. Start the FastAPI backend
```
uvicorn backend.main:app --reload
```

5. Open the frontend

Just open index.html in your browser. (No server needed for frontend)

## Screenshot
<img src="Screenshot 2025-05-19 at 15.30.12.png">
<img src="Screenshot 2025-05-19 at 15.32.08.png">
