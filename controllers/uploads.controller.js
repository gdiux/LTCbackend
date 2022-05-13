//

const path = require('path');
const fs = require('fs');

const sharp = require('sharp');

// INSTALL WEB CONVERTER
// const webp = require('webp-converter');
// webp.grant_permission();

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

// HELPERS
const { updateImage } = require('../helpers/update-image');

// MODELS
const Preventive = require('../models/preventives.model');

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
    const file = await sharp(req.files.image.data).metadata();

    // const nameShort = file.format.split('.');
    const extFile = file.format;

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
    const nameFile = `${ uuidv4() }.webp`;

    // PATH IMAGE
    const path = `./uploads/${ tipo }/${ nameFile }`;

    // CONVERTIR A WEBP
    sharp(req.files.image.data)
        .resize(1024, 768)
        .webp({ equality: 75, effort: 6 })
        .toFile(path, (err, info) => {

            // UPDATE IMAGE
            updateImage(tipo, id, nameFile, desc);

            res.json({
                ok: true,
                msg: 'Imagen Actualizada',
                nombreArchivo: nameFile
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

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/
const deleteImg = async(req, res = response) => {

    try {
        const type = req.params.type;
        const id = req.params.id;
        const desc = req.params.desc;
        const img = req.params.img;

        switch (type) {
            case 'preventives':

                let preventiveUpdate;
                if (desc === 'imgBef') {
                    // const imgBef = {
                    //     _id: imgId,
                    //     img
                    // };
                    preventiveUpdate = await Preventive.updateOne({ _id: id }, { $pull: { imgBef: { img } } });
                } else if (desc === 'imgAft') {
                    // const imgAft = {
                    //     _id: imgId,
                    //     img
                    // };
                    preventiveUpdate = await Preventive.updateOne({ _id: id }, { $pull: { imgAft: { img } } });
                }

                // VERIFICAR SI SE ACTUALIZO
                if (preventiveUpdate.nModified === 0) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se pudo eliminar esta imagen, porfavor intente de nuevo'
                    });
                }

                // ELIMINAR IMAGEN DE LA CARPETA
                const path = `./uploads/${ type }/${ img }`;
                if (fs.existsSync(path)) {
                    // DELET IMAGE OLD
                    fs.unlinkSync(path);
                }


                const preventive = await Preventive.findById(id)
                    .populate('create', 'name role img')
                    .populate('staff', 'name role img')
                    .populate('notes.staff', 'name role img')
                    .populate('client', 'name cedula phone email address city')
                    .populate('product', 'code serial brand model year status estado next img');

                res.json({
                    ok: true,
                    preventive
                });

                break;

            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Ha ocurrido un error, porfavor intente de nuevo'
                });
                break;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** =====================================================================
 *  DELETE IMAGES
=========================================================================*/

// EXPORTS
module.exports = {
    fileUpload,
    getImages,
    deleteImg
};