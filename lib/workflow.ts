import { findEvent, fetchReleaseHTML } from "./bls.ts";
import { tweetThread } from "./twitter.ts";
import { twitterSummary } from "./llama.ts";
import { extractSummary } from "./bls.ts";


export async function executeWorkflow(shouldTweet: boolean, mins: number) { 

    const event = await findEvent(mins);
    if (event === undefined) {
        console.log("No recent event found");
        return;
    }

    const releaseHTML = await fetchReleaseHTML(event);
    if (releaseHTML === undefined) {
        console.log("No news release found");
        return
    }

    const textSummary = extractSummary(releaseHTML);
    const tweetSummary = await twitterSummary(textSummary);
s
    const thread = [tweetSummary, "Generated with #AgenticAI using Llama-3.3-70B-Instruct serverless from @CentML_Inc"]
    if (shouldTweet) {
        await tweetThread(thread);
    } else {
        console.log("should tweet not set, not tweeting this:");
        console.log(thread);
    }
}