const { Schema, model } = require('mongoose');

const ProductSchema = Schema({

    code: {
        type: String,
        require: true,
        unique: true
    },

    serial: {
        type: String,
        require: true,
        unique: true
    },

    brand: {
        type: String
    },

    model: {
        type: String
    },

    year: {
        type: Number
    },

    status: {
        type: Boolean,
        default: true
    },

    estado: {
        type: String
    },

    client: {
        type: Schema.Types.ObjectId
    },

    next: {
        type: Date
    },

    date: {
        type: Date,
        default: Date.now
    }

});

ProductSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.pid = _id;
    return object;

});

module.exports = model('Product', ProductSchema);