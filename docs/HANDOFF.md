---
date: 2026-10-16
topic: ngo-donation-management-system
project: /home/pushkarsaini/Downloads/dbms/dbms project
status: active
version: 1
---

# Handoff: NGO Donation Management System

> **Rule:** If SQL files and this handoff ever disagree, the SQL files win.
> **Rule:** Read this file first. Run `/handoff` at the end of every session or stage.

---

## Objective

Build a complete NGO Donation Management System for a college DBMS course (Problem Statement 39).
The deliverable is a working MySQL 8.x database with all advanced DBMS features demonstrated
(views, stored procedures, triggers, events, window functions, CTEs, roles, transactions), plus:
- A beautiful static public website (HTML/CSS only) as the face of the project
- An admin dashboard with a "Database Inspector" page showing DBMS concepts live
- A mock QR payment flow that exercises the transaction/locking code
- A project report with query outputs and a demo script

The hero is the **DBMS concepts made visible** — the Database Inspector is the showpiece.

---

## Core Schema (LOCKED — columns must not change)

```sql
Donors(
  donor_id     INT PRIMARY KEY AUTO_INCREMENT,
  donor_name   VARCHAR(100) NOT NULL,
  email        VARCHAR(150) UNIQUE NOT NULL,
  phone        VARCHAR(20)
)

Projects(
  project_id   INT PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(150) NOT NULL,
  category     VARCHAR(80) NOT NULL,
  budget       DECIMAL(12,2) NOT NULL
)

Donations(
  donation_id   INT PRIMARY KEY AUTO_INCREMENT,
  donor_id      INT NOT NULL,  -- FK → Donors
  project_id    INT NOT NULL,  -- FK → Projects
  donation_date DATE NOT NULL,
  amount        DECIMAL(10,2) NOT NULL
)

Beneficiaries(
  beneficiary_id   INT PRIMARY KEY AUTO_INCREMENT,
  beneficiary_name VARCHAR(150) NOT NULL,
  location         VARCHAR(200) NOT NULL,
  project_id       INT NOT NULL   -- FK → Projects
)
```

### Additional tables (not locked, can evolve)

```sql
payment_intents(token PK, donor_id FK, project_id FK, amount, status: pending/paid/failed/expired, created_at, expires_at)
donation_audit(audit_id PK, donation_id, changed_by, changed_at, old_amount, new_amount, action)
receipt_sequence(receipt_id PK, donation_id FK, receipt_number UNIQUE — gapless)
```

---

## Locked Decisions

(Append-only. Never remove or edit past entries. Add new decisions below with date.)

| # | Date | Decision | Rationale |
|---|------|----------|-----------|
| 1 | 2026-10-16 | Public website: plain HTML + CSS only | College project requirement; no build tools; keeps the focus on DBMS, not frontend stack |
| 2 | 2026-10-16 | Vanilla JS only, and only later for backend wiring | Same rationale; data hooks use `data-*` attributes and form field names matching schema column names |
| 3 | 2026-10-16 | No real payment gateway; QR → mock payment page → save to DB | Simplifies demo; avoids real money; still exercises the full DB transaction path |
| 4 | 2026-10-16 | payment_intents table + confirm_payment(token) stored procedure with SELECT...FOR UPDATE | Demonstrates transactions, locking, rollback on failure; Donations holds only confirmed money |
| 5 | 2026-10-16 | Backend management: CRM + admin dashboard with donor segments, window functions, RFM, CTEs, GRANT/REVOKE roles (admin, staff, auditor) | Covers all advanced DBMS marks |
| 6 | 2026-10-16 | Compliance: audit trigger → donation_audit; gapless receipt numbering; Event Scheduler (expire stale payments, nightly summary, flag under-funded projects); privacy view masking contacts for auditor role | Demonstrates triggers, events, security features |
| 7 | 2026-10-16 | Hero feature: Database Inspector page showing SQL that ran, trigger firing, audit rows, transaction steps, EXPLAIN before/after index, live ER diagram | The showpiece that makes DBMS concepts visible |
| 8 | 2026-10-16 | silk-design skill installed for website UI | Rich CSS motion design for the public site; available via `/silk-design` |
| 9 | 2026-10-16 | crm-management & donor-relationship-management skills installed | Guides CRM operations, donor segmentation, and relationship workflows for admin/crm module |

---

## Build Order

1. **Schema + seed + ER diagram** — `sql/schema/`, `sql/seed/`, `docs/ER_DIAGRAM.*`
2. **Views, indexes, procedures, triggers, events, roles** — each in own `sql/` subdirectory
3. **QR and mock payment flow** — `sql/procedures/confirm_payment.sql`, mock payment page
4. **Admin dashboard, CRM, Database Inspector** — `admin/`
5. **Public website polish** — `website/`
6. **Report and demo script** — `docs/REPORT.md`, `docs/DEMO.md`

> The static website is being built **in parallel** with step 1.

---

## Progress

- [x] Project directory structure created (`sql/`, `website/`, `admin/`, `docs/` and all subdirs)
- [x] Documentation written (session instructions, setup guide, build order, file layout)
- [x] `docs/HANDOFF.md` written (this file — master spec and state)
- [x] `silk-design` Kiro skill installed globally + workspace symlink
- [x] `crm-management` and `donor-relationship-management` skills installed globally + workspace symlinks
- [ ] `sql/schema/01_tables.sql` — core tables + constraints
- [ ] `sql/schema/02_indexes.sql` — indexes
- [ ] `sql/seed/seed_data.sql` — realistic seed data (≥5 donors, ≥4 projects, ≥15 donations)
- [ ] `docs/ER_DIAGRAM.*` — ER diagram (draw.io / dbdiagram.io export)
- [ ] `sql/views/` — donor_segments, privacy_view, project_funding_summary
- [ ] `sql/procedures/confirm_payment.sql` — transaction + locking + rollback
- [ ] `sql/triggers/audit_trigger.sql` — donation_audit trigger
- [ ] `sql/triggers/receipt_trigger.sql` — gapless receipt numbering
- [ ] `sql/events/` — expire payments, nightly summary, flag under-funded
- [ ] `sql/roles/roles.sql` — admin, staff, auditor roles + GRANT/REVOKE
- [ ] `sql/queries/window_functions.sql` — donor ranking, RFM, CTEs
- [ ] Mock QR code + mock payment page (website)
- [ ] Admin dashboard HTML/CSS
- [ ] CRM page with donor segments
- [ ] Database Inspector page
- [ ] Public website (all pages polished)
- [ ] `docs/REPORT.md` — query output screenshots / text
- [ ] `docs/DEMO.md` — step-by-step demo script

---

## Current State

**Session 2 end (2026-10-16):** Project scaffolded. Directory structure created, documentation
written, this handoff file written. silk-design skill ready. No SQL or HTML written yet.
The next session should start writing `sql/schema/01_tables.sql`.

---

## Files Modified This Session

- `/home/pushkarsaini/Downloads/dbms/dbms project/docs/HANDOFF.md` — Updated with crm-management & donor-relationship-management skills
- `/home/pushkarsaini/Downloads/dbms/dbms project/docs/HANDOFF.md` — Updated status and locked decisions
- `/home/pushkarsaini/Downloads/dbms/dbms project/.kiro/skills/silk-design` — Symlink to global skill
- `~/.kiro/skills/silk-design/` — Cloned from GitHub (global skill install)
- `~/.kiro/skills/crm-management/` — Installed from GitHub (LoopyLuci/Skills)
- `~/.kiro/skills/donor-relationship-management/` — Installed from GitHub (LoopyLuci/Skills)
- `/home/pushkarsaini/Downloads/dbms/dbms project/.kiro/skills/crm-management` — Symlink to global skill
- `/home/pushkarsaini/Downloads/dbms/dbms project/.kiro/skills/donor-relationship-management` — Symlink to global skill
- `/home/pushkarsaini/Downloads/dbms/dbms project/.agents/skills/crm-management` — Antigravity workspace skill
- `/home/pushkarsaini/Downloads/dbms/dbms project/.agents/skills/donor-relationship-management` — Antigravity workspace skill

---

## Uncommitted Changes

No git repository initialized. All files are new.
To initialize: `git init && git add . && git commit -m "chore: project scaffold"`

---

## Open Questions

| # | Question | Priority |
|---|----------|----------|
| 1 | Backend language: Node.js/Express vs Python/Flask? | Decide before Step 3 (mock payment flow) |
| 2 | Allow one small CDN library (Lenis/GSAP) for smooth scroll on website, or stay pure CSS? | Decide before website polish (Step 5). Current locked decision is CSS-only; this would amend Decision #1 |
| 3 | Where to host the demo — local MySQL only, or also a cloud DB for presentation? | Nice to have |
| 4 | ER diagram tool — dbdiagram.io (online), MySQL Workbench, or draw.io? | Decide at Step 1 |

---

## Key Design Notes

### confirm_payment() procedure sketch
```sql
CREATE PROCEDURE confirm_payment(IN p_token VARCHAR(64))
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN ROLLBACK; RESIGNAL; END;

  START TRANSACTION;
    SELECT project_id, amount INTO ... FROM payment_intents
      WHERE token = p_token AND status = 'pending'
      FOR UPDATE;                          -- row-level lock
    -- check budget not exceeded
    -- INSERT INTO Donations(...)
    -- UPDATE payment_intents SET status='paid'
    -- INSERT INTO receipt_sequence(...)
  COMMIT;
END;
```

### Roles
- `ngo_admin`  — full access
- `ngo_staff`  — INSERT/SELECT on Donors, Projects, Donations, Beneficiaries; no DROP
- `ngo_auditor` — SELECT only on privacy_view (masked emails/phones); no raw Donors access

### Window function queries to showcase
- `RANK() OVER (ORDER BY SUM(amount) DESC)` — top donors
- `NTILE(4) OVER (ORDER BY last_donation_date)` — RFM recency quartile
- `SUM(amount) OVER (PARTITION BY project_id ORDER BY donation_date)` — running total per project
- CTE → recursive or multi-step donor lifetime value

---

## Next Steps (ordered)

1. **NEXT:** Write `sql/schema/01_tables.sql` — all core tables with proper FK constraints,
   `NOT NULL`, `CHECK` constraints (amount > 0, budget > 0), appropriate `VARCHAR` lengths.
2. Write `sql/schema/02_indexes.sql` — indexes on FK columns + commonly queried fields.
3. Write `sql/seed/seed_data.sql` — realistic NGO data (education/health/environment categories).
4. **Decide backend language** (Node/Express recommended — JS consistency with frontend).
5. Export ER diagram from MySQL Workbench or dbdiagram.io.

---

## How to Resume

1. Open `docs/HANDOFF.md` (this file) — read the "Current State" and "Next Steps" sections.
2. Check `sql/` directory for any files already written — they take precedence over this doc.
3. Start with: `sql/schema/01_tables.sql`
4. Run `mysql -u root -p < sql/schema/01_tables.sql` to test each script as you write it.
5. End the session with `/handoff` to update this file.
