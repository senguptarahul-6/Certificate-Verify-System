const express = require('express');
const router = express.Router();
const {
    verifyCertificate,
    downloadCertificate,
} = require('../controllers/certificateController');

router.get('/verify/:certId', verifyCertificate);
router.get('/:certId/download', downloadCertificate);

module.exports = router;
