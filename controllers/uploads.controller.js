//
const path = require('path');
const fs = require('fs');

const webp = require('webp-converter');
webp.grant_permission();

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// HELPERS
const { updateImage } = require('../helpers/update-image');

/** =====================================================================
 *  UPLOADS
=========================================================================*/
const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;
    const desc = req.query.desc;

    const validType = ['products', 'logo', 'user', 'preventives'];

    // VALID TYPES
    if (!validType.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es invalido'
        });
    }

    // VALIDATE IMAGE
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No has seleccionado ningún archivo'
        });
    }

    // PROCESS IMAGE
    const file = req.files.image;
    const nameShort = file.name.split('.');
    const extFile = nameShort[nameShort.length - 1];

    // VALID EXT
    const validExt = ['jpg', 'png', 'jpeg', 'webp', 'bmp', 'svg'];
    if (!validExt.includes(extFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No se permite este tipo de imagen, solo extenciones JPG - PNG - WEBP - SVG'
        });
    }
    // VALID EXT

    // GENERATE NAME
    const nameFile = `${ uuidv4() }`;

    // PATH IMAGE
    const path = `./uploads/${ tipo }/${ nameFile }.${extFile}`;

    // method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la imagen'
            });
        }

        const result = webp.cwebp(path, `./uploads/${ tipo }/${nameFile}.webp`, "-q 80", logging = "-v");
        result.then((response) => {

            if (response) {

                if (fs.existsSync(path)) {
                    // DELET IMAGE OLD
                    fs.unlinkSync(path);
                }

                // UPDATE IMAGE
                updateImage(tipo, id, `${nameFile}.webp`, desc);

                res.json({
                    ok: true,
                    msg: 'Imagen Actualizada',
                    nombreArchivo: nameFile
                });
            }


        });

    });










};
/** =====================================================================
 *  UPLOADS
=========================================================================*/
/** =====================================================================
 *  GET IMAGES
=========================================================================*/
const getImages = (req, res = response) => {

    const tipo = req.params.tipo;
    const image = req.params.image;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${image}`);

    // IMAGE DEFAULT
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {

        // CHECK TYPE
        if (tipo !== 'user') {
            const pathImg = path.join(__dirname, `../uploads/default.png`);
            res.sendFile(pathImg);
        } else {
            const pathImg = path.join(__dirname, `../uploads/user/user-default.png`);
            res.sendFile(pathImg);
        }

    }

};
/** =====================================================================
 *  GET IMAGES
=========================================================================*/


// EXPORTS
module.exports = {
    fileUpload,
    getImages
};