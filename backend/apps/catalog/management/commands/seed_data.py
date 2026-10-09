import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
from apps.catalog.models import Category, Product, ProductImage
from apps.orders.models import Order, OrderItem
from apps.users.models import UserProfile

import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def download_or_create_image(filepath, url, text, bg_color=(41, 128, 185), size=(600, 600)):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 5000:
        return
    if url:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                content = response.read()
                with open(filepath, 'wb') as f:
                    f.write(content)
                return
        except Exception as e:
            print(f"Fallback to placeholder for {filepath}: {e}")

    img = Image.new('RGB', size, color=bg_color)
    draw = ImageDraw.Draw(img)
    draw.rectangle([20, 20, size[0]-20, size[1]-20], outline=(255, 255, 255), width=3)
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    draw.text((size[0]//2 - 40, size[1]//2 - 10), text[:15], fill=(255, 255, 255), font=font)
    img.save(filepath, 'JPEG')

class Command(BaseCommand):
    help = 'Заполняет базу данных начальными тестовыми данными'

    def handle(self, *args, **options):
        self.stdout.write("Создание администратора и тестового пользователя...")
        # Admin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@store.local', 'first_name': 'Администратор', 'is_staff': True, 'is_superuser': True}
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Суперпользователь создан: admin / admin123"))

        # Customer
        test_user, created = User.objects.get_or_create(
            username='ivan@mail.com',
            defaults={'email': 'ivan@mail.com', 'first_name': 'Иван Иванов'}
        )
        if created:
            test_user.set_password('password123')
            test_user.save()
            profile, _ = UserProfile.objects.get_or_create(user=test_user)
            profile.phone = '+996700123456'
            profile.save()
            self.stdout.write(self.style.SUCCESS("Тестовый клиент создан: ivan@mail.com / password123"))

        media_root = settings.MEDIA_ROOT

        # Categories
        self.stdout.write("Создание категорий...")
        categories_data = [
            ("Смартфоны и гаджеты", "gadgets", (52, 152, 219)),
            ("Ноутбуки и ПК", "laptops", (46, 204, 113)),
            ("Обувь и одежда", "shoes-clothing", (230, 126, 34)),
            ("Аудио и наушники", "audio", (155, 89, 182)),
            ("Спорт и отдых", "sports", (231, 76, 60)),
        ]

        categories_map = {}
        for name, slug, color in categories_data:
            cat_img_rel = f"categories/{slug}.jpg"
            cat_img_abs = os.path.join(media_root, cat_img_rel)
            create_placeholder_image(cat_img_abs, name, bg_color=color, size=(400, 300))

            category, _ = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'is_active': True,
                    'image': cat_img_rel
                }
            )
            categories_map[slug] = category

        # Products (at least 14 items to test pagination of 12)
        self.stdout.write("Создание товаров...")
        products_data = [
            {
                "category": "gadgets",
                "name": "Смартфон Ultra Pro 15",
                "slug": "smartphone-ultra-pro-15",
                "sku": "PH-001",
                "price": Decimal("64990.00"),
                "old_price": Decimal("69990.00"),
                "stock": 15,
                "description": "Флагманский смартфон с мощным процессором, ярким AMOLED дисплеем 120 Гц и тройной камерой 108 Мп.",
                "color": (41, 128, 185)
            },
            {
                "category": "gadgets",
                "name": "Смарт-часы Active Watch 4",
                "slug": "smart-watch-active-4",
                "sku": "WT-002",
                "price": Decimal("14990.00"),
                "old_price": Decimal("17990.00"),
                "stock": 25,
                "description": "Умные часы для спорта и повседневной жизни: пульсометр, SpO2, GPS, влагозащита 5ATM.",
                "color": (52, 73, 94)
            },
            {
                "category": "gadgets",
                "name": "Планшет ProTab 11 WiFi",
                "slug": "tablet-protab-11",
                "sku": "TB-003",
                "price": Decimal("38990.00"),
                "old_price": None,
                "stock": 8,
                "description": "Тонкий металлический планшет для учебы, работы и мультимедиа с аккумулятором 8000 мАч.",
                "color": (22, 160, 133)
            },
            {
                "category": "laptops",
                "name": "Ноутбук UltraBook 14 Slim",
                "slug": "laptop-ultrabook-14",
                "sku": "LP-004",
                "price": Decimal("74990.00"),
                "old_price": Decimal("82990.00"),
                "stock": 6,
                "description": "Легкий ультрабук 1.2 кг с процессором Core i7, 16 ГБ RAM и 512 ГБ NVMe SSD.",
                "color": (39, 174, 96)
            },
            {
                "category": "laptops",
                "name": "Игровой ноутбук Titan RTX 16",
                "slug": "gaming-laptop-titan-16",
                "sku": "LP-005",
                "price": Decimal("119990.00"),
                "old_price": Decimal("134990.00"),
                "stock": 4,
                "description": "Максимальная производительность для современных игр и рендеринга видео: RTX 4070, 32 ГБ RAM.",
                "color": (192, 57, 43)
            },
            {
                "category": "laptops",
                "name": "Механическая клавиатура RGB Mech",
                "slug": "mech-keyboard-rgb",
                "sku": "KB-006",
                "price": Decimal("4990.00"),
                "old_price": Decimal("5990.00"),
                "stock": 30,
                "description": "Компактная механическая клавиатура с переключателями Red Switch и настраиваемой RGB подсветкой.",
                "color": (142, 68, 173)
            },
            {
                "category": "shoes-clothing",
                "name": "Кроссовки Nike Air Sport",
                "slug": "nike-air-sport",
                "sku": "NK-001",
                "price": Decimal("4990.00"),
                "old_price": Decimal("5990.00"),
                "stock": 12,
                "description": "Удобные беговые кроссовки с амортизирующей воздушной подошвой и дышащей сеткой.",
                "color": (211, 84, 0)
            },
            {
                "category": "shoes-clothing",
                "name": "Худи оверсайз Urban Cotton",
                "slug": "hoodie-urban-cotton",
                "sku": "HD-008",
                "price": Decimal("3490.00"),
                "old_price": None,
                "stock": 20,
                "description": "Стильное и теплое худи из 100% плотного хлопка с начесом.",
                "color": (127, 140, 141)
            },
            {
                "category": "shoes-clothing",
                "name": "Куртка ветрозащитная Windbreaker",
                "slug": "windbreaker-jacket",
                "sku": "JK-009",
                "price": Decimal("6490.00"),
                "old_price": Decimal("7990.00"),
                "stock": 0,  # Out of stock for testing filter!
                "description": "Непромокаемая и ветрозащитная куртка для походов и активного отдыха.",
                "color": (44, 62, 80)
            },
            {
                "category": "audio",
                "name": "Беспроводные наушники SoundFlow Pro",
                "slug": "earphones-soundflow-pro",
                "sku": "AU-010",
                "price": Decimal("8990.00"),
                "old_price": Decimal("10990.00"),
                "stock": 18,
                "description": "Наушники TWS с активным шумоподавлением ANC, прозрачным режимом и автономностью до 32 часов.",
                "color": (26, 188, 156)
            },
            {
                "category": "audio",
                "name": "Портативная колонка BassBoom 360",
                "slug": "speaker-bassboom-360",
                "sku": "AU-011",
                "price": Decimal("5490.00"),
                "old_price": Decimal("6490.00"),
                "stock": 14,
                "description": "Влагозащищенная колонка IPX7 с мощным объемным басом и подсветкой для вечеринок.",
                "color": (243, 156, 18)
            },
            {
                "category": "sports",
                "name": "Коврик для йоги и фитнеса GripMat",
                "slug": "yoga-mat-gripmat",
                "sku": "SP-012",
                "price": Decimal("1990.00"),
                "old_price": None,
                "stock": 40,
                "description": "Нескользящий экологичный коврик TPE толщиной 6 мм для комфортных тренировок дома и в зале.",
                "color": (16, 172, 132)
            },
            {
                "category": "sports",
                "name": "Спортивная бутылка для воды 1L",
                "slug": "sports-bottle-1l",
                "sku": "SP-013",
                "price": Decimal("990.00"),
                "old_price": Decimal("1290.00"),
                "stock": 50,
                "description": "Легкая и прочная бутылка из тритана без BPA с удобным поильником и ремешком.",
                "color": (52, 152, 219)
            },
            {
                "category": "sports",
                "name": "Набор фитнес-резинок Resistance Pro",
                "slug": "resistance-bands-pro",
                "sku": "SP-014",
                "price": Decimal("1290.00"),
                "old_price": Decimal("1590.00"),
                "stock": 35,
                "description": "5 уровней нагрузки от легкого до супертяжелого для прокачки всех групп мышц.",
                "color": (238, 82, 83)
            },
            {
                "category": "gadgets",
                "name": "Внешний аккумулятор PowerBank 20000",
                "slug": "powerbank-20000mah",
                "sku": "PB-015",
                "price": Decimal("2990.00"),
                "old_price": Decimal("3490.00"),
                "stock": 22,
                "description": "Быстрая зарядка 65W Power Delivery, поддержка одновременной зарядки трех устройств.",
                "color": (10, 61, 98)
            }
        ]

        created_products = []
        for p_data in products_data:
            cat = categories_map[p_data["category"]]
            product, _ = Product.objects.update_or_create(
                slug=p_data["slug"],
                defaults={
                    "category": cat,
                    "name": p_data["name"],
                    "sku": p_data["sku"],
                    "price": p_data["price"],
                    "old_price": p_data["old_price"],
                    "stock": p_data["stock"],
                    "description": p_data["description"],
                    "is_active": True,
                }
            )
            created_products.append(product)

            # Images
            img_rel_1 = f"products/{product.slug}_1.jpg"
            img_abs_1 = os.path.join(media_root, img_rel_1)
            create_placeholder_image(img_abs_1, product.name[:12], bg_color=p_data["color"], size=(600, 600))
            ProductImage.objects.update_or_create(
                product=product,
                is_main=True,
                defaults={"image": img_rel_1}
            )

            img_rel_2 = f"products/{product.slug}_2.jpg"
            img_abs_2 = os.path.join(media_root, img_rel_2)
            create_placeholder_image(img_abs_2, "Детали", bg_color=p_data["color"], size=(600, 600))
            ProductImage.objects.update_or_create(
                product=product,
                is_main=False,
                defaults={"image": img_rel_2}
            )

        # Sample Orders
        self.stdout.write("Создание тестового заказа...")
        if created_products:
            p1 = created_products[0]
            p2 = created_products[6]
            order_total = (p1.price * 1) + (p2.price * 2)

            order, _ = Order.objects.update_or_create(
                user=test_user,
                defaults={
                    "full_name": "Иван Иванов",
                    "phone": "+996700123456",
                    "email": "ivan@mail.com",
                    "address": "г. Бишкек, ул. Чуй 1, кв. 10",
                    "comment": "Домофон работает, предварительно позвонить",
                    "delivery_method": "courier",
                    "payment_method": "cash",
                    "status": "processing",
                    "total": order_total,
                }
            )
            order.items.all().delete()
            OrderItem.objects.create(
                order=order,
                product=p1,
                product_name=p1.name,
                price=p1.price,
                quantity=1
            )
            OrderItem.objects.create(
                order=order,
                product=p2,
                product_name=p2.name,
                price=p2.price,
                quantity=2
            )

        self.stdout.write(self.style.SUCCESS("Тестовые данные успешно созданы!"))
