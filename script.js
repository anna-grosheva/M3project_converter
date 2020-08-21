let inputValue = document.querySelector('.currency__input-value');
let exRateTo = document.querySelector('.to .currency__rate');
let currActiveTo = document.querySelector('.to .currency__active');
let currActiveFrom = document.querySelector('.from .currency__active');


//проверка на символ при вводе
inputValue.addEventListener('keyup', (event) => {
    if (!(event.keyCode >= 48 && event.keyCode <= 57) && (event.keyCode !== 188) && (event.keyCode !== 190) && (event.keyCode !== 8)) {
        inputValue.value = inputValue.value.replace(inputValue.value[inputValue.value.length - 1], '');
    } else if (event.keyCode === 188) {
        inputValue.value = inputValue.value.replace(',', '.');
    } 
});

//запрос к серверу
function enquiry() {
    fetch('https://api.ratesapi.io/api/latest?base=USD&symbols=RUB')
    .then(response => response.json())
    .then(data => {
        inputValue.addEventListener('focus', () => {
            exRateTo.innerText = `1 ${currActiveTo.innerText} = ${data.rates.RUB.toFixed(4)} ${currActiveFrom.innerText}`;
        })
    })
}
enquiry();

