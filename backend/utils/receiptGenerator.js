const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateReceipt(payment, booking) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `${payment.paymentType}_receipt_${Date.now()}.pdf`;
      const receiptDir = path.join(__dirname, "../receipts");

      // ✅ Ensure receipts folder exists
      if (!fs.existsSync(receiptDir)) {
        fs.mkdirSync(receiptDir);
      }

      const filePath = path.join(receiptDir, fileName);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Company Name Header
      doc.fontSize(22).fillColor('#0a4d8c').text("🎉 My Event Booking Company", { align: 'center' });
      doc.moveDown(1);

      // Receipt Title
      doc.fontSize(18).fillColor(payment.paymentType === 'Advance' ? '#e67e22' : '#27ae60')
        .text(payment.paymentType === 'Advance' ? 'Advance Payment Receipt' : 'Final Payment Receipt', { align: 'center' });
      doc.moveDown(1);

      // Line Separator
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      // Customer Info
      doc.moveDown();
      doc.fontSize(14).fillColor('#000').text(`Customer Name: `, { continued: true }).font('Helvetica-Bold').text(booking.customerName);
      doc.font('Helvetica').text(`Service: ${booking.service}`);
      doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`);
      doc.text(`Transaction ID: ${payment.transactionId}`);
      doc.text(`Payment Method: ${payment.method}`);
      doc.text(`Amount Paid: $${payment.amount}`);
      doc.moveDown();

      // Another Line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Payment Breakdown Section
      doc.fontSize(14).fillColor('#000');
      if (payment.paymentType === 'Advance') {
        doc.text(`Advance Paid: $${booking.advanceAmount}`, { continued: true })
           .font('Helvetica-Bold').text(`  (Partial Payment)`);
        doc.font('Helvetica').text(`Remaining Balance: $${booking.remainingAmount}`);
      } else {
        doc.text(`Total Price: $${booking.totalPrice}`);
        doc.text(`Advance Already Paid: $${booking.advanceAmount}`);
        doc.text(`Remaining Balance: $${booking.remainingAmount}`);
        doc.font('Helvetica-Bold').fillColor('#27ae60').text(`Final Settlement Completed ✅`);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(12).fillColor('#555').text("Thank you for choosing My Event Booking Company!", { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(`/receipts/${fileName}`));
      stream.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateReceipt;
