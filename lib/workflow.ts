import { findEvents, fetchReleaseHTML } from "./bls.ts";
import { tweetThread } from "./twitter.ts";
import { twitterSummary } from "./llama.ts";
import { extractSummary } from "./bls.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";

export async function executeWorkflow(shouldTweet: boolean, mins: number) { 
    const events = await findEvents(mins);    
    if (events.length === 0) {
        console.log("No recent events found");
        return;
    }

    for (const event of events) {
        const releaseHTML = await fetchReleaseHTML(event);
        if (releaseHTML === undefined) {
            console.log("No news release found for event", event.summary);
            continue
        }

        const textSummary = extractSummary(releaseHTML);

        const tweetSummary = await twitterSummary(textSummary);   
        const thread = [tweetSummary, "Generated with #AgenticAI using Llama-3.3-70B-Instruct serverless from @CentML_Inc"]

        if (shouldTweet) {
            await tweetThread(thread);
            await sleep(15); // Sleep for 15 seconds between threads
        } else {
            console.log("should tweet not set, not tweeting this:");
            console.log(thread);
        }
    }
}