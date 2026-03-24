export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function streamText(
  apiKey: string,
  messages: Message[],
  system: string,
  onChunk: (text: string) => void
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
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
        const event = JSON.parse(data) as { type: string; delta?: { type: string; text: string } };
        if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
          full += event.delta.text;
          onChunk(event.delta.text);
        }
      } catch {
        // ignore malformed SSE lines
      }
    }
  }

  return full;
}
