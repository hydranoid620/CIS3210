from flask import Flask, render_template

app = Flask(__name__, static_url_path='')


# app.debug = True


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)
