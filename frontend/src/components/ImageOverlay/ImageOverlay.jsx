import React from "react";
import "./ImageOverlay.css";

const ImageOverlay = ({ showOverlay, onClose, imageSrc }) => {
  if (!showOverlay) return null;

  return (
    <div className="zoomed-overlay" onClick={onClose}>
      <div className="zoomed-image-container">
        <img src={imageSrc} alt="Zoomed Book Cover" className="zoomed-image" />
      </div>
    </div>
  );
};

export default ImageOverlay;
