const { nanoid } = require('nanoid');
const books = require('./books');

const addBooks = (request, h) => {
  const { name, year, author, summary, publisher, 
    pageCount, readPage, reading } = request.payload; 

  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false; 
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
 
  const newBooks = {
    id, 
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    finished, 
    reading, 
    insertedAt, 
    updatedAt, 
  };

  if (name == undefined) {
    const response = h.response ({
        status : 'fail',
        message : 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;

  } else if (readPage > pageCount) {
    const response = h.response ({
        status : 'fail',
        message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBooks);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
 
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
    const response = h.response({
        status : 'success',
        data: {
            books: books.map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });
    response.code(200);
    return response;
};

const getDetailBooks = (request, h) => {
    const { id } = request.params;

    const book = books.filter((book) => book.id === id)[0];
    
    if (book != undefined) {
        const response = h.response({
            status : 'success',
            data : {
                book
            },
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status : 'fail',
        message : 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBooks = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, 
        pageCount, readPage, reading } = request.payload;
    
    const index = books.findIndex((book) => book.id === id);
    if (index != -1) {
        if (name == undefined ) {
            const response = h.response({
                status : 'fail',
                message : 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        } else if (readPage > pageCount) {
            const response = h.response({
                status : 'fail',
                message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        } else {
            const updatedAt = new Date().toISOString();
            const finished = pageCount === readPage ? true : false;
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                updatedAt, 
            };
            const response = h.response({
                status : 'success',
                message : 'Buku berhasil diperbarui',
            });
            response.code(200);
            return response;
        };
    }
    const response = h.response({
        status : 'fail',
        message : 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBooks = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);
 
    if (index != -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
        status : 'fail',
        message : 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {addBooks, getAllBooks, getDetailBooks, editBooks, deleteBooks};