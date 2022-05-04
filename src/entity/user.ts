import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role';

@Entity('user')
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  username: string;

  @Column('text', { nullable: true })
  password: string | null;

  @OneToMany(() => Role, role => role.user, { cascade: true, eager: true })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'now()' })
  createTime: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleteTime: Date | null;
}
