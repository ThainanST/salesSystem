import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import RestControler from "./infra/controller/RestControler";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import ZipcodeDataDatabase from "./infra/data/ZipcodeDataDatabase";
import PgpConnection from "./infra/database/PgpConnection";

const httpServer = new ExpressHttpServer();
const dbConnection = new PgpConnection();
new RestControler(httpServer);
httpServer.listen(3003);