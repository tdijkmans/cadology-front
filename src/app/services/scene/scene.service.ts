import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as THREE from "three";
import { type GLTF, GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

@Injectable({
  providedIn: "root",
})
export class SceneService {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private gltfLoader = new GLTFLoader();
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private model!: GLTF;

  constructor() {
    this.scene = new THREE.Scene();
  }

  // https://github.com/code4fukui/three.js_examples/blob/main/webgl_animation_skinning_additive_blending.html#L195
  public loadGltfModel(path: string, canvas: HTMLCanvasElement): Observable<THREE.Group<THREE.Object3DEventMap>> {
    this.initializeScene(canvas);

    window.addEventListener("resize", () => this.handleResize());

    return new Observable<THREE.Group<THREE.Object3DEventMap>>((observer) => {
      this.gltfLoader.load(path, (gltf) => {
        this.model = gltf;
        this.scene.add(gltf.scene);
        observer.next(gltf.scene);
        observer.complete();

        // Add animations
        if (gltf.animations.length) {
          this.mixer.clipAction(gltf.animations[3], gltf.scene).play();
        }
      });
    });
  }

  public changeAnimation(name: string): void {
    const gltf = this.model;
    if (!this.mixer) return;
    this.mixer.stopAllAction();
    const action = gltf.animations.find((animation) => animation.name === name) as THREE.AnimationClip;
    this.mixer.clipAction(action).play();
  }

  public stopAnimation(): void {
    if (!this.mixer) return;
    this.mixer.stopAllAction();
  }


  private initializeScene(canvas: HTMLCanvasElement): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mixer: THREE.AnimationMixer;
  } {
    const { clientWidth, clientHeight } = canvas;

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000,);
    this.camera.position.set(-1, 2, 3);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(0x1e90ff, 0.2);

    // Animation mixer
    this.mixer = new THREE.AnimationMixer(this.scene);

    // Add controls
    this.addControls(this.camera, this.renderer);

    // Add lights
    this.addLights();

    // Add helpers
    this.addHelpers();

    // Add ground
    this.addGround();

    // Append to DOM
    canvas.appendChild(this.renderer.domElement);

    return { scene: this.scene, camera: this.camera, renderer: this.renderer, mixer: this.mixer };
  }

  private addControls(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ): OrbitControls {
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.update();
    return this.controls;
  }

  private addLights(): void {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    light.position.set(1, 1, 1);
    this.scene.add(light);

    const orangeHemiHex = 0xf9d71c;
    const blueHemiHex = 0x1e90ff;
    const hemiLight = new THREE.HemisphereLight(orangeHemiHex, blueHemiHex, 0.5);
    hemiLight.position.set(10, 20, 10);
    this.scene.add(hemiLight);
  }

  private addHelpers(): void {
    const axesHelper = new THREE.AxesHelper(5);
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(axesHelper);
    this.scene.add(gridHelper);
  }

  private addGround(): void {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.ShadowMaterial({ opacity: 0.5 });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }



  public renderScene(): void {
    const delta = this.clock.getDelta();
    this.controls?.update();
    this.mixer?.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  public handleResize(): void {
    if (!this.camera || !this.renderer) return;

    const container = this.renderer.domElement.parentElement as HTMLElement;
    const { clientWidth, clientHeight } = container;

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  public cleanup(): void {
    // Clean up event listeners
    window.removeEventListener("resize", this.handleResize);

    // Dispose of Three.js objects
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          for (const mat of object.material) {
            mat.dispose();
          }
        } else {
          object.material.dispose();
        }
      }
    });

    // Dispose of renderer
    this.renderer.dispose();
  }
}
