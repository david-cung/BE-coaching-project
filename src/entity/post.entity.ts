import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 10000 })
  content: string;

  @Column({ type: 'varchar', length: 1000 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ default: 'Uncategorized' })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

  @ManyToOne(() => User)
  user!: User;

  constructor(partial: Partial<Post>) {
    super();
    Object.assign(this, partial);
  }
}
