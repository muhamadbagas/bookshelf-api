const { nanoid } = require('nanoid');
const books = require('./books');

// Handler untuk menyimpan buku
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const haveName = name === undefined;
  const falsePageInput = readPage > pageCount;

  if (haveName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (falsePageInput) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
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

  books.push(newBook);

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

// Handler untuk menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;
  const haveName = name !== undefined;
  const haveRead = reading !== undefined;
  const haveFinish = finished !== undefined;

  if (haveName) {
    filteredBooks = filteredBooks.filter((showBook) => showBook
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (haveRead) {
    filteredBooks = filteredBooks.filter((showBook) => showBook.reading === !!Number(reading));
  }

  if (haveFinish) {
    filteredBooks = filteredBooks.filter((showBook) => showBook.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Handler untuk menampilkan detail data buku berdasarkan id
const getDetailBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((detail) => detail.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Handler untuk memperbarui data buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const bookIndex = books.findIndex((book) => book.id === id);

  const haveName = name === undefined;
  const falsePageInput = readPage > pageCount;

  if (haveName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (falsePageInput) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Handler untuk menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
