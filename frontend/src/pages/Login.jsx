import React, { useEffect, useState} from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../services/authAPI";
import { useNavigate } from "react-router-dom";
import { setUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux"


const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  

  const responseGoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await googleAuth(authResult.code);
        const { _id, email, name, profilePicture } = result.data.user;
        const isNewUser = result.data.isNewUser
        const token = result.data.token;
        const obj = { _id, email, name, token, profilePicture };
        localStorage.setItem("user", JSON.stringify(obj));
        dispatch(setUser(obj));

        if (isNewUser) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log("error while login with google", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex justify-center items-center h-screen bg-panel-header-background w-screen flex-col gap-6 ">
      <div className="flex items-center justify-center gap-2 text-white ">
        <img src="/whatsapp.gif" alt="whatsapp" width={300} height={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>

      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg "
        onClick={googleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
};

export default Login;
