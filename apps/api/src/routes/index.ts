import { Router } from 'express';
import authRoutes from './auth.routes';
import { authRequired } from '../middlewares/auth';
import { me } from '../controllers/me.controller';
import { buildCrud } from './crud.routes';
import { StockController } from '../controllers/stock.controller';
import { QuoteController } from '../controllers/quote.controller';

const router = Router();

router.use('/auth', authRoutes);
router.get('/me', authRequired, me);

router.use('/users', authRequired, buildCrud('users'));
router.use('/roles', authRequired, buildCrud('roles'));
router.use('/permissions', authRequired, buildCrud('permissions'));
router.use('/clients', authRequired, buildCrud('clients'));
router.use('/products', authRequired, buildCrud('products'));
router.use('/brands', authRequired, buildCrud('brands'));
router.use('/units', authRequired, buildCrud('units'));
router.use('/categories', authRequired, buildCrud('categories'));
router.use('/warehouses', authRequired, buildCrud('warehouses'));
router.use('/settings', authRequired, buildCrud('settings'));

router.get('/stock', authRequired, StockController.stock);
router.get('/stock/thresholds', authRequired, StockController.thresholds);
router.post('/stock/thresholds', authRequired, StockController.thresholds);

router.post('/movements', authRequired, StockController.movement);
router.get('/movements', authRequired, StockController.kardex);
router.get('/movements/kardex', authRequired, StockController.kardex);
router.get('/alerts/low-stock', authRequired, StockController.lowStock);

router.post('/quotes', authRequired, QuoteController.create);
router.get('/quotes', authRequired, QuoteController.list);
router.get('/quotes/:id', authRequired, QuoteController.get);
router.patch('/quotes/:id/status', authRequired, QuoteController.status);
router.get('/quotes/:id/pdf', authRequired, QuoteController.pdf);
router.get('/reports/quotes/excel', authRequired, QuoteController.export);
router.get('/reports/kardex', authRequired, StockController.kardex);
router.get('/reports/existencias', authRequired, StockController.stock);
router.get('/reports/maxmin', authRequired, StockController.lowStock);

export default router;
