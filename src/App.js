import React, { useState, useEffect, useRef } from "react";
import "./App.scss";

// Assets
import Icon from "./images/Icon.png";

// Components
import ProgressBar from "./ProgressBar";

// Main component
const App = () => {
  const [draggingState, setDraggingState] = useState({
    dragging: false,
    file: null,
    error: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const inputRef = useRef(null);
  const logoImageRef = useRef(null);

  const reader = new FileReader();
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingState.dragging) {
      setDraggingState((prevState) => ({
        ...prevState,
        dragging: true,
      }));
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggingState((prevState) => ({
      ...prevState,
      dragging: false,
    }));
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      reader.onloadstart = () => {
        console.log("start...");
        setIsUploading(true);
        setDraggingState((prevState) => ({
          ...prevState,
          file: null,
        }));
      };

      reader.onloadend = () => {
        console.log("end...");
        if (reader.readyState === 2) resolve(reader.result);
        setIsUploading(false);
        setProgressValue(0);
      };

      reader.onprogress = (e) => {
        console.log("progress...");
        let percentLoaded;

        if (e.lengthComputable) {
          percentLoaded = Math.round((e.loaded / e.total) * 100);
          if (percentLoaded < 100) setProgressValue(percentLoaded);
        }
      };

      // reader.onload = () => {
      //   if (reader.readyState === 2) resolve(reader.result);
      // };

      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(file);
    });
  };

  const checkImageFile = async (files, isFileDropped = false) => {
    const res = await readFile(files[0]);

    const image = new Image();
    image.src = res;

    if (image.height !== 100 || image.width !== 100) {
      setDraggingState((prevState) => ({
        ...prevState,
        file: null,
        error: true,
      }));

      inputRef.current.value = null;
    } else {
      setDraggingState((prevState) => ({
        ...prevState,
        error: false,
        file: res,
      }));

      if (isFileDropped) inputRef.current.files = files;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let isValid = false;

    const files = e.dataTransfer.files;
    const file = files[0];

    // Validate file is of type Image and extension is png or jpeg and is simple image
    const fileType = file.type.split("/")[0];
    const fileExtension = file.type.split("/")[1];
    const fileLength = e.dataTransfer.files.length;
    const isRightExtension =
      fileExtension === "png" || fileExtension === "jpeg";

    if (fileLength > 1) {
      setDraggingState((prevState) => ({
        ...prevState,
        error: true,
        dragging: false,
      }));

      return;
    }

    if (fileType !== "image" || !isRightExtension) {
      setDraggingState((prevState) => ({
        ...prevState,
        file: null,
        error: true,
        dragging: false,
      }));
    } else {
      isValid = true;

      setDraggingState((prevState) => ({
        ...prevState,
        dragging: false,
        error: false,
      }));
    }

    if (isValid) checkImageFile(files, isValid);
    else inputRef.current.value = null;
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = inputRef.current.files;

    if (!files) return;

    checkImageFile(files);
  };

  const handleCancelUpload = () => reader.abort();

  return (
    <div className="container">
      <div className="drag-n-drop">
        <div className="drag-n-drop__header">
          <div className="drag-n-drop__title">Company logo</div>
          <div className="drag-n-drop__subtitle">
            Logo should be square, 100px size and in png, jpeg file format.
          </div>
        </div>
        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="drag-n-drop__area"
        >
          <div
            className={`drag-n-drop__inner ${
              draggingState.dragging ? "drag-over" : ""
            }`}
          >
            <div className="drag-n-drop__image-container">
              <ProgressBar value={progressValue} />

              <img
                ref={logoImageRef}
                className="drag-n-drop__image"
                src={draggingState.file ? draggingState.file : Icon}
                alt="icon"
              />
            </div>

            {draggingState.error && (
              <p className="drag-n-drop__error">
                Logo should be square, 100px size and in png, jpeg file format.
              </p>
            )}

            <div className="drag-n-drop__info">
              {isUploading ? (
                <p>
                  Uploading
                  <br />- or -
                </p>
              ) : draggingState.file ? (
                <p>
                  Drag & drop here to replace
                  <br />- or -
                </p>
              ) : (
                <p>
                  Drag & drop here
                  <br />- or -
                </p>
              )}
              {isUploading && (
                <button
                  onClick={handleCancelUpload}
                  className="drag-n-drop__cancel-btn"
                >
                  Cancel
                </button>
              )}
              <label
                className={`drag-n-drop__input-label ${
                  isUploading ? "hide" : ""
                }`}
                htmlFor="image-file"
              >
                {draggingState.file ? (
                  <span>Select file to replace</span>
                ) : (
                  <span>Select file to upload</span>
                )}
              </label>
              <input
                className="drag-n-drop__input-btn"
                type="file"
                ref={inputRef}
                name="image-for-upload"
                id="image-file"
                accept=".jpg, .jpeg, .png"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
