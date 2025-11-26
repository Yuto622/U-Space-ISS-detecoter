export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
}

export interface PassPrediction {
  risetime: number;
  duration: number;
  maxElevation: number; // degrees
  azimuthStart: number; // degrees
  azimuthEnd: number; // degrees
  direction: string; // e.g., "NW -> SE"
}

export interface WeatherData {
  cloudCover: number; // 0-100
  temperature: number;
  conditionCode: number;
}

export interface MissionBriefing {
  headline: string;
  locationName?: string;
  message: string;
  visibilityScore: number; // 0-100
  color: string; // hex or tailwind class
}