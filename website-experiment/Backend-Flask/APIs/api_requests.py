from flask import Response, request
from flask_restful import Resource
import json
from apis import setData, getData, increamentGroupCount, sampleToGroup, get_userToken, send_slack_message, check_recaptcha, getSonaFromUid, send_slack_block, send_slack_hook, getAgeInt, stopSchedule, slack_hood_block, timeStampToString
from datetime import datetime
import time

# @Summary:Landbot Message Hook
# @Description: Store transcript from landbot using landbot build in message hook
# @Resource: authorization(header), Landbot message data
# @Success: 200 
# @Produce: json {"status":"success"}
# @Router: /api/chatbotMessage/
class ChatBotRequestEndpoint(Resource):
    def post(self):
        authorization = request.headers.get('Authorization')
        if authorization == "Token drmUTh24wqnzR4tudFW3":
            body = request.get_json()
            message = body["messages"][0]
            experimentId = message["customer"]["experimentid"]
            if experimentId:
                time = str(message["_raw"]["timestamp"])[:14].replace('.', '')
                data = {
                    "sender": message["sender"]["type"],
                    "message": message["_raw"]["message"]
                }
                setData(f"user/{experimentId}/transcript/{time}", data)
            return Response(json.dumps({"status":"success"}), mimetype="application/json", status=200)
        else:
            return Response(status=401)

# @Summary: Assign to group basic on PreSurvey
# @Description: Store info from preSurvey and assign in to a group
# @Resource: authorization(header), experimentId, eligibility, age(optional), experience(optional)
# @Success: 200 
# @Produce: json {"status":"success", "group", groupid}
# @Router: /api/presurvey/
class PreSurveyRequestEndpoint(Resource):
    def post(self):
        authorization = request.headers.get('Authorization')
        if authorization == "bJLh8PVcxKyVh3UpViBK":
            body = request.get_json()
            experimentId = body["experimentId"]
            eligibility = body["eligibility"]
            age = ""
            experience = ""
            if eligibility:
                age = body["age"]
                experience = body["experience"]
                setData(f"user/{experimentId}/experiment/Age", age)
                setData(f"user/{experimentId}/experiment/Experience", experience)
            groupId = sampleToGroup(eligibility,age,experience)
            dueTime = int(round(time.time() * 1000))+60000
            if eligibility:
                send_slack_block(age,experience,experimentId,'group',timeStampToString(dueTime))
            
            else:
                send_slack_message(f"Not Eligiable\n User experimentId: {experimentId}\nGroup: {groupId}", 'group')
            setData(f"user/{experimentId}/experiment/Group", groupId)
            setData(f"user/{experimentId}/experiment/GroupTimeout", dueTime)
            setData(f"user/{experimentId}/experiment/Eligibility", eligibility)
            return Response(json.dumps({"status":"success","group":groupId}), mimetype="application/json", status=200)
        else:
            return Response(status=401)

# @Summary: Store key information from Landbot
# @Description: Store key info from Landbot
# @Resource: experimentId, key, value
# @Success: 200 
# @Produce: json {"status":"success"}
# @Router: /api/chatbotKeyData/
class ChatbotKeyDataEndpoint(Resource):
    def post(self):
        body = request.get_json()
        experimentId = body["experimentid"]
        exist = getSonaFromUid(experimentId)
        if exist:
            key=list(body.keys())[0]
            value=list(body.values())[0]
            setData(f"user/{experimentId}/chatbot/{key}", value)
            return Response(json.dumps({"status":"success"}), mimetype="application/json", status=200)
        else:
            return Response(status=401)

# @Summary: Check sonaID exist/started
# @Description: Check sonaID exist in db, already started or need to create account
# @Resource: sonaID, Google Recaptcha V3 token
# @Success: 200 
# @Produce: json {"status":status or firebase auth userToken}
# @Router: /api/checkSonaID/
class CheckSonaIDEndPoint(Resource):
    def post(self):
        body = request.get_json()
        sonaID = body["sonaID"]
        token = body["token"]
        if not check_recaptcha(token):
            return Response(status=401)
        dbData = getData("sonaUser/" + sonaID)
        if(dbData=="new"):
            data = {"result":dbData}
            send_slack_message(f"New SonaID Login: {sonaID}", "login")
        elif(not dbData):
            data = {"result":dbData}
            send_slack_message(f"Unknown SonaID Login: {sonaID}","login")
        else:
            data = {"result":get_userToken(dbData["uid"])}
            send_slack_message(f"Old SonaID Relogin: {sonaID}","login")
        return Response(json.dumps(data), mimetype="application/json", status=200)

# @Summary: Seperate table store sonaId link with uid
# @Description: Connect sonaid and uid
# @Resource: sonaID, uid
# @Success: 200 
# @Produce: json {"status":"success"}
# @Router: /api/saveSonaIdUid/
class SaveSonaIdUidEndPoint(Resource):
    def post(self):
        body = request.get_json()
        sonaID = body["sonaID"]
        uid = body["uid"]
        sonaData = getData("sonaUser/" + sonaID)
        if sonaData:
            setData(f"sonaUser/{sonaID}/uid", uid)
            return Response(json.dumps({"status":"success"}), mimetype="application/json", status=200)
        else:
            return Response(status=401)

# @Summary: Store completed experiment sona user
# @Description: Store completed experiment sona user
# @Resource: uid
# @Success: 200 
# @Produce: json {"status":"success"}
# @Router: /api/conpleteSonaId/
class ConpleteSonaIdEndPoint(Resource):
    def post(self):
        body = request.get_json()
        uid = body["uid"]
        authorization = request.headers.get('Authorization')
        if authorization == "J6jjgXHPkZgUIIHSZ":
            sonaID = getSonaFromUid(uid)
            if sonaID:
                time = datetime.now().strftime("%Y/%m/%d-%H:%M:%S")
                setData(f"completeSonaId/{sonaID}", time)
                setData(f"sonaUser/{sonaID}/doneTime", time)
                return Response(json.dumps({"status":"success"}), mimetype="application/json", status=200)
            else:
                return Response(status=401)
        else:
            return Response(status=401)
            
# @Summary: Handle Slack Group Selection
# @Description: Callback from Slack Group Selection
# @Resource: Slack Group Selection Callback data
# @Success: 200 
# @Produce: json {"status":"success"}
# @Router: /api/slackInteractivity/
class SlackInteractivityEndPoint(Resource):
    def post(self):
        body = json.loads(request.form["payload"])
        action_data = body["actions"][0]["value"].split(":")
        uid=action_data[0]
        action=action_data[1]
        oldData = getData(f"user/{uid}/experiment")
        if oldData:
            reployHook = body["response_url"]
            ageInt = getAgeInt(oldData["Age"])
            experience = oldData["Experience"]
            if(action == "Reject"):
                oldGroup = oldData["Group"]
                user = body["user"]["name"]
                setData(f"user/{uid}/experiment/Group", "NotEligible")
                setData(f"user/{uid}/experiment/GroupTimeout", int(round(time.time() * 1000)))
                setData(f"user/{uid}/experiment/GroupAssignBy", user)
                increamentGroupCount("NotEligible","Count",1)
                increamentGroupCount(oldGroup,"Count",-1)
                increamentGroupCount(oldGroup,f"age/{ageInt}",-1)
                increamentGroupCount(oldGroup,f"experience/{experience}",-1)
                send_slack_hook({"delete_original": "true"},reployHook)
                stopSchedule(uid)
            elif(action == "30s"):
                newEndTime = oldData["GroupTimeout"]+30000
                setData(f"user/{uid}/experiment/GroupTimeout", newEndTime)
                send_slack_hook({"replace_original": "true","blocks": slack_hood_block(uid,ageInt,experience,timeStampToString(newEndTime))},reployHook)
            else:
                oldGroup = oldData["Group"]
                user = body["user"]["name"]
                setData(f"user/{uid}/experiment/Group", action)
                setData(f"user/{uid}/experiment/GroupTimeout", int(round(time.time() * 1000)))
                setData(f"user/{uid}/experiment/GroupAssignBy", user)
                increamentGroupCount(oldGroup,"Count",-1)
                increamentGroupCount(oldGroup,f"age/{ageInt}",-1)
                increamentGroupCount(oldGroup,f"experience/{experience}",-1)
                increamentGroupCount(action,"Count",1)
                increamentGroupCount(action,f"age/{ageInt}",1)
                increamentGroupCount(action,f"experience/{experience}",1)
                send_slack_hook({"delete_original": "true"},reployHook)
                stopSchedule(uid)
            return Response(json.dumps({"status":"success"}), mimetype="application/json", status=200)
        else:
            return Response(status=401)


class ContactFormEndPoint(Resource):
    def post(self):
        body = request.form
        experimentId=body["experimentID"]
        email=body["email"]
        subject=body["subject"]
        name=body["name"]
        if body["apiKey"]=="nmsdAKwqtP":
            send_slack_message(f"New Contact Form Submission\nUser experimentId: {experimentId}\nName: {name}\nEmail:{email}\nSubject:{subject}", 'email')
            return Response("Success, you may now close this tab", mimetype="text/plain", status=200)
        else:
            return Response(status=401)

def initialize_routes(api):
    api.add_resource(
        ChatBotRequestEndpoint,
        '/api/chatbotMessage',
        '/api/chatbotMessage/')
        
    api.add_resource(
        ChatbotKeyDataEndpoint,
        '/api/chatbotKeyData',
        '/api/chatbotKeyData/')

    api.add_resource(
        PreSurveyRequestEndpoint,
        '/api/presurvey',
        '/api/presurvey/')
        
    api.add_resource(
        CheckSonaIDEndPoint,
        '/api/checkSonaID',
        '/api/checkSonaID/')
        
    api.add_resource(
        SaveSonaIdUidEndPoint,
        '/api/saveSonaIdUid',
        '/api/saveSonaIdUid/')
        
    api.add_resource(
        ConpleteSonaIdEndPoint,
        '/api/conpleteSonaId',
        '/api/conpleteSonaId/')
        
    api.add_resource(
        SlackInteractivityEndPoint,
        '/api/slackInteractivity',
        '/api/slackInteractivity/')

    api.add_resource(
        ContactFormEndPoint,
        '/api/contactForm',
        '/api/contactForm/')