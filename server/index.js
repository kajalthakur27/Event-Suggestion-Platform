// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();

console.log("Starting AI test...");

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

console.log("Environment loaded");
console.log("API KEY:", process.env.GEMINI_API_KEY ? "LOADED" : "NOT FOUND");
console.log("API KEY length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "undefined");

async function main() {
  console.log("Inside main function...");

  try {
    console.log("Creating GoogleGenerativeAI instance...");
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("Getting model...");
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("Sending request...");

    const response = await model.generateContent("Hello Kajal! How are you today?");

    console.log("✅ SUCCESS! Response from Gemini:");
    console.log(response.response.text());
    console.log("\n🎉 Your API is working perfectly!");
  } catch (error) {
    console.error("Error occurred:", error.message);
    console.error("Full error:", error);
  }
}

console.log("About to call main function...");
main().then(() => {
  console.log("Main function completed successfully");
}).catch((error) => {
  console.error("Main function failed:", error);
});
