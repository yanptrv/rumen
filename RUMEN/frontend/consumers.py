import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class RequestConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'test'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        message = json.loads(text_data)['message']
        code = json.loads(text_data)['code']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'code': code,
            }
        )

    def chat_message(self, event):
        message = event['message']
        code = event['code']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
            'code': code,
        }))
