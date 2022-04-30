const { Schema, model } = require('mongoose');

const ClientSchema = Schema({

    name: {
        type: String,
        require: true
    },
    cedula: {
        type: String,
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    department: {
        type: String
    },
    zip: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: true
    },
    credit: {
        type: Boolean,
        default: false
    },
    mayoreo: {
        type: Boolean,
        default: false
    },
    contratista: {
        type: Boolean,
        default: false
    },
    valid: {
        type: Boolean,
        default: false
    },
    img: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now
    }

});

ClientSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.cid = _id;
    return object;

});

module.exports = model('Clients', ClientSchema);