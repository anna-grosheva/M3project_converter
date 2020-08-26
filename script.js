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
const regexp = /^[0-9\.]+$/;


//проверка на символ при вводе и запросы к серверу с фокуса
inputValues.forEach((inputValue) => {
    inputValue.addEventListener('keyup', (event) => {
        inputValue.value = inputValue.value.replace(',', '.');
        if (!regexp.test(inputValue.value)) {
            inputValue.value = inputValue.value.replace(inputValue.value[inputValue.value.length - 1], '');
        } 
    });
    inputValue.addEventListener('focus', (event) => {
        if (currencyButtonsFrom[currencyButtonsFrom.length - 1].classList.contains('currency__active') && currencyButtonsTo[currencyButtonsFrom.length - 1].classList.contains('currency__active')) {
            enquiry('change');
        } else {
            enquiry('click');
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
currencyButtonsFrom.forEach((currencyButton, index) => {
    if (index < (currencyButtonsFrom.length - 1)) {
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
    if (index < (currencyButtonsTo.length - 1)) {
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
currencyButtonsFrom[currencyButtonsFrom.length - 1].addEventListener('change', () => {
    activeButtonFrom(currencyButtonsFrom.length - 1);
    enquiry(event.type);
});
currencyButtonsTo[currencyButtonsTo.length - 1].addEventListener('change', () => {
    activeButtonTo(currencyButtonsTo.length - 1);
    enquiry(event.type);
});


// поменять местами
let interchangeButton = document.querySelector('.interchange');
interchangeButton.addEventListener('click', () => {
    let currActiveTo = document.querySelector('.to .currency__active');
    let currActiveFrom = document.querySelector('.from .currency__active');
    for (let i = 0; i < (currencyButtonsFrom.length - 1); i++) {
        for (let j = 0; j < (currencyButtonsFrom.length - 1); j++) {
            if (currencyButtonsFrom[i].innerText === currActiveTo.innerText) {
                if (currencyButtonsTo[j].innerText === currActiveFrom.innerText) {
                    activeButtonFrom(i);
                    activeButtonTo(j);
                    enquiry(event.type);
                }  else if (currencyButtonsFrom[currencyButtonsFrom.length - 1].classList.contains('currency__active')) {
                    selectTo.value = selectFrom.value;
                    activeButtonTo(currencyButtonsFrom.length - 1);
                    activeButtonFrom(i);
                    enquiry(event.type);
                }    
            }
            if (currencyButtonsTo[currencyButtonsFrom.length - 1].classList.contains('currency__active')) {
                if (currencyButtonsTo[j].innerText === currActiveFrom.innerText) {
                    selectFrom.value = selectTo.value;
                    activeButtonFrom(currencyButtonsFrom.length - 1);
                    activeButtonTo(j);
                    enquiry(event.type);
                }
            }
        }
    }
    if (currencyButtonsFrom[currencyButtonsFrom.length - 1].classList.contains('currency__active') && currencyButtonsTo[currencyButtonsFrom.length - 1].classList.contains('currency__active')) {
        let temp = selectFrom.value;
        selectFrom.value = selectTo.value;
        selectTo.value = temp;
        enquiry('change');
    }
});


// функция запроса к серверу
function enquiry(param) {
    let A, B;
    for (let i = 0; i < currencyButtonsFrom.length - 1; i++) {
        for (let j = 0; j < currencyButtonsFrom.length - 1; j++) {
            if (currencyButtonsFrom[i].classList.contains('currency__active') && currencyButtonsTo[j].classList.contains('currency__active') && (param == 'click')) {
                A = currActiveFrom.innerText;
                B = currActiveTo.innerText;
            } else if (currencyButtonsFrom[currencyButtonsFrom.length - 1].classList.contains('currency__active') && currencyButtonsTo[j].classList.contains('currency__active') && (param == 'change' || param == 'click')) {
                A = selectFrom.value;
                B = currActiveTo.innerText;
            } else if (currencyButtonsFrom[i].classList.contains('currency__active') && currencyButtonsTo[currencyButtonsFrom.length - 1].classList.contains('currency__active') && (param == 'change' || param == 'click')) {
                A = currActiveFrom.innerText;
                B = selectTo.value;
            } else if (currencyButtonsFrom[currencyButtonsFrom.length - 1].classList.contains('currency__active') && currencyButtonsTo[currencyButtonsFrom.length - 1].classList.contains('currency__active') && param == 'change') {
                A = selectFrom.value;
                B = selectTo.value;
            }
        }   
    }
    
    let getPromise = fetch('https://api.ratesapi.io/api/latest?base=' + B + '&symbols=' + A);
    
    let waiting = setTimeout(() => {
        loading.style.display = 'block';
    }, 500)

    function hideLoading() {
        loading.style.display = 'none';
        clearTimeout(waiting);
    }

    getPromise
    .then(response => response.json())
    .then(data => {
        hideLoading();
        inputValues.forEach((inputValue) => {
            exRateFrom.innerText = `1 ${A} = ${+(1 / data.rates[A]).toFixed(4)} ${B}`;
            exRateTo.innerText = `1 ${B} = ${+data.rates[A].toFixed(4)} ${A}`;

            inputValueTo.value = +(inputValueFrom.value / data.rates[A]).toFixed(4);

            inputValueFrom.addEventListener('input', () => {
                if (inputValueFrom.value >= 0) {
                    inputValueTo.value = +(inputValueFrom.value / data.rates[A]).toFixed(4);
                }   
            });
            inputValueTo.addEventListener('input', () => {
                if (inputValueTo.value >= 0) {
                    inputValueFrom.value = +(inputValueTo.value * data.rates[A]).toFixed(4);
                }
            });
        });  
    })
    .catch((error) => {
        alert('Ошибка сервера или нет интернет-соединения');
        hideLoading();
    }); 
}
enquiry('click');
