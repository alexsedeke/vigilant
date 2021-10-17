const bookData = [{
  title: 'Star Wars 1',
  author: 'Someone'
},{
  title: 'Star Wars 2',
  author: 'Someone'
},{
  title: 'Star Wars 3',
  author: 'Someone'
}]

const authorData = [{
  name: 'Someone'
}]

export default {
  Query: {
    books: (_, __, ___) => bookData,
    authors: (_, __, ___) => authorData
  }
}
