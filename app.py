from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_url_path='')


# app.debug = True


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


@app.route('/user', methods=['GET', 'POST'])
def user():
    if request.method == 'POST':
        print("POST message received!")
        print("Message:\t" + request.form['message']);
        print("Sending reply.")
        return {'message': 'Hello POST request!'}
    elif request.method == 'GET':
        print("GET message received! Sending reply.")
        return {'message': 'Hello GET request!'}
