// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Component, Component2, Component3, Vector } from "../../imports/Frame1-2-247";

interface VrHudAframeProps {
  altitude: string;
  bpm: string;
  timeText: string;
  tempAmb: string;
  tempObj: string;
  videoSrc: string;
  batteryText?: string;
  mapSrc?: string;
  minimalDescenteHud?: boolean;
}

export default function VrHudAframe({
  altitude,
  bpm,
  timeText,
  videoSrc,
  batteryText = "--",
  mapSrc,
  minimalDescenteHud = false,
}: VrHudAframeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "black",
        overflow: "hidden",
      }}
    >
      {!isPlaying && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.85)",
            pointerEvents: "auto",
          }}
        >
          <button
            style={{
              padding: "16px 36px",
              borderRadius: 14,
              background: "#0e7875",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
              border: "2px solid #6AD2CA",
              cursor: "pointer",
              boxShadow: "0 0 24px rgba(106,210,202,0.4)",
            }}
            onClick={() => {
              videoRef.current?.play();
              setIsPlaying(true);
            }}
          >
            ▶ Lancer la vidéo VR
          </button>
        </div>
      )}

      <a-scene
        vr-mode-ui="enabled: true"
        loading-screen="enabled: false"
        device-orientation-permission-ui="enabled: false"
        style={{ position: "absolute", inset: 0 }}
      >
        <a-assets>
          <video
            id="bg-video-af"
            ref={videoRef}
            src={videoSrc}
            crossOrigin="anonymous"
            autoPlay
            loop
            muted
            playsInline
          />
        </a-assets>

        <a-videosphere src="#bg-video-af" rotation="0 -90 0" />

        <a-camera id="af-camera" position="0 1.6 0" look-controls="pointerLockEnabled: false" />
      </a-scene>

      {minimalDescenteHud && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: "auto",
              aspectRatio: "1628 / 916",
              width: "100%",
              height: "auto",
              maxHeight: "100%",
            }}
          >
            <div className="absolute" style={{ left: "2.92%", top: "5.97%" }}>
              <Component className="!static !w-[169px] !h-[169px]" mapSrc={mapSrc} />
            </div>
            <div className="absolute z-50" style={{ right: "0%", top: "0px" }}>
              <Component3
                className="!static !w-[298px] !h-[94px]"
                timeText={timeText}
                batteryText={batteryText}
              />
            </div>
            <div className="absolute" style={{ left: "0.08%", top: "80.2%" }}>
              <Vector className="!static !w-[430px] !h-[191px]" altitudeText={minimalDescenteHud ? "2034" : altitude} />
            </div>
            <div className="absolute" style={{ left: "73.49%", top: "80.2%" }}>
              <Component2 className="!static !w-[430px] !h-[191px]" bpmText={minimalDescenteHud ? "120" : bpm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
