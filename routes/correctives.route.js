/** =====================================================================
 *  CORRECTIVES ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLER
const { getCorrectives, createCorrectives, updateCorrectives, deleteCorrectives } = require('../controllers/correctives.controller');



const router = Router();

/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/
router.get('/', validarJWT, getCorrectives);
/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/

/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/
router.post('/', [
        validarJWT,
        check('note', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    createCorrectives
);
/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/

/** =====================================================================
 *  UPDATE CORRECTIVES
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updateCorrectives
);
/** =====================================================================
 *  UPDATE CORRECTIVES
=========================================================================*/

/** =====================================================================
 *  DELETE CORRECTIVES
=========================================================================*/
router.delete('/:id', validarJWT, deleteCorrectives);
/** =====================================================================
 *  DELETE CORRECTIVES
=========================================================================*/

// EXPORTS
module.exports = router;