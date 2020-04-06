import logging
import json, os
import requests
from flask import request, Response, render_template, jsonify, Flask
from pywebpush import webpush, WebPushException
from firebase_module import FireBase

file_certificate_firebase = "thanhdong-test-firebase-adminsdk-by3u0-f5206bcfbe.json"
firebase_model = FireBase(file_certificate_firebase)

app = Flask(__name__)
app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'

@app.after_request
def apply_caching(response):
  response.headers["Access-Control-Allow-Origin"] = "*"
  response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
  response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH"
  return response

DER_BASE64_ENCODED_PRIVATE_KEY_FILE_PATH = os.path.join(os.getcwd(),"private_key.txt")
DER_BASE64_ENCODED_PUBLIC_KEY_FILE_PATH = os.path.join(os.getcwd(),"public_key.txt")

VAPID_PRIVATE_KEY = open(DER_BASE64_ENCODED_PRIVATE_KEY_FILE_PATH, "r+").readline().strip("\n")
VAPID_PUBLIC_KEY = open(DER_BASE64_ENCODED_PUBLIC_KEY_FILE_PATH, "r+").read().strip("\n")

VAPID_CLAIMS = {
"sub": "mailto:develop@raturi.in"
}

def send_web_push(subscription_information, message_body):
    return webpush(
        subscription_info=subscription_information,
        data=message_body,
        vapid_private_key=VAPID_PRIVATE_KEY,
        vapid_claims=VAPID_CLAIMS
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/subscription/", methods=["GET", "POST"])
def subscription():
    """
        POST creates a subscription
        GET returns vapid public key which clients uses to send around push notification
    """

    if request.method == "GET":
        return Response(response=json.dumps({"public_key": VAPID_PUBLIC_KEY}),
            headers={"Access-Control-Allow-Origin": "*"}, content_type="application/json")

    subscription_token = request.get_json("subscription_token")
    return Response(status=201, mimetype="application/json")

@app.route("/get_client_key/",methods=["POST"])
def get_client_key():
  if request.method == "POST":
    print(request.json)
    token = request.json.get('client_key')
    # print(type(token))
    client_key = token
    # print(type(client_key))
    data = {"hello":'mình là Đông'}
    firebase_model.send_specific_client(token,data)
    # send_message_toFCM(client_key,data)
    # client_key = "BGtxZ26wAmJb8NWzJ6O6sBc8hkC6UgIwPdj79HWYEqSLWgXvu6c8_bmMuh7M-VNCeOHUJnC8tGt7LciQdR9vpDc"
    # send_message_toFCM(client_key,data)

    # token = json.loads(token)
    return jsonify({'success':1,'data':'Da Nhan Duoc Client Key'})

def send_message_toFCM(client_key, data_dictionary):
  url = 'https://fcm.googleapis.com/fcm/send'
  # client_key = "dFPKlfS0r50:APA91bFdXX6cizxFJ6S3jAjuxB11jFAdz-xB3A7gWQJrDyPKDQkRBZAuyJVamosMLEA8HifCt6aLGMErMGhuFIDzKJE-QiBixmtcg8yoX2TktMgn8pmvLLylJWTdLdjH6RL4cHubBi9s"
  # client_key = "758928510591"
  data = {}
  header = {
    "Authorization":
   "key=AAAAsLOqDn8:APA91bGhv0dGRIeN9qdXDZlxJ8pRrS7TJ2EbRnoEa5ywV62bAetv9I7JwYm0ctybgpGm-h4F09DGR6ENRJQtsF2t8xb3gWicFTGuFAdMLsnEw9lSYEOMmH7NbSG_efPNCXaZD2eJ-Tr0",
    "Content-Type":"application/json"
   }
  data_dictionary ={ "notification" : {
                        "title" : "example title",
                        "body" : "example body"
                    },
                      "data" : {
                        "foo" : "bar",
                        "refresh_data" : 1 }
                    }
  data['to'] = client_key
  for key in data_dictionary.keys():
    data[key] = data_dictionary[key]
  data = json.dumps(data)
  send_toFCM = requests.post(url, data = data,headers=header)

@app.route('/get_image/',methods=["GET"])
def get_image():
  data = {
      'link':"https://cdn.pose.com.vn/assets/2018/04/20-1524070432210224184628.jpg"
  }
  return jsonify(data)

@app.route("/push_v1/",methods=['POST'])
def push_v1():
    message = "Push Test v1"
    print("is_json",request.is_json)

    if not request.json or not request.json.get('sub_token'):
        return jsonify({'failed':1})

    # print("request.json",request.json)

    token = request.json.get('sub_token')
    try:
        token = json.loads(token)
        send_web_push(token, message)
        return jsonify({'success':1})
    except Exception as e:
        print("error",e)
        return jsonify({'failed':str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8080)
