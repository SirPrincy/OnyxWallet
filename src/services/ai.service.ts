import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Transaction, Wallet, Budget } from '../types';

export interface AISuggestion {
  dailyLimit: number;
  reasoning: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  tips: string[];
}

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Note: In a real production app, the API key should be handled via a secure backend or encrypted storage.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
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

      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              dailyLimit: { type: SchemaType.NUMBER },
              reasoning: { type: SchemaType.STRING },
              riskLevel: { type: SchemaType.STRING },
              tips: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            },
            required: ["dailyLimit", "reasoning", "riskLevel", "tips"]
          }
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('AI Service Error:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
