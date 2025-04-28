from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import sqlite3

app = FastAPI()

conn = sqlite3.connect('database.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL)")
conn.commit()

class Item(BaseModel):
    name: str

class ItemResponse(Item):
    id: int

@app.post("/items", reponse_model=ItemResponse)
def create_item(item: Item):
    cursor.execute('INSERT INTO items (name) VALUES (?)', (item.name,))
    conn.commit()
    item_id = cursor.lastrowid
    return ItemResponse(id=item_id, name=item.name)

@app.get("/items", reponse_model=List[ItemResponse])
def read_items():
    cursor.execute('SELECT id, name FROM items')
    rows = cursor.fetchall()
    return [ItemResponse(id=row[0], name=row[1]) for row in rows]