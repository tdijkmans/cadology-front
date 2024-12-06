import { CommonModule } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  type ElementRef,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { AngleGaugeComponent } from '@components/angle-gauge/angle-gauge.component';
import { PosenetService } from '@services/posenet/posenet.service';
import {
  ChartCommonModule,
  Color,
  LineChartModule,
} from '@swimlane/ngx-charts';
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
import { PageComponent } from '../../components/page/page.component';

const parts: Record<posenet.Keypoint['part'], string> = {
  leftAnkle: 'green',
  leftHip: 'green',
  leftKnee: 'green',

  rightAnkle: 'blue',
  rightHip: 'blue',
  rightKnee: 'blue',

  rightElbow: 'grey',
  leftElbow: 'grey',
  leftShoulder: 'grey',
  leftWrist: 'grey',
  leftEar: 'grey',
  leftEye: 'grey',
  nose: 'grey',
  rightEar: 'grey',
  rightEye: 'grey',
  rightWrist: 'grey',
  rightShoulder: 'grey',
} as const;

const leftKneeColor = parts['leftKnee'];
const rightKneeColor = parts['rightKnee'];

// https://github.com/nicknochnack/PosenetRealtime/blob/master/src/App.js

@Component({
  selector: 'cad-video',
  standalone: true,
  imports: [
    CommonModule,
    AngleGaugeComponent,
    ChartCommonModule,
    LineChartModule,
    PageComponent,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements AfterViewInit, OnInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  public pose: posenet.Pose | null = null;
  public kneeAngleLeft = {
    name: 'Linkerknie',
    value: 0,
    color: leftKneeColor,
  };
  public kneeAngleRight = {
    name: 'Rechterknie',
    value: 0,
    color: rightKneeColor,
  };
  public kneeAnglesTrace = [{ left: 0, right: 0 }];
  public poseConfideceThreshold = 0.5;
  public confidence = false;

  results = [{ name: '', series: [{ name: 0, value: 0 }] }];
  colorScheme = { domain: ['yellow', 'purple'] } as Color;

  constructor(private poseNetService: PosenetService) {}

  ngOnInit() {
    tf.setBackend('webgl');
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
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.width = video.videoWidth;
    video.height = video.videoHeight;

    if (!ctx) {
      return;
    }
    this.detectPose(ctx, video);
  }
  async detectPose(
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
  ): Promise<void> {
    const pose = await this.poseNetService.estimatePose(video);

    if (!pose) {
      return;
    }

    const confidence = (pose?.score || 0) > this.poseConfideceThreshold;
    this.confidence = confidence;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (pose && confidence) {
      this.pose = pose;
      this.poseNetService.drawPose(pose, ctx, parts);

      const left = this.poseNetService.calculateKneeAngle(pose, 'left');
      const right = this.poseNetService.calculateKneeAngle(pose, 'right');

      this.kneeAngleLeft = { ...this.kneeAngleLeft, value: left };
      this.kneeAngleRight = { ...this.kneeAngleRight, value: right };
      this.kneeAnglesTrace = this.kneeAnglesTrace.concat({ left, right });
      this.results = [
        {
          name: 'Kniehoek Links',
          series: this.kneeAnglesTrace.map((d, i) => ({
            name: i,
            value: d.left,
          })),
        },
        {
          name: 'Kniehoek Rechts',
          series: this.kneeAnglesTrace.map((d, i) => ({
            name: i,
            value: d.right,
          })),
        },
      ];
    }
    requestAnimationFrame(this.detectPose.bind(this, ctx, video));
  }

  public resetTrace(): void {
    this.kneeAnglesTrace = [{ left: 0, right: 0 }];
  }
}
