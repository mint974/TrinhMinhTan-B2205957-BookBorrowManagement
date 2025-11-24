require("dotenv").config();

const app = require("./app/app");
const config = require("./app/config");
const { connect } = require("./app/utils/mongodb.util");

async function startServer() {
  await connect(config.db.uri);

  const PORT = config.app.port || 5000;
  app.listen(PORT, () => {
    console.log(`Server chạy trên cổng ${PORT}`);
  });
}

startServer();
