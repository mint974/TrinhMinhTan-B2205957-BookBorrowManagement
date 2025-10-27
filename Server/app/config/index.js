const config = {
  app: {
    port: process.env.PORT || 5000,
  },
  db: {
    uri:
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/book_borrow_management",
  },
};

module.exports = config;
