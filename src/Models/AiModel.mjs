import mongoose from 'mongoose';


const aiAssistantLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    query: String,
    ai_response: String,
    created_at: { type: Date, default: Date.now }
  });
  
  export default mongoose.model('AIAssistantLog', aiAssistantLogSchema);
  