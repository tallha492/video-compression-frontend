import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputFile, setInputFile] = useState(null);
  const [fps, setFps] = useState(30);
  const [bitrate, setBitrate] = useState(1000);
  const [video, setVideo] = useState("");

  const handleUpload = async () => {
    if (!inputFile) {
      alert("Please select a video file");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/compress",
        {
          video: inputFile,
          fps,
          bitrate,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer", // Handle binary data
        }
      );

      const base64Video = arrayBufferToBase64(response.data);
      const blob = base64toBlob(base64Video, "video/mp4");

      setVideo(blob);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during compression.");
    }
  };

  // Function to convert array buffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <div className="App">
      <h1>Video Compression App</h1>
      <input type="file" onChange={(e) => setInputFile(e.target.files[0])} />
      <br />
      <label>FPS:</label>
      <input
        type="number"
        value={fps}
        onChange={(e) => setFps(e.target.value)}
      />
      <br />
      <label>Bitrate (kbps):</label>
      <input
        type="number"
        value={bitrate}
        onChange={(e) => setBitrate(e.target.value)}
      />
      <br />
      <button onClick={handleUpload}>Compress</button>

      <div>
        <video
          src={video && URL.createObjectURL(video)}
          style={{ width: "100%", height: "100vh" }}
          autoPlay
          loop
          
        ></video>
      </div>
    </div>
  );
}

export default App;

// Function to convert base64 to Blob
const base64toBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};
