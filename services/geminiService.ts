
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: 'test' }] },
    });
    return true;
  } catch (error) {
    console.warn("API Key validation failed", error);
    return false;
  }
};

export const generateTutorResponse = async (
  text: string,
  attachments: Attachment[],
  mode: TutorMode
): Promise<string> => {
  // STRICT COMPLIANCE: API Key must come from process.env.API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    return `⚠️ **Cấu hình hệ thống chưa hoàn tất**\n\nHệ thống chưa tìm thấy API Key (process.env.API_KEY). Vui lòng liên hệ quản trị viên để kiểm tra cấu hình server.`;
  }

  try {
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

    // Use Gemini 3 Pro Preview for VIP quality
    // Model selection based on task complexity implied by "VIP Tutor"
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
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
      console.warn("Gemini 3 Pro failed. Attempting fallback to Flash.", primaryError);
      
      // Fallback model: Gemini 3 Flash Preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
    return `**Lỗi kết nối với Gia sư AI:**\n\n${error instanceof Error ? error.message : JSON.stringify(error)}`;
  }
};
