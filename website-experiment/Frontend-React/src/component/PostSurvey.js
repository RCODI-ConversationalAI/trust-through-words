import { post_survey_link } from "../content/config";

const PostSurvey = ({ userData, experimentId }) => {
  return (
    <iframe
      src={`${post_survey_link}?group=${userData.Group}&experimentId=${experimentId}`}
      allowFullScreen
      frameBorder={0}
      className="iframeNav"
      title="Post Survey"
    />
  );
};
export default PostSurvey;
