import { gql, useQuery } from "@apollo/client"
import _ from "lodash";
import { useState } from "react";

const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author {
      name
    }
    published
    genres
  }
}`;

const FILTERED_BOOKS = gql`
query Query($genre: String) {
  allBooks(genre: $genre) {
    title
    author {
      name
    }
    published
    genres
  }
}`;

const Books = ({ show, recommend }) => {
  const [genre, setGenre] = useState("");
  const books = useQuery(ALL_BOOKS, {
    pollInterval: 5000,
  });
  const filteredBooks = useQuery(FILTERED_BOOKS, {
    variables: { genre },
    pollInterval: 5000,
  });
  
  if (!show) {
    return null
  }

  return (
    <div>
      <h2>{recommend ? "Recommendation" : "Books"}</h2>

      <p>{recommend ? 
        "books in your favourite genre " + recommend : 
        (genre ? "in genre " + genre : "")
      }</p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks?.data?.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!recommend && _.uniq(books?.data?.allBooks.map((b) => b.genres).flat()).map((g) => (
        <button key={g} type="button" onClick={() => setGenre(g)}>{g}</button>
      ))}
    </div>
  )
}

export default Books
