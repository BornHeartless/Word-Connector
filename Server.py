from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect("game.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/levels")
def get_levels():
    conn = get_db()
    levels = conn.execute("SELECT * FROM levels").fetchall()
    conn.close()

    return jsonify([dict(lvl) for lvl in levels])

app.run(debug=True)