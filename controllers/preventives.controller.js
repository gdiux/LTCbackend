const { response } = require('express');

const Preventive = require('../models/preventives.model');
const Product = require('../models/products.model');

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
            .populate('notes.staff', 'name role img')
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
 *  GET PREVENTIVE FOR ID
=========================================================================*/
const getPreventiveId = async(req, res = response) => {

    try {

        const preid = req.params.id;

        const preventiveDB = await Preventive.findById(preid)
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img frecuencia');

        if (!preventiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun mantenimiento preventivo con este ID'
            });
        }

        // TRANSFORMAR ROLE
        preventiveDB.staff.role = getRole(preventiveDB.staff.role);

        res.json({
            ok: true,
            preventive: preventiveDB
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
 *  GET PREVENTIVE FOR ID
=========================================================================*/

/** =====================================================================
 *  GET PREVENTIVE FOR STAFF SORT -1
=========================================================================*/
const getPreventiveStaff = async(req, res = response) => {

    try {

        const staff = req.params.staff;
        const status = req.query.status;
        const estado = req.query.estado;

        const preventives = await Preventive.find({ staff, estado })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img')
            .sort({ control: -1 });

        res.json({
            ok: true,
            preventives,
            total: preventives.length
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
 *  GET PREVENTIVE FOR STAFF
=========================================================================*/

/** =====================================================================
 *  GET PREVENTIVE FOR PRODUCT
=========================================================================*/
const getPreventiveProduct = async(req, res = response) => {

    try {

        const product = req.params.product;
        const estado = req.query.estado;

        const preventives = await Preventive.find({ product, estado })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img')
            .limit(20)
            .sort({ control: -1 });

        res.json({
            ok: true,
            preventives,
            total: preventives.length
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
 *  GET PREVENTIVE FOR PRODUCT
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

        // AGREGAMOS EL PRIMER COMENTARIO
        preventive.notes.push({
            note: 'Se ha creado el mantenimiento preventivo',
            staff: uid
        });

        await preventive.save();

        const product = await Product.findByIdAndUpdate(preventive.product, ({ preventivo: true }), { new: true, useFindAndModify: false });

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
 *  CREATE NOTES IN PREVENTIVE
=========================================================================*/
const postNotes = async(req, res = response) => {

    try {

        const preid = req.params.id;
        const uid = req.uid;

        // SEARCH PREVENTIVE
        const preventiveDB = await Preventive.findById(preid);
        if (!preventiveDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun Mantenimiento Preventivo con este ID'
            });
        }
        // SEARCH PREVENTIVE

        const nota = req.body;

        // AGREGAMOS AL USUARIO
        nota.staff = uid;

        // AGREGAMOS EL NUEVO COMENTARIO
        preventiveDB.notes.push(nota);

        // UPDATE
        const preventiveUpdate = await Preventive.findByIdAndUpdate(preid, { notes: preventiveDB.notes }, { new: true })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('notes.staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img');

        // TRANSFORMAR ROLE
        preventiveUpdate.staff.role = getRole(preventiveDB.staff.role);

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

}

/** =====================================================================
 *  CREATE NOTES IN PREVENTIVE
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
                msg: 'No existe ningun Mantenimiento Preventivo con este ID'
            });
        }
        // SEARCH CLIENT

        // VALIDATE CEDULA
        const {...campos } = req.body;

        // UPDATE
        const preventiveUpdate = await Preventive.findByIdAndUpdate(preid, campos, { new: true, useFindAndModify: false })
            .populate('create', 'name role img')
            .populate('staff', 'name role img')
            .populate('client', 'name cedula phone email address city')
            .populate('product', 'code serial brand model year status estado next img pid');

        // TRANSFORMAR ROLE
        preventiveUpdate.staff.role = getRole(preventiveDB.staff.role);

        if (campos.check) {
            const frecuencia = campos.frecuencia;

            let next = new Date(Date.now());
            next = new Date(next.setMonth(next.getMonth() + frecuencia));

            await Product.findByIdAndUpdate(preventiveUpdate.product._id, ({ preventivo: false, next, frecuencia }), { new: true, useFindAndModify: false });

        }



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
                msg: 'No existe ningun Mantenimiento Preventivo con este ID'
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
    deletePreventives,
    getPreventiveId,
    postNotes,
    getPreventiveStaff,
    getPreventiveProduct
};