import React, { useState } from "react";
import axios from "axios";
import { Col, Container, Row, Spinner } from "reactstrap";

function App() {
  const [inputFile, setInputFile] = useState(null);
  const [fps, setFps] = useState(30);
  const [bitrate, setBitrate] = useState(1000);
  const [video, setVideo] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!inputFile) {
      alert("Please select a video file");
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during upload:", error);
    }
  };

  return (
    <>
      <Container fluid>
        <Container>
          <Row className="justify-content-center py-5">
            <Col
              lg={6}
              className="p-3 border border-1 border-inherit"
              style={{ borderRadius: "16px" }}
            >
              <Row className="border-bottom">
                <Col className="text-center">
                  <h1>Video Compression App</h1>
                </Col>
              </Row>
              <Row className="my-3">
                <Col>
                  <input
                    type="file"
                    onChange={(e) => setInputFile(e.target.files[0])}
                  />
                </Col>
              </Row>
              <Row className="my-3">
                <Col>
                  <label>Bitrate (kbps):</label>
                  <input
                    type="number"
                    className="form-control"
                    value={bitrate}
                    onChange={(e) => setBitrate(e.target.value)}
                  />
                </Col>

                <Col>
                  <label>FPS:</label>
                  <input
                    type="number"
                    value={fps}
                    className="form-control"
                    onChange={(e) => setFps(e.target.value)}
                  />
                </Col>
              </Row>
              <Row className="my-3">
                <Col>
                  <button
                    disabled={isLoading}
                    className="w-100 btn btn-md btn-block btn-primary"
                    onClick={handleUpload}
                  >
                    {isLoading ? <Spinner /> : "Compress"}
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
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
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default App;
