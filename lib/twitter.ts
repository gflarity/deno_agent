import { OAuth } from "npm:oauth";

const REQUEST_TOKEN_URL = "https://api.twitter.com/oauth/request_token"
const ACCESS_TOKEN_URL = "https://api.twitter.com/oauth/access_token"

const X_API_KEY = Deno.env.get("X_API_KEY");
const X_KEY_SECRET = Deno.env.get("X_API_SECRET");
const X_ACCESS_TOKEN = Deno.env.get("X_ACCESS_TOKEN");
const X_ACCESS_TOKEN_SECRET = Deno.env.get("X_ACCESS_TOKEN_SECRET");

export async function tweet(text: string): Promise<void> {

    const oauth = new OAuth(
        REQUEST_TOKEN_URL,
        ACCESS_TOKEN_URL,
        X_API_KEY,
        X_KEY_SECRET,
        "1.0A",
        null,
        "HMAC-SHA1"
    );

    const url = "https://api.twitter.com/2/tweets"

    const payload = JSON.stringify({
        text: text,
    });
                
    await oauth.post(
        url,
        X_ACCESS_TOKEN,
        X_ACCESS_TOKEN_SECRET,
        payload,
        "application/json",
        (error: any, data: any, response: any): any  => {
            if (error) {
                console.error("Error posting tweet:", error);
                console.log("Response status code", error.statusCode)
                console.log(data)
                throw error;
            } else {
                const parsedData = JSON.parse(data as string);
                console.log("Tweet posted successfully:", parsedData);
            }
    })
}
