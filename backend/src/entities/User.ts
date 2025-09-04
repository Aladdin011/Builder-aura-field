import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  company?: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: string;
  
  @Column({ type: 'varchar', length: 100, nullable: true })
  department?: string;
  
  @Column({ type: 'varchar', length: 5, nullable: true })
  department_code?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
