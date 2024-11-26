import { Component, type ElementRef, ViewChild } from "@angular/core";
import { SceneService } from "@services/scene/scene.service";

@Component({
  selector: "cad-canvas",
  standalone: true,
  imports: [],
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"],
  providers: [SceneService],
})
export class CanvasComponent {
  @ViewChild("threeCanvas", { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  isRunning = false;

  constructor(private sceneService: SceneService) { }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.sceneService.loadGltfModel("./Xbot.glb", canvas).subscribe();
    this.animate();

  }

  ngOnDestroy(): void {
    this.sceneService.cleanup();
  }

  private animate = (): void => {
    this.sceneService.renderScene();
    requestAnimationFrame(this.animate);
  };

  public changeAnimation(): void {
    this.sceneService.changeAnimation(this.isRunning ? "run" : "walk");
    this.isRunning = !this.isRunning;
  }

  public stopAnimation(): void {
    this.sceneService.stopAnimation();
  }

}
