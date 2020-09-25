from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__, static_url_path='')

# app.debug = True


user_list = []


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


@app.route('/user', methods=['GET', 'POST'])
def user():
    # Returns the user_list
    if request.method == 'GET':
        print('Sending user list')
        return jsonify(users=user_list), 200
    # Adds a user to the user_list
    elif request.method == 'POST':
        user_list.append({
            'username': request.form.get('username'),
            'password': request.form.get('password')
        })
        print('Added user: ' + request.form.get('username'))
        return {'message': 'OK'}, 200


@app.route('/user/<username>', methods=['PUT', 'DELETE'])
def edit_user(username):
    # Updates a user's password
    if request.method == 'PUT':
        username_index = find_in_json_array(username)
        if username_index == -1:
            return {'message': 'User not found.'}, 404
        else:
            user_list[username_index]['password'] = request.form.get('newpassword')
        print('Modified user: ' + username)
        return {'message': 'OK'}, 200
    # Deletes a user from the user_list
    elif request.method == 'DELETE':
        username_index = find_in_json_array(username)
        if username_index == -1:
            return {'message': 'User not found.'}, 404
        else:
            user_list.pop(username_index)
        print('Deleted user: ' + username)
        return {'message': 'OK'}, 200


# Necessary function cause the userlist is an array of JSON objects
def find_in_json_array(username):
    for i in range(0, len(user_list)):
        if user_list[i]['username'] == username:
            return i
    return -1
