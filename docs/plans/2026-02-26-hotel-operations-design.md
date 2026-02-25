# Hotel Operations Action Bar & State Machine Design
**Date**: 2026-02-26
**Based on**: `d:\Hotel_Management_System\hotel_operations.md`

## 1. Overview
This design aligns the Hotel Management System's operations with the standardized `hotel_operations.md`. It addresses the "Not Executed" status of **Feature-001 (Audit/Publish)** and **Feature-002 (Offline/Recover)** in the P0 Test Report.

## 2. Problem Statement
The current implementation lacks a strict state machine, leading to inconsistent behavior (e.g., Rejected status handling, Offline edit behavior). The Action Bar buttons do not fully reflect the role-based permissions defined in the operations document.

## 3. Solution
Implement a strict state machine in the Backend and update the Frontend Action Bar to reflect the correct permissions and transitions.

### 3.1 Backend Changes
- **Model (`server/src/models/Hotel.ts`)**: Update `status` enum to include `rejected`.
  - `status: 'draft' | 'pending' | 'online' | 'offline' | 'rejected'`
- **Controller (`server/src/controllers/hotelController.ts`)**:
  - **Audit (Reject)**: Set `status = 'rejected'` and `auditStatus = 'rejected'`.
  - **Update**: If current status is `offline` or `rejected`, reset `status` to `draft` (requires re-audit).
  - **Submit for Audit**: Allow submission from `draft`, `offline`, `rejected`.
  - **Toggle Online**: Ensure only `online` <-> `offline` transitions are valid, and `offline` -> `online` requires `auditStatus === 'passed'`.

### 3.2 Frontend Changes
- **Page (`src/pages/Hotel/List/index.tsx`)**:
  - **Status Tag**: Update `getStatusTag` to handle `rejected` status explicitly (Red tag).
  - **Action Bar Logic**:
    - **Merchant**:
      - `draft` / `rejected`: Edit, Submit for Audit, Delete.
      - `pending`: View Details (Locked).
      - `online`: Offline, View Details.
      - `offline`: Edit (Resets to Draft), Re-online (If Audit Passed), Delete.
    - **Admin**:
      - All Merchant actions + specific overrides.
      - `pending`: Audit (Pass/Reject).
      - `online`: Force Offline.
      - `offline`: Force Online.

## 4. Verification Plan
- **Unit Tests**: Verify backend state transitions.
- **E2E Tests (`webapp-testing`)**:
  - Create a hotel -> Submit -> Audit (Pass) -> Online.
  - Create -> Submit -> Audit (Reject) -> Rejected -> Edit -> Draft.
  - Online -> Offline -> Edit -> Draft.
  - Verify button visibility for Merchant and Admin roles.

## 5. Impact
- Resolves **Feature-001** and **Feature-002**.
- Improves security by enforcing re-audit on critical changes.
- Standardizes user experience.
