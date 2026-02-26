import { app } from './app';
import { env } from './config/env';
import { scheduleQuoteExpiration } from './jobs/expireQuotes.job';

app.listen(env.port, () => {
  console.log(`API ejecutando en puerto ${env.port}`);
});

scheduleQuoteExpiration();
