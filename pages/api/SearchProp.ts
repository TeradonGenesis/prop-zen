async function searchProp(property: string){
    const propData =  Buffer.from(`${property} lowyat`, 'utf8').toString('base64');
    const scrapperEndpoint = `http://localhost:4001/search`
    const result = await fetch(`${scrapperEndpoint}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            "propSearch": propData,
        })
    });
    const res = await result.json();
    if(res.url){
        return res.url;
    }else{
        throw new Error("Failed to receive response from scrapper")
    }
}

export default searchProp;