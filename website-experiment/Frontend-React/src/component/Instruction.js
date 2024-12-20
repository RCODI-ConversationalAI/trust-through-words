import React from "react";
import { useState } from "react";
import { Button, Container } from "@mui/material";
import { updateData } from "../utilities/firebase";
import { serverTimestamp } from "firebase/database";
import ReactMarkdown from "react-markdown";
import instruction from "../content/instruction.md";
import { reload } from "../utilities/helper";

function Instruction({ experimentId }) {
  const [textData, setTextData] = useState(null);

  async function handleClick() {
    await updateData(`/user/${experimentId}/experiment`, {
      Instruction: true,
      InstructionDoneTime: serverTimestamp(),
    });
    reload();
  }

  fetch(instruction)
    .then((response) => response.text())
    .then((text) => {
      setTextData(text);
    });

  return (
    <Container maxWidth="sm">
      <ReactMarkdown children={textData} />
      <p>You will first complete a screening questionnaire to determine your eligibility for this study. Click on the <b>OK</b> button below to get started.</p>
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
}
export default Instruction;
