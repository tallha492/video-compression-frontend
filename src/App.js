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
    formData.append("fps", fps); // Add fps parameter
    formData.append("bitrate", bitrate); // Add bitrate parameter

    try {
      const response = await axios.post(
        "http://compressor.drudotstech.com/compress",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      // Assuming the server response is a base64-encoded video
      const base64Video = response.data;

      // Convert base64 to Blob
      const blob = base64toBlob(base64Video, "video/mp4");

      // Set the Blob as the video source
      setVideo(blob);
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
            src={URL.createObjectURL(video)}
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

const base64toBlob = (base64, mimeType) => {
  const parts = base64.split(",");
  const data = parts[1] ? parts[1] : parts[0];
  const byteCharacters = atob(data);
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
