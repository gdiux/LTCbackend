const { Schema, model, connection } = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);

const ItemsSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    qty: {
        type: Number
    }
});

const ImgSchema = Schema({
    img: {
        type: String
    }

});

const VideoSchema = Schema({
    video: {
        type: String
    }

});

const CorrectivesSchema = Schema({

    control: {
        type: Number,
    },

    create: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },

    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    client: {
        type: Schema.Types.ObjectId,
        ref: 'Clients'
    },

    description: {
        type: String
    },

    note: {
        type: String
    },

    items: [ItemsSchema],

    imgBef: [ImgSchema],

    imgAft: [ImgSchema],

    video: [VideoSchema],

    status: {
        type: Boolean,
        default: true
    },

    estado: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    },

});

CorrectivesSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.coid = _id;
    return object;

});

CorrectivesSchema.plugin(autoIncrement.plugin, {
    model: 'Correctives',
    field: 'control',
    startAt: process.env.AUTOINCREMENT_INIT
});

module.exports = model('Correctives', CorrectivesSchema);