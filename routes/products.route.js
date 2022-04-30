/** =====================================================================
 *  PRODUCTS ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLER
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    oneProduct,
    codeProduct,
    productsExcel,
} = require('../controllers/products.controller');

const router = Router();

/** =====================================================================
 *  GET PRODUCTS
=========================================================================*/
router.get('/', getProducts);
/** =====================================================================
 *  GET PRODUCTS 
=========================================================================*/

/** =====================================================================
 *  GET PRODUCT EXCEL
=========================================================================*/
router.get('/excel/', productsExcel);
/** =====================================================================
 *  GET PRODUCT EXCEL
=========================================================================*/

/** =====================================================================
 *  ONE GET PRODUCT
=========================================================================*/
router.get('/:id', oneProduct);
/** =====================================================================
 *  ONE GET PRODUCT
=========================================================================*/

/** =====================================================================
 *  GET CODE PRODUCT
=========================================================================*/
router.get('/code/:code', codeProduct);
/** =====================================================================
 *  GET CODE PRODUCT
=========================================================================*/

/** =====================================================================
 *  CREATE PRODUCTS
=========================================================================*/
router.post('/', [
        validarJWT,
        check('code', 'El codigo es obligatorio').not().isEmpty(),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('cost', 'El costo es obligatorio').not().isEmpty(),
        check('gain', 'La ganancia es obligatoria').not().isEmpty(),
        check('price', 'El precio es obligatorio').not().isEmpty(),
        check('wholesale', 'El mayoreo es obligatorio').not().isEmpty(),
        check('type', 'El tipo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createProduct
);
/** =====================================================================
 *  CREATE PRODUCTS
=========================================================================*/

/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/
router.put('/:id', [
        validarJWT,
        check('code', 'El codigo es obligatorio').not().isEmpty(),
        check('serial', 'El nombre es obligatorio').not().isEmpty(),
        check('marca', 'El tipo es obligatorio').not().isEmpty(),
        check('modelo', 'El tipo es obligatorio').not().isEmpty(),
        validarCampos
    ],
    updateProduct
);
/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/

/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/
router.delete('/:id', validarJWT, deleteProduct);
/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/


// EXPORT
module.exports = router;