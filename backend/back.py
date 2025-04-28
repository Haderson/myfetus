from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import sqlite3

app = FastAPI()

#banco de dados
conn = sqlite3.connect('database.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL)")
conn.commit()

#modelos
class Item(BaseModel):
    name: str

class ItemResponse(Item):
    id: int
    
#create    
@app.post("/items", response_model=ItemResponse)
def create_item(item: Item):
    cursor.execute('INSERT INTO items (name) VALUES (?)', (item.name,))
    conn.commit()
    item_id = cursor.lastrowid
    return ItemResponse(id=item_id, name=item.name)

#read all
@app.get("/items", response_model=List[ItemResponse])
def read_items():
    cursor.execute('SELECT id, name FROM items')
    rows = cursor.fetchall()
    return [ItemResponse(id=row[0], name=row[1]) for row in rows]


#read One
@app.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int):
    cursor.execute('SELECT id, name FROM items WHERE id = ?', (item_id,))
    row = cursor.fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemResponse(id=row[0], name=row[1])

#update
@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: Item):
    cursor.execute('SELECT id FROM items WHERE id = ?', (item_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    cursor.execute('UPDATE items SET name = ? WHERE id = ?', (item.name, item_id))
    conn.commit()
    return ItemResponse(id=item_id, name=item.name)

#delete
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    cursor.execute('SELECT id FROM items WHERE id = ?', (item_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    cursor.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    return {"message": "Item deleted successfully"}
