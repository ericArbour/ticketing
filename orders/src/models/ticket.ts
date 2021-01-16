import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// An interface that describes the properties
// that are required to create a new ticket
interface TicketAttrs {
  title: string;
  price: number;
}

// An interface that describes the properties
// that an ticket Document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties
// that the ticket model has
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
      min: 0,
    },
  },
  {
    /* 
      This is a mongoose specific way to override the model objects' toJSON 
      method, useful for enforcing a uniform standard for response objects 
      regardless of db implementation (e.g. _id vs id).
    */
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

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

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
