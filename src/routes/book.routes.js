const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// Middleware
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El ID del libro no es válido'
        });
    }
    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'El libro no fue encontrado'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
    res.book = book;
    next();
};

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books);
        if (books.length === 0) { // Cambié Book.length por books.length
            return res.status(204).json([]);
        }
        res.json(books); // Cambié res(books) por res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Obtener libro por id
router.get('/:id',getBook,async(req,res)=>{
    res.json(res.book); })

// Crear un nuevo libro [POST]
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req.body;
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Los campos título, autor, género y fecha son obligatorios' });
    }

    const book = new Book({
        title,
        author,
        genre,
        publication_date
    });
    try {
        const newBook = await book.save();
        console.log(newBook);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//Modificar Libro
router.put('/:id',getBook,async(req,res)=>{
    try{
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date =req.body.publication_date || book.publication_date;
       
        const updateBook = await book.save()
        res.json(updateBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
   })

// Modificar por PATCH
router.patch('/:id', getBook, async (req, res) => {
    // Verificar si al menos uno de los campos está presente en la solicitud
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        return res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: título, autor, género o fecha de publicación'
        });
    }

    try {
        const book = res.book;

        // Actualizar solo los campos proporcionados en la solicitud
        if (req.body.title) {
            book.title = req.body.title;
        }
        if (req.body.author) {
            book.author = req.body.author;
        }
        if (req.body.genre) {
            book.genre = req.body.genre;
        }
        if (req.body.publication_date) {
            book.publication_date = req.body.publication_date;
        }

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Eliminar Libro
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({ _id: book._id });

        // Verificar si el libro fue eliminado correctamente
        const deletedBook = await Book.findById(book._id);
        if (!deletedBook) {
            return res.json({
                message: `El libro "${book.title}" fue eliminado correctamente`
            });
        } else {
            throw new Error('Error al eliminar el libro');
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;
