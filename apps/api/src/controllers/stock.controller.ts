import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { StockService } from '../services/stock.service';

const service = new StockService();

export const StockController = {
  async stock(req: Request, res: Response) {
    const where: any = {};
    if (req.query.productId) where.productId = Number(req.query.productId);
    if (req.query.warehouseId) where.warehouseId = Number(req.query.warehouseId);
    res.json(await prisma.stock.findMany({ where }));
  },
  async thresholds(req: Request, res: Response) {
    if (req.method === 'GET') return res.json(await prisma.stockThreshold.findMany());
    res.status(201).json(await prisma.stockThreshold.upsert({
      where: { productId_warehouseId: { productId: req.body.productId, warehouseId: req.body.warehouseId } },
      update: { minQty: req.body.minQty, maxQty: req.body.maxQty },
      create: req.body
    }));
  },
  async movement(req: Request, res: Response) {
    res.status(201).json(await service.movement({ ...req.body, userId: req.user?.id }));
  },
  async kardex(req: Request, res: Response) {
    const where: any = {};
    if (req.query.productId) where.productId = Number(req.query.productId);
    if (req.query.warehouseId) where.warehouseId = Number(req.query.warehouseId);
    res.json(await prisma.inventoryMovement.findMany({ where, orderBy: { createdAt: 'desc' } }));
  },
  async lowStock(_req: Request, res: Response) {
    res.json(await service.lowStock());
  }
};
