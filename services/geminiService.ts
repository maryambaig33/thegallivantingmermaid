import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are the "Dallas Lit Guide", a knowledgeable and sophisticated concierge for independent bookstores in Dallas, Texas. 
Your goal is to help users discover charming bookshops, find literary events, or get book recommendations based on their mood.

You have access to Google Maps to find real locations. 
When a user asks about a specific store or location, ALWAYS use the 'googleMaps' tool to provide accurate, real-time information.
If the user asks about recent events or news, you can use the 'googleMaps' tool as it often contains latest reviews, or imply general knowledge if specific search isn't needed (though maps is preferred for locations).

Tone: Warm, literary, inviting, slightly whimsical but very practical with directions.
Format: Keep responses concise and scannable. Use markdown.
`;

export const sendMessageToGemini = async (
  history: ChatMessage[],
  currentMessage: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<{ text: string; groundingMetadata?: any }> => {
  try {
    // Construct chat history for the model
    // Note: The new SDK uses a stateless approach for single turns often, or we can manage history manually.
    // For simplicity in this demo, we will use a single generateContent call with history context if needed, 
    // or just a fresh chat session. Ideally, use ai.chats.create for multi-turn.
    
    // Let's use ai.chats.create to maintain proper conversational context
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleMaps: {} }], // Enable Maps Grounding
        toolConfig: userLocation ? {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }
          }
        } : undefined,
      }
    });

    // Replay history to get the chat state up to date (excluding the new message)
    // In a real app, you might persist the chat object, but here we recreate state.
    for (const msg of history) {
      if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.text });
      } 
      // We skip model responses in the "sendMessage" replay loop for the SDK's internal state usually, 
      // but strictly speaking, the SDK tracks its own history if the object persists. 
      // Since we recreate the object, we'd need to manually feed history.
      // However, for this specific "single turn request" pattern often used in React statelessness:
    }
    
    // Correct approach for stateless React component calling a service: 
    // We will just send the full history as "contents" to generateContent if we weren't using the Chat helper,
    // OR we just send the latest message if we assume the user mainly asks new questions.
    // Let's try to pass previous history if possible. 
    
    // Actually, to keep it robust and simple for this demo without managing complex History objects:
    // We will just send the current message with a strong system instruction context. 
    // If we wanted full history, we'd format it into the `contents` array of `generateContent`.
    
    const historyContents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...historyContents,
            { role: 'user', parts: [{ text: currentMessage }] }
        ],
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ googleMaps: {} }],
            toolConfig: userLocation ? {
                retrievalConfig: {
                    latLng: {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    }
                }
            } : undefined,
        }
    });

    const text = response.text || "I couldn't find that information right now.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return { text, groundingMetadata };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting to the literary network (API Error). Please try again." };
  }
};
