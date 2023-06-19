import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Article from './article';
import Comment from './comment';

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

  @Column('varchar')
  profile!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;

  @OneToMany(() => Article, (article) => article.member)
  articles!: Article[];

  @OneToMany(() => Comment, (comment) => comment.member)
  comments!: Comment[];
}
