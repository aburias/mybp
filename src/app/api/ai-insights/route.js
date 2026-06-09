import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { readings } = body;

    if (!readings || !Array.isArray(readings) || readings.length === 0) {
      return NextResponse.json({ error: 'No reading data provided.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key is missing. Please add GEMINI_API_KEY to your environment.' }, { status: 500 });
    }

    // Format the readings into a simple text summary for the AI
    const dataString = readings.map(r => 
      `Date: ${new Date(r.createdAt).toLocaleDateString()} ${new Date(r.createdAt).toLocaleTimeString()} - Sys: ${r.systolic}, Dia: ${r.diastolic}, Pulse: ${r.pulse || 'N/A'}`
    ).join('\n');

    const prompt = `
You are a knowledgeable AI health assistant.
Look at the user's recent blood pressure and pulse readings below.

Provide a clear, detailed, and actionable response. Structure it with exactly two sections:

### 📊 Executive Summary
Explain what their recent numbers mean. You MUST include their actual average systolic and diastolic numbers in the summary. Explain exactly which blood pressure category they fall into (e.g., Normal, Elevated, Stage 1, or Stage 2 Hypertension). Give them actual context about their data rather than just saying "it is high".

### 💡 Action Plan
Give 3 to 4 specific, practical actions based on their numbers. If their numbers are high, suggest things like resting, tracking at different times of day, reducing sodium, and consulting a doctor. Use bullet points for readability.

Rules:
- Be detailed enough to be genuinely useful. Don't just give a generic one-liner.
- NO JSON OUTPUT. 
- Keep the language plain and easy to understand.

Data:
${dataString}
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ insights: response.text });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights. Check server logs.' }, { status: 500 });
  }
}
