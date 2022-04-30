const { response } = require('express');

const Product = require('../models/products.model');

/** =====================================================================
 *  GET PRODUCTS
=========================================================================*/
const getProducts = async(req, res = response) => {

    try {

        const tipo = req.query.tipo || 'none';
        const department = req.query.departamento || 'none';
        const valor = req.query.valor || 'false';
        const initial = req.query.initial || '01/01/2001';
        const end = req.query.end || new Date();
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        const status = req.query.status || false;

        let products;
        switch (tipo) {
            case 'agotados':

                if (department !== 'none') {

                    products = await Product.find({ department: department, out: valor })
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .sort({ out: -1 })
                        .skip(desde)
                        .limit(1000);

                } else {

                    products = await Product.find({ out: valor })
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .sort({ out: -1 })
                        .skip(desde)
                        .limit(1000);
                }


                break;
            case 'vencidos':

                if (department !== 'none') {

                    products = await Product.find({
                            department: department,
                            $and: [{ expiration: { $gte: new Date(initial), $lt: new Date(end) } }]
                        })
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .skip(desde)
                        .limit(limite);

                } else {

                    products = await Product.find({
                            $and: [{ expiration: { $gte: new Date(initial), $lt: new Date(end) } }],
                        })
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .skip(desde)
                        .limit(limite);
                }

                // products = expirateProduct(productos);
                for (let i = 0; i < products.length; i++) {

                    if (!products[i].vencido) {

                        products[i].vencido = true;

                        // ACTUALIZAMOS
                        const productUpdate = await Product.findByIdAndUpdate(products[i]._id, products[i], { new: true, useFindAndModify: false });

                    }
                }

                break;
            case 'top':

                if (department !== 'none') {

                    products = await Product.find({ department: department, out: valor })
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .sort({ sold: -1 })
                        .skip(desde)
                        .limit(limite);

                } else {

                    products = await Product.find()
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .sort({ sold: -1 })
                        .skip(desde)
                        .limit(limite);
                }

                break;
            case 'none':

                if (department !== 'none') {

                    products = await Product.find({ department: department })
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .skip(desde)
                        .limit(1000);

                } else {

                    products = await Product.find()
                        .populate('kit.product', 'name')
                        .populate('department', 'name')
                        .skip(desde)
                        .limit(limite);

                }

                break;

            default:
                break;
        }

        const total = await Product.countDocuments();

        res.json({
            ok: true,
            products,
            total
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
 *  GET PRODUCTS
=========================================================================*/

/** =====================================================================
 *  GET PRODUTS FOR ID
=========================================================================*/
const oneProduct = async(req, res = response) => {

    const id = req.params.id;

    try {

        const product = await Product.findById(id)
            .populate('kit.product', 'name')
            .populate('department', 'name');

        res.json({
            ok: true,
            product
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
 *  GET PRODUCTS BY CODE
=========================================================================*/
const codeProduct = async(req, res = response) => {

    try {

        const code = new RegExp(req.params.code, 'i');

        const product = await Product.findOne({
                $or: [
                    { code: code }
                ],
                status: true
            })
            .populate('kit.product', 'name')
            .populate('department', 'name');

        res.json({
            ok: true,
            product
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
 *  GET PRODUCTS EXCEL
=========================================================================*/
const productsExcel = async(req, res = response) => {

    try {

        const products = await Product.find({}, 'code name type cost inventario gain price wholesale department stock bought sold returned damaged fecha');

        res.json({
            ok: true,
            products
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }


}

/** =====================================================================
 *  CREATE PRODUCT
=========================================================================*/
const createProduct = async(req, res = response) => {

    const { code, name } = req.body;

    try {

        // VALIDATE CODE
        const validateCode = await Product.findOne({ code });
        if (validateCode) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un producto con este codigo de barras'
            });
        }

        // SAVE PRODUCT
        const product = new Product(req.body);
        product.inventario = product.stock;

        await product.save();

        res.json({
            ok: true,
            product
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
 *  CREATE PRODUCT
=========================================================================*/

/** =====================================================================
 *  UPDATE PRODUCT
=========================================================================*/
const updateProduct = async(req, res = response) => {

    const pid = req.params.id;

    const user = req.uid;

    try {

        // SEARCH PRODUCT
        const productDB = await Product.findById({ _id: pid });
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun producto con este ID'
            });
        }
        // SEARCH PRODUCT

        // VALIDATE CODE && NAME
        const { code, name, ...campos } = req.body;

        // CODE
        if (String(productDB.code) !== String(code)) {
            const validateCode = await Product.findOne({ code });
            if (validateCode) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con este codigo de barras'
                });
            }
        }

        // NAME
        if (productDB.name !== name) {
            const validateName = await Product.findOne({ name });
            if (validateName) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con este nombre'
                });
            }
        }

        // COMPROBAR SI CAMBIO LA FECHA DE VENCIMIENTO
        if (campos.expiration) {
            if (Date.parse(campos.expiration) > Date.parse(productDB.expiration)) {
                campos.vencido = false;
            }
        }

        if (productDB.type === 'Paquete') {
            campos.out = false;
            campos.low = false;
        }
        // COMPROBAR SI EL PRODUCTO SE AGOTA

        // UPDATE
        campos.code = code;
        campos.name = name;
        const productUpdate = await Product.findByIdAndUpdate(pid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            product: productUpdate
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
 *  UPDATE PRODUCT
=========================================================================*/

/** =====================================================================
 *  DELETE PRODUCT
=========================================================================*/
const deleteProduct = async(req, res = response) => {

    const _id = req.params.id;

    try {

        // SEARCH PRODUCT
        const productDB = await Product.findById({ _id });
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun producto con este ID'
            });
        }
        // SEARCH PRODUCT

        // CHANGE STATUS
        if (productDB.status === true) {
            productDB.status = false;
        } else {
            productDB.status = true;
        }
        // CHANGE STATUS

        const productUpdate = await Product.findByIdAndUpdate(_id, productDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            product: productUpdate
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
 *  DELETE PRODUCT
=========================================================================*/

// EXPORTS
module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    oneProduct,
    codeProduct,
    productsExcel
};