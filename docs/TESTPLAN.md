# Test Plan for Account Management System

This document provides a business-facing test plan for validating the current COBOL account management application before migrating the logic to a Node.js solution. The plan is structured to capture the business behavior, the technical steps required to validate it, and the outcome of each test for stakeholder review.

## Business Scope

The current application provides the following business capabilities:

- View the current account balance.
- Credit the account by adding a valid amount.
- Debit the account by subtracting a valid amount when sufficient funds exist.
- Reject invalid menu selections.
- Prevent debit transactions when the account balance is insufficient.
- Exit the application.

## Test Table

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Application starts successfully and displays the main menu | COBOL compiler is available, source files exist, and the application is built successfully | 1. Run the compiled program. 2. Observe the startup screen. | The system displays the account management menu with options 1 through 4 and a prompt to enter a choice. | TBD | TBD | Validates the entry point and user interface flow. |
| TC-02 | View balance returns the default account balance | Application is running and no prior transaction has changed the balance | 1. Select option `1` from the menu. | The system displays `Current balance: 001000.00` and returns to the main menu. | TBD | TBD | Confirms the starting balance is 1000.00. |
| TC-03 | Valid credit transaction increases the balance | Application is running and the current balance is known | 1. Select option `2`. 2. Enter `250.00` when prompted. | The system adds `250.00` to the balance and displays `Amount credited. New balance: 001250.00`. | TBD | TBD | Confirms the credit operation updates stored state. |
| TC-04 | Multiple credit transactions accumulate correctly | Application is running and the current balance is the value from the latest state | 1. Select option `2`. 2. Enter `150.00`. 3. Select option `1`. | The system displays the updated balance equal to the previous balance plus `150.00`, reflecting cumulative credit behavior. | TBD | TBD | Validates transaction persistence across repeated credits. |
| TC-05 | Valid debit transaction decreases the balance when funds are sufficient | Application is running with sufficient available funds | 1. Select option `3`. 2. Enter `200.00`. | The system subtracts `200.00` and displays `Amount debited. New balance: ...` with the reduced value. | TBD | TBD | Confirms debit is allowed when funds are adequate. |
| TC-06 | Debit transaction is rejected when the balance is insufficient | Application is running with a lower balance than the requested debit amount | 1. Select option `3`. 2. Enter an amount greater than the current available balance, such as `2000.00`. | The system displays `Insufficient funds for this debit.` and does not reduce the balance. | TBD | TBD | Ensures business rule protects against overdraft. |
| TC-07 | Repeated debit attempts respect the current balance after each valid transaction | Application is running and the current balance is known | 1. Select option `3`. 2. Enter `100.00`. 3. Select option `1`. 4. Select option `3` again. 5. Enter a value that is valid or invalid depending on the new balance. | The balance reflects the result of each transaction in sequence, and debit logic only proceeds when the balance is sufficient. | TBD | TBD | Confirms state is updated correctly between transactions. |
| TC-08 | Exit option ends the application | Application is running | 1. Select option `4` from the menu. | The program displays `Exiting the program. Goodbye!` and terminates normally. | TBD | TBD | Confirms the end-of-session business flow. |
| TC-09 | Invalid menu selection is rejected | Application is running | 1. Select a value outside `1-4`, such as `0` or `9`. | The system displays `Invalid choice, please select 1-4.` and returns to the menu without changing the balance. | TBD | TBD | Validates menu input validation. |
| TC-10 | Balance remains stable when invalid inputs are entered | Application is running and balance is known | 1. Attempt invalid choices or invalid values multiple times. 2. view current balance. | Balance remains unchanged after invalid commands and the user remains in the main menu. | TBD | TBD | Protects business data integrity against invalid input processing. |
| TC-11 | Credit accepts numeric input and updates balance precisely | Application is running | 1. Select option `2`. 2. Enter a valid numeric value with decimals such as `123.45`. | The system accepts the value, updates the balance correctly, and displays the new total with two decimal precision as expected by the COBOL program. | TBD | TBD | Confirms numeric handling for financial values. |
| TC-12 | Debit accepts numeric input and respects decimal precision | Application is running with sufficient funds | 1. Select option `3`. 2. Enter a valid numeric value such as `45.50`. | The system subtracts the amount accurately and displays the updated balance with correct decimal precision. | TBD | TBD | Validates numeric precision for monetary math. |

## Test Coverage Summary

This plan covers the core business rules implemented in the legacy application:

- Initial state and default balance of `1000.00`.
- Menu-driven transaction flow.
- Reading the current balance through the data layer.
- Writing the updated balance back to the storage component.
- Credit transaction success path.
- Debit transaction success path.
- Overdraft protection.
- Invalid input handling.
- Program exit behavior.

## Notes for Business Stakeholders

- The system currently uses a single in-memory balance value starting at `1000.00`.
- The logic is intentionally simple and does not include persistence across application restarts.
- Any future Node.js implementation should retain the same business behavior described in this plan to preserve compatibility with existing requirements.
- The `Actual Result` and `Status` columns should be completed during validation sessions with stakeholders and testers.
