# Space Missions Dashboard

- **Interactive Dashboard**: Real-time statistics and visualizations
- **Query Functions**: 8 specialized API endpoints for data analysis
- **Data Visualization**: Charts and graphs for mission insights

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


## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```   