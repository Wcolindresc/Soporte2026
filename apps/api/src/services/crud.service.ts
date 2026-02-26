import { prisma } from '../config/prisma';

const map: Record<string, any> = {
  users: prisma.user,
  roles: prisma.role,
  permissions: prisma.permission,
  clients: prisma.client,
  products: prisma.product,
  brands: prisma.brand,
  units: prisma.unit,
  categories: prisma.category,
  warehouses: prisma.warehouse,
  settings: prisma.setting
};

export class CrudService {
  model(name: string) {
    const model = map[name];
    if (!model) throw { status: 400, message: `Modelo ${name} no soportado` };
    return model;
  }

  async list(name: string, query: any) {
    const model = this.model(name);
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const skip = (page - 1) * limit;
    const search = query.search;
    const where = search ? { OR: [{ name: { contains: search } }, { username: { contains: search } }] } : {};

    const [data, total] = await Promise.all([
      model.findMany({ where, skip, take: limit }),
      model.count({ where })
    ]);
    return { data, total, page, limit };
  }

  create(name: string, body: any) { return this.model(name).create({ data: body }); }
  get(name: string, id: number) { return this.model(name).findUnique({ where: { id } }); }
  update(name: string, id: number, body: any) { return this.model(name).update({ where: { id }, data: body }); }
  delete(name: string, id: number, userId?: number) { return this.model(name).update({ where: { id }, data: { deletedAt: new Date(), updatedBy: userId } }); }
}
