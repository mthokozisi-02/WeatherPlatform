import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';
import { WeatherResponse } from 'src/assets/interfaces/weather-response';
import { LocationService } from 'src/assets/services/location-service';
import { catchError, finalize, tap, throwError } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateLocation } from 'src/assets/interfaces/update-location';
import { WeatherSnapshotResponse } from 'src/assets/interfaces/weather-snapshot-response';
import { WeatherService } from 'src/assets/services/weather-service';
import { ForecastWeatherResponse } from 'src/assets/interfaces/forecast-weather-response';

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button label="Check Weather" icon="pi pi-search" class="mr-2" (click)="checkWeather()" />
                <p-button label="Check Forecast" icon="pi pi-search" (click)="checkForecast()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="locations()"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['city', 'country']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Products</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem"></th>
                    <th style="min-width: 3rem">Country</th>
                    <th pSortableColumn="name" style="min-width:8rem">
                        City
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="price" style="min-width: 6rem">Latitude</th>
                    <th pSortableColumn="category" style="min-width:6rem">Longitude</th>
                    <th pSortableColumn="category" style="min-width:6rem">Temperature</th>
                    <th pSortableColumn="category" style="min-width:6rem">Humidity</th>
                    <th pSortableColumn="category" style="min-width:12rem">Description</th>
                    <th pSortableColumn="category" style="min-width:12rem">LastSyncedAt</th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-location>
                <tr>
                    <td style="width: 3rem">
                        <i *ngIf="location.isFavorite" class="pi pi-heart text-red-500"> </i>
                    </td>
                    <td style="min-width: 6rem">{{ location.country }}</td>
                    <td style="min-width: 8rem">{{ location.city }}</td>
                    <td style="min-width: 6rem">{{ location.latitude }}</td>
                    <td style="min-width: 6rem">{{ location.longitude }}</td>
                    <td style="min-width: 6rem">{{ location.temp }}</td>
                    <td style="min-width: 6rem">{{ location.humidity }}</td>
                    <td style="min-width: 12rem">{{ location.description }}</td>
                    <td style="min-width: 12rem">{{ location.lastSyncedAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editLocation(location)" />
                        <p-button icon="pi pi-trash" severity="danger" class="mr-2" [rounded]="true" [outlined]="true" (click)="deleteLocation(location)" />
                        <p-button label="Sync" [rounded]="true" [outlined]="true" class="mr-2" (click)="refreshWeather(location)" />
                        <p-button label="Forecast" [rounded]="true" [outlined]="true" (click)="viewForecast(location)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="locationDialog" [style]="{ width: '450px' }" header="Location Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Name</label>
                        <input type="text" pInputText id="name" [(ngModel)]="newLocation" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !newLocation">Name is required.</small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveLocation()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="updateLocationDialog" [style]="{ width: '450px' }" header="Location Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center">
                                <p-radiobutton id="option1" name="option" value="true" [(ngModel)]="favorite" />
                                <label for="option1" class="leading-none ml-2">Favorite</label>
                            </div>
                            <div class="flex items-center">
                                <p-radiobutton id="option2" name="option" value="false" [(ngModel)]="favorite" />
                                <label for="option2" class="leading-none ml-2">Not Favorite</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="updateLocation()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="searchLocationDialog" [style]="{ width: '450px' }" header="Location Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Name</label>
                        <input type="text" pInputText id="name" [(ngModel)]="newLocation" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !newLocation">Name is required.</small>
                    </div>
                    <div *ngIf="show" class="flex flex-col md:flex-row gap-8">
                        <div class="flex items-center gap-2">
                            <label for="name" class="font-bold mb-3">Latitude:</label>
                            <label for="name" class="font-bold mb-3 text-red-500">{{ cityWeather.coord.lat }}</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <label for="name" class="font-bold mb-3">Longitude:</label>
                            <label for="name" class="font-bold mb-3 text-red-500">{{ cityWeather.coord.lon! }}</label>
                        </div>
                    </div>
                    <div *ngIf="show" class="flex flex-col md:flex-row gap-8">
                        <div class="flex items-center gap-2">
                            <label for="name" class="font-bold mb-3">Temperature:</label>
                            <label for="name" class="font-bold mb-3 text-red-500">{{ cityWeather.main.temp }}</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <label for="name" class="font-bold mb-3">Humidity:</label>
                            <label for="name" class="font-bold mb-3 text-red-500">{{ cityWeather.main.humidity }}</label>
                        </div>
                    </div>
                    <div *ngIf="show" class="flex flex-col md:flex-row gap-8">
                        <div class="flex items-center gap-2">
                            <label for="name" class="font-bold mb-3">Country:</label>
                            <label for="name" class="font-bold mb-3 text-red-500">{{ cityWeather.sys.country }}</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <label for="name" class="font-bold mb-3">Description:</label>
                            <label for="name" class="font-bold mb-3 text-red-500">{{ cityWeather.weather[0].description }}</label>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Current Weather" icon="pi pi-check" (click)="getCityWeather()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="forecastDialog" [style]="{ width: '450px' }" header="Location Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Name</label>
                        <input type="text" pInputText id="name" [(ngModel)]="newLocation" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !newLocation">Name is required.</small>
                    </div>

                    <p-table *ngIf="showForecast" #dt [value]="selectedForecast.list" [rows]="10" [rowHover]="true" dataKey="id">
                        <ng-template #caption> </ng-template>
                        <ng-template #header>
                            <tr>
                                <th style="min-width:8rem">Date</th>
                                <th style="min-width:3rem">Temperature</th>
                                <th style="min-width:2rem">Humidity</th>
                                <th style="min-width:3rem">Description</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-location>
                            <tr>
                                <td style="min-width: 8rem">{{ location.dt_txt | date: 'yyyy-MM-dd' }}</td>
                                <td style="min-width: 3rem">{{ location.main.temp }}</td>
                                <td style="min-width: 2rem">{{ location.main.humidity }}</td>
                                <td style="min-width: 3rem">{{ location.weather[0].description }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Check Forecast" icon="pi pi-check" (click)="getCityForecast()" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="viewforecastDialog" [style]="{ width: '450px' }" header="Location Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <p-table #dt [value]="selectedLocation.forecastSnapshots" [rows]="10" [rowHover]="true" dataKey="id">
                        <ng-template #caption> </ng-template>
                        <ng-template #header>
                            <tr>
                                <th style="min-width:8rem">Date</th>
                                <th style="min-width:3rem">Temperature</th>
                                <th style="min-width:2rem">Humidity</th>
                                <th style="min-width:3rem">Description</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-location>
                            <tr>
                                <td style="min-width: 8rem">{{ location.forecastDate | date: 'yyyy-MM-dd' }}</td>
                                <td style="min-width: 3rem">{{ location.temperature }}</td>
                                <td style="min-width: 2rem">{{ location.humidity }}</td>
                                <td style="min-width: 3rem">{{ location.description }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Crud implements OnInit {
    locations = signal<WeatherSnapshotResponse[]>([]);

    forecasts = signal<ForecastWeatherResponse[]>([]);

    selectedForecast: ForecastWeatherResponse = {} as ForecastWeatherResponse;

    newLocation: any;

    show = false;

    showForecast = false;

    cityWeather: WeatherResponse = {} as WeatherResponse;

    selectedLocation: WeatherSnapshotResponse = {} as WeatherSnapshotResponse;

    favorite = '';

    forecastDialog: boolean = false;

    viewforecastDialog: boolean = false;

    locationDialog: boolean = false;

    updateLocationDialog: boolean = false;

    searchLocationDialog: boolean = false;

    location!: UpdateLocation;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    isLoading = false;

    private destroyRef = inject(DestroyRef);

    constructor(
        private locationService: LocationService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private weatherService: WeatherService
    ) {}

    ngOnInit() {
        this.loadLocations();
    }

    loadLocations() {
        this.isLoading = true;

        this.locationService
            .getAll()
            .pipe(
                tap((res) => {
                    this.locations.set(res);
                    console.log('Retrieved successfully:', res);
                }),

                catchError((err) => {
                    this.messageService.add({
                        severity: 'fail',
                        summary: 'Successful',
                        detail: err,
                        life: 3000
                    });
                    return throwError(() => err);
                }),

                finalize(() => {
                    this.isLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.submitted = false;
        this.locationDialog = true;
    }

    editLocation(location: UpdateLocation) {
        this.favorite = '';
        this.location = { ...location };
        this.updateLocationDialog = true;
    }

    checkForecast() {
        this.forecastDialog = true;
    }

    checkWeather() {
        this.searchLocationDialog = true;
    }

    updateLocation() {
        this.submitted = true;
        this.isLoading = true;

        if (this.favorite === 'true') {
            this.location.isFavorite = true;
        } else {
            this.location.isFavorite = false;
        }

        this.locationService
            .updateLocation(this.location)
            .pipe(
                tap((res) => {
                    console.log('Updated successfully:', res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000
                    });
                }),

                catchError((err) => {
                    this.messageService.add({
                        severity: 'fail',
                        summary: 'Not Successful',
                        detail: 'location not updated',
                        life: 3000
                    });
                    return throwError(() => err);
                }),

                finalize(() => {
                    this.ngOnInit();
                    this.isLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.updateLocationDialog = false;
    }

    hideDialog() {
        this.locationDialog = false;
        this.updateLocationDialog = false;
        this.searchLocationDialog = false;
        this.forecastDialog = false;
        this.viewforecastDialog = false;
        this.show = false;
        this.submitted = false;
    }

    deleteLocation(location: WeatherSnapshotResponse) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + location.city + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.locationService
                    .deleteLocation(location.id)
                    .pipe(
                        tap((res) => {
                            console.log('Deleted successfully:', res);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Product Created',
                                life: 3000
                            });
                        }),

                        catchError((err) => {
                            this.messageService.add({
                                severity: 'fail',
                                summary: 'Successful',
                                detail: err,
                                life: 3000
                            });
                            return throwError(() => err);
                        }),

                        finalize(() => {
                            this.ngOnInit();
                            this.isLoading = false;
                        }),
                        takeUntilDestroyed(this.destroyRef)
                    )
                    .subscribe();
            }
        });
    }

    saveLocation() {
        this.submitted = true;
        this.isLoading = true;

        this.locationService
            .createLocation(this.newLocation)
            .pipe(
                tap((res) => {
                    console.log('Retrieved successfully:', res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000
                    });
                }),

                catchError((err) => {
                    this.messageService.add({
                        severity: 'fail',
                        summary: 'Successful',
                        detail: err,
                        life: 3000
                    });
                    return throwError(() => err);
                }),

                finalize(() => {
                    this.ngOnInit();
                    this.isLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.locationDialog = false;
    }

    getCityWeather() {
        this.submitted = true;
        this.isLoading = true;

        this.weatherService
            .getCurrentWeather(this.newLocation)
            .pipe(
                tap((res) => {
                    console.log('Retrieved successfully:', res);
                    this.cityWeather = res;
                    this.show = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000
                    });
                }),

                catchError((err) => {
                    this.messageService.add({
                        severity: 'fail',
                        summary: 'Successful',
                        detail: err,
                        life: 3000
                    });
                    return throwError(() => err);
                }),

                finalize(() => {
                    this.ngOnInit();
                    this.isLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    refreshWeather(location: WeatherSnapshotResponse) {
        this.isLoading = true;

        this.weatherService
            .refreshWeather(location.id)
            .pipe(
                tap((res) => {
                    console.log('Retrieved successfully:', res);
                    this.cityWeather = res;
                    this.show = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
                        life: 3000
                    });
                }),

                catchError((err) => {
                    this.messageService.add({
                        severity: 'fail',
                        summary: 'Successful',
                        detail: err,
                        life: 3000
                    });
                    return throwError(() => err);
                }),

                finalize(() => {
                    this.ngOnInit();
                    this.isLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    viewForecast(location: WeatherSnapshotResponse) {
        this.selectedLocation = location;
        this.viewforecastDialog = true;
    }

    getCityForecast() {
        this.submitted = true;
        this.isLoading = true;

        this.weatherService
            .getCurrentForecast(this.newLocation)
            .pipe(
                tap((res) => {
                    console.log('Retrieved successfully:', res);
                    this.selectedForecast = res;
                    this.showForecast = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Forecast Retrieved successfully',
                        life: 3000
                    });
                }),

                catchError((err) => {
                    this.messageService.add({
                        severity: 'fail',
                        summary: 'Successful',
                        detail: err,
                        life: 3000
                    });
                    return throwError(() => err);
                }),

                finalize(() => {
                    this.ngOnInit();
                    this.isLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
