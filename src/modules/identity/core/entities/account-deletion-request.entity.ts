import { BaseEntity } from '@/modules/_shared/core/entities/base.entity';

export enum RequestStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  CANCELED = 'CANCELED'
}

export interface AccountDeletionRequestProps {
  userId: string;
  reason: string;
  status: RequestStatus;
}

type CreateAccountDeletionRequestProps = {
  userId: string;
  reason: string;
};

export class AccountDeletionRequest extends BaseEntity<AccountDeletionRequestProps> {
  private constructor(
    props: AccountDeletionRequestProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id, createdAt, updatedAt);
  }

  static create(
    props: CreateAccountDeletionRequestProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): AccountDeletionRequest {
    return new AccountDeletionRequest({
      ...props,
      status: RequestStatus.PENDING,
    }, id, createdAt, updatedAt);
  }

  get userId() {
    return this.props.userId;
  }

  get reason() {
    return this.props.reason;
  }

  set reason(value: string) {
    this.props.reason = value;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  processRequest() {
    this.props.status = RequestStatus.PROCESSED;
    this.touch();
  }

  cancelRequest() {
    this.props.status = RequestStatus.CANCELED;
    this.touch();
  }
}
