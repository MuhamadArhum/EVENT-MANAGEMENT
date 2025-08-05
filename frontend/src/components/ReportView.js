import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReportView = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/reports/${reportId}`);
        setReport(response.data.report);
      } catch (err) {
        console.error('Error fetching report', err);
      }
    };

    fetchReport();
  }, [reportId]);

  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{report.type} Report</h2>
      <p>Total Bookings: {report.data.totalBookings}</p>
      <ul>
        {report.data.bookings.map((booking, index) => (
          <li key={index}>
            Booking ID: {booking._id}, Date: {new Date(booking.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportView;
