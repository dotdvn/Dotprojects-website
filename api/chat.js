export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'SERVER ERROR: GEMINI_API_KEY is missing.' });
        }

        // Define a strict system instruction to keep the AI in character
        const systemPrompt = `You are DOT AI, the intelligent virtual assistant for DOT PROJECTS. 
DOT PROJECTS is an engineering and design studio specializing in Intelligent Hardware, IoT solutions, and Automation.
Keep your responses very concise, professional, slightly technical, and perfectly formatted. Do not use emojis. Use a brutalist, robotic tone.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: {
                            text: systemPrompt
                        }
                    },
                    contents: [{
                        parts: [{ text: message }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 250,
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(500).json({ error: 'Failed to communicate with AI core.' });
        }

        const reply = data.candidates[0]?.content?.parts[0]?.text || "ERROR: NO RESPONSE DETECTED.";
        
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
