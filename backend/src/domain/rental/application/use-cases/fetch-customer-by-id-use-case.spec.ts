import { InMemoryCustomerRepository } from '../../../../../test/repositories/in-memory-customer-repository';
import { FetchCustomerByIdUseCase } from './fetch-customer-by-id-use-case';
import { makeCustomer } from '../../../../../test/factories/make-customer';
import { CustomerNotFoundError } from './errors/customer-not-found-error';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: FetchCustomerByIdUseCase;

describe('Fetch Customer By Id', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new FetchCustomerByIdUseCase(inMemoryCustomerRepository);
  });

  it('should return a customer if it exists', async () => {
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({ customerId: customer.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ customer });
  });

  it('should return an error if customer does not exist', async () => {
    const result = await sut.execute({ customerId: '123' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CustomerNotFoundError);
  });
});
