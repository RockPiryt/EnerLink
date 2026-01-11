#!/usr/bin/env python3
"""Script for adding sample test data to the EnerLink database"""
import os
import sys
from datetime import date

from werkzeug.security import generate_password_hash
from sqlalchemy import or_

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.db import db

from app.models.address_model import Country, City, District, Address
from app.models.address_relation_model import CustomerAddress, SupplierAddress
from app.models.assignment_model import Assignment
from app.models.contract_model import Contract, ContractTimeline
from app.models.customer_model import Customer
from app.models.history_model import Action, UserLogHistory
from app.models.pkwiu_model import Pkwiu
from app.models.ppe_model import PPE
from app.models.supplier_model import (
    EnergySupplier, EnergyTariff, PowerUnit, CurrencyUnit, SupplierOffer
)
from app.models.tag_model import Tag
from app.models.user_model import User, Role, Password


def _get_or_create(model, defaults=None, **filters):
    """
    SQLAlchemy get-or-create:
    - szuka po filters
    - jeśli brak, tworzy obiekt z filters + defaults
    """
    instance = model.query.filter_by(**filters).first()
    if instance:
        return instance

    params = dict(filters)
    if defaults:
        params.update(defaults)

    instance = model(**params)
    db.session.add(instance)
    db.session.commit()
    return instance


def seed_database(app=None):
    """
    Seed database on provided Flask app.
    - W testach pytest PRZEKAŻ app z fixture.
    - Jeśli uruchamiasz ręcznie z CLI, app może być None => create_app().
    """
    if app is None:
        app = create_app()

    with app.app_context():
        print("Starting database seeding...")

        # ---------- ROLES ----------
        for name in ["Administrator", "Manager", "Sales Representative", "Analyst"]:
            _get_or_create(Role, role_name=name, defaults={"active": True})

        roles = {r.role_name: r for r in Role.query.all()}

        # ---------- USERS + PASSWORDS ----------
        users_seed = [
            {
                "id": "ADM001",
                "username": "admin",
                "first_name": "John",
                "last_name": "Smith",
                "email": "admin@enerlink.com",
                "role_name": "Administrator",
                "password": "admin123",
            },
            {
                "id": "MGR001",
                "username": "sarah.johnson",
                "first_name": "Sarah",
                "last_name": "Johnson",
                "email": "sarah.johnson@enerlink.com",
                "role_name": "Manager",
                "password": "manager123",
            },
            {
                "id": "SAL001",
                "username": "michael.brown",
                "first_name": "Michael",
                "last_name": "Brown",
                "email": "michael.brown@enerlink.com",
                "role_name": "Sales Representative",
                "password": "sales123",
            },
            {
                "id": "SAL002",
                "username": "emily.davis",
                "first_name": "Emily",
                "last_name": "Davis",
                "email": "emily.davis@enerlink.com",
                "role_name": "Sales Representative",
                "password": "sales123",
            },
            {
                "id": "ANA001",
                "username": "david.wilson",
                "first_name": "David",
                "last_name": "Wilson",
                "email": "david.wilson@enerlink.com",
                "role_name": "Analyst",
                "password": "analyst123",
            },
        ]

        for u in users_seed:
            exists = User.query.filter(
                or_(User.email == u["email"], User.username == u["username"])
            ).first()
            if exists:
                continue

            role = roles[u["role_name"]]

            pw = Password(pass_hash=generate_password_hash(u["password"]))
            db.session.add(pw)
            db.session.flush()

            user = User(
                id=u["id"],
                username=u["username"],
                first_name=u["first_name"],
                last_name=u["last_name"],
                email=u["email"],
                id_role=role.id,
                id_pass=pw.id,
                active=True,
            )
            db.session.add(user)

        db.session.commit()
        print("Seeded users & roles")

        # ---------- ACTIONS ----------
        for action_name in ["LOGIN", "LOGOUT", "ROLE_CHANGE", "USER_UPDATE", "CONTRACT_CREATE"]:
            _get_or_create(Action, name=action_name)

        # ---------- PKWIU ----------
        _get_or_create(Pkwiu, pkwiu_nr="35.11.10.0", defaults={"pkwiu_name": "Electricity generation services"})
        _get_or_create(Pkwiu, pkwiu_nr="35.12.10.0", defaults={"pkwiu_name": "Electricity transmission services"})
        _get_or_create(Pkwiu, pkwiu_nr="35.13.10.0", defaults={"pkwiu_name": "Electricity distribution services"})

        # ---------- COUNTRIES ----------
        pl = _get_or_create(Country, shortcut="PL", defaults={"name": "Poland", "is_active": True})
        _get_or_create(Country, shortcut="DE", defaults={"name": "Germany", "is_active": True})

        # ---------- CITIES ----------
        gd = _get_or_create(City, name="Gdańsk", defaults={"is_active": True})
        _get_or_create(City, name="Warsaw", defaults={"is_active": True})

        # ---------- DISTRICTS ----------
        pom = _get_or_create(District, name="Pomorskie", defaults={"is_active": True})
        _get_or_create(District, name="Mazowieckie", defaults={"is_active": True})

        # ---------- ADDRESSES ----------
        addr1 = _get_or_create(
            Address,
            street_name="Długa",
            building_nr=1,
            apartment_nr=2,
            post_code="80-001",
            id_city=gd.id,
            id_district=pom.id,
            id_country=pl.id,
        )
        addr2 = _get_or_create(
            Address,
            street_name="Grunwaldzka",
            building_nr=100,
            apartment_nr=None,
            post_code="80-244",
            id_city=gd.id,
            id_district=pom.id,
            id_country=pl.id,
        )

        # ---------- TAGS ----------
        for tag_name in ["Nowy klient", "Umowa kończy się za pół roku", "Klient VIP", "Możliwi klienci"]:
            _get_or_create(Tag, name=tag_name)

        # ---------- CUSTOMERS ----------
        sales1 = User.query.filter_by(email="michael.brown@enerlink.com").first()
        tag_first = Tag.query.first()

        cust_a = _get_or_create(
            Customer,
            email="demoA@enerlink.com",
            defaults=dict(
                name="Demo",
                last_name="CustomerA",
                company="Demo Customer A Sp. z o.o.",
                phone="+48 500 600 700",
                active=True,
                is_deleted=False,
                description="Seeded demo customer A",
                id_user=sales1.id if sales1 else None,
                id_tag=tag_first.id if tag_first else None,
            ),
        )

        cust_b = _get_or_create(
            Customer,
            email="demoB@enerlink.com",
            defaults=dict(
                name="Demo",
                last_name="CustomerB",
                company="Demo Customer B S.A.",
                phone="+48 111 222 333",
                active=True,
                is_deleted=False,
                description="Seeded demo customer B",
                id_user=sales1.id if sales1 else None,
                id_tag=tag_first.id if tag_first else None,
            ),
        )

        # attach customer to address (relation table)
        if CustomerAddress.query.filter_by(id_customer=cust_a.id, id_address=addr1.id).first() is None:
            db.session.add(CustomerAddress(id_customer=cust_a.id, id_address=addr1.id))
            db.session.commit()

        # ---------- SUPPLIERS ----------
        supp1 = _get_or_create(EnergySupplier, name="EnerLink Demo Supplier")
        _get_or_create(EnergySupplier, name="Green Energy S.A.")
        _get_or_create(EnergySupplier, name="PowerTrade Sp. z o.o.")

        # attach supplier to address
        if SupplierAddress.query.filter_by(id_supplier=supp1.id, id_address=addr2.id).first() is None:
            db.session.add(SupplierAddress(id_supplier=supp1.id, id_address=addr2.id))
            db.session.commit()

        # ---------- TARIFFS ----------
        tariff_g11 = _get_or_create(EnergyTariff, name="G11", defaults={"is_active": True})
        _get_or_create(EnergyTariff, name="G12", defaults={"is_active": True})

        # ---------- UNITS ----------
        pu = _get_or_create(PowerUnit, shortcut="kWh", defaults={"name": "Kilowatt-hour"})
        _get_or_create(PowerUnit, shortcut="MWh", defaults={"name": "Megawatt-hour"})

        cu = _get_or_create(CurrencyUnit, shortcut="PLN", defaults={"name": "Polish złoty"})
        _get_or_create(CurrencyUnit, shortcut="EUR", defaults={"name": "Euro"})

        # ---------- SUPPLIER OFFER ----------
        offer = SupplierOffer.query.filter_by(
            id_supplier=supp1.id,
            id_tariff=tariff_g11.id,
        ).first()

        if offer is None:
            offer = SupplierOffer(
                id_supplier=supp1.id,
                id_tariff=tariff_g11.id,
                id_power_unit=pu.id,
                id_currency_unit=cu.id,
                price=0.85,
                active=True,
                start_date=date(2025, 1, 1),
                end_date=None,
            )
            db.session.add(offer)
            db.session.commit()

        # ---------- PPE ----------
        if PPE.query.filter_by(id_customer=cust_a.id, id_address=addr1.id).first() is None:
            db.session.add(PPE(
                id_customer=cust_a.id,
                id_address=addr1.id,
                start_date=date(2025, 1, 1),
                end_date=None,
                active=True
            ))
            db.session.commit()

        # ---------- CONTRACT + TIMELINE ----------
        user = User.query.filter_by(email="michael.brown@enerlink.com").first()
        tag = Tag.query.first()

        contract = Contract.query.filter_by(contract_number="CNTR-0001").first()
        if contract is None:
            contract = Contract(
                id_user=user.id if user else None,
                id_customer=cust_a.id,
                id_tag=tag.id if tag else None,
                id_supplier_offer=offer.id,
                contract_number="CNTR-0001",
                signed_at=date.today(),
                contract_from=date.today(),
                contract_to=None,
                is_deleted=False
            )
            db.session.add(contract)
            db.session.commit()

        if ContractTimeline.query.filter_by(id_contract=contract.id, status="NEW").first() is None:
            db.session.add(ContractTimeline(
                id_contract=contract.id,
                status="NEW",
                description="Seeded contract"
            ))
            db.session.commit()

        # ---------- USER LOG ----------
        login_action = Action.query.filter_by(name="LOGIN").first()
        demo_user = User.query.filter_by(email="admin@enerlink.com").first()
        if login_action and demo_user:
            if UserLogHistory.query.filter_by(id_user=demo_user.id, id_action=login_action.id).first() is None:
                db.session.add(UserLogHistory(id_user=demo_user.id, id_action=login_action.id))
                db.session.commit()

        # ---------- ASSIGNMENTS ----------
        sales2 = User.query.filter_by(email="emily.davis@enerlink.com").first()
        if sales1:
            if Assignment.query.filter_by(customer_id=cust_a.id, sales_rep_id=sales1.id).first() is None:
                db.session.add(Assignment(customer_id=cust_a.id, sales_rep_id=sales1.id, active=True))
        if sales2:
            if Assignment.query.filter_by(customer_id=cust_b.id, sales_rep_id=sales2.id).first() is None:
                db.session.add(Assignment(customer_id=cust_b.id, sales_rep_id=sales2.id, active=True))
        db.session.commit()

        print("Seeding completed successfully!")


if __name__ == "__main__":
    seed_database()
