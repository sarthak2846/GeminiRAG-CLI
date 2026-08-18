import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import "dotenv/config"

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
  temperature: 0,
});

async function combineHistory(history) {

  const historyContext = history.join("\n\n---\n\n");

  const promptTemplate = PromptTemplate.fromTemplate(`
You are a query rewriting model for a RAG system.

The following is the user's question history:

{history}

The LAST question is the user's current question.

Your task is to rewrite the LAST question into the best
standalone question for searching a documentation/PDF database.

Use the previous questions only when they provide context
needed to understand the current question.

Rules:
- Do NOT answer the question.
- Return ONLY the rewritten question.
- Keep the original intent.
- Resolve words such as "it", "this", "that", "they", "explain more",
  and "explain in detail".
- If the current question is already standalone, keep it essentially unchanged.
- Make the result clear and specific for semantic search.

Rewritten question:
`);

  const chain = RunnableSequence.from([
    promptTemplate,
    model,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke({
    history: historyContext,
  });

  return result.trim();
}

export default combineHistory;