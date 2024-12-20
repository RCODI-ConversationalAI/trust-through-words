import * as React from "react";
import { useState } from "react";
import {
  Menu,
  MenuItem,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import ReactMarkdown from "react-markdown";
import instruction from "../content/instruction.md";
import { groupWithAnger } from "../content/config";
import introduceToAnger from "../content/introduceToAnger.md";
import introduceToScenario from "../content/introduceToScenario.md";
import { groupWithFAQ } from "../content/config";
import { updateData } from "../utilities/firebase";
import { useUserData } from "../utilities/firebase";
import RemainingTime from "./RemainingTime";
import { remainingTimeText } from "../content/config";
import ContactForm from "./model/ContactForm";
const NavBar = ({ experimentId }) => {
  let [userData] = useUserData(experimentId);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [openContact, setOpenContact] = React.useState(false);
  const [openAbout, setOpenAbout] = React.useState(false);
  const [aboutData, setAboutData] = useState(null);
  const [openAnger, setOpenAnger] = React.useState(false);
  const [angerData, setAngerData] = useState(null);
  const [openScenario, setOpenScenario] = React.useState(false);
  const [ScenarioData, setScenarioData] = React.useState(null);
  const [confirmReading, setConfirmReading] = React.useState(false);
  const [confirmChatbot, setConfirmChatbot] = React.useState(false);
  const [openTime, setOpenTime] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  if (!userData) return <></>;
  if (!userData.Group) {
    userData.Group = null;
  }

  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  const handleOpenAbout = () => setOpenAbout(true);
  const handleCloseAbout = () => setOpenAbout(false);
  fetch(instruction)
    .then((response) => response.text())
    .then((text) => {
      setAboutData(text);
    });

  // const handleOpenAnger = () => setOpenAnger(true);
  const handleCloseAnger = () => setOpenAnger(false);
  if (groupWithAnger.indexOf(userData.Group) > -1) {
    fetch(introduceToAnger)
      .then((response) => response.text())
      .then((text) => {
        setAngerData(text);
      });
  }

  const handleOpenScenario = () => {
    if (!userData.ChatBot && userData.IntroToAnger) {
      if (!userData.openScenario) {
        updateData(`/user/${experimentId}/experiment`, {
          openScenario: true,
        });
      } else {
        updateData(`/user/${experimentId}/experiment`, {
          openScenario: false,
        });
      }
    } else {
      setOpenScenario(true);
    }
  };
  const handleCloseScenario = () => {
    setOpenScenario(false);
  };
  fetch(introduceToScenario)
    .then((response) => response.text())
    .then((text) => {
      setScenarioData(text);
    });

  const handleOpenTime = () => setOpenTime(true);
  const handleCloseTime = () => setOpenTime(false);

  function moreTime() {
    var time = new Date();
    var runout = time.getTime() - userData.CountdownStartTime < 360000;
    updateData(`/user/${experimentId}/experiment`, {
      moreTime: true,
      CountdownStartTime: runout
        ? userData.CountdownStartTime + 1800000
        : time.getTime() - 1800000,
    });
  }

  function handelFinish() {
    updateData(`/user/${experimentId}/experiment`, {
      ChatBotDoneManually: true,
    });
    window.location.href = "/doneChatBot";
  }
  const ConfirmReadingPopup = () => {
    return (
      <Dialog
        open={confirmReading}
        onClose={() => setConfirmReading(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Done Reading"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              You will not be able to access this after you leave the page.{" "}
            </p>
            <p>Are you sure you have all the information you need?</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="blackBtn" onClick={() => setConfirmReading(false)}>
            No
          </Button>
          <Button color="blackBtn" onClick={handelFinish}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const ConfirmChatbotPopup = () => {
    return (
      <Dialog
        open={confirmChatbot}
        onClose={() => setConfirmChatbot(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Done Chatting"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              You should be automatically redirected to the next step after you
              have completed the legal task.{" "}
            </p>
            <p>
              You will not be able to access this online help after you leave
              the page.{" "}
            </p>
            <p>
              Are you sure you have all the information you need and want to
              manually skip to the next step?
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="blackBtn" onClick={() => setConfirmChatbot(false)}>
            No
          </Button>
          <Button color="blackBtn" onClick={handelFinish}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <ConfirmReadingPopup />
      <ConfirmChatbotPopup />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Tenant Help Platform for Chicago
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Typography sx={{ flexGrow: 1 }} />
              {userData.IntroToScenario && (
                <Button
                  onClick={handleOpenScenario}
                  color="error"
                  variant="outlined"
                  sx={{ marginY: "1rem", marginX: "0.5rem" }}
                >
                  {userData.openScenario & !userData.ChatBot ? (
                    <i>Close Scenario</i>
                  ) : (
                    <i>Scenario</i>
                  )}
                </Button>
              )}
              {!userData.ChatBot &&
                userData.IntroToScenario &&
                groupWithFAQ.indexOf(userData.Group) > -1 && (
                  <Button
                    onClick={() => setConfirmReading(true)}
                    color="blackBtn"
                    variant="outlined"
                    sx={{ marginY: "1rem" }}
                  >
                    Done Reading <ChevronRightIcon />
                  </Button>
                )}
              {!userData.ChatBot &&
                userData.IntroToScenario &&
                groupWithFAQ.indexOf(userData.Group) <= -1 && (
                  <Button
                    onClick={() => setConfirmChatbot(true)}
                    color="blackBtn"
                    variant="outlined"
                    sx={{ marginY: "1rem" }}
                  >
                    Done Chatting <ChevronRightIcon />
                  </Button>
                )}
              <IconButton
                size="large"
                aria-label="Menu-bar"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {userData.Instruction && (
                  <MenuItem onClick={(handleCloseNavMenu, handleOpenAbout)}>
                    <Typography textAlign="center">About</Typography>
                  </MenuItem>
                )}
                {/* {groupWithAnger.indexOf(userData.Group) > -1 && (
                  <MenuItem onClick={(handleCloseNavMenu, handleOpenAnger)}>
                    <Typography textAlign="center">Background</Typography>
                  </MenuItem>
                )} */}
                <MenuItem onClick={(handleCloseNavMenu, handleOpenTime)}>
                  <Typography textAlign="center">Remaining Time</Typography>
                </MenuItem>
                <MenuItem onClick={(handleCloseNavMenu, handleOpenContact)}>
                  <Typography textAlign="center">Contact Us</Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {userData.Instruction && (
                <Button
                  onClick={handleOpenAbout}
                  color="blackBtn"
                  variant="outlined"
                  sx={{ marginY: "1rem", marginX: "0.5rem" }}
                >
                  About
                </Button>
              )}
              {/* {groupWithAnger.indexOf(userData.Group) > -1 && (
                <Button
                  onClick={handleOpenAnger}
                color="blackBtn"
                  variant="outlined"
                  sx={{ marginY: "1rem", marginX: "0.5rem" }}
                >
                  Background
                </Button>
              )} */}
              <Button
                onClick={handleOpenTime}
                color="blackBtn"
                variant="outlined"
                sx={{ marginY: "1rem", marginX: "0.5rem" }}
              >
                Remaining Time
              </Button>
              <Button
                onClick={handleOpenContact}
                color="blackBtn"
                variant="outlined"
                sx={{ marginY: "1rem", marginX: "0.5rem" }}
              >
                Contact Us
              </Button>
              <Typography sx={{ flexGrow: 1 }}> </Typography>
              {userData.IntroToScenario && (
                <Button
                  onClick={handleOpenScenario}
                  color="error"
                  variant="outlined"
                  sx={{ marginY: "1rem", marginX: "0.5rem" }}
                >
                  {userData.openScenario & !userData.ChatBot ? (
                    <i>Close Scenario</i>
                  ) : (
                    <i>Scenario</i>
                  )}
                </Button>
              )}
              {!userData.ChatBot &&
                userData.IntroToScenario &&
                groupWithFAQ.indexOf(userData.Group) > -1 && (
                  <Button
                    onClick={() => setConfirmReading(true)}
                    color="blackBtn"
                    variant="outlined"
                    sx={{ marginY: "1rem" }}
                  >
                    Done Reading <ChevronRightIcon />
                  </Button>
                )}
              {!userData.ChatBot &&
                userData.IntroToScenario &&
                groupWithFAQ.indexOf(userData.Group) <= -1 && (
                  <Button
                    onClick={() => setConfirmChatbot(true)}
                    color="blackBtn"
                    variant="outlined"
                    sx={{ marginY: "1rem" }}
                  >
                    Done Chatting <ChevronRightIcon />
                  </Button>
                )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Dialog
        open={openAbout}
        onClose={handleOpenAbout}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className="dialogTitle">
          About
          <IconButton onClick={handleCloseAbout}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <ReactMarkdown children={aboutData} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="blackBtn" onClick={handleCloseAbout}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAnger}
        onClose={handleCloseAnger}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className="dialogTitle">
          Introduce to Anger
          <IconButton onClick={handleCloseAnger}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <ReactMarkdown children={angerData} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="blackBtn" onClick={handleCloseAnger}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openScenario}
        onClose={handleCloseScenario}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className="dialogTitle">
          Scenario
          <IconButton onClick={handleCloseScenario}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <ReactMarkdown children={ScenarioData} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="blackBtn" onClick={handleCloseScenario}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ContactForm
        openContactForm={openContact}
        handleCloseContactForm={handleCloseContact}
        experimentId={experimentId}
      />
      <Dialog
        open={openTime}
        onClose={handleCloseTime}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className="dialogTitle">
          Remaining Time
          <IconButton onClick={handleCloseTime}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {remainingTimeText}{" "}
            <RemainingTime userData={userData} experimentId={experimentId} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!userData.moreTime && (
            <Button color="blackBtn" onClick={() => moreTime()}>
              Add Thirty Minutes
            </Button>
          )}
          <Button color="blackBtn" onClick={handleCloseTime}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default NavBar;
