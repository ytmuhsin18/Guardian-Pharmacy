import React, { useRef } from 'react';
import { Printer } from 'lucide-react';
import gpLogo from '../../assets/gp-logo-new.png';

// A5 dimensions: 148mm x 210mm

const OrderPrintSlip = ({ order }) => {
    const printRef = useRef(null);

    const itemsTotal = (order.items || []).reduce(
        (sum, item) => sum + Number(item.price) * (item.quantity || 1),
        0
    );
    const deliveryFee = Math.max(0, Number(order.total_amount) - itemsTotal);

    const pMethod = order.payment_method || order.paymentMethod || 'COD';
    const isOnline = ['online', 'prepaid'].includes(pMethod.toLowerCase());

    const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
          })
        : new Date().toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
          });

    const handlePrint = async () => {
        // Convert logo to base64 so it works in a detached print window
        let logoDataUrl = '';
        try {
            const res = await fetch(gpLogo);
            const blob = await res.blob();
            logoDataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch (_) {
            // logo fetch failed – print without it
        }

        const content = printRef.current.innerHTML;
        // Replace the placeholder src with the real base64 data URL
        const injected = content.replace('__LOGO_SRC__', logoDataUrl);

        const printWindow = window.open('', '_blank', 'width=600,height=800');
        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Order Slip – ${order.id || ''}</title>
  <style>
    @page {
      size: A5 portrait;
      margin: 0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      color: #1e293b;
      background: #fff;
      width: 148mm;
      min-height: 210mm;
      padding: 10mm 10mm 8mm;
    }
    .slip-header {
      display: flex;
      align-items: center;
      gap: 4mm;
      border-bottom: 2px solid #1e3a5f;
      padding-bottom: 6mm;
      margin-bottom: 5mm;
    }
    .slip-header .logo-img {
      width: 18mm;
      height: 18mm;
      object-fit: contain;
      flex-shrink: 0;
    }
    .slip-header .store-info {
      text-align: left;
    }
    .slip-header .store-name {
      font-size: 16pt;
      font-weight: 800;
      color: #1e3a5f;
      letter-spacing: 0.5px;
      line-height: 1.1;
    }
    .slip-header .store-tagline {
      font-size: 8pt;
      color: #64748b;
      margin-top: 1mm;
    }
    .slip-header .store-contact {
      font-size: 8pt;
      color: #475569;
      margin-top: 1.5mm;
    }
    .order-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4mm;
      font-size: 8.5pt;
      color: #475569;
    }
    .order-meta .order-id {
      font-weight: 700;
      color: #1e293b;
    }
    .section-title {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1.5mm;
      margin-bottom: 2.5mm;
    }
    .customer-block {
      margin-bottom: 4mm;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 3mm 4mm;
    }
    .customer-name {
      font-size: 12pt;
      font-weight: 800;
      color: #1e293b;
    }
    .customer-detail-row {
      display: flex;
      gap: 6mm;
      margin-top: 1.5mm;
      font-size: 9pt;
      color: #475569;
    }
    .customer-detail-row span strong {
      color: #1e293b;
      font-weight: 600;
    }
    .customer-address {
      margin-top: 1.5mm;
      font-size: 9pt;
      color: #475569;
    }
    .customer-address strong { color: #1e293b; font-weight: 600; }

    .totals-block {
      margin-top: 2mm;
      padding: 3mm 4mm;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #475569;
      padding: 1mm 0;
    }
    .totals-row.delivery { color: #10b981; }
    .totals-row.grand {
      font-size: 13pt;
      font-weight: 800;
      color: #1e293b;
      border-top: 2px solid #1e3a5f;
      margin-top: 1.5mm;
      padding-top: 2mm;
    }
    .payment-badge {
      display: inline-block;
      margin-top: 2mm;
      font-size: 8.5pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 1.5mm 5mm;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }
    .payment-badge.online {
      background: #eff6ff;
      color: #0984e3;
      border: 1px solid #bfdbfe;
    }
    .payment-badge.cod {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .status-badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 1.5mm 5mm;
      border-radius: 20px;
      letter-spacing: 0.5px;
      margin-left: 3mm;
    }
    .slip-footer {
      margin-top: 6mm;
      border-top: 1px dashed #cbd5e1;
      padding-top: 3mm;
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
    }
    .slip-footer strong { color: #475569; }
  </style>
</head>
<body>
  ${injected}
</body>
</html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 600);
    };

    return (
        <>
            {/* Hidden slip content – rendered off-screen */}
            <div ref={printRef} style={{ display: 'none' }}>
                {/* Header */}
                <div className="slip-header">
                    {/* eslint-disable-next-line */}
                    <img src="__LOGO_SRC__" alt="Guardian Pharmacy" className="logo-img" />
                    <div className="store-info">
                        <div className="store-name">Guardian Pharmacy</div>
                        <div className="store-tagline">Your trusted neighbourhood pharmacy</div>
                        <div className="store-contact">📞 94874 69098 &nbsp;|&nbsp; 📍 17- A SOUTH MAIN STREET, THIRUVARUR</div>
                    </div>
                </div>

                {/* Order Meta */}
                <div className="order-meta">
                    <span className="order-id">Order #{order.id ? String(order.id).slice(0, 8).toUpperCase() : 'N/A'}</span>
                    <span>{orderDate}</span>
                </div>

                {/* Customer Details */}
                <div className="section-title">Customer Details</div>
                <div className="customer-block">
                    <div className="customer-name">{order.customer_name}</div>
                    <div className="customer-detail-row">
                        <span><strong>📞</strong> {order.phone}</span>
                        {order.whatsapp && <span><strong>WhatsApp:</strong> {order.whatsapp}</span>}
                    </div>
                    <div className="customer-address">
                        <strong>📍 Address:</strong> {order.address}{order.pincode ? `, ${order.pincode}` : ''}
                    </div>
                </div>



                {/* Totals */}
                <div className="totals-block">
                    <div className="totals-row">
                        <span>Items Total</span>
                        <span>₹{itemsTotal.toFixed(2)}</span>
                    </div>
                    <div className={`totals-row ${deliveryFee === 0 ? 'delivery' : ''}`}>
                        <span>Delivery Charge</span>
                        <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
                    </div>
                    <div className="totals-row grand">
                        <span>Grand Total</span>
                        <span>₹{Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                        <span className={`payment-badge ${isOnline ? 'online' : 'cod'}`}>
                            {isOnline ? '💳 Online Payment' : '💵 Cash on Delivery'}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="slip-footer">
                    <strong>Thank you for choosing Guardian Pharmacy!</strong><br />
                    For queries call: 94874 69098
                </div>
            </div>

            {/* Print Button */}
            <button
                onClick={handlePrint}
                title="Print Order Slip (A5)"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 10px',
                    background: '#1e3a5f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    transition: 'background 0.2s',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#2d5a8e'}
                onMouseLeave={e => e.currentTarget.style.background = '#1e3a5f'}
            >
                <Printer size={14} />
                Print Slip
            </button>
        </>
    );
};

export default OrderPrintSlip;
