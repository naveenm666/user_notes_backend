import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Note } from './Note';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  user_name: string;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  user_email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @UpdateDateColumn({ type: 'timestamp' })
  last_update: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_on: Date;

  @OneToMany(() => Note, (note) => note.user, { cascade: true })
  notes: Note[];
}
