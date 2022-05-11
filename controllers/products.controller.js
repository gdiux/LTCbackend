const { response } = require('express');

const Product = require('../models/products.model');

/** =====================================================================
 *  GET PRODUCTS
=========================================================================*/
const getProducts = async(req, res = response) => {

    try {

        const tipo = req.query.tipo || 'none';
        const brand = req.query.brand || 'none';
        const valor = req.query.valor || 'false';
        const initial = req.query.initial || '01/01/2001';
        const end = req.query.end || new Date();
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        const status = req.query.status || false;

        const products = await Product.find()
            .populate('client', 'name cid')
            .skip(desde)
            .limit(limite);

        // let products;
        // switch (tipo) {
        //     case 'brand':

        //         if (brand !== 'none') {

        //             products = await Product.find({ brand: brand })
        //                 .populate('Clients', 'name')
        //                 .sort({ out: -1 })
        //                 .skip(desde)
        //                 .limit(1000);

        //         } else {

        //             products = await Product.find()
        //                 .populate('Clients', 'name')
        //                 .sort({ out: -1 })
        //                 .skip(desde)
        //                 .limit(1000);
        //         }


        //         break;
        //     case 'none':

        //         if (brand !== 'none') {

        //             products = await Product.find({ brand: brand })
        //                 .populate('Clients', 'name')
        //                 .skip(desde)
        //                 .limit(1000);

        //         } else {

        //             products = await Product.find()
        //                 .populate('Clients', 'name')
        //                 .skip(desde)
        //                 .limit(limite);

        //         }

        //         break;

        //     default:
        //         break;
        // }

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
            .populate('brand', 'name');

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

        const products = await Product.find({}, 'code name type cost inventario gain price wholesale brand stock bought sold returned damaged fecha');

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
 *  UPDATE CLIENT PRODUCT 
=========================================================================*/
const updateClientProduct = async(req, res = response) => {

    try {

        const pid = req.params.product;
        const {...campos } = req.body;

        // SEARCH PRODUCT
        const productDB = await Product.findById({ _id: pid })
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun producto con este ID'
            });
        }

        const productUpdate = await Product.findByIdAndUpdate(pid, campos, { new: true, useFindAndModify: false })
            .populate('client', 'name cid');

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
 *  UPDATE CLIENT PRODUCT
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
    updateClientProduct,
    productsExcel
};