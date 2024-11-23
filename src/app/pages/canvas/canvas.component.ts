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

  constructor(private sceneService: SceneService) { }

  ngAfterViewInit(): void {
    const { scene, camera, renderer } = this.sceneService.initializeScene(
      this.canvasRef.nativeElement,
    );
    this.sceneService.addControls(camera, renderer);

    this.sceneService.addLights();
    this.sceneService.addHelpers();
    this.sceneService.addGround();
    this.sceneService.loadModel("./Xbot.glb");

    // Register resize event
    window.addEventListener("resize", () => this.sceneService.handleResize());

    this.animate();
  }

  ngOnDestroy(): void {
    this.sceneService.cleanup();
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.sceneService.renderScene();
  };
}
