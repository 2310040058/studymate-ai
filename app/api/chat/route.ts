import { groq } from "@ai-sdk/groq";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { retrieveContext } from "@/lib/rag";

const createStudyPlan = tool({
  description:
    "Create a simple study plan for a student based on a topic, number of days, and hours per day.",
  inputSchema: z.object({
    topic: z.string().describe("The subject or topic to study"),
    days: z.number().min(1).max(30).describe("Number of study days"),
    hoursPerDay: z
      .number()
      .min(1)
      .max(12)
      .describe("Number of study hours per day"),
  }),
  execute: async ({ topic, days, hoursPerDay }) => {
    const sessions = [];

    for (let day = 1; day <= days; day++) {
      sessions.push({
        day,
        topic,
        hours: hoursPerDay,
        task:
          day === 1
            ? `Learn the basic concepts of ${topic}`
            : day === days
              ? `Revise ${topic} and practice questions`
              : `Study and practice important concepts of ${topic}`,
      });
    }

    return {
      topic,
      days,
      hoursPerDay,
      sessions,
    };
  },
});

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
        "You are StudyMate AI, a helpful educational assistant. Answer clearly and simply for students. When a student asks for a study plan, use the createStudyPlan tool and then explain the generated plan clearly.",
      prompt: `Knowledge Base:
${context}

Student Question:
${message}

Answer the student's question clearly and simply.`,
      tools: {
        createStudyPlan,
      },
      stopWhen: stepCountIs(3),
    });

    console.log("TEXT RESPONSE RECEIVED");
    console.log("TOOL CALLS:", result.toolCalls);

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