from flask import Flask, render_template, redirect
from flask_cors import cross_origin
from flask_pymongo import PyMongo
from flask import jsonify
import requests
import json
import os

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = os.environ.get('MONGO_URI', '')
mongo = PyMongo(app)

@app.route("/")
@app.route("/index.html")
def index():
    return render_template("index.html", listings=[])

@app.route("/products.html")
def products():
    return render_template("products.html", listings=[])

@app.route("/level1.html")
def level1():
    return render_template("level1.html", listings=[])

@app.route("/level2.html")
def level2():
    return render_template("level2.html", listings=[])

@app.route("/level3.html")
def level3():
    return render_template("level3.html", listings=[])

# # Used it to discover our heroky deployment IP
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

@app.route("/config_by_country/<contry_code>")
@cross_origin()
def config_by_country(contry_code):
    row = mongo.db.config_country.find_one({"code": f'{contry_code}'})
    del row['_id']

    return row

@app.route("/catalogs_by_country/<contry_code>")
@cross_origin()
def catalogs_by_country(contry_code):
    row = mongo.db.catalogs.find_one({"code": f'{contry_code}'})
    del row['_id']

    return row

@app.route("/features_by_country/")
@cross_origin()
def features_by_country():
    rows = mongo.db.areas.find({})

    features = []
    for row in rows:
        del row['_id']
        features = features + row['geojson_features']

    #features = rows[0]['geojson_features']
    #latitude = rows[0]['latitude']
    #longitude = rows[0]['longitude']
    #name = rows[0]['name']

    return {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": features
    }

@app.route("/features_by_area/<area_code>")
@cross_origin()
def features_by_area(area_code):
    print(f'{area_code}:{type(area_code)}')
    row = mongo.db.areas.find_one({"code": int(area_code)})
    
    code = row['code']
    name = row['name']  
    features = row['geojson_features']
    latitude = row['latitude']
    longitude = row['longitude']
    growth = row['growth']
    
    return {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": features,
        "latitude": latitude,
        "longitude": longitude,
        "code": code,
        "name": name,
        "growth": growth
    }

@app.route("/features_by_mun/<ent_code>/<mun_code>")
@cross_origin()
def features_by_mun(ent_code, mun_code):
    print(f'{ent_code}:{type(ent_code)}')
    print(f'{mun_code}:{type(mun_code)}')
    rows = mongo.db.geometries.find({
        "properties.CVE_ENT": int(ent_code),
        "properties.CVE_MUN": int(mun_code)
    })

    features = []
    for row in rows:
        del row['_id']
        features.append(row)

    catalog = mongo.db.catalogs.find_one({"code": "MX"})

    code = mun_code
    name = ''
    latitude = 0
    longitude = 0
    for area in catalog['areas']:
        if not name:
            for municipality in area['municipalities']:
                if (municipality['CVE_ENT'] == f"{ent_code}") & \
                    (municipality['CVE_MUN'] == f"{mun_code}".zfill(3)):
                    name = municipality['NOM_MUN']
                    latitude = municipality['latitude']
                    longitude = municipality['longitude']
                    break
    
    return {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": features,
        "latitude": latitude,
        "longitude": longitude,
        "code": code,
        "name": name
    }

@app.route("/houses_by_mun/<ent_code>/<mun_code>")
@cross_origin()
def houses_by_mun(ent_code, mun_code):
    print(f'{ent_code}:{type(ent_code)}')
    print(f'{mun_code}:{type(mun_code)}')
    rows = mongo.db.houses.find({
        "CVE_ENT": ent_code,
        "CVE_MUN": mun_code
    })

    print(rows)

    houses = []
    for row in rows:
        del row['_id']
        houses.append(row)

    return jsonify(houses)

@app.route("/features/<mun>")
@cross_origin()
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
