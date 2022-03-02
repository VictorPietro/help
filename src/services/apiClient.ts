import { setupAPIClient } from '../services/api';

// quando chamar a api a partir do cliente, usa esse objeto
export const api = setupAPIClient();
// quando chamar a partir do servidor, chama o setupAPIClient passando o contexto