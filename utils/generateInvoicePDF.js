const PDFDocument = require('pdfkit');

const generateInvoicePDF = async (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];
      // Collect the PDF data chunks
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12);
      doc.text(`Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString() || ''}`);
      doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString() || ''}`);
      doc.moveDown();

      // Business Details
      doc.text('Billed By:');
      doc.text(invoiceData.billedBy?.businessName || '');
      doc.text(invoiceData.billedBy?.address || '');
      doc.moveDown();

      // Contact Details
      doc.text('Contact Details:');
      doc.text(`Name: ${invoiceData.contactDetails?.name || ''}`);
      doc.text(`Email: ${invoiceData.contactDetails?.email || ''}`);
      doc.text(`Phone: ${invoiceData.contactDetails?.phone || ''}`);
      doc.moveDown();

      // Items Table
      doc.text('Items:', { underline: true });
      doc.moveDown();

      // Table headers
      const tableTop = doc.y;
      doc.text('Item', 50, tableTop);
      doc.text('HSN', 200, tableTop);
      doc.text('Qty', 280, tableTop);
      doc.text('Rate', 350, tableTop);
      doc.text('Amount', 450, tableTop);
      let tableRow = tableTop + 20;

      // Items
      invoiceData.items.forEach(item => {
        doc.text(item.name || '', 50, tableRow);
        doc.text(item.hsn || '', 200, tableRow);
        doc.text((item.quantity || 0).toString(), 280, tableRow);
        doc.text((item.rate || 0).toString(), 350, tableRow);
        doc.text((item.amount || 0).toString(), 450, tableRow);
        tableRow += 20;
      });

      doc.moveDown();
      doc.moveDown();

      // Totals
      doc.text(`Subtotal: ₹${invoiceData.total || 0}`, { align: 'right' });
      if (invoiceData.discount) {
        doc.text(`Discount: ₹${invoiceData.discount}`, { align: 'right' });
      }
      if (invoiceData.additionalCharges) {
        doc.text(`Additional Charges: ₹${invoiceData.additionalCharges}`, { align: 'right' });
      }
      if (invoiceData.shippingCharges) {
        doc.text(`Shipping Charges: ₹${invoiceData.shippingCharges}`, { align: 'right' });
      }
      doc.text(`Total: ₹${invoiceData.total || 0}`, { align: 'right' });

      // Shipping Details if provided
      if (invoiceData.shippingDetails && invoiceData.shippingDetails.recipientName) {
        doc.moveDown();
        doc.text('Shipping Details:', { underline: true });
        doc.text(`Recipient: ${invoiceData.shippingDetails.recipientName}`);
        doc.text(`Address: ${invoiceData.shippingDetails.address || ''}`);
        doc.text(`${invoiceData.shippingDetails.city || ''}, ${invoiceData.shippingDetails.state || ''} ${invoiceData.shippingDetails.zipCode || ''}`);
        doc.text(`Country: ${invoiceData.shippingDetails.country || ''}`);
        if (invoiceData.shippingDetails.specialInstructions) {
          doc.text(`Special Instructions: ${invoiceData.shippingDetails.specialInstructions}`);
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateInvoicePDF;
