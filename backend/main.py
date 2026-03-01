from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import missions_logic as logic
import pandas as pd

app = FastAPI(title="Space Missions API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/summary")
def get_summary_stats():
    status_counts = logic.getMissionStatusCount()
    top_company = logic.getTopCompaniesByMissionCount(1)
    
    total = sum(status_counts.values())
    success_rate = (status_counts.get("Success", 0) / total * 100) if total > 0 else 0
    
    return {
        "total": total,
        "successRate": round(success_rate, 2),
        "successCount": status_counts.get("Success", 0),
        "topCompany": top_company[0][0] if top_company else "N/A"
    }

@app.get("/api/companies/top")
def get_top_companies(n: int = 10):
    data = logic.getTopCompaniesByMissionCount(n)
    return [{"name": item[0], "count": item[1]} for item in data]

@app.get("/api/missions/search")
def search_missions(start: str, end: str):
    missions = logic.getMissionsByDateRange(start, end)
    return {"missions": missions}

@app.get("/api/status-distribution")
def get_status_distribution():
    return logic.getMissionStatusCount()

@app.get("/api/raw-data")
def get_raw_data():
    data = logic.df.where(pd.notnull(logic.df), None).to_dict(orient='records')
    return data

@app.get("/api/rockets/most-used")
def get_most_used_rocket():
    return {"rocket": logic.getMostUsedRocket()}

@app.get("/api/missions/average-per-year")
def get_average_missions_per_year(start_year: int, end_year: int):
    avg = logic.getAverageMissionsPerYear(start_year, end_year)
    return {"average": avg, "startYear": start_year, "endYear": end_year}
