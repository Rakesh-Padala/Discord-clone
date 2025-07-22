import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

const userContext = createContext(null);

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [userChats, setUserChats] = useState([]);
    return (
        <userContext.Provider value={
            { user, setUser, userChats, setUserChats }
        }>
            {children}
        </userContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(userContext);
};

export default ContextProvider;