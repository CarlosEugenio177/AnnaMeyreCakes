import { Check, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { currency } from '../../utils/pricePreview';

type PixPaymentProps = {
  code: string;
  amount: number;
  compact?: boolean;
};

export function PixPayment({ code, amount, compact = false }: PixPaymentProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(code, { margin: 1, width: 360, color: { dark: '#2A1712', light: '#FFFFFF' } })
      .then((url) => active && setQrDataUrl(url))
      .catch(() => active && setQrDataUrl(undefined));
    return () => {
      active = false;
    };
  }, [code]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Sem permissao de clipboard: seleciona o texto para o cliente copiar manualmente.
      document.getElementById('pix-code')?.focus();
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-butter bg-[#FFFBF2] p-5" data-testid="pix-payment">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">Entrada via Pix</p>
          <p className="font-display text-3xl text-choco">{currency.format(amount)}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Sem taxas</span>
      </div>

      <div className={`mt-4 grid gap-4 ${compact ? '' : 'sm:grid-cols-[160px_1fr] sm:items-center'}`}>
        {!compact ? (
          <div className="mx-auto grid h-40 w-40 place-items-center rounded-2xl bg-surface p-2 shadow-soft">
            {qrDataUrl ? <img src={qrDataUrl} alt="QR Code do Pix" className="h-full w-full" /> : <span className="text-xs text-muted">Gerando QR...</span>}
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-sm text-muted">
            {compact ? 'Copie o código e pague no app do seu banco.' : 'Aponte a câmera do app do banco para o QR Code, ou copie o código abaixo.'}
          </p>
          <textarea
            id="pix-code"
            readOnly
            value={code}
            onFocus={(event) => event.currentTarget.select()}
            rows={2}
            className="mt-2 w-full resize-none rounded-xl border-2 border-line bg-surface px-3 py-2 font-mono text-[11px] leading-4 text-choco outline-none"
            aria-label="Código Pix copia e cola"
          />
          <button
            type="button"
            onClick={() => void copyCode()}
            className={`mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition ${
              copied ? 'bg-emerald-600 text-white' : 'bg-choco text-cream hover:bg-[#3a2119]'
            }`}
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? 'Código copiado!' : 'Copiar código Pix'}
          </button>
        </div>
      </div>
    </div>
  );
}
