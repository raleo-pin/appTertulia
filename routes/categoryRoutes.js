const categoriesController = require('../controller/categoriesController');
const passport = require('passport');

module.exports = (app) => {

    app.post('/api/categories/create', passport.authenticate('jwt', {session: false }), categoriesController.create);
    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false }), categoriesController.getAll);
    
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false }), categoriesController.create);

}