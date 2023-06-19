import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Article from './article';
import Stack from './stack';

@Entity({ name: 'positions' })
export default class Position {
  @PrimaryGeneratedColumn('increment')
  positionId!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @ManyToMany(() => Article, (article) => article.positions)
  articles!: Article[];

  @ManyToMany(() => Stack, (stack) => stack.positions, { eager: true })
  @JoinTable()
  stacks!: Stack[];
}
