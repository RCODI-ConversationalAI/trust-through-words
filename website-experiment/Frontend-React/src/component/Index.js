import Chatbot from "./Chatbot";
import Instruction from "./Instruction";
import PreSurvey from "./PreSurvey";
import IntroToAnger from "./IntroToAnger";
import PostSurvey from "./PostSurvey";
import DonePreSurvey from "./DonePreSurvey";
import {
  useUserData,
  logout
} from "../utilities/firebase";
import IntroToScenario from "./IntroToScenario";
import { NotEligibleText, TimeoutText } from "../content/config";
import Loading from "../utilities/Loading";
import Ending from "./Ending";
import RemainingTime from "./RemainingTime";
const Index = ({ user }) => {
  const experimentId = user.uid;

  let [userData, userDataLoading, userDataError] = useUserData(experimentId);

  if (userDataLoading) return <Loading />;

  if (userDataError || !userData)
    return (
      <>
        <h1 style={{ marginLeft: 20 }}>User Not Found</h1>
        <a onClick={logout} href="/">
          Reset
        </a>
      </>
    );
  console.log(user);
  console.log(userData);

  return (
    <>
      {userData.Group === "NotEligible" ? (
        <>
          <h1>Not Eligible</h1>
          <h3 style={{ marginLeft: 20 }}>{NotEligibleText}</h3>
        </>
      ) : userData.confirmTimeout ? (
        <>
          <h1>Timeout</h1>
          <h3 style={{ marginLeft: 20 }}>{TimeoutText}</h3>
        </>
      ) : !userData.Instruction ? (
        <Instruction experimentId={experimentId} />
      ) : !userData.PreSurvey && userData.GroupTimeout ? (
        <DonePreSurvey user={user} />
      )
        : !userData.PreSurvey ? (
          <PreSurvey experimentId={experimentId} />
        ) : !userData.IntroToAnger ? (
          <IntroToAnger userData={userData} experimentId={experimentId} />
        ) : !userData.IntroToScenario ? (
          <IntroToScenario experimentId={experimentId} />
        ) : !userData.ChatBot ? (
          <Chatbot userData={userData} experimentId={experimentId} />
        ) : !userData.PostSurvey ? (
          <PostSurvey userData={userData} experimentId={experimentId} />
        ) : userData.PostSurvey ? (
          <Ending userData={userData} />
        ) : (
          <h1 style={{ marginLeft: 20 }}>Thanks for complete the experiment</h1>
        )}
      <div style={{ display: 'none' }}>
        <RemainingTime userData={userData} experimentId={experimentId} />
      </div>
    </>
  );
};
export default Index;
