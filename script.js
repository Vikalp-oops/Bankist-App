'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
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
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
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

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// Functions

const formattedDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  // const day = ` ${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattedDate(date, acc.locale);

    const formattedMovements = formatCur(mov, acc.locale, acc.currency);

    // new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">?${displayDate}</div>
        <div class="movements__value">${formattedMovements}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  const formattedMovements = formatCur(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = formattedMovements;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

//TIMER
const sattrtLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // IN each call , print the remaining tiime to the ui
    labelTimer.textContent = `${min}:${sec}`;

    //WHEN USER REACHES 0 SEC STOP THE TIMER AND LOG OUT THE USER
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    //WHEN USER REACHES 0 SEC STOP THE TIMER AND LOG OUT THE USER

    //decreae 1s
    time--;
  };

  //SET TIMER FOR 5 MIN
  let time = 100;

  //calling the timer every second

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//FAKED ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//EXPERIMENTING API
const now = new Date();
const option = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric', //can also write 'long of feburary and also 2-digit for 02 for feb
  year: 'numeric',
  weekday: 'long',
};
const local = navigator.language;
console.log(local);

labelDate.textContent = new Intl.DateTimeFormat(
  'en-IN',
  (local, option)
).format(now);

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //can also write 'long of feburary and also 2-digit for 02 for feb
      year: 'numeric',
      weekday: 'long',
    };
    // const local = navigator.language;
    // console.log(local);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = ` ${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //timer
    if (timer) clearInterval(timer);
    timer = sattrtLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = sattrtLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //adding loaN DATE
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = sattrtLogOutTimer();
    }, 10000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0);
console.log(0.1 + 0.2); //0.30000000000000004
console.log(0.1 + 0.2 === 0.3);

console.log(+'23'); //not string but number

//PARSING => FIND OUT NUMBER IN AN STRING but for this to work the string should start with a number ALSO ACEPTS A SSECOND ARGUMENTS WITH ACCE[TS THE BASE IN WHICH WE ARE CONVERTING ]

console.log(Number.parseInt('30px', 10)); //30
console.log(Number.parseInt('e45', 10)); //NaN
console.log(Number.parseFloat('2.5rem')); //2.5
console.log(Number.parseInt('2.4rem')); //2 only integar part

// checking nan

// console.log(Number.isNaN(20)); //false
// console.log(Number.isNaN('20x')); //false
// console.log(Number.isNaN(+'20x')); //true
// console.log(Number.isNaN(20 / 0)); //false

//checking the number is finite or not

console.log(Number.isFinite(20)); //true
console.log(Number.isFinite(20 / 0)); //false
console.log(Number.isFinite(+'20')); //true
console.log(Number.isFinite(+'20x')); //false

//checking is integar
console.log(Number.isInteger(23)); //t
console.log(Number.isInteger(23.0)); //t
console.log(Number.isInteger(23 / 0)); //f
*/
/*

//SQUARE ROOT
console.log(Math.sqrt(25)); //5
console.log(25 ** (1 / 2)); //5
console.log(8 ** (1 / 3));

//MAXIMUM VALUE
console.log(Math.max(23, 34, 54, 234)); //234
console.log(Math.max(23, 34, 45, '56')); //56 max automattically do type coresion
console.log(Math.max(23, 445, '45hy', 343)); //NaN but will not do parsing

//MINIMUM
console.log(Math.min(23, 34, 54, 234)); //23

//some constant
console.log(Math.PI);
//CALCULATE RADIUS
console.log(Math.PI * Number.parseFloat('10px') ** 2);

//GENERATING RANDOM NUMBERS
console.log(Math.random()); //generate random number between 0 to 1
//dice
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1 + min);
//math.random value dega min aur max ke bij me aur (max * min ) se multiply ke baad 0 se (max*min) ke bich me value dega fir dono side moin add kar dege toph value max aur min ke bich mai aa jayegi
// 0...1(math.trunc) => 0... (max-min)[max-min se multiply]=> 0+min.....max -min +min gives a range min to max
console.log(randomInt(10, 100));

//ROUNDING INTEGAR
console.log(Math.trunc(23.8786));

//rounding to nearest number

console.log(Math.round(23.3)); //23
console.log(Math.round(23.9)); //24

////ROUNDING DOWM
console.log(Math.ceil(23.3)); //24
console.log(Math.ceil(23.9)); //24

//floor
console.log(Math.floor(23.3)); //23
console.log(Math.floor(23.9)); //23
//floor and trunc both looks same but works differently for negitive values
console.log(Math.trunc(-23.3)); //-23
console.log(Math.floor(-23.3)); //-24

//rounding decimals this will always return string
console.log((2.7).toFixed(0)); //0 defines number of decimal positions we want
console.log((2.7).toFixed(3)); //2.700
console.log(+(2.345).toFixed(2)); //2.35  + converts it back to number
*/
/*

//REMAINDER OPERATOR => used to do thing to do thing n times or nth time whatever it is 1
console.log(5 % 2); //1

console.log(8 % 3); //2

//EVEN NUMBER
console.log(6 % 2);
const evenOrNot = function (num) {
  if (num % 2 === 0) {
    console.log(`${num} is EVEN`);
  } else {
    console.log(`${num} is ODD`);
  }
};
console.log(evenOrNot(3));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orangered';
      if (i % 3 === 0) row.style.backgroundColor = 'blue';
    }
  });
});
*/
/*

//NUMERIC SEPARTOR => js will just ignore these _ and make it easier to read and understand the value (to figure out its milloin billion or how many billions) ONLY PUT IN BETWEEN THE NUMBERS NOT AFTER . AND OTHER SHIT AND NOT PUT 2 BACK AND BACK

const diameter = 287_000_000_000;
console.log(diameter); //287000000000

const price = 345_67;
console.log(price);

const pi = 3.14_45; //not 3._14
console.log(pi);

console.log(Number('234_456')); //not like this gives NaN
*/
/*

//BIGINT
console.log(2 ** 53 - 1); //Biggest number javascript can represent safely(preciously)
console.log(Number.MAX_SAFE_INTEGER);
//to solve BIGINT IS tntroduced
console.log(4523543583678421658476936783679143n); //n at the end converts the number into a bigint number
console.log(BigInt(2445345545676784565364657));

//OPERATIONS
console.log(1000n + 231435n);
console.log(353635645724313465n * 10000000000000n); //3536356457243134650000000000000n

const hude = 2452243654765756n;
const num = 25;
// console.log(hude * num);
//cannot mix bigint with natural number so error
const hude2 = 2452243654765756n;
const num2 = 25;
console.log(hude2 * BigInt(num2)); //61306091369143900n

console.log(20n > 15); //true
console.log(20n === 20); //false fair enough
console.log(20n == 20); //true

console.log(hude + 'is a really big !!!');

console.log(10n / 3n);//3 ignore the decimal parts
console.log(10 / 3);//3.33
*/
/*

//CREATING A DATE
//1)
const now = new Date();
console.log(now);

//2))based om string

console.log(new Date('Feb 28 2024 02:03:35')); //make a date from it
console.log(new Date('March 9, 2004'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2024, 10, 23, 15, 23, 5)); //Sat Nov 23 2024 15:23:05
//MONTH IN JS ARE ZERO INDEX NOVEMBER IS ACTUALLY 11 MONTH BUT HERE 10
console.log(new Date(2024, 10, 31, 15, 23, 5)); //Sun Dec 01 2024 15:23:05
//JS ALSO AUTO DETECT THE NUMBER OF DAUS IN MONTH NOVEMBER NOT 31 SO 1 DECEMBER

//3) MILLIseconds after JAN 1 1970
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));


//WORKING WITHNDATES

const future = new Date(2024, 10, 31, 15, 23, 5);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.toISOString()); //2024-12-01T09:53:05.000Z

console.log(future.getTime()); //1733046785000 millisecond passed after jan 1 1970

console.log(Date.now()); //current timestamp (time after that jan 1 1970)

future.setFullYear(2025);
console.log(future);
*/
/*
//OPERATION WITH DATES
const future = new Date(2024, 10, 31, 15, 23, 5);
console.log(Number(future)); //1733046785000 miilisec

const daysPassed = (date1, date2) =>
  Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
console.log(daysPassed(new Date(2020, 3, 14), new Date(2020, 4, 14))); //

const num = 423225.46;

const options = {
  style: 'currency', //types unit types and currency
  unit: 'mile-per-hour',
  currency: 'INR',
  // useGrouping: false,
};

console.log(new Intl.NumberFormat('en-US', options).format(num));
console.log(new Intl.NumberFormat('hi-IN', options).format(num));
*/
/*
//SET TIMEOUT

// setTimeout(() => console.log('here is your pasta'), 3000);
// console.log('WAITING.....');
// setTimeout(
//   (ing1, ing2) => console.log(`here is your pasta with ${ing1} and ${ing2}`),
//   3000,
//   'olives',
//   'jalepinos'
// ); //time ke  baad jo declare karenge vo argument honge function ke liye 3 argument for the settimeout functoin is the 1st parameter forthe function
// console.log('WAITING.....');

// CANCELLING THE TIMEOUT

const ingredients = ['olives', 'spinach'];
const pastaTimer = setTimeout(
  (ing1, ing2) => console.log(`here is your pasta with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('waiting..');
//to cancel
if (ingredients.includes('spinach')) clearTimeout(pastaTimer); //cleartimemout ke andar naam timeout ka
// SET INTERVAL => REPEATING AFTER A CERTAIN PERIOD OF ITME
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 2000);
setInterval(function () {
  const now = new Date();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);
  const sec = `${now.getSeconds()}`.padStart(2, 0);
  console.log(`${hour} : ${min} : ${sec}`);
}, 1000);
*/

// //YAAR KA APP
// let currentAccount;

// //CREATING USERNAME

// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUsernames(accounts);

// //EVENT HANDLERS
// btnLogin.addEventListener('click', function (e) {
//   e.preventDefault();
//   currentAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value
//   );
//   console.log(currentAccount);
//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     //display ui and welcome message
//     labelWelcome.textContent = ` Welcome Back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;
//     containerApp.style.opacity = 100;
//   }
// });

// //DISPLAY MOVEMENTS
// const displayMovements = function (movements) {
//   containerMovements.innerHTML = '';
//   movements.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__value">${mov}</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };
// displayMovements(account1.movements);

// //display balance
// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = acc.balance;
// };
// calcDisplayBalance(account1);
