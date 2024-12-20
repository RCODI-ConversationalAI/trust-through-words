import { useState } from "react";
import TimeReminderPopup from "./model/TimeReminderPopup";
import TimeoutPopup from "./model/TimeoutPopup";
import { serverTimestamp } from "firebase/database";
import {
    updateData,
} from "../utilities/firebase";
import Countdown from "react-countdown";

const RemainingTime = ({ userData, experimentId }) => {
    const [openTimeReminder, setOpenTimeReminder] = useState(false);
    const [openTimeOut, setOpenTimeOut] = useState(false);

    const endTime = userData.CountdownStartTime + 3600000;
    const countdownRenderer = props => {
        if (props.total < 900000 && !userData.FifteenMinWarning && !userData.PostSurvey) {
            setOpenTimeReminder(true);
            return (
                <TimeReminderPopup
                    userData={userData}
                    minutes={props.formatted.minutes}
                    seconds={props.formatted.seconds}
                    openTimeReminder={openTimeReminder}
                    setOpenTimeReminder={setOpenTimeReminder}
                    experimentId={experimentId}
                />
            );
        }
        if (props.completed && !userData.confirmTimeout && !userData.PostSurvey) {
            if (!userData.timeout) {
                updateData(`/user/${experimentId}/experiment`, {
                    timeout: serverTimestamp(),
                });
            }
            setOpenTimeOut(true);
            return (
                <TimeoutPopup
                    userData={userData}
                    setOpenTimeOut={setOpenTimeOut}
                    openTimeOut={openTimeOut}
                    startTime={userData.CountdownStartTime}
                    experimentId={experimentId}
                />
            );
        } else {
            return (
                <span>
                    {props.formatted.hours}:{props.formatted.minutes}:{props.formatted.seconds}
                </span>
            );
        }
    };

    return (<Countdown date={endTime} renderer={countdownRenderer} />);
}
export default RemainingTime;