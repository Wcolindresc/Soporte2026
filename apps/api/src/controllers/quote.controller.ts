import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { QuoteService } from '../services/quote.service';

const service = new QuoteService();

export const QuoteController = {
  create: async (req: Request, res: Response) => res.status(201).json(await service.createQuote({ ...req.body, userId: req.user?.id })),
  list: async (_req: Request, res: Response) => res.json(await prisma.quote.findMany({ include: { client: true }, orderBy: { createdAt: 'desc' } })),
  get: async (req: Request, res: Response) => res.json(await prisma.quote.findUnique({ where: { id: Number(req.params.id) }, include: { items: true, client: true } })),
  status: async (req: Request, res: Response) => res.json(await prisma.quote.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status } })),
  pdf: async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(`PDF placeholder cotizacion ${req.params.id}`));
  },
  export: async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(Buffer.from('Excel placeholder'));
  }
};
