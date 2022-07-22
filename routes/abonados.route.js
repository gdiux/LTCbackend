/** =====================================================================
 *  ABONADO ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getAbonados, createAbonado, updateAbonado, deleteAbonado, getAbonadoId } = require('../controllers/abonados.controller');

const router = Router();

/** =====================================================================
 *  GET ABONADOS
=========================================================================*/
router.get('/', validarJWT, getAbonados);
/** =====================================================================
 *  GET ABONADOS
=========================================================================*/
/** =====================================================================
 *  GET ABONADOS ID
=========================================================================*/
router.get('/abonado/:id', validarJWT, getAbonadoId);
/** =====================================================================
 *  GET ABONADOS ID
=========================================================================*/
/** =====================================================================
 *  POST CREATE ABONADO
=========================================================================*/
router.post('/', [
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createAbonado
);
/** =====================================================================
 *  POST CREATE ABONADO
=========================================================================*/
/** =====================================================================
 *  PUT ABONADO
=========================================================================*/
router.put('/:id', [
        validarJWT,
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    updateAbonado
);
/** =====================================================================
 *  PUT ABONADO
=========================================================================*/
/** =====================================================================
 *  DELETE ABONADO
=========================================================================*/
router.delete('/:id', validarJWT, deleteAbonado);
/** =====================================================================
 *  DELETE ABONADO
=========================================================================*/



// EXPORT
module.exports = router;