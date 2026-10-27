const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateTaxReceipt = (donorName, donationDetails) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const left = 54;
    const contentWidth = pageWidth - (left * 2);
    const colors = {
      forest: '#1A3A2A',       // Brand primary dark green
      forestMid: '#234D38',
      sage: '#4A8C6A',         // Sage green accent
      sageLight: '#EAF5F0',    // Light sage background
      mint: '#7EC8A0',         // Bright green accent
      amber: '#D4A843',        // Gold/Amber accent
      cream: '#FDF6EC',        // Creamy background color
      ink: '#1C2B22',          // Very dark green/charcoal for standard text
      muted: '#5A7A65',        // Muted text color
      line: '#E0EAE5',         // Soft border lines
      paper: '#FAF7F2',        // Very warm light background color
      white: '#FFFFFF'
    };
    
    // Create receipts folder if not exists
    const receiptsDir = path.join(__dirname, '../uploads/receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    const fileName = `Receipt_${Date.now()}.pdf`;
    const filePath = path.join(receiptsDir, fileName);
    
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const receiptId = `MB-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateLabel = new Date().toLocaleDateString('en-GB');
    const isFood = donationDetails.type === 'food';
    const details = isFood
      ? [
          ['Donation type', 'Food donation'],
          ['Item', donationDetails.foodName || 'Food contribution'],
          ['Quantity', `${donationDetails.quantity || '-'} ${donationDetails.unit || ''}`.trim()],
          ['People supported', `Approximately ${donationDetails.peopleServed || 0}`]
        ]
      : [
          ['Donation type', 'Financial donation'],
          ['Campaign', donationDetails.campaignName || 'General support'],
          ['Payment status', 'Confirmed']
        ];

    // Background and Header
    doc.rect(0, 0, pageWidth, pageHeight).fill(colors.paper);
    doc.rect(0, 0, pageWidth, 148).fill(colors.forest);

    // Dynamic Gradient for Logo Circle
    const logoGrad = doc.linearGradient(left, 36, left + 44, 80);
    logoGrad.stop(0, '#C8922A')
            .stop(1, '#8B6010');
    doc.circle(left + 22, 58, 22).fill(logoGrad);

    // Letter 'M' inside Logo Circle
    doc.font('Helvetica-Bold').fontSize(20).fillColor(colors.white).text('M', left + 14, 46, { width: 16, align: 'center' });

    // Logo text "MealBridge"
    doc.font('Helvetica-Bold').fontSize(25);
    doc.fillColor(colors.white).text('Meal', left + 58, 37, { continued: true });
    doc.fillColor(colors.amber).text('Bridge');

    // Slogan below logo text
    doc.font('Helvetica').fontSize(10).fillColor(colors.mint).text('CONNECTING KINDNESS WITH COMMUNITY', left + 60, 70);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.white).text('Official Tax Deduction Receipt', left, 105, { width: contentWidth, align: 'right' });

    // Receipt Metadata Card (overlapping header)
    doc.roundedRect(left, 122, contentWidth, 82, 8).fill(colors.white);
    doc.font('Helvetica').fontSize(9).fillColor(colors.muted).text('RECEIPT ID', left + 20, 140);
    doc.font('Helvetica-Bold').fontSize(15).fillColor(colors.ink).text(receiptId, left + 20, 155);
    doc.font('Helvetica').fontSize(9).fillColor(colors.muted).text('ISSUED ON', left + 230, 140);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(colors.ink).text(dateLabel, left + 230, 155);
    
    // Status Badge
    doc.roundedRect(left + contentWidth - 112, 143, 92, 28, 14).fill(colors.sageLight);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.sage).text('CONFIRMED', left + contentWidth - 112, 153, { width: 92, align: 'center' });

    // Donor Information
    doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.sage).text('DONOR INFORMATION', left, 238);
    doc.roundedRect(left, 258, contentWidth, 64, 6).fill(colors.white).stroke(colors.line);
    doc.font('Helvetica').fontSize(9).fillColor(colors.muted).text('NAME / ORGANIZATION', left + 18, 274);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.ink).text(String(donorName || 'Donor'), left + 18, 290, { width: contentWidth - 36 });

    // Donation Details
    doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.sage).text('DONATION DETAILS', left, 356);
    const detailTop = 376;
    const detailHeight = isFood ? 154 : 122;
    doc.roundedRect(left, detailTop, contentWidth, detailHeight, 6).fill(colors.white).stroke(colors.line);
    details.forEach(([label, value], index) => {
      const rowTop = detailTop + 18 + (index * 30);
      if (index > 0) doc.moveTo(left + 18, rowTop - 8).lineTo(left + contentWidth - 18, rowTop - 8).lineWidth(0.5).stroke(colors.line);
      doc.font('Helvetica').fontSize(10).fillColor(colors.muted).text(label, left + 18, rowTop);
      doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.ink).text(String(value), left + 180, rowTop, { width: contentWidth - 198, align: 'right' });
    });

    if (!isFood) {
      const amountTop = detailTop + detailHeight + 24;
      doc.roundedRect(left, amountTop, contentWidth, 76, 6).fill(colors.forest);
      doc.font('Helvetica').fontSize(10).fillColor('#BBE0CD').text('TOTAL CONTRIBUTION', left + 20, amountTop + 18);
      doc.font('Helvetica-Bold').fontSize(25).fillColor(colors.white).text(`LKR ${Number(donationDetails.amount || 0).toLocaleString()}`, left + 20, amountTop + 34);
    }

    const footerTop = pageHeight - 126;
    doc.moveTo(left, footerTop).lineTo(left + contentWidth, footerTop).lineWidth(1).stroke(colors.line);
    doc.font('Helvetica-Bold').fontSize(12).fillColor(colors.forest).text('Thank you for making a difference.', left, footerTop + 18);
    doc.font('Helvetica').fontSize(9).fillColor(colors.muted).text('This receipt is automatically generated by MealBridge and serves as an official acknowledgment of your charitable contribution. Keep this document for your tax records.', left, footerTop + 40, { width: contentWidth, align: 'left', lineGap: 3 });
    doc.font('Helvetica').fontSize(8).fillColor(colors.muted).text('MealBridge  |  Community care, made practical  |  This document is digitally issued.', left, pageHeight - 32, { width: contentWidth, align: 'center' });

    doc.end();

    writeStream.on('finish', () => {
      resolve(`/uploads/receipts/${fileName}`);
    });
    
    writeStream.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = { generateTaxReceipt };
