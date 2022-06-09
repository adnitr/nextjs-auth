import { hashSync, compareSync } from 'bcryptjs';

export function hashPassword(password) {
  return hashSync(password, 12);
}

export function isMatch(password, hashPassword) {
  return compareSync(password, hashPassword);
}
