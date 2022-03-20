import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Overlay } from './overlay';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  inputStreamUrl: string;

  @Column('text', { nullable: true })
  outputStreamUrl: string;

  @OneToMany(() => Overlay, overlay => overlay.project)
  overlays: Overlay[];

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'Now()' })
  createTime: Date;
}
