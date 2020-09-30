from flask import Flask, render_template, jsonify, request
import MySQLdb
import MySQLdb.cursors

app = Flask(__name__, static_url_path='')


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
            return jsonify({'message': 'OK'}), 200
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
            return jsonify({'message': 'OK'}), 200
        except MySQLdb.Error as e:
            db.rollback()
            if e.args[0] == 1054:  # If the supplied username was not found
                db.close()
                return jsonify(e.args), 404
            else:
                db.close()
                return jsonify(e.args), 500


@app.route('/register', methods=['POST'])
def register():
    db = get_db()
    try:
        sql = "INSERT INTO users VALUES (%s, %s)"
        db.cursor().execute(sql, (request.form['username'], request.form['password']))
        db.commit()
        db.close()
        return jsonify({'message': 'OK'}), 200
    except MySQLdb.Error as e:
        db.rollback()
        db.close()
        return jsonify(e.args), 500


@app.route('/login', methods=['POST'])
def login():
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "SELECT * FROM users WHERE username=%s AND password=%s"
        cursor.execute(sql, (request.form['username'], request.form['password']))
        if len(cursor.fetchall()) > 0:
            db.close()
            return jsonify({'message': 'OK'}), 200
        else:
            db.close()
        return {'message': 'User not found'}, 404
    except MySQLdb.Error as e:
        return jsonify(e.args), 500
