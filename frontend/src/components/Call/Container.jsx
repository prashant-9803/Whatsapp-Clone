import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import { MdOutlineCallEnd } from "react-icons/md";
import { setEndCall } from "../../slices/uiSlice";
import axios from "axios";
import { GET_CALL_TOKEN } from "../../utils/ApiRoutes";


const Container = ({ data }) => {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  console.log("Data:", data);

  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

  useEffect(() => {
    if (data?.type === "out-going") {
      socket.current.on("accept-call", () => {
        setCallAccepted(true);
      });
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`${GET_CALL_TOKEN}/${user._id}`);
        console.log("token", response.data.token);
        const returnedToken = response.data.token;
        setToken(returnedToken);
      } catch (error) {
        console.log(error);
      }
    };
    getToken()
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            parseInt(import.meta.env.VITE_ZEGO_APP_ID),
            import.meta.env.VITE_ZEGO_SERVER_SECRET
          );

          setZgVar(zg);
          zg.on(
            "roomStreamUpdate",
            async (roomId, updateType, streamList, extendedData) => {
              if (updateType === "ADD") {
                const remVideo = document.getElementById("remote-video");
                const vd = document.createElement(
                  data?.callType === "video" ? "video" : "audio"
                );
                vd.id = streamList[0].streamID;
                vd.autoplay = true;
                vd.playsInline = true;
                vd.muted = false;

                if (remVideo) {
                  remVideo.appendChild(vd);
                }

                zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                }).then((stream) => {
                  vd.srcObject = stream;
                });
              } else if (
                updateType === "DELETE" &&
                zg &&
                localStream &&
                streamList[0].streamID
              ) {
                zg.destroyStream(localStream);
                zg.stopPublishingStream(streamList[0].streamID);
                zg.logoutRoom(data?.roomId.toString());
                dispatch(setEndCall());
              }
            }
          );

          await zg.loginRoom(
            data?.roomId.toString(),
            token,
            { userID: user?._id.toString(), userName: user?.name },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data?.callType === "video" ? true : false,
            },
          });

          const localVideo = document.getElementById("local-audio");
          const videoElement = document.createElement(
            data?.callType === "video" ? "video" : "audio"
          )
          videoElement.id = "video-local-zego"
          videoElement.className = "w-32 h-28 "
          videoElement.autoplay = true;
          videoElement.muted = false;
          videoElement.playsInline = true;
          localVideo.appendChild(videoElement);

          const td = document.getElementById("video-local-zego");
          td.srcObject = localStream;
          const streamID = '123' + Date.now() 
          setPublishStream(streamID)       
          setLocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
        }
      );
    };

    if(token) {
      startCall()
    }
  }, [token]);


  const endCall = () => {
    const id = data?._id;
    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", { from: id });
      if(zgVar && localStream && publishStream) {
        zgVar.destroyStream(localStream);
        zgVar.stopPublishingStream(publishStream);
        zgVar.logoutRoom(data?.roomId.toString());
      }
    } else {
      socket.current.emit("reject-video-call", { from: id });
    }
    dispatch(setEndCall());
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center ">
        <span className="text-5xl capitalize">{data?.name}</span>
        <span className="text-lg">
          {callAccepted && data?.callType !== "video"
            ? "Ongoing Call"
            : "Calling..."}
        </span>
      </div>
      {(!callAccepted || data?.callType === "audio") && (
        <div className="my-24">
          <img
            src={data?.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}

      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>

      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full ">
        <MdOutlineCallEnd
          onClick={endCall}
          className="text-3xl cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Container;
