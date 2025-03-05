const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String },
  email: { type: String, unique: true },
  password: { type: String,  minLength:6 , maxLength:20 , trim:true },
  orders: { type: [Schema.Types.ObjectId], ref: "Order" , default:[] },
  cart: { type: [Schema.Types.ObjectId], ref: "Product" ,default:[]},
  picture: { type: String },
  contact: { type: Number },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
