import { Router } from 'express';

//Crear instancia para definir rutas
const router = Router();

//Almacenar la lista de productos en la memoria
let products = [];

//Método GET Lista de productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || products.length;
    const limitedProducts = products.slice(0, limit);
    res.send(limitedProducts);
});

//Método GET producto según ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id == pid);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ error: 'Producto no encontrado' });
    }
});

//Crear producto
router.post('/', (req, res) => {
    const { id, title, description, code, price, stock, category } = req.body;

    if (!id || !title || !description || !code || price || stock === undefined || !category) {
        return res.status(400).send({ error: 'Faltan campos requeridos' });
    }

    const product = {
        id,
        title,
        description,
        code,
        price,
        status: req.body.status !== undefined ? req.body.status : true,
        stock,
        category,
        thumbnails: thumbnails ? thumbnails.map(file => {
            const timestamp = Date.now();
            const filename = `${timestamp}-${file}`;
            return filename;
        }) : []
    };

    products.push(product);
    res.send({ status: 'success', product });
});

//Modificar usuario
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    let product = products.find(p => p.id == pid);

    if (product) {
        delete updatedFields.id;

        product = { ...product, ...updatedFields };

        products = products.map(p => (p.id == pid ? product : p));
        res.send({ status: 'success', product });
    } else {
        res.status(404).send({ error: 'Producto no encontrado' });
    }
});

//Eliminar producto
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const initialLength = products.length;
    products = products.filter(p => p.id != pid);

    if (products.length < initialLength) {
        res.send({ status: 'success', message: 'Producto eliminado' });
    } else {
        res.status(404).send({ error: 'Producto no encontrado' });
    }
});

export default router;
