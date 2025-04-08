import { User, UserRole } from '../user.entity';

describe('User Entity', () => {
  const userProps = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed123',
    role: UserRole.USER,
  };

  it('should be defined as User instance', () => {
    const user = User.create(userProps);

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it('should create a user with default active status', () => {
    const user = User.create(userProps);

    expect(user.id).toBeDefined();
    expect(user.name).toBe(userProps.name);
    expect(user.email).toBe(userProps.email);
    expect(user.password).toBe(userProps.password);
    expect(user.role).toBe(UserRole.USER);
    expect(user.isActive).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow updating name, email and password', () => {
    const user = User.create(userProps);

    user.name = 'Maria Doe';
    user.email = 'maria@example.com';
    user.password = 'newpassword';

    expect(user.name).toBe('Maria Doe');
    expect(user.email).toBe('maria@example.com');
    expect(user.password).toBe('newpassword');
  });

  it('should deactivate and reactivate the user', () => {
    const user = User.create(userProps);

    user.deactivate();
    expect(user.isActive).toBe(false);

    user.reactivate();
    expect(user.isActive).toBe(true);
  });

  it('should identify an admin user correctly', () => {
    const admin = User.create({ ...userProps, role: UserRole.ADMIN });
    const user = User.create(userProps);

    expect(admin.isAdmin()).toBe(true);
    expect(user.isAdmin()).toBe(false);
  });

  it('should respect isActive when provided explicitly', () => {
    const inactiveUser = User.create({ ...userProps, isActive: false });

    expect(inactiveUser.isActive).toBe(false);
  });
});
