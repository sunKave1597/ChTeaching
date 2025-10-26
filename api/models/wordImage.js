const mongoose = require('mongoose');
const { Schema } = mongoose;

const wordImageSchema = new Schema({
  wordId:      { type: Schema.Types.ObjectId, ref: 'Word', required: true, index: true },
  kind:        { type: String, enum: ['primary', 'extra'], default: 'primary' },
  contentType: { type: String, required: true },
  base64Data:  { type: String, required: true },
  caption:     { type: String, default: '' },
}, { timestamps: true });

wordImageSchema.index({ wordId: 1, kind: 1 }, { unique: true });

module.exports = mongoose.model('WordImage', wordImageSchema);
