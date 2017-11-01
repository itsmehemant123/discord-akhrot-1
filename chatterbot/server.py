import time
import json
from os import listdir
from os.path import isfile, join
from flask import Flask, jsonify, json, request
from chatterbot import ChatBot

app = Flask(__name__)
chatbot = ChatBot('akhrot', logic_adapters=["chatterbot.logic.BestMatch"], trainer='chatterbot.trainers.ChatterBotCorpusTrainer')

@app.before_first_request
def setup_chatbot():
    print('RUN')

@app.route('/')
def greet():
    return 'Hello, World!'

@app.route('/write', methods = ['POST'])
def write_to_file():
    content = request.get_json()
    fHandle = open('./chatterbot/corpus/' + str(time.time()) + '.yml', 'w+')
    fHandle.write('categories:\n- discord-chat\nconversations:\n')
    fHandle.write(content['message'])
    fHandle.close()
    return 'Written'

@app.route('/train', methods = ['GET'])
def train():
    chatbot.train("./chatterbot/corpus/")
    return 'Trained'

@app.route('/respond', methods = ['POST'])
def get_response():
    content = request.get_json()
    statement = chatbot.get_response(content['message']).text
    print('RESPONDING:', statement, ' FOR :', content['message'])
    response_message = "{\"message\": \"" + statement + "\"}"
    return jsonify(response_message)
