import { Component, type ElementRef, ViewChild } from "@angular/core";
import { SceneService } from "@services/scene/scene.service";
import { tap } from "rxjs";
import type { BoneName } from "./body";

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
    // https://github.com/code4fukui/three.js_examples/blob/main/webgl_animation_skinning_additive_blending.html#L195
    this.sceneService.loadModel("./Xbot.glb").pipe(tap(
      (model) => {
        console.log(model);
        model.position.set(1, 0, 0);
        const bones = model.traverse((object) => {
          const boneName: BoneName = object.name as BoneName;
          console.log(boneName);
        });


      }
    )).subscribe();

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
