import { useState } from "react";
import { Container } from "@mui/material";
import ReactMarkdown from "react-markdown";
import donePostSurvey from "../content/donePostSurvey.md";
import { groupWithAnger } from "../content/config";
import donePostSurveyAddAnger from "../content/donePostSurveyAddAnger.md";
import rehypeRaw from "rehype-raw";

function Ending({ userData }) {
  const [textData, setTextData] = useState(null);
  const [textAngerData, setTextAngerData] = useState(null);

  fetch(donePostSurvey)
    .then((response) => response.text())
    .then((text) => {
      setTextData(text);
    });

  fetch(donePostSurveyAddAnger)
    .then((response) => response.text())
    .then((text) => {
      setTextAngerData(text);
    });

  return (
    <Container maxWidth="sm">
      <ReactMarkdown children={textData} />
      <br />
      {groupWithAnger.indexOf(userData.Group) > -1 && (
        <ReactMarkdown rehypePlugins={[rehypeRaw]} children={textAngerData} />
      )}
    </Container>
  );
}
export default Ending;
