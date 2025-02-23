import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { ADD_AUDIO_MESSAGE_ROUTE } from "../../utils/ApiRoutes";
import axios from "axios";
import { addMessage } from "../../slices/messageSlice";

const CaptureAudio = ({ hide }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentChatUser } = useSelector((state) => state.ui);
  const { socket } = useContext(SocketContext);

  const dispatch = useDispatch();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);


  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);



  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveform(waveSurfer);

    waveSurfer.on("finish", () => {
      setisPlaying(false);
    });

    return () => waveSurfer.destroy();
  }, []);



  useEffect(() => {
      if (waveform) handleStartRecording();
    }, [waveform]);
    
    
    useEffect(() => {
      if (recordedAudio) {
        const updatePlaybackTime = () => {
          setCurrentPlaybackTime(recordedAudio.currentTime);
        };
        recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
        return () =>
          recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      }
    }, [recordedAudio]);


    
    const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codec=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);

          setRecordedAudio(audio);

          waveform.load(audioUrl);
        };
        mediaRecorder.start();
      })
      .catch((error) => console.log("Error accessing microphone", error));
  };



  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      waveform.stop();

      const audioChunks = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
        audioChunks.push(e.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };




  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setisPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setisPlaying(false);
  };



  const sendRecording = async () => {
    try {
  
        let formData = new FormData();
        formData.append("audio", renderedAudio);
  
        const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            from: user._id,
            to: currentChatUser._id,
          },
        });
  
        if (response.data.success) {
          socket.current.emit("send-msg", {
            from: user?._id,
            to: currentChatUser?._id,
            message: response.data.message,
          });
  
          console.log(response.data);
          dispatch(
            addMessage({
              ...response.data.message,
              fromSelf: true,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
  };



  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center ">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => hide(false)}
        />
      </div>
      <div
        className="px-4 py-2
         text-white text-lg flex mx-4 gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg "
      >
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center ">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}

        <div className="w-60" ref={waveFormRef} hidden={isRecording} />

        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}

        <audio ref={audioRef} hidden />
      </div>

      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div>
        <MdSend
          className="text-panel-header-icon cursor-pointer mr-4"
          title="Send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
};

export default CaptureAudio;
