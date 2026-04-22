import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Wallet, Budget } from '../types';

export interface AISuggestion {
  dailyLimit: number;
  reasoning: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  tips: string[];
}

export class AIService {
  private genAI: GoogleGenAI;

  constructor() {
    // Note: In a real production app, the API key should be handled via a secure backend or encrypted storage.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async getSafeToSpendSuggestion(
    transactions: Transaction[],
    wallets: Wallet[],
    budgets: Budget[]
  ): Promise<AISuggestion | null> {
    try {
      if (!this.genAI) return null;

      const recentTransactions = transactions.slice(0, 20).map(t => ({
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date
      }));

      const walletOverview = wallets.map(w => ({
        type: w.type,
        balance: w.balance
      }));

      const budgetOverview = budgets.map(b => ({
        category: b.category,
        limit: b.limit
      }));

      const prompt = `Analyze this financial status and recommend a "Safe-to-Spend" daily limit for the remainder of the month.
      
      Recent Transactions: ${JSON.stringify(recentTransactions)}
      Wallets: ${JSON.stringify(walletOverview)}
      Budgets: ${JSON.stringify(budgetOverview)}
      
      Return a JSON object with:
      - dailyLimit (number)
      - reasoning (string, max 100 characters)
      - riskLevel ("Low", "Medium", "High")
      - tips (array of strings, max 2 tips)`;

      const response = await this.genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dailyLimit: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["dailyLimit", "reasoning", "riskLevel", "tips"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('AI Service Error:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
