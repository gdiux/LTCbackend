const fs = require('fs');

// MODELS
const Product = require('../models/products.model');
const User = require('../models/users.model');
const Preventive = require('../models/preventives.model');

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
const updateImage = async(tipo, id, nameFile, desc) => {

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
        case 'preventives':

            // SEARCH USER BY ID
            const preventivesDB = await Preventive.findById(id);
            if (!preventivesDB) {
                return false;
            }

            // SAVE IMAGE imgBef imgAft video
            console.log(desc);

            if (desc === 'imgBef') {
                console.log('imagen antes');
                preventivesDB.imgBef.push({
                    img: nameFile
                });
                await preventivesDB.save();
            } else if (desc === 'imgAft') {

                console.log('imagen Despues');
                preventivesDB.imgAft.push({
                    img: nameFile
                });

                await preventivesDB.save();

            } else if (desc === 'video') {
                console.log('Video');

                preventivesDB.video.push({
                    video: nameFile
                });

                await preventivesDB.save();
            } else {
                console.log('No IMG');
                return false;
            }


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