import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  asset_id: number;

  @Column({ type: 'varchar', length: 255 })
  asset_name: string;

  @Column({ type: 'int' })
  stock_quantity: number;

  @Column({ type: 'varchar', length: 50 })
  category: 'Consumable' | 'Non-Consumable';
}
