import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherResponse } from '../interfaces/weather-response';
import { Observable, tap } from 'rxjs';
import { UpdateLocation } from '../interfaces/update-location';

const apiUrl = 'https://localhost:7107/api';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient) {}

    createLocation(city: string): Observable<WeatherResponse> {
        console.log(city);
        return this.http.post<WeatherResponse>(`${apiUrl}/create-location`, city);
    }

    updateLocation(location: UpdateLocation): Observable<any> {
        console.log(location);
        return this.http.put<any>(`${apiUrl}/update-location`, location);
    }

    deleteLocation(Id: number): Observable<any> {
        return this.http.delete<any>(`${apiUrl}/delete-location/${Id}`);
    }

    getAll(): Observable<any> {
        return this.http.get<any>(`${apiUrl}/get-all-locations`);
    }
}
