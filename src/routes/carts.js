import { Router } from 'express';

//Instancias de ruta
const router = Router();

//Lista en memoria
const carts = [];

//Crear nuevo cart
router.post('/', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ error: 'ID del carrito requerido' });
    }

    // Revisar si id existe
    const existingCart = carts.find(cart => cart.id == id);
    if (existingCart) {
        return res.status(400).send({ error: 'Carrito con este ID ya existe' });
    }

    const newCart = {
        id,
        products: []
    };

    carts.push(newCart);
    res.send({ status: 'success', cart: newCart });
});

// Productos en un cart específico
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(c => c.id == cid);
    
    if (cart) {
        res.send(cart.products);
    } else {
        res.status(404).send({ error: 'Carrito no encontrado' });
    }
});

// Agregar producto al cart
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity <= 0) {
        return res.status(400).send({ error: 'Cantidad debe ser un número positivo' });
    }

    const cart = carts.find(c => c.id == cid);

    if (!cart) {
        return res.status(404).send({ error: 'Carrito no encontrado' });
    }

    // Buscar el producto en el cart
    const existingProduct = cart.products.find(p => p.id == pid);

    if (existingProduct) {
        // Aumentar productos
        existingProduct.quantity += quantity;
    } else {
        // Agregar el producto nuevo al cart
        const newProduct = {
            id: pid,
            quantity
        };
        cart.products.push(newProduct);
    }

    res.send({ status: 'success', cart });
});

export default router;
