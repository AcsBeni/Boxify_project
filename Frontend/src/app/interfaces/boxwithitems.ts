import { Box } from "./box";
import { BoxItem } from "./box-item";

export interface BoxWithItems extends Box {
  items: BoxItem[];
  capacity?: number;
}