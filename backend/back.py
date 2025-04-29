from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import sqlite3

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos
    allow_headers=["*"],  # Permite todos os headers
)

#banco de dados
conn = sqlite3.connect('database.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT NOT NULL UNIQUE)")
conn.commit()

#modelos
class Item(BaseModel):
    email: EmailStr

class ItemResponse(Item):
    id: int
    
#create    
@app.post("/items", response_model=ItemResponse)
def create_item(item: Item):
    cursor.execute('INSERT INTO items (email) VALUES (?)', (item.email,))
    conn.commit()
    item_id = cursor.lastrowid
    return ItemResponse(id=item_id, email=item.email)

#read all
@app.get("/items", response_model=List[ItemResponse])
def read_items():
    cursor.execute('SELECT id, email FROM items')
    rows = cursor.fetchall()
    return [ItemResponse(id=row[0], email=row[1]) for row in rows]

#read One
@app.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int):
    cursor.execute('SELECT id, email FROM items WHERE id = ?', (item_id,))
    row = cursor.fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return ItemResponse(id=row[0], email=row[1])

#update
@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: Item):
    cursor.execute('SELECT id FROM items WHERE id = ?', (item_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    cursor.execute('UPDATE items SET email = ? WHERE id = ?', (item.email, item_id))
    conn.commit()
    return ItemResponse(id=item_id, email=item.email)

#delete
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    cursor.execute('SELECT id FROM items WHERE id = ?', (item_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    cursor.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    return {"message": "Item deleted successfully"}