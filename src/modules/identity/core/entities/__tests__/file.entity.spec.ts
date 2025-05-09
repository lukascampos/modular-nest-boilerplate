import { File } from '../file.entity';

describe('FileEntity', () => {
  const baseProps = {
    title: 'profile.png',
    url: '/profile.png',
  };

  it('should create a file', () => {
    const request = File.create(baseProps);

    expect(request.title).toBe(baseProps.title);
    expect(request.url).toBe(baseProps.url);
    expect(request.createdAt).toBeInstanceOf(Date);
    expect(request.updatedAt).toBeInstanceOf(Date);
  });
});
