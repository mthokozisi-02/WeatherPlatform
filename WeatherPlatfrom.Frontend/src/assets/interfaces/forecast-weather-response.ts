export interface ForecastWeatherResponse {
    list: ForecastItem[];
}

export interface ForecastItem {
    main: MainInfo;
    weather: WeatherInfo[];
    dt_txt: string;
    dt: number;
}

export interface MainInfo {
    temp: number;
    humidity: number;
}

export interface WeatherInfo {
    description: string;
}
