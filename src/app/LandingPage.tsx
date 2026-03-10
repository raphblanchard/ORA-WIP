import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { Link } from "react-router";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const numFrames = 160;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [1, numFrames]);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 1; i <= numFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/media/frames/frame_${paddedIndex}.png`;
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const allReady = imagesLoaded === numFrames;

  useEffect(() => {
    if (!canvasRef.current || !allReady) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const drawFrame = (latestIndex: number) => {
      const frameIndex = Math.min(Math.max(Math.floor(latestIndex), 1), numFrames);
      const img = images[frameIndex - 1];
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        
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
    };

    // Draw first frame immediately
    drawFrame(1);

    const unsubscribe = currentFrameIndex.on("change", drawFrame);
    return () => unsubscribe();
  }, [allReady, currentFrameIndex, images]);

  // Opacities for different blocks of text
  // Each array maps [startFadeIn, fullyVisible, startFadeOut, hidden]
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const text1Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.40, 0.50], [0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.70, 0.80], [0, 1, 1, 0]);
  const buttonOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-white/20">
      
      {!allReady && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out" 
              style={{ width: `${(imagesLoaded / numFrames) * 100}%` }}
            />
          </div>
          <p className="text-sm font-medium text-white/50 uppercase tracking-[0.2em]">Chargement des assets 3D...</p>
        </div>
      )}

      {/* Sticky Scroll Container */}
      <div ref={containerRef} className="relative h-[600vh]">
        
        {/* Sticky viewport content */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
          
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full object-contain md:object-cover max-w-[100vw] pointer-events-none"
          />

          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />

          {/* Texts overlaid on canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 md:p-24">
            
            {/* Main Title - Appears at start */}
            <motion.div style={{ opacity: titleOpacity }} className="absolute z-10 flex flex-col items-center top-[15%]">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
                ORA VISION.
              </h1>
              <p className="mt-6 text-xl md:text-3xl text-white/50 tracking-wide font-light">Une nouvelle dimension s'ouvre à vous.</p>
              
              <div className="mt-24 flex flex-col items-center opacity-60 animate-bounce">
                <span className="text-xs uppercase tracking-[0.2em] mb-2 font-medium">Découvrir la création</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </motion.div>

            {/* Feature 1 */}
            <motion.div style={{ opacity: text1Opacity }} className="absolute left-[5%] md:left-[10%] top-[40%] md:top-[30%] max-w-sm">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Design Intégral.</h2>
              <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                Chaque composant a été repensé pour fusionner esthétique, aérodynamisme et performances d'affichage sans aucun compromis.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div style={{ opacity: text2Opacity }} className="absolute right-[5%] md:right-[10%] bottom-[30%] max-w-sm text-right">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Technologies Optiques.</h2>
              <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                Lentilles de précision capables d'afficher votre environnement de manière fluide, ultra détaillée et sans latence perceptible.
              </p>
            </motion.div>

            {/* End / CTA */}
            <motion.div 
              style={{ opacity: buttonOpacity }} 
              className="absolute z-20 flex flex-col items-center justify-center inset-0 bg-black/40 backdrop-blur-md pointer-events-auto transition-all"
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                Prêt pour l'immersion ?
              </h2>
              <Link 
                to="/vr" 
                className="group relative px-10 py-5 bg-white text-black font-semibold text-lg md:text-xl rounded-full overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Lancer l'expérience VR
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
