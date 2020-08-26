let inputValues = document.querySelectorAll('.currency__input-value');
let inputValueFrom = document.querySelector('.from .currency__input-value');
let inputValueTo = document.querySelector('.to .currency__input-value');
let exRateTo = document.querySelector('.to .currency__rate');
let exRateFrom = document.querySelector('.from .currency__rate');
let currActiveTo = document.querySelector('.to .currency__active');
let currActiveFrom = document.querySelector('.from .currency__active');
let currencyButtonsFrom = document.querySelectorAll('.from .currency__buttons li');
let currencyButtonsTo = document.querySelectorAll('.to .currency__buttons li');
let selectFrom = document.querySelector('.from select');
let selectTo = document.querySelector('.to select');
let loading = document.querySelector('.loading');


//проверка на символ при вводе
inputValues.forEach((inputValue) => {
    inputValue.addEventListener('keyup', (event) => {
        if (!(event.keyCode >= 48 && event.keyCode <= 57) && (event.keyCode !== 188) && (event.keyCode !== 190) && (event.keyCode !== 8)) {
            inputValue.value = inputValue.value.replace(inputValue.value[inputValue.value.length - 1], '');
        } else if (event.keyCode === 188) {
            inputValue.value = inputValue.value.replace(',', '.');
        } 
    });
});


// функции для назначения активной кнопки
function activeButtonFrom(index) {
    currActiveFrom.classList.remove('currency__active');
    currencyButtonsFrom[index].classList.add('currency__active');
    currActiveFrom = currencyButtonsFrom[index];
}
function activeButtonTo(index) {
    currActiveTo.classList.remove('currency__active');
    currencyButtonsTo[index].classList.add('currency__active');
    currActiveTo = currencyButtonsTo[index];
}


// функция, если валюты равны
function sameCurrencies() {
    exRateFrom.innerText = `1 ${currActiveFrom.innerText} = 1 ${currActiveTo.innerText}`;
    exRateTo.innerText = exRateFrom.innerText;
    inputValueTo.value = inputValueFrom.value;
    inputValueFrom.addEventListener('input', () => {
        inputValueTo.value = inputValueFrom.value;
    });
    inputValueTo.addEventListener('input', () => {
        inputValueFrom.value = inputValueTo.value;
    });
}


// переключение кнопок валют
currencyButtonsFrom.forEach((currencyButton,index) => {
    if (index < 4) {
        currencyButtonsFrom[index].addEventListener('click', () => {
            activeButtonFrom(index);
            if (currActiveFrom.innerText !== currActiveTo.innerText) {
                enquiry(event.type);
            } else {
                sameCurrencies();
            }
        });
    }  
});
currencyButtonsTo.forEach((currencyButton, index) => {
    if (index < 4) {
        currencyButtonsTo[index].addEventListener('click', () => {
            activeButtonTo(index);
            if (currActiveTo.innerText !== currActiveFrom.innerText) {
                enquiry(event.type);
            } else {
                sameCurrencies();
            }
        });
    }
});
currencyButtonsFrom[4].addEventListener('change', () => {
    activeButtonFrom(4);
    enquiry(event.type);
});
currencyButtonsTo[4].addEventListener('change', () => {
    activeButtonTo(4);
    enquiry(event.type);
});


// поменять местами
let interchangeButton = document.querySelector('.interchange');
interchangeButton.addEventListener('click', () => {
    let currActiveTo = document.querySelector('.to .currency__active');
    let currActiveFrom = document.querySelector('.from .currency__active');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (currencyButtonsFrom[i].innerText === currActiveTo.innerText) {
                if (currencyButtonsTo[j].innerText === currActiveFrom.innerText) {
                    activeButtonFrom(i);
                    activeButtonTo(j);
                    enquiry(event.type);
                }  else if (currencyButtonsFrom[4].classList.contains('currency__active')) {
                    selectTo.value = selectFrom.value;
                    activeButtonTo(4);
                    activeButtonFrom(i);
                    enquiry(event.type);
                }    
            }
            if (currencyButtonsTo[4].classList.contains('currency__active')) {
                if (currencyButtonsTo[j].innerText === currActiveFrom.innerText) {
                    selectFrom.value = selectTo.value;
                    activeButtonFrom(4);
                    activeButtonTo(j);
                    enquiry(event.type);
                }
            }
        }
    }
    if (currencyButtonsFrom[4].classList.contains('currency__active') && currencyButtonsTo[4].classList.contains('currency__active')) {
        let temp = selectFrom.value;
        selectFrom.value = selectTo.value;
        selectTo.value = temp;
        enquiry('change');
    }
});


// функция запроса к серверу
function enquiry(param) {
    let A, B;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (currencyButtonsFrom[i].classList.contains('currency__active') && currencyButtonsTo[j].classList.contains('currency__active') && param == 'click') {
                A = currActiveFrom.innerText;
                B = currActiveTo.innerText;
            } else if (currencyButtonsFrom[4].classList.contains('currency__active') && currencyButtonsTo[j].classList.contains('currency__active') && (param == 'change' || param == 'click')) {
                A = selectFrom.value;
                B = currActiveTo.innerText;
            } else if (currencyButtonsFrom[i].classList.contains('currency__active') && currencyButtonsTo[4].classList.contains('currency__active') && (param == 'change' || param == 'click')) {
                A = currActiveFrom.innerText;
                B = selectTo.value;
            } else if (currencyButtonsFrom[4].classList.contains('currency__active') && currencyButtonsTo[4].classList.contains('currency__active') && param == 'change') {
                A = selectFrom.value;
                B = selectTo.value;
            }
        }   
    }
    
    let getPromise = fetch('https://api.ratesapi.io/api/latest?base=' + B + '&symbols=' + A);
    
    let waiting = setTimeout(() => {
        loading.style.display = 'block';
    }, 500)
    
    getPromise
    .then(loading.style.display = 'none')
    .then(clearTimeout(waiting))
    .then(response => response.json())
    .then(data => {
        inputValues.forEach((inputValue) => {
            exRateFrom.innerText = `1 ${A} = ${+(1 / data.rates[A]).toFixed(4)} ${B}`;
            exRateTo.innerText = `1 ${B} = ${+data.rates[A].toFixed(4)} ${A}`;

            inputValueTo.value = +(inputValueFrom.value / data.rates[A]).toFixed(4);

            inputValueFrom.addEventListener('input', () => {
                if (inputValueFrom.value > 0) {
                    inputValueTo.value = +(inputValueFrom.value / data.rates[A]).toFixed(4);
                } else {
                    inputValueTo.value = '';
                }   
            });
            inputValueTo.addEventListener('input', () => {
                inputValueFrom.value = +(inputValueTo.value * data.rates[A]).toFixed(4);
            });
        });  
    })
    .catch((error) => {
        alert('Ошибка сервера или нет интернет-соединения');
    }); 
};
enquiry('click');
