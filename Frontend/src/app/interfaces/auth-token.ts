export interface AuthToken {
  id: string;
  userId: string;
  type: 'VERIFY_EMAIL' | 'RESET_PASSWORD';
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}
