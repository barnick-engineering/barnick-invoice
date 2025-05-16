"use client";

import type { InvoiceData } from "@/types/invoice";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  // Format document type for display
  const getDocumentTypeDisplay = () => {
    switch (data.documentType) {
      case "invoice":
        return "INVOICE";
      case "delivery-challan":
        return "DELIVERY CHALLAN";
      case "quotation":
        return "QUOTATION";
      default:
        return "DOCUMENT";
    }
  };

  const documentTypeDisplay = getDocumentTypeDisplay();

  return (
    <div className="bg-white w-full max-w-[800px] mx-auto shadow-lg print:shadow-none print:w-full print:max-w-none print:mx-0 print:p-0 print:overflow-hidden relative">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
          .invoice-content {
            margin-bottom: 180px; /* Space for footer */
          }
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="relative h-[150px] w-full print:h-[100px]">
        {/* Logo and company name */}
        <div className="absolute top-8 left-8 flex items-center z-10">
          <div className="relative w-16 h-16 print:w-12 print:h-12 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Barnick Pracharani Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="ml-4">
            <h1 className="text-[#1e4e6c] text-3xl font-bold print:text-2xl">
              BARNICK
            </h1>
            <h1 className="text-[#1e4e6c] text-3xl font-bold print:text-2xl">
              PRACHARANI
            </h1>
          </div>
        </div>

        {/* Orange triangle */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[150px] border-t-[#ff8c42] border-l-[150px] border-l-transparent z-0 print:border-t-[100px] print:border-l-[100px]"></div>

        {/* Blue triangle */}
        <div className="absolute top-0 right-0 w-0 h-0 border-b-[120px] border-b-[#1e4e6c] border-l-[120px] border-l-transparent z-0 print:border-b-[80px] print:border-l-[80px]"></div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-8 py-6 print:px-6 print:py-6 invoice-content">
        {/* Document Type and Number */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold text-[#1e4e6c] uppercase">
            {documentTypeDisplay}
          </h2>
          {data.invoiceNumber && (
            <p className="text-gray-600 mt-1">
              {data.documentType === "invoice"
                ? "Invoice"
                : data.documentType === "delivery-challan"
                ? "Challan"
                : "Quotation"}{" "}
              #: {data.invoiceNumber}
            </p>
          )}
        </div>

        {/* Invoice details */}
        <div className="grid grid-cols-[120px_1fr] gap-y-4 mb-10 print:gap-y-3 print:mb-8">
          <div className="text-[#1e4e6c] font-medium">RECIPIENT</div>
          <div className="font-medium text-gray-800">
            {data.recipient || "Bangladesh Swimming Federation"}
          </div>

          <div className="text-[#1e4e6c] font-medium">SUBJECT</div>
          <div className="font-medium text-gray-800">
            {data.subject ||
              "Quotation for Visiting Card, Bottle Labels, Bottle Packet."}
          </div>

          <div className="text-[#1e4e6c] font-medium">DATE</div>
          <div className="font-medium text-gray-800">
            {formatDate(data.date) || "28 Feb, 2025"}
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <div className="bg-[#1e4e6c] text-white grid grid-cols-12 py-2 px-2 text-sm">
            <div className="font-bold col-span-3">PRODUCT</div>
            <div className="font-bold col-span-4">DESCRIPTION</div>
            <div className="font-bold text-center col-span-2">QUANTITY</div>
            <div className="font-bold text-center col-span-1">RATE</div>
            <div className="font-bold text-right col-span-2">AMOUNT</div>
          </div>

          <div>
            {data.lineItems.length > 0 ? (
              data.lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 py-3 px-2 border-b border-gray-200 print:text-xs print:py-2"
                >
                  <div className="col-span-3">
                    {item.product || "Visiting Card"}
                  </div>
                  <div className="col-span-4">{item.description}</div>
                  <div className="text-center col-span-2">
                    {item.quantity || 1000}
                  </div>
                  <div className="text-center col-span-1">
                    {item.rate ? item.rate.toFixed(2) : "0.00"}/-
                  </div>
                  <div className="text-right col-span-2">
                    {item.amount ? item.amount.toFixed(0) : "0000"}/-
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-12 py-2 px-2 border-b border-gray-200">
                <div className="col-span-3">Visiting Card</div>
                <div className="col-span-4">As per Sample</div>
                <div className="text-center col-span-2">1000</div>
                <div className="text-center col-span-1">@ 2.25/-</div>
                <div className="text-right col-span-2">0000/-</div>
              </div>
            )}
          </div>

          {/* Subtotal, Delivery, Discount, and Total */}
          <div className="flex flex-col items-end mt-6 border-t-2 border-[#1e4e6c] pt-4 pr-4">
            <div className="grid grid-cols-2 gap-x-12 text-right">
              <div className="text-[#1e4e6c] font-medium">Subtotal</div>
              <div className="font-medium">
                {data.subtotal ? data.subtotal.toFixed(0) : "0"}/-
              </div>

              {data.deliveryCost > 0 && (
                <>
                  <div className="text-[#1e4e6c] font-medium">
                    Delivery Cost
                  </div>
                  <div className="font-medium">
                    {data.deliveryCost.toFixed(0)}/-
                  </div>
                </>
              )}

              {data.discount > 0 && (
                <>
                  <div className="text-[#1e4e6c] font-medium">Discount</div>
                  <div className="font-medium text-red-600">
                    -{data.discount.toFixed(0)}/-
                  </div>
                </>
              )}

              <div className="text-[#1e4e6c] font-bold">Total</div>
              <div className="font-bold">
                {data.total ? data.total.toFixed(0) : "00,000"}/-
              </div>
            </div>
          </div>
        </div>

        {/* Terms and conditions - only show for quotations */}
        {data.documentType === "quotation" && (
          <div className="mt-8 mb-6 print:mb-4">
            <h3 className="font-bold mb-1 print:text-xs">
              Terms & Conditions:
            </h3>
            <ul className="list-disc pl-4 space-y-0 print:text-xs text-sm">
              <li>
                A 50% advance payment is required. Remaining 50% due upon
                completion within 15 days of delivery.
              </li>
              <li>
                Valid for 15 days from issue date unless specified (*depends on
                raw materials price).
              </li>
              <li>Changes after confirmation may incur additional costs.</li>
              <li>Delivery dates agreed upon at order confirmation.</li>
              <li>
                Prices exclude Vat & Taxes. A carrying charge will be added.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* FOOTER SECTION - Fixed at bottom */}
      <div className="relative mt-auto invoice-footer bg-white pt-4">
        {/* Signature Section */}
        <div
          className={`flex ${
            data.documentType === "delivery-challan"
              ? "justify-between"
              : "justify-end"
          } px-8 print:px-4 mb-4`}
        >
          {/* Recipient Signature - Only for Delivery Challan */}
          {data.documentType === "delivery-challan" && (
            <div className="text-center w-40">
              <div className="h-12 flex items-end justify-center">
                <div className="border-b border-gray-400 w-full">&nbsp;</div>
              </div>
              <div className="mt-2">
                <div className="font-medium">Recipient's Signature</div>
                <div className="text-sm text-gray-600">
                  I have received all items properly
                </div>
              </div>
            </div>
          )}

          {/* Founder's Signature */}
          <div className="text-center w-40">
            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center">
                <Image
                  src="/signature.png"
                  alt="Biplob Chakraborty Signature"
                  width={160}
                  height={40}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="border-b border-gray-400 w-full mt-1"></div>
            </div>
            <div className="mt-2">
              <div className="font-medium">Biplob Chakraborty</div>
              <div>Founder & CEO</div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-1 md:space-y-0 text-gray-700 print:text-xs mb-4">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 print:h-3 print:w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>pracharanibarnick@gmail.com</span>
          </div>
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 print:h-3 print:w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>+88 016 7173 7258, +88 019 1250 7057</span>
          </div>
        </div>

        {/* Bottom triangular design */}
        <div className="relative h-[80px] w-full print:h-[60px]">
          {/* Orange triangle */}
          <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[80px] border-b-[#ff8c42] border-r-[80px] border-r-transparent z-0 print:border-b-[60px] print:border-r-[60px]"></div>

          {/* Blue triangle */}
          <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[80px] border-t-[#1e4e6c] border-l-[80px] border-l-transparent z-0 print:border-t-[60px] print:border-l-[60px]"></div>
        </div>
      </div>
    </div>
  );
}
