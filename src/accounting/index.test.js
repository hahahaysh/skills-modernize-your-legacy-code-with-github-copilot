const {
  DEFAULT_BALANCE,
  createAccountState,
  formatCobolBalance,
  readBalance,
  writeBalance,
  creditAccount,
  debitAccount,
  isValidMenuChoice,
} = require('./index');

describe('Account Management System business logic', () => {
  test('initial state starts at 1000.00', () => {
    const state = createAccountState();

    expect(readBalance(state)).toBe(DEFAULT_BALANCE);
    expect(formatCobolBalance(readBalance(state))).toBe('001000.00');
  });

  test('view balance returns current stored balance', () => {
    const state = createAccountState(1000);

    expect(readBalance(state)).toBe(1000);
  });

  test('valid credit adds amount to the balance', () => {
    const state = createAccountState(1000);

    const newBalance = creditAccount(state, 250.0);

    expect(newBalance).toBe(1250);
    expect(readBalance(state)).toBe(1250);
  });

  test('multiple credits accumulate the new total', () => {
    const state = createAccountState(1000);

    creditAccount(state, 150);
    const balanceAfterSecondCredit = creditAccount(state, 75.5);

    expect(balanceAfterSecondCredit).toBe(1225.5);
    expect(readBalance(state)).toBe(1225.5);
  });

  test('valid debit subtracts amount when funds are sufficient', () => {
    const state = createAccountState(1000);

    const newBalance = debitAccount(state, 200);

    expect(newBalance).toBe(800);
    expect(readBalance(state)).toBe(800);
  });

  test('debit is rejected when amount exceeds available balance', () => {
    const state = createAccountState(1000);

    const newBalance = debitAccount(state, 2000);

    expect(newBalance).toBeNull();
    expect(readBalance(state)).toBe(1000);
  });

  test('balance remains unchanged after an invalid menu selection', () => {
    const state = createAccountState(1000);

    expect(isValidMenuChoice(0)).toBe(false);
    expect(isValidMenuChoice(9)).toBe(false);
    expect(readBalance(state)).toBe(1000);
  });

  test('writeBalance updates the stored balance value', () => {
    const state = createAccountState(1000);

    const updatedBalance = writeBalance(state, 1500.25);

    expect(updatedBalance).toBe(1500.25);
    expect(readBalance(state)).toBe(1500.25);
  });

  test('credit accepts decimal amount values', () => {
    const state = createAccountState(1000);

    const newBalance = creditAccount(state, 123.45);

    expect(newBalance).toBe(1123.45);
    expect(formatCobolBalance(newBalance)).toBe('001123.45');
  });

  test('debit accepts decimal amount values when sufficient funds exist', () => {
    const state = createAccountState(1000);

    const newBalance = debitAccount(state, 45.5);

    expect(newBalance).toBe(954.5);
    expect(formatCobolBalance(newBalance)).toBe('000954.50');
  });

  test('isValidMenuChoice accepts only menu options 1 through 4', () => {
    expect(isValidMenuChoice('1')).toBe(true);
    expect(isValidMenuChoice('2')).toBe(true);
    expect(isValidMenuChoice('3')).toBe(true);
    expect(isValidMenuChoice('4')).toBe(true);
    expect(isValidMenuChoice('5')).toBe(false);
    expect(isValidMenuChoice('')).toBe(false);
  });
});
