import cron from 'node-cron';
import { prisma } from '../config/prisma';

export function scheduleQuoteExpiration() {
  cron.schedule('0 2 * * *', async () => {
    await prisma.quote.updateMany({
      where: { status: 'PENDIENTE', validUntil: { lt: new Date() } },
      data: { status: 'VENCIDA' }
    });
  });
}
