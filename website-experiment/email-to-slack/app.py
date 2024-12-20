# -*- coding: utf-8 -*-
import os
import json
import requests
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, redirect, request, Response

app = Flask(__name__)


def validate(params):
    if params["event"]["type"] != "message":
        print("Event type is ", params["event"]["type"], "but not `message`")

    app_id = params["api_app_id"] == os.environ.get('API_APP_ID')
    token = params["token"] == os.environ.get('TOKEN')
    team = params["team_id"] == os.environ.get('TEAM_ID')
    channel = params["event"]["channel"] == os.environ.get('CHANNEL')
    user = params["event"].get("user", "") == "USLACKBOT"
    subtype = params["event"]["subtype"] == "file_share"

    if app_id and token and team and channel and user and subtype:
        return True
    else:
        if not app_id:
            print("env: APP_ID is not right!")
        if not token:
            print("env: TOKEN is not right!")
        if not team:
            print("env: TEAM_ID is not right!")
        if not channel:
            print(channel)
            print("env: USLACKBOT channel is not right!")
        if not user:
            print("User is not right! user: ", params["event"].get("user", ""))
        if not subtype:
            print("Email subtype not right subtype: ",
                  params["event"]["subtype"])

        return True


@app.route("/", methods=['GET', 'POST'])
def main():
    if request.method == "GET":
        return redirect("https://github.com/kossiitkgp/email-to-slack")
    elif request.method == "POST":

        print("New Email recieved\n Parameters")
        params = request.get_json(force=True)
        print(json.dumps(params))
        print("\n\n===HEADERS====\n")
        print(request.headers)
        """
        Enable this to verify the URL while installing the app
        """
        if 'challenge' in params:
            data = {
                'challenge': params.get('challenge'),
            }
            resp = Response(
                response=json.dumps(data),
                status=200,
                mimetype='application/json'
            )
            resp.headers['Content-type'] = 'application/json'

            return resp
        if validate(params):
            email = params["event"]["files"][0]

            if f"CHECKED_{email['id']}" in os.environ or "X-Slack-Retry-Num" in request.headers:
                # This email has already been processed
                return Response(response="Duplicate", status=409)

            email_provider = "http://gmail.com/"

            sender_email = email["from"][0]["original"]
            email_subject = email["title"]
            email_content = "```" + email["plain_text"] + "```"
            timestamp = email["timestamp"]

            all_to = ', '.join([i["original"] for i in email["to"]])
            all_cc = ', '.join([i["original"] for i in email["cc"]])

            data = {
                "text": "",
                "attachments": [
                    {
                        "fallback": "An email was sent by " + sender_email,
                        "color": "#2196F3",
                        "pretext": "",
                        "author_name": sender_email,
                        "author_link": email_provider,
                        "author_icon": "",
                        "title": email_subject,
                        "title_link": email_provider,
                        "text": email_content,
                        "fields": [],
                        "footer": "Sent to : " + all_to,
                        "footer_icon": "",
                        "ts": timestamp
                    }
                ]
            }

            if all_cc:
                data["attachments"][0]["fields"].append({
                    "title": "cc",
                    "value": all_cc
                })

            if email["attachments"]:
                data["attachments"][0]["fields"].append({
                    "title": "",
                    "value": "This email also has attachments",
                    "short": False
                })

            INCOMING_WEBHOOK_URL = os.environ.get('INCOMING_WEBHOOK_URL')

            headers = {
                "Content-type": "application/json"
            }
            print("Sending the following data to ", INCOMING_WEBHOOK_URL)
            print("\n\n\n", data, "\n\n\n")
            r = requests.post(INCOMING_WEBHOOK_URL, headers=headers, json=data)
            print("\n\n\n Exit with status code {}\n\n".format(r.status_code))
            # Slack API sends two payloads for single event. This is a bug
            # involving Heroku and Slack API.
            os.environ[f"CHECKED_{email['id']}"] = ''

            return Response(
                response="ok",
                status=200
            )
        else:
            return Response(
                response="Bad request",
                status=401
            )


app.secret_key = os.environ.setdefault("APP_SECRET_KEY", "notsosecret")
app.config['SESSION_TYPE'] = 'filesystem'

app.debug = False

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002)
