import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project';
import { OverlayStatus } from '../component/types';

@Entity()
export class Overlay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @ManyToOne(() => Project, project => project.overlays, { nullable: false })
  project: Project;

  @Column('text')
  templateId: string;

  @Column('jsonb', { default: '{}'})
  properties: object;

  @Column('text', { default: OverlayStatus.down })
  status: OverlayStatus;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'Now()' })
  createTime: Date;
}
