import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

export class AiBusyError extends Error {}

/** Calls Gemini and returns the raw JSON text. Server-side only. */
export async function generateAnalysisText(policyText: string, apiKey: string, model: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model,
      contents: buildUserPrompt(policyText),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });
    const text = response.text;
    if (!text) throw new Error("Empty response from model (possibly blocked by safety filters).");
    return text;
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status === 429 || status === 503) throw new AiBusyError("AI service is busy or rate limited.");
    throw err;
  }
}
