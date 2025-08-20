import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport, getReports } from '../redux/reportActions';
import ReportCard from '../components/ReportCard';
import ReportFilter from '../components/ReportFilter';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.reports);

  const [filters, setFilters] = useState({
    type: 'Daily',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    dispatch(getReports(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleGenerateReport = () => {
    dispatch(generateReport(filters));
  };

  return (
    <div className='container mt-5'>
      <h2>Reports</h2>
      <ReportFilter filters={filters} onChange={handleFilterChange} onGenerate={handleGenerateReport} />
      
      {loading && <p className='loading-text'>Loading reports...</p>}
      {error && <p className='error-text'>{error}</p>}

      <div className='reports-list'>
        {reports && reports.map(report => (
          <ReportCard key={report._id} report={report} />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
