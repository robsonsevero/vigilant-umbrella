const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

let current = '0';
let previous = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  resultEl.textContent = current;
}

function setExpression(text) {
  expressionEl.textContent = text;
}

function inputNumber(value) {
  if (shouldResetScreen) {
    current = value;
    shouldResetScreen = false;
  } else {
    current = current === '0' ? value : current + value;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetScreen) {
    current = '0.';
    shouldResetScreen = false;
    updateDisplay();
    return;
  }
  if (!current.includes('.')) {
    current += '.';
    updateDisplay();
  }
}

function toggleSign() {
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function clear() {
  current = '0';
  previous = '';
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
  setExpression('');
}

function setOperator(op) {
  if (operator && !shouldResetScreen) {
    calculate();
  }
  previous = current;
  operator = op;
  shouldResetScreen = true;

  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  setExpression(`${previous} ${symbols[op]}`);
}

function calculate() {
  if (!operator || !previous) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      result = b !== 0 ? a / b : 'Error';
      break;
  }

  setExpression(`${previous} ${symbols[operator]} ${current} =`);

  current = result === 'Error' ? 'Error' : String(parseFloat(result.toFixed(10)));
  operator = null;
  previous = '';
  shouldResetScreen = true;
  updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'number':   inputNumber(value); break;
    case 'decimal':  inputDecimal(); break;
    case 'operator': setOperator(value); break;
    case 'equals':   calculate(); break;
    case 'clear':    clear(); break;
    case 'sign':     toggleSign(); break;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') setOperator('+');
  else if (e.key === '-') setOperator('-');
  else if (e.key === '*') setOperator('*');
  else if (e.key === '/') { e.preventDefault(); setOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clear();
  else if (e.key === 'Backspace') {
    if (current.length > 1) {
      current = current.slice(0, -1);
    } else {
      current = '0';
    }
    updateDisplay();
  }
});
