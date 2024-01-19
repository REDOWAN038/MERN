const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase:true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        },
        message: "Invalid email address.",
      },
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        set:(v) => bcrypt.hashSync(v,bcrypt.genSaltSync(10)),
        validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)
        },
        message: "Password must be at least 8 characters, contain a lowercase letter, an uppercase letter, a number, and a special character.",
      },
    },
    image:{
        type:String,
    },
    address:{
        type:String,
        required:[true,"Address is required"],
    },
    phone:{
        type:String,
        required:[true,"Phone is required"],
        validate: {
        validator: function (v) {
          return /^01\d{9}$/.test(v)
        },
        message: "Must be 11 digits starting with 01.",
      },
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

module.exports = mongoose.model("Users", userSchema)