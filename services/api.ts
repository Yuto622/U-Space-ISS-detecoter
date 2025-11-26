import { GoogleGenAI, Type } from "@google/genai";
import { ISSPosition, WeatherData, PassPrediction, MissionBriefing, Coordinates } from "../types";

// --- ISS API ---
export const fetchISSPosition = async (): Promise<ISSPosition> => {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!response.ok) throw new Error('Failed to fetch ISS position');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      velocity: data.velocity,
      visibility: data.visibility,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error(error);
    // Fallback/Mock data if API fails to avoid app crash
    return {
      latitude: 0,
      longitude: 0,
      altitude: 417,
      velocity: 27576,
      visibility: 'daylight',
      timestamp: Date.now() / 1000,
    };
  }
};

// --- Weather API (Open-Meteo) ---
export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,weather_code`
    );
    if (!response.ok) throw new Error('Failed to fetch weather');
    const data = await response.json();
    return {
      cloudCover: data.current.cloud_cover,
      temperature: data.current.temperature_2m,
      conditionCode: data.current.weather_code,
    };
  } catch (error) {
    console.error(error);
    return { cloudCover: 0, temperature: 20, conditionCode: 0 };
  }
};

// --- Gemini AI ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBriefing = async (
  pass: PassPrediction,
  weather: WeatherData,
  userLoc: Coordinates
): Promise<MissionBriefing> => {
  
  const prompt = `
    You are U-Space AI, a futuristic orbital tracking assistant for a Japanese user.
    
    Context:
    User Coordinates: Lat ${userLoc.latitude}, Lon ${userLoc.longitude}.
    Pass Data: Risetime ${pass.risetime} (UNIX), Duration ${Math.floor(pass.duration / 60)}m ${pass.duration % 60}s, Max Elevation ${pass.maxElevation}deg, Direction ${pass.direction}.
    Weather: Cloud Cover ${weather.cloudCover}%.
    
    Task:
    Generate a JSON briefing in JAPANESE (日本語).
    
    1. Identify the approximate City/Region from the coordinates (e.g. Tokyo, Osaka, Sapporo).
    2. "headline": Short, punchy, sci-fi style (e.g., "目視確認、良好", "雲量過多、観測困難").
    3. "locationName": The identified city name in Japanese (e.g. "東京都新宿区").
    4. "message": 
       - Start with "あなたは今、[Location Name]にいます。" (You are currently in [Location Name]).
       - Explain EXACTLY where to look. Use cardinal directions and elevation. (e.g. "午後7時30分、北西の空、仰角45度付近に出現します").
       - Mention visibility conditions based on weather.
    5. "visibilityScore": 0-100 integer based on clouds and elevation.
    6. "color": Hex code (Green #22c55e, Amber #fbbf24, Red #ef4444).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            locationName: { type: Type.STRING },
            message: { type: Type.STRING },
            visibilityScore: { type: Type.INTEGER },
            color: { type: Type.STRING }
          },
          required: ['headline', 'message', 'visibilityScore', 'color']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    return JSON.parse(text) as MissionBriefing;

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if AI fails
    return {
      headline: "データリンク中断",
      locationName: "現在地不明",
      message: "詳細な位置情報の取得に失敗しました。現地の空の状況を目視で確認してください。",
      visibilityScore: 50,
      color: "#fbbf24" // Amber
    };
  }
};

// Helper to generate mock upcoming passes (since real calculation is heavy w/o library)
// In a real app, we would use satellite.js here.
export const getMockPasses = (): PassPrediction[] => {
  const now = Date.now() / 1000;
  return [
    {
      risetime: now + 3600 * 4, // 4 hours from now
      duration: 365,
      maxElevation: 75,
      azimuthStart: 315, // NW
      azimuthEnd: 135,   // SE
      direction: "NW -> SE"
    },
    {
      risetime: now + 3600 * 25.5, // ~1 day later
      duration: 240,
      maxElevation: 45,
      azimuthStart: 225, // SW
      azimuthEnd: 45,    // NE
      direction: "SW -> NE"
    }
  ];
};