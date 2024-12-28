import { executeWorkflow } from "./lib/workflow.ts";

// TODO account for Daylight Saving Time later
// 8:31 ET in UTC 31 13 * * *
// 10:01 ET in UTC 1 15 * * *
Deno.cron("checkBLS", "* * * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5);
}); 
