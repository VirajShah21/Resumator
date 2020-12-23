import logger from '@shared/Logger';

export default abstract class Entity {
    public abstract validate(): boolean;
}
