# Space Missions Dashboard

A comprehensive historical space launch database and analytics dashboard built with FastAPI (backend) and React (frontend).

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SpaceMissionsDashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the backend server**
   ```bash
   npm run start
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### Manual Installation

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
SpaceMissionsDashboard/
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints and server
│   ├── missions_logic.py   # Data processing logic
│   ├── requirements.txt    # Python dependencies
│   └── data/               # Data files
│       └── space_missions.csv
├── frontend/               # React frontend
│   ├── src/
│   │   ├── app.jsx         # Main application component
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # TailwindCSS configuration
│   └── vite.config.js      # Vite configuration
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for building APIs
- **Pandas**: Data manipulation and analysis
- **Uvicorn**: ASGI server for running the application

### Frontend
- **React 19**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **TypeScript**: Type-safe JavaScript development