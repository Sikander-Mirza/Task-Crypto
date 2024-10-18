import Order from '../Models/OrderModel.mjs'; // Import your Mongoose Order model

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body); // Create new Order from the request body
    const savedOrder = await newOrder.save(); // Save to the database
    res.status(201).json(savedOrder); // Return the saved order
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    res.status(200).json(orders); // Return the orders
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // Find the order by its ID
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order by ID
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated order
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id); // Find and delete the order
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
