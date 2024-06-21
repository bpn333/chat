import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
const firestore = getFirestore(firebaseApp);
const FirebaseContext = createContext();

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

export const FirebaseProvider = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);
    const [initialized, setInitialized] = useState(false);
    const [darkMode, setDarkMode] = useState(getDarkModeValue());
    useEffect(() => {
        if (!loading) {
            setInitialized(true);
        }
    }, [loading]);

    return (
        <FirebaseContext.Provider value={{ user, auth, firestore, darkMode, setDarkMode }}>
            {initialized ? <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>{children}</ThemeProvider > : <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}><CircularProgress size={100} /></Box>}
        </FirebaseContext.Provider>
    );
};

// Custom hook to use Firebase context
export const useFirebase = () => useContext(FirebaseContext);
