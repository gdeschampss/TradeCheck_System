# TradeCheck — AI Document Validation Platform for Foreign Trade

<img width="100" height="100" alt="tarde check Logo" src="https://github.com/user-attachments/assets/ffc0697d-9074-4d18-9a13-e54ec7c31d38" /> 

> **Automate. Validate. Ship with Confidence.**

TradeCheck is an AI-powered documentary validation platform built for foreign trade operations. It replaces the manual, error-prone process of cross-checking commercial documents with an intelligent, standardized, and professional system that generates audit-ready reports in seconds.

---

## Overview

Foreign trade operations depend on the accuracy and consistency of multiple documents — Commercial Invoices, Packing Lists, and Bills of Lading. A single discrepancy can trigger customs retention, clearance delays, or financial penalties.

TradeCheck solves this by acting as a **Senior Foreign Trade Documentation Specialist powered by AI**. The platform:

1. Accepts uploads of the three core trade documents
2. Extracts structured data from each file
3. Cross-references all fields across documents
4. Classifies every inconsistency by risk level
5. Generates a professional validation report — shareable and exportable

The MVP is designed for **internal validation with a single client**, replacing a manual ChatGPT-based workflow with a scalable, repeatable system.

---

## Key Features

| Feature | Description |
|---|---|
| 📄 Multi-document Upload | Upload Invoice, Packing List, and BL in PDF or DOCX |
| 🤖 AI Extraction | Structured field extraction per document using GPT |
| 🔍 Cross-document Validation | Automatic comparison of shared fields across all documents |
| ⚠️ Risk Classification | Every inconsistency tagged as Low / Medium / High risk |
| 📊 Confidence Score | AI transparency score for each analysis |
| 📝 Structured Report | Executive summary, detailed findings, and final recommendation |
| 🔗 Shareable URL | Public report link at `/share/{analysis-id}` — no login required |
| 📥 DOCX Export | Download the report as a formatted Word document |
| 🖨️ Print View | Browser-optimized printable report layout |
| 🕓 Analysis History | Last 50 analyses stored locally and reopenable |

---

## Tech Stack

### Frontend
- **React** + **TypeScript**
- **TailwindCSS** — desktop-first, enterprise UI
- **React Router** — SPA navigation and shareable report routes

### Backend
- **Node.js** + **Express**
- REST API for document processing, analysis orchestration, and report management

### AI Layer
- **OpenAI API** — GPT-4o / latest available model
- Prompt-engineered to behave as a Foreign Trade Documentation Specialist

### File Processing
- **PDF extraction** — `pdf-parse` or equivalent
- **DOCX extraction** — `mammoth` or equivalent

### Storage
- **Local JSON storage** (MVP)
- Architecture prepared for **PostgreSQL** migration

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
│                                                             │
│  Upload Center → Validation Panel → Report Viewer          │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────┐
│                      BACKEND (Express)                      │
│                                                             │
│  /upload → /extract → /analyze → /report → /share          │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
┌─────────▼──────────┐           ┌──────────▼─────────┐
│   File Processor   │           │    OpenAI API       │
│  (PDF / DOCX)      │           │   (GPT Model)       │
└────────────────────┘           └────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                Local Storage (JSON)                         │
│         [ Prepared for PostgreSQL migration ]               │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API Key

---

## Document Intelligence Engine

TradeCheck supports three core foreign trade documents:

### Supported Documents & Fields

**Commercial Invoice**
- Supplier, Exporter, Importer
- Invoice Number, Invoice Date
- Product Description, HS Code
- Quantity, Unit Value, Total Value
- Incoterm, Gross Weight, Net Weight

**Packing List**
- Supplier, Importer
- Gross Weight, Net Weight
- Quantity, Number of Packages, Volume
- Container Number

**Bill of Lading (BL)**
- Shipper, Consignee, Notify Party
- Container Number, BL Number
- Gross Weight, Vessel
- Port of Loading, Port of Discharge

### Validation Logic

The AI compares shared fields across all three documents and flags:

- **Supplier / Shipper mismatches** — different names across documents
- **Weight discrepancies** — gross/net weight inconsistencies
- **Quantity mismatches** — units differ between Invoice and Packing List
- **Container number conflicts** — BL vs. Packing List container IDs
- **HS Code issues** — missing or conflicting tariff classifications
- **Incoterm inconsistencies** — missing or contradicting trade terms
- **Incomplete documents** — mandatory fields left blank

### Risk Classification

| Level | Meaning |
|---|---|
| 🟢 Low Risk | Minor or cosmetic inconsistency, unlikely to cause operational issues |
| 🟡 Medium Risk | Relevant inconsistency that should be corrected before shipment |
| 🔴 High Risk | Critical inconsistency with direct customs or financial risk |

---

## Report Structure

Every analysis produces a structured report with four sections:

### 1. Executive Summary
- Overall documentation status
- Global risk level
- General recommendation

### 2. Detailed Analysis
For each issue identified:
- Problem description
- Location in the document
- Risk classification
- Potential operational impact
- Suggested correction

### 3. Positive Findings
- Fields that are consistent and correctly filled across all documents

### 4. Final Conclusion
- Overall assessment
- Final recommendation before shipment

### Confidence Score

Every report includes an AI confidence score (e.g., `94% — High Confidence`) based on the completeness and readability of the uploaded documents.

---

## Shareable Reports

After every analysis, a unique public URL is generated automatically:

```
https://yourdomain.com/share/{analysis-id}
```

The shareable page displays the full report — Executive Summary, Detailed Analysis, Positive Findings, and Conclusion — with no login required. This allows freight forwarders, customs brokers, and clients to access reports directly.

> **Note:** Report URLs are public by design for the MVP. Authentication and access control are planned for a future version.

---

## Roadmap

The MVP architecture is built to support the following future features without requiring a full rewrite:

- [ ] User authentication and role-based access
- [ ] PostgreSQL database migration
- [ ] Multi-company / multi-tenancy support
- [ ] Audit logs
- [ ] Custom validation rule sets per client
- [ ] Knowledge base for trade regulations
- [ ] Learning system based on historical analyses
- [ ] External API integrations (customs systems, ERP)
- [ ] Workflow automation and CRM integrations

---

## Branding

| Token | Value |
|---|---|
| Primary | `#FF6B00` (Orange) |
| Background | `#111111` (Black) |
| Surface | `#2A2A2A` (Dark Gray) |
| Neutral | `#F5F5F5` (Light Gray) |

The UI is designed to look and feel like enterprise logistics software — professional, executive, and internationally focused.

---

## License

This project is proprietary software developed for internal client validation.
All rights reserved.
