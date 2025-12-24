
import { GoogleGenAI } from "@google/genai";
import { ReflectionEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTaijiWisdom(entry: Partial<ReflectionEntry>): Promise<{wisdom: string, weaknesses: string[], strengths: string[]}> {
  const prompt = `
    你是一位精通《道德经》与《易经》的当代智者。请分析以下用户的每日修行记录：
    
    阴（反思与不足）：${entry.yinContent}
    阳（行动与进取）：${entry.yangContent}
    
    请完成以下任务：
    1. 提供一段充满哲理且能指引其“走向伟大”的总结（100字以内，文风优美，含蓄而有力量）。
    2. 从其叙述中提取3个“阴影/弱点”关键词。
    3. 从其叙述中提取3个“光明/优势”关键词。
    
    请以 JSON 格式返回：
    {
      "wisdom": "你的智慧寄语",
      "weaknesses": ["关键词1", "关键词2", "关键词3"],
      "strengths": ["关键词1", "关键词2", "关键词3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const result = JSON.parse(response.text || "{}");
    return {
      wisdom: result.wisdom || "大道至简，行而不辍，未来可期。",
      weaknesses: result.weaknesses || ["迟疑", "忧虑", "懈怠"],
      strengths: result.strengths || ["专注", "果敢", "同理心"]
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      wisdom: "守中守静，反求诸己。",
      weaknesses: ["未明"],
      strengths: ["潜在"]
    };
  }
}
