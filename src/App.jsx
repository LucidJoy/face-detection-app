import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

import "./App.css";

function App() {
  const imageRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // console.log(detections);
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
      imageRef.current
    );

    faceapi.matchDimensions(canvasRef.current, {
      width: "940",
      height: "650",
    });

    const resized = faceapi.resizeResults(detections, {
      width: "940",
      height: "650",
    });

    faceapi.draw.drawDetections(canvasRef.current, resized);
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((err) => console.log(err));
    };
    imageRef.current && loadModels();
  }, []);

  return (
    <div className="app">
      <img
        crossOrigin="anonymous"
        ref={imageRef}
        src="https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt=""
        width="940"
        height="650"
      />
      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default App;
