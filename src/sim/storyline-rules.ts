import type { CampaignState, Command, SimEvent, World } from './types';

/**
 * The sim side of each storyline: what the world looks like when it starts, what each
 * chapter sets up, how scenes and events touch the world, which ending the flags add
 * up to, and the actions the journal may offer (travel, a bout, a fusion). The scripts
 * are data in src/content/storyline-*.ts; these rules are the only code per campaign.
 */
export interface StoryAction {
  /** Looked up in STORYLINE_TEXT.actions for its label. */
  id: string;
  /** A panel the journal opens instead of sending the command ('partyBout'). */
  ui?: string;
  command: Command;
  enabled: boolean;
}

export interface StorylineRule {
  id: string;
  /** The areas `storyArea` may travel to, if the storyline has any. */
  areas?: string[];
  setup?(world: World, c: CampaignState, events: SimEvent[]): void;
  onChapter?(world: World, c: CampaignState, n: number, events: SimEvent[]): void;
  onScene?(
    world: World,
    c: CampaignState,
    scene: string,
    choice: string | null,
    events: SimEvent[],
  ): void;
  onEvent?(world: World, c: CampaignState, e: SimEvent, events: SimEvent[]): void;
  onArea?(world: World, c: CampaignState, area: string, events: SimEvent[]): void;
  /** Hold the chapter's closing scene while true (a bout still to fight). */
  holdsClose?(world: World, c: CampaignState): boolean;
  /** The scene to play in place of `scene`. */
  variant?(c: CampaignState, scene: string): string;
  endingFor(world: World, c: CampaignState): string;
  actions?(world: World, c: CampaignState): StoryAction[];
}

const RULES = new Map<string, StorylineRule>();

export function registerStorylineRule(rule: StorylineRule): void {
  RULES.set(rule.id, rule);
}

export function storylineRule(id: string): StorylineRule | undefined {
  return RULES.get(id);
}

/** R0596: is `c` a questline running beside Hazel's Grove (in `world.lines`), not the world's campaign. */
export function isSharedLine(world: World, c: CampaignState): boolean {
  return c.storyline !== null && world.lines?.[c.storyline] === c;
}

/** R0594: the Nubbin ids a line brought with it (its `cast` flag, comma-joined). */
export function lineCast(c: CampaignState): string[] {
  return typeof c.flags.cast === 'string' && c.flags.cast ? c.flags.cast.split(',') : [];
}
