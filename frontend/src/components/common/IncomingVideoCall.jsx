import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEndCall, setIncomingVideoCall, setVideoCall } from "../../slices/uiSlice";
import { SocketContext } from "../../context/SocketContext";

const IncomingVideoCall = () => {

  const { incomingVideoCall } = useSelector((state) => state.ui);
  const {socket} = useContext(SocketContext)
  const dispatch = useDispatch();

  console.log("incoming video call data" , incomingVideoCall);

  const acceptCall = () => {
    dispatch(setVideoCall({
      _id: incomingVideoCall.from._id,
      name: incomingVideoCall.from.name,
      profilePicture: incomingVideoCall.from.profilePicture,
      type: "in-coming",
      callType: incomingVideoCall.callType,
      roomId: incomingVideoCall.roomId
    }));
    socket.current.emit("accept-incoming-call", {id: incomingVideoCall._id});
    dispatch(setIncomingVideoCall(undefined));
  };

  const rejectCall = () => {
    socket.current.emit("reject-video-call", {from: incomingVideoCall.from._id})
    dispatch(setEndCall())
  };

  return (
    <div
      className="h-24 w-80 fixed bottom-8 mb-0 right-6
     z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14 "
    >
      <div>
        <img
          src={incomingVideoCall?.from?.profilePicture}
          alt={"avatar"}
          height={70}
          width={70}
          className="rounded-full"
        />
      </div>

      <div>
        <div>{incomingVideoCall?.from?.name}</div>
        <div className="text-xs ">Incoming Video Call</div>
        <div className="gap-2 flex mt-2 ">
          <button
            className="bg-red-500 p-1 px-3 textsm rounded-full "
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-1 px-3 textsm rounded-full "
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingVideoCall;
