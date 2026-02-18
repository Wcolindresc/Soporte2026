import { CanActivateFn } from '@angular/router';

export const permissionGuard: CanActivateFn = (route) => {
  const required = route.data?.['permission'];
  const permissions = JSON.parse(localStorage.getItem('permissions') || '["dashboard.view"]');
  return !required || permissions.includes(required);
};
