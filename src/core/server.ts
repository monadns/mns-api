import Express, { NextFunction, Request, Response } from "express";
import { HttpCode } from "./httpcodes";
import ejs from "ejs";
import cardRouter from "../routes/card";
import { getTokenId } from "./utils";

interface ServerOptions {
    port: number
}

export class Server {
    private readonly app = Express();
    private readonly port: number;

    constructor(options: ServerOptions) {
        const {port} = options;
        this.port = port;   
    }

    async start() : Promise<void> { 

        this.app.locals.ogImageUrl = null;

        this.app.use(Express.json())
        this.app.use(Express.urlencoded({ extended: true }))

        ejs.delimiter = '?';
    
        this.app.set("trust proxy", true);
        this.app.engine('html', ejs.renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', 'dist');

        this.app.use("/api/card", cardRouter);
  
        this.app.use("/", (req: Request, res: Response, next: NextFunction ) => {
            if(req.url != "/") return next();
            res.render("index", { ogImageUrl: process.env.OG_DEFAULT_IMAGE_URL })
        }); 

        this.app.use("/:name.mon", (req: Request, res: Response, next: NextFunction ) => {
            res.render("index", { ogImageUrl: "https://app.monadns.com/api/card?name="+ encodeURIComponent(req.params.name) +"&v="+ Date.now() })
        }); 

        this.app.use(Express.static('dist'));
 
        this.app.use((req: Request, res: Response, next: NextFunction ) => {
            res.status(HttpCode.NOT_FOUND).render("index");
        })

        this.app.use((error: Error, req: Request, res: Response, next: NextFunction ) => {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).render("index");
        })
 
        this.app.listen(this.port, ()=> {
            console.log(`Listening port: ${this.port}`);
        })
    } 
}

