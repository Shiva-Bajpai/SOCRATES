import { GoogleGenerativeAI } from "@google/generative-ai";

async function Data() {
  const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}` as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Write a story about a magic backpack.";

  const result = await model.generateContent(prompt);
  console.log(result.response.text())
}

export { Data };
