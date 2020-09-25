from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__, static_url_path='')


# app.debug = True


user_list = []


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


@app.route('/user', methods=['GET', 'POST', 'PUT', 'DELETE'])
def user():
    if request.method == 'GET':
        return jsonify(users=user_list)
    elif request.method == 'POST':
        user_list.append({
            'username': request.form.get('username'),
            'password': request.form.get('password')
        })
        return "OK", 200
    elif request.method == 'PUT':
        # Add to a global variable array
        # PUT used when URL is known
        return
    elif request.method == 'DELETE':
        # Remove from a global variable array
        return
