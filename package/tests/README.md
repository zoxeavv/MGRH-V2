# Integration Test Plan

Integration coverage is not enabled yet. Once the testing harness (Playwright or Cypress plus seeded Supabase data) is provisioned, add scenarios that cover:

1. **Authentication flows** – exercise login, registration, and in particular the `logoutAction` to ensure sessions terminate cleanly.
2. **Clients list interactions** – verify that the `/clients` data table renders the seeded records, filters correctly, and that bulk status updates mutate the database through the new server actions.

Until then this file acts as a placeholder so the intent is captured alongside the code changes.
