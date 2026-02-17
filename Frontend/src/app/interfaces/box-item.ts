export interface BoxItem {
  id: string;
  boxId: string;
  itemId: string;
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
}
