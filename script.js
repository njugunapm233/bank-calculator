'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Peter Njuguna',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Davis Kosgei',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} Ksh</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);
const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} Ksh`;
};
// calDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} Ksh`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} Ksh`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${Math.floor(interest)} Ksh`;
};
// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts); //stw
const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submiting
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

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // update Ui
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
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update Ui
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Deleted');
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // delete account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
const arr = Array.from(
  { length: 100 },
  (cur, i) => Math.random(Math.round(i + 1)) * 100
);

console.log(arr);
*/

/*
const owners = ['peters', 'ann', 'precious', 'hannah'];
console.log(owners.sort());

// numbers
console.log(movements);

// return <0, A,B (keep order)
// return >0,B,A (switch order)

const sortArr = movements.sort((a, b) => a - b);
console.log(sortArr);
*/
/*
// flat
const arr = [[1, 2, 3], [4, 5, 6], 8, 9];
console.log(arr.flat());
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 8, 9];
console.log(arrDeep.flat(2));

// map
const accountMovements = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, arr) => acc + arr, 0);
console.log(accountMovements);
// every

*/

/*
// Find
const search = movements.find(mov => mov < 0);
console.log(search);

const account = accounts.find(acc => acc.owner === 'Jonas Schmedtmann');
console.log(account);
*/
/*
// pipeline
const kshToUSd = 0.01;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * kshToUSd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

// maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/
/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);
*/

/////////////////////////////////////////////////
// const euroToUsd = 1.1;
// const movementUsd = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements);
// console.log(movementUsd);

// const movementsDescription = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     console.log(`Transaction ${i + 1}: You have deposited ${mov}`);
//   } else {
//     console.log(`Transaction ${i + 1}: You have withdraw ${Math.abs(mov)}`);
//   }
// });
/*
// array methods
let arr = ['a', 'b', 'c', 'd', 'e'];
// slice
console.log(arr.slice(1, 2));
console.log(arr.slice(1, 4));
// splice
console.log(arr.splice(1, 2));
console.log(arr);
// reverse
const arr2 = ['f', 'g', 'h', 'i', 'j'];
console.log(arr2.reverse());
console.log(arr2);
// concat
const letters = arr.concat(arr2);
console.log(letters);
// join
console.log(letters.join(' -- '));
*/

/*
// ForEach
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let balance = 0;
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Transaction ${i + 1}: You have deposited ${movement}`);
  } else {
    console.log(
      `Transaction ${i + 1}: You have withdraw ${Math.abs(movement)}`
    );
  }
}
console.log('***********************');
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Transaction ${i + 1}: You have deposited ${movement}`);
  } else {
    console.log(
      `Transaction ${i + 1}: You have withdraw ${Math.abs(movement)}`
    );
  }
});
*/

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} : ${value} `);
});

const currencieSpec = new Set(['Ksh', 'Tsh', '$', 'EUR', 'EUR']);
currencieSpec.forEach(function (value, key, set) {
  console.log(`${key} : ${value} `);
});
*/

/*
//Challenge 1
const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);

  console.log(dogsJuliaCorrected);
  const dogsRemain = [...dogsJuliaCorrected, ...dogsKate];
  console.log(dogsRemain);
  dogsRemain.forEach(function (mov, i) {
    const check =
      mov > 3
        ? `Dog number ${i + 1} is an adult, and is ${mov} years old`
        : `Dog number ${i + 1} is still a puppy `;
    console.log(check);
  });
};
checkDogs(dogsJulia, dogsKate);
*/

/*
// challenge 2
const data = [5, 2, 4, 1, 15, 8, 3];
let humanAge = [];
let realage = 0;

const calcAverageHumanAge = function (ages) {
  const calcAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(calcAge);
  const adults = calcAge.filter(age => age >= 18);
  console.log(adults);
  const avg = adults.reduce((acc, el) => acc + el, 0) / adults.length;
  console.log(avg);

  // const avg = a;
};
calcAverageHumanAge(data);
*/

/*
// Challenge
const calcAverageHumanAge = function (ages) {
  const humanYear = ages
    .map(age => {
      return age <= 2 ? 2 * age : 16 + age * 4;
    })
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(humanYear);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/

// final challenge
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

console.log(dogs);

dogs.forEach(mov => (mov.recFood = Math.trunc(mov.weight ** 0.75 * 28)));
console.log(dogs);

const searchSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah dog is eating too${
    searchSarah.curFood > searchSarah.recFood ? 'much' : 'little'
  }`
);

const ownerEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownerEatTooMuch);

const ownerEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownerEatTooLittle);

console.log(`${ownerEatTooMuch.join(' and ')}'s dogs eat too much!"\n
${ownerEatTooLittle.join(' and ')}'s dogs eat too little!`);

const eatExact = dogs.some(dog => dog.curFood === dog.recFood);

console.log(eatExact);

const okayFood = dogs.some(
  dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
);
console.log(okayFood);

const dogSort = dogs
  .slice()
  .sort((a, b) => a.recFood - b.recFood)
  .flatMap(dog => dog.recFood);
console.log(dogSort);
