const { response } = require('express');

const Corrective = require('../models/correctives.model');

/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/
const getCorrectives = async(req, res = response) => {

    try {

        const desde = Number(req.query.desde) || 0;

        const [correctives, total] = await Promise.all([

            Corrective.find()
            .skip(desde)
            .limit(10),

            Corrective.countDocuments()
        ]);

        res.json({
            ok: true,
            correctives,
            total
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente de nuevo'
        });

    }

};
/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/
/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/
const createCorrectives = async(req, res = response) => {

    try {

        // SAVE CORRECTIVE
        const corrective = new Corrective(req.body);
        await corrective.save();

        res.json({
            ok: true,
            corrective
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/

/** =====================================================================
 *  UPDATE CORRECTIVES
=========================================================================*/
const updateCorrectives = async(req, res = response) => {

    const coid = req.params.id;

    try {

        // SEARCH CLIENT
        const corretiveDB = await Corrective.findById({ _id: coid });
        if (!corretiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH CLIENT

        // VALIDATE CEDULA
        const {...campos } = req.body;

        // UPDATE
        const correctiveUpdate = await Corrective.findByIdAndUpdate(coid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            corrective: correctiveUpdate
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  UPDATE CORRECTIVES
=========================================================================*/

/** =====================================================================
 *  DELETE CORRECTIVES
=========================================================================*/
const deleteCorrectives = async(req, res = response) => {

    const coid = req.params.id;

    try {

        // SEARCH CORRECTIVE
        const corretiveDB = await Corrective.findById({ _id: coid });
        if (!corretiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH CORRECTIVE

        // CHANGE STATUS
        if (corretiveDB.status === true) {
            corretiveDB.status = false;
        } else {
            corretiveDB.status = true;
        }
        // CHANGE STATUS

        const correctiveUpdate = await Corrective.findByIdAndUpdate(coid, corretiveDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            client: correctiveUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE CORRECTIVES
=========================================================================*/

// EXPORTS
module.exports = {
    getCorrectives,
    createCorrectives,
    updateCorrectives,
    deleteCorrectives
};