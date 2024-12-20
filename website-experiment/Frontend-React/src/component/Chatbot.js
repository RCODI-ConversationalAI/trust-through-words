import React from "react";
import LoadLandbot from "./model/LoadLandbot";
import {
  groupWithEmpathy,
  groupWithNoEmpathy,
  chatbotEmpathy,
  chatbotNoEmpathy,
} from "../content/config";
import FaqPage from "./FaqPage";
import { Grid, Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import introduceToScenario from "../content/introduceToScenario.md";
import { DialogContent, IconButton, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateData } from "../utilities/firebase";

function Chatbot({ userData, experimentId }) {
  const [ScenarioData, setScenarioData] = React.useState(null);

  const handleOpenScenario = () => {
    if (!userData.openScenario) {
      updateData(`/user/${experimentId}/experiment`, {
        openScenario: true,
      });
    } else {
      updateData(`/user/${experimentId}/experiment`, {
        openScenario: false,
      });
    }
  };
  fetch(introduceToScenario)
    .then((response) => response.text())
    .then((text) => {
      setScenarioData(text);
    });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <br />

      <Grid container>
        <Grid item xs={userData.openScenario ? 9 : 12}>
          {groupWithEmpathy.indexOf(userData.Group) > -1 ? (
            <LoadLandbot
              url={chatbotEmpathy}
              userData={userData}
              experimentId={experimentId}
            />
          ) : groupWithNoEmpathy.indexOf(userData.Group) > -1 ? (
            <LoadLandbot
              url={chatbotNoEmpathy}
              userData={userData}
              experimentId={experimentId}
            />
          ) : (
            <FaqPage />
          )}
        </Grid>
        <Grid
          item
          xs={userData.openScenario ? 3 : 0}
          sx={userData.openScenario ? {} : { display: "none" }}
        >
          <Box className="scenario">
            <DialogTitle id="scroll-dialog-title" className="dialogTitle">
              Scenario
              <IconButton>
                <CloseIcon onClick={handleOpenScenario} />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <ReactMarkdown children={ScenarioData} />
            </DialogContent>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
export default Chatbot;
