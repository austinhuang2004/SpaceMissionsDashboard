import pandas as pd
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'space_missions.csv')
df = pd.read_csv(CSV_PATH)

# Keep a clean string date column for API serialization BEFORE converting to datetime
df['Date'] = df['Date'].astype(str).str.strip().str[:10]  # "YYYY-MM-DD"

# Parse price
if 'Price' in df.columns:
    df['Price'] = pd.to_numeric(
        df['Price'].astype(str).str.replace(',', ''), errors='coerce'
    ).fillna(0)

# A datetime copy used only for date-comparison functions
_df_dt = df.copy()
_df_dt['_dt'] = pd.to_datetime(df['Date'], errors='coerce')


# func 1
def getMissionCountByCompany(companyName: str) -> int:
    return int(len(df[df['Company'] == companyName]))


# func 2
def getSuccessRate(companyName: str) -> float:
    company_data = df[df['Company'] == companyName]
    if company_data.empty:
        return 0.0
    total = len(company_data)
    successes = len(company_data[company_data['MissionStatus'] == 'Success'])
    return round(float(successes / total * 100), 2)


# func 3 — string comparison works perfectly on YYYY-MM-DD
def getMissionsByDateRange(startDate: str, endDate: str) -> list:
    mask = (df['Date'] >= startDate) & (df['Date'] <= endDate)
    filtered = df.loc[mask].sort_values(by=['Date', 'Time'])
    return filtered['Mission'].tolist()


# func 4
def getTopCompaniesByMissionCount(n: int) -> list:
    counts = df['Company'].value_counts().reset_index()
    counts.columns = ['companyName', 'missionCount']
    sorted_df = counts.sort_values(
        by=['missionCount', 'companyName'], ascending=[False, True]
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
    return int(len(df[df['Date'].str[:4] == str(year)]))

# func 7
def getMostUsedRocket() -> str:
    # Filter out empty/None rocket names
    valid_rockets = [r for r in df['Rocket'] if pd.notna(r) and str(r).strip()]
    if not valid_rockets:
        return ""
    
    # Count occurrences
    counts = {}
    for r in valid_rockets:
        counts[r] = counts.get(r, 0) + 1
    
    # Find max count
    max_count = max(counts.values()) if counts else 0
    # Get rockets with max count
    candidates = [r for r, c in counts.items() if c == max_count]
    # Return first alphabetically
    return sorted(candidates)[0] if candidates else ""

# func 8
def getAverageMissionsPerYear(startYear: int, endYear: int) -> float:
    mask = df['Date'].str[:4].astype(int).between(startYear, endYear)
    count = int(len(df[mask]))
    years = endYear - startYear + 1
    return round(float(count / years), 2) if years > 0 else 0.0
