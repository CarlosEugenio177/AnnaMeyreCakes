// Gera o "Pix copia e cola" (BR Code estatico) no padrao EMV do Banco Central.
// Nao depende de banco ou gateway: o codigo leva a chave Pix da loja e o valor,
// e o cliente paga direto pelo app do banco. Sem intermediarios nem taxas.

export type PixPayloadInput = {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txid?: string;
};

export function buildPixPayload(input: PixPayloadInput): string {
  const merchantAccount = field('00', 'br.gov.bcb.pix') + field('01', input.key.trim());
  const txid = sanitizeTxid(input.txid);

  const payload = [
    field('00', '01'),
    field('26', merchantAccount),
    field('52', '0000'),
    field('53', '986'),
    input.amount !== undefined ? field('54', input.amount.toFixed(2)) : '',
    field('58', 'BR'),
    field('59', sanitizeText(input.merchantName, 25)),
    field('60', sanitizeText(input.merchantCity, 15)),
    field('62', field('05', txid)),
    '6304',
  ].join('');

  return payload + crc16(payload);
}

function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

// Nome e cidade: apenas ASCII, sem acentos, dentro do limite do padrao.
function sanitizeText(value: string, maxLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .slice(0, maxLength);
}

// O identificador da transacao aceita ate 25 caracteres alfanumericos.
function sanitizeTxid(value?: string): string {
  const txid = (value ?? '').replace(/[^A-Za-z0-9]/g, '').slice(0, 25);
  return txid || '***';
}

// CRC16-CCITT (polinomio 0x1021, valor inicial 0xFFFF), exigido no campo 63.
function crc16(payload: string): string {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}
