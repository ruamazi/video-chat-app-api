import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
 {
  email: {
   type: String,
   unique: true,
   required: true,
  },
  password: {
   type: String,
   required: true,
   minlength: 6,
  },
  username: {
   type: String,
   unique: true,
   required: true,
  },
  bio: {
   type: String,
   default: "",
  },
  avatar: {
   type: String,
   default: "",
  },
  location: {
   type: String,
   default: "",
  },
  nativeLanguage: {
   type: String,
   default: "",
  },
  learningLanguage: {
   type: String,
   default: "",
  },
  isOnBoarded: {
   type: Boolean,
   default: false,
  },
  friends: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   },
  ],
 },
 { timestamps: true }
);

UserSchema.pre("save", function (next) {
 const user = this;
 if (!user.isModified("password")) {
  return next();
 }
 bcrypt.genSalt(10, (err, salt) => {
  if (err) {
   return next(err);
  }
  bcrypt.hash(user.password, salt, (err, hash) => {
   if (err) {
    return next(err);
   }
   user.password = hash;
   next();
  });
 });
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
 const isPasswordMatch = await bcrypt.compare(candidatePassword, this.password);
 return isPasswordMatch;
};

export default mongoose.model("User", UserSchema);
