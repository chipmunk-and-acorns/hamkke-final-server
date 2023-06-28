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
  @PrimaryGeneratedColumn('increment')
  memberId!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nickname!: string;

  @Column({ type: 'datetime', nullable: false })
  birth!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
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
