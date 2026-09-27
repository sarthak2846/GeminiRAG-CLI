# GeminiRAG-CLI

A lightweight Retrieval-Augmented Generation (RAG) project that turns a PDF document into a searchable knowledge base and lets you ask questions in natural language using Gemini embeddings and Pinecone vector search.

This project demonstrates a simple end-to-end flow:

- load a PDF
- split the document into chunks
- generate vector embeddings with Google Gemini
- store the embeddings in Pinecone
- retrieve the most relevant context for a user query
- answer using a LangChain-powered LLM

---

## ✨ Features

- PDF ingestion and chunking using LangChain
- Semantic search with Gemini embeddings
- Vector storage in Pinecone
- Context-aware multi-turn question rewriting
- Interactive CLI chat interface
- Clean RAG pipeline for document Q&A

---

## 🧠 Tech Stack

- Node.js
- LangChain
- Google Gemini
- Pinecone
- PDF parsing with `pdf-parse`
- dotenv for environment configuration

---

## 📁 Project Structure

```bash
firstLangchain/
├── src/
│   ├── indexing.js      # PDF ingestion + vector indexing
│   ├── model.js         # Query rewriting using Gemini
│   ├── query.js         # Interactive chat / retrieval pipeline
│   └── ...
├── .env                 # Local environment variables
├── Node.pdf             # Source PDF used for indexing
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

> Make sure your Pinecone index exists and matches the embedding dimension expected by the model you use.

### 3. Create the vector index

Before running the Q&A flow, index the PDF into Pinecone:

```bash
node src/indexing.js
```

This script loads `Node.pdf`, splits it into chunks, embeds those chunks with Gemini, and saves them to Pinecone.

### 4. Start the chat app

```bash
npm start
```

This runs the interactive CLI from `src/query.js`, where you can ask questions based on the indexed PDF content.

---

## 🔄 How the App Works

### 1. Indexing pipeline

`src/indexing.js` performs the following:

- reads the PDF file
- splits it into smaller text chunks
- transforms each chunk into an embedding using Gemini
- stores the vectorized documents in Pinecone

### 2. Question rewriting

`src/model.js` takes the conversation history and rewrites the latest question into a cleaner standalone retrieval query.

This helps the RAG system handle follow-up questions like:

- "What is this?"
- "Explain more about that"
- "Can you give details?"

### 3. Retrieval + answer generation

`src/query.js` does the actual lookup:

- embeds the current question
- queries Pinecone for the top matching chunks
- gathers the relevant document context
- sends that context to Gemini with a prompt
- returns the answer to the user

---

## 📝 Example Usage

```bash
npm install
node src/indexing.js
npm start
```

Then in the terminal:

```text
Ask me anything--> What is Node.js?
```

---

## ⚙️ Scripts

```json
"scripts": {
  "start": "node src/query.js"
}
```

If you want to add more automation later, you may also add scripts such as:

```bash
npm run index
npm run ask
```

---

## 🛠️ Notes

- This project is a great beginner-friendly RAG example.
- It focuses on simplicity and clarity rather than production-grade orchestration.
- The app is command-line based and excellent for learning how RAG works in practice.
- You can extend it by adding:
  - a web interface
  - conversation memory improvements
  - multiple document ingestion sources
  - better result ranking and filtering

---

## ✅ Typical Workflow

```bash
npm install
# add .env values
node src/indexing.js
npm start
```

---

## 📜 License

This project is licensed under the ISC License.

---

## 💡 Future Improvements

- Add a web UI for easier interaction
- Support multiple PDFs and folder-based indexing
- Add metadata filtering for Pinecone queries
- Improve chunking strategies for long documents
- Add logging and error handling for production use

---

Built as a practical LangChain + Gemini + Pinecone document Q&A demo.
