import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateLocation } from '../interfaces/update-location';
import { WeatherResponse } from '../interfaces/weather-response';
import { ForecastWeatherResponse } from '../interfaces/forecast-weather-response';

const apiUrl = 'https://localhost:7107/api';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    constructor(private http: HttpClient) {}

    getCurrentWeather(name: string): Observable<WeatherResponse> {
        const body = { name };
        console.log(body);
        return this.http.post<WeatherResponse>(`${apiUrl}/current-weather`, body);
    }

    refreshWeather(id: number): Observable<any> {
        console.log(id);
        return this.http.post<any>(`${apiUrl}/refresh-weather`, id);
    }

    getCurrentForecast(name: string): Observable<any> {
        const body = { name };
        console.log(body);
        return this.http.post<any>(`${apiUrl}/current-forecast`, body);
    }

    getAll(): Observable<any> {
        return this.http.get<any>(`${apiUrl}/get-all-locations`);
    }
}
