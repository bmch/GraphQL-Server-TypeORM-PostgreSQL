import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { Bet } from './Bet';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true
  })
  public updatedAt: Date;

  @OneToMany(
    type => Bet,
    bet => bet.user
  )
  bets: Bet[];
}
