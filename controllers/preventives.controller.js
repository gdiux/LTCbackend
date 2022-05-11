const { response } = require('express');

const Preventive = require('../models/preventives.model');

/** =====================================================================
 *  GET PREVENTIVES
=========================================================================*/
const getPreventives = async(req, res = response) => {

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;

        const [preventives, total] = await Promise.all([

            Preventive.find()
            .populate('create', 'name')
            .populate('staff', 'name')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img')
            .skip(desde)
            .limit(limite),
            Preventive.countDocuments()
        ]);

        res.json({
            ok: true,
            preventives,
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
 *  GET PREVENTIVES
=========================================================================*/
/** =====================================================================
 *  CREATE PREVENTIVE
=========================================================================*/
const createPreventive = async(req, res = response) => {

    try {

        const uid = req.uid;

        // SAVE PREVENTIVE
        const preventive = new Preventive(req.body);
        preventive.create = uid;

        await preventive.save();

        res.json({
            ok: true,
            preventive
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
 *  CREATE PREVENTIVE
=========================================================================*/

/** =====================================================================
 *  UPDATE PREVENTIVES
=========================================================================*/
const updatePreventives = async(req, res = response) => {

    const preid = req.params.id;

    try {

        // SEARCH CLIENT
        const preventiveDB = await Preventive.findById({ _id: preid });
        if (!preventiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH CLIENT

        // VALIDATE CEDULA
        const {...campos } = req.body;

        // UPDATE
        const preventiveUpdate = await Preventive.findByIdAndUpdate(preid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            preventive: preventiveUpdate
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
 *  UPDATE PREVENTIVES
=========================================================================*/

/** =====================================================================
 *  DELETE PREVENTIVES
=========================================================================*/
const deletePreventives = async(req, res = response) => {

    const preid = req.params.id;

    try {

        // SEARCH PREVENTIVE
        const preventiveDB = await Preventive.findById({ _id: preid });
        if (!preventiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH PREVENTIVE

        // CHANGE STATUS
        if (preventiveDB.status === true) {
            preventiveDB.status = false;
        } else {
            preventiveDB.status = true;
        }
        // CHANGE STATUS

        const PreventiveUpdate = await Preventive.findByIdAndUpdate(preid, preventiveDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            client: PreventiveUpdate
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
 *  DELETE PREVENTIVES
=========================================================================*/

// EXPORTS
module.exports = {
    getPreventives,
    createPreventive,
    updatePreventives,
    deletePreventives
};