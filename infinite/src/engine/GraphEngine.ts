import type { TemporalEvent, CausalEdge } from '../types/temporal';

export class GraphEngine {
  public static getChildren(eventId: string, edges: CausalEdge[]): string[] {
    return edges
      .filter(e => e.source === eventId && e.active)
      .map(e => e.target);
  }

  public static getParents(eventId: string, edges: CausalEdge[]): string[] {
    return edges
      .filter(e => e.target === eventId && e.active)
      .map(e => e.source);
  }

  public static getAncestors(eventId: string, edges: CausalEdge[]): Set<string> {
    const ancestors = new Set<string>();
    const queue = [eventId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const parents = this.getParents(current, edges);
      for (const p of parents) {
        if (!ancestors.has(p)) {
          ancestors.add(p);
          queue.push(p);
        }
      }
    }

    return ancestors;
  }

  public static getDescendants(eventId: string, edges: CausalEdge[]): Set<string> {
    const descendants = new Set<string>();
    const queue = [eventId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = this.getChildren(current, edges);
      for (const c of children) {
        if (!descendants.has(c)) {
          descendants.add(c);
          queue.push(c);
        }
      }
    }

    return descendants;
  }

  public static findCycles(events: TemporalEvent[], edges: CausalEdge[]): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      recStack.add(nodeId);
      path.push(nodeId);

      const children = this.getChildren(nodeId, edges);
      for (const childId of children) {
        if (!visited.has(childId)) {
          dfs(childId);
        } else if (recStack.has(childId)) {
          // Cycle found
          const cycleStartIndex = path.indexOf(childId);
          if (cycleStartIndex !== -1) {
            cycles.push([...path.slice(cycleStartIndex), childId]);
          }
        }
      }

      recStack.delete(nodeId);
      path.pop();
    };

    for (const event of events) {
      if (!visited.has(event.id)) {
        dfs(event.id);
      }
    }

    return cycles;
  }
}
