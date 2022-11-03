from flask import Flask, render_template, redirect

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def homepage():
    return render_template('home.html')

@app.route('/app', strict_slashes=False)
def apppage():
    return render_template('app.html')

@app.route('/wiki', strict_slashes=False)
def wikipage():
    return redirect("https://github.com/andres-chirinos/Contaminationproyect/wiki")

@app.route('/discussions', strict_slashes=False)
def discusspage():
    return redirect("https://github.com/andres-chirinos/Contaminationproyect/discussions")

@app.route('/poll', strict_slashes=False)
def pollpage():
    return redirect("https://docs.google.com/forms/d/e/1FAIpQLScr6EoAdKBgAX2p_I9ngHhBgmtgyf46Pcj0tB4ajEFa1VyEuA/viewform?usp=sf_link")


# Make sure this we are executing this file
if __name__ == '__main__':
    app.run(debug=True)