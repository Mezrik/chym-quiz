import { Database as DB } from '@/types/database';

declare global {
  type Database = DB;
}