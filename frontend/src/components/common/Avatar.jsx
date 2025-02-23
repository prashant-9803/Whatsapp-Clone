import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

const Avatar = ({ type, image, setImage }) => {
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);

  useEffect(() => {
    if (hover) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300); // Match the duration of the opacity transition
      return () => clearTimeout(timeout);
    }
  }, [hover]);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoordinates({
      x: e.pageX,
      y: e.pageY,
    });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: "Take Photo",
      callback: () => {
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ];

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (e) {
      data.src = e.target.result;
      data.setAttribute("data-src", e.target.result);
    };

    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center ">
        {type == "sm" && (
          <div className="relative h-10 w-10 ">
            <img src={image} alt="avatar" className="rounded-full" />
          </div>
        )}

        {type == "lg" && (
          <div className="relative h-14 w-14 ">
            <img src={image} alt="avatar" className="rounded-full" />
          </div>
        )}

        {type == "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 transition-opacity duration-300 ${
                hover ? "opacity-100" : "opacity-0"
              } ${visible ? "visible" : "invisible"}`}
              id="context-opener"
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera
                onClick={(e) => showContextMenu(e)}
                className="text-2xl"
                id="context-opener"
              />
              <span id="context-opener" onClick={(e) => showContextMenu(e)}>
                Change
                <br /> Profile Photo
              </span>
            </div>
            <div className="flex items-center justify-center h-60 w-60">
              <img
                src={image}
                alt="avatar"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextMenuCoordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      
      {showCapturePhoto && (
        <CapturePhoto setImage={setImage} hide={setShowCapturePhoto}/>
      )}

      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}

      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
};

export default Avatar;
