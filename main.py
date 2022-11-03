from flask import Flask, render_template, redirect, send_file

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def homepage():
    return 'home'

@app.route('/app', strict_slashes=False)
def apppage():
    return 'app'

@app.route('/doc', strict_slashes=False)
def docpage():
    return 'doc'

@app.route('/doc/poll', strict_slashes=False)
def pollpage():
    return redirect("https://docs.google.com/forms/d/e/1FAIpQLScr6EoAdKBgAX2p_I9ngHhBgmtgyf46Pcj0tB4ajEFa1VyEuA/viewform?usp=sf_link")

@app.route('/forum', strict_slashes=False)
def forumpage():
    return 'forum'

@app.route('/file', strict_slashes=False)
def getfiles():
    return send_file('Procfile')

# Make sure this we are executing this file
if __name__ == '__main__':
    app.run(debug=True)