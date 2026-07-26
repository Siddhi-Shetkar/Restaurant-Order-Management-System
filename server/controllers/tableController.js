const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private (Staff/Manager)
const getTables = async (req, res) => {
  try {
    const tables = await Table.find().populate({
      path: 'currentOrder',
      select: 'orderId status'
    }).sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private (Manager)
const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    
    const tableExists = await Table.findOne({ tableNumber });
    if (tableExists) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    const table = new Table({
      tableNumber,
      capacity
    });

    const createdTable = await table.save();
    res.status(201).json(createdTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Private (Manager)
const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (table) {
      table.tableNumber = req.body.tableNumber || table.tableNumber;
      table.capacity = req.body.capacity || table.capacity;
      table.status = req.body.status || table.status;

      const updatedTable = await table.save();
      res.json(updatedTable);
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private (Manager)
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (table) {
      if (table.status === 'Occupied') {
         return res.status(400).json({ message: 'Cannot delete an occupied table' });
      }
      await Table.deleteOne({ _id: req.params.id });
      res.json({ message: 'Table removed' });
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTables,
  createTable,
  updateTable,
  deleteTable
};
