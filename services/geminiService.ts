
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';
import { safeLocalStorage, safeSessionStorage } from './storage';

// Helper to safely retrieve API Key (from env, session, or localStorage)
export const getApiKey = (): string | undefined => {
  let key: string | undefined;
  
  if (typeof window !== 'undefined') {
    // 1. Check Session Storage (Temporary for this tab)
    const sessionKey = safeSessionStorage.getItem('gemini_api_key');
    if (sessionKey) return sessionKey;

    // 2. Check Local Storage (Persisted user setting)
    const localKey = safeLocalStorage.getItem('gemini_api_key');
    if (localKey) return localKey;
  }

  // 3. Check Env (Process)
  try {
    if (typeof process !== 'undefined' && process.env) {
      key = process.env.API_KEY;
    }
  } catch (e) {
    // Ignore ReferenceError if process is not defined
  }
  
  return key;
};

// New function to validate if a key works
export const validateApiKey = async (key: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    // Attempt a minimal generation to test the key
    await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ text: "hi" }] },
    });
    return true;
  } catch (error) {
    console.error("API Key Validation Failed:", error);
    return false;
  }
};

export const generateTutorResponse = async (
  text: string,
  attachments: Attachment[],
  mode: TutorMode
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return `⚠️ **CHƯA CÓ API KEY**\n\n` +
           `Hệ thống chưa tìm thấy cấu hình API Key.\n` +
           `Vui lòng vào mục **Settings & Profile** để nhập API Key của bạn.\n\n` +
           `Nếu bạn vừa xóa key, hãy tải lại trang để nhập lại.`;
  }

  try {
    // Initialize the client per request
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const parts: any[] = [];
    let promptText = text;

    // Add attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        // Safe guard against empty data
        if (!att.data) return;

        // If it's a text attachment (e.g. converted DOCX), append to prompt
        if (att.isText) {
          promptText += `\n\n[Attached Document Content - ${att.name || 'Doc'}]:\n${att.data}\n`;
        } 
        // If it's a regular supported binary (Image, PDF)
        else {
          try {
             // Remove data:image/png;base64, prefix if present for clean base64
             const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
             if (base64Data) {
                parts.push({
                  inlineData: {
                    mimeType: att.mimeType,
                    data: base64Data
                  }
                });
             }
          } catch (err) {
             console.error("Error processing attachment:", err);
          }
        }
      });
    }

    // Add text prompt
    if (promptText) {
      parts.push({ text: promptText });
    } else if (parts.length === 0) {
       return "Vui lòng nhập câu hỏi hoặc tải lên hình ảnh để bắt đầu.";
    }

    const systemInstruction = getSystemInstruction(mode);

    // Primary model attempt: Gemini 2.0 Flash (Stable)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7, 
        }
      });
      return response.text || "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này.";
    } catch (primaryError) {
      console.warn("Gemini 2.0 Flash failed. Attempting fallback.", primaryError);
      
      // Fallback model: Gemini 2.0 Flash Lite (Preview)
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite-preview-02-05',
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7, 
        }
      });
      return response.text || "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này.";
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `**Lỗi kết nối với Gia sư AI:**\n\n${error instanceof Error ? error.message : JSON.stringify(error)}\n\nVui lòng kiểm tra API Key của bạn trong phần Cài đặt.`;
  }
};
