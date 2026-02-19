import { registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import localePtBr from '@angular/common/locales/pt';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
registerLocaleData(localePtBr);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
