// O painel da confeitaria nao tem link em nenhuma pagina publica e fica num
// caminho definido por VITE_ADMIN_PATH (ex.: "/painel-x7k2q"). Em producao,
// configure um valor proprio e dificil de adivinhar. A seguranca real continua
// sendo o login: o caminho secreto so evita que clientes encontrem a tela.
function normalizeBasePath(value: string) {
  const trimmed = value.trim().replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export const ADMIN_BASE_PATH = normalizeBasePath(import.meta.env.VITE_ADMIN_PATH || '/gestao');

export function adminPath(subPath = '') {
  return `${ADMIN_BASE_PATH}${subPath}`;
}

export function isAdminPath(path: string) {
  return path === ADMIN_BASE_PATH || path.startsWith(`${ADMIN_BASE_PATH}/`);
}
