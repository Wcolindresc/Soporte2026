import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class QuoteService {
  async createQuote(data: { clientId: number; validUntil: string; items: { productId: number; qty: number }[]; userId?: number }) {
    return prisma.$transaction(async (tx) => {
      const year = new Date().getFullYear();
      const seq = await tx.sequence.upsert({ where: { year }, update: {}, create: { year, lastNumber: 0 } });
      const locked = await tx.$queryRaw<{ year: number; lastNumber: number }[]>`SELECT year, lastNumber FROM Sequence WHERE year = ${year} FOR UPDATE`;
      const next = (locked[0]?.lastNumber ?? seq.lastNumber) + 1;
      await tx.sequence.update({ where: { year }, data: { lastNumber: next } });
      const quoteNumber = `COT-${year}-${String(next).padStart(4, '0')}`;

      const products = await tx.product.findMany({ where: { id: { in: data.items.map((i) => i.productId) } } });
      const itemRows = data.items.map((item) => {
        const p = products.find((pp) => pp.id === item.productId);
        if (!p) throw new Error('Producto no encontrado');
        const unit = Number(p.basePrice);
        return {
          productId: item.productId,
          description: p.name,
          qty: new Prisma.Decimal(item.qty),
          unitPriceApplied: new Prisma.Decimal(unit),
          lineTotal: new Prisma.Decimal(unit * item.qty),
          imageUrlSnapshot: p.imageUrl || null
        };
      });

      const subtotal = itemRows.reduce((acc, i) => acc + Number(i.lineTotal), 0);
      const setting = await tx.setting.findUnique({ where: { key: 'iva_rate' } });
      const ivaRate = Number(setting?.value ?? 0.12);
      const ivaAmount = subtotal * ivaRate;
      const total = subtotal + ivaAmount;

      return tx.quote.create({
        data: {
          quoteNumber,
          clientId: data.clientId,
          validUntil: new Date(data.validUntil),
          subtotal: new Prisma.Decimal(subtotal),
          ivaRate: new Prisma.Decimal(ivaRate),
          ivaAmount: new Prisma.Decimal(ivaAmount),
          total: new Prisma.Decimal(total),
          createdBy: data.userId,
          items: { create: itemRows }
        },
        include: { items: true }
      });
    });
  }
}
