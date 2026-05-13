const num1 = document.getElementById('num1');
const num2 = document.getElementById('num2');
const resultDiv = document.getElementById('result');

function calculate(operator) {
  const a = parseFloat(num1.value);
  const b = parseFloat(num2.value);

  if (isNaN(a) || isNaN(b)) {
    resultDiv.innerHTML = '<span class="error">Palun sisesta mõlemad arvud!</span>';
    return;
  }

  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      if (b === 0) {
        resultDiv.innerHTML = '<span class="error">Nulliga jagamine pole lubatud!</span>';
        return;
      }
      result = a / b;
      break;
  }

  resultDiv.textContent = `Tulemus: ${result.toFixed(2)}`;
}

document.getElementById('add').addEventListener('click', () => calculate('+'));
document.getElementById('sub').addEventListener('click', () => calculate('-'));
document.getElementById('mul').addEventListener('click', () => calculate('*'));
document.getElementById('div').addEventListener('click', () => calculate('/'));
