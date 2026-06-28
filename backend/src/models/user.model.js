import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    coverImg: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    bio: {
      type: String,
      default: '',
      maxLength: 100,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);


// ?Hash password using bcrypt and mongoose pre hook
userSchema.pre('save',async function(){
  if(!this.isModified('password')) return;
  const salt=await bcrypt.genSalt(10);
  const hash=await bcrypt.hash(this.password,salt);
  this.password=hash;

})

const User = model('User', userSchema);
export default User;
