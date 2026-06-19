from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import random
import string
import json

app = Flask(__name__)
CORS(app)

def empty_grid(size):
    return [["" for _ in range(size)] for __ in range(size)]

def put_word(grid, word):
    n = len(grid)
    dirs = [(0,1),(1,0),(1,1),(-1,0),(0,-1),(-1,-1),(1,-1),(-1,1)]
    random.shuffle(dirs)
    for dx, dy in dirs:
        for attempt in range(100):
            x = random.randrange(n)
            y = random.randrange(n)
            end_x = x + dx*(len(word)-1)
            end_y = y + dy*(len(word)-1)
            if end_x not in range(n) or end_y not in range(n):
                continue
            ok = True
            for i, ch in enumerate(word):
                cx = x + dx*i
                cy = y + dy*i
                if grid[cy][cx] not in ("", ch):
                    ok = False
                    break
            if not ok:
                continue
            for i, ch in enumerate(word):
                cx = x + dx*i
                cy = y + dy*i
                grid[cy][cx] = ch
            return True
    return False

def fill_grid(grid, lang="ru"):
    if lang == "ru":
        letters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
    elif lang == "en":
        letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    elif lang == "he":
        letters = "אבגדהוזחטיכלמנסעפצקרשת"
    for y in range(len(grid)):
        for x in range(len(grid)):
            if grid[y][x] == "":
                grid[y][x] = random.choice(letters)

def gen_level(difficulty="easy", lang="ru"):
    word_sets = {
        "ru": {
            "easy": ["КОТ","ДОМ","САД","МЫШЬ","СОЛНЦЕ","СИЛА","ЛЮБОВЬ","ЗВЕЗДА","МОРЕ","КАША"],
            "medium": ["КОМПЬЮТЕР","ИГРА","ПРОГРАММА","УРОВЕНЬ","СЕРВЕР","КЛАВИАТУРА","МОНИТОР","ИНТЕРНЕТ","ТЕЛЕФОН","КНИГА","ШКОЛА","ГОРОД"],
            "hard": ["АЛГОРИТМ","ИНФОРМАТИКА","КВАНТОВЫЙ","ИНТЕРФЕЙС","ОПТИМИЗАЦИЯ","КРИПТОГРАФИЯ","ВИРТУАЛЬНЫЙ","БЕЗОПАСНОСТЬ","ПРОГРАММИРОВАНИЕ","АНАЛИЗ","СИСТЕМА","КОД"]
        },
        "en": {
            "easy": ["CAT","DOG","HOME","SUN","TREE","POWER","LOVE","STAR","PORIDGE","SEA"],
            "medium": ["COMPUTER","GAME","PROGRAM","LEVEL","SERVER","KEYBOARD","MONITOR","INTERNET","PHONE","BOOK","SCHOOL","CITY"],
            "hard": ["ALGORITHM","INFORMATICS","INTERFACE","OPTIMIZATION","CRYPTOGRAPHY","QUANTUM","VIRTUAL","SECURITY","PROGRAMMING","ANALYSIS","SYSTEM","CODE"]
        },
        "he": {
            "easy": ["","בית","גן","שמש","עץ","כוח","אהבה","כוכב","דייסה","ים"],
            "medium": ["פוטין","טראמפ","מילונוו","סטאלין","אובמה","בידן","לוקאשנקו","יאהו","מדורו","זלנסקי","נבלני","מדבדב"],
            "hard": ["ידע","ביתספר","מוח","מיקצוע","חובה","זיכרון","חינוך","סיעורמוחות","מידה","מחשבה","הדרכה","החשרה"]
        }

    }
    size = {"easy":8,"medium":10,"hard":12}.get(difficulty,8)
    items = word_sets.get(lang, word_sets["ru"]).get(difficulty, word_sets["ru"]["easy"])
    
    # Изменено количество слов
    num_words = {"easy": 5, "medium": 7, "hard": 9}.get(difficulty, 5)
    words = random.sample(items, min(num_words, len(items)))
    
    grid = empty_grid(size)
    placed = []
    for w in words:
        if put_word(grid, w):
            placed.append(w)
    fill_grid(grid, lang)
    return {"id": random.randint(1000,9999), "lang": lang, "difficulty": difficulty, "grid": grid, "words": placed}

def init_db():
    conn = sqlite3.connect("game.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lang TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            grid TEXT NOT NULL,
            words TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

@app.route("/generate-level")
def generate_level():
    lang = request.args.get("lang", "ru")
    diff = request.args.get("difficulty", "easy")
    return jsonify(gen_level(diff, lang))

@app.route("/save-level", methods=["POST"])
def save_level():
    data = request.json or {}
    lang = data.get("lang", "ru")
    difficulty = data.get("difficulty", "easy")
    grid = data.get("grid", [])
    words = data.get("words", [])

    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO levels (lang, difficulty, grid, words) VALUES (?, ?, ?, ?)",
            (lang, difficulty, json.dumps(grid), json.dumps(words))
        )
        conn.commit()
        return jsonify({"status": "ok", "message": "Уровень сохранён"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()

@app.route("/get-levels")
def get_levels():
    try:
        lang = request.args.get("lang", "ru")
        difficulty = request.args.get("difficulty", "easy")

        conn = get_db()
        levels = conn.execute(
            "SELECT * FROM levels WHERE lang=? AND difficulty=? ORDER BY id ASC",
            (lang, difficulty)
        ).fetchall()
        conn.close()

        if levels:
            return jsonify([{
                "id": lvl["id"],
                "lang": lvl["lang"],
                "difficulty": lvl["difficulty"],
                "grid": json.loads(lvl["grid"]),
                "words": json.loads(lvl["words"])
            } for lvl in levels])
        else:
            return jsonify([])
    except Exception as e:
        print(f"Ошибка в get_levels: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/delete-level/<int:level_id>", methods=["DELETE"])
def delete_level(level_id):
    conn = get_db()
    try:
        conn.execute("DELETE FROM levels WHERE id=?", (level_id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "Уровень удалён"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()

@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"status":"error","message":"Заполните логин и пароль"}), 400
    conn = get_db()
    try:
        conn.execute("INSERT INTO users(username,password) VALUES (?,?)",(username,password))
        conn.commit()
        return jsonify({"status":"ok"})
    except sqlite3.IntegrityError:
        return jsonify({"status":"error","message":"Пользователь уже существует"}), 409
    except Exception:
        return jsonify({"status":"error","message":"Ошибка сервера"}), 500
    finally:
        conn.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"status":"error","message":"Заполните логин и пароль"}), 400
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username=? AND password=?", (username,password)).fetchone()
    conn.close()
    if user:
        return jsonify({"status":"ok"})
    return jsonify({"status":"error","message":"Неверный логин или пароль"}), 401

def get_db():
    conn = sqlite3.connect("game.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    return response

if __name__ == "__main__":
    init_db()
    app.run(debug=True)