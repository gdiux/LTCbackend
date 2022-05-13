/** =====================================================================
 *  PREVENTIVES ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLER
const { getPreventives, createPreventive, updatePreventives, deletePreventives, getPreventiveId, postNotes } = require('../controllers/preventives.controller');


const router = Router();

/** =====================================================================
 *  GET PREVENTIVES
=========================================================================*/
router.get('/', validarJWT, getPreventives);
/** =====================================================================
 *  GET PREVENTIVES
=========================================================================*/

/** =====================================================================
 *  GET PREVENTIVE FOR ID
=========================================================================*/
router.get('/:id', validarJWT, getPreventiveId);
/** =====================================================================
 *  GET PREVENTIVE FOR ID
=========================================================================*/

/** =====================================================================
 *  CREATE PREVENTIVE
=========================================================================*/
router.post('/', [
        validarJWT,
        check('staff', 'El tecnico es olbigatorio').isMongoId(),
        check('client', 'El cliente es olbigatorio').isMongoId(),
        validarCampos
    ],
    createPreventive
);
/** =====================================================================
 *  CREATE PREVENTIVE
=========================================================================*/

/** =====================================================================
 *  POST NOTES IN PREVENTIVE
=========================================================================*/
router.post('/notes/:id', [
        validarJWT,
        check('note', 'El comentario es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    postNotes
);
/** =====================================================================
 *  POST NOTES IN PREVENTIVE
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