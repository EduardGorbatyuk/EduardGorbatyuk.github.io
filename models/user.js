const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    leagues_id: [],  
    clubs_id: [] 
  },
  {
    timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', schema);