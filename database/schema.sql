-- ============================================================
-- Contracts Management System – Database Schema
-- PostgreSQL 14+
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Contracts ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50)  NOT NULL
                    CHECK (status IN ('DRAFT','REVIEW','APPROVED','REJECTED','EXPIRED')),
    owner_name  VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_status     ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_contracts_owner_name ON contracts (owner_name);
CREATE INDEX IF NOT EXISTS idx_contracts_title      ON contracts USING gin (to_tsvector('english', title));

-- ── Workflow History ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_history (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID        NOT NULL REFERENCES contracts (id) ON DELETE CASCADE,
    previous_status VARCHAR(50) CHECK (previous_status IN ('DRAFT','REVIEW','APPROVED','REJECTED','EXPIRED')),
    new_status      VARCHAR(50) NOT NULL
                        CHECK (new_status IN ('DRAFT','REVIEW','APPROVED','REJECTED','EXPIRED')),
    changed_by      VARCHAR(255) NOT NULL,
    changed_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_contract_id ON workflow_history (contract_id);
