import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ArticleCategory,
  ArticleContact,
  ArticleProceed,
} from './common/Enums';
import Member from './member';
import Comment from './comment';
import Stack from './stack';
import Position from './position';

@Entity('articles')
export default class Article {
  @PrimaryGeneratedColumn()
  articleId!: number;

  @Column('varchar', { nullable: false, length: 1000 })
  title!: string;

  @Column('varchar', { nullable: false, length: 5000 })
  content!: string;

  @Column({ type: 'enum', name: 'category', enum: ArticleCategory })
  category!: ArticleCategory;

  @Column({ type: 'int', nullable: true })
  recruitCount!: number;

  @Column({ type: 'enum', name: 'proceed', enum: ArticleProceed })
  proceed!: ArticleProceed;

  @Column({ type: 'int', nullable: true })
  period!: number;

  @Column({ type: 'datetime', nullable: false })
  dueDate!: Date;

  @Column({ type: 'enum', name: 'contact', enum: ArticleContact })
  contact!: ArticleContact;

  @Column({ type: 'varchar', name: 'link', nullable: false })
  link!: string;

  // Relation
  @ManyToOne(() => Member, (member) => member.articles)
  @JoinColumn({ name: 'memberId' })
  member!: Member;

  @OneToMany(() => Comment, (comment) => comment.article, { eager: true })
  @JoinTable({
    name: 'article_positions',
  })
  comments!: Comment[];

  @ManyToMany(() => Stack, (stack) => stack.articles, { eager: true })
  @JoinTable({
    name: 'article_stacks',
  })
  stacks!: Stack[];

  @ManyToMany(() => Position)
  positions!: Position[];

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  modifiedAt!: Date;
}
