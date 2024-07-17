import express, { Express } from "express"; //! import 2 thứ từ express là express và cái {dùng cái nào thì điền vào để lấy từ express}
import bodyParser from "body-parser"
import dotenv from "dotenv";
import * as database from "./config/database"; //! *as là trong cái file kia cs hàm gì thì import hết
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();

database.connect();

const app: Express = express(); //! : Express là kiểu Express do thg express tự định nghĩa
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser.json());

mainV1Routes(app)

app.listen(port, () => {
    console.log(`Running port ${port} - By Diner`);
});
