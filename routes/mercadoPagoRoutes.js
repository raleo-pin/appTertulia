const mercadoPagoController = require('../controller/mercadoPagoController');
const passport = require('passport');

module.exports = (app) => {


    app.post('/api/payments/create',  passport.authenticate('jwt', { session: false }), mercadoPagoController.createPayment);

}