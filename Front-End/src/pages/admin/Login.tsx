import { zodResolver } from '@hookform/resolvers/zod';
import { adminPath } from '../../config/admin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getApiErrorMessage } from '../../services/api';
import { loginAdmin } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

type LoginProps = {
  navigate: (path: string) => void;
};

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

type LoginForm = z.infer<typeof schema>;

export function Login({ navigate }: LoginProps) {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const { register, handleSubmit, formState } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: LoginForm) {
    setError(undefined);
    setIsSubmitting(true);
    try {
      const session = await loginAdmin(values.email, values.password);
      setSession(session);
      navigate(adminPath());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="sprinkles flex min-h-screen items-center justify-center bg-choco px-5 py-10 text-choco">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Logo compact />
          <h1 className="mt-5 font-display text-4xl text-cream">Entrar</h1>
          <p className="mt-1 text-sm text-cream/60">Acesso restrito à equipe.</p>
        </div>
        <Card className="mt-6">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Field label="E-mail" error={formState.errors.email?.message}>
              <input className={inputClassName} {...register('email')} data-testid="admin-login-email" type="email" autoComplete="username" />
            </Field>
            <Field label="Senha" error={formState.errors.password?.message}>
              <input className={inputClassName} {...register('password')} data-testid="admin-login-password" type="password" autoComplete="current-password" />
            </Field>
            {error ? <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand">{error}</p> : null}
            <Button className="min-h-12 w-full" disabled={isSubmitting} type="submit" data-testid="admin-login-submit">
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

const inputClassName =
  'min-h-12 w-full rounded-2xl border-2 border-line bg-cream/60 px-4 text-sm text-choco outline-none transition focus:border-choco/40 focus:bg-surface';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-brand">{error}</span> : null}
    </label>
  );
}
