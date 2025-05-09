import { BaseEntity } from '@/modules/_shared/core/entities/base.entity';
import { UserFile } from './user-file.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  avatar?: UserFile;
  role: UserRole;
  isActive: boolean;
}

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  avatar?: UserFile
  role: UserRole;
  isActive?: boolean;
};

export class User extends BaseEntity<UserProps> {
  private constructor(props: UserProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  static create(
    props: CreateUserProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): User {
    const isActive = props.isActive ?? true;
    return new User({
      ...props,
      isActive,
    }, id, createdAt, updatedAt);
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  get password(): string {
    return this.props.password;
  }

  set password(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  get avatar(): UserFile | undefined {
    return this.props.avatar;
  }

  set avatar(file: UserFile) {
    this.props.avatar = file;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  deactivate() {
    this.props.isActive = false;
    this.touch();
  }

  reactivate() {
    this.props.isActive = true;
    this.touch();
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }
}
