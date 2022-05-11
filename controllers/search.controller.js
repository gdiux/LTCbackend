const { response } = require('express');

const User = require('../models/users.model');
const Client = require('../models/clients.model');
const Product = require('../models/products.model');
const Preventive = require('../models/preventives.model');

/** =====================================================================
 *  SEARCH FOR TABLE
=========================================================================*/
const search = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regex = new RegExp(busqueda, 'i');
    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 50;

    let data = [];
    let total;

    switch (tabla) {

        case 'users':

            // data = await User.find({ name: regex });
            [data, total] = await Promise.all([
                User.find({
                    $or: [
                        { usuario: regex },
                        { name: regex },
                        { role: regex },
                        { address: regex }
                    ]
                }),
                User.countDocuments()
            ]);
            break;


        case 'clients':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Client.find({
                    $or: [
                        { name: regex },
                        { cedula: regex },
                        { phone: regex },
                        { email: regex },
                        { address: regex },
                        { city: regex },
                        { Department: regex }
                    ]
                }),
                Client.countDocuments()
            ]);
            break;
        case 'products':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Product.find({
                    $or: [
                        { code: regex },
                        { serial: regex },
                        { brand: regex },
                        { model: regex },
                        { estado: regex }
                    ]
                })
                .populate('client', 'name phone cid'),
                Product.countDocuments()
            ]);
            break;

        case 'preventives':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Preventive.find({
                    $or: [
                        { control: regex },
                        { estado: regex }
                    ]
                })
                .populate('client', 'name cedula phone email address city')
                .populate('create', 'name')
                .populate('staff', 'name')
                .populate('product', 'code serial brand model year status estado next img'),
                Preventive.countDocuments()
            ]);
            break;

        default:
            res.status(400).json({
                ok: false,
                msg: 'Error en los parametros de la busquedad'
            });
            break;

    }

    res.json({
        ok: true,
        resultados: data,
        total
    });

};
/** =====================================================================
 *  SEARCH FOR TABLE
=========================================================================*/


// EXPORTS
module.exports = {
    search
};