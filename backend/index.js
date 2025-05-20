let myDropzone = new Dropzone("#my-awesome-dropzone", {
    paramName: "resume",
    autoProcessQueue: false,
    maxFiles: 1,
    dictDefaultMessage: "📄 Drop your resume here or click to upload",
});

document.getElementById("submitResume").addEventListener("click", function () {
    myDropzone.processQueue();
});

let skillChart; // global for reuse
let lastUploadedFile = null;
let lastLLMResponse = null;


myDropzone.on("success", async function (file, response) {
    lastUploadedFile = file;
    lastLLMResponse = response;
    renderResults(response);
});

const suggestionsContainer = document.getElementById("suggestionsBox");
const suggestionsbutton = document.getElementById("suggestionsTab");

suggestionsbutton.addEventListener("click", function () {
    suggestionsContainer.classList.toggle("suggestionsBox-hidden");
    suggestionsbutton.classList.toggle("active");
})

document.getElementById("reScanTab").addEventListener("click", function () {
    if (!lastUploadedFile) {
        alert("Please upload a resume first.");
        return;
    }

    // Wrap the Dropzone file into a File object (to ensure it's form-compatible)
    const fileToResend = new File([lastUploadedFile], lastUploadedFile.name, {
        type: lastUploadedFile.type
    });

    const formData = new FormData();
    formData.append("resume", fileToResend);

    fetch("http://localhost:8000/analyze-resume/", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(response => {
            // Manually trigger rendering logic again
            renderResults(response); 
        })
        .catch(error => {
            console.error("Error re-scanning resume:", error);
        });
});

function renderResults(response) {
    const resultscontainer = document.querySelector(".results-layout")
    resultscontainer.classList.remove("results-hidden")


    // Clear previous values
    document.getElementById("positions").innerHTML = "";
    document.getElementById("strengths").innerHTML = "";
    document.getElementById("weaknesses").innerHTML = "";
    document.getElementById("softSkills").innerHTML = "";
    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("profileSummary").innerHTML = "";

    // Render positions
    if (response.positions) {
        document.getElementById("positions").innerHTML =
            response.positions.map(p => `<li>${p}</li>`).join("");
    }

    // Render strengths
    if (response.strengths) {
        document.getElementById("strengths").innerHTML =
            response.strengths.map(s => `<li>${s}</li>`).join("");
    }

    // Render weaknesses
    if (response.weaknesses) {
        document.getElementById("weaknesses").innerHTML =
            response.weaknesses.map(w => `<li>${w}</li>`).join("");
    }

    // Render soft skills
    if (response.soft_skills) {
        document.getElementById("softSkills").innerHTML =
            response.soft_skills.map(soft => `<li>${soft}</li>`).join("");
    }

    if (response.profile_summary) {
        document.getElementById("profileSummary").innerHTML = `${response.profile_summary}`;
    }

    // Render improvement suggestions
    if (response.improvement_suggestions) {
        const suggestionsContainer = document.getElementById("suggestions");
        for (const role in response.improvement_suggestions) {
            const roleHeader = document.createElement("h3");
            roleHeader.textContent = role;
            suggestionsContainer.appendChild(roleHeader);

            const ul = document.createElement("ul");
            response.improvement_suggestions[role].forEach(suggestion => {
                const li = document.createElement("li");
                li.textContent = suggestion;
                ul.appendChild(li);
            });

            suggestionsContainer.appendChild(ul);
        }
    }

    // Render skill distribution chart
    if (response.skill_distribution && document.getElementById("skillChart")) {
        const ctx = document.getElementById("skillChart").getContext("2d");

        // Destroy old chart if exists
        if (skillChart) {
            skillChart.destroy();
        }

        const labels = Object.keys(response.skill_distribution);
        const data = Object.values(response.skill_distribution);

        skillChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    label: "Skill Focus (%)",
                    data: data,
                    backgroundColor: [
                        "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6"
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                },
            }
        });
    }

}

document.getElementById("downloadReportTab").addEventListener("click", function () {
    if (!lastLLMResponse) {
        alert("Please upload a resume first.");
        return;
    }

    const jsonBlob = new Blob([JSON.stringify(lastLLMResponse, null, 2)], {
        type: "application/json"
    });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(jsonBlob);
    downloadLink.download = "resume_analysis.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

const themeButton = document.getElementById("themeTab");

themeButton.addEventListener("click", () => {
    const body = document.body;

    // Toggle between themes
    if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        themeButton.textContent = "☀️ Light Theme";
    } else {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        themeButton.textContent = "🌙 Dark Theme";
    }
});