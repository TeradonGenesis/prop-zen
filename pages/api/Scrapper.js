const cheerio = require('cheerio');

async function scrapping(propSearch){
    const result = await fetch(`${propSearch}`, {
        method: "GET",
        headers: {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    });
    const html = await result.text();
    const $ = cheerio.load(html);
    console.log(html);
    var total = (+$(".pagelink").first().text().replace(" Pages", "")) * 20;

    let posts = [];
    let comments = '';
    if(total > 0){
        for(var i = 0; i < 5 ; i++){
            var num = (total -= 20);
            var url = `${propSearch}/+${num}`;
            const result = await fetch(`${url}`, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
            }
            });
            const html = await result.text();
            const $ = cheerio.load(html);
            $('.post_text').each(function (i, elem) {
                // Range Name
                posts.push($(elem).text().trim());
            });
        }
    }
    if(posts.length){
        comments = posts.join();
    }
    return comments;
}

export default scrapping;