
import { GoogleGenAI } from "@google/genai";
import { Attachment, TutorMode } from '../types';
import { getSystemInstruction } from '../constants';

// Manual validation removed as we strictly use process.env.API_KEY now.

export const generateTutorResponse = async (
  text: string,
  attachments: Attachment[],
  mode: TutorMode
): Promise<string> => {
  // STRICT COMPLIANCE: API Key must come from process.env.API_KEY
  // The user's provided key is assumed to be configured in the environment variables.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    return `⚠️ **Lỗi Cấu Hình Hệ Thống**\n\nKhông tìm thấy \`process.env.API_KEY\`. Vui lòng đảm bảo bạn đã cấu hình biến môi trường chính xác trong file .env hoặc cài đặt server.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const parts: any[] = [];
    let promptText = text;

    // Add attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        if (!att.data) return;
        if (att.isText) {
          promptText += `\n\n[Attached Document Content - ${att.name || 'Doc'}]:\n${att.data}\n`;
        } else {
          try {
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

    if (promptText) {
      parts.push({ text: promptText });
    } else if (parts.length === 0) {
       return "Vui lòng nhập câu hỏi hoặc tải lên hình ảnh để bắt đầu.";
    }

    const systemInstruction = getSystemInstruction(mode);

    // SUPER VIP PRO MODE: Use Gemini 3 Pro with Thinking
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: parts
        },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 2048 } // Intelligent Thinking Enabled
        }
      });
      return response.text || "Xin lỗi, tôi không thể tạo câu trả lời vào lúc này.";
    } catch (primaryError) {
      console.warn("Gemini 3 Pro failed. Attempting fallback.", primaryError);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Fallback
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
