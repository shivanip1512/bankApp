'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Shivani Pacharne',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Sweety Indrajeet Samanta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Kirti Choudhary',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sneha Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

function dateformatter() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
  labelDate.textContent = today;
}

dateformatter();

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((element, i) => {
    const type = element > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">₹${Math.abs(element)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .split(' ')
      .map(name => name[0].toLowerCase())
      .join('');
  });
};

createUsernames(accounts);

const displayTotalBalance = function (account) {
  const bal = account.movements.reduce((acc, mov) => acc + mov, 0);
  account.balance = bal;
  labelBalance.textContent = `₹${bal}`;
};

// displayTotalBalance(account1.movements);

const displaySummary = function (account) {
  const movements = account.movements;
  const interestOnDeposite = account.interestRate;
  const deposites = movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr,0);
  labelSumIn.textContent = `₹${deposites}`;

  const withdrawal = movements
    .filter(mov => mov < 0)
    .reduce((acc, curr, i, arr) => {
      // console.log(arr,acc,curr);
      return acc + curr;
    },0);
  labelSumOut.textContent = `₹${Math.abs(withdrawal)}`;

  const interest = movements
    .filter(deposite => deposite > 0)
    .map(deposite => (deposite * interestOnDeposite) / 100)
    .reduce((acc, interest) => acc + interest,0);
  labelSumInterest.textContent = `₹${interest}`;
};

// displaySummary(account1.movements);

const renderUI = function (acc) {
   //display movements
    displayMovements(acc.movements);

    //display balance
    displayTotalBalance(acc);

    //display summary
    displaySummary(acc);
}

let activeAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent default behaviour of login form
  activeAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  
  if (activeAccount?.pin === Number(inputLoginPin.value)) {
    //display welcome message
    labelWelcome.textContent = `Welcome back, ${activeAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 'unset';
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    renderUI(activeAccount);
  }
});


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferTo = inputTransferTo.value;
  const amtTransfer = Number(inputTransferAmount.value);
  
  const receiverAcc = accounts.find(acc => acc.userName === transferTo);
  if (
    receiverAcc &&
    amtTransfer > 0 &&
    activeAccount.balance >= amtTransfer &&
    receiverAcc.userName !== activeAccount.userName
  ) {
    activeAccount.movements.push(-amtTransfer);
    receiverAcc.movements.push(amtTransfer);
    renderUI(activeAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    activeAccount.userName === inputCloseUsername.value &&
    activeAccount.pin === Number(inputClosePin.value)
  ){
    const index = accounts.findIndex(acc => acc.userName === activeAccount.userName);
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});