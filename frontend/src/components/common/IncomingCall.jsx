import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import { setEndCall, setIncomingVoiceCall, setVoiceCall } from "../../slices/uiSlice";

const IncomingCall = () => {
  const { incomingVoiceCall } = useSelector((state) => state.ui);
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  console.log("incoming voice call data", incomingVoiceCall);

  const acceptCall = () => {
    dispatch(
      setVoiceCall({
        _id: incomingVoiceCall.from._id,
        name: incomingVoiceCall.from.name,
        profilePicture: incomingVoiceCall.from.profilePicture,
        type: "in-coming",
        callType: incomingVoiceCall.callType,
        roomId: incomingVoiceCall.roomId,
      })
    );
    socket.current.emit("accept-incoming-call", { id: incomingVoiceCall._id });
    dispatch(setIncomingVoiceCall(undefined));
  };

  const rejectCall = () => {
    socket.current.emit("reject-voice-call", {
      from: incomingVoiceCall.from._id,
    });
    dispatch(setEndCall());
  };

  return (
    <div
      className="h-24 w-80 fixed bottom-8 mb-0 right-6
     z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14 "
    >
      <div>
        <img
          src={incomingVoiceCall?.from?.profilePicture}
          alt={"avatar"}
          height={70}
          width={70}
          className="rounded-full"
        />
      </div>

      <div>
        <div>{incomingVoiceCall?.from?.name}</div>
        <div className="text-xs ">Incoming Voice Call</div>
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

export default IncomingCall;
