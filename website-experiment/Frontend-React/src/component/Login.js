import * as React from "react";
import {
  saveUserToDb,
  oldUserSignIn,
  postData,
  useData,
} from "../utilities/firebase";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import Loading from "../utilities/Loading";
import FooterLogin from "./model/FooterLogin";
import { isMobile } from "react-device-detect";
import MobileWarning from "./model/MobileWarning";
import SonaNotFound from "./model/SonaNotFound";
import { notAccept } from "../content/config";
function Login() {
  const [inputSonaID, setInputSonaID] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openMobileWarning, setOpenMobileWarning] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [popupText, setPopupText] = React.useState(null);
  let [accept, acceptLoading, acceptError] = useData("/open");
  if (isMobile & (openMobileWarning === null)) {
    setOpenMobileWarning(true);
  }

  const handleCloseMobile = () => {
    setOpenMobileWarning(false);
  };
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    // eslint-disable-next-line
    grecaptcha.ready(function () {
      // eslint-disable-next-line
      grecaptcha
        .execute("6LdoQCIhAAAAAMTlfcxRjTrK7Ggmpdhz-OIqdBR1", {
          action: "submit",
        })
        .then(async function (token) {
          const response = (
            await postData("https://api.legalchatbot.org/api/checkSonaID", {
              sonaID: inputSonaID,
              token: token,
            })
          )["result"];
          if (response === "recaptcha") {
            setPopupText(
              "Suspicious behavior detected. Please try again later or try to use a different device. If you continue to experience this issue, please contact us at admin[at]legalchatbot.org"
            );
            setIsLoading(false);
            setOpen(true);
          } else {
            if (response === null) {
              setPopupText("Your SonaID has not been found. Please try again.");
              setIsLoading(false);
              setOpen(true);
            } else if (response === "new") {
              saveUserToDb(inputSonaID);
            } else {
              oldUserSignIn(response);
            }
          }
        });
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {isLoading && <Loading />}

      <SonaNotFound open={open} popupText={popupText} />
      <MobileWarning
        openMobileWarning={openMobileWarning}
        handleCloseMobile={handleCloseMobile}
      />

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Tenant Help Platform for Chicago
          </Typography>
          {accept === false ? (
            <p>{notAccept}</p>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                color="blackBtn"
                fullWidth
                id="sonaID"
                label="Sona ID (4-5 digit number)"
                name="sonaID"
                onChange={(event) => setInputSonaID(event.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                color="blackBtn"
                variant="outlined"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>
      </Container>
      <FooterLogin />
    </Box>
  );
}
export default Login;
