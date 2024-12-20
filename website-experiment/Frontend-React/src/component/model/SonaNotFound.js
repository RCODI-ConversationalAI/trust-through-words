import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { reload } from "../../utilities/helper";

const SonaNotFound = ({ open, popupText }) => {
    const handleClose = () => {
        reload();
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"SonaID Not found"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {popupText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="blackBtn">Return</Button>
            </DialogActions>
        </Dialog>
    )
}
export default SonaNotFound;