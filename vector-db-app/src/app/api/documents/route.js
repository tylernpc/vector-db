import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";

const embedder = new OpenAIEmbeddings({ model: "text-embedding-ada-002" });
const supabaseUrl = process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SECRET_KEY);

export async function POST(request) {
  const { content, metadata = {} } = await request.json();

  if (!content?.trim()) {
    return Response.json({ error: "content is required" }, { status: 400 });
  }

  try {
    const embedding = await embedder.embedQuery(content);

    const { data, error } = await supabase
      .from("documents")
      .insert({ content, metadata, embedding })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ id: data.id });
  } catch (err) {
    console.error("Document insert error:", err);
    return Response.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
