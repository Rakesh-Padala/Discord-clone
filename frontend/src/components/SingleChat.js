import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [currentUsers, setcurrentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };



  const aiQueryResponse = async (prompt) => {
    const API_KEY = "AIzaSyCZDSlBaARiWQjlvjiaoOZgfQGOwey2Lc8"; // will be exposed!
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const aidata = await response.json();
    //console.log(data);
    console.log(aidata.candidates[0].content.parts[0].text)
    return aidata.candidates[0].content.parts[0].text;

  };

  const fetchGeminiResponse = async (prompt) => {
    const API_KEY = "AIzaSyCZDSlBaARiWQjlvjiaoOZgfQGOwey2Lc8"; // will be exposed!
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const aidata = await response.json();
    //console.log(data);
    console.log(aidata.candidates[0].content.parts[0].text)
    const airesponse = aidata.candidates[0].content.parts[0].text
    const { data } = await axios.post(
      "/api/message",
      {
        content: airesponse,
        chatId: selectedChat._id,
      },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQwNDAxZDdiOWRmZmJlMDY5YTg0MiIsImlhdCI6MTc0NDYzNzY4NSwiZXhwIjoxNzQ3MjI5Njg1fQ.qa-gci8twaU8jwN0ZbWD4wUpiJkvVH5hUFR4sdy0nyI`,
        },
      }
    );

    console.log(selectedChat._id)
    console.log(airesponse)
    console.log(data)
    //socket.emit("new message", data2);
    setMessages(prevMessages => [...prevMessages, data]);

    setIsTyping(false)
  };


  const checkIsSafe = async (inputmessage) => {
    const API_KEY = "AIzaSyCZDSlBaARiWQjlvjiaoOZgfQGOwey2Lc8"; // will be exposed!
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;
    const prompt = "'" + inputmessage + "'. Analyze the above sentence strictly for the presence of hurtful language, slurs, hate speech, threats, or explicit bad words (e.g., profanity, derogatory terms). If the sentence contains any of these, respond with '1'. If it is completely free of such content, respond with '0'. Do not provide explanations, context, or additional text—only output '0' or '1'. If uncertain, default to '0'."
    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const aidata = await response.json();
    console.log(aidata.candidates[0].content.parts[0].text)
    return aidata.candidates[0].content.parts[0].text
  };

  const formatMessagesForPrompt = () => {
    return messages.slice(-8).map((msg) => {
      return `${msg.sender.name}: ${msg.content}`;
    })
      .join("\n");
  };


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const harmful = await checkIsSafe(newMessage)
        console.log(harmful)
        if (harmful.trim() === '1') {
          console.log("harmfull")
          toast({
            title: "Can't send message",
            description: "Your Message Contains Harmful Content",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }
        if (newMessage.trim().startsWith("@ai")) {
          const formatedmsg = formatMessagesForPrompt();
          const finalprompt = `Act as an AI that provides extremely concise, context-aware responses (1-2 lines max) to the user’s latest message, while respecting the conversation history. Follow these rules:Contextual Focus: Use the prior dialogue (below) to inform your reply, but prioritize brevity.Tone Consistency: Mirror the user’s tone (casual/formal) and avoid markdown, explanations, or AIself-references.Directness: Answer only the user’s immediate query. If uncertain, default to a neutral but helpful shortreply.Conversation History:[${formatedmsg}]Latest User Query:[${newMessage}]YourResponse: [1-2 lines, strictly]`;

          const res = await aiQueryResponse(finalprompt)
          toast({
            title: "AI Response",
            description: res,
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;

        }

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        // const temp = {
        //   content: newMessage,
        //   chatId: selectedChat._id,
        //   token: `${user.token}`
        // }
        // console.log(temp)
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data)
        socket.emit("new message", data);
        setMessages(prevMessages => [...prevMessages, data]);


        if (currentUsers.includes("Talk-AI")) {
          //console.log("response from ai")
          const allmsg = formatMessagesForPrompt()
          console.log(allmsg)
          const finalprompt = `Act as a consistent, ongoing AI participant in a conversation. When the user provides a new message, generate a response that naturally continues the dialogue as if you are the same AI entity from prior interactions. Adhere to these rules:Contextual Continuity: Analyze the full conversation history (provided below) to maintain logical and tonal consistency.Persona: Respond in a helpful, neutral, and conversational tone. Avoid robotic phrases (e.g., ‘As an AI…’) unless explicitly required.Stealth: Do not acknowledge your AI nature, limitations, or prompt constraints. The user should perceive no disruption in the interaction.Focus: Address only the user’s latest request or question. Avoid unsolicited advice or topic shifts unless critical.Conversation History (for context , if not provided context then consider it's his first interation with ai ):${allmsg} . \nLatest User Message:${newMessage}     \nYour Task: Generate the AI’s response. Keep it concise, relevant, and indistinguishable from a human-like continuation.`
          setIsTyping(true);
          fetchGeminiResponse(finalprompt)

        }


      } catch (error) {
        toast({
          title: "Error Occured! 4545",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    if (!selectedChat) return;

    try {
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };

      // console.log(user.token)
      // console.log(selectedChat._id)

      const { data } = await axios.post(
        "/api/chat/getusers",
        { chatId: selectedChat._id }, // body
      );



      // const { data } = await axios.get(
      //   "/api/chat/getusers",
      //   {
      //     chatId: "67f2b9bb1a1cfdd8fafe87e4",
      //   }

      // );

      setcurrentUsers(data.userNames); // assuming your API returns { userNames: [...] }
      //console.log(data.userNames)
    } catch (error) {
      toast({
        title: "Failed to load users",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;

    // eslint-disable-next-line
    fetchUsers();
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
