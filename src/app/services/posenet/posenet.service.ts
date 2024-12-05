import { Injectable } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';

@Injectable({
  providedIn: 'root',
})
export class PosenetService {
  private model: posenet.PoseNet | null = null;

  async loadModel(): Promise<void> {
    this.model = await posenet.load();
  }

  async estimatePose(
    videoElement: HTMLVideoElement,
  ): Promise<posenet.Pose | null> {
    if (!this.model) {
      console.error('PoseNet model is not loaded.');
      return null;
    }
    return await this.model.estimateSinglePose(videoElement, {
      flipHorizontal: false,
    });
  }

  calculateKneeAngle(
    pose: posenet.Pose,
    side: 'left' | 'right' = 'left',
    scoreThreshold = 0.5,
  ): number {
    const hipJoint = pose.keypoints.find((k) => k.part === `${side}Hip`);
    const kneeJoin = pose.keypoints.find((k) => k.part === `${side}Knee`);
    const ankleJoint = pose.keypoints.find((k) => k.part === `${side}Ankle`);

    const [hip, knee, ankle] = [hipJoint, kneeJoin, ankleJoint].map(
      (joint) => joint?.position,
    );
    const scores = [hipJoint, kneeJoin, ankleJoint].map(
      (joint) => joint?.score,
    );

    if (
      hip &&
      knee &&
      ankle &&
      scores.every((score) => score !== undefined && score > scoreThreshold)
    ) {
      const angle =
        Math.atan2(knee.y - hip.y, knee.x - hip.x) -
        Math.atan2(ankle.y - knee.y, ankle.x - knee.x);
      return Math.abs((angle * 180) / Math.PI);
    }
    return 0;
  }

  drawPose(
    pose: posenet.Pose,
    ctx: CanvasRenderingContext2D,
    parts: Record<posenet.Keypoint['part'], string>,
    scoreThreshold = 0.5,
  ): void {
    // Draw keypoints
    for (const keypoint of pose.keypoints) {
      if (keypoint.score > scoreThreshold) {
        // Filter out low-confidence points
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = parts[keypoint.part];
        ctx.fill();
      }

      // Draw skeleton
      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
        pose.keypoints,
        0.5,
      );

      for (const [partA, partB] of adjacentKeyPoints) {
        ctx.beginPath();
        ctx.moveTo(partA.position.x, partA.position.y);
        ctx.lineTo(partB.position.x, partB.position.y);
        ctx.strokeStyle = parts[partA.part];
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
}
