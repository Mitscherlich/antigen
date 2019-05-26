declare module 'seeta' {
  namespace Seeta {
    class Image {
      constructor(path: string);
      public readonly width: number;
      public readonly height: number;
      public readonly channels: number;
      public toBuffer(): Buffer;
    }

    interface FaceRect {
      x: number;
      y: number;
      width: number;
      height: number;
    }

    interface DetectionResult {
      count: number;
      faces: FaceRect[];
    }

    class FaceDetector {
      constructor(model: string);
      public detect(image: Image): Promise<DetectionResult>;
      public detectSync(image: Image): DetectionResult;
    }

    interface Point {
      x: number;
      y: number;
    }

    interface AlignmentResult {
      count: number;
      faces: Array<FaceRect & { points: Point[] }>;
    }

    class PointDetector {
      constructor(model: string);
      public detect(image: Image, detector: FaceDetector): Promise<AlignmentResult>;
      public detectSync(image: Image, detector: FaceDetector): AlignmentResult;
    }

    type CompareResult = number;

    type RecognizeResult = number[];

    class FaceRecognizer {
      constructor(model: string);
      public readonly isOperational: boolean;
      public clear(): void;
      public register(image: Image, detector: FaceDetector, pointer: PointDetector): number;
      public compare(
        images: Image[],
        detector: FaceDetector,
        pointer: PointDetector
      ): Promise<CompareResult>;
      public compareSync(
        images: Image[],
        detector: FaceDetector,
        pointer: PointDetector
      ): CompareResult;
      public recognize(
        image: Image,
        detector: FaceDetector,
        pointer: PointDetector
      ): Promise<RecognizeResult>;
      public recognizeSync(
        image: Image,
        detector: FaceDetector,
        pointer: PointDetector
      ): RecognizeResult;
    }
  }

  export = Seeta;
}
