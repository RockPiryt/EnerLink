#!/usr/bin/env python3
"""Script for adding sample test data to the EnerLink database"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.db import db

from app.models.address_model import Country, City, District, Address
from app.models.contract_model import Contract, ContractTimeline
from app.models.customer_model import Customer
from app.models.history_model import Action
from app.models.pkwiu_model import Pkwiu
from app.models.ppe_model import PPE
from app.models.supplier_model import EnergySupplier, SupplierOffer
from app.models.tag_model import Tag
from app.models.user_model import User, Role, Password
from datetime import datetime


def seed_database():
    app = create_app()

    with app.app_context():
        print("Starting database seeding...")

        # add roles
        if Role.query.count() == 0:
            roles = [
                Role(role_name="Administrator", active=True),
                Role(role_name="Manager", active=True),
                Role(role_name="Sales Representative", active=True),
                Role(role_name="Analyst", active=True),
            ]
            db.session.add_all(roles)
            db.session.commit()
            print(f"Added {len(roles)} roles")
        else:
            print("Roles already exist - skipping")

        # add passwords
        if Password.query.count() == 0:
            passwords = [
                Password(pass_hash="admin123"),
                Password(pass_hash="manager123"),
                Password(pass_hash="sales123"),
                Password(pass_hash="analyst123"),
                Password(pass_hash="demo123"),
            ]
            db.session.add_all(passwords)
            db.session.commit()
            print(f"Added {len(passwords)} passwords")
        else:
            print("Passwords already exist - skipping")

        # add users
        if User.query.count() == 0:
            admin_role = Role.query.filter_by(role_name="Administrator").first()
            manager_role = Role.query.filter_by(role_name="Manager").first()
            sales_role = Role.query.filter_by(role_name="Sales Representative").first()
            analyst_role = Role.query.filter_by(role_name="Analyst").first()

            pass_list = Password.query.order_by(Password.id.asc()).all()

            users = [
                User(id="ADM001", first_name="John", last_name="Smith", e_mail="admin@enerlink.com", id_role=admin_role.id, id_pass=pass_list[0].id, active=True),
                User(id="MGR001", first_name="Sarah", last_name="Johnson", e_mail="sarah.johnson@enerlink.com", id_role=manager_role.id, id_pass=pass_list[1].id, active=True),
                User(id="SAL001", first_name="Michael", last_name="Brown", e_mail="michael.brown@enerlink.com", id_role=sales_role.id, id_pass=pass_list[2].id, active=True),
                User(id="SAL002", first_name="Emily", last_name="Davis", e_mail="emily.davis@enerlink.com", id_role=sales_role.id, id_pass=pass_list[3].id, active=True),
                User(id="ANA001", first_name="David", last_name="Wilson", e_mail="david.wilson@enerlink.com", id_role=analyst_role.id, id_pass=pass_list[4].id, active=True),
            ]
            db.session.add_all(users)
            db.session.commit()
            print(f"Added {len(users)} users")
        else:
            print("Users already exist - skipping")

        # add energy suppliers--------------------------------
        if EnergySupplier.query.count() == 0:
            suppliers = [
                EnergySupplier(name="EnerLink Demo Supplier"),
                EnergySupplier(name="Green Energy S.A."),
                EnergySupplier(name="PowerTrade Sp. z o.o."),
            ]
            db.session.add_all(suppliers)
            db.session.commit()
            print(f"Added {len(suppliers)} energy suppliers")
        else:
            print("Energy suppliers already exist - skipping")

        # add actions ----------- do poprawy ja mam inne
        if Action.query.count() == 0:
            db.session.add_all([
                Action(name="LOGIN"),
                Action(name="LOGOUT"),
                Action(name="ROLE_CHANGE"),
                Action(name="USER_UPDATE"),
            ])
            db.session.commit()

        # add pkwiu --- klasyfikacja
        if Pkwiu.query.count() == 0:
            db.session.add_all([
                Pkwiu(pkwiu_nr="35.11.10.0", pkwiu_name="Electricity generation services"),
                Pkwiu(pkwiu_nr="35.12.10.0", pkwiu_name="Electricity transmission services"),
                Pkwiu(pkwiu_nr="35.13.10.0", pkwiu_name="Electricity distribution services"),
            ])
            db.session.commit()

        # add countries------------------------------------Adresy
        if Country.query.count() == 0:
            db.session.add_all([
                Country(name="Poland", shortcut="PL", is_active=True),
                Country(name="Germany", shortcut="DE", is_active=True),
            ])
            db.session.commit()

        # add cities
        if City.query.count() == 0:
            db.session.add_all([
                City(name="Gdańsk", is_active=True),
                City(name="Warsaw", is_active=True),
            ])
            db.session.commit()

        # add districts
        if District.query.count() == 0:
            db.session.add_all([
                District(name="Pomorskie", is_active=True),
                District(name="Mazowieckie", is_active=True),
            ])
            db.session.commit()

        # add addresses
        if Address.query.count() == 0:
            pl = Country.query.filter_by(shortcut="PL").first()
            gd = City.query.filter_by(name="Gdańsk").first()
            pom = District.query.filter_by(name="Pomorskie").first()

            db.session.add_all([
                Address(street_name="Długa", building_nr=1, apartment_nr=2, post_code="80-001", id_city=gd.id, id_district=pom.id, id_country=pl.id),
                Address(street_name="Grunwaldzka", building_nr=100, apartment_nr=None, post_code="80-244", id_city=gd.id, id_district=pom.id, id_country=pl.id),
            ])
            db.session.commit()

        # add customers ------------- klienci i punktt poboru energii
        if Customer.query.count() == 0:
            db.session.add_all([
                Customer(name="Donald Tusk"),
                Customer(name="Jaroslaw Kaczynski"),
            ])
            db.session.commit()

        # add ppe
        if PPE.query.count() == 0:
            customer = Customer.query.first()
            address = Address.query.first()

            if customer and address:
                db.session.add(PPE(
                    id_customer=customer.id,
                    id_address=address.id,
                    start_date=date(2025, 1, 1),
                    end_date=None,
                    active=True
                ))
                db.session.commit()

        # add tags
        if Tag.query.count() == 0:
            tags = [
                Tag(name="Nowy klient"),
                Tag(name="Umowa konczy się za pół roku"),
                Tag(name="Klient VIP"),
                Tag(name="Możliwi klienci"),
            ]
            db.session.add_all(tags)
            db.session.commit()
            print(f"Added {len(tags)} tags")
        else:
            print("Tags already exist - skipping")
        
         # get references
        user = User.query.filter_by(e_mail="demo@enerlink.com").first()
        customer = Customer.query.first()
        tag = Tag.query.first()
        supplier_offer = SupplierOffer.query.first()

        # add contract
        if Contract.query.count() == 0 and user and customer:
            contract = Contract(
                id_user=user.id,
                id_customer=customer.id,
                id_tag=tag.id if tag else None,
                id_supplier_offer=supplier_offer.id if supplier_offer else None,
                contract_number="CNTR-0001",
                signed_at=date.today(),
                contract_from=date.today(),
                contract_to=None,
                is_deleted=False
            )
            db.session.add(contract)
            db.session.commit()

            # add timeline entry
            db.session.add(ContractTimeline(id_contract=contract.id, status="NEW", description="Seeded contract"))
            db.session.commit()


        print("Seeding completed successfully!")


if __name__ == "__main__":
    seed_database()
