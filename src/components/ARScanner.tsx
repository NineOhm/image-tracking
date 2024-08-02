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
  const mindARRef = useRef<MindARThree[]>([]);
  const [revealedContent, setRevealedContent] = useState<string | null>(null);

  useEffect(() => {
    let isComponentMounted = true;
    const mindARInstances: MindARThree[] = [];

    const startAR = async () => {
      if (!containerRef.current) return;

      const targetFiles = ['/targets1.mind', '/targets2.mind'];
      
      for (let i = 0; i < targetFiles.length; i++) {
        // Initialize MindAR for each target file
        const mindARThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: targetFiles[i],
        });

        mindARInstances.push(mindARThree);

        const { renderer, scene, camera } = mindARThree;

        // Create a cube for this target file
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({ 
          color: i === 0 ? 0x00ff00 : 0xff0000, 
          transparent: true, 
          opacity: 0.7 
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, 0);

        const anchor = mindARThree.addAnchor(0);
        anchor.group.add(cube);

        anchor.onTargetFound = () => {
          console.log(`Target ${i} found`);
          showHiddenContent(i);
        };

        try {
          await mindARThree.start();
          if (isComponentMounted) {
            renderer.setAnimationLoop(() => {
              renderer.render(scene, camera);
            });
          }
        } catch (error) {
          console.error(`Error starting AR for target ${i}:`, error);
        }
      }

      mindARRef.current = mindARInstances;
    };

    startAR();

    return () => {
      isComponentMounted = false;
      mindARInstances.forEach((mindAR) => {
        if (mindAR && typeof mindAR.stop === 'function') {
          // mindAR.stop();
        }
      });
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
      setRevealedContent(`Target ${targetIndex}: ${data.code}`);
    } catch (error) {
      console.error('Error revealing code:', error);
      setRevealedContent(`Error: Could not retrieve content for target ${targetIndex}`);
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