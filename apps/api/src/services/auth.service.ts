import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  async login(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } }
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw { status: 401, message: 'Credenciales inválidas' };
    }

    const permissions = [...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.code)))];
    const payload = { id: user.id, username: user.username, permissions };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user.id, username: user.username });
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) }
    });

    return { accessToken, refreshToken, user: payload };
  }

  async refresh(token: string) {
    const payload = verifyRefreshToken(token) as any;
    const rows = await prisma.refreshToken.findMany({
      where: { userId: payload.id, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });
    const valid = await Promise.any(rows.map(async (r) => (await bcrypt.compare(token, r.tokenHash) ? r : Promise.reject()))).catch(() => null);
    if (!valid) throw { status: 401, message: 'Refresh token inválido' };

    await prisma.refreshToken.update({ where: { id: valid.id }, data: { revokedAt: new Date() } });

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } }
    });
    if (!user) throw { status: 401, message: 'Usuario no existe' };

    const permissions = [...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.code)))];
    const newAccess = signAccessToken({ id: user.id, username: user.username, permissions });
    const newRefresh = signRefreshToken({ id: user.id, username: user.username });

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: await bcrypt.hash(newRefresh, 10), expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) }
    });

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logout(token: string) {
    const payload = verifyRefreshToken(token) as any;
    const tokens = await prisma.refreshToken.findMany({ where: { userId: payload.id, revokedAt: null } });
    for (const t of tokens) {
      if (await bcrypt.compare(token, t.tokenHash)) {
        await prisma.refreshToken.update({ where: { id: t.id }, data: { revokedAt: new Date() } });
      }
    }
    return { mensaje: 'Logout exitoso' };
  }
}
