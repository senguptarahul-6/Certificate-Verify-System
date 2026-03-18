const express = require('express');
const router = express.Router();
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, getStudents).post(protect, admin, createStudent);
router
    .route('/:id')
    .get(protect, getStudent)
    .put(protect, admin, updateStudent)
    .delete(protect, admin, deleteStudent);

module.exports = router;
