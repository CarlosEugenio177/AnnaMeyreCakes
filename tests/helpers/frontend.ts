export const frontendUrl = process.env.E2E_FRONTEND_URL ?? 'http://localhost:5173';

// Caminho secreto do painel (o mesmo valor de VITE_ADMIN_PATH no frontend).
export const adminUrl = `${frontendUrl}${process.env.E2E_ADMIN_PATH ?? '/gestao'}`;
