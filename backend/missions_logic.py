import pandas as pd
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'space_missions.csv')
df = pd.read_vsc(CSV_PATH)

df['Date'] = pd.to_datetime(df['Date'])

def getMissionCountByCompany(companyName: str) -> int:
    count = len(df[df['Company'] == companyName])
    return int(count)

def getSuccessRate(companyName: str) -> float:
    company_data = df[df['Company'] == companyName]
    # check for missions
    if company_data.empty:
        return 0.0
    
    total_missions = len(company_data)
    success_missions = len(company_data[company_data['MissionStatus'] == 'Success'])
    
    rate = (success_missions / total_missions) * 100
    return round(float(rate), 2)

