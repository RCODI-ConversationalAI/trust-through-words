import React, { useState } from "react";

import { updateData, useUserData } from "../utilities/firebase";
import { serverTimestamp } from "firebase/database";
import { reload } from "../utilities/helper";
import Loading from "../utilities/Loading";
// import LoadingSpiner from "../utilities/LoadingSpiner";
import Countdown from "react-countdown";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Container, Typography, Box } from "@mui/material";

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

function DonePreSurvey({ user }) {
  const experimentId = user.uid;
  let [userData, userDataLoading] = useUserData(experimentId);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((1 - (userData.GroupTimeout - Date.now()) / 60000) * 100);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [userDataLoading]);

  if (userDataLoading) return <Loading />;


  const countdownRenderer = props => {
    if (props.completed) {
      updateData(`/user/${experimentId}/experiment`, {
        PreSurvey: true,
        PreSurveyDoneTime: serverTimestamp(),
      });
      reload();
    } else {
      return (
        <span>
          {props.formatted.minutes}:{props.formatted.seconds}
        </span>
      );
    }
  };

  if (!userData.Group || !userData.GroupTimeout) {
    return <h1 style={{ marginLeft: 20 }}> We are setting up the online help platform</h1>;
  }
  else {
    return (
      <Container maxWidth="lg">
        {/* <h1><LoadingSpiner /></h1> */}
        <LinearProgressWithLabel value={progress} />
        <h1>We are setting up the online help system</h1>
        <h1>It should be ready in <Countdown date={userData.GroupTimeout} renderer={countdownRenderer} /></h1>
      </Container>
    );
  }
  // else {
  //   updateData(`/user/${experimentId}/experiment`, {
  //     PreSurvey: true,
  //     PreSurveyDoneTime: serverTimestamp(),
  //   });
  //   reload();
  // }
}
export default DonePreSurvey;
