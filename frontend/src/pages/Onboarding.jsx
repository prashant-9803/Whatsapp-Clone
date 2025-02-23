import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/common/Input";
import Avatar from "../components/common/Avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ONBOARD_USER_ROUTE } from "../utils/ApiRoutes";
import { setUser } from "../slices/authSlice";


const Onboarding = () => {
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const onboardUserHandler = async () => {
    if (validateDetails()) {
      const email = user.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });

        if (data.success) {
          const { _id, email, name, profilePicture, about } = data.user;
          const token = data.token;
          const obj = { _id, email, name, token, profilePicture, about };
          localStorage.setItem("user", JSON.stringify(obj));
          dispatch(setUser(obj));
          navigate("/");
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center  ">
      <div className="flex items-center justify-center w-[20%]">
        <img src="/whatsapp.gif" alt="whatsapp"></img>
        <span className="text-7xl">Whatsapp</span>
      </div>

      <h2 className="text-2xl">Create Your Profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex capitalize flex-col items-center justify-center mt-5 gap-6">
          <Input
            name="Display Name"
            state={name}
            setState={setName}
            label={true}
          />
          <Input name="About" state={about} setState={setAbout} label={true} />
          <div className="flex items-center justify-center ">
            <button
              className="flex items-center justify-center gap-7 bg-search-input-container-background px-4 py-2 rounded-lg text-white "
              onClick={onboardUserHandler}
            >
              Create Profile
            </button>
          </div>
        </div>

        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
