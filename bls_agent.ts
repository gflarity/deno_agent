import { executeWorkflow } from "./lib/workflow.ts"

// Some BLS posting happen at 8:30 ET, so we should check at 8:31 ET
// Double up as an easy way to account for dailight savings time
// 8:31 ET in UTC 31 12 * * * or 31 13 * * *
Deno.cron("checkBLS 14 31", "31 12 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})
Deno.cron("checkBLS 13 31", "31 13 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})

// Some BLS posting happen at 10:00 ET, so we should check at 10:01 ET
// 10:01 ET in UTC 1 14 * * * or 1 15 * * *
Deno.cron("checkBLS 14 01", "1 14 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})
Deno.cron("checkBLS 15 01", "1 15 * * *", async () => {
    // TODO skip weekends
    executeWorkflow(true, 5)
})
