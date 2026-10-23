/**
 * Motor de cálculo moderno e seguro para a calculadora
 */

// Formata número com precisão adequada para visor
export function formatarNumero(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Erro';
  if (!isFinite(num)) return 'Indefinido';
  
  // Limita a 10 casas decimais para evitar 0.30000000000000004
  const arredondado = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
  
  // Se for muito grande ou muito pequeno, usa notação científica
  if (Math.abs(arredondado) >= 1e12 || (Math.abs(arredondado) > 0 && Math.abs(arredondado) < 1e-7)) {
    return arredondado.toExponential(6).replace('e+', 'e');
  }
  
  return String(arredondado);
}

// Prepara a expressão para cálculo substituindo símbolos visuais e tratando porcentagem
export function prepararExpressao(expr) {
  if (!expr || typeof expr !== 'string') return '';

  let limpa = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  // Trata porcentagens: Ex: '100 + 10%' -> '100 + (100 * 0.1)' ou '50 * 20%' -> '50 * (20 / 100)'
  limpa = limpa.replace(/(\d+(\.\d+)?)\s*([+\-])\s*(\d+(\.\d+)?)%/g, '($1 $3 ($1 * ($4 / 100)))');
  limpa = limpa.replace(/(\d+(\.\d+)?)%/g, '($1 / 100)');

  // Fecha parênteses não fechados
  const abertos = (limpa.match(/\(/g) || []).length;
  const fechados = (limpa.match(/\)/g) || []).length;
  if (abertos > fechados) {
    limpa += ')'.repeat(abertos - fechados);
  }

  // Remove operadores pendentes no final para cálculo
  limpa = limpa.trim().replace(/[+\-*/.]+$/, '');

  return limpa;
}

// Avalia a expressão com segurança
export function calcular(expressao) {
  if (!expressao || !expressao.trim()) return '';

  const preparada = prepararExpressao(expressao);
  if (!preparada) return '';

  // Validação estrita de segurança
  if (!/^[0-9+\-*/().\s]+$/.test(preparada)) {
    return 'Erro';
  }

  // Detecta divisão explícita por zero
  if (/\/\s*0(?![0-9.])/.test(preparada)) {
    return 'Indefinido';
  }

  try {
    const res = Function(`"use strict"; return (${preparada})`)();
    return formatarNumero(res);
  } catch (err) {
    return 'Erro';
  }
}

// Calcula preview em tempo real (não mostra erro enquanto digita)
export function calcularPreview(expressao) {
  if (!expressao || !expressao.trim()) return '';
  
  // Se for apenas um número, não precisa de preview separado
  if (/^-?[\d.]+$/.test(expressao.trim())) return '';

  const res = calcular(expressao);
  if (res === 'Erro' || res === 'Indefinido') return '';
  return res;
}

// Inverte o sinal (+/-) do último número na expressão
export function inverterSinal(expr) {
  if (!expr) return '-';

  // Procura pelo último bloco de número (podendo já ter sinal negativo)
  const regex = /(-?\d+(\.\d+)?)$/;
  const match = expr.match(regex);

  if (match) {
    const ultimoNum = match[0];
    const index = match.index;
    const invertido = ultimoNum.startsWith('-') ? ultimoNum.slice(1) : '-' + ultimoNum;
    return expr.slice(0, index) + invertido;
  }

  return expr + '-';
}

// Trata inserção inteligente de parênteses
export function inserirParenteses(expr) {
  if (!expr) return '(';

  const abertos = (expr.match(/\(/g) || []).length;
  const fechados = (expr.match(/\)/g) || []).length;
  const ultimoChar = expr.trim().slice(-1);

  // Se o último caractere for operador ou abre parêntese, abre outro
  if (['+', '−', '×', '÷', '(', ''].includes(ultimoChar)) {
    return expr + '(';
  }

  // Se houver parênteses abertos para fechar e o último char for número ou fecha parêntese
  if (abertos > fechados && (/[\d.]/.test(ultimoChar) || ultimoChar === ')')) {
    return expr + ')';
  }

  // Caso padrão após número: multiplicação implícita com abre parêntese
  return expr + '×(';
}

