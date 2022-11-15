from flask import Flask, render_template, redirect

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def homepage():
    return render_template('home.html')

@app.route('/app', strict_slashes=False)
def apppage():
    return render_template('app.html')

@app.route('/proyect', strict_slashes=False)
def proyectpage():
    return redirect("https://github.com/andres-chirinos/Contaminationproyect")

@app.route('/doc', strict_slashes=False)
def docpage():
    return render_template('doc.html')

@app.errorhandler(404)
def error(exception):
    return redirect("/")

if __name__ == '__main__':
    app.run(debug = True, port = 4000)#host = '0.0.0.0', port = 4000, debug=True)