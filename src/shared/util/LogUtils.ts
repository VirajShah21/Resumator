import logger from "@shared/Logger";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";
import { Request } from "express";

export class RouterLogger {
    public path: string;
    public sessionKey: string;
    public parameters: any;

    public constructor(path: string, request: Request) {
        this.path = path;
        this.sessionKey = request.cookies.session;
        this.parameters = request.body || request.query;
        logger.info(
            `Session[${
                this.sessionKey
            }] routed to ${path} with parameters: ${JSON.stringify(
                this.parameters,
                null,
                4
            )}`
        );
    }

    public logAccountAndSessionFetchResult(
        accountSession?: AccountSessionTransformer
    ): void {
        if (accountSession)
            logger.info(
                `Account and Session Found\n ${JSON.stringify(
                    accountSession,
                    null,
                    4
                )}`
            );
        else logger.warn(`No account found for ${this.sessionKey}`);
    }
}
