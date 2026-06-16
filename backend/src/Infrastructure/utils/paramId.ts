import { sayisalId } from './sayisalId.js';

export function paramId(id: string | string[]): number {
  const ham = Array.isArray(id) ? id[0] : id;
  return sayisalId(ham);
}
