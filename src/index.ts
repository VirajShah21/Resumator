import './LoadEnv'; // Must be the first import
import app from './Server';
import logger from './shared/Logger';

// Start the server
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
    logger.info(`Express server started on port: ${PORT}`);
});
