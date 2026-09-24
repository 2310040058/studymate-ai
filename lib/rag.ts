import fs from "fs";
import path from "path";

export function retrieveContext(query: string) {
  const filePath = path.join(process.cwd(), "knowledge.txt");
  const text = fs.readFileSync(filePath, "utf-8");

  const chunks = text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const queryWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length >= 3);

  const scoredChunks = chunks.map((chunk) => {
    const lowerChunk = chunk.toLowerCase();

    let score = 0;

    for (const word of queryWords) {
      if (lowerChunk.includes(word)) {
        score += 1;
      }
    }

    if (
      lowerChunk.includes("cnn") &&
      query.toLowerCase().includes("cnn")
    ) {
      score += 10;
    }

    if (
      lowerChunk.includes("lstm") &&
      query.toLowerCase().includes("lstm")
    ) {
      score += 10;
    }

    if (
      lowerChunk.includes("rag") &&
      query.toLowerCase().includes("rag")
    ) {
      score += 10;
    }

    return { chunk, score };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.chunk)
    .join("\n\n");
}