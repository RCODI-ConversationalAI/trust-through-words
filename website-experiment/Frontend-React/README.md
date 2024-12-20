# Frontend Services for Chatbot Experiment

This program serves as a frontend website for the Chatbot Experiment, It embeds with [LandBot](https://landbot.io/) and [qualtrics](https://northwestern.az1.qualtrics.com/). The website is currently [host at Firebase](https://chatbot-nu.web.app/) and the data is store at [Firebase realtime database](https://console.firebase.google.com/project/chatbot-nu/database/chatbot-nu-default-rtdb/data).

If you think you need access to the firebase, contact [@PengxiangZhang](https://github.com/pengxiangzhang) to add you to the [Google Firebase project](https://console.firebase.google.com/project/chatbot-nu/overview).

## Setup

1. Make sure you have [Node@16](https://nodejs.org/en/download/), [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) and [firebase CIL](https://firebase.google.com/docs/cli) installed.
2. Make sure you have cloned the website and are ready to deploy.
3. Run `yarn` to install all the requirements.
4. Run `yarn start` to start the development server.

## Deploy

1. Install Firebase-tool by running `npm install -g firebase-tools` then run `firebase login`
2. To deploy run `yarn build` then run `firebase deploy`

## Configuration and content update

All the frontend display content could be easily edited in this folder: `src/content/`

### config.js

- `pre_survey_link`: Put the published link of pre survey link from qualtrics.
- `post_survey_link`: Put the published link of the post-survey link from qualtrics.
- `groupWithAnger`: Put the group_ID who will be in the group with anger.
- `groupWithNoAnger`: Put the group_ID who will be in the group without anger.
- `chatbotEmpathy`: Put the published link of Landbot API URL(A JSON file), for the bot with empathy.
- `chatbotNoEmpathy`: Put the published link of Landbot API URL(A JSON file), for the bot with empathy. This could be the same as the `chatbotEmpathy`.
- `chatbotFaq`: Put the pushed URL for the faq page.
- `groupWithEmpathy`: Put the group_ID who will be in the group with empathy.
- `groupWithNoEmpathy`: Put the group_ID who will be in the group without empathy.
- `groupWithFAQ`: Put the group_ID who will be in the group using FAQ.

### Faq.js

It store information to generate faq page.

### Markdown files

- `instruction.md`: This will show after user login.
- `introduceToAnger.md`: This will show after instruction for people in the anger group.
- `introduceToNoAnger.md`: This will show after instruction for people in the without anger group.
- `introduceToScenario.md`: This will show after introduce to anger.
- `doneChatBot.md`: This will show when the user finishes the chatbot experiment.
- `donePostSurvey.md`: This will show at the end of the survey.

## Work Flow

![experiment flow drawio](https://user-images.githubusercontent.com/84985387/173164333-0d3f081c-a720-4a08-a779-541647ecce87.png)

## Database

The database is hosted on Firebase/RealtimeDatabase.

### Database Schema

- `groupNumber`
  - `A`: The number of participants assigned to group A.
  - `B`: The number of participants assigned to group B.
  - `C`: The number of participants assigned to group C.
  - `D`: The number of participants assigned to group D.
  - `E`: The number of participants assigned to group E.
  - `F`: The number of participants assigned to group F.
- `transcript`
  - `123e4567-e89b-12d3-a456-426614174000`: UserID
  - `1234567890123`: Timestamp of the message being sent.
  - `message`: Transcript message.
  - `sender`: (customer, bot) Either the bot send it or the user send it.
- `123e4567-e89b-12d3-a456-426614174000`: UserID
  - `ChatBot`: (true, false) Either complete the chatbot experiment(FAQ) or not.
  - `ChatBotDoneTime`: (1234567890123) Timestamp of finish chatbot experiment(FAQ).
  - `Email`: (someone@somedomain.com) Email address of the user.
  - `Group`: (A,B,C,D,E,F) Group assign to the user.
  - `Instruction`: (true, false) Either finish reading instruction or not.
  - `InstructionDoneTime`: (1234567890123) Timestamp of finish reading instruction.
  - `IntroToAnger`: (true, false) Either finish reading introduce to anger or not.
  - `IntroToAngerDoneTime`: (1234567890123) Timestamp of finish reading introduce to anger.
  - `IntroToScenario`: (true, false) Either finish reading introduce to scenario or not.
  - `IntroToScenarioDoneTime`: (1234567890123) Timestamp of finish reading introduce to scenario.
  - `Name`: (String) name of the user
  - `PostSurvey`: (true, false) Either finish post-survey not.
  - `PostSurveyDoneTime`: (1234567890123) Timestamp of finish post-survey not.
  - `PreSurvey`: (true, false) Either finish pre-survey not.
  - `PreSurveyDoneTime`: (1234567890123) Timestamp of finish Pre-survey not.
  - `StartTime`: Timestamp of sign up
