from langchain_ollama import ChatOllama
from PyPDF2 import PdfReader
import json

llm = ChatOllama(model="llama3.1:8b-instruct-q5_1")


def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    return "\n".join(
        [page.extract_text() for page in reader.pages if page.extract_text()]
    )


def analyze_resume(file_path):
    resume_text = extract_text_from_pdf(file_path)

    prompt = f"""
    You are a professional resume evaluator.

    Given the resume below, do the following:

    1. Suggest 2–3 job positions that best match the resume.
    2. List 3 strengths evident from the resume.
    3. List 3 weaknesses or areas for improvement.
    4. For each suggested job position, give 2 specific suggestions on how to improve the resume to better fit that role.
    5. Estimate a skill distribution summary: assign percentage values (total 100%) to 4–6 skill categories that reflect the focus of the resume. Examples: Communication, Data Analysis, Leadership, Project Management, Technical Skills, Language Skills.
    6. Identify 3–4 soft skills or personality traits evident from the resume, such as teamwork, adaptability, attention to detail, time management, etc.
    7. Write a 1–2 sentence professional summary of the candidate, highlighting their key value, focus areas, and working style. Make it concise and suitable for a "Candidate Profile" section.

    Respond ONLY in **valid JSON format** exactly like this:

    {{
    "positions": ["Position A", "Position B", "Position C"],
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "improvement_suggestions": {{
        "Position A": ["Suggestion 1", "Suggestion 2"],
        "Position B": ["Suggestion 1", "Suggestion 2"]
    }},
    "skill_distribution": {{
        "Skill A": 25,
        "Skill B": 25,
        "Skill C": 20,
        "Skill D": 15,
        "Skill E": 15
    }},
    "soft_skills": ["Soft Skill 1", "Soft Skill 2", "Soft Skill 3"],
    "profile_summary": "A concise summary of the candidate’s profile goes here."
    }}

    Do not include any explanation, notes, markdown, headings, or natural language before or after the JSON.
    Only return a single valid JSON object.

    Resume:
    \"\"\"
    {resume_text}
    \"\"\"
    """

    response = llm.predict(prompt)
    print("🔍 Raw LLM Output:", response)  # Add this line

    # Try to parse model output as JSON
    try:
        json_start = response.index("{")
        json_text = response[json_start:]
        return json.loads(json_text)
    except Exception as e:
        return {
            "positions": ["Could not parse response"],
            "strengths": [],
            "weaknesses": [],
            "soft_skills": [],
            "profile_summary": [],
        }
