import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    'users.read','users.write','roles.read','roles.write','permissions.read','permissions.write',
    'clients.read','clients.write','products.read','products.write','stock.read','stock.write',
    'movements.read','movements.write','quotes.read','quotes.write','reports.read','settings.write'
  ];

  for (const code of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: { code, module: code.split('.')[0], description: code }
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrador con todos los permisos' }
  });

  const allPerms = await prisma.permission.findMany();
  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id }
    });
  }

  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash },
    create: { username: 'admin', passwordHash, email: 'admin@local' }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id }
  });

  await prisma.setting.upsert({ where: { key: 'iva_rate' }, update: {}, create: { key: 'iva_rate', value: '0.12' } });
  await prisma.setting.upsert({ where: { key: 'company_name' }, update: {}, create: { key: 'company_name', value: 'Mi Empresa' } });
}

main().finally(() => prisma.$disconnect());
