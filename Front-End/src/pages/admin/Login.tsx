import { zodResolver } from '@hookform/resolvers/zod';
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
  password: z.string().min(6, 'Informe a senha.'),
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
      navigate('/admin');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-petal px-4 py-10">
      <Card className="w-full max-w-md">
        <Logo compact />
        <h1 className="mt-5 text-center font-display text-3xl font-bold text-roseText">Área administrativa</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="E-mail" error={formState.errors.email?.message}>
            <input className={inputClassName} {...register('email')} type="email" />
          </Field>
          <Field label="Senha" error={formState.errors.password?.message}>
            <input className={inputClassName} {...register('password')} type="password" />
          </Field>
          {error ? <p className="rounded-[18px] bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{error}</p> : null}
          <Button className="w-full py-5" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
          <Button className="w-full" variant="ghost" type="button" onClick={() => navigate('/')}>
            Voltar para o site
          </Button>
        </form>
      </Card>
    </main>
  );
}

const inputClassName = 'min-h-14 w-full rounded-[22px] border border-brand/10 px-4 outline-none focus:border-brand';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-roseText">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-semibold text-brand">{error}</span> : null}
    </label>
  );
}
