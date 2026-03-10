import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react"; // Assuming 'motion' is the package alias in package.json from previous context ('motion': '12.23.24') or framer-motion

export default function ProductScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // We have 160 frames, numbered from 001 to 160.
  const numFrames = 160;

  // Track the scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map the scroll progress (0 to 1) to the frame index (1 to 160)
  const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [1, numFrames]);

  // Preload images state
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    // Preload all 160 images to ensure smooth playback
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= numFrames; i++) {
      const img = new Image();
      // Format the frame number with leading zeros, e.g., 'frame_001.png'
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/media/frames/frame_${paddedIndex}.png`;
      img.onload = () => {
        loadedCount++;
        // If you wanted to show a loading bar, you could track loadedCount here
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Update canvas when the frame index changes
  useEffect(() => {
    if (!canvasRef.current || images.length !== numFrames) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Listen to changes in the currentFrameIndex motion value
    const unsubscribe = currentFrameIndex.on("change", (latest) => {
      // Find the integer index of the frame (round down to keep 1-160 bound correct)
      const frameIndex = Math.min(Math.max(Math.floor(latest), 1), numFrames);

      // Arrays are 0-indexed, so frame 1 is at index 0
      const img = images[frameIndex - 1];

      if (img && img.complete) {
        // Clear previous frame
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        // Draw the image, scaling it to cover or contain within the canvas
        // This is a simple 'contain' drawing approach, but we can make it 'cover' based on aspect ratio
        const canvasProps = canvasRef.current!;
        const canvasAspect = canvasProps.width / canvasProps.height;
        const imgAspect = img.width / img.height;

        let drawWidth = canvasProps.width;
        let drawHeight = canvasProps.height;
        let x = 0;
        let y = 0;

        if (imgAspect > canvasAspect) {
          drawWidth = canvasProps.width;
          drawHeight = canvasProps.width / imgAspect;
          y = (canvasProps.height - drawHeight) / 2;
        } else {
          drawHeight = canvasProps.height;
          drawWidth = canvasProps.height * imgAspect;
          x = (canvasProps.width - drawWidth) / 2;
        }

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
    });

    return () => unsubscribe();
  }, [currentFrameIndex, images]);

  // A helper motion value for fading out title as we scroll down
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div
      ref={containerRef}
      // Make the container tall enough (e.g. 5 times screen height) so we have plenty of room to scroll
      className="relative w-full h-[500vh] bg-black text-white"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Title layer */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute top-20 z-10 text-center flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">ORA Vision</h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-400">Découvrez l'intérieur de l'expérience.</p>
        </motion.div>

        {/* Canvas layer */}
        <div className="relative w-full max-w-7xl aspect-video h-[80vh] flex justify-center items-center z-0">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full object-contain"
          />

          {images.length < numFrames && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/80 z-20">
              Chargement de l'expérience 3D...
            </div>
          )}
        </div>
        
        {/* Helper text for user */}
        <div className="absolute bottom-10 animate-bounce text-gray-500">
          ↓ Scrollez vers le bas
        </div>
      </div>
    </div>
  );
}
