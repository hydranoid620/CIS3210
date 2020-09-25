from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__, static_url_path='')


# app.debug = True


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


@app.route('/user', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user():
    if request.method == 'GET':
        return {
            'message': 'This is a response to a GET request!',
            'time': datetime.now().strftime("%H:%M:%S")
        }
    elif request.method == 'POST':
        req_data = request.form.get('message')
        return {
            'message': req_data,
            'reverse_message': req_data[::-1]
        }
    elif request.method == 'PUT':
        # Add to a global variable array
        # PUT used when URL is known
        return
    elif request.method == 'DELETE':
        # Remove from a global variable array
        return
