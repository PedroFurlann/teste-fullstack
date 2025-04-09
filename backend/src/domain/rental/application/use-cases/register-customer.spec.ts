import { InMemoryCustomerRepository } from '../../../../../test/repositories/in-memory-customer-repository';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { RegisterCustomerUseCase } from './register-customer';
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error';
import { makeCustomer } from '../../../../../test/factories/make-customer';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let fakeHasher: FakeHasher;
let sut: RegisterCustomerUseCase;

describe('Register Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterCustomerUseCase(inMemoryCustomerRepository, fakeHasher);
  });

  it('should be able to register a new customer', async () => {
    const result = await sut.execute({
      name: 'Pedro Furlan',
      email: 'pedro@example.com',
      cpf: '12345678900',
      phone: '11999999999',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { customer } = result.value;

      expect(customer.name).toBe('Pedro Furlan');
      expect(customer.email).toBe('pedro@example.com');
      expect(customer.cpf).toBe('12345678900');
      expect(customer.phone).toBe('11999999999');
      expect(customer.password).toBe('123456-hashed');
    }
  });

  it('should not allow registering a customer with existing email or cpf', async () => {
    const customer = makeCustomer({
      cpf: '12345678900',
    });

    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      name: 'Other Jane',
      email: 'pedro@example.com',
      cpf: '12345678900',
      phone: '11888888888',
      password: 'abcdef',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CustomerAlreadyExistsError);
  });
});
