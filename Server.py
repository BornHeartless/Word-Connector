from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect("game.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

@app.route("/levels")
def get_levels():
    lang = request.args.get("lang", "ru")
    conn = get_db()
    levels = conn.execute(
        "SELECT * FROM levels WHERE lang = ?", (lang,)
    ).fetchall()
    conn.close()

    return jsonify([dict(lvl) for lvl in levels])

app.run(debug=True)