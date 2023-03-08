import { useState } from "react";
import scrapping from "../api/CallScrapper";
import searchProp from "../api/SearchProp";
import sendPrompt from "../api/SendPrompt";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faSearch);

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const submit = async () => {

        try {
            let errMsg = '';
            let posts = '';
            let url = '';
            if (query) {
                setSummary("");
                setMessage("Running property search...");
                await searchProp(query)
                    .then((resp) => { url = resp })
                    .catch((err) => { errMsg = err });
            }


            if (url) {
                setMessage("Running posts scrapper...");
                await scrapping(url)
                    .then((resp) => { posts = resp })
                    .catch((err) => { errMsg = err });
            }

            if (posts) {
                setMessage("Running summarizer and sentiment analysis...");
                await sendPrompt("You are a summarizer and sentiment analyzer tasked with analyzing forum posts about a property's location. Your job is to read through the forum posts and provide a summary of the key points made by users, as well as highlight the positive and negative aspects of the property's location. You should also provide a sentiment analysis of the posts, indicating whether users generally have a positive or negative view of the location. Your analysis will be used by a property buyer to inform their decision on whether to invest in the property.", 
                "Your task is to provide a summary and sentiment analysis of forum posts related to a property, with the aim of informing decision-making.", posts)
                    .then((respSummary) => {
                        setMessage("");
                        setSummary(respSummary);
                    })
                    .catch((err) => { errMsg = err });
            }

            if (errMsg) {
                setMessage("");
                throw new Error(errMsg);
            }

        } catch (e) {
            if (typeof e === "string") {
                setError(e.toUpperCase());
            } else if (e instanceof Error) {
                setError(e.message);
                setMessage('');
            }
        }

    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (error) {
            setError('');
        }
        submit();
    }

    return (
        <section className="px-2">
            <div className="flex justify-center">
                <div className="mb-3 xl:3/4">
                    <div className="text-center">
                        <h2 className="mt-0 mb-2 text-4xl font-medium leading-tight text-primary">
                            PropVibes
                        </h2>
                        <p>Get the Property Vibes! - Hear what they are saying in Lowyat!</p>
                    </div>
                    <br />
                    <div className="searchBar">
                        <form onSubmit={handleSubmit} className="relative mb-4 flex w-full flex-wrap items-stretch">
                            <input
                                type="text"
                                id="query"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                className="bg-white relative m-0 block w-[1%] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary-600 focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                                placeholder="Enter your lowyat property name here"
                                aria-label="Search"
                                aria-describedby="button-addon2" required />
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
                    </div>
                </div>
            </div>
            {message && (
                <div>
                    <h2>Process is running...</h2>
                    <br />
                    <p>{message}</p>
                </div>
            )}

            {error && (
                <div>
                    <h2>Error message</h2>
                    <br />
                    <p>{error}</p>
                </div>
            )}
            {summary && (
                <div className="border border-gray-300 p-6 rounded-lg bg-gray-100 max-w-xl">
                    <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                        <FontAwesomeIcon icon={faComment} />
                    </div>
                    <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Summary and Sentiment</h2>
                    <p className="leading-relaxed text-base">{summary}</p>
                </div>
            )}

        </section>
    );
}

export default SearchBox;