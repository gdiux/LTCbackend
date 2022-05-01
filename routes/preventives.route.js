/** =====================================================================
 *  PREVENTIVES ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLER
const { getPreventives, createPreventive, updatePreventives, deletePreventives } = require('../controllers/preventives.controller');


const router = Router();

/** =====================================================================
 *  GET PREVENTIVES
=========================================================================*/
router.get('/', validarJWT, getPreventives);
/** =====================================================================
 *  GET PREVENTIVES
=========================================================================*/

/** =====================================================================
 *  CREATE PREVENTIVE
=========================================================================*/
router.post('/', [
        validarJWT,
        check('note', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    createPreventive
);
/** =====================================================================
 *  CREATE PREVENTIVE
=========================================================================*/

/** =====================================================================
 *  UPDATE PREVENTIVES
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updatePreventives
);
/** =====================================================================
 *  UPDATE PREVENTIVES
=========================================================================*/

/** =====================================================================
 *  DELETE PREVENTIVES
=========================================================================*/
router.delete('/:id', validarJWT, deletePreventives);
/** =====================================================================
 *  DELETE PREVENTIVES
=========================================================================*/

// EXPORTS
module.exports = router;