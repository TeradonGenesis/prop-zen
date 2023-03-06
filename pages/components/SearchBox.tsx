import { useState } from "react";
import scrapping from "../api/Scrapper";
import sendPrompt from "../api/SendPrompt";

const SearchBox = () => {

    const [query, setQuery] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const submit = () => {
        var errMsg: string = '';
        var posts: string = '';
        scrapping(query).then((posts) => posts);
        if(posts.length > 0){
            sendPrompt("You are a summarizer and sentiment analyser to analyse the posts about a property's location", "Summarize and run sentiment analysis on these property posts", posts)
            .then((respSummary) => {setSummary(respSummary)})
            .catch((err) => {errMsg = err});
        }else{
            errMsg = "Scrapper fail to scrap";
        }
        if(errMsg){
            setError(errMsg);
        }
    }

    const handleSubmit = (event: { preventDefault: () => void; }) =>{
        event.preventDefault();
        submit();
    }

    return (
        <div className="flex justify-center">
            <div className="mb-3 xl:w-96">
                <form onSubmit={handleSubmit} className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <input
                    type="text"
                    id="query"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="bg-white relative m-0 block w-[1%] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary-600 focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                    placeholder="Enter your lowyat property link here"
                    aria-label="Search"
                    aria-describedby="button-addon2" required/>
                    <span
                        className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                        id="basic-addon2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5">
                            <path
                                
                                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                 />
                        </svg>
                    </span>
                </form>

                {error && (
                    <div>
                        <h2>Error message</h2>
                        <p>{error}</p>
                    </div>
                )}

                {summary && (
                    <div>
                        <h2>Summary of the property</h2>
                        <p>{summary}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBox;