declare module 'mind-ar/dist/mindar-image-three.prod.js' {
    export class MindARThree {
      constructor(config: {
        container: HTMLElement;
        imageTargetSrc: string;
        maxTrack?: number;
        uiLoading?: string;
        uiScanning?: string;
        uiError?: string;
      });
      start(): Promise<void>;
      stop(): void;
      addAnchor(targetIndex: number): {
        group: THREE.Group;
        targetIndex: number;
        onTargetFound: () => void;
        onTargetLost: () => void;
      };
      renderer: THREE.WebGLRenderer;
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
    }
  }