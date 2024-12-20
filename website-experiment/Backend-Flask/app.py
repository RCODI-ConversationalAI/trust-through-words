from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from apis import api_requests, getData, increamentGroupCount, setData
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
auth = HTTPBasicAuth()

api_requests.initialize_routes(api)

users = {
    "chatbot": generate_password_hash("experiment")
}

# def myfunc(data):
#     print(data)
# scheduler.add_job(myfunc, 'interval', seconds=5, id='my_job_id', args=['Job 2'])
# scheduler.start()


@auth.verify_password
def verify_password(username, password):
    if username in users and \
            check_password_hash(users.get(username), password):
        return username

# @Summary: Group assignment data
# @Description: Login protected page to see current group assignment status
# @Produce: json
@app.route('/data/group')
@auth.login_required
def group():
    return jsonify(getData("/groupNumber"))

# @Summary: Experiment Participant Data
# @Description: Login protected page to see experiment data
# @Resource: uid, folder(all, chatbot, experiment, transcript)
# @Produce: json
@app.route('/data/user/<uid>/<folder>')
@auth.login_required
def userFolder(uid,folder):
    if folder == "all":
        return jsonify(getData(f"/user/{uid}"))
    else:
        return jsonify(getData(f"/user/{uid}/{folder}"))

# @Summary: Get list of sonaid complete the experiment
# @Description: Login protected page to see list of sonaid complete the experiment
# @Produce: json
@app.route('/data/complete-sona')
@auth.login_required
def completeSona():
    return jsonify(getData(f"/completeSonaId"))
    
# @Summary: Change sona user group assignment
# @Description: Login protected page to change change a sona user group assignment
# @Resource: uid, groupId
# @Produce: json
# Warning: DO NOT USE ON PROEUCTION
@app.route('/data/change-sona-group/<sonaId>/<groupId>')
@auth.login_required
def changeSonaGroup(sonaId,groupId):
    dbData = getData("sonaUser/" + sonaId)
    if(dbData=="new"):
        return jsonify({"sonaId": sonaId,"status":"no group for user yet"})
    elif(not dbData):
        return jsonify({"sonaId": sonaId,"status":"user not found or no group yet"})
    else:
        return changeGroup(dbData["uid"],groupId)

# @Summary: Change uid user group assignment
# @Description: Login protected page to change change a uid user group assignment
# @Resource: uid, groupId
# @Produce: json
# Warning: DO NOT USE ON PROEUCTION
@app.route('/data/change-group/<uid>/<groupId>')
@auth.login_required
def changeGroup(uid,groupId):
    oldGroupId = getData(f"/user/{uid}/experiment/Group")
    tooLate = getData(f"/user/{uid}/experiment/IntroToScenario")
    if tooLate:
        return jsonify({"uid": uid,"status":"Too late to change group assignment"})
    if not oldGroupId:
        return jsonify({"uid": uid,"status":"user not found or no group yet"})
    setData(f"user/{uid}/experiment/Group", groupId)
    return jsonify({"uid":uid, "original-group": oldGroupId, "new-group":groupId})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0') 