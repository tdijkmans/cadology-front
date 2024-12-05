import type { Routes } from '@angular/router';
import { CanvasComponent } from '@pages/canvas/canvas.component';
import { HomeComponent } from '@pages/home/home.component';
import { VideoComponent } from '@pages/video/video.component';

export const routes: Routes = [
  {
    path: 'canvas',
    component: CanvasComponent,
  },
  {
    path: 'video',
    component: VideoComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
