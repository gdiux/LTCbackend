const { response } = require('express');

const Corrective = require('../models/correctives.model');

/** =====================================================================
 *  GET ROLE
=========================================================================*/
const getRole = (role) => {

    if (role === 'ADMIN') {
        return 'Administrador';
    } else if (role === 'TECH') {
        return 'Tecnico';
    } else {
        return 'Usuario';
    }

}

/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/
const getCorrectives = async(req, res = response) => {

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;

        const [correctives, total] = await Promise.all([

            Corrective.find()
            .populate('create', 'name')
            .populate('staff', 'name')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img ubicacion')
            .skip(desde)
            .limit(limite),

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
 *  GET CORRECTIVE FOR ID
=========================================================================*/
const getCorrectiveId = async(req, res = response) => {

    try {

        const coid = req.params.id;

        const correctiveDB = await Corrective.findById(coid)
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img ubicacion');

        if (!correctiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun mantenimiento correctivo con este ID'
            });
        }

        // TRANSFORMAR ROLE
        correctiveDB.staff.role = getRole(correctiveDB.staff.role);

        res.json({
            ok: true,
            corrective: correctiveDB
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
 *  GET CORRECTIVE FOR ID
=========================================================================*/

/** =====================================================================
 *  GET CORRECTIVE FOR STAFF
=========================================================================*/
const getCorrectiveStaff = async(req, res = response) => {

    try {

        const staff = req.params.staff;
        const status = req.query.status;
        const estado = req.query.estado;

        const correctives = await Corrective.find({ staff, estado })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img ubicacion');

        res.json({
            ok: true,
            correctives,
            total: correctives.length
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente de nuevo'
        });
    }

}

/** =====================================================================
 *  GET CORRECTIVE FOR STAFF
=========================================================================*/

/** =====================================================================
 *  GET CORRECTIVE FOR PRODUCT
=========================================================================*/
const getCorrectiveProduct = async(req, res = response) => {

    try {

        const product = req.params.product;
        const estado = req.query.estado;

        const correctives = await Corrective.find({ product, estado })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img ubicacion')
            .limit(20)
            .sort({ control: -1 });

        res.json({
            ok: true,
            correctives,
            total: correctives.length
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente de nuevo'
        });
    }

}

/** =====================================================================
 *  GET CORRECTIVE FOR PRODUCT
=========================================================================*/

/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/
const createCorrectives = async(req, res = response) => {

    try {

        const uid = req.uid;

        // SAVE CORRECTIVE
        const corrective = new Corrective(req.body);
        corrective.create = uid;

        // AGREGAMOS EL PRIMER COMENTARIO
        corrective.notes.push({
            note: 'Se ha creado el mantenimiento correctivo',
            staff: uid
        });

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
 *  CREATE NOTES IN CORRECTIVE
=========================================================================*/
const postNotesCorrectives = async(req, res = response) => {

    try {

        const coid = req.params.id;
        const uid = req.uid;

        // SEARCH CORRECTIVE
        const correctiveDB = await Corrective.findById(coid);
        if (!correctiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun Mantenimiento correctivo con este ID'
            });
        }
        // SEARCH CORRECTIVE

        const nota = req.body;

        // AGREGAMOS AL USUARIO
        nota.staff = uid;

        // AGREGAMOS EL NUEVO COMENTARIO
        correctiveDB.notes.push(nota);

        // UPDATE
        const correctiveUpdate = await Corrective.findByIdAndUpdate(coid, { notes: correctiveDB.notes }, { new: true })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img ubicacion');

        // TRANSFORMAR ROLE
        correctiveUpdate.staff.role = getRole(correctiveDB.staff.role);

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

}

/** =====================================================================
 *  CREATE NOTES IN CORRECTIVE
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

        // SPREAD
        const {...campos } = req.body;

        // UPDATE
        const correctiveUpdate = await Corrective.findByIdAndUpdate(coid, campos, { new: true, useFindAndModify: false })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img ubicacion');

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
    deleteCorrectives,
    getCorrectiveId,
    getCorrectiveStaff,
    postNotesCorrectives,
    getCorrectiveProduct
};