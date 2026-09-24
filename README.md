# StudyMate AI 🎓

StudyMate AI is a multimodal AI learning assistant that helps students understand educational content using text and image inputs.

It combines Retrieval-Augmented Generation (RAG) with multimodal AI to provide contextual and grounded answers from a custom educational knowledge base.

## 🚀 Features

- 💬 Text-based AI chatbot
- 🖼️ Image upload and image understanding
- 📚 Retrieval-Augmented Generation (RAG)
- 🧠 AI-powered educational explanations
- 🎓 Student-focused learning assistance
- ⚡ Powered by Groq AI models
- ☁️ Deployed on Vercel

## 🧩 How It Works

1. Student enters a question or uploads an image.
2. For text questions, the RAG system searches the educational knowledge base.
3. Relevant information is retrieved from the knowledge base.
4. The retrieved context is provided to the AI model.
5. The AI generates a clear and student-friendly response.
6. For image input, the multimodal AI model analyzes the uploaded image directly.

## 📚 RAG Knowledge Base

The project includes an educational knowledge base covering:

- Machine Learning
- Deep Learning
- CNN
- LSTM
- Natural Language Processing
- Tokenization
- Generative AI
- Retrieval-Augmented Generation
- Education
- Time Management

## 🛠️ Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Vercel AI SDK
- Groq API
- Retrieval-Augmented Generation (RAG)
- GitHub
- Vercel

## 📁 Project Structure

```text
studymate-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── rag.ts
├── knowledge.txt
├── package.json
├── README.md
└── .env.local