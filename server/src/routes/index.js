import { UserRoute } from "./userRoute/userRoute.js";


const routes = (app) => {
    app.use('/api/v1/user', UserRoute);
}

export default routes;