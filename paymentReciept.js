// ==========================================
// SCRIPT 2: Receipt Generator (A5 Print)
// ==========================================
window.generateA5Receipt = function (data) {
  // Open a new blank window
  const win = window.open('', '_blank', 'width=800,height=1000');

  win.document.write(`
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Official School Receipt</title>

<style>
   * {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    background: #eee;
    font-family: "Times New Roman", serif;
}

/* =========================================================
   RECEIPT – exact A5
========================================================= */
.receipt {
    width: 148mm;
    height: 210mm;          /* fixed height so it never overflows */
    margin: 0 auto;
    background: #fff;
    border: 1px solid #000;
    padding: 3mm;
    color: #000;
    position: relative;
    overflow: hidden;       /* safety */
}

.receipt-inner {
    border: 1px solid #000;
    height: 100%;
    padding: 2.5mm 3mm 3mm;
    display: flex;
    flex-direction: column;
}

/* =========================================================
   HEADER
========================================================= */
.header {
    text-align: center;
    line-height: 1.05;
    flex-shrink: 0;
}

.header .church {
    font-size: 11pt;
    font-weight: bold;
}

.header .school {
    font-size: 10.5pt;
    font-weight: bold;
    margin-top: 1mm;
}

.header .address,
.header .telephone {
    font-size: 8.5pt;
    font-weight: bold;
    margin-top: 1.2mm;
}

.receipt-title {
    display: inline-block;
    font-size: 11pt;
    font-weight: bold;
    text-decoration: underline;
    margin-top: 2mm;
}

/* =========================================================
   ENTRY DATE
========================================================= */
.entry-date {
    text-align: right;
    font-size: 9pt;
    margin-top: 2.5mm;
    margin-right: 1mm;
    flex-shrink: 0;
}

/* =========================================================
   STUDENT INFORMATION
========================================================= */
.info-row {
    display: flex;
    align-items: baseline;
    width: 100%;
    font-size: 10pt;
    margin-top: 2mm;
    white-space: nowrap;
}

.info-label {
    flex-shrink: 0;
}

.dotted-value {
    border-bottom: 1.5pt dotted #000;
    flex: 1;
    min-width: 0;
    padding-left: 1.5mm;
    padding-right: 1.5mm;
    line-height: 1.15;
}

.info-small {
    display: flex;
    align-items: baseline;
    font-size: 10pt;
    margin-top: 2mm;
    gap: 1mm;
}

.info-small .label {
    flex-shrink: 0;
}

.info-small .value {
    border-bottom: 1.5pt dotted #000;
    padding: 0 2mm 0.5mm;
}

.words {
    margin-top: 2.5mm;
}

/* =========================================================
   PAYMENT TABLE
========================================================= */
.payment-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4mm;
    font-size: 9.5pt;
    flex-grow: 1;               /* takes remaining space */
}

.payment-table th,
.payment-table td {
    border: 1px solid #000;
    height: 7.2mm;              /* tighter rows so everything fits */
    padding: 0.8mm 3mm;
}

.payment-table th {
    font-size: 9.5pt;
    font-weight: bold;
    text-align: center;
}

.payment-table th:first-child {
    text-align: left;
}

.payment-table td:first-child {
    width: 52%;
}

.payment-table td:nth-child(2),
.payment-table td:nth-child(3) {
    width: 24%;
    text-align: right;
    padding-right: 4mm;
}

.payment-table .amount {
    text-align: right;
}

.payment-table .total-row td {
    height: 8.5mm;
    font-weight: bold;
}

.payment-table .total-label {
    text-align: right;
    padding-right: 3mm;
}

/* =========================================================
   RECEIPT NUMBER
========================================================= */
.receipt-number {
    color: red;
    font-family: Arial, sans-serif;
    font-size: 14pt;
    font-weight: bold;
    margin-left: 12mm;
    margin-top: 2mm;
    flex-shrink: 0;
}

/* =========================================================
   FOOTER / QR
========================================================= */
.receipt-footer {
    display: flex;
    align-items: flex-end;
    margin-top: 3mm;
    min-height: 22mm;
    flex-shrink: 0;
}

.qr-section {
    width: 18mm;
    flex-shrink: 0;
    margin-left: 2mm;
}

.qr-section img {
    width: 16mm;
    height: 16mm;
    display: block;
}

.transaction-section {
    flex: 1;
    margin-left: 3mm;
    font-family: Arial, sans-serif;
    font-size: 7.5pt;
    padding-bottom: 0.5mm;
}

.transaction-line {
    border-bottom: 0.7pt solid #000;
    padding-bottom: 0.8mm;
    margin-bottom: 0.8mm;
}

.software-name {
    font-family: Arial, sans-serif;
    font-size: 9pt;
    font-weight: bold;
    letter-spacing: -0.3px;
    margin-top: 1mm;
}

/* =========================================================
   PRINT – perfect A5
========================================================= */
@media print {
    @page {
        size: A5 portrait;
        margin: 0;
    }

    body {
        background: #fff;
        padding: 0;
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .receipt {
        width: 148mm;
        height: 210mm;
        margin: 0;
        border: 1px solid #000;
        page-break-after: avoid;
        page-break-inside: avoid;
    }

    .no-print {
        display: none !important;
    }
}
</style>
</head>

<body onload="window.print()">

<div class="receipt">

    <div class="receipt-inner">

        <!-- =====================================================
             HEADER
        ====================================================== -->
        <div class="header">

            <div class="church">
                FULL GOSPEL CHURCHES OF KENYA
            </div>

            <div class="school">
                REVIVAL SPRINGS SCHOOL
            </div>

            <div class="address">
                P.O.BOX 1915 - KITALE (BONDENI ESTATE)
            </div>

            <div class="telephone">
                Tel: 0723 337 524 / 0717 446 110
            </div>

            <div class="receipt-title">
                OFFICIAL SCHOOL RECEIPT
            </div>

        </div>


        <!-- =====================================================
             ENTRY DATE
        ====================================================== -->
        <div class="entry-date">
            Entry Date: 02/09/2025
        </div>


        <!-- =====================================================
             STUDENT DETAILS
        ====================================================== -->

        <div class="info-row">
            <span class="info-label">Received from.</span>
            <span class="dotted-value">
                FRANKLINE NGOTHO WANGIGI
            </span>
        </div>


        <div class="info-small">

            <span class="label">
                Adm No....
            </span>

            <span class="value">
                RS/2025/101
            </span>

            <span class="label term">
                Term.
            </span>

            <span class="value">
                3
            </span>

            <span class="label class-name">
                Class.
            </span>

            <span class="value">
                7
            </span>

        </div>


        <div class="info-row words">
            <span class="info-label">
                Amount in Words.
            </span>

            <span class="dotted-value">
                Six Thousand Shillings Only
            </span>
        </div>


        <div class="info-row">
            <span class="dotted-value">
                &nbsp;
            </span>
        </div>


        <!-- =====================================================
             PAYMENT DETAILS
        ====================================================== -->

        <table class="payment-table">

            <thead>
                <tr>
                    <th>BEING PAYMENT OF:</th>
                    <th>KSHS.</th>
                    <th>CTS.</th>
                </tr>
            </thead>

            <tbody>

                <tr>
                    <td>Admission fee</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Tuition fee</td>
                    <td class="amount">6,000</td>
                    <td></td>
                </tr>

                <tr>
                    <td>Examination fee</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Meal fee</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Activity fund</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Medical fee</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Repairs &amp; Maintenance</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Boarding fee</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Transport fee</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Miscellaneous</td>
                    <td></td>
                    <td></td>
                </tr>

                <tr>
                    <td>Arrears</td>
                    <td class="amount">10,500</td>
                    <td></td>
                </tr>

                <tr class="total-row">

                    <td class="total-label">
                        TOTAL Ksh.
                    </td>

                    <td class="total-amount">
                        6,000
                    </td>

                    <td></td>

                </tr>

            </tbody>

        </table>


        <!-- =====================================================
             RECEIPT NUMBER
        ====================================================== -->

        <div class="receipt-number">
            3207
        </div>


        <!-- =====================================================
             FOOTER
        ====================================================== -->

        <div class="receipt-footer">

            <div class="qr-section">

                <!-- QR code -->
                <img
                    src="https://quickchart.io/qr?text=TI2Z7K16EB%20%2F%20M-PESA&size=150"
                    alt="QR Code"
                >

            </div>


            <div class="transaction-section">

                <div class="transaction-line">
                    <strong>Pay Date:</strong> 02/09/2025
                </div>

                <div class="transaction-line">
                    <strong>Transaction Ref:</strong>
                    TI2Z7K16EB / M-PESA
                </div>

                <div class="software-name">
                    AcadiaPro™ School Management Software
                </div>

            </div>

        </div>

    </div>

</div>

</body>
</html>
  `);

  win.document.close();
  win.focus();
};