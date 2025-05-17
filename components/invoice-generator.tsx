"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import InvoicePreview from "@/components/invoice-preview";
import type { InvoiceData, LineItem } from "@/types/invoice";

// Default data templates for each document type
const defaultDataTemplates: Record<string, InvoiceData> = {
  invoice: {
    documentType: "invoice",
    invoiceNumber: "",
    recipient: "",
    subject: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
    lineItems: [
      {
        id: 1,
        product: "",
        description: "As per Sample",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    deliveryCost: 0,
    discount: 0,
    total: 0,
    showTotals: true,
    advance: 0,
  },
  "delivery-challan": {
    documentType: "delivery-challan",
    invoiceNumber: "",
    recipient: "",
    subject: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
    lineItems: [
      {
        id: 1,
        product: "",
        description: "As per Sample",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    deliveryCost: 0,
    discount: 0,
    total: 0,
    showTotals: true,
    advance: 0,
  },
  quotation: {
    documentType: "quotation",
    invoiceNumber: "",
    recipient: "",
    subject: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
    lineItems: [
      {
        id: 1,
        product: "",
        description: "As per Sample",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    deliveryCost: 0,
    discount: 0,
    total: 0,
    showTotals: true,
    advance: 0,
  },
};

export default function InvoiceGenerator() {
  const [currentDocType, setCurrentDocType] = useState<
    "invoice" | "delivery-challan" | "quotation"
  >("invoice");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(
    defaultDataTemplates["invoice"]
  );
  const [isLoadedFromDraft, setIsLoadedFromDraft] = useState(false);
  const [drafts, setDrafts] = useState<{ [key: string]: InvoiceData[] }>({
    invoice: [],
    "delivery-challan": [],
    quotation: [],
  });

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Load drafts from local storage on component mount
  useEffect(() => {
    const storedDrafts = localStorage.getItem("invoiceDrafts");
    if (storedDrafts) {
      try {
        const parsedDrafts = JSON.parse(storedDrafts);
        setDrafts(parsedDrafts);
      } catch (error) {
        console.error("Error parsing drafts from local storage:", error);
      }
    }
  }, []);

  // Handle document type change
  const handleDocTypeChange = (value: string) => {
    const newDocType = value as "invoice" | "delivery-challan" | "quotation";

    // Reset form to default values for the new document type
    setInvoiceData({
      ...defaultDataTemplates[newDocType],
      date: new Date().toISOString().split("T")[0], // Always use current date
    });

    setCurrentDocType(newDocType);
    setIsLoadedFromDraft(false);
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      // Open print dialog
      window.print();
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updatedItems = [...invoiceData.lineItems];

    if (field === "quantity" || field === "rate") {
      const numValue =
        typeof value === "string" ? Number.parseFloat(value) || 0 : value;
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numValue,
        amount:
          field === "quantity"
            ? numValue * updatedItems[index].rate
            : updatedItems[index].quantity * numValue,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }

    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + invoiceData.deliveryCost - invoiceData.discount;

    setInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
      subtotal,
      total,
    });
  };

  const updateDeliveryCost = (value: string) => {
    const deliveryCost = Number.parseFloat(value) || 0;
    const total = invoiceData.subtotal + deliveryCost - invoiceData.discount;

    setInvoiceData({
      ...invoiceData,
      deliveryCost,
      total,
    });
  };

  const updateDiscount = (value: string) => {
    const discount = Number.parseFloat(value) || 0;
    const total = invoiceData.subtotal + invoiceData.deliveryCost - discount;

    setInvoiceData({
      ...invoiceData,
      discount,
      total,
    });
  };

  const updateAdvance = (value: string) => {
    const advance = Number.parseFloat(value) || 0;

    setInvoiceData({
      ...invoiceData,
      advance,
    });
  };

  const addLineItem = () => {
    const newId =
      Math.max(0, ...invoiceData.lineItems.map((item) => item.id)) + 1;
    setInvoiceData({
      ...invoiceData,
      lineItems: [
        ...invoiceData.lineItems,
        {
          id: newId,
          product: "",
          description: "As per Sample",
          quantity: 0,
          rate: 0,
          amount: 0,
        },
      ],
    });
  };

  const removeLineItem = (id: number) => {
    const updatedItems = invoiceData.lineItems.filter((item) => item.id !== id);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + invoiceData.deliveryCost - invoiceData.discount;

    setInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
      subtotal,
      total,
    });
  };

  // Get the appropriate document number label based on document type
  const getDocumentNumberLabel = () => {
    switch (currentDocType) {
      case "invoice":
        return "Invoice #";
      case "delivery-challan":
        return "Challan #";
      case "quotation":
        return "Quotation #";
      default:
        return "Document #";
    }
  };

  // Save current invoice data as draft to local storage
  const saveAsDraft = () => {
    const updatedDrafts = { ...drafts };

    // Add current invoice data to the appropriate array
    updatedDrafts[currentDocType] = [
      ...(updatedDrafts[currentDocType] || []),
      { ...invoiceData },
    ];

    // Save to local storage
    localStorage.setItem("invoiceDrafts", JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    setIsLoadedFromDraft(true);

    alert(`Saved as ${currentDocType} draft!`);
  };

  // Load the most recent draft of the current document type
  const loadDraft = () => {
    if (drafts[currentDocType] && drafts[currentDocType].length > 0) {
      // Get the most recent draft
      const mostRecentDraft =
        drafts[currentDocType][drafts[currentDocType].length - 1];
      setInvoiceData(mostRecentDraft);
      setIsLoadedFromDraft(true);
    } else {
      alert(`No ${currentDocType} drafts found.`);
    }
  };

  // Reset form to default state for current document type
  const resetData = () => {
    setInvoiceData({
      ...defaultDataTemplates[currentDocType],
      date: new Date().toISOString().split("T")[0], // Always use current date
    });
    setIsLoadedFromDraft(false);
  };

  // Check if there are drafts available for the current document type
  const hasDrafts = drafts[currentDocType]?.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:!grid-cols-1 print:gap-0">
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">Document Details</h2>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select
                  value={currentDocType}
                  onValueChange={handleDocTypeChange}
                >
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="delivery-challan">
                      Delivery Challan
                    </SelectItem>
                    <SelectItem value="quotation">Quotation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoice-number">Document Number</Label>
                <Input
                  id="invoice-number"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  placeholder={getDocumentNumberLabel()}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={invoiceData.recipient}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, recipient: e.target.value })
                }
                placeholder="Bangladesh Swimming Federation"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={invoiceData.subject}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, subject: e.target.value })
                }
                placeholder="Invoice subject"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={invoiceData.address}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, address: e.target.value })
                }
                placeholder="Recipient's address"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={invoiceData.date}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, date: e.target.value })
                }
              />
            </div>

            {/* Show totals toggle for quotations */}
            {currentDocType === "quotation" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-totals"
                  checked={invoiceData.showTotals}
                  onCheckedChange={(checked) =>
                    setInvoiceData({ ...invoiceData, showTotals: checked })
                  }
                />
                <Label htmlFor="show-totals">
                  Show subtotal and total amounts
                </Label>
              </div>
            )}

            {/* Advance payment field for invoices */}
            {currentDocType === "invoice" && (
              <div>
                <Label htmlFor="advance">Advance Payment</Label>
                <Input
                  id="advance"
                  type="number"
                  value={invoiceData.advance || ""}
                  onChange={(e) => updateAdvance(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-4">
            Line Items{" "}
            <span className="text-sm font-normal text-gray-500">
              (For best results, limit to 5 items per page)
            </span>
          </h3>

          {invoiceData.lineItems.map((item, index) => (
            <div key={item.id} className="mb-6 border-b pb-4">
              {/* First row: Product and Description */}
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-12 sm:col-span-5">
                  <Label htmlFor={`product-${item.id}`}>Product</Label>
                  <Input
                    id={`product-${item.id}`}
                    value={item.product}
                    onChange={(e) =>
                      updateLineItem(index, "product", e.target.value)
                    }
                    placeholder="Product name"
                  />
                </div>
                <div className="col-span-12 sm:col-span-7">
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, "description", e.target.value)
                    }
                    placeholder="Product description"
                    rows={2}
                  />
                </div>
              </div>

              {/* Second row: Quantity, Rate, Amount, and Remove button */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 sm:col-span-3">
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateLineItem(index, "quantity", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                {currentDocType !== "delivery-challan" && (
                  <>
                    <div className="col-span-4 sm:col-span-3">
                      <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                      <Input
                        id={`rate-${item.id}`}
                        type="number"
                        value={item.rate || ""}
                        onChange={(e) =>
                          updateLineItem(index, "rate", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-3">
                      <Label>Amount</Label>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                        {item.amount.toFixed(2)}
                      </div>
                    </div>
                  </>
                )}

                <div
                  className={`col-span-12 sm:col-span-${
                    currentDocType === "delivery-challan" ? "6" : "3"
                  } flex items-end justify-end`}
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => removeLineItem(item.id)}
                    disabled={invoiceData.lineItems.length <= 1}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {currentDocType !== "delivery-challan" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="delivery-cost">Delivery Cost</Label>
                <Input
                  id="delivery-cost"
                  type="number"
                  value={invoiceData.deliveryCost || ""}
                  onChange={(e) => updateDeliveryCost(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  value={invoiceData.discount || ""}
                  onChange={(e) => updateDiscount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Draft management buttons */}
          <div className="flex flex-wrap gap-2 justify-between mt-6">
            <div className="flex flex-wrap gap-2">
              <Button onClick={addLineItem}>Add Item</Button>
              <Button variant="outline" onClick={saveAsDraft}>
                Save as Draft
              </Button>
              {hasDrafts && (
                <Button variant="outline" onClick={loadDraft}>
                  Load Draft
                </Button>
              )}
              {isLoadedFromDraft && (
                <Button variant="destructive" onClick={resetData}>
                  Reset Data
                </Button>
              )}
            </div>
            <Button onClick={handlePrint}>
              Generate{" "}
              {currentDocType === "invoice"
                ? "Invoice"
                : currentDocType === "delivery-challan"
                ? "Challan"
                : "Quotation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="hidden lg:block print:block">
        <div ref={invoiceRef}>
          <InvoicePreview data={invoiceData} />
        </div>
      </div>
    </div>
  );
}
