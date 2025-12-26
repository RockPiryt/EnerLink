#!/usr/bin/env python3
"""Script for adding sample test data to the EnerLink database"""
import sys
import os
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.db import db

from app.models.address_model import Country, City, District, Address
from app.models.address_relation_model import CustomerAddress, SupplierAddress
from app.models.contract_model import Contract, ContractTimeline
from app.models.customer_model import Customer
from app.models.history_model import Action, UserLogHistory
from app.models.pkwiu_model import Pkwiu
from app.models.ppe_model import PPE
from app.models.supplier_model import (
    EnergySupplier, EnergyTariff, PowerUnit, CurrencyUnit, SupplierOffer
)  # suppliers and offers
from app.models.tag_model import Tag
from app.models.user_model import User, Role, Password


def seed_database():
    app = create_app()
    with app.app_context():
        print("Starting database seeding...")

        # add roles
        if Role.query.count() == 0:
            db.session.add_all([
                Role(role_name="Administrator", active=True),
                Role(role_name="Manager", active=True),
                Role(role_name="Sales Representative", active=True),
                Role(role_name="Analyst", active=True),
            ])
            db.session.commit()
            print("Added roles")
        else:
            print("Roles already exist - skipping")

        # add passwords
        if Password.query.count() == 0:
            db.session.add_all([
                Password(pass_hash="admin123"),
                Password(pass_hash="manager123"),
                Password(pass_hash="sales123"),
                Password(pass_hash="analyst123"),
                Password(pass_hash="demo123"),
            ])
            db.session.commit()
            print("Added passwords")
        else:
            print("Passwords already exist - skipping")

        # add users
        if User.query.count() == 0:
            admin_role = Role.query.filter_by(role_name="Administrator").first()
            manager_role = Role.query.filter_by(role_name="Manager").first()
            sales_role = Role.query.filter_by(role_name="Sales Representative").first()
            analyst_role = Role.query.filter_by(role_name="Analyst").first()
            pass_list = Password.query.order_by(Password.id.asc()).all()

            db.session.add_all([
                User(id="ADM001", first_name="John", last_name="Smith", e_mail="admin@enerlink.com", id_role=admin_role.id, id_pass=pass_list[0].id, active=True),
                User(id="MGR001", first_name="Sarah", last_name="Johnson", e_mail="sarah.johnson@enerlink.com", id_role=manager_role.id, id_pass=pass_list[1].id, active=True),
                User(id="SAL001", first_name="Michael", last_name="Brown", e_mail="michael.brown@enerlink.com", id_role=sales_role.id, id_pass=pass_list[2].id, active=True),
                User(id="SAL002", first_name="Emily", last_name="Davis", e_mail="emily.davis@enerlink.com", id_role=sales_role.id, id_pass=pass_list[3].id, active=True),
                User(id="ANA001", first_name="David", last_name="Wilson", e_mail="david.wilson@enerlink.com", id_role=analyst_role.id, id_pass=pass_list[4].id, active=True),
            ])
            db.session.commit()
            print("Added users")
        else:
            print("Users already exist - skipping")

        # add actions
        if Action.query.count() == 0:
            db.session.add_all([
                Action(name="LOGIN"),
                Action(name="LOGOUT"),
                Action(name="ROLE_CHANGE"),
                Action(name="USER_UPDATE"),
                Action(name="CONTRACT_CREATE"),
            ])
            db.session.commit()
            print("Added actions")
        else:
            print("Actions already exist - skipping")

        # add pkwiu
        if Pkwiu.query.count() == 0:
            db.session.add_all([
                Pkwiu(pkwiu_nr="35.11.10.0", pkwiu_name="Electricity generation services"),
                Pkwiu(pkwiu_nr="35.12.10.0", pkwiu_name="Electricity transmission services"),
                Pkwiu(pkwiu_nr="35.13.10.0", pkwiu_name="Electricity distribution services"),
            ])
            db.session.commit()
            print("Added pkwiu")
        else:
            print("Pkwiu already exist - skipping")

        # add countries
        if Country.query.count() == 0:
            db.session.add_all([
                Country(name="Poland", shortcut="PL", is_active=True),
                Country(name="Germany", shortcut="DE", is_active=True),
            ])
            db.session.commit()
            print("Added countries")
        else:
            print("Countries already exist - skipping")

        # add cities
        if City.query.count() == 0:
            db.session.add_all([
                City(name="Gdańsk", is_active=True),
                City(name="Warsaw", is_active=True),
            ])
            db.session.commit()
            print("Added cities")
        else:
            print("Cities already exist - skipping")

        # add districts
        if District.query.count() == 0:
            db.session.add_all([
                District(name="Pomorskie", is_active=True),
                District(name="Mazowieckie", is_active=True),
            ])
            db.session.commit()
            print("Added districts")
        else:
            print("Districts already exist - skipping")

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
            print("Added addresses")
        else:
            print("Addresses already exist - skipping")

        # add customers
        if Customer.query.count() == 0:
            db.session.add_all([
                Customer(name="Demo Customer A"),
                Customer(name="Demo Customer B"),
            ])
            db.session.commit()
            print("Added customers")
        else:
            print("Customers already exist - skipping")

        # attach customer to address (relation table)
        if CustomerAddress.query.count() == 0:
            customer = Customer.query.first()
            address = Address.query.first()
            if customer and address:
                db.session.add(CustomerAddress(id_customer=customer.id, id_address=address.id))
                db.session.commit()
                print("Added customer_address relation")
        else:
            print("CustomerAddress already exist - skipping")

        # add energy suppliers
        if EnergySupplier.query.count() == 0:
            db.session.add_all([
                EnergySupplier(name="EnerLink Demo Supplier"),
                EnergySupplier(name="Green Energy S.A."),
                EnergySupplier(name="PowerTrade Sp. z o.o."),
            ])
            db.session.commit()
            print("Added suppliers")
        else:
            print("Suppliers already exist - skipping")

        # attach supplier to address (relation table)
        if SupplierAddress.query.count() == 0:
            supplier = EnergySupplier.query.first()
            address = Address.query.all()[-1] if Address.query.count() > 0 else None
            if supplier and address:
                db.session.add(SupplierAddress(id_supplier=supplier.id, id_address=address.id))
                db.session.commit()
                print("Added supplier_address relation")
        else:
            print("SupplierAddress already exist - skipping")

        # add tariffs
        if EnergyTariff.query.count() == 0:
            db.session.add_all([
                EnergyTariff(name="G11", is_active=True),
                EnergyTariff(name="G12", is_active=True),
            ])
            db.session.commit()
            print("Added tariffs")
        else:
            print("Tariffs already exist - skipping")

        # add power units
        if PowerUnit.query.count() == 0:
            db.session.add_all([
                PowerUnit(shortcut="kWh", name="Kilowatt-hour"),
                PowerUnit(shortcut="MWh", name="Megawatt-hour"),
            ])
            db.session.commit()
            print("Added power units")
        else:
            print("Power units already exist - skipping")

        # add currency units
        if CurrencyUnit.query.count() == 0:
            db.session.add_all([
                CurrencyUnit(shortcut="PLN", name="Polish złoty"),
                CurrencyUnit(shortcut="EUR", name="Euro"),
            ])
            db.session.commit()
            print("Added currency units")
        else:
            print("Currency units already exist - skipping")

        # add supplier offers
        if SupplierOffer.query.count() == 0:
            supplier = EnergySupplier.query.first()
            tariff = EnergyTariff.query.filter_by(name="G11").first() or EnergyTariff.query.first()
            pu = PowerUnit.query.filter_by(shortcut="kWh").first() or PowerUnit.query.first()
            cu = CurrencyUnit.query.filter_by(shortcut="PLN").first() or CurrencyUnit.query.first()
            if supplier and tariff:
                db.session.add(SupplierOffer(
                    id_supplier=supplier.id,
                    id_tariff=tariff.id,
                    id_power_unit=pu.id if pu else None,
                    id_currency_unit=cu.id if cu else None,
                    price=0.85,
                    active=True,
                    start_date=date(2025, 1, 1),
                    end_date=None
                ))
                db.session.commit()
                print("Added supplier_offer")
        else:
            print("SupplierOffer already exist - skipping")

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
                print("Added PPE")
        else:
            print("PPE already exist - skipping")

        # add tags
        if Tag.query.count() == 0:
            db.session.add_all([
                Tag(name="Nowy klient"),
                Tag(name="Umowa kończy się za pół roku"),
                Tag(name="Klient VIP"),
                Tag(name="Możliwi klienci"),
            ])
            db.session.commit()
            print("Added tags")
        else:
            print("Tags already exist - skipping")

        # add contract + timeline
        user = User.query.filter_by(e_mail="michael.brown@enerlink.com").first()
        customer = Customer.query.first()
        tag = Tag.query.first()
        offer = SupplierOffer.query.first()

        if Contract.query.count() == 0 and customer:
            contract = Contract(
                id_user=user.id if user else None,
                id_customer=customer.id,
                id_tag=tag.id if tag else None,
                id_supplier_offer=offer.id if offer else None,
                contract_number="CNTR-0001",
                signed_at=date.today(),
                contract_from=date.today(),
                contract_to=None,
                is_deleted=False
            )
            db.session.add(contract)
            db.session.commit()

            db.session.add(ContractTimeline(
                id_contract=contract.id,
                status="NEW",
                description="Seeded contract"
            ))
            db.session.commit()
            print("Added contract and timeline")
        else:
            print("Contract already exist - skipping")

        # add sample user log
        if UserLogHistory.query.count() == 0:
            login_action = Action.query.filter_by(name="LOGIN").first()
            demo_user = User.query.filter_by(e_mail="admin@enerlink.com").first()
            if login_action and demo_user:
                db.session.add(UserLogHistory(id_user=demo_user.id, id_action=login_action.id))
                db.session.commit()
                print("Added sample user_log_history")

        print("Seeding completed successfully!")


if __name__ == "__main__":
    seed_database()
