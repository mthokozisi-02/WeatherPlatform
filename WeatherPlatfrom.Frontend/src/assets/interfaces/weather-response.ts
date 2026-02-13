export interface WeatherResponse {
    main: MainInfo;
    weather: WeatherInfo[];
    sys: SystemInfo;
    coord: Coordinates;
    dt_txt: Date;
}

export interface MainInfo {
    temp: number;
    humidity: number;
}

export interface WeatherInfo {
    description: string;
}

export interface SystemInfo {
    country: string;
}

export interface Coordinates {
    lat: number;
    lon: number;
}
