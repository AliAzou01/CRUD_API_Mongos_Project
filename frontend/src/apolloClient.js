import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Créez un lien HTTP pour la communication avec votre serveur GraphQL
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Ajoutez l'en-tête Authorization à chaque requête
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjllNDE5NjU4MTBhMjRiODJhODNkMTMiLCJlbWFpbCI6ImF6YXoxQGdtYWlsLmNvbSIsImlhdCI6MTcyMTcyNTU3MywiZXhwIjoxNzIxNzI5MTczfQ.0W-BFM0qEC7sLWIgWkkC-iiIRpH90PW4p9GVMxV_9Xg'); // Récupérez le token depuis le stockage local ou un autre endroit
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Créez une instance d'Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
