import { BaseContext } from '@apollo/server';

export interface Context extends BaseContext {
  user: {
    id: string;
  };
}
