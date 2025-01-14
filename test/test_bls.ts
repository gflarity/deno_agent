import { executeWorkflow } from "../lib/workflow.ts";

async function main() {
    const shouldTweet = Deno.args.includes('-t');
    await executeWorkflow(shouldTweet,24*60*7)    
}

main()

