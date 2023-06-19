import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Member from './member';
import Article from './article';

@Entity({ name: 'comments' })
export default class Comment {
  @PrimaryGeneratedColumn('increment')
  commentId!: number;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  content!: string;

  @ManyToOne(() => Member, (member) => member.comments)
  member!: Member;

  @ManyToOne(() => Article, (article) => article.comments)
  article!: Article;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  modifiedAt!: Date;
}
