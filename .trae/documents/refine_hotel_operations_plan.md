# Plan: Refine Hotel Operations Documentation

## Objective
Redesign the "Hotel Management List Operation Column" functionality documentation (`hotel_operations.md`) to resolve current logic chaos, ensure Administrator has full control, restrict Merchant to appropriate actions, and align with the provided scoring rubric.

## Analysis of Requirements

### Scoring Rubric Alignment
1.  **Roles**: Merchant (Upload/Edit) vs. Administrator (Audit/Publish).
2.  **Hotel Info**:
    *   Merchant: Entry/Edit/Save.
    *   Admin: Audit (Pass/Reject/Pending).
    *   Rejection requires a reason.
3.  **Lifecycle**:
    *   Online <-> Offline (Recoverable, not delete).
    *   Draft -> Audit -> Online.

### User Constraints
1.  **Administrator**: Must be able to execute *all* operations (Superuser capability).
2.  **Merchant**: Restricted to own identity operations.
3.  **Current State**: Button logic is chaotic.
4.  **No Code Changes**: Documentation update only.

## Proposed Design (Button Display Logic)

We will restructure the documentation to clearly define the State Machine and the Actions available for each Role in each State.

### 1. State Definitions
*   **Draft**: Created but not submitted.
*   **Pending**: Submitted for audit, waiting for Admin decision.
*   **Online**: Audited and visible to users.
*   **Offline**: Temporarily taken down (recoverable).
*   **Rejected**: Audit failed.

### 2. Administrator (Superuser)
Admin has full control. Buttons should be available to manage the lifecycle at any stage.

| State | Primary Actions | Secondary Actions | Notes |
| :--- | :--- | :--- | :--- |
| **Draft** | **Edit**, **Submit** | **Delete**, **Detail** | Admin can help merchant submit. |
| **Pending** | **Pass**, **Reject** | **Edit**, **Delete**, **Detail** | Core audit function. |
| **Online** | **Offline** | **Edit**, **Delete**, **Detail** | Admin can force offline. |
| **Offline** | **Re-online** | **Edit**, **Delete**, **Detail** | Admin can restore. |
| **Rejected** | **Edit** | **Delete**, **Detail** | Admin can correct and potentially resubmit. |

### 3. Merchant (Restricted)
Merchant actions are limited to their business scope.

| State | Primary Actions | Secondary Actions | Notes |
| :--- | :--- | :--- | :--- |
| **Draft** | **Edit**, **Submit** | **Delete**, **Detail** | Standard workflow. |
| **Pending** | **Detail** | - | **Locked**. Cannot edit/delete while under review to ensure data consistency. |
| **Online** | **Offline** | **Detail** | Merchant can take offline (e.g., renovation). Cannot Edit directly (must Offline first or Edit creates new Draft - simplified here to "Offline first"). |
| **Offline** | **Edit**, **Re-online** | **Delete**, **Detail** | "Re-online" implies restoring. If Edit happens, it might need Re-audit (simplified for this doc: Edit -> Save -> Draft -> Submit). Let's stick to the rubric: "Offline... can be recovered". |
| **Rejected** | **Edit** | **Delete**, **Detail** | Must Edit to fix issues. |

## Implementation Steps

1.  **Backup**: (Implicit) The original file exists.
2.  **Rewrite**: Replace the content of `d:\Hotel_Management_System\hotel_operations.md` with the new structured tables.
3.  **Review**: Ensure "Admin all operations" and "Merchant restricted" rules are strictly followed.

## Verification
*   Check against rubric: Does Admin audit? Yes. Does Merchant edit? Yes. Is Offline recoverable? Yes.
*   Check against constraint: Admin has *all* buttons? Yes (mapped in the Admin table).
