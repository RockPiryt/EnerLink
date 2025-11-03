#!/usr/bin/env python3
"""
<<<<<<< HEAD
Script for adding sample test data to the EnerLink database
=======
Skrypt do dodawania przykładowych danych testowych do bazy EnerLink
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
"""
import sys
import os

<<<<<<< HEAD
# Add path to application modules
=======
# Dodaj ścieżkę do modułów aplikacji
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.db import db
from app.models.user_model import User, Role, Password
from datetime import datetime

def seed_database():
<<<<<<< HEAD
    """Adds sample data to the database"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting database seeding...")
        
        # Check if we already have data
        if User.query.first():
            print("⚠️  Database already contains users. Skipping seeding.")
            return
        
        # Add roles
        print("👥 Adding roles...")
        roles = [
            Role(role_name="Administrator", active=True),
            Role(role_name="Manager", active=True),
            Role(role_name="Sales Representative", active=True),
            Role(role_name="Analyst", active=True)
=======
    """Dodaje przykładowe dane do bazy danych"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Rozpoczynam seed'owanie bazy danych...")
        
        # Sprawdź czy już mamy dane
        if User.query.first():
            print("⚠️  Baza danych już zawiera użytkowników. Pomijam seed'owanie.")
            return
        
        # Dodaj role
        print("👥 Dodawanie ról...")
        roles = [
            Role(role_name="Administrator", active=True),
            Role(role_name="Manager", active=True),
            Role(role_name="Przedstawiciel handlowy", active=True),
            Role(role_name="Analityk", active=True)
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
        ]
        
        for role in roles:
            db.session.add(role)
        
        db.session.commit()
<<<<<<< HEAD
        print(f"✅ Added {len(roles)} roles")
        
        # Add passwords (in real application, these should be hashed!)
        print("🔐 Adding passwords...")
        passwords = [
            Password(pass_hash="admin123"),  # In reality: bcrypt hash
=======
        print(f"✅ Dodano {len(roles)} ról")
        
        # Dodaj hasła (w rzeczywistej aplikacji należy je hashować!)
        print("🔐 Dodawanie haseł...")
        passwords = [
            Password(pass_hash="admin123"),  # W rzeczywistości: bcrypt hash
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
            Password(pass_hash="manager123"),
            Password(pass_hash="sales123"),
            Password(pass_hash="analyst123"),
            Password(pass_hash="demo123")
        ]
        
        for password in passwords:
            db.session.add(password)
        
        db.session.commit()
<<<<<<< HEAD
        print(f"✅ Added {len(passwords)} passwords")
        
        # Get roles for assignment
        admin_role = Role.query.filter_by(role_name="Administrator").first()
        manager_role = Role.query.filter_by(role_name="Manager").first()
        sales_role = Role.query.filter_by(role_name="Sales Representative").first()
        analyst_role = Role.query.filter_by(role_name="Analyst").first()
        
        # Get passwords
        pass_list = Password.query.all()
        
        # Add users
        print("👤 Adding users...")
        users = [
            User(
                id="ADM001",
                first_name="John",
                last_name="Smith",
=======
        print(f"✅ Dodano {len(passwords)} haseł")
        
        # Pobierz role dla przypisania
        admin_role = Role.query.filter_by(role_name="Administrator").first()
        manager_role = Role.query.filter_by(role_name="Manager").first()
        sales_role = Role.query.filter_by(role_name="Przedstawiciel handlowy").first()
        analyst_role = Role.query.filter_by(role_name="Analityk").first()
        
        # Pobierz hasła
        pass_list = Password.query.all()
        
        # Dodaj użytkowników
        print("👤 Dodawanie użytkowników...")
        users = [
            User(
                id="ADM001",
                first_name="Jan",
                last_name="Kowalski",
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
                e_mail="admin@enerlink.com",
                id_role=admin_role.id,
                id_pass=pass_list[0].id,
                active=True
            ),
            User(
                id="MGR001",
<<<<<<< HEAD
                first_name="Sarah",
                last_name="Johnson",
                e_mail="sarah.johnson@enerlink.com",
=======
                first_name="Anna",
                last_name="Nowak",
                e_mail="anna.nowak@enerlink.com",
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
                id_role=manager_role.id,
                id_pass=pass_list[1].id,
                active=True
            ),
            User(
                id="SAL001",
<<<<<<< HEAD
                first_name="Michael",
                last_name="Brown",
                e_mail="michael.brown@enerlink.com",
=======
                first_name="Piotr",
                last_name="Wiśniewski",
                e_mail="piotr.wisniewski@enerlink.com",
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
                id_role=sales_role.id,
                id_pass=pass_list[2].id,
                active=True
            ),
            User(
                id="SAL002",
<<<<<<< HEAD
                first_name="Emily",
                last_name="Davis",
                e_mail="emily.davis@enerlink.com",
=======
                first_name="Katarzyna",
                last_name="Wójcik",
                e_mail="katarzyna.wojcik@enerlink.com",
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
                id_role=sales_role.id,
                id_pass=pass_list[3].id,
                active=True
            ),
            User(
                id="ANA001",
<<<<<<< HEAD
                first_name="David",
                last_name="Wilson",
                e_mail="david.wilson@enerlink.com",
=======
                first_name="Tomasz",
                last_name="Kowalczyk",
                e_mail="tomasz.kowalczyk@enerlink.com",
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
                id_role=analyst_role.id,
                id_pass=pass_list[4].id,
                active=True
            )
        ]
        
        for user in users:
            db.session.add(user)
        
        db.session.commit()
<<<<<<< HEAD
        print(f"✅ Added {len(users)} users")
        
        print("🎉 Seeding completed successfully!")
        print("\n📋 Added users:")
=======
        print(f"✅ Dodano {len(users)} użytkowników")
        
        print("🎉 Seed'owanie zakończone pomyślnie!")
        print("\n📋 Dodani użytkownicy:")
>>>>>>> 62c29867ca6dd8a6c85db462a726c9a806267b29
        for user in users:
            print(f"  - {user.id}: {user.first_name} {user.last_name} ({user.e_mail}) - {user.role.role_name}")

if __name__ == "__main__":
    seed_database()