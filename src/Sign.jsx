import React from 'react';
import { Navigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useFirebase } from './Initializer';

const SignIn = ({ signInWithGoogle }) => (
    <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button
            variant="contained"
            color="primary"
            onClick={signInWithGoogle}
            sx={{ mb: 2 }}
        >
            Sign in with Google
        </Button>
        <Typography sx={{ fontSize: '20px' }}>
            Welcome to 😎 Pro Chat 😎
        </Typography>
        <Typography>
            a totally original chatting platform
        </Typography>
    </Box>
);

const Sign = () => {
    const { user, auth } = useFirebase();

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    return (
        <>
            {user ? <Navigate to="/chat" /> : <SignIn signInWithGoogle={signInWithGoogle} />}
        </>
    );
};

export default Sign;
