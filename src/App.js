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

    const formData = new FormData();
    formData.append("video", inputFile);
    formData.append("fps", fps);
    formData.append("bitrate", bitrate);

    try {
      const response = await axios.post(
        "http://compressor.drudotstech.com/compress",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      setVideo(videoUrl);
    } catch (error) {
      console.error("Error during upload:", error);
    }
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

      {video && (
        <div>
          <video
            src={video}
            style={{ width: "100%", height: "100vh" }}
            autoPlay
            loop
          ></video>
        </div>
      )}
    </div>
  );
}

export default App;
