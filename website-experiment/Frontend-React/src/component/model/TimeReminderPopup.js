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

const TimeReminderPopup = ({
  userData,
  minutes,
  seconds,
  openTimeReminder,
  setOpenTimeReminder,
  experimentId,
}) => {
  function handleClose() {
    updateData(`/user/${experimentId}/experiment`, {
      FifteenMinWarning: serverTimestamp(),
    });
    setOpenTimeReminder(false);
  }
  function moreTime() {
    var time = new Date();
    var runout = time.getTime() - userData.CountdownStartTime < 360000
    updateData(`/user/${experimentId}/experiment`, {
      moreTime: true,
      CountdownStartTime: runout ? userData.CountdownStartTime + 1800000 : time.getTime() - 1800000,
    });
    setOpenTimeReminder(false);
  }
  return (
    <Dialog
      open={openTimeReminder}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Timeout Warning</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You were given 1 hour to complete this experiment. <br />
          You have {minutes}:{seconds} left.
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

export default TimeReminderPopup;
