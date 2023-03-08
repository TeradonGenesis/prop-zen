async function scrapping(propSearch: string){
    const pattern = /\/topic\/(\d+)/;
    const match = propSearch.match(pattern);
    if (match) {
        const topicId = match[1];
        const scrapperEndpoint = `http://localhost:4001/topic/${topicId}`
        const result = await fetch(`${scrapperEndpoint}`);
        const res = await result.json();
        if(res.aggPost){
            return res.aggPost;
        }else{
            throw new Error("Failed to receive response from scrapper");
        }
    }else{
        throw new Error("Failed to get the topic id");
    }
}

export default scrapping;