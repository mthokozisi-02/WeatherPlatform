export interface WeatherSnapshotResponse {
    id: number;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    temp: number;
    humidity: number;
    description: string;
    lastSyncedAt: Date;
    forecastSnapshots: any;
}
