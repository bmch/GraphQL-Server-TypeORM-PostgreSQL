import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

import { User } from './User';

@Entity('bets')
export class Bet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  goal: string;

  @Column('text')
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true
  })
  public updatedAt: Date;

  @Column({ name: 'end_date', type: 'timestamp with time zone' })
  public endDate: Date;

  @Column('boolean')
  public isPublished: boolean;

  @Column('boolean')
  public won: boolean;

  @ManyToOne(
    () => User,
    user => user.bets
  )
  user: User;
}
