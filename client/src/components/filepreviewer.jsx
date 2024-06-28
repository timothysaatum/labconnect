import { useState, useRef } from "react";
export default function FilePreviewer() {
 
    const filePicekerRef = useRef(null);
  return (
    <div>
      <h1>Preview Image/Video</h1>
      <div className="btn-container">
        <input
          ref={filePicekerRef}
          accept="image/*, video/*"
          onChange={previewFile}
          type="file"
          hidden
        />
        <button className="btn">Choose</button>
        <button className="btn">x</button>
      </div>
      <div className="preview">
        <img src="" alt="" />
        <video controls src=""></video>
      </div>
    </div>
  );
}
