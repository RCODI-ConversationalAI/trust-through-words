import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const ContactForm = ({ openContactForm, handleCloseContactForm, experimentId }) => {
    return (
        <Dialog
            open={openContactForm}
            onClose={handleCloseContactForm}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title" className="dialogTitle">
                Contact Us
                <IconButton onClick={handleCloseContactForm}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form action="https://api.legalchatbot.org/api/contactForm" onSubmit={handleCloseContactForm} method="POST" target="_blank">
                <DialogContent dividers>
                    If you have any questions, comments, or concerns, please fill the contact form below or send us an email at <a href={`mailto:support@legalchatbot.org?body=%0D%0A%0D%0A%0D%0AExperiment%20ID%3A${experimentId}`}>support@legalchatbot.org</a>.
                    <hr />
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" className='contactInput' />
                    <label htmlFor="email">Email<span style={{ color: "red" }}>*</span></label>
                    <input type="email" name="email" className='contactInput' required />
                    <label htmlFor="subject">Subject<span style={{ color: "red" }}>*</span></label>
                    <textarea id="subject" name="subject" className='contactInput' style={{ height: "150px" }} required></textarea>
                    <input type="hidden" name="experimentID" value={experimentId} />
                    <input type="hidden" name="apiKey" value="nmsdAKwqtP" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseContactForm} color="blackBtn">Close</Button>
                    <Button type="submit" value="Submit" color="blackBtn">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
export default ContactForm;