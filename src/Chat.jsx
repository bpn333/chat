import { Navigate } from 'react-router-dom';
import Heading from './component/Heading';
import Foot from './component/Foot';
import Body from './component/Body';
import Box from '@mui/material/Box';
import { collection, orderBy, query, limit, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useFirebase } from './Initializer';
import { CssBaseline } from '@mui/material';
const Chat = () => {
  const { user, auth, firestore, darkMode, setDarkMode } = useFirebase();
  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(messagesRef, orderBy('time', 'desc'), limit(13));
  const [messages] = useCollectionData(messagesQuery);
  const sendMessage = async (message) => {
    if (user) {
      await addDoc(messagesRef, {
        content: message,
        time: new Date().toISOString(),
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
      {user ? <>
        <CssBaseline />
        <Box>
          <Heading
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            userImg={user.photoURL}
            userName={user.displayName}
            userSignOut={signOut}
          />
          <Body messages={messages && messages.reverse()} darkMode={darkMode} currentUser={user} />
          <Foot sendMsg={sendMessage} />
          <Box sx={{ height: '50px' }} />
        </Box>
      </ > : <Navigate to="/" />}
    </>
  );
};

export default Chat;
