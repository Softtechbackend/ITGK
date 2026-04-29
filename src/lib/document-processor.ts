import mammoth from 'mammoth';
import PDFDocument from 'pdfkit';

export interface TemplateData {
  [key: string]: string | number | boolean;
}

/**
 * Process a DOCX template and replace placeholders with data
 * Placeholders in Word should be formatted as {{KEY_NAME}}
 */
export async function processDocxTemplate(
  docxBuffer: Buffer,
  data: TemplateData
): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: docxBuffer });
    let html = result.value;

    // Replace placeholders with data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(placeholder, String(value));
    });

    return html;
  } catch (error) {
    throw new Error(`Failed to process DOCX template: ${error}`);
  }
}

/**
 * Convert HTML content to PDF
 */
export async function htmlToPdf(htmlContent: string, title: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on('error', reject);

      // Simple HTML to text conversion
      const text = htmlContent
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .trim();

      // Add title
      doc.fontSize(16).font('Helvetica-Bold').text(title, { align: 'center' });
      doc.moveDown();

      // Add content
      doc.fontSize(11).font('Helvetica').text(text, {
        align: 'left',
        width: 500,
      });

      // Add footer
      doc.moveDown();
      doc.fontSize(8).text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, {
        align: 'center',
        color: '#999999',
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Full pipeline: DOCX template -> HTML -> PDF
 */
export async function generatePdfFromTemplate(
  docxBuffer: Buffer,
  templateData: TemplateData,
  documentTitle: string
): Promise<Buffer> {
  try {
    const html = await processDocxTemplate(docxBuffer, templateData);
    const pdf = await htmlToPdf(html, documentTitle);
    return pdf;
  } catch (error) {
    throw new Error(`Failed to generate PDF from template: ${error}`);
  }
}

/**
 * Generate a quotation PDF
 */
export async function generateQuotationPdf(
  docxBuffer: Buffer,
  quotationData: QuotationData
): Promise<Buffer> {
  const templateData = {
    PARTNER_NAME: quotationData.partnerName,
    CUSTOMER_NAME: quotationData.customerName,
    SYSTEM_CAPACITY: quotationData.systemCapacity,
    ESTIMATED_COST: quotationData.estimatedCost,
    INSTALLATION_TIMELINE: quotationData.installationTimeline,
    WARRANTY_PERIOD: quotationData.warrantyPeriod,
    QUOTATION_DATE: new Date().toLocaleDateString('en-IN'),
  };

  return generatePdfFromTemplate(docxBuffer, templateData, 'Solar Installation Quotation');
}

/**
 * Generate an agreement PDF
 */
export async function generateAgreementPdf(
  docxBuffer: Buffer,
  agreementData: AgreementData
): Promise<Buffer> {
  const templateData = {
    PARTNER_NAME: agreementData.partnerName,
    COMPANY_NAME: agreementData.companyName,
    EFFECTIVE_DATE: agreementData.effectiveDate,
    AGREEMENT_TERMS: agreementData.terms,
    SERVICE_SCOPE: agreementData.serviceScope,
  };

  return generatePdfFromTemplate(docxBuffer, templateData, 'Vendor Agreement');
}

/**
 * Generate a work completion certificate PDF
 */
export async function generateCertificatePdf(
  docxBuffer: Buffer,
  certificateData: CertificateData
): Promise<Buffer> {
  const templateData = {
    PROJECT_NAME: certificateData.projectName,
    COMPLETION_DATE: certificateData.completionDate,
    INSPECTOR_NAME: certificateData.inspectorName,
    PROJECT_DETAILS: certificateData.projectDetails,
    CERTIFICATE_NUMBER: certificateData.certificateNumber,
  };

  return generatePdfFromTemplate(docxBuffer, templateData, 'Work Completion Certificate');
}

/**
 * Generate an invoice PDF
 */
export async function generateInvoicePdf(
  docxBuffer: Buffer,
  invoiceData: InvoiceData
): Promise<Buffer> {
  const templateData = {
    INVOICE_NUMBER: invoiceData.invoiceNumber,
    INVOICE_DATE: invoiceData.invoiceDate,
    CUSTOMER_NAME: invoiceData.customerName,
    CUSTOMER_ADDRESS: invoiceData.customerAddress,
    AMOUNT: invoiceData.amount,
    TAX: invoiceData.tax,
    TOTAL: invoiceData.total,
    DUE_DATE: invoiceData.dueDate,
  };

  return generatePdfFromTemplate(docxBuffer, templateData, 'Invoice');
}

// Type definitions for specific document types
export interface QuotationData {
  partnerName: string;
  customerName: string;
  systemCapacity: number;
  estimatedCost: number;
  installationTimeline: string;
  warrantyPeriod: number;
}

export interface AgreementData {
  partnerName: string;
  companyName: string;
  effectiveDate: string;
  terms: string;
  serviceScope: string;
}

export interface CertificateData {
  projectName: string;
  completionDate: string;
  inspectorName: string;
  projectDetails: string;
  certificateNumber: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerAddress: string;
  amount: number;
  tax: number;
  total: number;
  dueDate: string;
}
