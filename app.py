from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import MySQLdb
import MySQLdb.cursors

app = Flask(__name__, static_url_path='')
app.secret_key = b'A+jWl4h6wMkR7LcWBm85AO8q'


def get_db():
    db = MySQLdb.connect(host='dursley.socs.uoguelph.ca',
                         user='nrosati',
                         passwd='1037025',
                         db='nrosati')
    return db


def check_db_table():
    # Makes sure the table exists and has the right columns
    db = get_db()
    db.cursor().execute("CREATE TABLE IF NOT EXISTS `users` (`name` TINYTEXT, `password` TINYTEXT)")
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
            return jsonify(message=e.args), 500
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


@app.route('/users/<username>', methods=['PUT'])
def edit_user(username):
    # Updates a user's password
    request_json = request.get_json(force=True)
    db = get_db()
    db_cursor = db.cursor()

    try:
        if request_json['change'] == 'username':
            db_cursor.execute("UPDATE users SET username=%s WHERE username=%s", (request_json['username'], username))
        elif request_json['change'] == 'password':
            db_cursor.execute("UPDATE users SET password=%s WHERE username=%s", (request_json['password'], username))
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
        db.cursor().execute("DELETE FROM users WHERE username=%s", (session['username'],))
        db.commit()
        db.close()
        # Clear the session cookie
        session.pop('username', None)
        session.pop('logged_in', None)
        return redirect(url_for('index'))
    except MySQLdb.Error as e:
        db.rollback()
        db.close()
        return jsonify(message=e.args), 500
