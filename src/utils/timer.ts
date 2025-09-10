import { logger } from './logger';

export const timer = (marker: string, end: boolean = false) => {
  if (!end) {
    performance.mark(`${marker}-start`);
  } else {
    const endMark = `${marker}-end`;
    performance.mark(endMark);

    performance.measure(marker, `${marker}-start`, endMark);

    const measures = performance.getEntriesByName(marker);
    const lastMeasure = measures[measures.length - 1];

    logger.info(`[TIMER] ${marker}: ${lastMeasure.duration.toFixed(2)}ms`);

    performance.clearMarks(`${marker}-start`);
    performance.clearMarks(endMark);
    performance.clearMeasures(marker);

    return lastMeasure.duration;
  }
};
