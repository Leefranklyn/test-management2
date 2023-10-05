import adminRoutes from "../routes/admin/admin.routes.js";
import institutionRoutes from "../routes/institution/institution.routes.js";
import userRoutes from "../routes/user/user.routes.js";
import contactUsRoutes from "../routes/contact/contactUs.routes.js";

const routers = (app) => {
    app.use("/api/admin", adminRoutes);
    app.use("/api/institution", institutionRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api", contactUsRoutes);
};

export default routers;