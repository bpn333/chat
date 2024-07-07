import { useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFirebase } from './Initializer';
import { CssBaseline } from '@mui/material';
import Heading from './component/Heading';
import { collection, updateDoc, addDoc, getDoc, onSnapshot, doc, setDoc } from 'firebase/firestore';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CallIcon from '@mui/icons-material/Call';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { Navigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

function initializeId() {
    let url = new URL(window.location);
    let room_id = url.searchParams.get('id')
    if (room_id) {
        return room_id
    }
}
function updateURL(new_id) {
    let url = new URL(window.location);
    url.searchParams.set('id', new_id);
    window.history.pushState({}, '', url);
}
const Call = () => {
    const [otherName, setOtherName] = useState('')
    const [id, setId] = useState(initializeId())
    const { user, auth, firestore, darkMode, setDarkMode } = useFirebase();
    const [isInCall, setIsInCall] = useState(false)
    const webcamVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const webCamOn = async () => {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            remoteStream = new MediaStream();
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });
            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };
            if (webcamVideoRef.current && remoteVideoRef.current) {
                webcamVideoRef.current.srcObject = localStream;
                remoteVideoRef.current.srcObject = remoteStream;
            }
        }
        catch {
            console.log('error setting webcam and mic')
        }
    };
    async function createCall() {
        setIsInCall(true);
        await webCamOn();
        const callDoc = doc(collection(firestore, 'calls'));
        const offerCandidates = collection(callDoc, 'offerCandidates');
        const answerCandidates = collection(callDoc, 'answerCandidates');

        setId(callDoc.id);
        updateURL(callDoc.id)
        pc.onicecandidate = (event) => {
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
        };

        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
            caller: user.displayName
        };

        await setDoc(callDoc, { offer });

        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            if (data.answer) {
                data.answer.receiver && setOtherName(data.answer.receiver)
            }
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
            }
        });

        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });
    };

    async function answerCall() {
        setIsInCall(true);
        await webCamOn();
        const callId = id;
        const callDoc = doc(collection(firestore, 'calls'), callId);
        const answerCandidates = collection(callDoc, 'answerCandidates');
        const offerCandidates = collection(callDoc, 'offerCandidates');

        pc.onicecandidate = (event) => {
            event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
        };

        const callData = (await getDoc(callDoc)).data();

        const offerDescription = callData.offer;
        setOtherName(callData.offer.caller)
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
            receiver: user.displayName
        };

        await updateDoc(callDoc, { answer });

        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };

    const signOut = () => {
        auth.signOut();
    };

    return (
        <>{user ? <><CssBaseline />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
                <Heading
                    title="😎 Pro Call 😎"
                    userImg={user.photoURL}
                    setDarkMode={setDarkMode}
                    darkMode={darkMode}
                    userName={user.displayName}
                    userSignOut={signOut}
                />

                {isInCall ? <>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: '100vw',
                        margin: '20px auto',
                        padding: '20px',
                        borderRadius: '10px',
                    }}>
                        <Box>
                            <Typography variant="h5" sx={{ mb: 2 }}>local - {user.displayName}</Typography>
                            <Box
                                component="video"
                                ref={webcamVideoRef}
                                autoPlay
                                playsInline
                                sx={{ maxWidth: '100%' }}
                                muted
                            ></Box>
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ mb: 2 }}>remote - {otherName}</Typography>
                            <Box
                                component="video"
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                sx={{ maxWidth: '100%' }}
                            ></Box>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <><Typography variant='h6'>{id}</Typography><Button onClick={() => navigator.clipboard.writeText(window.location.href)}><ContentCopyIcon /></Button></>
                        <Button onClick={() => window.location.href = "/call"} sx={{ backgroundColor: '#FF1744', color: '#FFFFFF' }}><CallEndIcon sx={{ margin: '10px' }} /> End Call</Button>
                    </Box></>
                    :
                    <Box sx={{ margin: 5, textAlign: 'center', display: 'flex', flexDirection: 'column', width: '50vw', justifyContent: 'space-around', height: '50vh' }}>
                        <TextField value={id} onChange={(e) => setId(e.target.value)} variant="standard" size="small" label='call id' />
                        <Button onClick={createCall} sx={{ mr: 2, backgroundColor: '#2979FF', color: '#FFFFFF' }}><AddIcCallIcon /> Create Call</Button>
                        <Button onClick={answerCall} sx={{ mr: 2, backgroundColor: '#00C853', color: '#FFFFFF' }} disabled={!id}><CallIcon /> Answer Call</Button>
                    </Box>}
            </Box>
        </> : <Navigate to="/" />}
        </>
    );
}

export default Call;