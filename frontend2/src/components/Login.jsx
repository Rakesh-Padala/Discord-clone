import React, { useState } from "react";
import login from "../assets/login.avif";
import { Link } from "react-router-dom";
import { ChatState } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Link from "react-router-dom"
// import Link from 'react-router-dom'
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = ChatState();
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const curuser = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password
      });
      if (curuser.data) {
        setUser(curuser.data);
        //console.log(user);
        history('/chats');
      }
    } catch (error) {
      // *************** to do -- print invlid user if wrong *****************
      console.log("Invalid user error")
      console.log(error);
    }
    // console.log(email + " " + password);
  }

  return (
    <div className="flex justify-center items-center gap-10 mt-16">
      <img className="w-1/3 h-auto" src={login} />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-slate-700">Login</h1>
        <form className="shadow-2xl flex flex-col justify-center mt-4 items-center border-2 rounded-lg w-96 gap-6 py-7">
          <div className="flex flex-col justify-start items-center gap-4">
            <p className='mr-[185px]'>Enter Email</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="mr-[185px]">Enter password</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className='shadow-lg hover:bg-blue-800 w-[315px] h-9 bg-blue-500 rounded-full text-white' onClick={handleSubmit}>Submit</button>
          <div className="">
            <Link to="/register"><p className="text-blue-500 hover:underline">Not registerd yet? </p></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;