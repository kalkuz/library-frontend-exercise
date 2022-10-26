import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const Login = ({ show }) => {
  const [login] = useMutation(LOGIN);

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const { data: { login: { value }}} = await login({ variables: {
      username,
      password,
    } });

    window.localStorage.setItem("token", value);
    window.location.reload();
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default Login
