/**
 * Payoffs for the Mr. Bean (Q21–Q30) fun quests: a later line keyed on an earlier choice, read only
 * inside the same pack (fun quests never read or write campaign flags). Merged into
 * CHOICE_PAYOFFS, so one scene id has one entry here and none anywhere else. Flavour flags
 * (q29-told, q30-fair) are named as flavour in their quest's notes instead.
 */
import type { BandText, Payoff } from './payoff-kit';
import { by } from './payoff-kit';

/** q25-way at the q28 fuse: the way Mr. Tweed was talked off the ledge comes back. */
const Q28_WAY: Record<string, BandText> = {
  coax: {
    main: 'You call out “One foot back!” as at the waterfall. He takes that foot back, then several more.',
    sprout: 'You call, “One step back!” He remembers the pool and steps back.',
    reader:
      'You call out “One step back!” just as you did at the waterfall. He takes the step, and then several more.',
  },
  show: {
    main: 'Your Nubbin shows him the exit the way it showed him the waterfall: fast, head first, no thinking. He copies it.',
    sprout: 'Your Nubbin shows the way: fast, head first. Mr. Tweed copies it.',
    reader:
      'Your Nubbin shows him the way out, fast and head first, like the dive at the waterfall. Mr. Tweed copies it.',
  },
};

const TEA = { main: 'On Saturday', sprout: 'On Saturday', reader: 'On Saturday' };

export const BEAN_PAYOFFS: Record<string, Payoff> = {
  'q26-share': (c, s) => {
    // q24-shared: Mrs Inkwell's rule about sharing comes to the picnic.
    if (c.flags['q24-shared'] !== true) return;
    s.insertAfter(
      {
        main: 'He takes a ruler',
        sprout: 'He takes out a ruler.',
        reader: 'The sandwich is 16 centimetres',
      },
      {
        main: 'He hands out each square with his eyes on the ceiling. Sharing food is sharing, as Mrs Inkwell said; it is the other kind he avoids.',
        sprout: 'He hands out squares. Sharing food is fine. Sharing answers is not.',
        reader:
          'He hands out each square, looking politely at the ceiling. Mrs Inkwell said sharing food is fine. It is sharing answers that is not.',
      },
    );
  },
  'q27-hall': (c, s) => {
    // q21-sniffer: the Nubbin that sneezed at his sleeve knows a sneeze when it sees one.
    if (c.flags['q21-sniffer'] !== true) return;
    s.insertAfter(
      {
        main: 'The sneeze is enormous.',
        sprout: 'The wet cloth flies onto',
        reader: 'The sneeze is enormous.',
      },
      {
        main: 'Your Nubbin nods wisely. It sniffed that sleeve once, and sneezed. It saw this one coming.',
        sprout: 'Your Nubbin nods. That sleeve made it sneeze too.',
        reader:
          'Your Nubbin nods wisely. It sniffed that sleeve once, and sneezed too. It saw this sneeze coming.',
      },
    );
  },
  'q28-cleared': (c, s) => {
    // q21-scarf-swap: the hill Nubbin turns up in the scarf.
    if (c.flags['q21-scarf-swap'] !== true) return;
    s.insertAfter(
      {
        main: 'Three sleepy Nubbins',
        sprout: 'Three sleepy Nubbins',
        reader: 'Three Nubbins lie on the lawn',
      },
      {
        main: 'A fourth Nubbin has wandered down from the hill, smart in a tiny knitted scarf. Mr. Tweed looks at the scarf, then at his bear, and says nothing.',
        sprout: 'A hill Nubbin wears a tiny scarf. Mr. Tweed looks. He says nothing.',
        reader:
          'A fourth Nubbin has wandered down from the hill, wearing a tiny knitted scarf. Mr. Tweed looks at the scarf, then at his bear, and says nothing.',
      },
    );
  },
  'q28-fuse': (c, s) => {
    // q25-way: how he was talked off the ledge decides how he is talked out of the cottage.
    const line = by(c.flags['q25-way'], Q28_WAY);
    if (line) s.insertAfter({ main: 'Oh!', sprout: 'Oh!', reader: 'Oh!' }, line);
  },
  'q28-complete': (c, s) => {
    // q26-jam-lettuce and q27-confessed come to the Saturday tea.
    if (c.flags['q26-jam-lettuce'] === true)
      s.insertAfter(TEA, {
        main: 'A plate of jam lettuce sits among the cakes. Mr. Tweed watches you steer around it, and approves.',
        sprout: 'Jam lettuce sits with the cakes. Mr. Tweed watches you walk past.',
        reader:
          'A plate of jam lettuce sits among the cakes. Mr. Tweed watches you steer around it, and nods.',
      });
    const confessed = c.flags['q27-confessed'];
    if (confessed === true)
      s.insertAfter(TEA, {
        main: 'Warden Pryce comes to tea. She checks Mr. Tweed’s upper lip first, and seems almost disappointed.',
        sprout: 'Warden Pryce comes to tea. She looks at Mr. Tweed’s lip. No moustache!',
        reader:
          'Warden Pryce comes to tea. She checks Mr. Tweed’s top lip first, looking for moustaches. There are none, and she seems nearly disappointed.',
      });
    else if (confessed === false)
      s.insertAfter(TEA, {
        main: 'Warden Pryce comes to tea and asks, brightly, how the portrait is keeping. Mr. Tweed finds the teapot suddenly fascinating.',
        sprout: 'Warden Pryce asks about the painting. Mr. Tweed studies the teapot.',
        reader:
          'Warden Pryce comes to tea and asks how the portrait is keeping. Mr. Tweed finds the teapot suddenly fascinating.',
      });
  },
  'q29-handover': (c, s) => {
    // q28-asked-to-light: the GROWN-UPS ONLY card is back, for an egg.
    if (c.flags['q28-asked-to-light'] !== true) return;
    s.insertAfter(
      {
        main: 'Mr. Tweed leans over the fence',
        sprout: 'Mr. Tweed leans over the fence.',
        reader: 'Mr. Tweed leans over the fence',
      },
      {
        main: 'He holds up a small card you recognise: GROWN-UPS ONLY. He points at himself, then at the egg, and stands a little taller.',
        sprout: 'He holds up a card: GROWN-UPS ONLY. He points at himself, then the egg.',
        reader:
          'He holds up a small card you remember: GROWN-UPS ONLY. He points at himself, then at the egg, and stands up a little taller.',
      },
    );
  },
  'q29-roll': (c, s) => {
    // q23-pulled: nobody pulls anything, ever again.
    if (c.flags['q23-pulled'] !== true) return;
    s.insertBefore(
      {
        main: 'Somewhere nearby',
        sprout: 'Then a Nubbin sneezes.',
        reader: 'Somewhere nearby',
      },
      {
        main: 'Mr. Tweed looks at his hands, then at the egg, then at yours. Nobody will be pulling anything today. You agree on this without a word.',
        sprout: 'Mr. Tweed looks at you. No pulling today. Not even a little pull.',
        reader:
          'Mr. Tweed looks at the egg, then at you. You both remember the pumpkin. Nobody will pull anything today.',
      },
    );
  },
  'q29-afternoon': (c, s) => {
    // q22-nubbin-help: the Nubbin that poked the sleeper pokes the egg.
    if (c.flags['q22-nubbin-help'] !== true) return;
    s.insertAfter(
      {
        main: 'He keeps his hat off',
        sprout: 'Mr. Tweed keeps his hat ready',
        reader: 'He keeps his hat off',
      },
      {
        main: 'Your Nubbin pokes the egg, as it once poked the sleeper in the lane. The egg wobbles, which is not the same as waking up.',
        sprout: 'Your Nubbin pokes the egg to wake it. The egg only wobbles.',
        reader:
          'Your Nubbin pokes the egg, as it once poked the sleeper in the lane. The egg only wobbles. That is not the same as waking up.',
      },
    );
  },
  'q30-meet': (c, s) => {
    // q22-doubted: Mr. Tweed's firm nod about the armchair.
    if (c.flags['q22-doubted'] !== true) return;
    s.insertAfter(
      {
        main: 'He smiles a very small smile.',
        sprout: 'He looks at the Bluebell’s one front wheel.',
        reader: 'He smiles a very small smile.',
      },
      {
        main: 'Then he catches your eye and nods firmly, as he did about the armchair. Whatever you were about to ask, the answer is yes.',
        sprout: 'Mr. Tweed nods firmly at you, as with the armchair. Whatever you ask, yes.',
        reader:
          'Then he catches your eye and nods firmly, as he did about the armchair. Whatever you were going to ask, the answer is yes.',
      },
    );
  },
  'q30-grid': (c, s) => {
    // q28-objected: "Absolutely not" reaches the Bluebell.
    if (c.flags['q28-objected'] !== true) return;
    s.insertAfter(
      {
        main: 'Mr. Tweed polishes',
        sprout: 'Then he polishes the Bluebell too.',
        reader: 'Mr. Tweed climbs back in',
      },
      {
        main: 'Then he takes a tiny firework from his sock and eyes the back of the Bluebell. He remembers your “Absolutely not”, and puts it away.',
        sprout: 'He takes a firework from his sock. He remembers “Absolutely not.” It goes back.',
        reader:
          'Then he takes a tiny firework from his sock and looks at the back of the Bluebell. He remembers you saying “Absolutely not”, and puts it away.',
      },
    );
  },
  'q30-race': (c, s) => {
    // q29-tweed-help: the hat is still out, just in case.
    if (c.flags['q29-tweed-help'] !== true) return;
    s.insertAfter(
      {
        main: 'He rights it',
        sprout: 'He puts it back up',
        reader: 'He rights it',
      },
      {
        main: 'Mr. Tweed holds his hat out over the side, in case anything rolls off. Nothing does, and he keeps it there with great dignity.',
        sprout: 'Mr. Tweed holds his hat out, just in case. Nothing falls.',
        reader:
          'Mr. Tweed holds his hat out over the side, in case anything falls. Nothing does, but he keeps it there with great dignity.',
      },
    );
  },
  'q30-complete': (c, s) => {
    // q30-warned: Rufus remembers "stable as a table".
    if (c.flags['q30-warned'] !== true) return;
    s.insertAfter(
      {
        main: 'Mr. Tweed shakes his hand.',
        sprout: 'Mr. Tweed shakes his hand.',
        reader: 'Mr. Tweed shakes his hand.',
      },
      {
        main: 'Stable as a table, I told you. A table that likes a lie-down.',
        sprout: 'I said it was stable. It likes to lie down.',
        reader: 'I did say it was stable as a table. I never said it would stay standing.',
      },
      'rufus',
    );
  },
};
