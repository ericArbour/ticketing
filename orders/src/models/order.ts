import mongoose from 'mongoose';
import { OrderStatus } from '@earbtickets/common';

import { TicketDoc } from './ticket';

export { OrderStatus };

// An interface that describes the properties
// that are required to create a new order
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties
// that an Order Document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties
// that the order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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
orderSchema.statics.build = (attrs: OrderAttrs) => {
  // statics must be set before the schema is passed to
  // mongoose.model, so it's a little awkard that we have to
  // call new User up here before it is defined, but js scope
  // rules permit it.
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
