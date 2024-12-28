import { findEvent, fetchReleaseHTML } from "./bls.ts";
import { tweet } from "./twitter.ts";
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

    if (shouldTweet) {
        await tweet(tweetSummary);
    } else {
        console.log("-t flag not set, not tweeting this;");
        console.log(tweetSummary);
    }
}