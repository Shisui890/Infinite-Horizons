import { TemporalEvent, Paradox, ParadoxSeverity, EventStatus } from '../types/temporal';

export class IntegrityEngine {
  /**
   * Recalculates temporal integrity (0 - 100%) for a universe based on:
   * - Active paradoxes (-30% for CRITICAL, -15% for HIGH, -10% for MEDIUM)
   * - Erased/Altered/Unstable events (-5% to -10% per event)
   */
  public static calculate(events: TemporalEvent[], paradoxes: Paradox[]): number {
    let integrity = 100;

    // Deduct for paradoxes
    for (const paradox of paradoxes) {
      switch (paradox.severity) {
        case ParadoxSeverity.CATASTROPHIC:
          integrity -= 50;
          break;
        case ParadoxSeverity.CRITICAL:
          integrity -= 30;
          break;
        case ParadoxSeverity.HIGH:
          integrity -= 18;
          break;
        case ParadoxSeverity.MEDIUM:
          integrity -= 10;
          break;
        case ParadoxSeverity.LOW:
          integrity -= 5;
          break;
      }
    }

    // Deduct for event instabilities
    for (const event of events) {
      if (event.status === EventStatus.PARADOXICAL) {
        integrity -= 8;
      } else if (event.status === EventStatus.COLLAPSED) {
        integrity -= 6;
      } else if (event.status === EventStatus.ERASED) {
        integrity -= 5;
      } else if (event.status === EventStatus.UNSTABLE) {
        integrity -= 3;
      } else if (event.status === EventStatus.ALTERED) {
        integrity -= 2;
      }
    }

    return Math.max(0, Math.min(100, Math.round(integrity)));
  }
}
