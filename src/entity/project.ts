import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Overlay } from './overlay';
import { ProjectStatus } from '../component/types';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  inputStreamUrl: string | null;

  @Column('text', { nullable: true })
  outputStreamUrl: string | null;

  @Column('text', { nullable: true })
  renderUrl: string | null;

  @OneToMany(() => Overlay, overlay => overlay.project)
  overlays: Overlay[];

  @Column('text', { default: ProjectStatus.stopped })
  status: ProjectStatus;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'Now()' })
  createTime: Date;
}
