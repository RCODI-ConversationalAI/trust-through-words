import { Button, Container } from "@mui/material";
import ReactMarkdown from "react-markdown";
import introduceToScenario from "../content/introduceToScenario.md";
import { reload } from "../utilities/helper";
import { updateData } from "../utilities/firebase";
import { serverTimestamp } from "firebase/database";
import { useState } from "react";

const IntroToScenario = ({ experimentId }) => {
  const [textData, setTextData] = useState(null);

  function handleClick() {
    updateData(`/user/${experimentId}/experiment`, {
      IntroToScenario: true,
      IntroToScenarioDoneTime: serverTimestamp(),
    });
    reload();
  }

  fetch(introduceToScenario)
    .then((response) => response.text())
    .then((text) => {
      setTextData(text);
    });

  return (
    <Container maxWidth="sm">
      <ReactMarkdown children={textData} />
      <Button
        sx={{ my: 1 }}
        color="blackBtn"
        variant="outlined"
        onClick={() => {
          handleClick();
        }}
      >
        Ok
      </Button>
    </Container>
  );
};
export default IntroToScenario;
