import readlineSync, { question } from "readline-sync";
import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI,} from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import combineHistory from "./model.js";
import "dotenv/config";
import { BlobApiResponse } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control/runtime.js";

// configuration  for vector creation of question


const QuestionArray = [];
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-embedding-001",
});

// configuring the model

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
  temperature: 0.3,
});

// configure Pinecone
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

async function chatting(question) {
  // question ki embedding create karna hai
  const queryVector = await embeddings.embedQuery(question);

  // embeddig aagyi, uske baad usko vectorDB ke andar search karna, top10
  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  });

  // extracting metadata from the db result pahle saara text matlab array of string ban jaayega fhir last me join work karega
  const context = searchResults.matches
    .map((match) => match.metadata.text)
    .join("\n\n---\n\n");

  const promptTemplate = PromptTemplate.fromTemplate(`
   You are a helpful assistant answering questions based on the provided documentation.

   Context from the documentation:
   {context}

    Question: {question}

Instructions:
- Answer the question using ONLY the information from the context above
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Be concise and clear
- Use code examples from the context if relevant

Answer:
        `);
 
    // this is making or assembling model prompt templete and 
     const chain = RunnableSequence.from([
            promptTemplate,
            model,
            new StringOutputParser(),
        ]);


         // Step 6: Invoke the chain and get the answer
        const answer = await chain.invoke({
            context: context,
            question: question,
        }); 


         console.log(answer);
}

// question taking from the read line sync
async function main() {
  while (true) {
    const userProblem = readlineSync.question("Ask me anything--> ");
     if (userProblem=="exit")
     {
      break;
     }
    QuestionArray.push(userProblem);

    const bestQuestion = await combineHistory(QuestionArray);

    console.log("Original:", userProblem);
    console.log("Search question:", bestQuestion);

    await chatting(bestQuestion);
  }
}


main();
