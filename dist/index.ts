import { Entity } from './classes';
import { join } from 'path';

export const main = new Entity({
  name: 'client',
  command: `ts-node "${join(process.cwd(), 'dist/client/index.ts')}"`,
  cwd: process.cwd(),
  reloadable: true
});
