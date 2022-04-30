const fs = require('fs');

// MODELS
const Product = require('../models/products.model');
const User = require('../models/users.model');
const Datos = require('../models/datos.model');
const Department = require('../models/departments.model');

/** =====================================================================
 *  DELETE IMAGE
=========================================================================*/
const deleteImage = (path) => {

    // VALIDATE IMAGE
    if (fs.existsSync(path)) {
        // DELET IMAGE OLD
        fs.unlinkSync(path);
    }

};

/** =====================================================================
 *  DELETE IMAGE
=========================================================================*/


/** =====================================================================
 *  UPDATE IMAGE 
=========================================================================*/
const updateImage = async(tipo, id, nameFile) => {

    let pathOld = '';

    switch (tipo) {
        case 'products':

            // SEARCH PRODUCT BY ID
            const product = await Product.findById(id);
            if (!product) {
                return false;
            }

            pathOld = `./uploads/products/${ product.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            product.img = nameFile;
            await product.save();
            return true;

            // BREAK PRODUCT
            break;

        case 'user':

            // SEARCH USER BY ID
            const user = await User.findById(id);
            if (!user) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/user/${ user.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            user.img = nameFile;
            await user.save();
            return true;

            break;

        case 'logo':

            // SEARCH USER BY ID
            const datos = await Datos.findById(id);
            if (!datos) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/logo/${ datos.logo }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            datos.logo = nameFile;
            await datos.save();
            return true;

            break;
        
        case 'department':

            // SEARCH USER BY ID
            const department = await Department.findById(id);
            if (!department) {
                return false;
            }

            // VALIDATE IMAGE
            pathOld = `./uploads/logo/${ department.img }`;
            deleteImage(pathOld);

            // SAVE IMAGE
            department.img = nameFile;
            await department.save();
            return true;

            break;

        default:
            break;
    }


};
/** =====================================================================
 *  UPDATE IMAGE
=========================================================================*/




// EXPORT
module.exports = {
    updateImage
};