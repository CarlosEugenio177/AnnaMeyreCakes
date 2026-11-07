// Funcao serverless da Vercel: entrega todas as requisicoes /api/* para o NestJS.
// O backend e compilado antes (npm run build) em Back-End/dist.
module.exports = require('../Back-End/dist/serverless.js').default;
