# TradeCheck System

TradeCheck is a premium, AI-powered document validation MVP designed for foreign trade documentation. It automatically extracts, cross-checks, and analyzes international trade documents to identify inconsistencies, risks, and compliance issues.

## 🚀 Features

- **Document Upload**: Support for Commercial Invoices, Packing Lists, Bills of Lading, and other trade documents.
- **AI-Powered Analysis**: Utilizes Google Gemini (`gemini-2.5-flash`) to cross-reference data across all uploaded documents.
- **Smart Validation**: Automatically verifies key fields like:
  - Supplier & Importer alignment
  - HS Codes
  - Incoterms
  - Gross & Net Weights
  - Quantities & Total Values
  - Container Numbers
  - Ports of Loading & Discharge
- **Comprehensive Reports**: Provides an executive summary, risk level classification (Low/Medium/High), detailed discrepancy logs, positive findings, and actionable correction recommendations.
- **Confidence Scoring**: Programmatically calculates data consistency confidence.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Modern CSS / Tailwind CSS
- **Features**: Interactive dashboard, upload zone, dynamic validation results, detailed report viewer.

### Backend
- **Runtime**: Node.js
- **Framework**: Express with TypeScript
- **AI Integration**: `@google/generative-ai` (Gemini SDK)
- **Document Processing**: `pdf-parse`

## ⚙️ Setup & Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## 📄 License

This project is proprietary. All rights reserved.
