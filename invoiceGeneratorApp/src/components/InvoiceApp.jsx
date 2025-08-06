import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import './InvoiceApp.css';

const InvoiceApp = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    client: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    items: [
      { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    discount: 0,
    notes: ''
  });

  const company = {
    name: 'KQ Construction Works',
    address: 'P.O. Box 123, Accra - Ghana',
    phone: '+233 55 727 2031',
    email: 'qkingsley@gmail.com'
  };

  const handleClientChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const handleItemChange = (id, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newId = Math.max(...invoiceData.items.map(item => item.id)) + 1;
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (id) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - invoiceData.discount;
  };

  const formatCurrency = (amount) => {
    return `GHS ${amount.toFixed(2)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container fluid className="invoice-container py-5">
      <Card className="invoice-card shadow-lg">
        <Card.Body>
          {/* Header */}
          <div className="invoice-header mb-4">
            <Row>
              <Col md={8}>
                <h1 className="invoice-title text-primary">INVOICE</h1>
              </Col>
            </Row>
          </div>

          {/* Company and Client Details - Same Row */}
          <div className="company-client-wrapper d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
  <div className="company-details-wrapper flex-fill">
    <div className="company-details">
      <h4 className="text-primary mb-3">From:</h4>
      <div className="details-display">
        <h5 className="company-name">{company.name}</h5>
        <p className="mb-1">{company.address}</p>
        <p className="mb-1">Phone: {company.phone}</p>
        <p className="mb-0">Email: {company.email}</p>
      </div>
    </div>
  </div>
  <div className="client-details-wrapper flex-fill">
    <div className="client-details">
      <h4 className="text-primary mb-3">Bill To:</h4>
      <div className="no-print">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Client Name"
            value={invoiceData.client.name}
            onChange={(e) => handleClientChange('name', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Client Address"
            value={invoiceData.client.address}
            onChange={(e) => handleClientChange('address', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Phone Number"
            value={invoiceData.client.phone}
            onChange={(e) => handleClientChange('phone', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="email"
            placeholder="Email Address"
            value={invoiceData.client.email}
            onChange={(e) => handleClientChange('email', e.target.value)}
          />
        </Form.Group>
      </div>
      <div className="print-only details-display">
        <h5 className="client-name">{invoiceData.client.name || 'Client Name'}</h5>
        <p className="mb-1">{invoiceData.client.address || 'Client Address'}</p>
        <p className="mb-1">Phone: {invoiceData.client.phone || 'Phone Number'}</p>
        <p className="mb-0">Email: {invoiceData.client.email || 'Email Address'}</p>
      </div>
    </div>
  </div>
</div>

          {/* Invoice Details */}
          <Row className="mb-4">
            <Col md={6}>
              <div className="no-print">
                <Form.Group className="mb-2">
                  <Form.Label>Invoice Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  />
                </Form.Group>
              </div>
              <div className="print-only">
                <p><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="no-print">
                <Form.Group className="mb-2">
                  <Form.Label>Invoice Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </Form.Group>
              </div>
              <div className="print-only">
                <p><strong>Date:</strong> {new Date(invoiceData.date).toLocaleDateString()}</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="no-print">
                <Form.Group className="mb-2">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </Form.Group>
              </div>
              <div className="print-only">
                <p><strong>Due Date:</strong> {invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'Not specified'}</p>
              </div>
            </Col>
          </Row>

          {/* Items Table */}
          <div className="items-section mb-4">
            <h4 className="text-primary mb-3">Items</h4>
            <Table striped bordered hover responsive className="items-table">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: '40%' }}>Description</th>
                  <th style={{ width: '15%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>Rate (GHS)</th>
                  <th style={{ width: '20%' }}>Amount (GHS)</th>
                  <th style={{ width: '5%' }} className="no-print">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="no-print">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="print-only">
                        {item.description || 'Item description'}
                      </div>
                    </td>
                    <td>
                      <div className="no-print">
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="print-only text-center">
                        {item.quantity}
                      </div>
                    </td>
                    <td>
                      <div className="no-print">
                        <Form.Control
                          type="number"
                          // step="0.01"
                          min="0"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="print-only text-end">
                        {formatCurrency(item.rate)}
                      </div>
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="no-print text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={invoiceData.items.length === 1}
                      >
                        ×
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="no-print">
              <Button variant="outline-primary" onClick={addItem} className="add-item-btn">
                + Add Item
              </Button>
            </div>
          </div>

          {/* Totals */}
          <Row>
            <Col md={8}>
              <div className="no-print mb-4">
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or terms"
                  />
                </Form.Group>
              </div>
              <div className="print-only">
                {invoiceData.notes && (
                  <div>
                    <h5>Notes:</h5>
                    <p>{invoiceData.notes}</p>
                  </div>
                )}
              </div>

              <div className="no-print mt-3">
                <Button variant="success" onClick={handlePrint} className="print-btn">
                  <i className="fas fa-print me-2"></i>Print Invoice
                </Button>
              </div>
            </Col>
            <Col md={4}>
              <div className="totals-section">
                <Table className="totals-table">
                  <tbody>
                    <tr>
                      <td><strong>Subtotal:</strong></td>
                      <td className="text-end">{formatCurrency(calculateSubtotal())}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="no-print">
                          <InputGroup size="sm">
                            <InputGroup.Text>Discount:</InputGroup.Text>
                            <Form.Control
                              type="number"
                              // step="0.1"
                              min="0"
                              value={invoiceData.discount}
                              onChange={(e) => setInvoiceData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                            />
                          </InputGroup>
                        </div>
                        <div className="print-only">
                          <strong>Discount:</strong>
                        </div>
                      </td>
                      <td className="text-end">- {formatCurrency(invoiceData.discount)}</td>
                    </tr>
                    <tr className="total-row">
                      <td><strong>Total:</strong></td>
                      <td className="text-end total-amount">{formatCurrency(calculateTotal())}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>

          {/* Footer */}
          <div className="invoice-footer mt-4 text-center">
            <p className="text-muted fw-bold">Thank you for doing business with KQ Construction Works!</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InvoiceApp;