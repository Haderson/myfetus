import requests


BASE_URL = "http://127.0.0.1:8000"

new_item = {
    "email":"Testitem@gmail.com"
}
new_item_get = {"email": "TestItemForGet@gmail.com"}

response = requests.post(f"{BASE_URL}/items/", json=new_item)

get_response = requests.post(f"{BASE_URL}/items/", json=new_item)

print("STATUS_CODE:", response.status_code)
print("Response Json:", response.json())

get_response = requests.get(f"{BASE_URL}/items/")

print("GET Status:", get_response.status_code)
print("All Items:", get_response.json())
