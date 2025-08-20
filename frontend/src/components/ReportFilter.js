import React from 'react';

const ReportFilter = ({ filters, onChange, onGenerate }) => {
  return (
    <div>
      <select name="type" value={filters.type} onChange={onChange}>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
        <option value="Custom">Custom Date Range</option>
      </select>
      
      {filters.type === 'Custom' && (
        <div>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onChange}
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onChange}
          />
        </div>
      )}

      <button className='btn btn-primary' onClick={onGenerate}>Generate Report</button>
    </div>
  );
};

export default ReportFilter;
