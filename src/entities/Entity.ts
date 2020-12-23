import logger from '@shared/Logger';

export default abstract class Entity {
    public validate(): boolean {
        let isValid: boolean = true;

        logger.info(`Validating ${JSON.stringify(this, null, 4)}`);

        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                let funcName: string = `validate${key.charAt(0).toUpperCase()}`;
                if (key.length > 1) funcName += key.substring(1);

                // call the validate function
                if (
                    typeof (this as any)[funcName] === 'function' &&
                    !(this as any)[funcName]()
                ) {
                    isValid = false;
                    logger.info(
                        `Invalid field: ${key} -> ${JSON.stringify(
                            this,
                            null,
                            4
                        )}`
                    );
                }
            }
        }

        if (isValid)
            logger.info(`VALIDATED ${JSON.stringify(this, null, 4)} VALIDATED`);
        else logger.info(`INVALID ${JSON.stringify(this, null, 4)} INVALID`);

        return isValid;
    }
}
