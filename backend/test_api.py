import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
import json

c = Client()

print("--- 1. Testing GET /api/categories/ ---")
r = c.get('/api/categories/')
print(f"Status: {r.status_code}, count: {len(r.json())}")

print("\n--- 2. Testing GET /api/products/ ---")
r = c.get('/api/products/')
data = r.json()
print(f"Status: {r.status_code}, total count: {data.get('count')}, results in page: {len(data.get('results', []))}")

print("\n--- 3. Testing GET /api/products/?category=gadgets ---")
r = c.get('/api/products/?category=gadgets')
data = r.json()
print(f"Status: {r.status_code}, count: {data.get('count')}")

print("\n--- 4. Testing GET /api/products/?search=Nike ---")
r = c.get('/api/products/?search=Nike')
data = r.json()
print(f"Status: {r.status_code}, count: {data.get('count')}, names: {[p['name'] for p in data.get('results', [])]}")

print("\n--- 5. Testing GET /api/products/1/ ---")
r = c.get('/api/products/1/')
print(f"Status: {r.status_code}, product: {r.json().get('name')}, sku: {r.json().get('sku')}, similar: {len(r.json().get('similar_products', []))}")

print("\n--- 6. Testing POST /api/auth/login/ ---")
r = c.post('/api/auth/login/', data=json.dumps({"email": "ivan@mail.com", "password": "password123"}), content_type="application/json")
tokens = r.json()
print(f"Status: {r.status_code}, user: {tokens.get('user', {}).get('email')}, access token present: {'access' in tokens}")

access_token = tokens.get('access')

print("\n--- 7. Testing GET /api/auth/me/ ---")
r = c.get('/api/auth/me/', HTTP_AUTHORIZATION=f'Bearer {access_token}')
print(f"Status: {r.status_code}, profile: {r.json()}")

print("\n--- 8. Testing POST /api/orders/ (guest) ---")
guest_order_data = {
    "full_name": "Гость Тестовый",
    "phone": "+996555112233",
    "email": "guest@test.local",
    "address": "Бишкек, Манаса 10",
    "delivery_method": "courier",
    "payment_method": "cash",
    "comment": "Тестовый гостевой заказ",
    "items": [
        {"product": 1, "quantity": 1}
    ]
}
r = c.post('/api/orders/', data=json.dumps(guest_order_data), content_type="application/json")
print(f"Status: {r.status_code}, order id: {r.json().get('id')}, total: {r.json().get('total')}")

print("\n--- 9. Testing GET /api/orders/ (user history) ---")
r = c.get('/api/orders/', HTTP_AUTHORIZATION=f'Bearer {access_token}')
print(f"Status: {r.status_code}, orders count: {r.json().get('count')}")

print("\n--- 10. Testing GET /api/docs/ (Swagger) ---")
r = c.get('/api/docs/')
print(f"Status: {r.status_code}")
