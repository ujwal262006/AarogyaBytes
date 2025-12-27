const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/patients
 * Create new patient for logged-in clinic
 */
router.post('/', authMiddleware, async (req, res) => {
  const { name, age, phone } = req.body;

  // Basic validation
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO patients (clinic_id, name, age, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, clinic_id, name, age, phone`,
      [req.clinicId, name, age || null, phone || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

/**
 * GET /api/patients
 * List patients for logged-in clinic ONLY
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, age, phone
       FROM patients
       WHERE clinic_id = $1
       ORDER BY id ASC`,
      [req.clinicId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

module.exports = router;
