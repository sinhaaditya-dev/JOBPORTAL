const ai = require('../config/gemini')
const analyzeResume = async (resumeText) => {

    // Step 1
    // Create Prompt
    const prompt = `You are an expert ATS Resume Analyzer and HR Recruiter.

                    Analyze the following resume.

                    Return ONLY valid JSON.

                    Resume:

                    ${resumeText}

                Response Format:

                    {
                        "atsScore": 0,
                        "summary": "",
                        "skills": [],
                        "missingSkills": [],
                        "strengths": [],
                        "weaknesses": [],
                        "recommendations": []
                    }`;

    // Step 2
    // Send Prompt To Gemini
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents:prompt
    });

    // Step 3
    // Get Response 
    //gemini send object response but we need only text that's why we convert response into text
    const result = response.text;

    // Step 4
    // Convert Into JSON
    //Response will come in the form of string,so we convert into JSON
    //String -> object because frontend requires object 
    const aiReport = JSON.parse(result);
    // Step 5
    // Return
    return aiReport;

}

module.exports = {
    analyzeResume
};