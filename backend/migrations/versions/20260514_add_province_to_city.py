"""
Add province field to City model
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260514_add_province_to_city'
down_revision = 'd3e57c90f6d3'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'cities',
        sa.Column('province', sa.String(length=100), nullable=True)
    )


def downgrade():
    op.drop_column('cities', 'province')