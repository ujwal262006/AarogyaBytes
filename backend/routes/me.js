const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/me
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         c.id AS clinic_id,
         c.name AS clinic_name,
         d.id AS doctor_id,
         d.email
       FROM doctors d
       JOIN clinics c ON d.clinic_id = c.id
       WHERE d.id = $1 AND c.id = $2`,
      [req.doctorId, req.clinicId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = result.rows[0];

    res.json({
      clinicId: data.clinic_id,
      clinicName: data.clinic_name,
      doctorId: data.doctor_id,
      email: data.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

module.exports = router;
