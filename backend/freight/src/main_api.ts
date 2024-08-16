import ExpressHttpServer from "./infra/http/ExpressHttpServer";
import RestControler from "./infra/controller/RestControler";
import HapiHttpServer from "./infra/http/HapiHttpServer";
import CalculateFreight from "./application/CalculateFreight";
import ZipcodeDataDatabase from "./infra/data/ZipcodeDataDatabase";
import PgpConnection from "./infra/database/PgpConnection";

const httpServer = new ExpressHttpServer();
// const httpServer = new HapiHttpServer();
const dbConnection = new PgpConnection();
const zipcodeData = new ZipcodeDataDatabase(dbConnection);
const calculateFreight = new CalculateFreight(zipcodeData);
new RestControler(httpServer, calculateFreight);
httpServer.listen(3001);