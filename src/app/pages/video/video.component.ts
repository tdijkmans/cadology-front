import { CommonModule } from "@angular/common";
import {
  type AfterViewInit,
  Component,
  type ElementRef,
  type OnInit,
  ViewChild,
} from "@angular/core";
import { AngleGaugeComponent } from "@components/angle-gauge/angle-gauge.component";
import { PosenetService } from "@services/posenet/posenet.service";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

const parts: Record<posenet.Keypoint["part"], string> = {
  leftAnkle: "green",
  leftHip: "green",
  leftKnee: "green",

  rightAnkle: "blue",
  rightHip: "blue",
  rightKnee: "blue",

  rightElbow: "grey",
  leftElbow: "grey",
  leftShoulder: "grey",
  leftWrist: "grey",
  leftEar: "grey",
  leftEye: "grey",
  nose: "grey",
  rightEar: "grey",
  rightEye: "grey",
  rightWrist: "grey",
  rightShoulder: "grey",
} as const;

// https://github.com/nicknochnack/PosenetRealtime/blob/master/src/App.js

@Component({
  selector: "cad-video",
  standalone: true,
  imports: [CommonModule, AngleGaugeComponent],
  templateUrl: "./video.component.html",
  styleUrl: "./video.component.scss",
})
export class VideoComponent implements AfterViewInit, OnInit {
  @ViewChild("video") videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild("canvas") canvasElement!: ElementRef<HTMLCanvasElement>;

  public pose: posenet.Pose | null = null;
  public kneeAngleLeft = {
    name: "Linkerknie",
    value: 0,
    color: parts["leftKnee"],
  };
  public kneeAngleRight = {
    name: "Rechterknie",
    value: 0,
    color: parts["rightKnee"],
  };
  public kneeAnglesTrace = [{ left: 0, right: 0 }];
  public poseConfideceThreshold = 0.5;
  public confidence = false;

  constructor(private poseNetService: PosenetService) { }

  ngOnInit() {
    tf.setBackend("webgl");
  }

  async ngAfterViewInit() {
    await this.setupCamera();
    await this.poseNetService.loadModel();
    this.startPoseDetection();
  }

  async setupCamera(): Promise<void> {
    const video = this.videoElement.nativeElement;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    video.srcObject = stream;
    await video.play();
  }

  async startPoseDetection(): Promise<void> {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // This appears to be necessary for proper positioning of keypoints
    video.width = video.videoWidth;
    video.height = video.videoHeight;


    if (!ctx) { return; }
    this.detectPose(ctx, video);
  }
  async detectPose(ctx: CanvasRenderingContext2D, video: HTMLVideoElement): Promise<void> {
    const pose = await this.poseNetService.estimatePose(video);

    if (!pose) {
      return;
    }

    const confidence = (pose?.score || 0) > this.poseConfideceThreshold;
    this.confidence = confidence;

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (pose && confidence) {
      this.pose = pose;
      this.drawPose(pose, ctx);
      const [left, right] = [
        this.calculateKneeAngle(pose, "left"),
        this.calculateKneeAngle(pose, "right"),
      ];
      this.kneeAngleLeft = { ...this.kneeAngleLeft, value: left, };
      this.kneeAngleRight = { ...this.kneeAngleRight, value: right, };
      this.kneeAnglesTrace = this.kneeAnglesTrace.concat({ left, right });
    }
    requestAnimationFrame(this.detectPose.bind(this, ctx, video));
  };

  drawPose(
    pose: posenet.Pose,
    ctx: CanvasRenderingContext2D,
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

  calculateKneeAngle(
    pose: posenet.Pose,
    side: "left" | "right" = "left",
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
}
