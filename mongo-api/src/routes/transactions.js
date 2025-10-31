const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// @route   GET /api/transactions
// @desc    Get all transactions with optional filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;

    // Basic validation
    if (!type || !amount || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newTransaction = new Transaction({
      ...req.body,
      user: req.user._id,
      type,
      amount,
      description,
      category,
      date: date || new Date()
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get a single transaction
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    
    const updateFields = {};
    if (type) updateFields.type = type;
    if (amount !== undefined) updateFields.amount = amount;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (date) updateFields.date = date;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
