import sqlite3
import json

# подключаемся к базе (создастся, если нет)
conn = sqlite3.connect("game.db")
cur = conn.cursor()

# создаём таблицу levels
cur.execute("""
CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    difficulty TEXT,
    grid TEXT,
    words TEXT
)
""")

# ---------------------------
# Уровни easy
easy_levels = [
    {
        "grid": [
            ["К","О","Т","А","Р"],
            ["Р","А","К","Е","Т"],
            ["Т","О","Р","Т","А"],
            ["А","К","О","Т","Р"],
            ["Р","Т","А","К","О"]
        ],
        "words": ["КОТ","РАК","ТОРТ"]
    }
]

# Уровни medium
medium_levels = [
    {
        "grid": [
            ["Д","О","М","А","Ш","А"],
            ["А","Р","Е","К","А","Т"],
            ["М","О","Р","Е","Т","О"],
            ["Ш","К","О","Л","А","Р"],
            ["Т","А","К","С","И","Н"],
            ["К","А","Р","Т","А","С"]
        ],
        "words": ["ДОМ","МОРЕ","ШКОЛА","ТАКСИ","КАРТА"]
    }
]

# Уровни hard
hard_levels = [
    {
        "grid": [
            ["К","О","М","П","Ь","Ю","Т"],
            ["А","Р","Х","И","В","О","Р"],
            ["Т","Е","Л","Е","Ф","О","Н"],
            ["С","И","С","Т","Е","М","А"],
            ["П","Р","О","Г","Р","А","М"],
            ["К","Л","А","В","И","А","Т"],
            ["М","О","Н","И","Т","О","Р"]
        ],
        "words": ["ТЕЛЕФОН","СИСТЕМА","МОНИТОР","КЛАВИАТ"]
    }
]

# функция для вставки уровней
def insert_levels(difficulty, levels_list):
    for lvl in levels_list:
        cur.execute(
            "INSERT INTO levels (difficulty, grid, words) VALUES (?, ?, ?)",
            (
                difficulty,
                json.dumps(lvl["grid"]),        # сохраняем сетку как JSON
                ",".join(lvl["words"])          # слова через запятую
            )
        )

# вставляем уровни
insert_levels("easy", easy_levels)
insert_levels("medium", medium_levels)
insert_levels("hard", hard_levels)

# сохраняем изменения и закрываем соединение
conn.commit()
conn.close()