// ...existing code...

// Update MongoDB connection options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 'majority' },
  retryWrites: true
});

// Replace any ensureIndex calls with createIndex
// If you have code like this:
// collection.ensureIndex()
// Replace with:
collection.createIndex()
// ...existing code...
