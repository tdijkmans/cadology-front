import { Injectable } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';

@Injectable({
  providedIn: 'root'
})
export class PosenetService {
  private model: posenet.PoseNet | null = null;

  async loadModel(): Promise<void> {
    this.model = await posenet.load();
  }

  async estimatePose(videoElement: HTMLVideoElement): Promise<posenet.Pose | null> {
    if (!this.model) {
      console.error('PoseNet model is not loaded.');
      return null;
    }
    return await this.model.estimateSinglePose(videoElement, {
      flipHorizontal: false,
    });
  }
}
