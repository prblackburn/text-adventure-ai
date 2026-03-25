export interface Message {
  role: "user" | "assistant";
  content: string;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export async function streamText(
  apiKey: string,
  messages: Message[],
  system: string,
  onChunk: (text: string) => void
): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 150,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${await response.text()}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") break;
      try {
        const event = JSON.parse(data) as { choices: Array<{ delta: { content?: string } }> };
        const text = event.choices[0]?.delta?.content;
        if (text) {
          full += text;
          onChunk(text);
        }
      } catch {
        // ignore malformed SSE lines
      }
    }
  }

  return full;
}
