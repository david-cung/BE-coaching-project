import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Unique(['email'])
  @Column()
  email: string;

  @Column()
  userName: string;

  @Column({ type: 'varchar', nullable: true, length: 10000 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  photoURL: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: string;

  @OneToMany(() => Post, (post) => post.userId)
  post?: Post;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
