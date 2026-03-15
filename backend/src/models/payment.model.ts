import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export enum PaymentMethod {
  STRIPE = 'STRIPE',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IPayment {
  organizationId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  paidAt?: Date;
  dueDate: Date;
  lineItems: ILineItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentDocument extends IPayment, Document {}
export interface IPaymentModel extends Model<IPaymentDocument> {}

// ---------------------------------------------------------------------------
// Counter for auto-generating invoice numbers
// ---------------------------------------------------------------------------
const invoiceCounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const InvoiceCounter =
  mongoose.models.InvoiceCounter || mongoose.model('InvoiceCounter', invoiceCounterSchema);

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const lineItemSchema = new Schema<ILineItem>(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const paymentSchema = new Schema<IPaymentDocument, IPaymentModel>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
      uppercase: true,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
    },
    stripeInvoiceId: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    lineItems: {
      type: [lineItemSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
paymentSchema.index({ organizationId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ invoiceNumber: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// Pre-save hook: auto-generate invoice number
// ---------------------------------------------------------------------------
paymentSchema.pre('save', async function () {
  if (this.isNew && !this.invoiceNumber) {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const counter = await (InvoiceCounter.findByIdAndUpdate as any)(
      'invoiceNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.invoiceNumber = `VRK-INV-${yearMonth}-${String(counter.seq).padStart(4, '0')}`;
  }
});

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
paymentSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organizationId',
  foreignField: '_id',
  justOne: true,
});

paymentSchema.virtual('subscription', {
  ref: 'Subscription',
  localField: 'subscriptionId',
  foreignField: '_id',
  justOne: true,
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
const Payment = mongoose.model<IPaymentDocument, IPaymentModel>('Payment', paymentSchema);
export default Payment;
