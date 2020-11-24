import mongoose from 'mongoose';
import { AuthHelper } from '../services/auth-helper';

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    /* 
      This is a mongoose specific way to override model objects' toJSON 
      method. Useful enforcing a uniform standard for response objects 
      regardless of db implementation (e.g. _id vs id).
    */
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

// Hook that runs before a User is saved
userSchema.pre('save', async function (done) {
  // If the password is being set initially or updated
  if (this.isModified('password')) {
    // hash it and store the hashed version
    const hashed = await AuthHelper.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Statics is a mongoose feature that allows us to attach
// custom functions to model constructors. This build function
// is a type-safe wrapper around mongoose's non-safe constructor.
userSchema.statics.build = (attrs: UserAttrs) => {
  // statics must be set before the schema is passwed to
  // mongoose.model, so it's a little awkard that we have to
  // call new User up here before it is defined, but js scope
  // rules permit it.
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
