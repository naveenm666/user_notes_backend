import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  note_id: string;

  @Column({ type: 'varchar', length: 255 })
  note_title: string;

  @Column({ type: 'text' })
  note_content: string;

  @UpdateDateColumn({ type: 'timestamp' })
  last_update: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_on: Date;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 36 })
  @Index()
  user_id: string;
}
