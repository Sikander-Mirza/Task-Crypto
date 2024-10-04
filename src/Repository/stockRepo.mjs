import StockModel from "../Models/StockModel.mjs";

const stockrepo={

    save :async (data) => {
        return await StockModel.insertMany(data);
    },
    show: async()=>{
      return await StockModel.find()
    },


}
  export default stockrepo;
