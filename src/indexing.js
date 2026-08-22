import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import "dotenv/config"


async function indexing()
{
    const PDF_PATH = './Node.pdf';
    //It only creates a loader object configured to know which PDF to load.
    const pdfLoader = new PDFLoader(PDF_PATH);
    //actually opens/reads the PDF and extracts its content.
    console.log("...loading pdf")
    const rawDocs = await pdfLoader.load();
    
    
   console.log("text splitting....")
   const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200, 
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

  /** matlab kuch portion overlap kara rahega like 1  to 1000  
   *   801 to 1800 taki purane wale content match rahe
   */

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-embedding-001',
    });  // this will create the vector embedding , by default it will create 3072 and we have to update the pincone dimension
    
   

     // configure pinecone
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

     console.log("adding to pinecone...........")
      // single step--> ChunkedDocs-->Embedding --> Vector DB
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

}

indexing()