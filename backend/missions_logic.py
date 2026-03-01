import pandas as pd
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'space_missions.csv')
df = pd.read_csv(CSV_PATH)

df['Date'] = df['Date'].astype(str).str.strip().str[:10]  # "YYYY-MM-DD"

# parse price
if 'Price' in df.columns:
    df['Price'] = pd.to_numeric(
        df['Price'].astype(str).str.replace(',', ''), errors='coerce'
    ).fillna(0)

# date compare
df_dt = df.copy()
df_dt['_dt'] = pd.to_datetime(df['Date'], errors='coerce')


def getMissionCountByCompany(companyName: str) -> int:
    return int(len(df[df['Company'] == companyName]))


def getSuccessRate(companyName: str) -> float:
    company_data = df[df['Company'] == companyName]
    if company_data.empty:
        return 0.0
    total = len(company_data)
    successes = len(company_data[company_data['MissionStatus'] == 'Success'])
    rate = float(successes / total * 100)
    return round(rate, 1) if rate == 0.0 else round(rate, 2)

def getMissionsByDateRange(startDate: str, endDate: str) -> list:
    mask = (df['Date'] >= startDate) & (df['Date'] <= endDate)
    filtered = df.loc[mask].sort_values(by=['Date', 'Time'])
    return filtered['Mission'].tolist()

def getTopCompaniesByMissionCount(n: int) -> list:
    counts = df['Company'].value_counts().reset_index()
    counts.columns = ['companyName', 'missionCount']
    sorted_df = counts.sort_values(
        by=['missionCount', 'companyName'], ascending=[False, True]
    )
    top_n = sorted_df.head(n)
    return list(top_n.itertuples(index=False, name=None))

def getMissionStatusCount() -> dict:
    # statuses 
    required_keys = ["Success", "Failure", "Partial Failure", "Prelaunch Failure"]
    counts = df['MissionStatus'].value_counts().to_dict()
    return {key: int(counts.get(key, 0)) for key in required_keys}

def getMissionsByYear(year: int) -> int:
    return int(len(df[df['Date'].str[:4] == str(year)]))

def getMostUsedRocket() -> str:
    # empty rocket names
    valid_rockets = [r for r in df['Rocket'] if pd.notna(r) and str(r).strip()]
    if not valid_rockets:
        return ""
    
    # checking occurrences
    counts = {}
    for r in valid_rockets:
        counts[r] = counts.get(r, 0) + 1
    
    # getting rockets with max count
    max_count = max(counts.values()) if counts else 0
    candidates = [r for r, c in counts.items() if c == max_count]
    # alphabetical
    return sorted(candidates)[0] if candidates else ""

def getAverageMissionsPerYear(startYear: int, endYear: int) -> float:
    mask = df['Date'].str[:4].astype(int).between(startYear, endYear)
    count = int(len(df[mask]))
    years = endYear - startYear + 1
    return round(float(count / years), 2) if years > 0 else 0.0
