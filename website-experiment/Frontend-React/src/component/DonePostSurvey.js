import { updateData } from "../utilities/firebase";
import { serverTimestamp } from "firebase/database";
import { reload } from "../utilities/helper";

function DonePostSurvey({ experimentId }) {
  updateData(`/user/${experimentId}/experiment`, {
    PostSurvey: true,
    PostSurveyDoneTime: serverTimestamp(),
  }).then(() => reload());
}
export default DonePostSurvey;
