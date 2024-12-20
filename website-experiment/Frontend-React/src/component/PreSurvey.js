import { pre_survey_link } from "../content/config";

const PreSurvey = ({ experimentId }) => {
  return (
    <iframe
      src={`${pre_survey_link}?experimentId=${experimentId}`}
      allowFullScreen
      frameBorder={0}
      className="iframeNav"
      title="Pre Survey"
    />
  );
};
export default PreSurvey;
