import { Router } from 'express';

import { CreateAssetController } from '@modules/options/useCases/createAsset/CreateAssetController';
import { ListAssetsController } from '@modules/options/useCases/listAssets/ListAssetsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { FetchAssetController } from '@modules/options/useCases/fetchAssetData/FetchAssetController';

// rota: recebe requisição, chama o serviço e dá um retorno
const assetsRoutes = Router();

const createAssetController = new CreateAssetController();
const listAssetsController = new ListAssetsController();
const fetchAssetController = new FetchAssetController();

assetsRoutes.post('/', ensureAuthenticated, ensureAdmin, createAssetController.handle);
assetsRoutes.get('/', ensureAuthenticated, ensureAdmin, listAssetsController.handle);
assetsRoutes.get('/fetch', fetchAssetController.handle);

export { assetsRoutes };
