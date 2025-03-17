import { executeWorkflow } from "./lib/workflow.ts"


// Some BLS posting happen at 9:30 ET, so we should check at 9:31 ET
// Double up as an easy way to account for dailight savings time
// 8:31 ET in UTC 31 13 * * * or 31 14 * * * (when daylight savings time is in effect)
Deno.cron("checkBLS 13 31", "31 13 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})
Deno.cron("checkBLS 13 31", "31 14 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})

// Some BLS posting happen at 10:00 ET, so we should check at 10:01 ET
// 10:01 ET in UTC 1 15 * * * or 1 16 * * * (when daylight savings time is in effect)
Deno.cron("checkBLS 15 01", "1 15 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})
Deno.cron("checkBLS 15 01", "1 16 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})
