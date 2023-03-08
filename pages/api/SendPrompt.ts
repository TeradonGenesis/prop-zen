const fetch = require("node-fetch");

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;

async function sendPrompt(assitantPrompt: string, prompt: string, data: string){
    let trimmedContent = '';
    const maxTokens = 4096
    const content = `${prompt}
    ${data}
    `;

    if(content.length > maxTokens){
        trimmedContent = content.substring(0, maxTokens);
    }else{
        trimmedContent = content
    }

    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system", 
                    "content": assitantPrompt
                    
                },
                {
                    "role": "user", 
                    "content": trimmedContent
                }]
        })
    });

    const resp = await response.json();
    console.log(resp);
    if(resp.choices && resp.choices.length){
        return resp.choices[0].message.content;
    }else{
        throw new Error("No data returned");
    }
}

export default sendPrompt;