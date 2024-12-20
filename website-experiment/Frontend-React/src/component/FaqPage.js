import React, { useState } from "react";
import Faq from "react-faq-component";
import {
  FAQ
} from "../content/faq";
import faqInstruction from "../content/faqInstruction.md";
import ReactMarkdown from "react-markdown";
import { Button, Container } from "@mui/material";

function FaqPage() {
  const [textData, setTextData] = useState(null);
  const [readInstruction, setReadInstruction] = useState(false);


  fetch(faqInstruction)
    .then((response) => response.text())
    .then((text) => {
      setTextData(text);
    });

  const styles = {
    titleTextColor: "#4E2A84",
    titleTextSize: "30px",
    rowTitleColor: "Black",
    rowTitleTextSize: "20px",
    rowContentColor: "Black",
    rowContentTextSize: "17px",
    rowContentPaddingTop: "5px",
    rowContentPaddingBottom: "5px",
  };

  const config = {
    animate: true,
    tabFocus: true,
  };

  const faqData = () => {
    return (
      <>
        <Faq data={FAQ} styles={styles} config={config} />
      </>
    )
  }

  return (
    <Container maxWidth="lg">
      <ReactMarkdown children={textData} />
      {readInstruction === false ? (
        <Button sx={{ my: 1 }} color="blackBtn" variant="outlined" onClick={() => { setReadInstruction(true); }}>Next</Button>
      ) : (
        faqData()
      )}
      <br />
      <br />
      <br />
    </Container>
  );
}
export default FaqPage;
