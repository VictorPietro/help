import { Router } from 'express';

import { CreateAssetController } from '@modules/options/useCases/createAsset/CreateAssetController';
import { ListAssetsController } from '@modules/options/useCases/listAssets/ListAssetsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';

// rota: recebe requisição, chama o serviço e dá um retorno
const assetsRoutes = Router();

const createAssetController = new CreateAssetController();
const listAssetsController = new ListAssetsController();

assetsRoutes.post('/', ensureAuthenticated, ensureAdmin, createAssetController.handle);
assetsRoutes.get('/', ensureAuthenticated, ensureAdmin, listAssetsController.handle);

export { assetsRoutes };
