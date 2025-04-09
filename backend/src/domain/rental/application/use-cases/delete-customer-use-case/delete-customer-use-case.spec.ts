import { InMemoryCustomerRepository } from '../../../../../../test/repositories/in-memory-customer-repository';
import { DeleteCustomerUseCase } from './delete-customer-use-case';
import { makeCustomer } from '../../../../../../test/factories/make-customer';
import { CustomerNotFoundError } from '../errors/customer-not-found-error';

let inMemoryCustomerRepository: InMemoryCustomerRepository;
let sut: DeleteCustomerUseCase;

describe('Delete Customer', () => {
  beforeEach(() => {
    inMemoryCustomerRepository = new InMemoryCustomerRepository();
    sut = new DeleteCustomerUseCase(inMemoryCustomerRepository);
  });

  it('should delete a customer', async () => {
    const customer = makeCustomer();
    await inMemoryCustomerRepository.create(customer);

    const result = await sut.execute({ customerId: customer.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCustomerRepository.items).toHaveLength(0);
  });

  it('should return error if customer does not exist', async () => {
    const result = await sut.execute({ customerId: '123' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CustomerNotFoundError);
  });
});
