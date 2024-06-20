import { useState } from "react";
import Heading from "./component/Heading";
import Foot from "./component/Foot";
import Body from "./component/Body";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBVNpFJNygS-rRIvV7tc3343bn9cPGGHaA",
    authDomain: "chat-app-aa891.firebaseapp.com",
    projectId: "chat-app-aa891",
    storageBucket: "chat-app-aa891.appspot.com",
    messagingSenderId: "945260063318",
    appId: "1:945260063318:web:0db92054e0f2db52f329f7",
    measurementId: "G-F08GWC056M"
  });
} else {
  firebase.app();
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function getDarkModeValue() {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cok_val = cookies[i].split('=');
    if (cok_val[0] === 'color') {
      return cok_val[1] === "dark";
    }
  }
  return false;
}


function App() {
  const auth = firebase.auth();

  const firestore = firebase.firestore();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('time').limit(25);

  const [messages] = useCollectionData(query);

  const [darkMode, setDarkMode] = useState(getDarkModeValue());
  console.log(darkMode)
  const sendMessage = async (message) => {
    const user = auth.currentUser;
    console.log(user)
    if (user) {
      await messagesRef.add({
        content: message,
        time: new Date().toUTCString(),
        uid: user.uid,
        sender: user.photoURL
      });
    }
  };
  function signOut() {
    auth.signOut()
  }
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box>
        <Heading
          setDarkMode={setDarkMode}
          darkMode={darkMode}
          userImg={auth.currentUser.photoURL}
          userName={auth.currentUser.displayName}
          userSignOut={signOut} />
        <Body messages={messages} darkMode={darkMode} currentUser={auth.currentUser} />
        <Foot sendMsg={sendMessage} />
        <Box sx={{ height: '50px' }} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
