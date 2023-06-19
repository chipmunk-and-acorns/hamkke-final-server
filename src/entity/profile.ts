import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export default class Profile {
  @PrimaryGeneratedColumn('increment')
  profileId!: number;

  @Column('varchar')
  url!: string;
}
