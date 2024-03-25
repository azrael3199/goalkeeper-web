import { IdTokenResult, User } from 'firebase/auth';

// TODO: Use later
// eslint-disable-next-line import/prefer-default-export
export const dummyUser: User = {
  displayName: "Mike O'Hearn",
  emailVerified: true,
  email: 'mikeyohearn@gmail.com',
  phoneNumber: '+1-202-555-0131',
  refreshToken: 'refresh-token',
  isAnonymous: false,
  metadata: {},
  providerData: [],
  tenantId: null,
  delete(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  getIdToken(forceRefresh?: boolean | undefined): Promise<string> {
    throw new Error('Function not implemented.');
  },
  getIdTokenResult(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    forceRefresh?: boolean | undefined
  ): Promise<IdTokenResult> {
    throw new Error('Function not implemented.');
  },
  reload(): Promise<void> {
    throw new Error('Function not implemented.');
  },
  toJSON(): object {
    throw new Error('Function not implemented.');
  },
  photoURL:
    'https://cdn.shopify.com/s/files/1/1957/2713/files/tile-partner-mike-titan-ohearn_150x.png?v=1655998083',
  providerId: 'some-provider-id',
  uid: 'some-uid',
};
