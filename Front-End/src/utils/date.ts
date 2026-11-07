// Datas de entrega sao dias de calendario salvos como meia-noite UTC.
// Formatar em UTC evita que apareca o dia anterior no fuso do Brasil.
export function formatDeliveryDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}

// Data minima (AAAA-MM-DD, no fuso local) para o input de entrega.
export function getMinimumOrderDate(noticeDays = 3) {
  const date = new Date();
  date.setDate(date.getDate() + noticeDays);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
