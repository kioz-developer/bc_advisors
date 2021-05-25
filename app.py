from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import requests
import json
import os

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
#app.config["MONGO_URI"] = os.environ.get('MONGO_URI', '')
app.config["MONGO_URI"] = "mongodb://localhost:27017/test"
mongo = PyMongo(app)

@app.route("/")
@app.route("/index.html")
def index():
    return render_template("index.html", listings=[])

@app.route("/products.html")
def products():
    return render_template("products.html", listings=[])

# Used it to discover our heroky deployment IP
@app.route("/show_ip")
def show_ip():
    remote_url = os.environ.get('SHOW_IP_URL', '')
    response = requests.get(remote_url)
    return f"{response.text}"

@app.route("/map")
def map():
    return render_template("choropleth.html", listings=[])

@app.route("/etl/<mun>")
def etl(mun):
    features = mongo.db.features
    print(f'Municipio to be loaded: {mun}')
    data = [] 
    with open(f'datasets/{mun}.geojson', mode="r", encoding="utf-8") as f:
        data = json.load(f)

    for feature in data['features']:
        features.insert_one(feature)
    
    return {"message": "Successful executed"}

@app.route("/features/<mun>")
def features(mun):
    rows = mongo.db.features.find({"properties.CVE_MUN": f'{mun}'})

    features = []
    for row in rows:
        del row['_id']
        features.append(row)

    return {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": features
    }

if __name__ == "__main__":
    app.run(debug=True)
