# Expense Tracker – Server

Backend API for the Expense Tracker application.  
This service is responsible for managing incomes and expenses, handling validation, and providing structured data for financial tracking and insights.

---

## Overview

The Expense Tracker Server powers the core business logic of the application.  
It exposes RESTful APIs used by the client to record income and expense entries, fetch summaries, and maintain accurate financial records.

The backend is designed with:
- Clear separation of concerns
- RESTful API conventions
- Consistent validation and error handling

---

## Core Responsibilities

- Manage **income** and **expense** data
- Validate user input and enforce business rules
- Provide APIs for monthly and historical records
- Maintain data consistency for reports and dashboards

---

## API Modules (High Level)

- **Income**
  - Add income
  - Update income
  - Delete income
  - Fetch single or multiple incomes

- **Expense**
  - Add expense
  - Update expense
  - Delete expense
  - Fetch single or multiple expenses

> Authentication and advanced reporting can be added incrementally.

---

## Project Structure

src/
├─ controllers/ # Request handling & business logic
├─ routes/ # API route definitions
├─ models/ # Database models
├─ middleware/ # Auth, validation, error handling
├─ utils/ # Helpers and utilities
├─ app.js # Express app setup
└─ server.js # Server entry point