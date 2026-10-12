import { CustomerAccessGuard } from './customer-access.guard';

describe('CustomerAccessGuard', () => {
  it('should be defined', () => {
    expect(new CustomerAccessGuard()).toBeDefined();
  });
});
