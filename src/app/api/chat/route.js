import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(req) {
  try {
    const { input } = await req.json(); 

    if (!input) {
      return new Response(JSON.stringify({ error: "Input is required" }), {
        status: 400,
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(input);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to get response from AI" }), {
      status: 500,
    });
  }
}
