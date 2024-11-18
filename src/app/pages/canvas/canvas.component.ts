import { Component, type ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'cad-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
  @ViewChild('threeCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  private initThreeJS(): void {
    // Get canvas container dimensions
    const container = this.canvasRef.nativeElement;
    const { clientHeight, clientWidth } = container;
    console.log(clientHeight, clientWidth);

    // Create Scene
    this.scene = new THREE.Scene();

    // Create Camera
    const aspectRatio = clientWidth / clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 5;

    // Create Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(clientWidth, clientHeight);
    container.appendChild(this.renderer.domElement);

    // Add Cube to Scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Rotate Cube
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  };

}
