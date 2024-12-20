import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { updateData } from "../../utilities/firebase";
import { serverTimestamp } from "firebase/database";

const TimeoutPopup = ({
  userData,
  openTimeOut,
  setOpenTimeOut,
  experimentId,
}) => {
  function handleClose() {
    updateData(`/user/${experimentId}/experiment`, {
      confirmTimeout: serverTimestamp(),
    });
    setOpenTimeOut(false);
  }
  function moreTime() {
    var time = new Date();
    var runout = time.getTime() - userData.CountdownStartTime < 360000
    updateData(`/user/${experimentId}/experiment`, {
      moreTime: true,
      CountdownStartTime: runout ? userData.CountdownStartTime + 1800000 : time.getTime() - 1800000,
    });
    setOpenTimeOut(false);
  }
  let startingTime = new Date(userData.StartTime);

  return (
    <Dialog
      open={openTimeOut}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Runout of time</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You will be given 1 hour to complete this experiment. <br />
          You started at {startingTime.toLocaleString()}. If you think this is an error, please
          contact us at: support@legalchatbot.org
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!userData.moreTime && (
          <Button color="blackBtn" onClick={() => moreTime()}>Add Thirty Minutes</Button>
        )}
        <Button color="blackBtn" onClick={() => handleClose()}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeoutPopup;
