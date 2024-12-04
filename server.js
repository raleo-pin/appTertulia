const express = require('express');
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const socketIO = require('socket.io');
const mp = require('mercadopago');
const ordersSocket = require('./sockets/ordersSocket');
const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

mercadopago = new mp.MercadoPagoConfig({
    sandbox: true,
    access_token: 'TEST-5413688469665858-021919-863e12a5933ed9af82cb3bacd6831175-1691522656'
});

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

ordersSocket(io);

const upload = multer({
    storage: multer.memoryStorage()
});

usersRoutes(app, upload);
categoriesRoutes(app);
addressRoutes(app);
productRoutes(app, upload);
ordersRoutes(app);
mercadoPagoRoutes(app);

server.listen(port, '0.0.0.0', function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...');
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

app.get('/test', (req, res) => {
    res.send('Esta es la ruta TEST');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
};
