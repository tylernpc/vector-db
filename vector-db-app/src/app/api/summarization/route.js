import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

export async function POST(request) {
  const { message } = await request.json();

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const response = await model.invoke([{ role: "user", content: message }]);

    return Response.json({ result: response.content });
  } catch (err) {
    console.error("OpenAI error:", err);
    return Response.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
