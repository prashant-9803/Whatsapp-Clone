import React from "react";
import { IoClose } from "react-icons/io5";

const PhotoLibrary = ({ setImage, hidePhotoLibrary }) => {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex items-center justify-center">
      <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4 ">
        <div
          className=" cursor-pointer flex items-end justify-end "
          onClick={() => hidePhotoLibrary(false)}
        >
          <IoClose className="h-10 w-10 cursor-pointer" />
        </div>

        <div className="grid grid-cols-3 gap-16 justify-center items-center p-20 w-full">
          {images.map((image, index) => (
            <div
              onClick={() => {
                setImage(images[index]);
                hidePhotoLibrary(false);
              }}
            >
              <div className="h-24 w-24 cursor-pointer ">
                <img src={image} alt="avatar" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoLibrary;
