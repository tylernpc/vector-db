import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const openai = new OpenAI();

export async function POST(request) {
  const { message } = await request.json();

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Your text string goes here",
      encoding_format: "float",
    });

    const response = await model.invoke([{ role: "user", content: message }]);

    console.log(embedding);

    return Response.json({ result: response.content });
  } catch (err) {
    console.error("OpenAI error:", err);
    return Response.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
