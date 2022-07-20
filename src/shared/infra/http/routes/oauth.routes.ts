import { Router } from 'express';

import { FetchOAuthLinkController } from '@modules/accounts/useCases/fetchOAuthLink/FetchOAuthLinkController';
import { CallbackHandlerGoogleController } from '@modules/accounts/useCases/callbackHandlerGoogle/CallbackHandlerGoogleController';

// rota: recebe requisição, chama o serviço e dá um retorno
const oauthRoutes = Router();

const fetchOAuthLinkController = new FetchOAuthLinkController();
const callbackHandlerGoogleController = new CallbackHandlerGoogleController();

oauthRoutes.get('/links', fetchOAuthLinkController.handle);

oauthRoutes.get('/google/callback', callbackHandlerGoogleController.handle);

export { oauthRoutes };
