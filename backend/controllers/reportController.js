const Report = require('../models/Report');
const Booking = require('../models/Booking');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// 📌 Generate Report
const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    const today = new Date();
    let queryStart, queryEnd;

    if (startDate && endDate) {
      // ✅ Custom Date Range
      queryStart = new Date(startDate);
      queryEnd = new Date(endDate);
    } else {
      // ✅ Predefined Types
      if (type === 'Daily') {
        queryStart = new Date(today.setHours(0, 0, 0, 0));
        queryEnd = new Date();
      } 
      else if (type === 'Weekly') {
        queryStart = new Date(today.setDate(today.getDate() - 7));
        queryEnd = new Date();
      } 
      else if (type === 'Monthly') {
        queryStart = new Date(today.setMonth(today.getMonth() - 1));
        queryEnd = new Date();
      } 
      else if (type === 'Yearly') {
        queryStart = new Date(today.setFullYear(today.getFullYear() - 1));
        queryEnd = new Date();
      } 
      else {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid type or custom date range required' 
        });
      }
    }

    const bookings = await Booking.find({ createdAt: { $gte: queryStart, $lte: queryEnd } });

    const report = new Report({
      type: startDate && endDate ? 'Custom' : type,
      createdBy: req.user.userId,
      data: { totalBookings: bookings.length, bookings }
    });

    await report.save();

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Get All Reports
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    let filter = {};
    if (type) filter.type = type;
    if (search) filter["data.totalBookings"] = { $gte: parseInt(search) || 0 };

    const reports = await Report.find(filter)
      .populate("createdBy", "username email")
      .sort({ generatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalReports = await Report.countDocuments(filter);

    res.json({
      success: true,
      totalReports,
      currentPage: Number(page),
      totalPages: Math.ceil(totalReports / limit),
      reports
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Export CSV
const exportCSV = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    if (!report.data.bookings || report.data.bookings.length === 0) {
      return res.status(400).json({ success: false, message: "No bookings found in this report" });
    }

    const parser = new Parser({ fields: ["_id", "createdAt"] }); // ✅ safe fields define karo
    const csv = parser.parse(report.data.bookings);

    res.header('Content-Type', 'text/csv');
    res.attachment(`report_${report.type}.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 📌 Export PDF
const exportPDF = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', `attachment; filename=report_${report.type}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(20).text(`Report - ${report.type}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Total Bookings: ${report.data.totalBookings}`);
    doc.moveDown();

    report.data.bookings.forEach((b, i) => {
      doc.text(`${i + 1}. Booking ID: ${b._id} | Date: ${new Date(b.createdAt).toLocaleString()}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Bulk Export CSV
const bulkExportCSV = async (req, res) => {
  try {
    const { reportIds } = req.body;
    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ success: false, message: "reportIds array required" });
    }

    const reports = await Report.find({ _id: { $in: reportIds } });
    if (!reports || reports.length === 0) {
      return res.status(404).json({ success: false, message: "Reports not found" });
    }

    const allBookings = reports.flatMap(r => 
      (r.data.bookings || []).map(b => ({
        reportId: r._id,
        reportType: r.type,
        bookingId: b._id,
        createdAt: b.createdAt
      }))
    );

    if (allBookings.length === 0) {
      return res.status(400).json({ success: false, message: "No bookings available in selected reports" });
    }

    const parser = new Parser({ fields: ["reportId", "reportType", "bookingId", "createdAt"] }); // ✅ fields set
    const csv = parser.parse(allBookings);

    res.header('Content-Type', 'text/csv');
    res.attachment(`bulk_reports.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ Proper export of all functions
module.exports = {
  generateReport,
  getReports,
  exportCSV,
  exportPDF,
  bulkExportCSV
};
