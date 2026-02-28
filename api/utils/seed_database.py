"""Database seeding utilities."""

import logging
from sqlalchemy.orm import Session

from models.framework import Framework
from constants.frameworks import Framework as FrameworkEnum

logger = logging.getLogger(__name__)


def seed_frameworks(db: Session) -> None:
    """
    Seed the frameworks table with initial data.
    Only inserts frameworks that don't already exist.
    """
    frameworks_data = [
        {
            "key": "MENTAL_WELLNESS",
            "name": "Psychologist",
            "description": "Explore your thoughts, feelings, and experiences through compassionate self-reflection",
            "is_active": True,
            "ui_metadata": {
                "order": 1,
                "color": "#8B5CF6",
                "icon": "brain"
            }
        },
        {
            "key": "DECISION_MAKING",
            "name": "Advisor",
            "description": "Structure your thinking to make better decisions through systematic analysis",
            "is_active": True,
            "ui_metadata": {
                "order": 2,
                "color": "#10B981",
                "icon": "scale"
            }
        },
        {
            "key": "PRODUCTIVITY_BOOST",
            "name": "Strategist",
            "description": "Set clear goals, overcome obstacles, and build momentum toward your aspirations",
            "is_active": True,
            "ui_metadata": {
                "order": 3,
                "color": "#F59E0B",
                "icon": "zap"
            }
        },
        {
            "key": "PROBLEM_SOLVING",
            "name": "Mediator",
            "description": "Find creative solutions and develop actionable approaches to overcome challenges",
            "is_active": True,
            "ui_metadata": {
                "order": 4,
                "color": "#EF4444",
                "icon": "lightbulb"
            }
        }
    ]

    try:
        for framework_data in frameworks_data:
            # Check if framework already exists
            existing = db.query(Framework).filter(
                Framework.key == framework_data["key"]
            ).first()

            if not existing:
                framework = Framework(**framework_data)
                db.add(framework)
                logger.info(f"Seeded framework: {framework_data['name']}")
            else:
                logger.info(f"Framework already exists: {framework_data['name']}")

        db.commit()
        logger.info("Framework seeding completed successfully")

    except Exception as e:
        logger.error(f"Failed to seed frameworks: {e}")
        db.rollback()
        raise


def seed_all(db: Session) -> None:
    """
    Seed all database tables with initial data.
    """
    logger.info("Starting database seeding...")
    seed_frameworks(db)
    logger.info("Database seeding completed")
