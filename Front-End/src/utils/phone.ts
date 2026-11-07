// Formata o telefone enquanto o cliente digita: (86) 99999-0000.
// Aceita tambem o codigo do pais: +55 (86) 99999-0000.
export function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '').slice(0, 13);
  let prefix = '';

  if (digits.length > 11 && digits.startsWith('55')) {
    prefix = '+55 ';
    digits = digits.slice(2);
  }

  if (digits.length === 0) {
    return prefix.trim();
  }
  if (digits.length <= 2) {
    return `${prefix}(${digits}`;
  }

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const splitAt = rest.length > 8 ? 5 : 4;
  const number = rest.length > splitAt ? `${rest.slice(0, splitAt)}-${rest.slice(splitAt)}` : rest;
  return `${prefix}(${ddd}) ${number}`;
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, '');
}
