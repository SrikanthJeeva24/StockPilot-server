import Hashids from 'hashids';

export class HashIdService {
  private readonly hashids = new Hashids(process.env.HASH_SALT, 16);

  encode(id: number): string {
    return this.hashids.encode(id);
  }

  decode(hash: string): number {
    return Number(this.hashids.decode(hash)[0]);
  }
}
