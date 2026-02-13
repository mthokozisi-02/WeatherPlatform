export interface WeatherSnapshotResponse {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    temp: number;
    humidity: number;
    description: string;
    lastSyncedAt: Date;
}
