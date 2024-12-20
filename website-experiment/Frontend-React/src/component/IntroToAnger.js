import { Button, Container, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import introduceToAnger from "../content/introduceToAnger.md";
import { groupWithAnger } from "../content/config";
import { reload } from "../utilities/helper";
import { updateData } from "../utilities/firebase";
import { serverTimestamp } from "firebase/database";
import { useState, useEffect } from "react";
import Loading from "../utilities/Loading";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" color="blackBtn" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const IntroToAnger = ({ userData, experimentId }) => {
  const [textData, setTextData] = useState(null);
  const [lengthData, setLengthData] = useState(0);
  const [displayData, setDisplayData] = useState("");
  const [progress, setProgress] = useState(0);

  function handleClick() {
    updateData(`/user/${experimentId}/experiment`, {
      IntroToAnger: true,
      IntroToAngerDoneTime: serverTimestamp(),
    });
    reload();
  }

  function handleNext() {
    setDisplayData(displayData + textData[0] + ".");
    setTextData(textData.slice(1));
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(100 - (textData.length / lengthData) * 100);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [textData]);

  if (textData === null) {
    if (groupWithAnger.indexOf(userData.Group) > -1) {
      fetch(introduceToAnger)
        .then((response) => response.text())
        .then((text) => {
          const result = text.split(".");
          setTextData(result.slice(1));
          setDisplayData(result[0] + ".");
          setLengthData(result.length);
        });
    } else {
      handleClick();
    }
  }

  if (!textData) return <Loading />

  return (
    <Container maxWidth="sm">
      <LinearProgressWithLabel value={progress} />
      <ReactMarkdown children={displayData} />
      {textData.length > 1 ? (
        <Button sx={{ my: 1 }} color="blackBtn" variant="outlined" onClick={() => { handleNext(); }}>
          Next
        </Button>
      ) : (
        <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button sx={{ my: 1 }} color="blackBtn" variant="outlined" onClick={() => { handleClick(); }}>
            Ok
          </Button>
        </Box>

      )}
    </Container>
  );
};
export default IntroToAnger;
