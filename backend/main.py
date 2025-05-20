from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from llama_utils import analyze_resume
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # not recommended in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/analyze-resume")
async def analyze_resume_endpoint(resume: UploadFile):
    data = await resume.read()
    file_location = f"temp/{resume.filename}"
    os.makedirs("temp", exist_ok=True)
    with open(file_location, "wb") as f:
        f.write(data)

    results = analyze_resume(file_location)
    return results