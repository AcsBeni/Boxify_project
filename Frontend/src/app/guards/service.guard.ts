import { CanActivateFn } from '@angular/router';

export const serviceGuard: CanActivateFn = (route, state) => {
  return true;
};
