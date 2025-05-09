import { BaseEntity } from '@/modules/_shared/core/entities/base.entity';

export interface FileProps {
  title: string;
  url: string;
}

export class File extends BaseEntity<FileProps> {
  static create(
    props: FileProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): File {
    return new File({ ...props }, id, createdAt, updatedAt);
  }

  get title(): string {
    return this.props.title;
  }

  get url(): string {
    return this.props.url;
  }
}
