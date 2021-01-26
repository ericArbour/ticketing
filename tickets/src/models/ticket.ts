import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

// An interface that describes the properties
// that a ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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
      },
    },
  },
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// Statics is a mongoose feature that allows us to attach
// custom functions to model constructors. This build function
// is a type-safe wrapper around mongoose's non-type-safe constructor.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // statics must be set before the schema is passed to
  // mongoose.model, so it's a little awkard that we have to
  // call new User up here before it is defined, but js scope
  // rules permit it.
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
