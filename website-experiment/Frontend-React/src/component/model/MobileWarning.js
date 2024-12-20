import { mobileWarningText } from '../../content/config';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
const MobileWarning = ({ openMobileWarning, handleCloseMobile }) => {
    return (
        <Dialog
            open={openMobileWarning}
            onClose={handleCloseMobile}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Mobile Not recommended"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {mobileWarningText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseMobile} color="blackBtn">OK</Button>
            </DialogActions>
        </Dialog>
    )
}
export default MobileWarning;