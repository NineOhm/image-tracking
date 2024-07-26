'use client'

import React, { useEffect, useRef, useState } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';

// Polyfill for sRGBEncoding
if (THREE.ColorManagement) {
  THREE.ColorManagement.enabled = true;
} else {
  // @ts-ignore
  THREE.sRGBEncoding = 3001;
}

const ARScanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindARRef = useRef<MindARThree | null>(null);
  const [revealedContent, setRevealedContent] = useState<string | null>(null);

  useEffect(() => {
    let isComponentMounted = true;

    const startAR = async () => {
      if (!containerRef.current) return;

      // Initialize MindAR
      const mindARThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: '/targets.mind',
      });

      mindARRef.current = mindARThree;
      
      const { renderer, scene, camera } = mindARThree;

      // Create a simple cube as an example of AR content
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, 0);

      // Add the cube to the scene
      const anchor = mindARThree.addAnchor(0);
      anchor.group.add(cube);

      // Event listener for when target is found
      anchor.onTargetFound = () => {
        console.log("Target found");
        showHiddenContent(0);
      };

      try {
        await mindARThree.start();
        if (isComponentMounted) {
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
          });
        }
      } catch (error) {
        console.error("Error starting AR:", error);
      }
    };

    startAR();

    return () => {
      isComponentMounted = false;
      if (mindARRef.current) {
        const mindAR = mindARRef.current as any;
        if (typeof mindAR.stop === 'function') {
        //   mindAR.stop();
        } else {
          console.warn('MindAR stop method not available');
          if (mindAR.video && typeof mindAR.video.stopProcessVideo === 'function') {
            mindAR.video.stopProcessVideo();
          }
        }
      }
    };
  }, []);

  const showHiddenContent = async (targetIndex: number) => {
    try {
      const response = await fetch('/api/reveal-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetIndex })
      });
      const data = await response.json();
      console.log('Revealed code:', data.code);
      setRevealedContent(data.code);
    } catch (error) {
      console.error('Error revealing code:', error);
      setRevealedContent('Error: Could not retrieve content');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
      {revealedContent && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          Revealed Content: {revealedContent}
        </div>
      )}
    </div>
  );
};

export default ARScanner;