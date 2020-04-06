import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
from firebase_admin import firestore
import time
import requests
import json
from firebase_module import FireBase

file_certificate_firebase = "thanhdong-test-firebase-adminsdk-by3u0-f5206bcfbe.json"

# cred = credentials.Certificate("thanhdong-test-firebase-adminsdk-by3u0-f5206bcfbe.json")
# app_firebase=firebase_admin.initialize_app(cred)
# print(app_firebase.name)
# ts = time.time()
registration_tokens = [
    'dFPKlfS0r50:APA91bFdXX6cizxFJ6S3jAjuxB11jFAdz-xB3A7gWQJrDyPKDQkRBZAuyJVamosMLEA8HifCt6aLGMErMGhuFIDzKJE-QiBixmtcg8yoX2TktMgn8pmvLLylJWTdLdjH6RL4cHubBi9s',
    'cW7Tf7DX93M:APA91bEoXy03OnunYLibjQ263brtaeC5RpWSNnZ2JZ7Y-KdPyO-snHsicTbNiQc42cPY77NcFim4AG-IV-aLaOb7rwTOB2rz-IWh6an8mOWx-uofehdNUOL5RO4pxcCaCTG9caD7DuGp',
]
topic = "thanhdong"
test_firebase = FireBase(file_certificate_firebase)

data={"hello":"tui la dong"}
# for i in range(11):
# 	data={"hello":"tui la dong"+str(i)}
# 	test_firebase.send_specific_client(registration_tokens[1],data)
# test_firebase.send_multicast_client(registration_tokens,data)
# test_firebase.get_topic_is_registered(registration_tokens[0])
# test_firebase.register_topic(registration_tokens,topic)
# test_firebase.register_topic(registration_tokens,topic)
data={
	
	"hello":"tui la dong 2",
	"thanhdong": 123
}

data = json.dumps(data)
data = {
	'data': data
}
test_firebase.send_group_client_inTopic(topic,(data))
# messages = [
#     messaging.Message(
#         notification=messaging.Notification(title='Price drop',body= '5% off all electronics'),
#         token=registration_token1,
#         data={'ti':"hello"},
#     ),
#     # ...
#     messaging.Message(
#         notification=messaging.Notification('Price drop', '2% off all books'),
#         data={'adf':"12312"},
#         topic='thanhdong',
#     ),
# ]
# print("gui")
# response = messaging.send_all(messages)
# # See the BatchResponse reference documentation
# # for the contents of response.
# print('{0} messages were sent successfully'.format(response.success_count))
