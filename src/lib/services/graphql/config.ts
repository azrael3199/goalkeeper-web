import { ApolloClient, InMemoryCache } from '@apollo/client';
import env from '@root/environment';

const apolloClient = new ApolloClient({
  uri: env.graphqlBackendHost,
  cache: new InMemoryCache(),
});

export default apolloClient;
