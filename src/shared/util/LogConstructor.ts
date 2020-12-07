import logger from "@shared/Logger";

export function logInvalidEntityData(entityType: string, entity: Object): void {
    logger.warn(
        `Could not insert/update ${entityType} ${JSON.stringify(
            entity,
            null,
            4
        )} Invalid Data`
    );
}

export function logDatabaseError(
    entityType: string,
    entity: Object,
    error?: any
): void {
    logger.error(error);
    logger.warn(
        `Could not insert/update ${entityType} ${JSON.stringify(
            entity,
            null,
            4
        )} Database Error`
    );
}
