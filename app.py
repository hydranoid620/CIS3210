import json
import math

import MySQLdb
import MySQLdb.cursors
import requests
from flask import Flask, render_template, jsonify, request, session

app = Flask(__name__, static_url_path='')
app.secret_key = b'A+jWl4h6wMkR7LcWBm85AO8q'


def get_db() -> MySQLdb.Connection:
    db = MySQLdb.connect(host='dursley.socs.uoguelph.ca',
                         user='nrosati',
                         passwd='1037025',
                         db='nrosati')
    return db


def check_db_table():
    # Makes sure the table exists and has the right columns
    db = get_db()
    db.cursor().execute('CREATE TABLE IF NOT EXISTS `users` (`name` TINYTEXT, `password` TINYTEXT)')
    db.commit()
    db.close()


check_db_table()


# Serves the main HTML page
@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


@app.route('/login', methods=['POST'])
def login():
    request_json = request.get_json(force=True)
    db = get_db()
    db_cursor = db.cursor()

    # Try and find the user in the database
    if db_cursor.execute('SELECT * FROM users WHERE username=%s', (request_json['username'],)) > 0:
        if db_cursor.fetchall()[0][1] != request_json['password']:
            # Incorrect password
            db.close()
            return jsonify(message='Invalid login'), 401
    else:
        # User does not exist in the database, register them
        try:
            db_cursor.execute('INSERT INTO users VALUES (%s, %s)', (request_json['username'], request_json['password']))
            db.commit()
            db.close()
            session['username'] = request_json['username']
            session['logged_in'] = True
            return jsonify(newAccount=True), 200
        except MySQLdb.Error as e:
            db.rollback()
            db.close()
            return jsonify(message=e.args), 500

    # Set session variables and return logged in user
    db.close()
    session['username'] = request_json['username']
    session['logged_in'] = True
    return jsonify(message='Logged in', newAccount=False), 200


@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    session['logged_in'] = False
    return jsonify(message='OK'), 200


# Edit a user
@app.route('/users/<username>', methods=['PUT'])
def edit_user(username):
    request_json = request.get_json(force=True)
    db = get_db()
    db_cursor = db.cursor()

    try:
        if request_json['change'] == 'username':
            # Updates a user's username
            db_cursor.execute('UPDATE users SET username=%s WHERE username=%s', (request_json['username'], username))
            session['username'] = request_json['username']
        elif request_json['change'] == 'password':
            # Updates a user's password
            db_cursor.execute('UPDATE users SET password=%s WHERE username=%s', (request_json['password'], username))
        else:
            return jsonify(message='Bad request'), 400
        db.commit()
        db.close()
        return jsonify(message='OK'), 200
    except MySQLdb.Error as e:
        return jsonify(message=e.args), 500


# Delete user from database
@app.route('/users', methods=['DELETE'])
def delete_user():
    db = get_db()
    try:
        db.cursor().execute('DELETE FROM users WHERE username=%s', (session['username'],))
        db.commit()
        db.close()
        # Clear the session cookie
        session.pop('username', None)
        session.pop('logged_in', None)
        return jsonify(message='OK'), 200
    except MySQLdb.Error as e:
        db.rollback()
        db.close()
        return jsonify(message=e.args), 500


# This is all for talking to the Ficsit.app API

def make_query(query: str) -> requests.Response:
    return requests.post(url='https://api.ficsit.app/v2/query', data=query, headers={'Content-Type': 'application/json'})


def mod_count() -> int:
    response = make_query(json.dumps(
        {'query': 'query {getMods {count}}'}
    ))
    return json.loads(response.text)['data']['getMods']['count']


# Get full list of mods
@app.route('/ficsit/get_mods', methods=['POST'])
def get_mods():
    mods = []
    num_items = request.get_json(force=True)['numItems']

    if int(num_items) == -1:
        for i in range(0, math.floor(mod_count() / 100) + 1):
            response = make_query(json.dumps(
                {'query': 'query {getMods (filter: {limit: 100 offset: ' + str(i * 100) + '}) {mods {name id short_description versions{link}}}}'}
            ))
            mods.extend(json.loads(response.text)['data']['getMods']['mods'])
    elif int(num_items) <= 100:
        response = make_query(json.dumps(
            {'query': 'query {getMods (filter: {limit: ' + num_items + '}) {mods {name id short_description versions{link}}}}'}
        ))
        mods.extend(json.loads(response.text)['data']['getMods']['mods'])

    return jsonify(mods), 200


# Search for a mod
@app.route('/ficsit/search', methods=['POST'])
def search_for_mod():
    mods = []
    search_term = request.get_json(force=True)['searchTerm']
    num_items = int(request.get_json(force=True)['numItems'])

    if num_items == -1:
        for i in range(0, math.floor(mod_count() / 100) + 1):
            response = make_query(json.dumps(
                {'query': 'query {getMods (filter: {limit: 100 offset: ' + str(i * 100) + f' search: "{search_term}"' + '}) {mods {name id short_description versions{link}}}}'}
            ))
            mods.extend(json.loads(response.text)['data']['getMods']['mods'])
    elif num_items <= 100:
        response = make_query(json.dumps(
            {'query': 'query {getMods (filter: {limit: ' + str(num_items) + f' search: "{search_term}"' + '}) {mods {name id short_description versions{link}}}}'}
        ))
        mods.extend(json.loads(response.text)['data']['getMods']['mods'])
    return jsonify(mods), 200
