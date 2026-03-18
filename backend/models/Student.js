const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    certId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        // required: true, // Optional if we don't have email for all historical data
    },
    domain: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    issuedDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active',
    },
});

module.exports = mongoose.model('Student', studentSchema);
