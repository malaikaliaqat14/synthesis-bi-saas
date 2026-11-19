import os
import sys
import django
import random
from decimal import Decimal
from datetime import datetime, timedelta

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bi_saas.settings')
django.setup()

from django.contrib.auth import get_user_model
from companies.models import Company, CompanyMembership
from business.models import Category, Customer, Product, Order, OrderItem, Sale, Expense

User = get_user_model()

def seed_database():
    print("=" * 60)
    print("SEEDING REALISTIC MULTI-TENANT ENTERPRISE BI DATA")
    print("=" * 60)

    # 1. Create Company A: Acme Global Technologies
    acme, _ = Company.objects.get_or_create(
        name="Acme Global Technologies",
        defaults={
            'domain': 'acmeglobal.io',
            'industry': 'Enterprise SaaS & Cloud',
            'currency': 'USD',
            'subscription_plan': 'ENTERPRISE'
        }
    )
    print(f"Company A created: {acme.name} (ID: {acme.id})")

    # Create Company B: Starlight Retail Corp (for testing tenant isolation)
    starlight, _ = Company.objects.get_or_create(
        name="Starlight Retail Corp",
        defaults={
            'domain': 'starlightretail.com',
            'industry': 'E-Commerce & Retail',
            'currency': 'USD',
            'subscription_plan': 'GROWTH'
        }
    )
    print(f"Company B created: {starlight.name} (ID: {starlight.id})")

    # 2. Create Users for Company A
    users_data = [
        ('admin@acme.com', 'Admin User', 'ADMIN', 'Admin12345!'),
        ('manager@acme.com', 'Operations Manager', 'MANAGER', 'Manager12345!'),
        ('employee@acme.com', 'Sales Analyst', 'EMPLOYEE', 'Employee12345!'),
    ]

    for email, name, role, pwd in users_data:
        fn, ln = name.split(' ', 1)
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': fn,
                'last_name': ln,
                'job_title': f"Company {role.title()}",
            }
        )
        user.set_password(pwd)
        user.save()

        CompanyMembership.objects.update_or_create(
            user=user,
            company=acme,
            defaults={'role': role, 'is_active': True}
        )
        print(f"User {email} configured with role {role} for {acme.name}")

    # Create User for Company B
    starlight_user, _ = User.objects.get_or_create(
        email='admin@starlight.com',
        defaults={
            'username': 'starlight_admin',
            'first_name': 'Starlight',
            'last_name': 'Admin',
            'job_title': 'Retail Director',
        }
    )
    starlight_user.set_password('Starlight12345!')
    starlight_user.save()

    CompanyMembership.objects.update_or_create(
        user=starlight_user,
        company=starlight,
        defaults={'role': 'ADMIN', 'is_active': True}
    )
    print(f"User admin@starlight.com configured as Admin for {starlight.name}")

    # 3. Create Categories for Acme
    categories_dict = {
        'Cloud Solutions': 'Elastic cloud computation and managed infrastructure',
        'Enterprise Software': 'Mission-critical enterprise software tools and licenses',
        'Data & Analytics': 'High-throughput business intelligence and ML accelerators',
        'Security & Compliance': 'Zero-trust network defense and automated compliance',
        'Consulting Services': 'Specialized enterprise implementation and engineering support',
    }
    cat_objs = {}
    for cat_name, desc in categories_dict.items():
        c, _ = Category.objects.get_or_create(
            company=acme,
            name=cat_name,
            defaults={'description': desc}
        )
        cat_objs[cat_name] = c

    # 4. Create Products for Acme
    products_catalog = [
        ('Cloud Server Tier 1', 'Cloud Solutions', 'SKU-CLD-001', Decimal('120.00'), Decimal('45.00'), 150),
        ('Cloud Server Tier 2', 'Cloud Solutions', 'SKU-CLD-002', Decimal('240.00'), Decimal('90.00'), 120),
        ('Kubernetes Cluster Pro', 'Cloud Solutions', 'SKU-CLD-003', Decimal('480.00'), Decimal('170.00'), 80),
        ('Enterprise BI Core', 'Enterprise Software', 'SKU-SFT-001', Decimal('350.00'), Decimal('110.00'), 200),
        ('CRM Suite Ultimate', 'Enterprise Software', 'SKU-SFT-002', Decimal('290.00'), Decimal('95.00'), 180),
        ('Workflow Automator', 'Enterprise Software', 'SKU-SFT-003', Decimal('180.00'), Decimal('55.00'), 95),
        ('Data Lake Connector', 'Data & Analytics', 'SKU-DTA-001', Decimal('310.00'), Decimal('100.00'), 110),
        ('Realtime ETL Pipeline', 'Data & Analytics', 'SKU-DTA-002', Decimal('420.00'), Decimal('135.00'), 75),
        ('ML Model Deployment Engine', 'Data & Analytics', 'SKU-DTA-003', Decimal('550.00'), Decimal('160.00'), 60),
        ('Zero-Trust Firewall', 'Security & Compliance', 'SKU-SEC-001', Decimal('390.00'), Decimal('140.00'), 90),
        ('Audit Trail Vault', 'Security & Compliance', 'SKU-SEC-002', Decimal('260.00'), Decimal('80.00'), 140),
        ('Identity Guard SSO', 'Security & Compliance', 'SKU-SEC-003', Decimal('150.00'), Decimal('45.00'), 250),
        ('Executive Tech Strategy', 'Consulting Services', 'SKU-CNS-001', Decimal('1200.00'), Decimal('450.00'), 40),
        ('DevOps Accelerator Pack', 'Consulting Services', 'SKU-CNS-002', Decimal('850.00'), Decimal('320.00'), 50),
    ]

    prod_objs = []
    for name, cat_name, sku, price, cost, stock in products_catalog:
        p, _ = Product.objects.get_or_create(
            company=acme,
            sku=sku,
            defaults={
                'name': name,
                'category': cat_objs[cat_name],
                'unit_price': price,
                'unit_cost': cost,
                'stock_quantity': stock,
                'reorder_level': 15,
                'description': f"High-reliability enterprise grade {name}."
            }
        )
        prod_objs.append(p)
    print(f"Seeded {len(prod_objs)} enterprise products for {acme.name}")

    # 5. Create Customers for Acme
    customers_data = [
        ('Apex Global Capital', 'finance@apexcap.com', 'North America', 'New York', 'US'),
        ('Nordic Horizon Labs', 'tech@nordichorizon.se', 'Europe', 'Stockholm', 'SE'),
        ('Tokyo Digital Nexus', 'procure@tokyonexus.jp', 'Asia-Pacific', 'Tokyo', 'JP'),
        ('Sao Paulo Ventures', 'info@spventures.br', 'Latin America', 'Sao Paulo', 'BR'),
        ('Berlin AI Dynamics', 'billing@berlindynamics.de', 'Europe', 'Berlin', 'DE'),
        ('Sydney Cloud Systems', 'admin@sydneycloud.com.au', 'Asia-Pacific', 'Sydney', 'AU'),
        ('Toronto Dataworks', 'contact@torontodataworks.ca', 'North America', 'Toronto', 'CA'),
        ('London FinTech Group', 'accounts@londonfintech.co.uk', 'Europe', 'London', 'UK'),
        ('Dubai Future Horizons', 'corp@dubaihorizons.ae', 'Middle East & Africa', 'Dubai', 'AE'),
        ('Silicon Valley Scale Inc', 'ops@svscale.com', 'North America', 'San Francisco', 'US'),
        ('Singapore FinGrid', 'enterprise@fingrid.sg', 'Asia-Pacific', 'Singapore', 'SG'),
        ('Paris Analytics Studio', 'contact@parisanalytics.fr', 'Europe', 'Paris', 'FR'),
        ('Austin Logic Works', 'info@austinlogic.io', 'North America', 'Austin', 'US'),
        ('Madrid Cyber Defense', 'security@madridcyber.es', 'Europe', 'Madrid', 'ES'),
        ('Chicago Retail Systems', 'purchasing@chicagoretail.com', 'North America', 'Chicago', 'US'),
        ('Seoul Data Innovations', 'rnd@seouldata.kr', 'Asia-Pacific', 'Seoul', 'KR'),
        ('Zurich Private Assets', 'desk@zurichassets.ch', 'Europe', 'Zurich', 'CH'),
        ('Boston Life Sciences', 'lab@bostonlifesci.com', 'North America', 'Boston', 'US'),
        ('Santiago Tech Ventures', 'contacto@santiagotech.cl', 'Latin America', 'Santiago', 'CL'),
        ('Amsterdam Logistics Pro', 'supply@amsterdamlog.nl', 'Europe', 'Amsterdam', 'NL'),
    ]

    cust_objs = []
    for name, email, region, city, country in customers_data:
        c, _ = Customer.objects.get_or_create(
            company=acme,
            email=email,
            defaults={
                'name': name,
                'phone': f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
                'region': region,
                'city': city,
                'country': country,
                'address': f"{random.randint(100, 999)} Innovation Parkway"
            }
        )
        cust_objs.append(c)
    print(f"Seeded {len(cust_objs)} customers for {acme.name}")

    # 6. Generate Historical Orders and Sales across the last 180 days
    now = datetime.now()
    admin_user = User.objects.get(email='admin@acme.com')

    total_orders_created = 0
    sales_created = 0

    for day_offset in range(180, 0, -1):
        order_date = now - timedelta(days=day_offset, hours=random.randint(1, 12), minutes=random.randint(0, 59))
        # 1 to 4 orders per day
        daily_count = random.randint(1, 4) if order_date.weekday() < 5 else random.randint(0, 2)

        for _ in range(daily_count):
            total_orders_created += 1
            customer = random.choice(cust_objs)
            order_num = f"ORD-2026-{10000 + total_orders_created}"

            # 1 to 3 items per order
            num_items = random.choice([1, 1, 2, 2, 3])
            selected_prods = random.sample(prod_objs, num_items)

            order = Order.objects.create(
                company=acme,
                customer=customer,
                order_number=order_num,
                order_date=order_date,
                status='COMPLETED',
                total_amount=Decimal('0.00'),
                created_by=admin_user
            )

            order_total = Decimal('0.00')
            for p in selected_prods:
                qty = random.choice([1, 1, 2, 3])
                unit_p = p.unit_price
                subtotal = unit_p * Decimal(qty)
                order_total += subtotal

                OrderItem.objects.create(
                    order=order,
                    product=p,
                    quantity=qty,
                    unit_price=unit_p,
                    subtotal=subtotal
                )

                Sale.objects.create(
                    company=acme,
                    order=order,
                    customer=customer,
                    product=p,
                    sale_date=order_date,
                    quantity=qty,
                    unit_price=unit_p,
                    total_amount=subtotal,
                    region=customer.region
                )
                sales_created += 1

            order.total_amount = order_total
            order.save()

    print(f"Seeded {total_orders_created} Orders and {sales_created} Sales transactions for {acme.name}")

    # 7. Generate Expenses across past 6 months
    expense_categories = ['Marketing', 'Operations', 'Salaries', 'R&D', 'Office', 'Logistics']
    expense_count = 0
    for month_back in range(6, 0, -1):
        month_date = (now - timedelta(days=month_back * 30)).date()
        for cat in expense_categories:
            amount = Decimal(str(random.randint(2500, 18500)))
            Expense.objects.create(
                company=acme,
                category=cat,
                amount=amount,
                expense_date=month_date + timedelta(days=random.randint(1, 25)),
                description=f"Monthly recurring operational expenditure for {cat}",
                created_by=admin_user
            )
            expense_count += 1

    print(f"Seeded {expense_count} company expenses for {acme.name}")

    # 8. Seed isolated demo data for Starlight Retail Corp (Tenant B) to prove isolation
    c_starlight = Customer.objects.create(
        company=starlight,
        name='Starlight Exclusive Shopper',
        email='shopper@starlightretail.com',
        region='Europe'
    )
    p_starlight = Product.objects.create(
        company=starlight,
        name='Luxury Silk Scarf',
        sku='SKU-LUX-001',
        unit_price=Decimal('150.00'),
        unit_cost=Decimal('40.00'),
        stock_quantity=50
    )
    o_starlight = Order.objects.create(
        company=starlight,
        customer=c_starlight,
        order_number='ORD-STL-001',
        order_date=now - timedelta(days=2),
        total_amount=Decimal('150.00'),
        status='COMPLETED'
    )
    Sale.objects.create(
        company=starlight,
        order=o_starlight,
        customer=c_starlight,
        product=p_starlight,
        sale_date=now - timedelta(days=2),
        quantity=1,
        unit_price=Decimal('150.00'),
        total_amount=Decimal('150.00'),
        region='Europe'
    )
    print("Seeded isolated test record for Starlight Retail Corp (Tenant B)")
    print("=" * 60)
    print("DATABASE SEEDING COMPLETE! Multi-tenant datasets ready for production BI.")
    print("=" * 60)

if __name__ == '__main__':
    seed_database()
