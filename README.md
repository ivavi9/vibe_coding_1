# Progress Tracker

A beautiful, Apple-inspired progress tracking application built with Python FastAPI backend and React frontend. Upload your goal documents and track your progress with intuitive visualizations.

## Features

- 📄 **Document Upload**: Upload PDF, DOCX, or TXT files containing your goals
- 🤖 **AI-Powered Goal Extraction**: Automatically extract goals from documents using OpenAI
- 📊 **Beautiful Analytics**: Track progress with Apple-inspired design and charts
- 🎯 **Goal Management**: Organize and categorize your goals
- 📈 **Progress Visualization**: See your progress with intuitive graphics and insights
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **OpenAI API**: AI-powered document parsing
- **Python**: Core backend language

### Frontend
- **React**: Modern UI library
- **Framer Motion**: Smooth animations
- **Recharts**: Beautiful chart components
- **Lucide React**: Beautiful icons
- **CSS Variables**: Apple-inspired design system

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd progress_tracker
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp env.example .env
# Edit .env and add your OpenAI API key
```

5. Run the backend:
```bash
cd backend
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Upload Documents**: Go to the Upload page and drag & drop your goal documents
2. **View Goals**: Check the Goals page to see all extracted goals
3. **Track Progress**: Add progress entries for your goals
4. **Analytics**: Visit the Analytics page to see beautiful visualizations of your progress

## API Endpoints

- `POST /upload-document`: Upload and parse a document
- `GET /goals`: Get all goals
- `POST /progress`: Add progress entry
- `GET /progress/{goal_id}`: Get progress for a specific goal
- `GET /analytics/{goal_id}`: Get analytics for a goal

## Design Philosophy

This application follows Apple's design principles:
- **Simplicity**: Clean, uncluttered interface
- **Clarity**: Clear typography and visual hierarchy
- **Depth**: Subtle shadows and layering
- **Consistency**: Unified design system
- **Accessibility**: High contrast and readable text

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
