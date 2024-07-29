import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORINGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
// admin
import AdminRouter from "./routes/Admin/admin.routes.js";
import CategoryRouter from  './routes/Admin/category.routes.js'
import ProductRouter from  './routes/Admin/product.routes.js'
import feedbackRouter from  './routes/Admin/feedback.routes.js'
// web
import UserRoute from "./routes/web/user.routes.js";
import AddressRoute from "./routes/web/address.routes.js";
import CartRoute from "./routes/web/cart.routes.js";
import OrderRoute from "./routes/web/order.routes.js";


// routes declaration
// admin
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/admin", CategoryRouter);
app.use("/api/v1/admin", ProductRouter);
app.use("/api/v1/admin", feedbackRouter);
// web
app.use("/api/v1/web", UserRoute);
app.use("/api/v1/web", ProductRouter);
app.use("/api/v1/web", AddressRoute);
app.use("/api/v1/web", CartRoute);
app.use("/api/v1/web", OrderRoute);

export { app };
