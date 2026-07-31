"""Web app."""
import base64
import flask
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_mail import Mail, Message
import os
import pickle

from config import load_environment


LOADED_DOTENV_PATH = load_environment()
from training import prediction

app = Flask(__name__)
# Prefer a secret key from environment for production; fallback for dev
app.secret_key = os.getenv("SECRET_KEY", "floodml-secret")
app.config["LOADED_DOTENV_PATH"] = str(LOADED_DOTENV_PATH) if LOADED_DOTENV_PATH else None
app.config["OPENWEATHER_API_KEY"] = os.getenv("OPENWEATHER_API_KEY")

# Configure mail only if variables are present; avoid crashing when .env is incomplete
mail_server = os.getenv("MAIL_SERVER")
mail_port = os.getenv("MAIL_PORT")
mail_username = os.getenv("MAIL_USERNAME")
mail_password = os.getenv("MAIL_PASSWORD")
mail_default_sender = os.getenv("MAIL_DEFAULT_SENDER")

if mail_server and mail_username:
    app.config["MAIL_SERVER"] = mail_server
    try:
        app.config["MAIL_PORT"] = int(mail_port) if mail_port else 587
    except ValueError:
        app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = mail_username
    app.config["MAIL_PASSWORD"] = mail_password
    app.config["MAIL_DEFAULT_SENDER"] = mail_default_sender or mail_username
    mail = Mail(app)
else:
    # Create a dummy Mail object with minimal interface to avoid exceptions in contact() when mail is not configured
    class DummyMail:
        def send(self, *args, **kwargs):
            print("MAIL: send called but mail is not configured. Skipping send.")

    mail = DummyMail()

data = [{'name':'Delhi', "sel": "selected"}, {'name':'Mumbai', "sel": ""}, {'name':'Kolkata', "sel": ""}, {'name':'Bangalore', "sel": ""}, {'name':'Chennai', "sel": ""}]
# data = [{'name':'India', "sel": ""}]
months = [{"name":"May", "sel": ""}, {"name":"June", "sel": ""}, {"name":"July", "sel": "selected"}]
cities = [{'name':'Delhi', "sel": "selected"}, {'name':'Mumbai', "sel": ""}, {'name':'Kolkata', "sel": ""}, {'name':'Bangalore', "sel": ""}, {'name':'Chennai', "sel": ""}, {'name':'New York', "sel": ""}, {'name':'Los Angeles', "sel": ""}, {'name':'London', "sel": ""}, {'name':'Paris', "sel": ""}, {'name':'Sydney', "sel": ""}, {'name':'Beijing', "sel": ""}]

# Load ML model
model = pickle.load(open("model.pickle", 'rb'))


@app.route("/")
@app.route('/index.html')
def index() -> str:
    """Base page."""
    return flask.render_template("index.html")

@app.route('/plots.html')
def plots():
    return render_template('plots.html')

@app.route('/heatmaps.html')
def heatmaps():
    return render_template('heatmaps.html')

@app.route('/satellite.html')
def satellite():
    direc = "processed_satellite_images/Delhi_July.png"
    with open(direc, "rb") as image_file:
        image = base64.b64encode(image_file.read())
    image = image.decode('utf-8')
    return render_template('satellite.html', data=data, image_file=image, months=months, text="Delhi in January 2020")

@app.route('/satellite.html', methods=['GET', 'POST'])
def satelliteimages():
    place = request.form.get('place')
    date = request.form.get('date')
    data = [{'name':'Delhi', "sel": ""}, {'name':'Mumbai', "sel": ""}, {'name':'Kolkata', "sel": ""}, {'name':'Bangalore', "sel": ""}, {'name':'Chennai', "sel": ""}]
    months = [{"name":"May", "sel": ""}, {"name":"June", "sel": ""}, {"name":"July", "sel": ""}]
    for item in data:
        if item["name"] == place:
            item["sel"] = "selected"
    
    for item in months:
        if item["name"] == date:
            item["sel"] = "selected"

    text = place + " in " + date + " 2020"

    direc = "processed_satellite_images/{}_{}.png".format(place, date)
    with open(direc, "rb") as image_file:
        image = base64.b64encode(image_file.read())
    image = image.decode('utf-8')
    return render_template('satellite.html', data=data, image_file=image, months=months, text=text)

@app.route('/predicts.html')
def predicts():
    return render_template('predicts.html', cities=cities, cityname="Information about the city")


@app.route('/predicts.html', methods=["GET", "POST"])
def get_predicts():
    cities = [{'name': 'Delhi', "sel": ""}, {'name': 'Mumbai', "sel": ""}, {'name': 'Kolkata', "sel": ""}, {'name': 'Bangalore', "sel": ""}, {'name': 'Chennai', "sel": ""}, {'name': 'New York', "sel": ""}, {'name': 'Los Angeles', "sel": ""}, {'name': 'London', "sel": ""}, {'name': 'Paris', "sel": ""}, {'name': 'Sydney', "sel": ""}, {'name': 'Beijing', "sel": ""}]
    weather_error = None

    try:
        cityname = request.form.get("city", "").strip() or request.args.get("city", "").strip()
        if not cityname:
            return render_template('predicts.html', cityname="Please enter a city", cities=cities)

        for item in cities:
            if item['name'] == cityname:
                item['sel'] = 'selected'

        weather_data = prediction.get_weather(cityname)
        final = [
            weather_data["temperature"],
            weather_data["temp_max"],
            weather_data["wind_speed"],
            weather_data["clouds"],
            weather_data["rainfall"],
            weather_data["humidity"],
        ]
        final[4] *= 15

        if model is None:
            raise prediction.WeatherServiceError("Model not loaded")

        if str(model.predict([final])[0]) == "0":
            pred = "Safe"
        else:
            pred = "Unsafe"

        return render_template(
            'predicts.html',
            cityname="Information about " + cityname,
            cities=cities,
            temp=round(weather_data["temperature"], 2),
            maxt=round(weather_data["temp_max"], 2),
            wspd=round(weather_data["wind_speed"], 2),
            cloudcover=round(weather_data["clouds"], 2),
            percip=round(weather_data["rainfall"], 2),
            humidity=round(weather_data["humidity"], 2),
            pressure=round(weather_data["pressure"], 2),
            pred=pred,
            weather_error=None,
        )
    except prediction.WeatherServiceError as exc:
        if request.args.get("format") == "json" or request.accept_mimetypes.best == "application/json":
            return jsonify({"error": str(exc)}), 503
        weather_error = str(exc)
        return render_template(
            "predicts.html",
            cities=cities,
            cityname=str(exc),
            weather_error=weather_error,
        )
    except Exception as exc:
        if request.args.get("format") == "json" or request.accept_mimetypes.best == "application/json":
            return jsonify({"error": str(exc)}), 503
        return render_template(
            "predicts.html",
            cities=cities,
            cityname=str(exc),
            weather_error=str(exc),
        )


@app.route("/predict")
def predict_json():
    cityname = request.args.get("city", "").strip()
    if not cityname:
        return jsonify({"error": "Please provide a city name"}), 400

    try:
        weather_data = prediction.get_weather(cityname)
        return jsonify(weather_data)
    except prediction.WeatherServiceError as exc:
        return jsonify({"error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"error": str(exc)}), 503


@app.route("/contact", methods=["POST"])
def contact():
    try:
        name = request.form["name"]
        email = request.form["email"]
        subject = request.form["subject"]
        message = request.form["message"]

        msg = Message(
            subject=f"FloodGuard AI Contact: {subject}",
            recipients=[os.getenv("MAIL_USERNAME")]
        )

        # When you click Reply in Gmail, it replies to the visitor
        msg.reply_to = email

        msg.body = f"""
New Contact Form Submission

Name: {name}
Email: {email}

Subject:
{subject}

Message:
{message}
"""

        mail.send(msg)

        flash("Thank you!🎉 Your message has been sent successfully.🫡", "success")

    except Exception as e:
        print("Mail Error:", e)
        flash("⚠️ Failed to send message. Please try again later.", "danger")

    return redirect(url_for("index"))


if __name__ == "__main__":
    # Prefer PORT environment variable, default 5000
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "127.0.0.1")
    try:
        app.run(debug=True, host=host, port=port)
    except OSError as e:
        # Common cause: port already in use by macOS system service (Control Center / AirPlay)
        print(f"ERROR: Could not bind to {host}:{port}: {e}")
        if port == 5000:
            fallback = 5001
            print(f"Attempting to start on fallback port {fallback} instead.")
            app.run(debug=True, host=host, port=fallback)
        else:
            raise
