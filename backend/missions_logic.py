import pandas as pd
import os

# Load data with error handling
CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'space_missions.csv')

try:
    df = pd.read_csv(CSV_PATH)
    if df.empty:
        raise ValueError("CSV file is empty")
except FileNotFoundError:
    raise FileNotFoundError(f"CSV file not found at {CSV_PATH}")
except Exception as e:
    raise Exception(f"Error loading CSV data: {str(e)}")

# data validation and cleaning
if df.empty:
    raise ValueError("No data loaded from CSV file")

# turn all entry to str, remove whitespace, take first 10 chars
df['Date'] = df['Date'].astype(str).str.strip().str[:10] 

# parse price
if 'Price' in df.columns:
    df['Price'] = pd.to_numeric( # str to float/int
        df['Price'].astype(str).str.replace(',', ''), errors='coerce' # delete commas
    ).fillna(0) # replace NaN with 0

# date compare
df_dt = df.copy()
# datetime objects to compare dates
df_dt['_dt'] = pd.to_datetime(df['Date'], errors='coerce')


def getMissionCountByCompany(companyName: str) -> int:
    if not companyName or not isinstance(companyName, str):
        return 0
    return int(len(df[df['Company'] == companyName]))

def getSuccessRate(companyName: str) -> float:
    if not companyName or not isinstance(companyName, str):
        return 0.0
    
    company_data = df[df['Company'] == companyName]
    if company_data.empty: # no missions
        return 0.0
    
    total = len(company_data)
    if total == 0:
        return 0.0
        
    successes = len(company_data[company_data['MissionStatus'] == 'Success'])
    rate = float(successes / total * 100) # percentage
    return round(rate, 1) if rate == 0.0 else round(rate, 2) # specific `0.0 format`

def getMissionsByDateRange(startDate: str, endDate: str) -> list:
    if not startDate or not endDate:
        return []
    
    try:
        # date format to be (YYYY-MM-DD)
        pd.to_datetime(startDate)
        pd.to_datetime(endDate)
    except:
        return []
    
    if startDate > endDate:
        return []
    
    mask = (df['Date'] >= startDate) & (df['Date'] <= endDate)
    filtered = df.loc[mask].sort_values(by=['Date', 'Time']) # select/sort specific rows
    return filtered['Mission'].tolist() # return only mission

def getTopCompaniesByMissionCount(n: int) -> list:
    if not isinstance(n, int) or n <= 0:
        return []
    
    if df.empty:
        return []
    
    counts = df['Company'].value_counts().reset_index() # count column
    counts.columns = ['companyName', 'missionCount']
    sorted_df = counts.sort_values(
        by=['missionCount', 'companyName'], ascending=[False, True]
    )
    top_n = sorted_df.head(n)
    return list(top_n.itertuples(index=False, name=None))

def getMissionStatusCount() -> dict:
    if df.empty:
        return {"Success": 0, "Failure": 0, "Partial Failure": 0, "Prelaunch Failure": 0}
    
    # statuses 
    required_keys = ["Success", "Failure", "Partial Failure", "Prelaunch Failure"]
    counts = df['MissionStatus'].value_counts().to_dict()
    return {key: int(counts.get(key, 0)) for key in required_keys}

def getMissionsByYear(year: int) -> int:
    if not isinstance(year, int) or year < 1950 or year > 2030:
        return 0
    
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
    if not isinstance(startYear, int) or not isinstance(endYear, int):
        return 0.0
    
    if startYear > endYear:
        return 0.0
    
    if startYear < 1950 or endYear > 2030:
        return 0.0
    
    # grab year, convert text to #, check between 
    mask = df['Date'].str[:4].astype(int).between(startYear, endYear)
    count = int(len(df[mask]))
    years = endYear - startYear + 1 # ensure inclusive count
    return round(float(count / years), 2) if years > 0 else 0.0
