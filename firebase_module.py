import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
import requests
import json

file_certificate_firebase = "thanhdong-test-firebase-adminsdk-by3u0-f5206bcfbe.json"

class FireBase():
  def __init__(self, file_certificate_firebase):
    """
    :param file_certificate_firebase: link of file_certificate.json in local device
    """
    cred = credentials.Certificate(file_certificate_firebase)
    firebase_admin.initialize_app(cred)
    self.__server_key = "AAAAsLOqDn8:APA91bGhv0dGRIeN9qdXDZlxJ8pRrS7TJ2EbRnoEa5ywV62bAetv9I7JwYm0ctybgpGm-h4F09DGR6ENRJQtsF2t8xb3gWicFTGuFAdMLsnEw9lSYEOMmH7NbSG_efPNCXaZD2eJ-Tr0"
    self.__api_key = "AIzaSyBqjgZu1tbZcFOMtPobJz-c8Sa9o_uhkcA"

  def register_topic(self, list_registration_token, name_topic):
    """
    Function to add or create group under name is topic
    :param list_registration_token: [list, registration, token] in list format
    :param name_topic: name of the groups consists of token's app
    :return: None
    """
    response = messaging.subscribe_to_topic(list_registration_token, name_topic)
    print(response.success_count, 'tokens were subscribed successfully')
    return

  def unregister_topic(self, list_registration_token, name_topic):
    """
    Function to remove member to the group or remove group if it's empty
    :param list_registration_token:  [list, registration, token] in list format
    :param name_topic: name of the groups consists of token's app
    :return: None
    """
    response = messaging.unsubscribe_from_topic(list_registration_token, name_topic)
    # See the TopicManagementResponse reference documentation
    # for the contents of response.
    print(response.success_count, 'tokens were unsubscribed successfully')
    return

  def get_topic_is_registered(self, registration_token):
    """
    Function to get list topic which is token's app belong to
    :param registration_token: token which is registered with server via FCM
    :return: None
    """
    header = {
        "Authorization":
      "key="+self.__server_key,
        "Content-Type":"application/json"
      }
    x = requests.get('https://iid.googleapis.com/iid/info/'+registration_token+'?Authorization:key='+self.__api_key+'&details=true',headers = header)
    data  = json.loads(x.text)
    try:
      print(data['rel'])
    except:
      print("Registration token is not in any topic")
    return

  def send_specific_client(self, registration_token, data):
    """
    Function to send message to specification device
    :param registration_token: token which is registered with server via FCM
    :param data: Data send to client by json format
    :return: None
    """
    message = messaging.Message(
        data=data,
        token=registration_token,
    )
    response = messaging.send(message)
    print('Successfully sent message:', response)
    return

  def send_multicast_client(self,registration_tokens, data):
    """
    Function to send message to multi device
    :param registration_tokens: list of token which is registered with server via FCM
    :param data: Data send to client by json format
    :return: None
    """
    message = messaging.MulticastMessage(
        data=data,
        tokens=registration_tokens,
    )
    response = messaging.send_multicast(message)
    print('{0} messages were sent successfully'.format(response.success_count))
    if response.failure_count > 0:
        responses = response.responses
        failed_tokens = []
        for idx, resp in enumerate(responses):
            if not resp.success:
                failed_tokens.append(registration_tokens[idx])
        print('List of tokens that caused failures: {0}'.format(failed_tokens))
    return

  def send_group_client_inTopic(self, name_topic, data):
    """
    Function to send message to group include registration token
    :param name_topic: name of the group
    :param data: Data send to client by json format
    :return: None
    """
    message = messaging.Message(
        data=data,
        topic=name_topic,
    )
    response = messaging.send(message)
    print('Successfully sent message:', response)
    return
