import firebase_admin
from firebase_admin import credentials, db,auth
import json
import requests
from flask import request
import random
from random import shuffle
import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime
import time
from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler()
scheduler.start()

cred = credentials.Certificate("google-credentials.json")
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': "https://chatbot-nu-default-rtdb.firebaseio.com/"
})
slack_token = os.environ.get('SLACK_TOKEN')
client = WebClient(token=slack_token)

def setData(ref, data):
    location = db.reference(ref)  
    location.set(data)


def increamentGroupCount(groupId,field,number):
    currNumber = getData(f"groupNumber/{groupId}/{field}")
    setData(f"groupNumber/{groupId}/{field}",currNumber + number)

def getData(ref):
    location = db.reference(ref)
    return location.get()
    
def getSonaFromUid(uid):
    ref = db.reference('sonaUser')
    snapshot = ref.order_by_child("uid").equal_to(uid).get()
    for key in snapshot:
        return key

def getAgeInt(stringData):
    if stringData == "18-24 years old":
        return 0
    elif stringData == "25-34 years old":
        return 1
    elif stringData == "35-44 years old":
        return 2
    elif stringData == "45-54 years old":
        return 3
    elif stringData == "55-64 years old":
        return 4
    elif stringData == "65+ years old":
        return 5

def sampleToGroup(eligibility,age,experience):
    ageInt = 0
    if not eligibility:
        increamentGroupCount("NotEligible","Count",1)
        return "NotEligible"
    currGroupStatus = getData("groupNumber/")
    ageInt = getAgeInt(age)
    groupId = randomHeadcountGroup()
    # groupId = randomAverageGroup()
    increamentGroupCount(groupId,"Count",1)
    increamentGroupCount(groupId,f"age/{ageInt}",1)
    increamentGroupCount(groupId,f"experience/{experience}",1)
    return groupId

def get_userToken(uid):
    return auth.create_custom_token(uid).decode("utf-8") 

def check_recaptcha(token):
    real_ip = request.headers['X-Forwarded-For']
    ip=""
    if len(real_ip.split(',')) > 1:
    	ip = real_ip.split(",")[1]
    else:
    	ip = real_ip  
    try:
        content = json.loads(requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': "6LdoQCIhAAAAAFrMj7ibVgRiKfjqPWG8hBfLgEa2",
                'response': token,
                'remoteip': ip,
            }
        ).content)
    except ConnectionError:
        content = json.loads( content )

    if not content['score'] or content['score']<=0.5:
        return False
    else:
        return True
        
def random_dic(dicts):
    dict_key_ls = list(dicts.keys())
    random.shuffle(dict_key_ls)
    new_dic = {}
    for key in dict_key_ls:
        new_dic[key] = dicts.get(key)
    return new_dic
    
def randomHeadcountGroup():
    groupData = getGroupFromCloud()
    headCount = random_dic(groupListDetail(groupData,"Count"))
    return min(headCount, key=headCount.get)
    
def groupListDetail(dataDict,key):
    result = {}
    for k1,v1 in dataDict.items():
        for k2,v2 in v1.items():
            if k2 == key:
                result[k1] = v2
    return result

def getAverageDict(dataDict):
    result = {}
    for k1,v1 in dataDict.items():
        weightList = []
        for x in range(len(v1)):
            weightList.append(v1[x]*(x+1))
        result[k1] = sum(weightList) / len(v1)
    return result

def getGroupFromCloud():
    data = getData("/groupNumber")
    del data['NotEligible']
    return data

def getMinFromDict(dataDict):
    min_value = min(dataDict.values())
    min_keys = [k for k in dataDict if dataDict[k] == min_value]
    return min_keys, min_value

def randomAverageGroup():
    groupData = getGroupFromCloud()
    # headCount = groupListDetail(groupData,"Count")
    ageAverage = getAverageDict(groupListDetail(groupData,"age"))
    experienceAverage = getAverageDict(groupListDetail(groupData,"experience"))
    minAgeGroup, minAgeValue = getMinFromDict(ageAverage)
    minExperienceGroup, minExperienceValue = getMinFromDict(experienceAverage)
    lowestGroup = list(set(minAgeGroup + minExperienceGroup))
    if len(lowestGroup) == 0:
        return "A"
    elif len(lowestGroup) == 1:
        return lowestGroup[0]
    else: 
        if minAgeValue < minExperienceValue:
            random.shuffle(minAgeGroup)
            return minAgeGroup[0]
        elif minAgeValue > minExperienceValue:
            random.shuffle(minExperienceGroup)
            return minExperienceGroup[0]
        else: 
            random.shuffle(lowestGroup)
            return lowestGroup[0]
            
def slack_hood_block(uid,age,experience,dueTime):
    return [
                {
                    "type": "header",
                    "text": {"type": "plain_text", "text": f"Group Assignment Due {dueTime}"},
                },
                {
                    "type": "section",
                    "fields": [
                        {"type": "mrkdwn", "text": f"*Age:*\n{age}"},
                        {"type": "mrkdwn", "text": f"*Experience:*\n{experience}"},
                    ],
                },
                {
                    "type": "section",
                    "fields": [
                        {"type": "mrkdwn", "text": f"*Experiment ID:*\n{uid}"},
                        {
                            "type": "mrkdwn",
                            "text": "*Group Assignment:*\n<https://api.legalchatbot.org/data/group|Data>",
                        },
                    ],
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "A"},
                            "style": "primary",
                            "value": f"{uid}:A",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "B"},
                            "style": "primary",
                            "value": f"{uid}:B",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "C"},
                            "style": "primary",
                            "value": f"{uid}:C",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "D"},
                            "style": "primary",
                            "value": f"{uid}:D",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "E"},
                            "style": "primary",
                            "value": f"{uid}:E",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "F"},
                            "style": "primary",
                            "value": f"{uid}:F",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "More Time(30s)"},
                            "style": "danger",
                            "value": f"{uid}:30s",
                        },
                        {
                            "type": "button",
                            "text": {"type": "plain_text", "text": "Reject"},
                            "style": "danger",
                            "value": f"{uid}:Reject",
                        },
                    ],
                },
            ]
            
def send_slack_block(age, experience, uid, channel,dueTime):
    channel_id = ""
    if channel == "login":
        channel_id = "C03S7A9QE2K"
    elif channel == "group":
        channel_id = "C03SF9D7FRU"
    try:
        response = client.chat_postMessage(
            channel=channel_id,
            blocks=slack_hood_block(uid,age,experience,dueTime),
            text=""
        )
        channel = response["channel"]
        ts = response["ts"]
        scheduler.add_job(slack_timeout, 'interval', seconds=15, id=uid, args=[uid,channel,ts])
    except SlackApiError as e:
        print(e)
        
def stopSchedule(uid):
    scheduler.remove_job(uid)
        
def slack_timeout(uid,messageID,ts):
    print(uid)
    timeOutTime = getData(f"user/{uid}/experiment/GroupTimeout")
    if timeOutTime < int(round(time.time() * 1000)):
        stopSchedule(uid)
        result = client.chat_delete(
        channel=messageID,
        ts=ts
        )
    
def timeStampToString(timeStamp):
    return datetime.fromtimestamp(timeStamp/1000).strftime('%m/%d/%Y, %H:%M:%S')
        
def send_slack_message(message,channel):
    channel_id = ""
    if channel == "login":
        channel_id = "C03S7A9QE2K"
    elif channel == "group":
        channel_id = "C03SF9D7FRU"
    elif channel == "email":
        channel_id = "C03V6BH9T5H"
    try:
        response = client.chat_postMessage(
        channel=channel_id,
        text=message
      )
    except SlackApiError as e:
        print(e)

def send_slack_hook(postJson,hookurl):
    try:
        response = requests.post(hookurl, json = postJson)
    except Exception:
        print(Exception)