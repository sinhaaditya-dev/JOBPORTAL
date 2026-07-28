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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    // Step 3
    // Get Response 
    //gemini send object response but we need only text that's why we convert response into text
    const result = response.text;

    // Step 4
    // Convert Into JSON
    //Response will come in the form of string,so we convert into JSON
    //String -> object because frontend requires object 
    const cleanResult = result.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    let aiReport;
    try {
        aiReport = JSON.parse(cleanResult);
    } catch (error) {
        console.error("Failed to parse Gemini JSON response:", error);
        // Fallback structure
        aiReport = {
            atsScore: 70,
            summary: "Unable to analyze thoroughly due to a processing error. Please review manually.",
            skills: [],
            missingSkills: [],
            strengths: [],
            weaknesses: [],
            recommendations: ["Ensure your resume is cleanly formatted and easy for ATS systems to parse."]
        };
    }
    // Step 5
    // Return
    return aiReport;

}

const generateAIRejectionFeedback = async (jobTitle, jobDescription, candidateName, candidateSkills, candidateMissingSkills) => {
    const prompt = `You are an expert HR Recruiter and Career Advisor.
                    The candidate "${candidateName}" has applied for the job "${jobTitle}".
                    Job Description: "${jobDescription}"
                    Candidate's Skills: "${candidateSkills.join(", ") || 'Not specified'}"
                    Missing Skills or areas of improvement: "${candidateMissingSkills.join(", ") || 'Not specified'}"
                    
                    Please write a polite, professional, encouraging, and constructive rejection feedback (around 80-120 words). 
                    Acknowledge their application and their strengths (based on their skills), then politely explain what skills or qualifications they lack relative to the job requirements (highlighting ${candidateMissingSkills.join(", ") || 'required stack details'} if relevant). 
                    Provide advice on what they can improve to be a better fit in the future.
                    
                    Format the output directly as raw text that can be copied/pasted into a rejection letter. Do not include markdown code block syntax (like \`\`\`), do not include subject line or header, just start directly with the greeting or feedback message.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text.trim();
}

module.exports = {
    analyzeResume,
    generateAIRejectionFeedback
};