#!/usr/bin/env python3
"""
Script for adding sample test data to the EnerLink database
"""
import sys
import os

# Add path to application modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.db import db
from app.models.user_model import User, Role, Password
from datetime import datetime

def seed_database():
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
        ]
        
        for role in roles:
            db.session.add(role)
        
        db.session.commit()
        print(f"✅ Added {len(roles)} roles")
        
        # Add passwords (in real application, these should be hashed!)
        print("🔐 Adding passwords...")
        passwords = [
            Password(pass_hash="admin123"),  # In reality: bcrypt hash
            Password(pass_hash="manager123"),
            Password(pass_hash="sales123"),
            Password(pass_hash="analyst123"),
            Password(pass_hash="demo123")
        ]
        
        for password in passwords:
            db.session.add(password)
        
        db.session.commit()
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
                e_mail="admin@enerlink.com",
                id_role=admin_role.id,
                id_pass=pass_list[0].id,
                active=True
            ),
            User(
                id="MGR001",
                first_name="Sarah",
                last_name="Johnson",
                e_mail="sarah.johnson@enerlink.com",
                id_role=manager_role.id,
                id_pass=pass_list[1].id,
                active=True
            ),
            User(
                id="SAL001",
                first_name="Michael",
                last_name="Brown",
                e_mail="michael.brown@enerlink.com",
                id_role=sales_role.id,
                id_pass=pass_list[2].id,
                active=True
            ),
            User(
                id="SAL002",
                first_name="Emily",
                last_name="Davis",
                e_mail="emily.davis@enerlink.com",
                id_role=sales_role.id,
                id_pass=pass_list[3].id,
                active=True
            ),
            User(
                id="ANA001",
                first_name="David",
                last_name="Wilson",
                e_mail="david.wilson@enerlink.com",
                id_role=analyst_role.id,
                id_pass=pass_list[4].id,
                active=True
            )
        ]
        
        for user in users:
            db.session.add(user)
        
        db.session.commit()
        print(f"✅ Added {len(users)} users")
        
        print("🎉 Seeding completed successfully!")
        print("\n📋 Added users:")
        for user in users:
            print(f"  - {user.id}: {user.first_name} {user.last_name} ({user.e_mail}) - {user.role.role_name}")

if __name__ == "__main__":
    seed_database()