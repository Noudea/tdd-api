import bookData from '../data/bookData.js'

function bookRepo () {
  const books = bookData

  const listBooks = () => {
    return books
  }

  const getById = (id) => {
    return books.find(book => book.isbn13 === id)
  }

  const addBook = (book) => {
    books.push(book)
    return book
  }

  const updateBook = (book) => {
    const BookIndexToReplace = books.findIndex((b) => b.isbn13 === book.isbn13)

    if (BookIndexToReplace === -1) {
      return null
    }
    books[BookIndexToReplace] = book
    return book
  }

  const deleteBook = (id) => {
    const BookIndexToDelete = books.findIndex((b) => b.isbn13 === id)

    if (BookIndexToDelete === -1) {
      return null
    }
    return books.splice(BookIndexToDelete, 1)[0]
  }

  return {
    listBooks,
    addBook,
    updateBook,
    deleteBook,
    getById
  }
}

export default bookRepo
