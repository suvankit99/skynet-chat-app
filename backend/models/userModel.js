const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')  // library for storing passwords in encrpyted form

const userSchema = new mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true},
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);
// we add the match password method to this schema

userSchema.methods.matchPassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword , this.password) ;
}


// .pre means what we will do before saving the schema
// userSchema.pre('save' , async ( next ) => {
//   // if current password not modified then just break out of this function 
//   if(!this.isModified){ // 
//     return
//   }
//   // We store the password in encrypted form in the database
//   const salt = await bcrypt.genSalt(10) ;
//   // const encryptedPassword = await bcrypt.hash(this.password , salt) ;
//   this.password = await bcrypt.hash(this.password , salt) ;
// })
module.exports = mongoose.model("User", userSchema);
