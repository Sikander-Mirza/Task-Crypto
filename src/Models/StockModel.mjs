import { DataTypes } from "sequelize";
import sequelize from "../Infractructure/db.mjs";

const ProductModel = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,  // Integer type for ID
    autoIncrement: true,  // Auto-increment the ID
    primaryKey: true  // Set as primary key
  },
  Product:{
    type:DataTypes.STRING
  },
  Quantity:{
    type:DataTypes.INTEGER
  },
  Price: {
    type: DataTypes.DECIMAL, // Updated to DECIMAL for better handling of monetary values
  },
})

export default ProductModel;
