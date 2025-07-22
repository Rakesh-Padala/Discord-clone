import React, { useState } from "react";
import addDoc from "../assets/admin.avif";
import { Link } from "react-router-dom";
const Signup = () => {
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [csp,setCsp] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(userName+" "+password+" "+email+" "+confirmPassword)
    }
  return (
    <div className="flex justify-center items-center h-screen gap-40">
      <div className="w-96 shadow-xl">
        <img className="rounded-xl" src={addDoc} />
      </div>
      <div className="shadow-lg px-3 w-96 h-[575px] my-auto">
        <h1 className="text-center font-semibold text-2xl text-black border-b-2 p-2">Doctor Registration</h1>
        <div>
          <div className="mt-5">
            <p className="ml-1">Enter Username</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full mx-auto' type="text" placeholder="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="mt-5">
            <p className="ml-1">Enter email</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="mt-5">
            <p className="ml-1">Enter password</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="mt-5">
            <p className="ml-1">confirm Password</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="text" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
          <button className='mt-5 ml-5 shadow-lg hover:bg-blue-800 w-[315px] h-9 bg-blue-500 rounded-full text-white' onClick={handleSubmit}>Submit</button>
          <div className="flex justify-center items-center mt-7">
            <Link to="/"><p className="text-blue-500 hover:underline">Already have an account? </p></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
