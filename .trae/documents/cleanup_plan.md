# Plan: Delete Meaningless Test Data

## Goal
Remove the meaningless hotel data created during previous testing sessions ("Test Hotel", "Filter Hotel", etc.) by executing a webapp-testing script.

## Approach
Since the frontend UI currently lacks a "Delete" button for hotels (despite the backend supporting it), the plan involves two steps:
1.  **Enable Deletion**: Add a "Delete" button to the Hotel List UI (`src/pages/Hotel/List/index.tsx`) to allow users (and scripts) to delete hotels.
2.  **Automate Cleanup**: Write and execute a Playwright script that logs in as an administrator and deletes all hotels matching test data patterns.

## Steps

### 1. Frontend Modification
-   **File**: `src/pages/Hotel/List/index.tsx`
-   **Action**:
    -   Import `DeleteOutlined` from `@ant-design/icons`.
    -   Add `handleDelete` function to call `hotelApi.delete`.
    -   Add a "Delete" button with `Popconfirm` to the table columns.

### 2. Create Cleanup Script
-   **File**: `tests/cleanup_test_data.py`
-   **Logic**:
    -   Login as `admin` (password: `admin123`).
    -   Search for specific keywords used in tests: "Test", "Filter", "Draft", "Pending", "Admin", "Edit", "Audit".
    -   Iterate through results and click the new "Delete" button.
    -   Handle pagination if necessary (though search usually narrows it down).

### 3. Execution
-   Run the cleanup script using `pytest`.

## Verification
-   Verify that the "Delete" button appears in the UI.
-   Verify that test data is removed from the list after script execution.
