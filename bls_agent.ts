import { executeWorkflow } from "./lib/workflow.ts";

// TODO account for Daylight Saving Time later
// 8:31 ET in UTC 31 13 * * *
// 10:01 ET in UTC 1 15 * * *
Deno.cron("checkBLS 13 31", "31 13 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5);
}); 


Deno.cron("checkBLS 15 01", "1 15 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5);
}); 

Deno.cron("every five minutes for catch up", "*/5 * * * *", async () => {
    // in the last 6 hours for catch up
    executeWorkflow(true, 6*60);
}); 
