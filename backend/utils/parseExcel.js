const xlsx = require('xlsx');

const parseExcel = (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = xlsx.utils.sheet_to_json(worksheet);

        return data;
    } catch (error) {
        throw new Error('Error parsing Excel file: ' + error.message);
    }
};

module.exports = parseExcel;
