import React from 'react';
import { Link } from 'react-router-dom';
import ExportReportButton from './ExportReportButton';

const ReportCard = ({ report }) => {
  return (
    <div className="report-card">
      <h2>{report.type} Report</h2>
      <p>Total Bookings: {report.data.totalBookings}</p>
      <p>Generated At: {new Date(report.generatedAt).toLocaleString()}</p>
      <Link to={`/reports/${report._id}`}>View Details</Link>
      <ExportReportButton reportId={report._id} />
    </div>
  );
};

export default ReportCard;
