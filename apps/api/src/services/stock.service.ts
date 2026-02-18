import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class StockService {
  async movement(data: { type: 'ENTRADA'|'SALIDA'|'AJUSTE'; qty: number; productId: number; warehouseId: number; reason: string; reference?: string; userId?: number }) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.stock.upsert({
        where: { productId_warehouseId: { productId: data.productId, warehouseId: data.warehouseId } },
        update: {},
        create: { productId: data.productId, warehouseId: data.warehouseId, qty: new Prisma.Decimal(0) }
      });

      let next = Number(current.qty);
      if (data.type === 'ENTRADA') next += data.qty;
      if (data.type === 'SALIDA') next -= data.qty;
      if (data.type === 'AJUSTE') next = data.qty;
      if (next < 0) throw { status: 400, message: 'Stock insuficiente' };

      await tx.stock.update({ where: { id: current.id }, data: { qty: new Prisma.Decimal(next) } });
      await tx.inventoryMovement.create({ data: {
        ...data,
        qty: new Prisma.Decimal(data.qty)
      } });

      return { productId: data.productId, warehouseId: data.warehouseId, qty: next };
    });
  }

  lowStock() {
    return prisma.$queryRaw`SELECT s.productId, s.warehouseId, s.qty, t.minQty FROM Stock s INNER JOIN StockThreshold t ON s.productId = t.productId AND s.warehouseId = t.warehouseId WHERE s.qty < t.minQty`;
  }
}
