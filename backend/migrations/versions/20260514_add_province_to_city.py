"""
Add province field to City model
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('cities', sa.Column('province', sa.String(length=100), nullable=True))

def downgrade():
    op.drop_column('cities', 'province')
