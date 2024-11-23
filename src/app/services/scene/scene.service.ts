import { Injectable } from "@angular/core";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

@Injectable({
  providedIn: "root",
})
export class SceneService {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  constructor() {
    this.scene = new THREE.Scene();
  }

  initializeScene(canvas: HTMLCanvasElement): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
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

    canvas.appendChild(this.renderer.domElement);

    return { scene: this.scene, camera: this.camera, renderer: this.renderer };
  }

  addControls(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
  ): OrbitControls {
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.update();
    return this.controls;
  }

  addLights(): void {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    light.position.set(0, 0, 5);
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);
  }

  addHelpers(): void {
    const axesHelper = new THREE.AxesHelper(5);
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(axesHelper);
    this.scene.add(gridHelper);
  }

  addGround(): void {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.ShadowMaterial({ opacity: 0.5 });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  loadModel(path: string): void {
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        this.scene.add(model);
      },
      (xhr) =>
        console.log(`${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`),
      (error) => console.error("An error occurred:", error),
    );
  }

  renderScene(): void {
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  }

  handleResize(): void {
    if (!this.camera || !this.renderer) return;

    const container = this.renderer.domElement.parentElement as HTMLElement;
    const { clientWidth, clientHeight } = container;

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  cleanup(): void {
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
