
export default (bookRepo, Book) => {
  const listBooks = (_,res) => {
    let books = bookRepo.listBooks();
    res.send({
      data: books
    })
  }

  const addBook = (req,res) => {
    const { isbn13, title, authors, editor, langCode, price } = req.body;

    if(!isISBNValid(isbn13)) {
      return res.status(400).send({
        error: 'isbn13 is required and must be 13 characters long'
      });
    }

    if(typeof price !== 'number') {
      return res.status(400).send({
        error: 'price is required and must be a number'
      });
    }

    let book = bookRepo.addBook(new Book({
      isbn13,
      title,
      authors,
      editor,
      langCode,
      price
    }));
    res.status(201).send(
       book
    );
  }

  const updateBook = (req,res) => {
    const { id } = req.params;
    const { title, authors, editor, langCode, price } = req.body;

    if(!isISBNValid(id)) {
      return res.status(400).send({
        error: 'isbn13 is required and must be 13 characters long'
      });
    }
    let updatedBook = bookRepo.updateBook(new Book({
      isbn13: id,
      title,
      authors,
      editor,
      langCode,
      price
    }));

    if(!updatedBook) {
      return res.status(404).send({
        error: `Book ${id} not found`
      });
    }

    res.status(200).send(
      { data: updatedBook }
    );
  }

  const deleteBook = (req,res) => {
    const { id } = req.params;

    if(!isISBNValid(id)) {
      return res.status(400).send({
        error: 'isbn13 is required and must be 13 characters long'
      });
    }

    let deletedBook = bookRepo.deleteBook(id);

    res.status(200).send(
      { meta: {
        message : `Book ${id} deleted`,
        deletedBook }
      }
    );
  }
  return {
    listBooks,
    addBook,
    updateBook,
    deleteBook
  }
};


const isISBNValid = (isbn13) => {
  if(!isbn13 || isbn13.length !== 13) {
    return false;
  }
  return true;
}
