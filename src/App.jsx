import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Heading from './component/Heading';
import Foot from './component/Foot';
import Body from './component/Body';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { collection, orderBy, query, limit, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useFirebase } from './FirebaseProvider';
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
      return cok_val[1] === 'dark';
    }
  }
  return false;
}

const App = () => {
  const { user, auth, firestore } = useFirebase();
  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(messagesRef, orderBy('time'), limit(25));
  const [messages] = useCollectionData(messagesQuery);
  const [darkMode, setDarkMode] = useState(getDarkModeValue());
  const sendMessage = async (message) => {
    if (user) {
      await addDoc(messagesRef, {
        content: message,
        time: new Date().toUTCString(),
        uid: user.uid,
        sender: user.photoURL,
      });
    }
  };

  const signOut = () => {
    auth.signOut();
  };
  return (
    <>
      {user ? <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        < CssBaseline />
        <Box>
          <Heading
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            userImg={user.photoURL}
            userName={user.displayName}
            userSignOut={signOut}
          />
          <Body messages={messages} darkMode={darkMode} currentUser={user} />
          <Foot sendMsg={sendMessage} />
          <Box sx={{ height: '50px' }} />
        </Box>
      </ThemeProvider > : <Navigate to="/" />}
    </>
  );
};

export default App;
