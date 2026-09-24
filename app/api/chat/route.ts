import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { retrieveContext } from "@/lib/rag";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    console.log("MESSAGE:", message);
    console.log("IMAGE:", image ? "Image received" : "No image");

    if (image) {
      const result = await generateText({
        model: groq("qwen/qwen3.8-27b"),
        system:
            "You are StudyMate AI, a multimodal educational assistant. When an image is uploaded, analyze the image itself and explain its visible content clearly and simply. Do not confuse the image with the text knowledge base.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  message ||
                  "Analyze the uploaded image directly. Explain what is visible in the image in simple terms for a student. Do not say that the image is a knowledge base.",
              },
              {
                type: "image",
                image: image,
              },
            ],
          },
        ],
      });

      console.log("IMAGE RESPONSE RECEIVED");

      return Response.json({ response: result.text });
    }

    const context = retrieveContext(message);

    console.log("RAG CONTEXT:", context);

    const result = await generateText({
      model: groq("openai/gpt-oss-120b"),
      system:
        "You are StudyMate AI, a helpful educational assistant. Answer clearly and simply for students.",
      prompt: `Knowledge Base:
${context}

Student Question:
${message}

Answer the student's question clearly and simply.`,
    });

    console.log("TEXT RESPONSE RECEIVED");

    return Response.json({ response: result.text });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
