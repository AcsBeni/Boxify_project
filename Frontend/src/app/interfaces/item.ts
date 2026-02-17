export interface Item {
  id: string;
  userId: string;
  name: string;
  description?: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  maxWeightKg: number;
  createdAt: Date;
  updatedAt?: Date;
}
