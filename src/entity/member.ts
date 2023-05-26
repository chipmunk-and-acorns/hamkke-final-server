import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('members')
export default class Member {
  @PrimaryGeneratedColumn()
  memberId!: number;

  @Column('varchar')
  username!: string;

  @Column('varchar')
  password!: string;

  @Column('varchar')
  nickname!: string;

  @Column('date')
  birth!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
