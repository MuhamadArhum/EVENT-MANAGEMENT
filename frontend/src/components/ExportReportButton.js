import React from 'react';

const ExportReportButton = ({ reportId }) => {
  const handleExportCSV = () => {
    // Call backend to export CSV
    window.location.href = `/api/reports/export/csv/${reportId}`;
  };

  const handleExportPDF = () => {
    // Call backend to export PDF
    window.location.href = `/api/reports/export/pdf/${reportId}`;
  };

  return (
    <div>
      <button onClick={handleExportCSV}>Export as CSV</button>
      <button onClick={handleExportPDF}>Export as PDF</button>
    </div>
  );
};

export default ExportReportButton;
