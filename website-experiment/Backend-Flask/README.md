# Backend Services for Chatbot Experiment

This program serves as an API endpoint to accept webhook requests from [LandBot](https://landbot.io/)(Chat transcript) and [qualtrics](https://northwestern.az1.qualtrics.com/)(Assign group based on pre-survey)

## Introduction

This website was written in python3, the web framework is [Flask](https://flask.palletsprojects.com/en/1.1.x/) and if needed please use [Jinja2](https://jinja.palletsprojects.com/en/2.11.x/) as the template engine.

## Installation

1. Make sure you have python3 and python3-pip installed.
2. Make sure you have clone the website and ready to deploy.
3. run `pip3 install -r requirements.txt` to install all the requirement.
4. Generate [firebase-admin](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app) api key, rename it to `google-credentials.json` and put it at this directory.
5. Create a file called `.env` in the and insert the following line: `SLACK_TOKEN=slack_hook_token` and  `TZ=America/Chicago`
6. We recommand to serve pn Nginx, but here is the instruction: [Instruction to serve on nginx](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uswgi-and-nginx-on-ubuntu-18-04) ; If serve on Apache we recommand to run it with [gunicorn](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-18-04) then use apache to forward the port instead of Nginx(Note a copy of gunicorn configurations is in `gunicorn.conf.py.example`).

## Update Dependencies

DO NOT directly run `pip install` or `pip freeze`. Instead, add the library to `requirements.in` then run `pip-compile`
for better dependency management (need to run `pip install pip-tools` first)
