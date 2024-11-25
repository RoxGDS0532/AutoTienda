import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),provideZoneChangeDetection({ eventCoalescing: true }),NgChartsModule,CommonModule, provideAnimations(), provideToastr(),
    
  ]
};
