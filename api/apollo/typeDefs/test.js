import { gql } from 'apollo-server-fastify'

const typeDefs = gql`
  type Movie {
    title: String
    year: Int
    imdbRating: Float
    genres: [Genre] @relationship(type: "IN_GENRE", direction: OUT)
  }

  type Genre {
    name: String
    movies: [Movie] @relationship(type: "IN_GENRE", direction: IN)
  }
`;

export default typeDefs
