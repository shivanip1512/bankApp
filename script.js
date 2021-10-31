'use strict';

// Data
const account1 = {
  owner: 'Shivani Pacharne',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Sweety Indrajeet Samanta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Kirti Choudhary',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-12-01T13:15:33.035Z',
    '2019-01-30T09:48:16.867Z',
    '2019-02-25T06:44:23.907Z',
    '2020-09-25T14:08:46.235Z',
    '2020-08-05T16:33:06.386Z',
    '2020-07-10T14:13:26.374Z',
    '2020-03-25T18:59:59.371Z',
    '2020-06-26T12:21:20.894Z',
  ],
  currency: 'Rupee',
  locale: 'en-IN',
};

const account4 = {
  owner: 'Sneha Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'Yen',
  locale: 'ja-JP',
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

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['Rupee', 'Indian Rupees'],
  ['Yen','Japanese Yen']
]);

function dateformatter(today) {
  var dd = `${today.getDate()}`.padStart(2, '0');
  var mm = `${today.getMonth() + 1}`.padStart(2, '0');
  var yyyy = today.getFullYear();
  const hours = `${today.getHours()}`.padStart(2, '0');
  const minutes = `${today.getMinutes()}`.padStart(2, '0');

  return `${dd}/${mm}/${yyyy}, ${hours}:${minutes}`;
}

labelDate.textContent = dateformatter(new Date());

const displayMovements = function (accs, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? accs.movements.slice().sort((curr, next) => curr - next)
    : accs.movements;

  movs.forEach((element, i) => {
    const type = element > 0 ? 'deposit' : 'withdrawal';
    const date = dateformatter(new Date(accs.movementsDates[i])).slice(0, 10);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
             ${type}
          </div>
           <div class="movements__date">${date}</div>
          <div class="movements__value">₹${Math.abs(element).toFixed(2)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

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
  labelBalance.textContent = `₹${bal.toFixed(2)}`;
};

const displaySummary = function (account) {
  const movements = account.movements;
  const interestOnDeposite = account.interestRate;
  const deposites = movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `₹${deposites.toFixed(2)}`;

  const withdrawal = movements
    .filter(mov => mov < 0)
    .reduce((acc, curr, i, arr) => {
      // console.log(arr,acc,curr);
      return acc + curr;
    }, 0);
  labelSumOut.textContent = `₹${Math.abs(withdrawal).toFixed(2)}`;

  const interest = movements
    .filter(deposite => deposite > 0)
    .map(deposite => (deposite * interestOnDeposite) / 100)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `₹${interest.toFixed(2)}`;
};

const renderUI = function (acc) {
  //display movements
  displayMovements(acc);

  //display balance
  displayTotalBalance(acc);

  //display summary
  displaySummary(acc);
};

let activeAccount;

//login validation
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent default behaviour of login form
  activeAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (activeAccount?.pin === Number(inputLoginPin.value)) {
    //display welcome message
    labelWelcome.textContent = `Welcome back, ${
      activeAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 'unset';
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    renderUI(activeAccount);
  }
});

//sort button functionality
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(activeAccount, (sorted = !sorted));
});

//transfer amount 
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
    //do actual transfer
    activeAccount.movements.push(-amtTransfer);
    receiverAcc.movements.push(amtTransfer);

    //add transfer date
    activeAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    renderUI(activeAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

// grant loan condition--> if their is atleast1 deposite with 10%of loan amt
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmt = Math.floor(inputLoanAmount.value);
  const canGrantLoan = activeAccount.movements.some(
    move => move >= loanAmt * 0.1
  );
  if (loanAmt > 0 && canGrantLoan) {
    //take loan from bank
    activeAccount.movements.push(loanAmt);

    //add loan date
    activeAccount.movementsDates.push(new Date().toISOString());

    renderUI(activeAccount);
  }
  inputLoanAmount.value = '';
});

//close account 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    activeAccount.userName === inputCloseUsername.value &&
    activeAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === activeAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

// Get the modal
var modal = document.getElementById('myModal');

// Get the main container and the body
var body = document.getElementsByTagName('body');
var container = document.getElementById('myContainer');

// Get the open button
var tnC = document.getElementById('tnC');

// Get the close button
var close = document.getElementById('closeModal');

// Open the modal
tnC.onclick = function () {
  modal.className = 'Modal is-visuallyHidden';
  setTimeout(function () {
    body.className = 'MainContainer is-blurred';
    modal.className = 'Modal';
    body.style.background = 'rgba(100, 100, 100, 0.5)';
  }, 100);
};

// Close the modal
close.onclick = function () {
  modal.className = 'Modal is-hidden is-visuallyHidden';
  body.className = '';
  body.className = 'MainContainer';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.className = 'Modal is-hidden';
    body.className = '';
  }
};
