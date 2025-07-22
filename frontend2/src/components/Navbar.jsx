import React from "react";
import { Bell, CircleUserRound, Search } from 'lucide-react';
import { ChatState } from "../context/ContextProvider";
const Navbar = () => {
  const { user } = ChatState();
  return (
    <div className="sticky top-0 z-20">
      <div className="drop-shadow-lg flex justify-between items-center gap-80 w-auto h-20 bg-gradient-to-r from-indigo-100 from-10% via-sky-200 via-30% to-emerald-100 text-slate-800 ">
        <div className="border border-gray-500 rounded-full flex justify-center items-center gap-1 ml-8">
          <Search className="ml-2" />
          <input className="outline-none p-2" type="text" name="search" placeholder="Search users" />
        </div>
        <div className="">
          <h1 className="text-2xl font-bold"><strong>Talk-A-Tive</strong></h1>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div>
            <Bell />
          </div>
          <div className="cursor-pointer mr-24 flex justify-center items-center gap-1 border border-gray-500 p-1 rounded-full hover:bg-gray-300">
            <CircleUserRound />
            <p>{user.name}</p>
            {
              console.log(user)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
