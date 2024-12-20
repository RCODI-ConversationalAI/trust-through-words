import Button from "@mui/material/Button";
import { useState } from "react";
import Container from "@mui/material/Container";
import { updateData, useUserData } from "../utilities/firebase";
import { serverTimestamp } from "firebase/database";
import ReactMarkdown from "react-markdown";
import doneChatBot from "../content/doneChatBot.md";
import doneFAQ from "../content/doneFAQ.md";
import { groupWithFAQ } from "../content/config";
import { reload } from "../utilities/helper";
import Loading from "../utilities/Loading"
function DoneChatBot({ experimentId }) {
  const [textData, setTextData] = useState(null);
  let [userData, userDataLoading] = useUserData(experimentId);

  if (userDataLoading) return <Loading />;

  if (groupWithFAQ.indexOf(userData.Group) > -1) {
    fetch(doneFAQ)
      .then((response) => response.text())
      .then((text) => {
        setTextData(text);
      });
  } else {
    fetch(doneChatBot)
      .then((response) => response.text())
      .then((text) => {
        setTextData(text);
      });
  }
  if (!userData.ChatBot) {
    updateData(`/user/${experimentId}/experiment`, {
      ChatBot: true,
      ChatBotDoneTime: serverTimestamp(),
    });
  }

  function handleClick() {
    reload();
  }

  return (
    <Container maxWidth="sm">
      <ReactMarkdown children={textData} />
      <Button
        onClick={() => {
          handleClick();
        }}
        sx={{ my: 1 }}
        color="blackBtn"
        variant="outlined"
      >
        Continue
      </Button>
    </Container>
  );
}
export default DoneChatBot;
