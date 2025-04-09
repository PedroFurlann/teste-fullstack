import { InMemoryCustomerRepository } from '../../../../../../test/repositories/in-memory-customer-repository';
import { EditCustomerUseCase } from './edit-customer-use-case';
import { makeCustomer } from '../../../../../../test/factories/make-customer';
import { FakeHasher } from '../../../../../../test/cryptography/fake-hasher';
import { CustomerNotFoundError } from '../errors/customer-not-found-error';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let fakeHasher: FakeHasher;
let sut: EditCustomerUseCase;

describe('Edit Customer Use Case', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    fakeHasher = new FakeHasher();
    sut = new EditCustomerUseCase(inMemoryCustomerRepository, fakeHasher);
  });

  it('should be able to edit a customer', async () => {
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      customerId: customer.id.toString(),
      name: 'Pedro Furlan',
      phone: '999998888',
      password: 'new-password',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { customer } = result.value;

      expect(customer.name).toBe('Pedro Furlan');
      expect(customer.phone).toBe('999998888');
      expect(customer.password).toBe('new-password-hashed');
    }
  });

  it('should return an error if customer does not exist', async () => {
    const result = await sut.execute({
      customerId: '123',
      name: 'Pedro',
      phone: '000000000',
      password: 'password123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CustomerNotFoundError);
  });
});
