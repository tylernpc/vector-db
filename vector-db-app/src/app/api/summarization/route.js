import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const openai = new OpenAI();
const supabaseKey = process.env.SUPABASE_SECRET_KEY
const url = process.env.SUPABASE_URL

export async function POST(request) {
  const { message } = await request.json();

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Your text string goes here",
      encoding_format: "float",
    });

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

export const run = async () => {
  const client = createClient(url, supabaseKey)
  const vectorStore = await SupabaseVectorStore.fromTexts(
      ['Hello world', 'Bye bye', "What's this?"],
      [{ id: 2 }, { id: 1 }, { id: 3 }],
      new OpenAIEmbeddings(),
      {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
      }
  )
  const resultOne = await vectorStore.similaritySearch('Hello world', 1)
  console.log(resultOne)
}