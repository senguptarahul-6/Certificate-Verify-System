const Student = require('../models/Student');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Verify certificate check
// @route   GET /api/certificates/verify/:certId
// @access  Public
const verifyCertificate = async (req, res) => {
    try {
        const student = await Student.findOne({ certId: req.params.certId });

        if (!student) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        if (student.status === 'revoked') {
            return res.status(400).json({ message: 'Certificate has been revoked' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Certificate PDF
// @route   GET /api/certificates/:certId/download
// @access  Public
const downloadCertificate = async (req, res) => {
    try {
        const student = await Student.findOne({ certId: req.params.certId });

        if (!student) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Create PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
        });

        // Pipe PDF to response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=certificate-${student.certId}.pdf`
        );
        doc.pipe(res);

        // Add content to PDF (Basic implementation)
        // In a real app, you'd load a template image or use sophisticated layout

        // Border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#4bb564');
        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70).stroke('#d4af37');

        // Header
        doc.fontSize(30).fillColor('#4bb564').text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
        doc.moveDown();

        // Body
        doc.fontSize(16).fillColor('#333').text('This is to certify that', { align: 'center' });
        doc.moveDown();

        doc.fontSize(40).fillColor('#000').text(student.name, { align: 'center' });
        doc.moveDown(0.5);

        doc.fontSize(16).fillColor('#333').text('has successfully completed the internship program in', { align: 'center' });
        doc.moveDown();

        doc.fontSize(25).fillColor('#4bb564').text(student.domain, { align: 'center' });
        doc.moveDown();

        // Format dates
        const startDate = new Date(student.startDate).toLocaleDateString('en-GB');
        const endDate = new Date(student.endDate).toLocaleDateString('en-GB');

        doc.fontSize(16).fillColor('#666').text(`from ${startDate} to ${endDate}`, { align: 'center' });

        // ID
        doc.moveDown(4);
        doc.fontSize(12).fillColor('#333').text(`Certificate ID: ${student.certId}`, { align: 'center' });

        // Footer
        doc.text('Verified by Certificate Verification System', 0, doc.page.height - 50, { align: 'center' });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};

module.exports = {
    verifyCertificate,
    downloadCertificate,
};
