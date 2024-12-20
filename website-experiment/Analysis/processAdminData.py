import json
import csv

def msToS(ms):
    try:
        return (ms / 1000) / 60
    except:
        return None

def rightPath(id): # Get if user on the right path on Chatbot.
    try:
        return (True if data['user'][i]['chatbot']['ZZZ-Right-track'] else False)
    except:
        return False

def ChatBotDoneManually(id): # Get if user click done on navbar while chatbot/FAQ activity.
    try:
        return (True if data['user'][i]['experiment']['ChatBotDoneManually'] else False)
    except:
        return False

input = open('chatbot-nu-default-rtdb-export.json') # TODO: Change me
output = 'test.csv' # TODO: Change me

data = json.load(input)

fields = ['experimentID', 'group', "totalTime",
          "preSurveyTime", "angerTime", "scenarioTime","chatbotTime",'postSurveyTime', 'chatbotRightTrack',"doneManually"]
rows = []

for i in data['user']:
    try:
        experimentData = data['user'][i]['experiment']
        group = experimentData["Group"]
        totalTime = experimentData['PostSurveyDoneTime'] - experimentData['StartTime']
        preSurveyTime = experimentData['PreSurveyDoneTime'] - experimentData['StartTime']
        angerTime = (experimentData["IntroToAngerDoneTime"] - experimentData['PreSurveyDoneTime'] if group in ['B', 'D', 'F'] else "")
        scenarioTime = experimentData["IntroToScenarioDoneTime"] - experimentData['IntroToAngerDoneTime']
        chatbotTime = experimentData["ChatBotDoneTime"] - experimentData['IntroToScenarioDoneTime']
        postSurveyTime = experimentData["PostSurveyDoneTime"] - experimentData["ChatBotDoneTime"]
        chatbotRightTrack = (rightPath(i) if group in ['A', 'B', 'C', 'D'] else "")
        doneManually = ChatBotDoneManually(i)
        export = [i, group, msToS(totalTime), msToS(preSurveyTime), msToS(angerTime), msToS(scenarioTime), msToS(chatbotTime), msToS(postSurveyTime), chatbotRightTrack,doneManually]
        rows.append(export)
    except Exception as e:
        continue # Skip unfinished record

with open(output, 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(fields)
    csvwriter.writerows(rows)

input.close()
