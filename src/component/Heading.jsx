import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Drawer, Typography, Button, List, ListItemText, ListItemIcon, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import UserIcon from "./UserIcon";
import LogoutIcon from '@mui/icons-material/Logout';
import GitHubIcon from '@mui/icons-material/GitHub';
import CallIcon from '@mui/icons-material/Call';
import { useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

function MenuThing({ setDarkMode, darkMode, userImg, userName, userSignOut }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const setDarkModeOn = () => {
    setDarkMode(true);
    document.cookie = "color=dark;max-age=100000";
    handleClose();
  };
  const setLightModeOn = () => {
    setDarkMode(false);
    document.cookie = "color=light;max-age=100000";
    handleClose();
  }
  function logOut() {
    userSignOut()
    handleClose()
  }
  function redirectProCall() {
    handleClose()
    window.location.href = "/call"
  }
  function redirectProChat() {
    handleClose()
    window.location.href = "/chat"
  }
  function isInChat() {
    const location = useLocation();
    const currentPath = location.pathname;
    if (currentPath == '/chat') {
      return true;
    }
    else {
      return false;
    }
  }
  return (
    <>
      <IconButton color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={handleClose}>
        <List sx={{ width: 250 }}>
          <ListItemButton onClick={handleClose}>
            <ListItemIcon>
              <UserIcon img={userImg} />
            </ListItemIcon>
            <ListItemText primary={userName} />
          </ListItemButton>
          {isInChat() ? <ListItemButton onClick={redirectProCall}>
            <ListItemIcon>
              <CallIcon />
            </ListItemIcon>
            <ListItemText primary='😎 pro call 😎' />
          </ListItemButton> :
            <ListItemButton onClick={redirectProChat}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary='😎 pro chat 😎' />
            </ListItemButton>}
          <ListItemButton onClick={() => {
            window.open('https://github.com/bpn333');
            handleClose()
          }}>
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="@bpn333" />
          </ListItemButton>
          <ListItemButton onClick={darkMode ? setLightModeOn : setDarkModeOn}>
            <ListItemIcon>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
            <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
          </ListItemButton>
          <ListItemButton onClick={logOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

function Title({ title }) {
  return (
    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
      {title ? title : "😎 Pro Chat 😎"}
    </Typography>
  );
}

function Heading({ setDarkMode, darkMode, userImg, userName, userSignOut, title }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <MenuThing setDarkMode={setDarkMode} darkMode={darkMode} userImg={userImg} userName={userName} userSignOut={userSignOut} />
        <Title title={title} />
        <Button color="inherit">
          <UserIcon img={userImg} />
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Heading;
