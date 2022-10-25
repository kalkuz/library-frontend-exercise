import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react";
import Select from 'react-select';

const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name,
    born,
    bookCount,
    id
  }
}`;

const UPDATE_BIRTH = gql`
  mutation Mutation($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
    }
  }
`

const Authors = (props) => {
  const [updateBirth] = useMutation(UPDATE_BIRTH);
  const authors = useQuery(ALL_AUTHORS, {
    pollInterval: 5000,
  });

  const [authorName, setAuthorName] = useState("");
  const [birth, setBirth] = useState("");

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.data?.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Set birthyear</h1>
      <form onSubmit={() => {
        updateBirth({
          variables: {
            name: authorName,
            setBornTo: Number(birth),
          }
        })
      }}>
        <div>
          Name
          <Select
            onChange={(e) => setAuthorName(e.value)}
            options={authors?.data?.allAuthors.map((a) => ({ value: a.name, label: a.name}))}
          />
        </div>
        {/* <div>
          name
          <input
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
          />
        </div> */}
        <div>
          born
          <input
            type="number"
            value={birth}
            onChange={({ target }) => setBirth(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
