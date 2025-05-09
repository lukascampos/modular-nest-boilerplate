import { UserFile } from '../user-file.entity';

describe('UserFileEntity', () => {
  const baseProps = {
    userId: '1',
    fileId: '1',
  };

  it('should create a file', () => {
    const request = UserFile.create(baseProps);

    expect(request.userId).toBe(baseProps.userId);
    expect(request.fileId).toBe(baseProps.fileId);
    expect(request.createdAt).toBeInstanceOf(Date);
    expect(request.updatedAt).toBeInstanceOf(Date);
  });
});
