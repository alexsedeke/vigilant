import { gql } from 'apollo-server-fastify'

const typeDefs = gql`
  # A book has a title and an author
  type Book {
    title: String
    author: Author
  }

  # An author has a name and a list of books
  type Author {
    name: String
  }

  type Query {
    books: [Book]
    authors: [Author]
  }
`;

export default typeDefs
