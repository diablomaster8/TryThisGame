/** The nightly soak: the same projects and server as playwright.config.ts, only the @soak spec. */
import { makeConfig } from './playwright.config';

export default makeConfig(true);
