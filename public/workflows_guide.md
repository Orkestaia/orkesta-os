# Orkesta OS: n8n Workflows Guide

Use these prompts to build the workflows needed for your AI Assistant.

## Workflow 1: "Add Lead to CRM"
**Trigger**: Webhook (POST)
**Goal**: Receive JSON `{ "name": "...", "email": "...", "company": "..." }` and append it to the Google Sheet.

**Prompt for AI Generator (or manual build):**
> Create an n8n workflow that starts with a Webhook node (POST method).
> The webhook receives JSON data with fields: `name`, `email`, `company`, `project`.
> Use a "Google Sheets" node to 'Append' a new row to the sheet with ID `[YOUR_SHEET_ID]`.
> Map `name` to the 'Name' column, `email` to 'Email', etc.
> Finally, respond to the webhook with strictly `{ "success": true, "message": "Lead added" }`.

## Workflow 2: "Update Client Email"
**Trigger**: Webhook (POST)
**Goal**: Update a specific cell based on a lookup.

**Prompt:**
> Create a workflow that receives `{ "companyName": "...", "newEmail": "..." }` via Webhook.
> Use a Google Sheets node to 'Lookup' the row where column 'Empresa' matches `companyName`.
> Then use another Google Sheets node to 'Update' that specific row, setting the 'Email' column to `newEmail`.

## Workflow 3: "General Query (RAG Lite)"
**Trigger**: Webhook (POST)
**Goal**: Read sheet data and return it to the chatbot to answer questions.

**Prompt:**
> Create a workflow that accepts `{ "query": "..." }`.
> Read all rows from the 'KPIs' and 'Financials' sheets.
> Use an AI Agent node (e.g., OpenAI or Anthropic) to answer the user's `query` using the sheet data as context.
> Return the answer text in the webhook response.

## Integration
In your `AIChatWidget.tsx`, simply point the `fetch()` call to the Production URL of these webhooks.
