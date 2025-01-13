const visor = document.getElementById('visor');
let operacion = '0';

const caracteresPermitidos = /^[0-9+\-*/().]*$/;

const actualizarVisor = () => (visor.value = operacion || '0');

const agregar = (valor) => {
  if (caracteresPermitidos.test(valor)) {
    operacion = operacion === '0' || operacion === 'Error' ? valor : operacion + valor;
    actualizarVisor();
  }
};

const limpiar = () => {
  operacion = '0';
  actualizarVisor();
};

const borrar = () => {
  operacion = visor.value;
  if (operacion === 'Error')operacion = '0';
  else operacion = visor.value.slice(0, -1) || '0';
  actualizarVisor();
};

const calcular = async () => {
  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: operacion }),
    });
    const { result } = await response.json();
    operacion = result || 'Error';
  } catch {
    operacion = 'Error';
  }
  actualizarVisor();
};

visor.addEventListener('input', () => {
  if (caracteresPermitidos.test(visor.value)) {
    operacion = visor.value;
  } else {
    actualizarVisor();
  }
});

visor.addEventListener('focus', () => {
  if (visor.value === '0' || visor.value === '.') {
    operacion = '';
    actualizarVisor();
  }
});

visor.addEventListener('blur', () => {
  if (!visor.value) {
    operacion = '0';
    actualizarVisor();
  }
});

visor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault(), calcular();
  if (e.key === 'Delete') e.preventDefault(), limpiar();
  if (!caracteresPermitidos.test(e.key) && !['ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.key)) {
    e.preventDefault();
  }
});

// Initialize display
actualizarVisor();
