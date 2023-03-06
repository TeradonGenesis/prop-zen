const fetch = require("node-fetch");

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

async function sendPrompt(assitantPrompt: string, prompt: string, data: string){
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
                    "content": 
                    `${assitantPrompt}`
                    
                },
                {
                    "role": "user", 
                    "content": 
                    `${prompt}

                    ${data}
                    `
                }]
        })
    });

    const resp = await response.json();
    if(resp.choices && resp.choices.length){
        return resp.choices[0].messages.content;
    }else{
        throw new Error("No data returned");
    }
}

export default sendPrompt;