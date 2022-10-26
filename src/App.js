import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache, useQuery } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(new HttpLink({
    uri: 'http://localhost:4000',
  }))
})

const ME_QUERY = gql`
  query Query {
    me {
      username
      favouriteGenre
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors');
  const user = useQuery(ME_QUERY);
  const [recommend, setRecommend] = useState("");

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => {
          setRecommend("");
          setPage('books');
        }}>books</button>
        {user?.data?.me ? (
          <>
            <button onClick={() => {
              setRecommend(user.data.me.favouriteGenre);
              setPage('books');
            }}>recommendation</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => {
              window.localStorage.setItem("token", "");
              window.location.reload();
            }}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} recommend={recommend} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} />
    </div>
  )
};

const AppProvided = () => (
  <ApolloProvider client={client}>
    <App></App>
  </ApolloProvider>
);

export default AppProvided;
