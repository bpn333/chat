import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Message from "./Message";

function Body(props) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {props.messages && props.messages.map((mes, index) => (
        <Message
          key={index}
          sender={mes.sender}
          content={mes.content}
          time={mes.time}
          darkMode={props.darkMode}
          currentUser={props.currentUser}
          uid={mes.uid}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}

export default Body;
