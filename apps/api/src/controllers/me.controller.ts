import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } }
  });
  const roles = user?.userRoles.map((ur) => ur.role.name) || [];
  const permissions = [...new Set(user?.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.code)) || [])];
  const menu = [
    { label: 'Dashboard', route: '/dashboard', permission: 'dashboard.view' },
    { label: 'Productos', route: '/productos', permission: 'products.read' },
    { label: 'Cotizaciones', route: '/cotizaciones', permission: 'quotes.read' }
  ].filter((m) => permissions.includes(m.permission) || m.permission === 'dashboard.view');

  res.json({ user: { id: user?.id, username: user?.username, email: user?.email }, roles, permissions, menu });
}
