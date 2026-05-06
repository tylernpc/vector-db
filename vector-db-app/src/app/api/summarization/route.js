import { ChatOpenAI } from "@langchain/openai";

export async function POST(req) {
  const { text } = await req.json();

  const model = new ChatOpenAI({ model: "gpt-4o" });

  const result = await model.invoke([
    {
      role: "user",
      content: `Summarize the following text:\n\n${text}`,
    },
  ]);

  return Response.json({ summary: result.content });
}
