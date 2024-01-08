import React, { useState } from "react";
import axios from "axios";
import {
  Col,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

function App() {
  const BaseURL = "https://content.medicalradar.es";

  const [inputFile, setInputFile] = useState(null);
  const [fps, setFps] = useState(30);
  const [bitrate, setBitrate] = useState(1000);
  const [videoDetails, setVideoDetails] = useState({});
  const [video, setVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compressedVideo, setCompressedVideo] = useState(null);
  const [spin, setSpin] = useState(false);

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
      const response = await axios.post(BaseURL + "/api/compress", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const videoBlob = new Blob([response.data], { type: "video/mp4" });

      setVideo(URL.createObjectURL(videoBlob));
      setIsLoading(false);
      convertBlobToFile(URL.createObjectURL(videoBlob), "converted.mp4");
    } catch (error) {
      setIsLoading(false);
      console.error("Error during upload:", error);
    }
  };

  const handleDetails = async () => {
    if (!inputFile) {
      alert("Please select a video file");
      return;
    }

    setSpin(true);

    const formData = new FormData();

    const VideoFile = compressedVideo !== null ? compressedVideo : inputFile;

    formData.append("video", VideoFile);

    try {
      const response = await axios.post(BaseURL + "/api/details", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setVideoDetails(response.data);

      setSpin(false);
    } catch (error) {
      setSpin(false);
      console.error("Error during fetching details:", error);
    }
  };

  function convertBlobToFile(blobUrl, fileName) {
    // Create a new XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open("GET", blobUrl, true);
    xhr.responseType = "blob";

    // When the request is successful, read the Blob data
    xhr.onload = function () {
      if (xhr.status === 200) {
        var blob = xhr.response;

        // Create a new File object using the Blob data
        var file = new File([blob], fileName, { type: blob.type });

        setCompressedVideo(file);
      }
    };

    // Send the XMLHttpRequest
    xhr.send();
  }

  return (
    <>
      <>
        <Container>
          <Row className="justify-content-center py-5 gap-3">
            <Col
              lg={5}
              className="p-3 border border-1 border-inherit"
              style={{ borderRadius: "16px" }}
            >
              <Row className="border-bottom">
                <Col className="text-center">
                  <h1>Video Compressor</h1>
                </Col>
              </Row>
              <Row className="my-3">
                <Col>
                  <input
                    type="file"
                    accept="video/mp4"
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
                    disabled={isLoading || spin}
                    className="w-100 btn btn-md btn-block btn-outline-primary fw-bold"
                    onClick={handleUpload}
                  >
                    {isLoading ? <Spinner /> : "Compress"}
                  </button>
                </Col>
                <Col>
                  <button
                    disabled={isLoading || spin}
                    className="w-100 btn btn-md btn-block btn-outline-danger fw-bold"
                    onClick={() => {
                      handleDetails();
                    }}
                  >
                    {spin ? <Spinner /> : "Details"}
                  </button>
                </Col>
                {video && (
                  <Col>
                    <button
                      disabled={isLoading || spin}
                      onClick={() => setVideoPreview(true)}
                      className="w-100 btn btn-md btn-block btn-outline-success fw-bold"
                    >
                      Preview
                    </button>
                  </Col>
                )}
              </Row>
            </Col>
            {videoDetails.bitrate && videoDetails.fps && (
              <Col
                lg={5}
                className="p-3 border border-1 border-inherit"
                style={{ borderRadius: "16px" }}
              >
                <Row className="border-bottom">
                  <Col className="text-center">
                    <h1>Video Details</h1>
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col className="align-self-center">
                    <h4>Video Bitrate:</h4>
                  </Col>
                  <Col className="align-self-center">
                    <h5>{videoDetails.bitrate}</h5>
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col className="align-self-center">
                    <h4>Video FPS:</h4>
                  </Col>
                  <Col className="align-self-center">
                    <h5>{videoDetails.fps}</h5>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Container>

        <Modal isOpen={videoPreview} size="xl" zIndex={9} centered>
          <ModalHeader
            toggle={() => {
              setVideoPreview(false);
            }}
          >
            Compressed Video
          </ModalHeader>
          <ModalBody>
            <video
              controls
              src={video ? video : ""}
              type="video/mp4"
              className="w-100 h-100"
            ></video>
          </ModalBody>
        </Modal>
      </>
    </>
  );
}

export default App;
