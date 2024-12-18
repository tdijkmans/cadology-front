import {
  AfterViewInit,
  Component,
  type ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { PageComponent } from '@components/page/page.component';
import { SceneService } from '@services/scene/scene.service';

@Component({
  selector: 'cad-canvas',
  standalone: true,
  imports: [PageComponent],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  providers: [SceneService],
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  isRunning = false;
  isLoading = true;

  constructor(private sceneService: SceneService) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.sceneService.loadGltfModel('./Xbot.glb', canvas).subscribe();
    this.animate();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.sceneService.cleanup();
  }

  private animate = (): void => {
    this.sceneService.renderScene();
    requestAnimationFrame(this.animate);
  };

  public changeAnimation(): void {
    this.sceneService.changeAnimation(this.isRunning ? 'run' : 'walk');
    this.isRunning = !this.isRunning;
  }

  public stopAnimation(): void {
    this.sceneService.stopAnimation();
  }
}
