import React from "react";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);

  const imageRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imageRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    setFaces(detections.map((d) => Object.values(d.box)));
  };

  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "yellow";
    faces.map((face) => ctx.strokeRect(...face));
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

  const addFriend = (e) => {
    setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container">
      <div className="left" style={{ width, height }}>
        <img src={url} ref={imageRef} crossOrigin="anonymous" alt="" />
        <canvas
          onMouseEnter={enter}
          ref={canvasRef}
          width={width}
          height={height}
        />
        {faces.map((face, i) => (
          <input
            name={`input${i}`}
            style={{ left: face[0], top: face[1] + face[3] }}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            onChange={addFriend}
          />
        ))}
      </div>

      <div className="right">
        <h1>Share your post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />
        {friends && (
          <span className="friends">
            with <span className="name">{Object.values(friends) + " "}</span>
          </span>
        )}
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost;
