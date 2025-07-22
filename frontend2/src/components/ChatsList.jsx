import { CircleUserRound } from 'lucide-react';
import { React, useEffect } from 'react';
import { ChatState } from '../context/ContextProvider';
import axios from 'axios';
import { getOtherUser, getTrimmedChat } from '../utils/chatlistutils';

const ChatsList = () => {
  const { user, userChats, setUserChats } = ChatState();
  const api = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  });


  async function fetchChats() {
    try {
      //console.log(user);
      const response = await api.get('/api/chat', {});
      if (response.data) {
        console.log(response.data);
        setUserChats(response.data);
      }
    } catch (error) {
      console.log("Invalid user token ", error);
    }
  }
  useEffect(() => {
    fetchChats();

    // return () => {
    //   second
    // }
  }, [])


  return (
    <div>
      <div className="drop-shadow-2xl border-r-1 h-screen w-96 bg-gradient-to-r from-indigo-100 from-10% via-sky-200 via-30% to-emerald-100 text-slate-800">

        {/* Sticky Header */}
        <div className="drop-shadow-2xl p-2 flex justify-center items-center gap-8 h-20 bg-white sticky top-0 z-10">
          <h1 className="text-3xl">My Chats</h1>
          <button className="cursor-pointer shadow-lg hover:bg-blue-800 w-auto p-1 h-9 bg-blue-500 rounded-full text-white">
            New Group Chat+
          </button>
        </div>

        {/* Scrollable Chat List */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto bg-white flex flex-col justify-start items-center px-2">
          {userChats.map((curchat, index) => (
            <div
              key={curchat._id}
              className="flex justify-start items-center gap-6 w-full h-20 bg-blue-300 mt-3 hover:bg-blue-200 cursor-pointer rounded-2xl px-4"
            >
              <CircleUserRound className="w-8 h-10" />
              {/* <p className="text-xl">{name}</p> */}
              <div>
                {
                  (curchat.chatName === "sender") ? (
                    <p className="text-xl">{getOtherUser(curchat, user)}</p>
                  ) : (
                    <p className="text-xl">{curchat.chatName}</p>
                  )
                }
                {/* <p className="text-sm">{curchat.latestMessage.sender.name}</p> */}
                {
                  curchat.latestMessage ? (
                    <div className="text-sm">
                      <span>
                        {curchat.latestMessage.sender.name}:
                      </span>{' '}
                      <span>
                        {getTrimmedChat(curchat.latestMessage.content)}
                      </span>
                    </div>
                  ) : (
                    <div>No messages yet.</div>
                  )
                }
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ChatsList;
