# AI Ticket Analyzer

A simple tool that helps support teams analyze customer complaints. It checks customer complaints against transaction history to understand the issue and generate a safe, helpful reply.

---

## Features

- **Check Transactions**: Reads transaction history from a CSV file to verify what really happened.
- **Find the Problem**: Identifies the issue type, urgency level, and which team should handle it.
- **Safe Customer Replies**: Drafts clear, polite messages ready to send to the customer.
- **Data Safety**: Never asks for sensitive information like PIN, OTP, or passwords.

---

## Tech Stack

| Part | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| UI Icons & Elements | Lucide React, Base UI |
| CSV Parser | PapaParse |
| Backend | Node.js, Express |
| AI Model | OpenAI SDK (via OpenRouter) |

---

## Strict CSV Format

The uploaded transaction CSV file must use these exact columns:

| Column Name | Type | Allowed Values / Example | Description |
| --- | --- | --- | --- |
| `transaction_id` | String | `TXN-1001` | Unique ID for the transaction |
| `timestamp` | String | `2026-04-12T10:15:30Z` | Date and time of transaction |
| `type` | String | `transfer`, `payment`, `cash_in`, `cash_out`, `settlement`, `refund` | Transaction type |
| `amount` | Number | `2500.0` | Amount of money |
| `counterparty` | String | `Daraz Bangladesh`, `+8801712345678` | Other person, shop, or account |
| `status` | String | `completed`, `failed`, `pending`, `reversed` | Current status of the transfer |

---

## How to Run Locally

### 1. Clone

```bash
git clone https://github.com/m-sabrinaa/ai-ticket-analyzer.git
cd ai-ticket-analyzer
```

### 2. Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```env
PORT=3000
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=your_api_key_here
```

Start the backend server:

```bash
node app.js
```

### 3. Frontend

Open a new terminal and run:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description | Response |
| --- | --- | --- | --- |
| `GET` | `/health` | Check if the server is alive | `{"status": "ok"}` |
| `POST` | `/analyze-ticket` | Analyze complaint and transaction data | JSON object with analysis and reply |