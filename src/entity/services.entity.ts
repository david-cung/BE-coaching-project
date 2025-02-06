import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'services' })
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' }) // Updated
  content: string;

  @Column({ type: 'varchar', length: 1000 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ default: 'Uncategorized', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  user!: User;

  constructor(partial: Partial<Service>) {
    super();
    Object.assign(this, partial);
  }
}
