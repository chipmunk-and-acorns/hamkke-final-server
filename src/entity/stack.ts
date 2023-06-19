import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Article from './article';
import Position from './position';

@Entity({ name: 'stacks' })
export default class Stack {
  @PrimaryGeneratedColumn('increment')
  stackId!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column('varchar')
  profile!: string;

  @ManyToMany(() => Article, (article) => article.stacks)
  articles!: Article[];

  @ManyToMany(() => Position, (position) => position.stacks)
  @JoinTable({
    name: 'stack_positions',
  })
  positions!: Position[];
}
