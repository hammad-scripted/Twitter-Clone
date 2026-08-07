import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    type: {
      type: String,
      required: true,
      enum: ['like', 'follow', 'comment'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ to: 1, createdAt: -1 });
notificationSchema.index({ to: 1, read: 1 });

const Notification = model('Notification', notificationSchema);
export default Notification;
