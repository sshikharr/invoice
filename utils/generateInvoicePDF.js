const puppeteer = require("puppeteer");

const generateInvoicePDF = async ({
  subTitle,
  invoiceNumber,
  invoiceDate,
  dueDate,
  businessLogoUrl,
  billedBy,
  billedTo,
  items,
  discount,
  additionalCharges,
  shippingCharges,
  total,
  signatureUrl,
  contactDetails,
  shippingDetails,
}) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Format dates
  const formattedInvoiceDate = new Date(invoiceDate).toLocaleDateString();
  const formattedDueDate = new Date(dueDate).toLocaleDateString();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 200px;
          max-height: 100px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .billed-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .shipping-details {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f8f8f8;
          border-radius: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f8f8f8;
        }
        .totals {
          float: right;
          width: 300px;
        }
        .totals table {
          width: 100%;
        }
        .totals td {
          border: none;
        }
        .signature {
          margin-top: 50px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${
          businessLogoUrl
            ? `<img src="${businessLogoUrl}" class="logo" alt="Business Logo">`
            : ""
        }
        <h1>${subTitle || "INVOICE"}</h1>
      </div>

      <div class="invoice-details">
        <div>
          <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p><strong>Invoice Date:</strong> ${formattedInvoiceDate}</p>
          <p><strong>Due Date:</strong> ${formattedDueDate}</p>
        </div>
      </div>

      <div class="billed-details">
        <div class="billed-by">
          <h3>Billed By</h3>
          <p>${billedBy.businessName}</p>
          <p>${billedBy.address}</p>
          <p><strong>Contact:</strong></p>
          <p>${contactDetails.name}</p>
          <p>${contactDetails.email}</p>
          <p>${contactDetails.phone}</p>
        </div>

        <div class="billed-to">
          <h3>Billed To</h3>
          <p>${billedTo.vendorId}</p>
        </div>
      </div>

      ${
        shippingDetails.recipientName
          ? `
        <div class="shipping-details">
          <h3>Shipping Details</h3>
          <p><strong>Recipient:</strong> ${shippingDetails.recipientName}</p>
          <p><strong>Address:</strong> ${shippingDetails.address}</p>
          <p><strong>City:</strong> ${shippingDetails.city}</p>
          <p><strong>State:</strong> ${shippingDetails.state}</p>
          <p><strong>ZIP Code:</strong> ${shippingDetails.zipCode}</p>
          <p><strong>Country:</strong> ${shippingDetails.country}</p>
          <p><strong>Phone:</strong> ${shippingDetails.phone}</p>
          ${
            shippingDetails.specialInstructions
              ? `
            <p><strong>Special Instructions:</strong> ${shippingDetails.specialInstructions}</p>
          `
              : ""
          }
        </div>
      `
          : ""
      }

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.description || ""}</td>
              <td>${item.quantity}</td>
              <td>${item.rate.toFixed(2)}</td>
              <td>${(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td>${(
              total +
              discount -
              additionalCharges -
              shippingCharges
            ).toFixed(2)}</td>
          </tr>
          ${
            discount
              ? `
            <tr>
              <td><strong>Discount:</strong></td>
              <td>-${discount.toFixed(2)}</td>
            </tr>
          `
              : ""
          }
          ${
            additionalCharges
              ? `
            <tr>
              <td><strong>Additional Charges:</strong></td>
              <td>${additionalCharges.toFixed(2)}</td>
            </tr>
          `
              : ""
          }
          ${
            shippingCharges
              ? `
            <tr>
              <td><strong>Shipping Charges:</strong></td>
              <td>${shippingCharges.toFixed(2)}</td>
            </tr>
          `
              : ""
          }
          <tr>
            <td><strong>Total:</strong></td>
            <td>${total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      ${
        signatureUrl
          ? `
        <div class="signature">
          <img src="${signatureUrl}" alt="Signature" style="max-width: 200px;">
          <p>Authorized Signature</p>
        </div>
      `
          : ""
      }
    </body>
    </html>
  `;

  await page.setContent(html);

  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: "20px",
      right: "20px",
      bottom: "20px",
      left: "20px",
    },
    printBackground: true,
  });

  await browser.close();
  return pdf;
};

module.exports = generateInvoicePDF;
