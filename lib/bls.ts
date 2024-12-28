import { icsCalendarToObject, VEvent } from "https://esm.sh/ts-ics@1.6.5"
import { DOMParser } from "jsr:@b-fuze/deno-dom";

// Fetch the BLS calendar and return all events
export async function getAllEvents(): Promise<VEvent[]> {

    const response = await fetch("https://www.bls.gov/schedule/news_release/bls.ics")
    const text = await response.text()
    const cal = icsCalendarToObject(text);
    if (cal?.events === undefined) {
        console.error("No events found in calendar");
        return []
    }
    return cal.events!;
}

// Calculate the age of a date in minutes
export function ageInMins(date: Date): number {
   return (Date.now() - date.getTime()) / (60 * 1000);
}


// Find the most recent event that happened within the last mins minutes
export async function findEvent(mins: number): Promise<VEvent | undefined> {
    const events = await getAllEvents();
    for (const event of events) {
        const start = event.start.date
        // if start was within the last mins minutes
        const age = ageInMins(start)
        if (age < mins && age > 0) {
            console.log(`Publising event within the last ${mins} minutes: ${event.summary}`);
            return event
        }
        if (start.getTime() > (Date.now() - mins * 60 * 1000) && start.getTime() < Date.now()) {
            console.log(`Publising event within the last ${mins} minutes: ${event.summary}`);
            return event
           
        } 
    }
    return undefined
}

// Fetch the HTML for the release of the event
export async function fetchReleaseHTML(event: VEvent): Promise<string | undefined> {
    const summary = event.summary.trim()
    const url = eventMappings.get(summary);
    if (url === undefined) {
        console.error(`No mapping for event: ${summary}`);
        return undefined;
    }
    const response = await fetch(url);
    const html = await response.text();
    return html;
}

// Extract the summary from the HTML
export function extractSummary(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html")
    if (doc === null) {
        throw new Error("Failed to parse document")
    }   
    const pre = doc.querySelector("pre");
    if (pre === null) {
        throw new Error("No pre found in document, couldn't parse document");
    }
    const summary = pre.textContent;

    // The initial summary ends with "_____________", want everything before it
    const idx = summary.indexOf("__________");
    return idx === -1 ? summary : summary.slice(0, idx)   
}

// Mapping of event.summary to URLs
const eventMappings = new Map<string, string>([
    // can search for with work summary to get it from google (usually) add nr0 to help
    // perplexity seems to work...

    // using their own search definitely works better with nr0 added: 
    // nr0 https://data.bls.gov/search/query/results?q=County+Employment+and+Wages+nr0
    // https://data.bls.gov/search/query/results?q=
    // it's just google with a site filter I thiunk lol
    ["State Job Openings and Labor Turnover", "https://www.bls.gov/news.release/jltst.nr0.htm"],
    ["Employer Costs for Employee Compensation", "https://www.bls.gov/news.release/ecec.nr0.htm"],
    ["Job Openings and Labor Turnover Survey", "https://www.bls.gov/news.release/jolts.nr0.htm"],
    ["Metropolitan Area Employment and Unemployment (Monthly)", "https://www.bls.gov/news.release/metro.nr0.htm"],
    ["Employment Situation", "https://www.bls.gov/news.release/empsit.nr0.htm"],
    ["Real Earnings", "https://www.bls.gov/news.release/realer.nr0.htm"],
    ["Consumer Price Index", "https://www.bls.gov/news.release/cpi.nr0.htm"],
    ["Producer Price Index", "https://www.bls.gov/news.release/ppi.nr0.htm"],
    ["U.S. Import and Export Price Indexes", "https://www.bls.gov/news.release/ximpim.nr0.htm"],
    ["Usual Weekly Earnings of Wage and Salary Workers", "https://www.bls.gov/news.release/wkyeng.nr0.htm"],
    ["State Employment and Unemployment (Monthly)", "https://www.bls.gov/news.release/laus.htm"],
    ["Union Membership (Annual)", "https://www.bls.gov/news.release/union2.nr0.htm"],
    ["Quarterly Data Series on Business Employment Dynamics", "https://www.bls.gov/news.release/cewbd.nr0.htm"],
    ["Employment Cost Index", "https://www.bls.gov/news.release/eci.nr0.htm"],
    ["Productivity and Costs", "https://www.bls.gov/news.release/prod2.nr0.htm"],
    ["Occupational Requirements in the United States", "https://www.bls.gov/news.release/ors.nr0.htm"],
    ["Major Work Stoppages (Annual)", "https://www.bls.gov/news.release/wkstp.nr0.htm"],
    ["County Employment and Wages", "https://www.bls.gov/news.release/cewqtr.nr0.htm"],
    ["Persons with a Disability: Labor Force Characteristics", "https://www.bls.gov/news.release/disabl.nr0.htm"],
    ["State Unemployment (Annual)", "https://www.bls.gov/news.release/disabl.nr0.htm"],
    ["Employment Situation of Veterans", "https://www.bls.gov/news.release/vet.nr0.htm"],
    ["Total Factor Productivity", "https://www.bls.gov/news.release/prod3.nr0.htm"],
    ["Labor Market Experience, Education, Partner Status, and Health for those Born 1980-1984", "https://www.bls.gov/news.release/nlsyth.nr0.htm"],
    ["Occupational Employment and Wages", "https://www.bls.gov/news.release/ocwage.nr0.htm"],
    ["College Enrollment and Work Activity of High School Graduates", "https://www.bls.gov/news.release/hsgec.nr0.htm"],
    ["Employment Characteristics of Families", "https://www.bls.gov/news.release/famee.nr0.htm"],
    ["Productivity and Costs by Industry: Manufacturing and Mining Industries", "https://www.bls.gov/news.release/prin.nr0.htm"],
    ["Labor Force Characteristics of Foreign-born Workers", "https://www.bls.gov/news.release/forbrn.nr0.htm"],
    ["Productivity and Costs by Industry: Wholesale Trade and Retail Trade", "https://www.bls.gov/news.release/prin1.nr0.htm"],
    ["Productivity by State", "https://www.bls.gov/news.release/prin4.nr0.htm"],
    ["American Time Use Survey", "https://www.bls.gov/news.release/atus.nr0.htm"],
    ["Productivity and Costs by Industry: Selected Service-Providing Industries", "https://www.bls.gov/news.release/prin2.nr0.htm"],
    ["Summer Youth Labor Force", "https://www.bls.gov/news.release/youth.nr0.htm"],
    ["Employment Projections and Occupational Outlook Handbook", "https://www.bls.gov/news.release/ecopro.nr0.htm"],
    ["Worker Displacement", "https://www.bls.gov/news.release/disp.nr0.htm"],
    ["Employee Benefits in the United States", "https://www.bls.gov/news.release/ebs2.nr0.htm"],
    ["Consumer Expenditures", "https://www.bls.gov/news.release/cesan.nr0.htm"],
    ["Employee Tenure", "https://www.bls.gov/news.release/tenure.nr0.htm"],
    ["Employer-Reported Workplace Injuries and Illnesses (Annual)", "https://www.bls.gov/news.release/osh.nr0.htm"],
    ["Contingent and Alternative Employment Arrangements", "https://www.bls.gov/news.release/conemp.nr0.htm"],
    ["Total Factor Productivity for Major Industries", "https://www.bls.gov/news.release/prod5.nr0.htm"],
    ["Work Experience of the Population (Annual)", "https://www.bls.gov/news.release/work.nr0.htm"],
    ["Census of Fatal Occupational Injuries", "https://www.bls.gov/news.release/cfoi.nr0.htm"],
    ["Number of Jobs, Labor Market Experience, Marital Status, and Health for those Born 1957-1964", "https://www.bls.gov/news.release/nlsoy.nr0.htm"],
    ["Unpaid Eldercare in the United States", "https://www.bls.gov/news.release/elcare.nr0.htm"]
]);
