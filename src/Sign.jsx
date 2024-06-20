import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import 'firebase/firestore';
import App from "./App";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const firebaseConfig = {
    apiKey: "AIzaSyBVNpFJNygS-rRIvV7tc3343bn9cPGGHaA",
    authDomain: "chat-app-aa891.firebaseapp.com",
    projectId: "chat-app-aa891",
    storageBucket: "chat-app-aa891.appspot.com",
    messagingSenderId: "945260063318",
    appId: "1:945260063318:web:0db92054e0f2db52f329f7",
    measurementId: "G-F08GWC056M"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
function SignIn({ signInWithGoogle }) {
    return (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={signInWithGoogle}
                sx={{ mb: 2 }}
            >
                Sign in with Google
            </Button>
            <Typography color="text.primary" sx={{ fontSize: '20px' }}>
                Welcome to 😎 Pro Chat 😎
            </Typography>
            <Typography color="text.secondary">
                a totally original chatting platform
            </Typography>
        </Box>
    );
}
function Sign() {
    const [user] = useAuthState(auth);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    return (
        <>
            {user ? <App /> : <SignIn signInWithGoogle={signInWithGoogle} />}
        </>
    );
}

export default Sign;
