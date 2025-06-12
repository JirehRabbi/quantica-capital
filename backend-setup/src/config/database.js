const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ NEW: Generate sequential Acc_ID like A001, A002, A003...
const generateAccId = async () => {
  const [rows] = await pool.query(`
    SELECT Acc_ID 
    FROM personal_data 
    WHERE Acc_ID LIKE 'A%' 
    ORDER BY CAST(SUBSTRING(Acc_ID, 2) AS UNSIGNED) DESC 
    LIMIT 1
  `);

  let nextNumber = 1;

  if (rows.length > 0) {
    const lastId = rows[0].Acc_ID; // e.g., "A045"
    const lastNumber = parseInt(lastId.substring(1)); // Extract "045" → 45
    nextNumber = lastNumber + 1;
  }

  const paddedNumber = String(nextNumber).padStart(3, "0"); // "001", "046", etc.
  return `A${paddedNumber}`; // Final: "A001", "A046", etc.
};

// Optional fallback (not used anymore but retained just in case)
const generateContactId = () => {
  return 'CON-' + (Math.random().toString(16).slice(2, 10)).toUpperCase();
};


// Funding ID based on Acc_ID like A001-A
const generateFundingId = (accId) => {
  return `${accId}-A`;
};

// Generate Bank Account Number (10-digit number string)
const generateBankAccNo = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

module.exports = {
  pool,
  generateAccId,
  generateContactId,
  generateFundingId,
  generateBankAccNo
};