const readline = require('readline');

const DEFAULT_BALANCE = 1000.0;

function createAccountState(initialBalance = DEFAULT_BALANCE) {
  return {
    balance: Number(initialBalance),
  };
}

function formatCobolBalance(value) {
  const numericValue = Number(value) || 0;
  const fixedValue = numericValue.toFixed(2);
  const [wholePart, fractionalPart] = fixedValue.split('.');
  return `${wholePart.padStart(6, '0')}.${fractionalPart}`;
}

function readBalance(state) {
  return Number(state.balance);
}

function writeBalance(state, newBalance) {
  state.balance = Number(newBalance);
  return state.balance;
}

function creditAccount(state, amount) {
  const currentBalance = readBalance(state);
  const updatedBalance = currentBalance + Number(amount);
  writeBalance(state, updatedBalance);
  return updatedBalance;
}

function debitAccount(state, amount) {
  const currentBalance = readBalance(state);
  const numericAmount = Number(amount);

  if (currentBalance >= numericAmount) {
    const updatedBalance = currentBalance - numericAmount;
    writeBalance(state, updatedBalance);
    return updatedBalance;
  }

  return null;
}

function isValidMenuChoice(choice) {
  return ['1', '2', '3', '4'].includes(String(choice));
}

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const state = createAccountState();

  const prompt = (question) => new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });

  async function handleCredit() {
    const amountInput = await prompt('Enter credit amount: ');
    const amount = Number(amountInput);

    if (!Number.isFinite(amount)) {
      console.log('Invalid credit amount.');
      return;
    }

    const newBalance = creditAccount(state, amount);
    console.log(`Amount credited. New balance: ${formatCobolBalance(newBalance)}`);
  }

  async function handleDebit() {
    const amountInput = await prompt('Enter debit amount: ');
    const amount = Number(amountInput);

    if (!Number.isFinite(amount)) {
      console.log('Invalid debit amount.');
      return;
    }

    const newBalance = debitAccount(state, amount);

    if (newBalance === null) {
      console.log('Insufficient funds for this debit.');
      return;
    }

    console.log(`Amount debited. New balance: ${formatCobolBalance(newBalance)}`);
  }

  while (true) {
    displayMenu();
    const choice = await prompt('Enter your choice (1-4): ');

    if (!isValidMenuChoice(choice)) {
      console.log('Invalid choice, please select 1-4.');
      continue;
    }

    switch (choice) {
      case '1':
        console.log(`Current balance: ${formatCobolBalance(readBalance(state))}`);
        break;
      case '2':
        await handleCredit();
        break;
      case '3':
        await handleDebit();
        break;
      case '4':
        console.log('Exiting the program. Goodbye!');
        rl.close();
        return;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected application error:', error);
    process.exit(1);
  });
}

module.exports = {
  DEFAULT_BALANCE,
  createAccountState,
  formatCobolBalance,
  readBalance,
  writeBalance,
  creditAccount,
  debitAccount,
  isValidMenuChoice,
};
