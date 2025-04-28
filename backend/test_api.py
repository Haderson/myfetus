import requests


BASE_URL = "http://127.0.0.1:8000"

new_item = {
    "name":"Test item"
}

response = requests.post(f"{BASE_URL}/items/", json=new_item)

print("STATUS_CODE:", response.status_code)
print("Response Json:", response.json())
