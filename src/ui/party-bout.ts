import { BATTLE_TEXT } from '../config/strings-battle';
import type { Game } from '../game';
import { battleScreen, type BattleScreen } from './battle-screen';

/**
 * SL2's (Logged In) party bout (recs FIGHT-29), now a `story` bout on the battle core shown on
 * the one battle screen: a 3v3 in singles against Glitch, Proxy and Null. The sim still emits
 * `partyBout {won, tier, shells}` when it ends, so the storyline counts as before. The panel
 * itself has no window of its own any more; the shared screen is registered with the panel
 * stack through the dojo, so this reports itself closed.
 */
export class PartyBoutPanel {
  private readonly screen: BattleScreen;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.screen = battleScreen(parent, game);
  }

  isOpen(): boolean {
    return false;
  }

  close(): void {
    if (this.screen.isOpen) this.screen.askLeave();
  }

  /** Start a bout for the party `ids` at `tier`. */
  open(ids: string[], tier: number): void {
    const g = this.game();
    if (!g) return;
    const hatched = ids.filter((id) => {
      const n = g.world.nubbins.find((x) => x.id === id);
      return n !== undefined && n.stage !== 'egg' && n.stage !== 'cocoon';
    });
    if (hatched.length === 0) {
      this.toast(BATTLE_TEXT.noParty);
      return;
    }
    this.screen.start({ kind: 'story', storyline: 'logged', tier, ids: hatched.slice(0, 3) });
  }
}
