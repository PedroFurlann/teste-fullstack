import { makeCustomer } from '../../../../../../test/factories/make-customer';
import { FakeHasher } from '../../../../../../test/cryptography/fake-hasher';
import { FakeEncrypter } from '../../../../../../test/cryptography/fake-encrypter';
import { InMemoryCustomerRepository } from '../../../../../../test/repositories/in-memory-customer-repository';
import { AuthenticateCustomerUseCase } from './authenticate-customer-use-case';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateCustomerUseCase;

describe('Authenticate Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateCustomerUseCase(
      inMemoryCustomerRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should authenticate a customer by email', async () => {
    const customer = makeCustomer({
      email: 'test@email.com',
      cpf: '12345678900',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      type: 'email',
      identifier: 'test@email.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { accessToken } = result.value;

      expect(result.value).toHaveProperty('accessToken');
      expect(typeof accessToken).toBe('string');
    }
  });

  it('should authenticate a customer by cpf', async () => {
    const customer = makeCustomer({
      email: 'another@email.com',
      cpf: '98765432100',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      type: 'cpf',
      identifier: '98765432100',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { accessToken } = result.value;

      expect(result.value).toHaveProperty('accessToken');
      expect(typeof accessToken).toBe('string');
    }
  });

  it('should not authenticate with wrong password', async () => {
    const customer = makeCustomer({
      email: 'fail@email.com',
      cpf: '11122233344',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({
      type: 'email',
      identifier: 'fail@email.com',
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
  });

  it('should not authenticate if customer does not exist', async () => {
    const result = await sut.execute({
      type: 'email',
      identifier: 'notfound@email.com',
      password: await fakeHasher.hash('123456'),
    });

    expect(result.isLeft()).toBe(true);
  });
});
