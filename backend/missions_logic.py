import pandas as pd
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'space_missions.csv')
df = pd.read_csv(CSV_PATH)

df['Date'] = pd.to_datetime(df['Date'])

if 'Price' in df.columns:
    df['Price'] = df['Price'].str.replace(',', '').astype(float).fillna(0)
    
# func 1 
def getMissionCountByCompany(companyName: str) -> int:
    count = len(df[df['Company'] == companyName])
    return int(count)

# func 2
def getSuccessRate(companyName: str) -> float:
    company_data = df[df['Company'] == companyName]
    if company_data.empty:
        return 0.0
    
    total_missions = len(company_data)
    success_missions = len(company_data[company_data['MissionStatus'] == 'Success'])
    
    rate = (success_missions / total_missions) * 100
    return round(float(rate), 2)

# func 3
def getMissionsByDateRange(startDate: str, endDate: str) -> list:
    mask = (df['Date'] >= startDate) & (df['Date'] <= endDate)
    filtered = df.loc[mask].sort_values(by=['Date', 'Time']) 
    return filtered['Mission'].tolist()

# func 4
def getTopCompaniesByMissionCount(n: int) -> list:
    counts = df['Company'].value_counts().reset_index()
    counts.columns = ['companyName', 'missionCount']
    
    sorted_df = counts.sort_values(
        by=['missionCount', 'companyName'], 
        ascending=[False, True]
    )
    
    top_n = sorted_df.head(n)
    return list(top_n.itertuples(index=False, name=None))


# func 5
def getMissionStatusCount() -> dict:
    required_keys = ["Success", "Failure", "Partial Failure", "Prelaunch Failure"]
    counts = df['MissionStatus'].value_counts().to_dict()
    
    return {key: int(counts.get(key, 0)) for key in required_keys}


# func 6
def getMissionsByYear(year: int) -> int:
    count = len(df[df['Date'].dt.year == year])
    return int(count)