require("dotenv").config();
const express = require("express");
const app = express();
const { logger } = require("../Configure/logger.config");
let port = process.env.PORT || 3000;
app.use(express.json());
const cors = require("cors");
app.use(cors(process.env.FRONTEND_URL));

// Routes for the applications
const { router } = require("./routes/application.routes");
app.use("/api/v1.0/moviebooking", router);

//Error Handling Middleware
const errorHandler = require("./middleware/errorHandler.middleware");
app.use(errorHandler);

exports.server = app.listen(port, () => {
  logger.info(`Application started @ ${port} in ${process.env.ENV}`);
});
