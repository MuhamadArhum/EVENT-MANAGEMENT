const express = require('express');
const router = express.Router();
const { generateReport, getReports, exportCSV, exportPDF, bulkExportCSV } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Generate Report
router.post('/generate', authMiddleware, roleMiddleware(['Admin']), generateReport);

// ✅ Get Reports List
router.get('/', authMiddleware, roleMiddleware(['Admin']), getReports);

// ✅ Export Single Report
router.get('/export/csv/:id', authMiddleware, roleMiddleware(['Admin']), exportCSV);
router.get('/export/pdf/:id', authMiddleware, roleMiddleware(['Admin']), exportPDF);

// ✅ Bulk Export CSV
router.post('/export/bulk-csv', authMiddleware, roleMiddleware(['Admin']), bulkExportCSV);

module.exports = router;
