import type { Routes } from '@angular/router';
import { CanvasComponent } from './pages/canvas/canvas.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'canvas',
        component: CanvasComponent
    },
    {
        path: '',
        component: HomeComponent
    }
];
