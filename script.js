const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
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
  pin: 1111
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

const displayMovements = function(acc,sort=false){
  containerMovements.innerHTML=''
  let movs = sort ? acc.movements.slice().sort(function(a,b){
    return a-b
  }) : acc.movements
  movs.forEach(function(value,key){
    type = value > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[key])
    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear()
    const displayDate = `${day}/${month}/${year}`
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${key+1} ${type}</div>
          <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${value}€</div>
        </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}

const updateUI = function(){
  displayMovements(currentAccount)
  calDisplayBalance(currentAccount)
  calDisplaySummary(currentAccount)
}

const startLogOutTimer = function(){
  let time = 120
  const timer = setInterval(() => {
    let min = String(Math.trunc(time /60)).padStart(2,'0')
    let sec =String(time % 60).padStart(2,'0')
    labelTimer.textContent = `${min}:${sec}`
    
    if(time ===  0){
      clearInterval(timer)
      labelWelcome.textContent = ` Log in to get started `
      containerApp.style.opacity = 0
    }
    time--
    
  }, 1000);
  return timer
}

const calDisplayBalance = function(acc){
    acc.balance = acc.movements.reduce(function(acc,curr){
    
    return acc+curr
  },0)
  labelBalance.textContent = `${acc.balance}€`

}



const createUserNames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(function(name){
      return name[0]
    }).join('')
  })

}
createUserNames(accounts)


const calDisplaySummary = function(acc){
  const incomes = acc.movements.filter(function(mov){
    return mov>0
  }).reduce(function(acc,curr){
    return acc+curr
  },0)

  labelSumIn.textContent = `${incomes}€`

  const intrest = acc.movements.filter(function(mov){
    return mov>0
  }).map(function(mov){
    return mov/acc.interestRate*100
  }).reduce(function(acc,curr){
    return acc+curr
  })
  labelSumInterest.textContent = `${intrest}€`

  
  
  const out=acc.movements.filter(function(mov){
    return mov<0
  }).reduce(function(acc,curr){
    return acc+curr
  })
  labelSumOut.textContent = `${Math.abs(out)}€`
}


let currentAccount,timer

btnLogin.addEventListener('click',function(event){
    event.preventDefault()
    currentAccount = accounts.find(function(acc){
    return acc.username === inputLoginUsername.value
  })
  console.log(currentAccount)
  if(currentAccount?.pin===Number(inputLoginPin.value)){
    console.log("logged in")
    labelWelcome.textContent = `Have a Good Day ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100

    if(timer){
      clearInterval(timer)
    }
    timer =  startLogOutTimer()
    updateUI(currentAccount)

    inputLoginUsername.value = inputLoginPin.value = ''
  }
})

btnTransfer.addEventListener('click',function(e){
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const recieverAcc = accounts.find(function(acc){
    return acc.username === inputTransferTo.value
  })
  if(amount>0 && recieverAcc && amount<=currentAccount.balance && recieverAcc.username !== currentAccount.username){
      currentAccount.movements.push(-amount)
      recieverAcc.movements.push(amount)
      currentAccount.movementsDates.push(new Date())
      recieverAcc.movementsDates.push(new Date())
      updateUI(currentAccount)
      inputTransferAmount.value = ''
      inputTransferTo.value = ''

  }
  clearInterval(timer)
  timer = startLogOutTimer()
})

btnClose.addEventListener('click',function(e){
  e.preventDefault()
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(function(acc){
      return currentAccount.username === acc.username
    })
    accounts.splice(index,1)
    containerApp.style.opacity=0
    console.log(index)
  }
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)
  if(amount>0 && currentAccount.movements.some(function(mov){
    return mov >= amount*0.1
  })){
    setTimeout(function(){
        currentAccount.movements.push(amount)
        currentAccount.movementsDates.push(new Date())
        updateUI(currentAccount)
    },3000)
    
  }
  inputLoanAmount.value = ''
  clearInterval(timer)
  timer = startLogOutTimer()
}

)

let sorted = false
btnSort.addEventListener('click',function(e){
  e.preventDefault()
  displayMovements(currentAccount,!sorted)
  sorted = !sorted
})

const now = new Date()
const day = now.getDay()
const month = now.getMonth() + 1
const year = now.getFullYear()
const hour = now.getHours()
const min = now.getMinutes()

labelDate.textContent = `${day}/${month}/${year}, ${hour} hrs , ${min} min`