import React from 'react'
import { ChatState } from '../context/ContextProvider'
const ChatArea = () => {
  const { selectedChat } = ChatState();
  return (
    <div>
      {
        // ************************* UI for chat interface ***********************
      }
      {(selectedChat) ?
        (
          <p>{selectedChat.chatName}</p>
        ) :
        (
          <span>Click on a chat to view</span>
        )}
      {console.log("sel doc ", selectedChat)}
    </div>
  )
}

export default ChatArea
