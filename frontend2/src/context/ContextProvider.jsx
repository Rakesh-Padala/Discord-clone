import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

const userContext = createContext(null);

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userChats, setUserChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState({});
    return (
        <userContext.Provider value={
            { user, setUser, userChats, setUserChats, selectedChat, setSelectedChat }
        }>
            {children}
        </userContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(userContext);
};

export default ContextProvider;