from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import MySQLdb
import MySQLdb.cursors

app = Flask(__name__, static_url_path='')
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


# app.debug = True


def get_db():
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


# General user information API endpoint
@app.route('/users', methods=['GET'])
def user():
    db = get_db()
    cursor = db.cursor()
    try:
        # Returns the list of users
        cursor.execute('SELECT * FROM `users`')
        json_result = []
        for row in cursor.fetchall():
            json_result.append({'username': row[0], 'password': row[1]})
        db.close()
        return jsonify(json_result), 200
    except MySQLdb.Error as e:
        db.close()
        return jsonify(e.args), 500


@app.route('/users/<username>', methods=['PUT', 'DELETE'])
def edit_user(username):
    # Updates a user's password
    if request.method == 'PUT':
        db = get_db()
        try:
            sql = "UPDATE users SET password=%s WHERE username=%s"
            db.cursor().execute(sql, (request.form['password'], username))
            db.commit()
            db.close()
            return jsonify(message='OK'), 200
        except MySQLdb.Error as e:
            db.rollback()
            if e.args[0] == 1054:  # If the supplied username was not found
                db.close()
                return jsonify(e.args), 404
            else:
                db.close()
                return jsonify(e.args), 500

    # Deletes a user from the database
    elif request.method == 'DELETE':
        db = get_db()
        try:
            sql = "DELETE FROM users WHERE username=%s"
            db.cursor().execute(sql, (username,))
            db.commit()
            db.close()
            return jsonify(message='OK'), 200
        except MySQLdb.Error as e:
            db.rollback()
            db.close()
            return jsonify(e.args), 500


# TODO: Remove
# @app.route('/register', methods=['POST'])
def register():
    db = get_db()
    try:
        sql = "INSERT INTO users VALUES (%s, %s)"
        db.cursor().execute(sql, (request.form['username'], request.form['password']))
        db.commit()
        db.close()
        return jsonify(message='OK'), 200
    except MySQLdb.Error as e:
        db.rollback()
        db.close()
        return jsonify(e.args), 500


@app.route('/login', methods=['POST'])
def login():
    request_json = request.get_json()
    db = get_db()
    db_cursor = db.cursor()

    # Try and find the user in the database
    if db_cursor.execute("SELECT * FROM users WHERE username=%s", (request_json['username'],)) > 0:
        if db_cursor.fetchall()[0][1] != request_json['password']:
            # Incorrect password
            db.close()
            return jsonify(message='Invalid login'), 401
    else:
        # User does not exist in the database, register them
        try:
            db_cursor.execute("INSERT INTO users VALUES (%s, %s)", (request_json['username'], request_json['password']))
            db.commit()
        except MySQLdb.Error as e:
            db.rollback()
            db.close()
            return jsonify(e.args), 500
    db.close()

    # Set session variables and return
    session['username'] = request_json['username']
    session['logged_in'] = True
    return redirect(url_for('index'))


@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    session['logged_in'] = False
    return redirect(url_for('index'))
