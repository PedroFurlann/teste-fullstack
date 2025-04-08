/* eslint-disable @typescript-eslint/require-await */
import { Encrypter } from '../../src/domain/rental/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
