const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const parseExcel = require('../utils/parseExcel');
const Student = require('../models/Student');
const { protect, admin } = require('../middleware/auth');
const fs = require('fs');

// @desc    Upload students via Excel/CSV
// @route   POST /api/upload/students
// @access  Private (Admin)
router.post('/students', protect, admin, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
        // Parse file
        const data = parseExcel(req.file.path);

        // Validate and process data
        const students = [];
        const errors = [];

        for (const row of data) {
            // Basic validation
            if (!row['Certificate ID'] || !row['Student Name'] || !row['Domain']) {
                errors.push(`Skipped row with missing required fields: ${JSON.stringify(row)}`);
                continue;
            }

            // Check for duplicates in DB
            const exists = await Student.findOne({ certId: row['Certificate ID'] });
            if (exists) {
                errors.push(`Certificate ID ${row['Certificate ID']} already exists. Skipped.`);
                continue;
            }

            // Add to batch
            students.push({
                certId: row['Certificate ID'],
                name: row['Student Name'],
                domain: row['Domain'],
                startDate: new Date(row['Start Date']),
                endDate: new Date(row['End Date']),
            });
        }

        // Bulk insert
        if (students.length > 0) {
            await Student.insertMany(students);
        }

        // Cleanup file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: `Successfully added ${students.length} students.`,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        // Cleanup file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
