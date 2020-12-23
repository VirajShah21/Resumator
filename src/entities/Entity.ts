import logger from '@shared/Logger';

export default abstract class Entity {
    public validate(): boolean {
        let isValid: boolean = true;

        logger.info(`Validating ${JSON.stringify(this, null, 4)}`);

        this.getValidators().forEach((validator) => {
            if (validator()) {
                isValid = false;
            }
        });

        if (isValid)
            logger.info(`VALIDATED ${JSON.stringify(this, null, 4)} VALIDATED`);
        else logger.info(`INVALID ${JSON.stringify(this, null, 4)} INVALID`);

        return isValid;
    }

    protected abstract getValidators(): (() => boolean)[];
}
