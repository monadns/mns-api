import Express, { NextFunction, Request, Response } from "express";
import { HttpCode } from "./httpcodes";
import ejs from "ejs";
import {ethers} from "ethers";

interface ServerOptions {
    port: number,
    apiPrefix: string
}

export class Server {
    private readonly app = Express();
    private readonly port: number;

    constructor(options: ServerOptions) {
        const {port} = options;
        this.port = port;   
    }

    async start() : Promise<void> {

    

        this.app.use(Express.json())
        this.app.use(Express.urlencoded({ extended: true }))

        this.app.set("trust proxy", true);
        this.app.engine('html', ejs.renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', 'dist');
  
        this.app.use("/", (req: Request, res: Response, next: NextFunction ) => {
            if(req.url != "/") return next();
            console.log(req.url);
            res.render("index", { ogImageUrl: process.env.OG_DEFAULT_IMAGE_URL })
        }); 

        this.app.use("/:name.mon", (req: Request, res: Response, next: NextFunction ) => {
            console.log(req.params.name)
            console.log(getTokenId(req.params.name))
            res.render("index", { ogImageUrl: process.env.OG_IMAGE_URL?.replace("{tokenId}", getTokenId(req.params.name)) })
        }); 

        this.app.use("/register/:name.mon", (req: Request, res: Response, next: NextFunction ) => {
            res.render("index", { ogImageUrl: process.env.OG_IMAGE_URL?.replace("{tokenId}", getTokenId(req.params.name)) })
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

export const getTokenId = (label: string) => {
    const labelHash = ethers.keccak256(ethers.toUtf8Bytes(label));
    const tokenId = ethers.toBigInt(labelHash).toString();
    return tokenId;
}