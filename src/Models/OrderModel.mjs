import { DataTypes } from "sequelize";
import sequelize from "../Infractructure/db.mjs";

const OrderModel = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,  // Integer type for ID
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true  // Set as primary key
  },
  Type: {
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  Date: {
    type: DataTypes.DATE, 
    allowNull: false, 
  },
  product:{
type:DataTypes.STRING
  },
  Amount: {
    type: DataTypes.DECIMAL, // Updated to DECIMAL for better handling of monetary values
  },
  Price: {
    type: DataTypes.DECIMAL, // Updated to DECIMAL for better handling of monetary values
  },
  Cost: {
    type: DataTypes.DECIMAL, // Updated to DECIMAL for better handling of monetary values
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Enforce unique constraint
  },
  Payment: {
    type: DataTypes.STRING,
  },
  Currency: {
    type: DataTypes.STRING,
  },
  PayCost: {
    type: DataTypes.DECIMAL, // Updated to DECIMAL for better handling of monetary values
  },
  Status: {
    type: DataTypes.ENUM,
    values: ["paid", "unpaid"], 
  },
});

export default OrderModel;
