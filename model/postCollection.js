import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({

  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  PostCollections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  PostTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
}, {
  timestamps: true,
});

const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

export default Collection;
