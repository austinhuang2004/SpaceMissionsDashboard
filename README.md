# Space Missions Dashboard

- **Interactive Dashboard**: Real-time statistics and visualizations
- **Query Functions**: 8 specialized API endpoints for data analysis
- **Data Visualization**: Charts and graphs for mission insights

### Prerequisites

- **Python 3.8+**
- **Node.js 22.14.0***
- **Git**

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/austinhuang2004/SpaceMissionsDashboard.git
   cd SpaceMissionsDashboard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   - Backend will start on `http://127.0.0.1:8000`
   - Keep this terminal open

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Frontend will start on `http://localhost:5173`
   - Open this URL in your browser

## Features

### Dashboard Overview
- **Mission Statistics**: Total missions, success rate, top company
- **Interactive Charts**: Company mission counts, mission timeline
- **Real-time Data**: Live filtering and search capabilities

### Query Functions
- **Mission Count by Company**: Get total missions for any company
- **Success Rate**: Calculate success percentage for companies
- **Date Range Search**: Find missions between specific dates
- **Year-based Queries**: Get missions by year or average per year
- **Status Distribution**: View mission outcome statistics
- **Top Companies**: Find companies with most missions
- **Most Used Rocket**: Discover the most frequently used rocket

### Data Table
- **Advanced Filtering**: Filter by company, mission, status, date range, price, rocket status
- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through large datasets
- **Status Colors**: Visual indicators for mission outcomes


## Visualizations and Design Choices

### 1. **Statistical Overview Cards**
**Why this visualization**: Large, bold numbers provide immediate impact and key metrics at a glance.
**Method**: Counters with smooth transitions to engage users and highlight statistics. 

### 2. **Mission Status Distribution (Status Bar Chart)**
**Why this visualization**: A horizontal bar chart effectively shows the proportion of different mission outcomes.
**Method**: SVG-based bars with color coding (green for success, red for failure, etc.).


### 3. **Top Organizations (Company Bars Chart)**
**Why this visualization**: A horizontal bar revealing the top 10 organizations based on the amount of missions they have - to show relevancy.
**Method**: Company names on left side and numbers of missions on the right with different display colors.


### 4. **Launches Per Year (Timeline Chart)**
**Why this visualization**: A line chart effectively shows trends and patterns over time, to see the growth/decay throughout the years.
**Method**: SVG line with data points.


### 5. **Query Functions Interface**
**Why this visualization**: A form-based interface makes complex queries accessible to all users.
**Method**: Interactive forms with real-time results display.


### 6. **Interactive Data Table**
**Why this visualization**: A sortable, filterable table allows users to explore the complete dataset.
**Method**: Virtualized table with pagination, column sorting, and search functionality.


## Project Structure

```
SpaceMissionsDashboard/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── missions_logic.py    # Data processing functions
│   ├── requirements.txt     # Python dependencies
│   └── data/
│       └── space_missions.csv  # Mission data
└── frontend/
    ├── package.json         # Node.js dependencies
    ├── vite.config.js       # Vite configuration
    ├── src/
    │   ├── app.jsx          # Main application
    │   ├── components/      # React components
    │   └── index.css        # Global styles
```
