import OpenAI from 'jsr:@openai/openai';

export async function twitterSummary(text: string) {
    const model = "meta-llama/Llama-3.3-70B-Instruct"

    const client = new OpenAI({
        apiKey: Deno.env.get('CENTML_API_KEY'),
        baseURL: "https://api.centml.com/openai/v1"
    });

    const stream = await client.chat.completions.create({
      messages: [{ role: 'user', content: `Please summarize the following Bureau Of Labour Statistics news release in a format suitable for posting to Twitter/X. I only want the exact text I can post to twitter, no quotes etc: ${text} ` }],
      model: model,
      stream: true
    });    

    let completion = '';
    for await (const chunk of stream) {
        completion += chunk.choices[0]?.delta?.content || '';
    }
    return completion;
  }