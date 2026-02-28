from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
from dependencies import get_current_user
from schemas.insights import InsightsDashboardResponse
from services.insights import InsightsService

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/dashboard", response_model=InsightsDashboardResponse)
async def get_dashboard(
    period: str = Query("30d", pattern="^(7d|30d|90d)$"),
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    period_map = {"7d": 7, "30d": 30, "90d": 90}
    period_days = period_map.get(period, 30)
    
    dashboard_data = InsightsService.get_dashboard(db, current_user_id, period_days)
    
    return dashboard_data


@router.post("/cards/{card_id}/dismiss", status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_card(
    card_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = InsightsService.dismiss_card(db, card_id, current_user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Insight card not found")
    return None
