import { BaseEntity } from '@/modules/_shared/core/entities/base.entity';

interface UserFileProps {
  userId: string;
  fileId: string
}

export class UserFile extends BaseEntity<UserFileProps> {
  static create(
    props: UserFileProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): UserFile {
    return new UserFile({ ...props }, id, createdAt, updatedAt);
  }

  get userId() {
    return this.props.userId;
  }

  get fileId() {
    return this.props.fileId;
  }
}
