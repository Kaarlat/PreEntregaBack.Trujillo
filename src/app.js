import express from 'express';
import path from 'path';
import cartsRouter from './routes/carts.js';
import productsRouter from './routes/products.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
    res.send('Servidor en funcionamiento');
});

const server = app.listen(8080, () => {
    console.log('Servidor en funcionamiento en el puerto 8080');
});

export default server;
