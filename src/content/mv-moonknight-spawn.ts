/**
 * Multiverse campaign: the Moon Knight line (MK1–MK8) and the Spawn line (SP1–SP8).
 *
 * These are the campaign's horror lines (audience 'adult'). Violence, death, Hell and a
 * god's cruelty are written seriously and never dwelt on. Marc Spector, Steven Grant and
 * Jake Lockley are three people who share one life; each speaks as himself and is never
 * played for a joke.
 *
 * The Moon Knight line runs on unreliable identity: memories that disagree, hours that
 * overlap, a god who may or may not be acting through Marc's hands. The Nubbin is the one
 * steady witness, and it never tells. Never resolve these doubts on screen.
 * The Spawn line runs on damnation and redemption: every use of power is counted against
 * Al's soul, and every small kindness he can afford is the way back. Keep both costs visible.
 *
 * Both lines feed endgame E3, Armageddon (not in this file). Threads it picks up:
 * - MK8 ends with Khonshu throwing Marc out of his palace onto the Mission roof. The long
 *   walk down by the Mission lantern, with the Nubbins keeping it lit, happens only in E3.
 * - Khonshu is left watching from the sky at the end of MK8, not defeated.
 * - Hell has no king after SP6; Mammon announces the war in SP8.
 * - SP4 (Angela, hunters in the sky) unlocks MK7; SP6 enters Hell by the road from FF7.
 * - Spawn order follows the comics: Overt-Kill (#5–7) is SP3, Angela (#9) is SP4.
 *
 * All dialogue is original. Flags use the `mv-mk-` and `mv-sp-` prefixes.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood } from '../config/story';

const l = (who: string, text: string, mood?: Mood): Line =>
  mood ? { who, text, mood } : { who, text };

// ------------------------------------------------------------------ shared speakers
const NUBBIN: Speaker = { id: 'nubbin', name: 'Your Nubbin', kind: 'nubbin' };
const MARC: Speaker = {
  id: 'marc',
  name: 'Marc Spector',
  kind: 'other',
  basedOn: 'Marc Spector / Moon Knight (Marvel)',
};
const STEVEN: Speaker = {
  id: 'steven',
  name: 'Steven Grant',
  kind: 'other',
  basedOn: 'Steven Grant, one of Moon Knight’s identities (Marvel)',
};
const JAKE: Speaker = {
  id: 'jake',
  name: 'Jake Lockley',
  kind: 'other',
  basedOn: 'Jake Lockley, one of Moon Knight’s identities (Marvel)',
};
const KHONSHU: Speaker = {
  id: 'khonshu',
  name: 'Khonshu',
  kind: 'other',
  basedOn: 'Khonshu (Marvel)',
};
const MARLENE: Speaker = {
  id: 'marlene',
  name: 'Marlene',
  kind: 'other',
  basedOn: 'Marlene Alraune (Marvel)',
};
const FRENCHIE: Speaker = {
  id: 'frenchie',
  name: 'Frenchie',
  kind: 'other',
  basedOn: 'Jean-Paul “Frenchie” Duchamp (Marvel)',
};
const BUSHMAN: Speaker = {
  id: 'bushman',
  name: 'Bushman',
  kind: 'other',
  basedOn: 'Raoul Bushman (Marvel)',
};
const SPAWN: Speaker = {
  id: 'spawn',
  name: 'Spawn',
  kind: 'other',
  basedOn: 'Al Simmons / Spawn (Image Comics)',
};
const COG: Speaker = {
  id: 'cog',
  name: 'Cogliostro',
  kind: 'other',
  basedOn: 'Cogliostro (Image Comics)',
};
const ANGELA: Speaker = {
  id: 'angela',
  name: 'Angela',
  kind: 'other',
  basedOn: 'Angela (Spawn)',
};
const CLOWN: Speaker = {
  id: 'clown',
  name: 'The Clown',
  kind: 'other',
  basedOn: 'The Clown / Violator (Image Comics)',
};
const VIOLATOR: Speaker = {
  id: 'violator',
  name: 'Violator',
  kind: 'other',
  basedOn: 'The Violator (Image Comics)',
};

const MK_WHERE = 'Multiverse: the rift above the waterfall (Moon Knight’s world)';
const SP_WHERE = 'Multiverse: the rift above the waterfall (Spawn’s world)';

// ====================================================================== MOON KNIGHT
export const MV_MOONKNIGHT: Quest[] = [
  // ---------------------------------------------------------------------- MK1
  {
    id: 'mv-mk01',
    code: 'MK1',
    title: 'The Mercenary',
    source: 'Werewolf by Night #32–33 (1975): Moon Knight’s first appearance',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'The Moon Knight line opens in the Multiverse campaign.' },
    speakers: [
      NUBBIN,
      MARC,
      { id: 'agent', name: 'Committee Agent', kind: 'other', basedOn: 'An agent of the Committee (Marvel)' },
      { id: 'jack', name: 'Jack Russell', kind: 'other', basedOn: 'Jack Russell / Werewolf by Night (Marvel)' },
    ],
    steps: [
      {
        id: 'mv-mk01-hire',
        goal: 'Track the werewolf through the woods with the man in silver.',
        hint: 'Send a Nubbin with good Run or Fly on the Expedition; it picks up the trail faster.',
        check: 'expedition:clear:mv-russell-woods',
        scene: {
          id: 'mv-mk01-hire',
          lines: [
            l('narrator', 'The rift lets you out on a wet country road. The moon is full and far too bright.'),
            l('narrator', 'A man in silver armour and a white cloak waits under a streetlamp, counting money he hasn’t been paid yet.'),
            l('agent', 'You’re Spector. The Committee was told you don’t ask questions.'),
            l('marc', 'I ask plenty. I just don’t expect answers. What’s the job?'),
            l('agent', 'A young man named Jack Russell. On nights like this he turns into something we would like to own.'),
            l('agent', 'Bring him in alive. Cage, chains, the lot. Ten thousand on delivery.'),
            l('marc', 'Ten thousand for a werewolf. You people really don’t value your werewolves.', 'think'),
            l('agent', 'One more thing. Our file says your name is Spector. Our other file says it isn’t.'),
            l('marc', 'Pay whichever one is cheaper.'),
            l('narrator', 'The agent leaves. Marc notices you, then your Nubbin, and doesn’t reach for a weapon. That’s something.'),
            l('narrator', 'He glances up at the moon, and his jaw tightens, as if it has just said something rude about him.'),
            l('you', 'Who are you looking at?'),
            l('marc', 'Nobody. Habit. You’re not with them; you’ve got the face of someone who doesn’t lie for money. Keep up and keep quiet.'),
            l('nubbin', 'Prrp?'),
          ],
        },
        done: {
          id: 'mv-mk01-hire-done',
          lines: [
            l('narrator', 'Snapped fence posts. Grey fur on a bramble. Under an oak, a steel trap that someone else set first.'),
            l('narrator', 'Your Nubbin sniffs the jaws and sneezes. Fresh oil. Whoever set it was here less than an hour ago.'),
            l('marc', 'The Committee sent people ahead of me. Then why hire me at all?', 'think'),
          ],
        },
      },
      {
        id: 'mv-mk01-wolf',
        goal: 'Hold off the Committee’s men while Jack Russell gets away.',
        hint: 'A karate bout: block their rushes, then counter. A Power Nubbin hits hardest.',
        check: 'karate:win:mv-committee-men',
        scene: {
          id: 'mv-mk01-wolf',
          lines: [
            l('narrator', 'The trail ends in a clearing. A huge shape thrashes inside a net of steel cable, howling.'),
            l('marc', 'There’s our ten thousand. Stand back. When he gets loose, he won’t be gentle.'),
            l('narrator', 'Your Nubbin doesn’t stand back. It walks straight to the net and sits down just out of reach.'),
            l('narrator', 'The wolf stops thrashing and stares at it. There is a collar on its neck, stamped with the Committee’s mark.'),
            l('nubbin', 'Mmn.', 'soft'),
            l('you', 'He’s already wearing their brand. He didn’t come here to hurt anyone. He was put here.'),
            l('marc', 'A wolf that can’t take off his own collar. And the people paying me fitted it.', 'think'),
            l('marc', 'They don’t want a monster caught. They want a weapon delivered.', 'angry'),
            l('narrator', 'Lanterns bob between the trees. The Committee’s men, coming to collect early.'),
            l('marc', 'Right. Change of contract. Your call, Keeper. How do we get him out?'),
          ],
          choices: [
            {
              id: 'calm',
              label: 'Let the Nubbin calm him first.',
              set: { 'mv-mk-russell': 'calmed' },
              then: [
                l('narrator', 'Your Nubbin hums, low and steady. The wolf’s breathing slows to match it.'),
                l('marc', 'Huh. Never seen that done without a tranquiliser gun.', 'shock'),
              ],
            },
            {
              id: 'cut',
              label: 'Cut the cables now. Deal with the men after.',
              set: { 'mv-mk-russell': 'cut' },
              then: [
                l('narrator', 'Marc’s blade goes through the cable in three strokes. The wolf is gone into the dark before the third.'),
                l('marc', 'He’ll be fine. He’s the least dangerous animal in these woods tonight.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk01-wolf-done',
          lines: [
            l('narrator', 'The last of the Committee’s men drops his lantern and runs. Nobody chases him.'),
            l('marc', 'They’ll tell their bosses I went soft. Let them.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk01-complete',
      lines: [
        l('narrator', 'By dawn the clearing holds broken lanterns and a note pinned to an oak: CONTRACT VOID. INVOICE TO FOLLOW.'),
        l('narrator', 'A young man in a borrowed coat, shivering and barefoot, nods at you from the road.'),
        l('jack', 'I don’t remember much of last night. I remember the little one. Thank you.', 'soft'),
        l('marc', 'Thank me too. I cut you loose, fought off six of them, carried you the last mile on my back.'),
        l('narrator', 'That isn’t how it went. Your Nubbin looks at you. You look at your Nubbin. Neither of you says so.'),
        l('marc', 'No? Huh. It’s how I remember it. I remember a lot of things that way.', 'think'),
        l('marc', 'I just turned down ten thousand dollars because a small round animal looked at me. Tell no one.'),
        l('marc', 'Here. Silver’s hard to come by out there. Your Nubbin earned it.'),
        l('narrator', 'He presses a silver crescent into your hand and walks off into the morning. You’ll see him again.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk01-crescent',
        kind: 'cosmetic',
        label: 'Silver crescent',
        description: 'A small silver crescent your Nubbin can wear on its chest. It glints under a full moon.',
      },
      {
        id: 'mv-mk01-title',
        kind: 'title',
        label: 'Contract Breaker',
        description: 'Title: you talked a mercenary out of his fee.',
      },
    ],
    sets: { 'mv-mk01': true },
    notes:
      'Night woods, full moon, fog. The werewolf is a big silhouette in the net; no transformation sequence. ' +
      'The Committee collar is a readable prop (crest stamp). Marc wears the early silver armour and white cloak, not the later costume. ' +
      'Jack appears human in the complete scene. Soft wolf-breathing loop under the calm choice. ' +
      'Marc’s wrong retelling in the complete scene is the line’s first unreliable memory; play it straight, with the Nubbin’s look as the only correction.',
  },

  // ---------------------------------------------------------------------- MK2
  {
    id: 'mv-mk02',
    code: 'MK2',
    title: 'Death in Egypt',
    source: 'Moon Knight #1 (1980): the origin',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After The Mercenary.' },
    requires: ['MK1'],
    speakers: [NUBBIN, MARC, FRENCHIE, BUSHMAN, MARLENE, KHONSHU],
    steps: [
      {
        id: 'mv-mk02-dig',
        goal: 'Warn the archaeologists before Bushman moves.',
        hint: 'Talk to Marlene in the trench, then run for the tomb.',
        check: 'talk:mv-marlene',
        scene: {
          id: 'mv-mk02-dig',
          lines: [
            l('narrator', 'The rift opens onto sand and noon heat. Below a ridge: tents, trenches, and a dig going deep.'),
            l('frenchie', 'Marc! Over here, out of the sun. You brought a friend. And a… a loaf, with eyes?'),
            l('marc', 'Frenchie, Keeper. Keeper, Frenchie. He flies the plane and complains about everything else.'),
            l('frenchie', 'I complain about the plane also. It is only fair.', 'happy'),
            l('narrator', 'A broad man with a tattooed face strides past, rifle over his shoulder. The mercenaries go quiet around him.'),
            l('bushman', 'The professor found gold under his tent, Spector. Gold belongs to whoever’s holding a gun.'),
            l('marc', 'That wasn’t the job, Raoul. We were hired to guard the road.', 'angry'),
            l('bushman', 'The job is what I say it is. Go guard something.'),
            l('narrator', 'A young woman with a notebook watches from the trench. Your Nubbin waves. After a moment, she waves back.'),
            l('marlene', 'My father says the gold doesn’t matter. It’s the statue beneath it. A moon god nobody has seen in three thousand years.'),
            l('narrator', 'Bushman’s men are walking towards the tomb. Marc is watching them, and doing sums he doesn’t like.'),
          ],
          choices: [
            {
              id: 'tomb',
              label: 'Run for the tomb to warn her father.',
              set: { 'mv-mk-dig': 'tomb' },
              then: [
                l('marlene', 'He won’t come out. He never comes out when he’s found something.', 'think'),
                l('marc', 'Then we go in and drag him. Keeper, with me.'),
              ],
            },
            {
              id: 'marlene',
              label: 'Get Marlene out of the trench first.',
              set: { 'mv-mk-dig': 'marlene' },
              then: [
                l('marlene', 'I am not leaving him!', 'angry'),
                l('narrator', 'She doesn’t. But your Nubbin trips her up twice on the way, very politely, and that buys the few steps that matter.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk02-dig-done',
          lines: [
            l('narrator', 'You reach Marlene. You don’t reach the tomb in time. Shots, then shouting, then nothing.'),
            l('narrator', 'Her father lies still at the tomb’s mouth. Bushman steps over him without looking down.'),
            l('marlene', 'No. No, no, no.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-mk02-statue',
        goal: 'Bring Marlene and Frenchie to the statue before dawn.',
        hint: 'Cross the dunes on the Expedition map; the moonlit path shows the way.',
        check: 'expedition:clear:mv-khonshu-tomb',
        scene: {
          id: 'mv-mk02-statue',
          lines: [
            l('marc', 'You killed an old man for a pile of cups.', 'angry'),
            l('bushman', 'I killed him for being in the way. You’re in the way now, Spector.'),
            l('narrator', 'It isn’t a fair fight. Bushman’s men hold Marc down. Then they leave him in the sand to finish dying.'),
            l('narrator', 'Night. Marc crawls toward the tomb. Your Nubbin walks beside him, step for step, the whole way.'),
            l('marc', 'Every client I ever had, and the only one who stuck around is… whatever you are.', 'sad'),
            l('narrator', 'He reaches the foot of a statue: a tall figure with a bird’s skull for a face, a crescent behind its head.'),
            l('marc', 'Look after Marlene, if you can. She’s going to need someone.', 'sad'),
            l('narrator', 'His hand drops. Your Nubbin presses against his side and does not move.'),
            l('narrator', 'The moon comes up, very large and very white. It is looking at him.'),
            l('khonshu', 'Rise, Marc Spector. You have not finished. You have hardly begun.'),
          ],
          choices: [
            {
              id: 'stay',
              label: 'Keep the Nubbin beside him.',
              set: { 'mv-mk-vigil': 'stayed' },
              then: [
                l('narrator', 'Your Nubbin stays pressed to him, warm, while the moonlight thickens around them like frost.'),
                l('khonshu', 'The small thing keeps vigil. Good. Someone should.'),
              ],
            },
            {
              id: 'fetch',
              label: 'Run for Marlene and Frenchie.',
              set: { 'mv-mk-vigil': 'fetched' },
              then: [
                l('narrator', 'You run. Behind you, the light over the statue grows until the sand glows silver.'),
                l('frenchie', 'Keeper? Where is he? Where is Marc?', 'shock'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk02-statue-done',
          lines: [
            l('narrator', 'Marc sits at the foot of the statue in the white shroud that had covered it. He is breathing. He shouldn’t be.'),
            l('marlene', 'You were dead. I saw you.', 'shock'),
            l('frenchie', 'An hour, Keeper. He was gone an hour. I timed it on my watch.', 'shock'),
            l('marlene', 'It was a minute. I was holding his hand. One minute.'),
            l('marc', 'Yeah. Somebody disagreed. Several somebodies, apparently.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk02-complete',
      lines: [
        l('narrator', 'Frenchie flies everyone home at dawn, low over the water.'),
        l('marlene', 'He talks in his sleep. Not to me. To someone up there.', 'sad'),
        l('frenchie', 'He was dead, Keeper. I know what dead looks like. Now he talks about buying a mansion and a taxi.', 'think'),
        l('marc', 'The god said I’m his fist now. Maybe the heat cooked my brain. Maybe not.', 'think'),
        l('marc', 'Either way, you stayed. I don’t forget that.', 'soft'),
        l('narrator', 'He tears a strip from the white shroud and ties it round your Nubbin. It is cold, even in the sun.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk02-shroud',
        kind: 'item',
        label: 'Strip of white shroud',
        description: 'Cut from the cloth on Khonshu’s statue. Always cool to the touch; a Nubbin holding it sleeps through the night.',
      },
      {
        id: 'mv-mk02-title',
        kind: 'title',
        label: 'Kept Vigil',
        description: 'Title: you stayed with a dying man in the desert.',
      },
    ],
    sets: { 'mv-mk02': true },
    notes:
      'Dr Alraune’s death and Marc’s beating happen offscreen or in silhouette: cut to black on the shots, cut away as the men close in. ' +
      'Khonshu here is only the statue and a voice; the moon should visibly “look” (a slow brighten). ' +
      'Marc wears the statue’s shroud when he rises. Moods matter: Marlene stays sad through the complete scene. ' +
      'Verify the setting (the 1980 origin places the dig in Sudan/Egypt borderlands; the brief says Egypt).',
  },

  // ---------------------------------------------------------------------- MK3
  {
    id: 'mv-mk03',
    code: 'MK3',
    title: 'Three Faces',
    source: 'Moon Knight #2–15 (1980–82)',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After Death in Egypt.' },
    requires: ['MK2'],
    speakers: [
      NUBBIN,
      MARC,
      STEVEN,
      JAKE,
      MARLENE,
      BUSHMAN,
      { id: 'gena', name: 'Gena', kind: 'other', basedOn: 'Gena Landers (Marvel)' },
      { id: 'crawley', name: 'Crawley', kind: 'other', basedOn: 'Crawley (Marvel)' },
    ],
    steps: [
      {
        id: 'mv-mk03-split',
        goal: 'Send a Nubbin into each of Marc’s lives and bring back Bushman’s trail.',
        hint: 'Assign one Nubbin to Steven and one to Jake; you go with the life you chose. Each comes back with a clue at dawn.',
        check: 'assign:mv-three-lives',
        scene: {
          id: 'mv-mk03-split',
          lines: [
            l('narrator', 'The rift drops you on a gravel drive outside a mansion on Long Island. Every window is lit.'),
            l('steven', 'The Keeper! Come in. Wipe your feet, or don’t; the carpet’s insured. Steven Grant.', 'happy'),
            l('you', 'We’ve met. In the desert.'),
            l('steven', 'You met Marc. I’m Steven. I make the money, I go to the parties, I remember everyone’s birthday.'),
            l('steven', 'Marc works the nights. Jake drives a cab and hears things. We share the hours the way flatmates share a kitchen.'),
            l('marlene', 'It isn’t a costume, Keeper. Each of them is really there. Talk to whoever is in front of you.', 'soft'),
            l('steven', 'She explains us better than we do. Bushman is in the city, and he’s left a trail through all three of our lives.'),
            l('steven', 'Your Nubbins can be where we can’t all be at once. One with me, one with Jake, and you with whoever you like.'),
            l('nubbin', 'Prrp!', 'happy'),
          ],
          choices: [
            {
              id: 'steven',
              label: 'Go with Steven to the charity gala.',
              set: { 'mv-mk-first-face': 'steven' },
              then: [l('steven', 'Excellent. Black tie. I’ll find something in your size. Marlene, do we have black tie in… round?')],
            },
            {
              id: 'jake',
              label: 'Ride along in Jake’s cab.',
              set: { 'mv-mk-first-face': 'jake' },
              then: [
                l('narrator', 'Steven closes his eyes. When he opens them he stands differently, and reaches for a flat cap on the hall stand.'),
                l('jake', 'Cab’s round the back. You sit up front. The little ones sit wherever they want.', 'happy'),
              ],
            },
            {
              id: 'moon',
              label: 'Go with Moon Knight onto the rooftops.',
              set: { 'mv-mk-first-face': 'moon-knight' },
              then: [l('marc', 'Rooftops, then. Wrap up. It’s colder up there than people think.')],
            },
          ],
        },
        done: {
          id: 'mv-mk03-split-done',
          lines: [
            l('narrator', 'At dawn your Nubbins come back to the mansion, each with a different story.'),
            l('narrator', 'One saw a gentleman leave his own party to sit with a lonely waiter. One saw a cabbie give a soaked kid a free ride.'),
            l('narrator', 'And someone saw a man in white cross the rooftops like falling snow. All three heard the same name: the old pier.'),
            l('narrator', 'Then you compare times. The gala speech, the free ride, the rooftop chase. All three happened at ten past two.'),
            l('you', 'That can’t be right. There’s only one of him.'),
            l('marlene', 'Don’t do the sums, Keeper. I tried for a year. They never come out the same twice.', 'soft'),
            l('marlene', 'Three different men. One heart. That part always adds up.', 'soft'),
          ],
        },
      },
      {
        id: 'mv-mk03-bushman',
        goal: 'Storm Bushman’s pier warehouse with Moon Knight.',
        hint: 'A karate bout against Bushman. A Run Nubbin should dodge his knife; a Power Nubbin finishes it.',
        check: 'karate:win:mv-bushman',
        scene: {
          id: 'mv-mk03-bushman',
          lines: [
            l('narrator', 'Gena’s diner smells of coffee and onions. Jake has the booth by the window.'),
            l('jake', 'Gena, two coffees, and whatever the little fella eats.', 'happy'),
            l('gena', 'It already ate the sugar, Jake. All of it.'),
            l('narrator', 'A thin man in a coat too big for him slides into the booth and talks to the tabletop.'),
            l('crawley', 'Your man with the painted face, Jake. Old pier warehouse. Men with guns. Crates of money that aren’t his.'),
            l('jake', 'Thanks, Crawl. Eat something. On me.', 'soft'),
            l('jake', 'Marc wants Bushman bad. Steven wants him in a courtroom. Me, I just want him to stop.', 'think'),
            l('you', 'What do the three of you agree on?'),
            l('jake', 'That nobody else gets hurt. We always agree on that bit.', 'soft'),
            l('narrator', 'Jake glances at the moon, still faint in the morning sky. He doesn’t look at it fondly.'),
            l('jake', 'Tonight one of us goes in first. Whoever does, that’s how it goes. You pick, Keeper. We’ll only argue.'),
          ],
          choices: [
            {
              id: 'marc',
              label: 'Let Marc lead. Bushman should feel it.',
              set: { 'mv-mk-bushman-lead': 'marc' },
              then: [
                l('jake', 'Marc, then. Watch him for me. He doesn’t always notice where the edge is till he’s over it.', 'think'),
              ],
            },
            {
              id: 'steven',
              label: 'Let Steven lead. Bushman belongs in a courtroom.',
              set: { 'mv-mk-bushman-lead': 'steven' },
              then: [
                l('jake', 'Steven’ll bring handcuffs and a lawyer’s phone number. He’ll have ironed both.'),
                l('crawley', 'Bring a big pair. Of cuffs. He’s got wide wrists.'),
              ],
            },
            {
              id: 'jake',
              label: 'Let Jake lead. Just make him stop.',
              set: { 'mv-mk-bushman-lead': 'jake' },
              then: [l('jake', 'Quiet, then. Cab round the back, no speeches, no cape. In and out.', 'soft')],
            },
          ],
        },
        done: {
          id: 'mv-mk03-bushman-done',
          lines: [
            l('narrator', 'Bushman goes through a stack of crates and stays down. Sirens are already close.'),
            l('narrator', 'Afterwards, nobody can agree who threw the last punch. Your Nubbin saw it. It isn’t telling.'),
            l('marc', 'He’ll go to prison. He’ll get out. He always gets out.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk03-complete',
      lines: [
        l('narrator', 'Back at the mansion: Steven pours tea, Jake’s cap hangs on the stand, the white cloak dries by the fire.'),
        l('steven', 'You met all of us. Most people meet one and decide that’s plenty.', 'soft'),
        l('you', 'Which one of you is the real Marc?'),
        l('steven', 'All of us. That’s the honest answer, and the boring one.', 'think'),
        l('jake', 'He says that because he’s the one who answers the door. Ask again at three in the morning.', 'think'),
        l('marlene', 'Thank you for talking to each of them like a person. They notice.', 'soft'),
        l('narrator', 'Steven gives you a hatbox. Inside: a silk top hat, a battered cabbie’s cap, and a small white hood.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk03-hats',
        kind: 'cosmetic',
        label: 'Three hats',
        description: 'A top hat, a cabbie’s flat cap and a white hood, sized for Nubbins. Any Nubbin can wear any of the three.',
      },
    ],
    sets: { 'mv-mk03': true, 'mv-mk-met-faces': true },
    notes:
      'The three identities are separate speakers with separate portraits and voices: Steven (polished, warm, dry), ' +
      'Jake (street-smart, kind, plain-spoken), Marc (clipped, tired). Switches are shown by posture and wardrobe, never by a gag or a sound effect. ' +
      'The split step runs the Keeper with the chosen life and the two Nubbins with the others; each returns one clue card. ' +
      'All three clue cards are stamped 2:10 a.m.; the impossible overlap is the storyline’s quiet question and is never explained. ' +
      'mv-mk-bushman-lead (marc | steven | jake) picks who leads the pier raid: Marc’s bout is fastest and harshest, Steven’s ends in an arrest, Jake’s is a stealth entry. ' +
      'Gena and Crawley are Jake’s regulars from the 1980 run; check names before ship.',
  },

  // ---------------------------------------------------------------------- MK4
  {
    id: 'mv-mk04',
    code: 'MK4',
    title: 'The Bottom',
    source: 'Moon Knight vol. 5 #1–6 (2006)',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After Three Faces.' },
    requires: ['MK3'],
    speakers: [
      NUBBIN,
      MARC,
      KHONSHU,
      FRENCHIE,
      { id: 'taskmaster', name: 'Taskmaster', kind: 'other', basedOn: 'Taskmaster (Marvel)' },
    ],
    steps: [
      {
        id: 'mv-mk04-chair',
        goal: 'Help Marc through his recovery, one day at a time.',
        hint: 'Visit him on five separate days. Feed him, sit with him, and let a high-trust Nubbin stay the night.',
        check: 'visit:mv-marc-recovery:5',
        scene: {
          id: 'mv-mk04-chair',
          lines: [
            l('narrator', 'The mansion is dark. Dust on the banisters. Empty bottles on the stairs.'),
            l('frenchie', 'He doesn’t let me in much now. He doesn’t let anyone in. Go gently.', 'sad'),
            l('narrator', 'Marc sits in a wheelchair in the empty ballroom, both legs in braces. He hasn’t shaved in weeks.'),
            l('marc', 'Keeper. Come to see the fist of the god? Here it is. Doesn’t close all the way any more.', 'sad'),
            l('narrator', 'In the corner stands a tall shape with a bird’s skull for a face. Marc looks at it. So does your Nubbin.'),
            l('khonshu', 'You quit me, my son. Rotting in a chair while the night goes unanswered.'),
            l('marc', 'You’re not here. You’re a bad night and a cracked skull.', 'angry'),
            l('khonshu', 'Then why does the small creature see me?'),
            l('narrator', 'Your Nubbin edges to the wheelchair and puts itself between Marc and the corner.'),
            l('marc', 'Marlene left. Frenchie stays because he’s too kind to go. Why are you here?', 'sad'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit with him. Say nothing.',
              set: { 'mv-mk-bottom': 'stayed' },
              then: [
                l('narrator', 'You sit on the floor by his chair. Minutes pass. His hand finds your Nubbin’s head and stays there.'),
                l('marc', '…Okay.', 'soft'),
              ],
            },
            {
              id: 'push',
              label: '“You came back once. You can do it again.”',
              set: { 'mv-mk-bottom': 'pushed' },
              then: [
                l('marc', 'Last time I had a god holding me up. Now he just watches.', 'sad'),
                l('khonshu', 'I am not watching. I am waiting.'),
              ],
            },
            {
              id: 'face',
              label: 'Speak to the shape in the corner.',
              set: { 'mv-mk-bottom': 'faced-khonshu' },
              then: [
                l('you', 'Leave him alone.'),
                l('khonshu', 'I chose a fist, and it seems I was given a Keeper with opinions.', 'think'),
                l('marc', 'Nobody’s ever told him off before. Do it again.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk04-chair-done',
          lines: [
            l('narrator', 'On the fifth day he stands. Two steps, then the rail, then two more.'),
            l('marc', 'Don’t clap. If anyone claps I’m sitting back down.', 'think'),
            l('frenchie', 'I am not clapping. I am crying a little. Different thing.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-mk04-taskmaster',
        goal: 'Survive Taskmaster’s attack on the mansion.',
        hint: 'Taskmaster copies your Nubbin’s last move. Never use the same move twice in a row.',
        check: 'karate:win:mv-taskmaster:no-repeat',
        scene: {
          id: 'mv-mk04-taskmaster',
          lines: [
            l('narrator', 'The night Marc walks without the rail, the skylight breaks.'),
            l('narrator', 'A hooded man in a skull mask drops onto the ballroom floor with a sword, a shield and a bow.'),
            l('taskmaster', 'Spector. Somebody’s paying to find out if you’re finished. I watched every fight you ever had on tape.'),
            l('taskmaster', 'Every move you know, I know. That’s my whole act.'),
            l('marc', 'Then you learned the old me.', 'angry'),
            l('khonshu', 'Now, my son. Show me you are still mine.'),
            l('narrator', 'Marc’s voice changes. It goes very quiet and very flat, and your Nubbin flinches for the first time.'),
            l('marc', 'Keeper. Take the little one out of the room.'),
            l('you', 'Marc—'),
            l('marc', 'Please. I don’t want it to see this.', 'sad'),
          ],
          choices: [
            {
              id: 'leave',
              label: 'Do as he asks. Carry the Nubbin out.',
              set: { 'mv-mk-taskmaster': 'left' },
              then: [
                l('narrator', 'You shut the ballroom doors. Through them: a sword, a shield, and a voice you would not have known was Marc’s.'),
              ],
            },
            {
              id: 'stay',
              label: 'Stay. Make him do it in front of you.',
              set: { 'mv-mk-taskmaster': 'stayed' },
              then: [
                l('you', 'No. We stay. Whoever you’re about to be, you can be it in front of us.'),
                l('narrator', 'Marc looks at your Nubbin. Something in his face fights its way back up. It doesn’t win. But it slows him down.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk04-taskmaster-done',
          lines: [
            l('narrator', 'Then it is quiet. Taskmaster is gone through the skylight, leaving a cracked shield on the parquet.'),
            l('narrator', 'Marc is standing. His knuckles are split. He doesn’t look like someone who won.'),
            l('marc', 'Did I do that? I don’t remember the middle of it. There’s a gap, like a record skipping.', 'shock'),
            l('khonshu', 'You did not. I did. You lent me your hands, my son, and I gave them back. Better. Much better.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk04-complete',
      lines: [
        l('marc', 'I’m back. That’s what he wanted. I don’t know yet if it’s what I wanted.', 'think'),
        l('marc', 'Or if it was me who came back. Frenchie. Am I me? Tell me straight.', 'sad'),
        l('frenchie', 'You are walking. You are rude about my coffee. I will take that as a yes.', 'soft'),
        l('marc', 'Keeper. The way I went quiet back there. Don’t ever let the little one get used to that.', 'sad'),
        l('narrator', 'Your Nubbin climbs into his lap anyway. After a moment, he lets it.'),
        l('narrator', 'Frenchie walks you out and hands you Marc’s silver-headed cane. He says Marc won’t be needing it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk04-cane',
        kind: 'decor',
        label: 'Silver-headed cane',
        description: 'Marc’s old walking cane, for the stand by your door. He doesn’t need it any more.',
      },
      {
        id: 'mv-mk04-title',
        kind: 'title',
        label: 'Stayed in the Dark',
        description: 'Title: you kept a broken man company until he stood up.',
      },
    ],
    sets: { 'mv-mk04': true },
    notes:
      'The darkest storyline in the line. Drinking and despair are present but shown, not dwelt on: bottles as set dressing, no drinking on screen. ' +
      'Khonshu appears as a tall figure only Marc and the Nubbin see; keep it in the corner, still, lit from above. ' +
      'Taskmaster: with mv-mk-taskmaster = left, the fight plays as muffled sound over a closed door, then the karate bout as the Nubbins rejoin; ' +
      'with stayed, the Keeper watches from the doorway and the bout starts at once. Either way the done scene opens on the quiet after. ' +
      'Khonshu’s claim that he fought through Marc is deliberately unverifiable: never confirm or deny it on screen. ' +
      'No blood on screen. The rehab step is a five-day calendar check.',
  },

  // ---------------------------------------------------------------------- MK5
  {
    id: 'mv-mk05',
    code: 'MK5',
    title: 'Mr. Knight',
    source: 'Moon Knight vol. 7 #1–6 (2014), especially #5',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After The Bottom.' },
    requires: ['MK4'],
    speakers: [
      NUBBIN,
      { id: 'mrknight', name: 'Mr. Knight', kind: 'other', basedOn: 'Marc Spector as Mr. Knight (Marvel)' },
      { id: 'flint', name: 'Detective Flint', kind: 'other', basedOn: 'Detective Flint (Marvel)' },
      { id: 'girl', name: 'The Girl', kind: 'other' },
      { id: 'kidnapper', name: 'Kidnapper', kind: 'other' },
    ],
    steps: [
      {
        id: 'mv-mk05-scene',
        goal: 'Climb the tower alongside Mr. Knight, floor by floor.',
        hint: 'Run the Cliff course; each checkpoint is a floor. High Power and Run climb fastest.',
        check: 'race:finish:cliff',
        scene: {
          id: 'mv-mk05-scene',
          lines: [
            l('narrator', 'Midtown, three in the morning. Police tape, a blue light turning, and a white limousine pulling up.'),
            l('narrator', 'Out steps a man in a spotless white three-piece suit and a white mask. He bows to your Nubbins.'),
            l('mrknight', 'Keeper. Detective Flint. Detective, the Keeper, and associates.'),
            l('flint', 'You brought pets to a crime scene. And the file says you’re Spector. Or Grant. Or a cabbie. It’s a long file.'),
            l('mrknight', 'Tonight it’s a short one. Mr. Knight. And I brought colleagues, not pets. Tell us about the girl.'),
            l('flint', 'Taken from her family’s car an hour ago. They’re holding her on the top floor. Twelve floors of their people in between.'),
            l('flint', 'Armed response is forty minutes out. I don’t think she has forty minutes.', 'sad'),
            l('mrknight', 'Then I’ll go in the front door. White is useful, Keeper. They see me coming, and they know what it means.'),
            l('you', 'Why the suit?'),
            l('mrknight', 'The cloak was for the god. The suit is for the people I help. I want them to see exactly who has come.', 'soft'),
          ],
          choices: [
            {
              id: 'front',
              label: 'Go in the front, one floor behind him.',
              set: { 'mv-mk-climb': 'stairs' },
              then: [l('mrknight', 'Good. Stay a flight back. If I say down, you go down.')],
            },
            {
              id: 'wall',
              label: 'Send the Nubbins up the outside wall.',
              set: { 'mv-mk-climb': 'wall' },
              then: [
                l('flint', 'Your… colleagues are climbing the building. The outside of it.', 'shock'),
                l('mrknight', 'Yes. They do that.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk05-scene-done',
          lines: [
            l('narrator', 'Floor after floor. Every landing is quieter once he has passed it.'),
            l('narrator', 'Fourth floor: a dentist’s waiting room, the fish tank still bubbling. Seventh: a gym, every treadmill running for nobody.'),
            l('mrknight', 'Ninth floor. Insurance. I always hated the ninth floor.', 'think'),
            l('narrator', 'By the eleventh floor the white jacket is torn, and he is breathing hard, and he does not slow down.'),
          ],
        },
      },
      {
        id: 'mv-mk05-top',
        goal: 'Walk the girl back down the stairs.',
        hint: 'Keep a Nubbin beside her the whole way. If she is left alone for a moment, she panics and stops.',
        check: 'escort:mv-girl:no-alone',
        scene: {
          id: 'mv-mk05-top',
          lines: [
            l('narrator', 'Top floor. One door. Behind it, one last man with a gun, and a frightened girl tied to a chair.'),
            l('kidnapper', 'Another step and I swear—', 'shock'),
            l('mrknight', 'You’re tired. I’m tired. She wants to go home. Let’s all go home.'),
            l('narrator', 'The man looks past him at the stairwell, and at the eleven floors of silence behind it.'),
            l('narrator', 'Your Nubbin trots past both of them, sits on the girl’s feet, and looks up at her.'),
            l('girl', 'Is that… yours?', 'shock'),
            l('you', 'It’s yours for tonight.'),
            l('mrknight', 'Keeper, untie her. Sir, put that on the floor and slide it to me.'),
            l('narrator', 'The man’s hand shakes. Then the gun lands on the floorboards.'),
            l('mrknight', 'Thank you.', 'soft'),
          ],
        },
        done: {
          id: 'mv-mk05-top-done',
          lines: [
            l('narrator', 'Twelve flights down. The girl holds your Nubbin the whole way and doesn’t look at the landings.'),
            l('girl', 'It’s warm. Is it always this warm?', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk05-complete',
      lines: [
        l('narrator', 'At the tape, her mother runs to her and does not let go.'),
        l('flint', 'Twelve floors, on your own. Next time, wait for the response team.'),
        l('mrknight', 'Next time, Detective, have them wait for me.'),
        l('narrator', 'He looks down at the ruin of his white suit, then at your Nubbin, which is spotless.'),
        l('flint', 'Off the record. Which one of you was that up there?'),
        l('mrknight', 'The one who was needed, Detective. That’s the only one I ever send.', 'think'),
        l('mrknight', 'Every detective needs a good suit. So does every detective’s Nubbin.', 'happy'),
        l('narrator', 'A box arrives at the Grove the next morning, wrapped in white ribbon.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk05-suit',
        kind: 'cosmetic',
        label: 'Little white suit',
        description: 'A tiny white three-piece suit and mask for a Nubbin. It stays spotless, somehow.',
      },
    ],
    sets: { 'mv-mk05': true },
    notes:
      'Climb staged on the Cliff race course reskinned as a tower: each checkpoint is a floor number. ' +
      'Fights on the stairs are implied by the quiet landings, not shown. The kidnapped girl is unnamed. ' +
      'The final standoff resolves without a shot. Mr. Knight is a separate portrait from Marc (white suit, white mask) but the same man; he refers to Marc in the first person.',
  },

  // ---------------------------------------------------------------------- MK6
  {
    id: 'mv-mk06',
    code: 'MK6',
    title: 'Lunatic',
    source: 'Moon Knight vol. 8 #1–14 (2016–17)',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After Mr. Knight.' },
    requires: ['MK5'],
    speakers: [
      NUBBIN,
      MARC,
      STEVEN,
      JAKE,
      KHONSHU,
      { id: 'emmett', name: 'Dr Emmett', kind: 'other', basedOn: 'Dr. Emmett (Marvel)' },
    ],
    steps: [
      {
        id: 'mv-mk06-ward',
        goal: 'Find Steven and Jake in the asylum’s locked wings.',
        hint: 'Explore the wards on the Expedition map. Doors open for Nubbins who trust you; bring your highest-trust pair.',
        check: 'expedition:clear:mv-asylum-wards',
        scene: {
          id: 'mv-mk06-ward',
          lines: [
            l('narrator', 'You step out of the rift into a white corridor that smells of bleach. A door locks behind you.'),
            l('narrator', 'Marc sits on a narrow bed in a hospital gown, a plastic bracelet on his wrist.'),
            l('emmett', 'You’ve been here since you were a boy, Marc. No god. No cloak. No Moon Knight.'),
            l('emmett', 'The sooner you accept that, the sooner you can go home.'),
            l('marc', 'You hear that, Keeper? None of it happened. Not the desert. Not the tower. Not you.', 'think'),
            l('narrator', 'Dr Emmett looks straight through you, as if you were a crack in the paint.'),
            l('emmett', 'Who are you talking to, Marc?'),
            l('emmett', 'Is it the Keeper again? Your notes mention a Keeper. Little round animals. You invented them at nine, after the funeral.'),
            l('narrator', 'Your Nubbin sniffs the bracelet on Marc’s wrist and sneezes. The printed name flickers like a bad screen.'),
            l('marc', 'There. You saw that. Tell me you saw that.', 'shock'),
            l('you', 'I saw it.'),
            l('marc', 'Then this place is the lie. Steven and Jake are locked in here somewhere. Help me find them.', 'angry'),
          ],
          choices: [
            {
              id: 'steven',
              label: 'Look for Steven first.',
              set: { 'mv-mk-asylum': 'steven-first' },
              then: [l('marc', 'Steven, then. He’ll have charmed a spare key out of somebody by now.')],
            },
            {
              id: 'jake',
              label: 'Look for Jake first.',
              set: { 'mv-mk-asylum': 'jake-first' },
              then: [l('marc', 'Jake. He knows the back door of every building in the world.')],
            },
            {
              id: 'doubt',
              label: '“Marc. What if she’s right?”',
              set: { 'mv-mk-asylum-doubt': true },
              then: [
                l('marc', 'Then you’re not here, and I’m talking to a wall, and the wall just asked a very good question.', 'think'),
                l('marc', 'I’ll risk it. If I’m mad, I’d rather be mad and looking for my friends. Come on.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk06-ward-done',
          lines: [
            l('narrator', 'Steven is in a room full of film reels, half sure he is someone else’s story. Jake is in a cell painted like a cab.'),
            l('steven', 'Marc. Thank heavens. I was starting to think I’d made you up.', 'shock'),
            l('jake', 'Funny. I always figured I made up the pair of you.', 'think'),
            l('steven', 'Can we have this argument somewhere with a door handle on the inside?'),
            l('jake', 'All three of us in one room, though. Been a while.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-mk06-god',
        goal: 'Stand with all three of them against Khonshu.',
        hint: 'A three-round karate bout; a different face leads each round. Swap your lead Nubbin between rounds.',
        check: 'karate:win:mv-khonshu-avatar:3-rounds',
        scene: {
          id: 'mv-mk06-god',
          lines: [
            l('narrator', 'Past the last locked door the floor turns to sand and the ceiling to night. The moon hangs low and enormous.'),
            l('khonshu', 'My fist returns. With his passengers, and his pets.'),
            l('khonshu', 'You fled into a little white room to hide from me, Marc. I built its walls for you.'),
            l('marc', 'You built them.', 'angry'),
            l('khonshu', 'I needed you broken so you would come back whole. And mine.'),
            l('steven', 'He isn’t talking to us. He’s talking about us. Like furniture.'),
            l('jake', 'He always did.', 'angry'),
            l('marc', 'Look at me. Not at the cloak. At me.', 'angry'),
            l('marc', 'I’m not your fist and I’m not your son. I’m three men who decided to live, and we’re done kneeling.'),
            l('khonshu', '…You have never spoken to me like this.', 'think'),
            l('narrator', 'The three of them stand side by side. Your Nubbins stand in front, small as stones and twice as stubborn.'),
          ],
        },
        done: {
          id: 'mv-mk06-god-done',
          lines: [
            l('narrator', 'The moon pulls back. Sand becomes floor, floor becomes pavement, and the asylum is gone.'),
            l('khonshu', 'Equals, then. For now.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk06-complete',
      lines: [
        l('narrator', 'You come out on a Manhattan street at dawn. Marc is in his own clothes.'),
        l('marc', 'He’ll be back. He always comes back. But this time he’ll knock.', 'think'),
        l('steven', 'We should mark the occasion. Brunch.', 'happy'),
        l('jake', 'Diner. Gena’s.'),
        l('marc', 'Diner.', 'happy'),
        l('narrator', 'He snaps the plastic bracelet off his wrist and gives it to your Nubbin, which wears it as a crown.'),
        l('narrator', 'The name printed on it has gone blank. Your Nubbin doesn’t seem to mind whose it was.'),
        l('steven', 'For the record, Keeper, if you ever do turn out to be imaginary, you were the best thing we ever imagined.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk06-bracelet',
        kind: 'item',
        label: 'Snapped bracelet',
        description: 'The hospital bracelet Marc tore off on the way out. The name on it has faded to nothing.',
      },
      {
        id: 'mv-mk06-title',
        kind: 'title',
        label: 'Saw Through the Walls',
        description: 'Title: you believed Marc when the whole building said otherwise.',
      },
    ],
    sets: { 'mv-mk06': true },
    notes:
      'The asylum is a false reality built by Khonshu; it must never read as mocking real hospitals or patients. ' +
      'Dr Emmett is calm and kind on the surface; the horror is that she cannot see the Keeper, and that Marc’s file already explains the Keeper away. ' +
      'The doubt choice (mv-mk-asylum-doubt) is a fair question, not a wrong answer: Marc takes it seriously and goes on anyway. It leaves mv-mk-asylum unset. ' +
      'Steven and Jake each get their own room in their own visual language (film set, taxi). ' +
      'The final bout is a dialogue of equals; Khonshu is not destroyed here. Verify Dr Emmett’s role in the source.',
  },

  // ---------------------------------------------------------------------- MK7
  {
    id: 'mv-mk07',
    code: 'MK7',
    title: 'The Midnight Mission',
    source: 'Moon Knight vol. 9 #1–12 (2021–22)',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After Lunatic, once Spawn has met Angela (SP4).' },
    requires: ['MK6', 'SP4'],
    speakers: [
      NUBBIN,
      MARC,
      KHONSHU,
      { id: 'hunter', name: 'Hunter’s Moon', kind: 'other', basedOn: 'Hunter’s Moon (Marvel)' },
      { id: 'rosa', name: 'Rosa', kind: 'other' },
    ],
    steps: [
      {
        id: 'mv-mk07-mission',
        goal: 'Walk the Mission’s night-walkers home while Hunter’s Moon prowls.',
        hint: 'Four Expedition legs at night; keep a Nubbin with each visitor.',
        check: 'expedition:clear:mv-mission-night:4',
        scene: {
          id: 'mv-mk07-mission',
          lines: [
            l('narrator', 'A narrow storefront under a railway bridge. A hand-painted sign: THE MIDNIGHT MISSION. OPEN ALL NIGHT.'),
            l('marc', 'Welcome. If you walk at night, you have a place here. Night nurses, insomniacs, cabbies, and stranger things.'),
            l('marc', 'I’m Khonshu’s priest now. I don’t wear the cloak for him any more. I wear it for them.', 'think'),
            l('you', 'Does he know that?'),
            l('marc', 'He knows. He sulks.'),
            l('narrator', 'The pews are full of tired people with coffee. A few have very pale skin and very good manners.'),
            l('marc', 'Word got round you walked with a Hellspawn and came back. Folk here like that. Most have been hunted too.'),
            l('narrator', 'The door bangs open. A masked man in a pale hood stands there with a crescent blade.'),
            l('hunter', 'Spector. The god has chosen another fist, a worthy one. I am Hunter’s Moon.'),
            l('hunter', 'You run a soup kitchen for creatures of the dark and call it worship. I am here to do your job properly.', 'angry'),
            l('marc', 'Come in, then. Wipe your feet. Keep your voice down; people are sleeping.'),
          ],
        },
        done: {
          id: 'mv-mk07-mission-done',
          lines: [
            l('narrator', 'Four doors, four locks turned, four people safe. Every time, a pale hood was waiting one street behind.'),
            l('rosa', 'He followed us the whole way. Your little one kept looking back at him, like it was keeping count.', 'shock'),
          ],
        },
      },
      {
        id: 'mv-mk07-hunter',
        goal: 'Stop Hunter’s Moon without anyone from the Mission getting hurt.',
        hint: 'A karate bout with guard rules: if an ally behind you is struck, the round is lost.',
        check: 'karate:win:mv-hunters-moon:guard-allies',
        scene: {
          id: 'mv-mk07-hunter',
          lines: [
            l('narrator', 'Hunter’s Moon corners you under the bridge, with Rosa and two other regulars behind you.'),
            l('hunter', 'Step aside, Keeper. The god told me what Spector is. A broken soldier, playing priest.'),
            l('hunter', 'He told me more. There was never a Marc Spector. Only a mercenary who wore the name, like a coat off a dead man.'),
            l('marc', 'Funny. He told me exactly the same about you. Word for word. He doesn’t even change the coat.', 'think'),
            l('hunter', '…He said that to me in confidence.', 'shock'),
            l('marc', 'He’s half right. I am broken. I’m also here. Where were you at three this morning when Rosa needed a ride?'),
            l('hunter', 'Khonshu does not care about rides.'),
            l('marc', 'No. That’s why I do.'),
            l('narrator', 'Your Nubbin walks up to Hunter’s Moon, looks at his blade, then at the frightened people behind you.'),
            l('you', 'It’s working out which of you is the one to be afraid of.'),
            l('khonshu', 'Two fists, quarrelling over my favour. How pleasant.', 'happy'),
          ],
          choices: [
            {
              id: 'fight',
              label: 'Stand with Marc and fight.',
              set: { 'mv-mk-hunter': 'fought' },
              then: [l('marc', 'Together, then. Keep them behind us.')],
            },
            {
              id: 'ask',
              label: 'Ask Hunter’s Moon who he protects.',
              set: { 'mv-mk-hunter': 'questioned' },
              then: [
                l('hunter', 'I protect… the god’s will.', 'think'),
                l('marc', 'That’s not a who, friend.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk07-hunter-done',
          lines: [
            l('narrator', 'Hunter’s Moon backs into the dark, blade lowered. He doesn’t run. He looks like a man doing sums.'),
            l('hunter', 'I will be watching, Spector. Both of us will.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk07-complete',
      lines: [
        l('narrator', 'Back at the Mission the coffee is still hot. Nobody asks what happened. Everybody knows.'),
        l('marc', 'He’ll be back. Khonshu wants two fists so he can play one against the other.', 'think'),
        l('marc', 'Let him. I’ve got a door to keep open.'),
        l('rosa', 'Which one of you is preaching on Sunday? Last week it was the posh one. He did a slideshow.'),
        l('marc', 'Jake. Jake’s turn. He’ll keep it short and swear twice.', 'happy'),
        l('rosa', 'The little one should have this. It never goes out. We need one that doesn’t go out.', 'soft'),
        l('narrator', 'Rosa takes down the small lantern that hangs over the Mission door and puts it in your hands.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk07-lantern',
        kind: 'decor',
        label: 'Mission lantern',
        description: 'The lantern from the Midnight Mission’s door. It never goes out. Hang it in the Grove for anyone who walks at night.',
      },
    ],
    sets: { 'mv-mk07': true, 'mv-mk-mission-lantern': true },
    notes:
      'Needs SP4: after Angela, word of “hunters in the sky” has reached this world, and the Mission trusts a Keeper who walked with a Hellspawn. ' +
      'The pale, well-mannered regulars are vampires, implied only. Rosa is an original Mission regular. ' +
      'The Mission lantern is the light E3 Armageddon asks the Nubbins to keep lit; keep its art consistent. ' +
      'Verify Hunter’s Moon’s costume and backstory against vol. 9.',
  },

  // ---------------------------------------------------------------------- MK8
  {
    id: 'mv-mk08',
    code: 'MK8',
    title: 'Age of Khonshu',
    source: 'Avengers vol. 8 #32–38 (2020): Age of Khonshu',
    audience: 'adult',
    trigger: { where: MK_WHERE, when: 'After The Midnight Mission.' },
    requires: ['MK7'],
    speakers: [NUBBIN, MARC, STEVEN, JAKE, KHONSHU],
    steps: [
      {
        id: 'mv-mk08-orders',
        goal: 'Follow Marc on Khonshu’s raids across the city.',
        hint: 'Three Expedition legs, one for each stolen power. A Fly Nubbin keeps watch from above.',
        check: 'expedition:clear:mv-khonshu-raids:3',
        scene: {
          id: 'mv-mk08-orders',
          lines: [
            l('narrator', 'The night sky over New York is wrong. The moon is too large, and it has an eye.'),
            l('khonshu', 'My fist. The Earth’s champions hoard power they have not earned. Fire from the stars. A sorcerer’s eye.'),
            l('khonshu', 'Bring them to me. With them I take the sky, and from the sky I guard every night, forever.'),
            l('khonshu', 'No darkness unwatched. No harm unpunished.'),
            l('marc', 'Every night, watched. It sounds good when you say it fast.', 'think'),
            l('steven', 'Say it slowly, Marc. “Forever.” “Unpunished.” Punished by whom?'),
            l('jake', 'He pulled us out of the sand. I get it. But he’s never once asked us what we want.'),
            l('marc', 'Keeper. I owe him my life. I don’t know if I owe him everyone else’s.', 'sad'),
            l('khonshu', 'Hesitation is not prayer, Marc.', 'angry'),
          ],
          choices: [
            {
              id: 'watch',
              label: 'Go with him. Stay close and watch.',
              set: { 'mv-mk-akh': 'watched' },
              then: [l('marc', 'Stay close. If I go too far, you tell me. Loudly.')],
            },
            {
              id: 'warn',
              label: 'Send a Fly Nubbin to warn the Avengers.',
              set: { 'mv-mk-akh': 'warned' },
              then: [
                l('narrator', 'Your Fly Nubbin slips off between the towers. Whether the warning lands in time, you can’t tell.'),
                l('khonshu', 'The small ones fly ahead of you, my fist. Even they do not trust you.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk08-orders-done',
          lines: [
            l('narrator', 'Fire. An eye. A burning fist. One by one they are carried up into the moon, and the heroes fall still as stone.'),
            l('steven', 'I took the eye. I remember the sorcerer’s face. He looked so disappointed in me.', 'sad'),
            l('jake', 'No. I took the eye. You took the fire. I was there.'),
            l('marc', 'I don’t remember taking any of them. So which of us did?', 'shock'),
            l('khonshu', 'Does it matter which of you, my fist? Every one of you is mine.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-mk08-sky',
        goal: 'Get into Khonshu’s palace and free the stolen powers.',
        hint: 'A karate bout against Khonshu’s guardians, three rounds. A Fly Nubbin strikes from above.',
        check: 'karate:win:mv-khonshu-guardians',
        scene: {
          id: 'mv-mk08-sky',
          lines: [
            l('narrator', 'Above the clouds, Khonshu’s palace hangs over the city like a second moon.'),
            l('khonshu', 'One task remains, my son. The last of them who could still stand against me. End her.'),
            l('marc', 'You said no harm unpunished. She hasn’t harmed anyone.', 'angry'),
            l('khonshu', 'She might. That is enough.'),
            l('steven', 'There it is.'),
            l('jake', 'That’s the part he didn’t say fast.'),
            l('narrator', 'Marc looks down at the city: a narrow storefront under a bridge, its doorway dark tonight.'),
            l('marc', 'You picked me up off the sand. I won’t forget it. But I won’t end the world to say thank you.', 'sad'),
            l('khonshu', 'Without me you are a mercenary with a fractured mind.', 'angry'),
            l('marc', 'Without you I’m three men and a night job. That’s plenty.'),
            l('narrator', 'Behind the throne, the stolen powers beat against their cages. Khonshu is looking at Marc, not at them.'),
          ],
          choices: [
            {
              id: 'cages',
              label: 'Go for the cages while the god is busy.',
              set: { 'mv-mk-sky': 'cages' },
              then: [
                l('narrator', 'You slip round the throne with your Nubbins. They are very small, and gods never look down.'),
              ],
            },
            {
              id: 'stand',
              label: 'Stand beside Marc and face Khonshu.',
              set: { 'mv-mk-sky': 'stood' },
              then: [
                l('khonshu', 'The Keeper stands with you. How touching. How brief.'),
                l('narrator', 'Your Nubbins line up at your feet, none of them tall enough to matter. They stay anyway.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-mk08-sky-done',
          lines: [
            l('narrator', 'The palace doors give. Inside, the stolen powers turn in the dark like caged stars.'),
            l('narrator', 'Each one has a little brass tag, in Marc’s handwriting. He looks at the tags for a long time.'),
            l('marc', 'Let them out. All of them. Whoever put them in here.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-mk08-complete',
      lines: [
        l('narrator', 'The fire goes back to its keeper. The eye goes back to the sorcerer. The heroes wake out of stone, blinking.'),
        l('khonshu', 'Then go, my fist. Go and be small.', 'angry'),
        l('narrator', 'The palace floor opens under Marc. He falls through cloud and lands hard on the Mission roof, among the pigeons.'),
        l('narrator', 'You and your Nubbins come down after him in a heap. The pigeons are not pleased.'),
        l('narrator', 'Khonshu’s moon draws back. It does not leave. It watches.'),
        l('khonshu', 'You will come back to me, my fist. You always do.', 'think'),
        l('marc', 'Maybe. Not tonight.'),
        l('steven', 'Not tonight is a good start.', 'soft'),
        l('jake', 'Not tonight is all anyone gets.'),
        l('marc', 'Keeper. Those tags in the palace were in my handwriting. I don’t know when I wrote them. That scares me more than he does.', 'sad'),
        l('marc', 'He isn’t finished. When he comes for me, keep that light burning. Even if I tell you not to.'),
        l('narrator', 'Far off, past the edge of this world, something older than Khonshu is getting ready for war.'),
      ],
    },
    rewards: [
      {
        id: 'mv-mk08-title',
        kind: 'title',
        label: 'Light-Keeper',
        description: 'Title: you stood with Marc in the sky while he told a god no.',
      },
      {
        id: 'mv-mk08-line',
        kind: 'flag',
        label: 'Moon Knight line complete',
        description: 'All eight Moon Knight storylines are done. Counts toward Armageddon.',
      },
    ],
    sets: { 'mv-mk08': true, 'mv-mk-complete': true },
    notes:
      'Completes the Moon Knight line. Khonshu is pushed back, not beaten; Armageddon finishes it. ' +
      'Stolen powers are shown abstractly (a flame, an eye, a glowing fist) so no Avenger needs a portrait; verify which powers the source takes. ' +
      '“Her” in the palace scene is the last free Avenger, unnamed. The Mission doorway is dark because its lantern is with the Keeper (MK7). ' +
      'Unreliable memory is the point of the orders-done and sky-done beats: the three faces disagree about who took which power, and the tags are in Marc’s hand. ' +
      'Never resolve who did it; Khonshu working through Marc and Marc acting in a lost hour are both meant to stay possible. ' +
      'MK8 ends when Khonshu throws Marc out of the palace onto the Mission roof. The long walk down by the Mission lantern belongs to E3 only, so it never plays twice. ' +
      'The sky choice sets `mv-mk-sky` (cages | stood), cosmetic. The old `mv-mk-lantern` flag is retired.',
  },
];

// ========================================================================== SPAWN
export const MV_SPAWN: Quest[] = [
  // ---------------------------------------------------------------------- SP1
  {
    id: 'mv-sp01',
    code: 'SP1',
    title: 'Al Simmons',
    source: 'Spawn #1 (1992)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'The Spawn line opens in the Multiverse campaign.' },
    speakers: [
      NUBBIN,
      SPAWN,
      { id: 'al', name: 'Al Simmons', kind: 'other', basedOn: 'Al Simmons (Image Comics)' },
      { id: 'chapel', name: 'Chapel', kind: 'other', basedOn: 'Chapel (Image Comics)' },
      { id: 'malebolgia', name: 'Malebolgia', kind: 'other', basedOn: 'Malebolgia (Image Comics)' },
      { id: 'bobby', name: 'Bobby', kind: 'other' },
    ],
    steps: [
      {
        id: 'mv-sp01-alley',
        goal: 'Help the stranger in the alley find out who he was.',
        hint: 'Search the city on the Expedition map. The alley folk talk to Nubbins, not to him.',
        check: 'expedition:clear:mv-rat-city',
        scene: {
          id: 'mv-sp01-alley',
          lines: [
            l('narrator', 'The rift lets you out in an alley that smells of rain and rot. Something under the rubbish bags is breathing.'),
            l('narrator', 'It sits up. A man, or the shape of one: a black suit that moves on its own, a red cloak, chains, green eyes.'),
            l('spawn', 'Get back. Get— what did they do to me?', 'shock'),
            l('narrator', 'Your other Nubbin hides behind your legs. This one doesn’t. It crosses the wet ground and climbs into his lap.'),
            l('spawn', '…You’re not scared. Everything else ran. Even the rats ran.', 'soft'),
            l('narrator', 'It touches his mask, and the alley goes red.'),
            l('chapel', 'Orders from the top, Al. You were growing a conscience. Can’t have that.'),
            l('narrator', 'Fire. Falling. Then a voice so large it has no edges.'),
            l('malebolgia', 'You burn beautifully, soldier. Do you want to see her again? Your Wanda? Sign, and I send you home.'),
            l('al', 'Send me back. I don’t care what it costs. Just let me see her.', 'sad'),
            l('narrator', 'The red fades. A number glows in the corner of his eye, and ticks down by one.'),
            l('spawn', 'A name. Wanda. And the man who shot me. That’s all I’ve got.'),
          ],
        },
        done: {
          id: 'mv-sp01-alley-done',
          lines: [
            l('narrator', 'An old man by a burning barrel knows the face in the newspaper your Nubbin found.'),
            l('bobby', 'Simmons. Army hero. Dead five years. Big funeral. The widow married his best friend.'),
            l('spawn', 'Five years.', 'shock'),
            l('bobby', 'Nobody comes back from five years dead looking good, son. You look about right for it. Sit by the fire.'),
          ],
        },
      },
      {
        id: 'mv-sp01-wanda',
        goal: 'Find Spawn somewhere safe to rest.',
        hint: 'Back in the alley, give him a blanket from your Grove inventory.',
        check: 'give:mv-spawn:blanket',
        scene: {
          id: 'mv-sp01-wanda',
          lines: [
            l('narrator', 'A quiet street. A lit window. Inside: a woman with a warm laugh, a man in glasses, a little girl doing a jigsaw.'),
            l('spawn', 'Terry. My best man. My best friend.', 'sad'),
            l('spawn', 'Five years, and she’s… she’s happy. She’s got a kid. Look at her.'),
            l('narrator', 'He takes one step toward the gate. The suit ripples, like something hungry.'),
            l('spawn', 'That thing said I’d see her. It never said I’d be this. I can’t even show her my face. I haven’t got one.', 'angry'),
            l('narrator', 'The number in his eye drops again. Just from wanting.'),
            l('nubbin', 'Mm.', 'soft'),
            l('narrator', 'The little girl looks up at the window. She seems to look right at your Nubbin, and she smiles.'),
          ],
          choices: [
            {
              id: 'watch',
              label: 'Let him watch a while longer.',
              set: { 'mv-sp-wanda': 'watched' },
              then: [
                l('spawn', 'Just a minute. One more minute.'),
                l('narrator', 'It is an hour before he moves. You don’t hurry him.'),
              ],
            },
            {
              id: 'away',
              label: '“Come away. This will only hurt.”',
              set: { 'mv-sp-wanda': 'walked-away' },
              then: [l('spawn', 'Everything hurts. But okay.', 'sad')],
            },
            {
              id: 'doorstep',
              label: 'Let your Nubbin go and sit on the doorstep.',
              set: { 'mv-sp-wanda': 'doorstep' },
              then: [
                l('narrator', 'Your Nubbin trots up the path and sits on the mat. The girl opens the door, giggles, and gives it a biscuit.'),
                l('spawn', 'That’s Wanda’s laugh. Coming out of a kid I’ll never know.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp01-wanda-done',
          lines: [
            l('narrator', 'He settles under a tarp your Nubbin dragged over by itself, the blanket round his shoulders.'),
            l('spawn', 'Never thought I’d be grateful for a blanket again.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp01-complete',
      lines: [
        l('spawn', 'The folk out here call me the man in the cloak. Your little friend just calls me… whatever that noise is.'),
        l('nubbin', 'Prrp.'),
        l('spawn', 'Yeah. That.', 'soft'),
        l('spawn', 'Something put me here for a reason, Keeper. When I find out what, it’s going to regret it.', 'angry'),
        l('spawn', 'I signed a deal in Hell. I know what that makes me. So why does the little one keep treating me like I’m not finished?', 'think'),
        l('narrator', 'Your Nubbin falls asleep against his chain. Slowly, the chain stops moving.'),
        l('narrator', 'He works one cold link loose and leaves it beside your Nubbin. A thank-you, from someone out of practice.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp01-link',
        kind: 'item',
        label: 'Link of chain',
        description: 'A single cold link from Spawn’s chain. Your fearless Nubbin carries it everywhere.',
      },
      {
        id: 'mv-sp01-title',
        kind: 'title',
        label: 'Not Afraid',
        description: 'Title: your Nubbin was the only one who didn’t run.',
      },
    ],
    sets: { 'mv-sp01': true },
    notes:
      'Establishes the rule of the line: a Nubbin is the only creature not afraid of Spawn. Whichever Nubbin is in slot one is “the fearless one”; the other always hides. ' +
      'Spawn’s power counter is a HUD element shown in his portrait’s corner, starting at 9999 and ticking down when he uses or even reaches for power; it persists across SP1–SP8. ' +
      'The murder flashback is a red-tinted still sequence: Chapel’s silhouette, a flash, fire. No body. Malebolgia is a vast shape, never fully seen here. ' +
      'Wanda, Terry and Cyan are seen through a window only; they do not speak. Bobby is an original alley regular.',
  },

  // ---------------------------------------------------------------------- SP2
  {
    id: 'mv-sp02',
    code: 'SP2',
    title: 'The Clown',
    source: 'Spawn #2–4 (1992)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After Al Simmons.' },
    requires: ['SP1'],
    speakers: [
      NUBBIN,
      SPAWN,
      CLOWN,
      VIOLATOR,
      { id: 'twist', name: 'Tony Twist', kind: 'other', basedOn: 'Tony Twist (Image Comics)' },
    ],
    steps: [
      {
        id: 'mv-sp02-clown',
        goal: 'Track Tony Twist’s men through the docks.',
        hint: 'Expedition: the docks. A Swim Nubbin can scout the piers from the water.',
        check: 'expedition:clear:mv-twist-docks',
        scene: {
          id: 'mv-sp02-clown',
          lines: [
            l('narrator', 'Something short and paint-faced waddles down the alley, chewing on something that was once a pizza crust.'),
            l('clown', 'Well, well! The new guy! And he brought a pet dinner roll. Cute. Can I eat it?', 'happy'),
            l('spawn', 'Touch it and I’ll take you apart.', 'angry'),
            l('clown', 'Ooh, temper. Love it. They call me the Clown. Downstairs sent me. Think of me as your career adviser.'),
            l('clown', 'Big man in town, Tony Twist. Owns the docks, owns the cops, did nasty things to nice people.'),
            l('clown', 'You should go and kill him. Loads. With fire.', 'happy'),
            l('spawn', 'Why do you care?'),
            l('clown', 'I’m a people person! Also I keep the books.', 'happy'),
            l('narrator', 'He pulls out a greasy little notebook. The first page says 9,999. It has been crossed out, and written lower, several times.'),
            l('narrator', 'Your Nubbin, which fears nothing, takes one look at the Clown and growls. It has never growled before.'),
            l('spawn', 'It’s got better sense than me.', 'think'),
          ],
          choices: [
            {
              id: 'doubt',
              label: '“Don’t do what he wants.”',
              set: { 'mv-sp-clown': 'doubted' },
              then: [
                l('spawn', 'Twist still needs stopping. But I do it my way, not his.'),
                l('clown', 'Your way, my way. All roads go downstairs, pal.', 'happy'),
              ],
            },
            {
              id: 'go',
              label: '“Twist hurts people. Stop him.”',
              set: { 'mv-sp-clown': 'trusted' },
              then: [
                l('clown', 'See? The Keeper gets it!', 'happy'),
                l('narrator', 'Your Nubbin keeps growling all the same.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp02-clown-done',
          lines: [
            l('narrator', 'Your Swim Nubbin surfaces under a pier with a soggy shipping manifest. Twist’s warehouse, tonight.'),
            l('spawn', 'Tonight, then.'),
          ],
        },
      },
      {
        id: 'mv-sp02-war',
        goal: 'Help Spawn finish the fight without burning his power.',
        hint: 'Karate against the Violator. Spawn’s counter drops whenever he strikes, so let your Nubbins do the hitting.',
        check: 'karate:win:mv-violator:low-burn',
        scene: {
          id: 'mv-sp02-war',
          lines: [
            l('narrator', 'The warehouse burns. Twist’s men scatter. Spawn stands in the middle of it, green fire pouring off his hands.'),
            l('narrator', 'The number in his eye drops by hundreds a second.'),
            l('spawn', 'Twist! Get out here!', 'angry'),
            l('twist', 'You don’t scare me. I got men, I got guns, I got the mayor on speed dial.'),
            l('narrator', 'A burning beam comes down across the doorway. Twist is on the wrong side of it. His men are already gone.'),
            l('twist', 'Hey! HEY! Somebody! I’ll pay! I’ll pay anybody!', 'shock'),
            l('narrator', 'Up on the roof, the Clown is watching. He has his little notebook out, and he is licking the pencil.'),
            l('clown', 'Eight thousand nine hundred and… ooh, there goes another hundred! Spend it, baby! Save the gangster! Costs extra!', 'happy'),
            l('you', 'Spawn! The number. He wants you to run out.'),
            l('narrator', 'The Clown’s grin widens, and keeps widening. Something huge and horned unfolds out of the little body.'),
            l('violator', 'Clever Keeper. Doesn’t matter. Go in after the rat, or don’t. Either way, he’s ours eventually. So are you.', 'angry'),
          ],
          choices: [
            {
              id: 'pull',
              label: 'Pull Twist out of the fire. Whatever it costs.',
              set: { 'mv-sp-twist': 'saved' },
              then: [
                l('narrator', 'Spawn goes into the flames. The number drops five hundred in one breath. He comes out with Twist over his shoulder.'),
                l('spawn', 'Don’t thank me. Go and confess something. Take your time; there’s a lot.', 'angry'),
              ],
            },
            {
              id: 'leave',
              label: '“He lit it. Save your power for the demon.”',
              set: { 'mv-sp-twist': 'left' },
              then: [
                l('narrator', 'Spawn turns his back on the doorway. Behind him, the shouting stops. The number holds.'),
                l('spawn', 'That was the right sum. Why doesn’t it feel like one?', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp02-war-done',
          lines: [
            l('narrator', 'The Violator folds back down into the Clown, wheezing, and waddles off into the smoke.'),
            l('narrator', 'He drops the notebook as he goes. Your Nubbin picks it up and will not give it back.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp02-complete',
      lines: [
        l('spawn', 'He wasn’t steering me at Twist. He was steering me at the number.', 'think'),
        l('spawn', 'Every time I lose my temper, Hell gets a little closer to having me back.'),
        l('narrator', 'You flick through the Clown’s notebook. Page after page of numbers, each one lower. The last page says 0, with a smiley face.'),
        l('narrator', 'Your Nubbin finally stops growling. It sits on his boot and looks up at him.'),
        l('spawn', 'You knew straight off. Next time I’ll listen to you sooner.', 'soft'),
        l('narrator', 'He tears a strip from the red cloak. It wriggles, then settles, and curls round your Nubbin like a scarf.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp02-scarf',
        kind: 'cosmetic',
        label: 'Living red scarf',
        description: 'A strip of Spawn’s cloak. It shifts slightly in a breeze that isn’t there, and keeps a Nubbin warm.',
      },
      {
        id: 'mv-sp02-title',
        kind: 'title',
        label: 'Saw Through the Clown',
        description: 'Title: your Nubbin knew the Clown was a demon before anyone else did.',
      },
    ],
    sets: { 'mv-sp02': true },
    notes:
      'The Clown is crude and foul (grubby, belching), but keep it to one gag per scene; no toilet humour on screen. ' +
      'The Violator reveal is the line’s first big horror beat: a slow unfold, silhouette against fire. ' +
      'mv-sp-twist: saved costs 500 off Spawn’s counter before the bout (it still has to be a low-burn win from there); left means Twist dies offscreen in the fire. ' +
      'Both are defensible and neither is scored: mercy for a murderer at the price of Al’s soul, or thrift with it. E3 may raise Twist among the dead if left. ' +
      'The Clown’s notebook (counter running gag) pays off in E3 when the counter finally reaches zero by Al’s own choice. ' +
      'The karate check scores Spawn’s counter loss; a low-burn win is required. ' +
      'Tony Twist’s issue numbers should be checked; the brief places him in #2–4.',
  },

  // ---------------------------------------------------------------------- SP3
  {
    id: 'mv-sp03',
    code: 'SP3',
    title: 'Overt-Kill',
    source: 'Spawn #5–7 (1992–93)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After The Clown.' },
    requires: ['SP2'],
    speakers: [
      NUBBIN,
      SPAWN,
      { id: 'overtkill', name: 'Overt-Kill', kind: 'other', basedOn: 'Overt-Kill (Image Comics)' },
      { id: 'bobby', name: 'Bobby', kind: 'other' },
    ],
    steps: [
      {
        id: 'mv-sp03-hunted',
        goal: 'Get the alley folk clear while Spawn fights.',
        hint: 'Lead three groups of sleepers out the back of the alley. Your fearless Nubbin can go anywhere; the other must stay near you.',
        check: 'escort:mv-alley-folk:3',
        scene: {
          id: 'mv-sp03-hunted',
          lines: [
            l('narrator', 'The rumours come down the alley before he does. The mob has bought itself a machine.'),
            l('narrator', 'Footsteps that crack the paving. A huge man, more steel than skin, with gun barrels where his hands should be.'),
            l('overtkill', 'Twist’s friends send their regards. They paid for the big gun. That’s me.'),
            l('overtkill', 'Five million for your head, Hellspawn. Nobody said it had to stay in one piece.'),
            l('spawn', 'People sleep here. Take it somewhere else.'),
            l('overtkill', 'People? This lot?'),
            l('narrator', 'He fires into the cardboard shelters. Somebody screams.'),
            l('narrator', 'Spawn’s suit stops being a suit. It becomes chain and cloak and teeth, all moving at once.'),
            l('spawn', 'You shouldn’t have done that.', 'angry'),
            l('narrator', 'Your Nubbin isn’t afraid of Spawn. But for the first time, it looks at you, as if asking whether it should be.', 'sad'),
          ],
        },
        done: {
          id: 'mv-sp03-hunted-done',
          lines: [
            l('narrator', 'Everyone’s out. Bruised, soaked, but out. Behind you the alley sounds like a foundry.'),
            l('bobby', 'Kid. Whatever’s happening back there, he’s doing it for us. Remember that.', 'soft'),
          ],
        },
      },
      {
        id: 'mv-sp03-rage',
        goal: 'Help Spawn bring the suit back under his control.',
        hint: 'Sit with Spawn in the alley and pet him, as you would a Shadow Nubbin, until his trust passes 30.',
        check: 'trust:mv-spawn:>30',
        scene: {
          id: 'mv-sp03-rage',
          lines: [
            l('narrator', 'When you get back, the alley is a battlefield. Overt-Kill is down, sparks pouring from his chest.'),
            l('narrator', 'The chains have him. The cloak is closing over him. The suit wants more, and Spawn is letting it.'),
            l('overtkill', 'Okay! Contract’s off! It’s off!', 'shock'),
            l('spawn', 'It feels good, Keeper. That’s the worst part. It feels so good.', 'angry'),
            l('narrator', 'The number in his eye is racing down. He isn’t looking at it.'),
            l('narrator', 'Your Nubbin walks into the middle of the chains. They part around it like water round a stone.'),
            l('nubbin', 'Prrp.', 'soft'),
            l('narrator', 'Spawn looks down at it. The cloak hesitates.'),
          ],
          choices: [
            {
              id: 'call',
              label: '“Al. Come back.”',
              set: { 'mv-sp-anger': 'called-back' },
              then: [
                l('narrator', 'At his own name the chains go slack. Overt-Kill drags himself off into the dark, leaking oil.'),
                l('spawn', '…Al. Nobody’s called me that in five years.', 'soft'),
              ],
            },
            {
              id: 'silence',
              label: 'Say nothing. Let it end.',
              set: { 'mv-sp-anger': 'let-go' },
              then: [
                l('narrator', 'The cloak closes. When it opens again there is only scrap metal on the ground.'),
                l('spawn', 'Don’t look at me like that.', 'sad'),
                l('narrator', 'Your Nubbin looks at him the way it always does. Somehow that’s worse.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp03-rage-done',
          lines: [
            l('narrator', 'It takes a long time. The chains quiet one link at a time. The cloak becomes a cloak again.'),
            l('spawn', 'The suit’s alive, isn’t it. And it’s hungry. And it likes me angry.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp03-complete',
      lines: [
        l('spawn', 'First time I let it all out. Now I know what’s in there.', 'think'),
        l('spawn', 'Every time I get angry, I spend. And I give the suit a little more of me.'),
        l('narrator', 'He looks at your Nubbin, still sitting where the chains were thickest.'),
        l('spawn', 'Stay close, will you? It behaves better when you’re around.', 'soft'),
        l('spawn', 'Question, Keeper. If I do something good with Hell’s own power, does it count? Or does Hell get the credit?', 'think'),
        l('bobby', 'Counts to us, son. We were the ones under the cardboard.'),
        l('narrator', 'Bobby and the alley folk drag a barrel back into place and light it. They save Spawn a spot by the fire.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp03-barrel',
        kind: 'decor',
        label: 'Alley barrel fire',
        description: 'A dented oil drum with a fire in it, for the Grove. Nubbins huddle round it on cold nights.',
      },
      {
        id: 'mv-sp03-title',
        kind: 'title',
        label: 'Calm in the Storm',
        description: 'Title: your Nubbin walked into the chains and they let it through.',
      },
    ],
    sets: { 'mv-sp03': true },
    notes:
      'The first full-power fight. Show the suit’s transformation as shape and motion (chains, cloak, glowing eyes), not wounds. ' +
      'Overt-Kill’s defeat is mechanical damage only: sparks, oil, scrap. Whether he survives depends on `mv-sp-anger`. ' +
      'The trust step reuses the Shadow Nubbin trust meter on a Spawn NPC; it rises with sitting and petting and drops if the player leaves. ' +
      'Big counter drop (2000+) during the rage scene.',
  },

  // ---------------------------------------------------------------------- SP4
  {
    id: 'mv-sp04',
    code: 'SP4',
    title: 'Angela',
    source: 'Spawn #9 (1993)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After Overt-Kill.' },
    requires: ['SP3'],
    speakers: [NUBBIN, SPAWN, COG, ANGELA],
    steps: [
      {
        id: 'mv-sp04-cog',
        goal: 'Learn from Cogliostro how to hold Spawn’s power back.',
        hint: 'A training bout: win three rounds while Spawn’s counter stays exactly where it is.',
        check: 'karate:win:mv-cog-training:no-burn',
        scene: {
          id: 'mv-sp04-cog',
          lines: [
            l('narrator', 'A cemetery at midnight. An old man with a long white beard sits on a gravestone, peeling an orange.'),
            l('cog', 'The Keeper. And the brave one. Sit, little thing. You’ve earned it.', 'soft'),
            l('spawn', 'You’ve been following me for weeks, old man. Talk.'),
            l('cog', 'You’re not the first, Simmons. Hell makes soldiers. Thousands of them, over thousands of years. Hellspawn.'),
            l('cog', 'Each one trades their soul for someone they loved. Each one burns their power on revenge, and goes back down an officer.'),
            l('spawn', 'Officer of what?'),
            l('cog', 'Hell’s army. For the last war: Heaven against Hell, with this world for a battlefield.', 'think'),
            l('spawn', 'And you? What are you?'),
            l('cog', 'A Hellspawn who never went back. Old. Careful. Very good at saving.'),
            l('spawn', 'So that’s it. I’m damned. Signed and sealed.'),
            l('cog', 'Damned is a direction, Simmons, not an address. You can walk the other way. Slowly. Uphill. Mostly in the dark.', 'think'),
            l('narrator', 'Your Nubbin takes a segment of orange from him. He smiles at it as if they’re old friends.'),
            l('cog', 'Spend nothing you don’t have to. Every drop you keep is a drop Hell can’t spend.'),
          ],
        },
        done: {
          id: 'mv-sp04-cog-done',
          lines: [
            l('narrator', 'Three rounds. The number in Spawn’s eye doesn’t move once.'),
            l('cog', 'Good. Now you know you can. That’s half of it.'),
          ],
        },
      },
      {
        id: 'mv-sp04-angela',
        goal: 'Drive Angela off without Spawn burning his power.',
        hint: 'Karate against Angela. She is fast; a Run Nubbin dodges while a Fly Nubbin strikes from above.',
        check: 'karate:win:mv-angela',
        scene: {
          id: 'mv-sp04-angela',
          lines: [
            l('narrator', 'Light splits the sky over the cemetery. Someone comes down out of it: armoured, red-haired, laughing, with a spear.'),
            l('angela', 'There you are. A fresh one. I’ve hunted your kind for centuries and I do love a new face. Oh. You haven’t got one.', 'happy'),
            l('angela', 'I’m Angela. Heaven pays by the head. Hold still.'),
            l('spawn', 'Heaven? I thought you lot were the good guys.', 'shock'),
            l('angela', 'Good is a department, darling. I work in collections.'),
            l('cog', 'She takes trophies, Simmons. The ones she’s finished with don’t stay dead. They just stay broken.'),
            l('narrator', 'The spear comes down. Your Nubbin is already standing between them.'),
            l('angela', '…Is that a Nubbin? Out of its own world?', 'think'),
            l('angela', 'Move, little one. You’re not on my list.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Keep the Nubbin where it is.',
              set: { 'mv-sp-angela': 'stood' },
              then: [
                l('narrator', 'The spear stops a hand’s width from your Nubbin’s nose. Your Nubbin doesn’t blink.'),
                l('angela', 'Brave. Or stupid. Where I come from those are filed together.', 'think'),
              ],
            },
            {
              id: 'save',
              label: '“Spawn, don’t spend it. Let us fight.”',
              set: { 'mv-sp-angela': 'saved-power' },
              then: [
                l('spawn', '…Okay. Your way.'),
                l('cog', 'Good. He listens to someone at last.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp04-angela-done',
          lines: [
            l('narrator', 'Angela pulls back into the air, bleeding light. She looks more curious than angry.'),
            l('angela', 'You’re more interesting than the others, Simmons. That’s never good for anyone.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp04-complete',
      lines: [
        l('cog', 'Heaven’s hunter, Hell’s soldier, and between them a cemetery and a small round thing. A fine start.'),
        l('spawn', 'Start of what?'),
        l('cog', 'Of deciding whose side you’re on. Here’s a secret: it doesn’t have to be either.', 'think'),
        l('narrator', 'Angela’s spear left a gold splinter in a headstone. Your Nubbin works it loose and won’t give it up.'),
        l('narrator', 'Far off, in another world, a man in a white cloak looks up from a rooftop. He has heard there are hunters in the sky.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp04-splinter',
        kind: 'item',
        label: 'Gold spear splinter',
        description: 'A sliver of Angela’s spear. It hums faintly when anything from Heaven or Hell is near.',
      },
      {
        id: 'mv-sp04-title',
        kind: 'title',
        label: 'Between Heaven and Hell',
        description: 'Title: you stood between a Hellspawn and Heaven’s hunter.',
      },
    ],
    sets: { 'mv-sp04': true },
    notes:
      'Unlocks MK7 (The Midnight Mission): the last narration line is the hand-off, and should cut briefly to the Moon Knight rooftop. ' +
      'Angela is flippant and dangerous; her trophies are described, never shown. Cogliostro is warm and evasive; his true identity (Cain) is SP8’s reveal, so give him no lines that confirm it here. ' +
      'The training bout fails on any counter change.',
  },

  // ---------------------------------------------------------------------- SP5
  {
    id: 'mv-sp05',
    code: 'SP5',
    title: 'Wynn and Chapel',
    source: 'Spawn #10–20 (1993–94)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After Angela.' },
    requires: ['SP4'],
    speakers: [
      NUBBIN,
      SPAWN,
      { id: 'wynn', name: 'Jason Wynn', kind: 'other', basedOn: 'Jason Wynn (Image Comics)' },
      { id: 'chapel', name: 'Chapel', kind: 'other', basedOn: 'Chapel (Image Comics)' },
      { id: 'terry', name: 'Terry', kind: 'other', basedOn: 'Terry Fitzgerald (Image Comics)' },
    ],
    steps: [
      {
        id: 'mv-sp05-wynn',
        goal: 'Steal Jason Wynn’s files on the Simmons killing.',
        hint: 'Expedition: Wynn’s tower, stealth route. A Fly Nubbin through the vents avoids the guards.',
        check: 'expedition:clear:mv-wynn-tower:stealth',
        scene: {
          id: 'mv-sp05-wynn',
          lines: [
            l('narrator', 'A glass tower in Washington. Jason Wynn’s floor has no name on the lift buttons.'),
            l('spawn', 'Terry works here. Did you know that? My best friend does Wynn’s books.', 'sad'),
            l('spawn', 'Wynn gave the order. Chapel pulled the trigger. Tonight I find out why.'),
            l('narrator', 'Your Fly Nubbin finds an air vent. Your other Nubbin finds the biscuit tin on the secretary’s desk.'),
            l('narrator', 'Through the vent you hear Wynn on the phone, calm as a weather forecast.'),
            l('wynn', 'Simmons is a closed file. Chapel handled it. If anyone asks, he died a hero. Heroes don’t testify.'),
            l('wynn', 'And watch Fitzgerald. He’s been reading things he shouldn’t.'),
            l('spawn', 'Terry. He’s going after Terry next.', 'shock'),
            l('narrator', 'The number flickers in the dark. Every second Spawn stays hidden in shadow costs him.'),
          ],
        },
        done: {
          id: 'mv-sp05-wynn-done',
          lines: [
            l('narrator', 'A grey folder, stamped and redacted, slides out of the vent in your Nubbin’s mouth.'),
            l('spawn', 'Every page has my name on it. And not one page has the truth.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-sp05-chapel',
        goal: 'Get the files to Terry before Wynn’s men do.',
        hint: 'Race the City course; a Run Nubbin carries the folder.',
        check: 'race:finish:mv-city',
        scene: {
          id: 'mv-sp05-chapel',
          lines: [
            l('narrator', 'A shooting range outside the city. A big man in white face paint is reloading, alone.'),
            l('chapel', 'Simmons? No. Simmons is in the ground. I put him there.', 'shock'),
            l('spawn', 'You put me somewhere a lot worse.'),
            l('chapel', 'Funny thing. I’ve got friends downstairs too. Wynn’s not the only one who makes deals.', 'think'),
            l('chapel', 'When I go, I go with a job waiting. Same as you.'),
            l('spawn', 'Then let’s get you started.', 'angry'),
            l('narrator', 'Green fire gathers in Spawn’s hand. The number drops, and keeps dropping, and he doesn’t care.'),
            l('you', 'Al. Look at the number.'),
            l('narrator', 'It’s low. Lower than you’ve ever seen it. One more blast and there won’t be enough left to walk home on.'),
            l('chapel', 'Go on. Spend it. Downstairs is counting on you.'),
          ],
          choices: [
            {
              id: 'hold',
              label: '“That’s what Hell wants. Don’t give it to them.”',
              set: { 'mv-sp-revenge': 'held' },
              then: [
                l('narrator', 'The fire gutters out. Chapel laughs. Spawn lets him.'),
                l('spawn', 'Laugh. You’ll be downstairs long before me.', 'sad'),
              ],
            },
            {
              id: 'files',
              label: '“The files will finish Wynn. Take them to Terry.”',
              set: { 'mv-sp-revenge': 'files' },
              then: [
                l('spawn', 'Terry. If he knows what Wynn did, he can do what I can’t. He can do it in the open.', 'think'),
                l('narrator', 'Spawn turns his back on Chapel. It costs him more than the fire would have.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp05-chapel-done',
          lines: [
            l('narrator', 'Your Run Nubbin skids up a front path and drops the folder on the mat. The door opens.'),
            l('terry', 'Where did you come from? And… who sent this?', 'shock'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp05-complete',
      lines: [
        l('narrator', 'Terry stands on the step reading, the folder shaking a little in his hands.'),
        l('narrator', 'Across the street, under a broken lamp, a shape in a red cloak watches and does not come closer.'),
        l('terry', 'Whoever you are out there. Thank you. Al deserved better.', 'sad'),
        l('spawn', 'He doesn’t even know he’s talking to me.', 'soft'),
        l('spawn', 'Revenge was going to cost everything I’ve got. This only cost a little. I can live with a little.'),
        l('spawn', 'Maybe that’s how you climb out of a hole. Not one big thing. A lot of small honest ones, done in the dark.', 'think'),
        l('narrator', 'Behind Terry, a little girl peers round the door at your Nubbin. It is the girl from the window. She waves. It waves back.'),
        l('narrator', 'Your Nubbin keeps a torn page from the folder, the one with Al’s old photograph on it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp05-photo',
        kind: 'item',
        label: 'Al’s photograph',
        description: 'A torn page from Wynn’s file with Al Simmons’ old service photo. Spawn asked you to keep it safe.',
      },
      {
        id: 'mv-sp05-title',
        kind: 'title',
        label: 'Unfinished Business',
        description: 'Title: you helped a dead man choose not to spend himself on revenge.',
      },
    ],
    sets: { 'mv-sp05': true },
    notes:
      'Wynn and Chapel both survive this storyline, as in the source; revenge is deliberately left incomplete. ' +
      'Show Spawn’s counter dangerously low in the Chapel scene (red, pulsing). ' +
      'Chapel’s “friends downstairs” foreshadows his own deal with Hell. Terry’s role as Wynn’s employee should be checked against #10–20.',
  },

  // ---------------------------------------------------------------------- SP6
  {
    id: 'mv-sp06',
    code: 'SP6',
    title: 'The Death of Malebolgia',
    source: 'Spawn #100 (2000)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After Wynn and Chapel, once the road into Mephisto’s realm is open (FF7).' },
    requires: ['SP5', 'FF7'],
    speakers: [
      NUBBIN,
      SPAWN,
      COG,
      ANGELA,
      { id: 'malebolgia', name: 'Malebolgia', kind: 'other', basedOn: 'Malebolgia (Image Comics)' },
    ],
    steps: [
      {
        id: 'mv-sp06-road',
        goal: 'Cross Mephisto’s border into Malebolgia’s pit.',
        hint: 'Expedition: the Hell road. The heat drains stamina; a Swim Nubbin handles it best.',
        check: 'expedition:clear:mv-hell-road',
        scene: {
          id: 'mv-sp06-road',
          lines: [
            l('narrator', 'The road Doom and Strange cut into Mephisto’s realm is still there: a scar of cold blue fire across the red.'),
            l('cog', 'Mephisto’s border. Past it, Malebolgia’s pit. Doom left the door open. Doom never shuts anything behind him.', 'think'),
            l('angela', 'I’m coming. Don’t argue. Heaven has wanted that worm dead since before your grandparents were born.'),
            l('spawn', 'Heaven wants him dead so it can win its war. I want him dead so it stops. Not the same.'),
            l('angela', 'Same spear, though.'),
            l('narrator', 'Your Nubbin walks to the edge of the road. Below, fire stretches farther than you can see. It isn’t afraid of that either.'),
            l('spawn', 'Keeper. This place eats things. If it goes bad, take the little ones and run. Don’t wait for me.'),
            l('cog', 'Watch the number, Simmons. Down here it ticks twice as fast.'),
            l('narrator', 'Far off, on a black throne, something vast and pale shifts its weight, and the whole of Hell shifts with it.'),
          ],
          choices: [
            {
              id: 'together',
              label: '“We go together, or not at all.”',
              set: { 'mv-sp-hell': 'together' },
              then: [l('spawn', 'Stubborn. Both of you. Fine.', 'soft')],
            },
            {
              id: 'promise',
              label: '“If it goes bad, I’ll run. I promise.”',
              set: { 'mv-sp-hell': 'promised' },
              then: [
                l('spawn', 'Good. Somebody should get out of this in one piece.'),
                l('narrator', 'Your Nubbin, who heard none of the promise, has already started down the road.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp06-road-done',
          lines: [
            l('narrator', 'The blue road ends at a cliff of black glass. Below it, the pit. In the pit, the throne.'),
            l('angela', 'There he is. Ugly as ever.'),
          ],
        },
      },
      {
        id: 'mv-sp06-pit',
        goal: 'Fight Malebolgia beside Spawn and Angela.',
        hint: 'A long karate bout in three phases. Spawn’s counter is allowed to fall here; what matters is not losing a Nubbin’s stamina to zero.',
        check: 'karate:win:mv-malebolgia',
        scene: {
          id: 'mv-sp06-pit',
          lines: [
            l('malebolgia', 'My soldier comes home. And he brings gifts: Heaven’s hunter, and a little warm thing. How thoughtful.', 'happy'),
            l('spawn', 'I’m not your soldier.', 'angry'),
            l('malebolgia', 'You are made of me, Simmons. Every thread of that suit is mine. Every hour since the fire, I paid for.'),
            l('malebolgia', 'Sit at my feet, and I will let the hunter go back to her clouds.'),
            l('malebolgia', 'And I will tear up your contract. Your soul, given back clean. When you die properly, you go wherever she goes.'),
            l('spawn', '…Wanda.', 'sad'),
            l('angela', 'He’s lying, Simmons. And don’t you dare bargain for me.', 'angry'),
            l('narrator', 'Your Nubbin looks up at the thing on the throne. It is the size of a cathedral. Your Nubbin is the size of a loaf.'),
            l('narrator', 'It sits down, squarely, in front of Spawn’s boots.'),
            l('malebolgia', 'What is that?', 'think'),
            l('spawn', 'That’s the only thing in two worlds that isn’t scared of me. And it isn’t scared of you either.'),
            l('spawn', 'A clean soul you hand me isn’t clean. Keep it. I’ll earn mine or go without.', 'angry'),
          ],
        },
        done: {
          id: 'mv-sp06-pit-done',
          lines: [
            l('narrator', 'Angela’s spear goes deep. Malebolgia closes his hand around her. Spawn goes up the arm, and the number runs toward zero.'),
            l('narrator', 'Malebolgia falls. Slowly, then all at once. The pit goes quiet for the first time in a thousand years.'),
            l('narrator', 'Angela lies on the black stone. Your Nubbin presses against her side, keeping her warm.'),
            l('angela', 'Heaven’s finest, and the last thing I see is a Nubbin. Tell my lot… no. Tell them nothing.', 'soft'),
            l('narrator', 'Her light goes out.'),
          ],
        },
      },
      {
        id: 'mv-sp06-crown',
        goal: 'Leave the pit with Spawn.',
        hint: 'Retrace the Hell road on the Expedition map; it is shorter on the way out.',
        check: 'expedition:clear:mv-hell-road:return',
        scene: {
          id: 'mv-sp06-crown',
          lines: [
            l('narrator', 'The demons of the pit come out of the walls. Thousands of them. They kneel.'),
            l('narrator', 'Behind Malebolgia’s body stands his throne: empty, enormous, and still warm.'),
            l('cog', 'They’re waiting, Simmons. You killed the king. By Hell’s law, that makes you the king.', 'think'),
            l('spawn', 'Hell’s law.'),
            l('cog', 'With that seat you’d command the army. You could march it anywhere. Even up.'),
            l('spawn', 'Wanda’s alive up there. Angela’s dead down here. And they want me in his chair.', 'sad'),
            l('narrator', 'Your Nubbin climbs onto the arm of the throne, looks around, and climbs back down, unimpressed.'),
            l('spawn', 'Yeah. Me too.'),
          ],
          choices: [
            {
              id: 'walk',
              label: '“You don’t owe them anything. Walk away.”',
              set: { 'mv-sp-throne': 'refused' },
              then: [
                l('spawn', 'I’m walking.'),
                l('narrator', 'The kneeling demons watch him go. Not one of them dares follow.'),
              ],
            },
            {
              id: 'carry',
              label: '“Take Angela home first.”',
              set: { 'mv-sp-throne': 'refused', 'mv-sp-angela-carried': true },
              then: [
                l('narrator', 'Spawn lifts her. She weighs almost nothing now.'),
                l('narrator', 'He carries her the whole way back up the road and never once looks at the throne.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp06-crown-done',
          lines: [
            l('narrator', 'The blue road burns behind you as you climb. At the top, ordinary night air.'),
            l('cog', 'Hell has no king tonight.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp06-complete',
      lines: [
        l('narrator', 'You come out under an ordinary sky. It has never looked so good.'),
        l('cog', 'You turned down Hell. Most men would have sat in the chair “just for a minute”.'),
        l('spawn', 'I’m not most men. I’m barely a man.'),
        l('spawn', 'She came down there for me, Keeper. Heaven’s hunter. She didn’t have to.', 'sad'),
        l('narrator', 'Your Nubbin lays a single flower at the mouth of the road, where the blue fire still burns.'),
        l('narrator', 'Hell has no king. Somewhere above Hell, someone finds that very convenient.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp06-spear',
        kind: 'decor',
        label: 'Angela’s spear',
        description: 'Planted point-down by the waterfall as a memorial. It glows faintly gold at dusk.',
      },
      {
        id: 'mv-sp06-title',
        kind: 'title',
        label: 'Refused the Crown',
        description: 'Title: you walked out of Hell beside the man who wouldn’t rule it.',
      },
    ],
    sets: { 'mv-sp06': true, 'mv-sp-malebolgia': 'dead' },
    notes:
      'Needs FF7: the entry road is the one Doom and Strange opened in Triumph and Torment; reuse its blue-fire art. ' +
      'Angela dies here, as in #100 (verify). Her death is quiet and dignified, a fade of her light, nothing graphic. ' +
      'Malebolgia’s death is shown as a fall, not a wound. The throne scene is the line’s turning point; hold on the empty throne before the choice. ' +
      'Spawn’s counter should end this storyline very low; SP7 opens with it barely recovered.',
  },

  // ---------------------------------------------------------------------- SP7
  {
    id: 'mv-sp07',
    code: 'SP7',
    title: 'The Redeemer',
    source: 'Spawn #16–18 (1994), the first Redeemer, and the later Redeemers',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After The Death of Malebolgia.' },
    requires: ['SP6'],
    speakers: [
      NUBBIN,
      SPAWN,
      { id: 'redeemer', name: 'The Redeemer', kind: 'other', basedOn: 'The Redeemer (Spawn)' },
    ],
    steps: [
      {
        id: 'mv-sp07-light',
        goal: 'Survive the Redeemer’s first attack.',
        hint: 'Karate: the Redeemer’s light blinds. Strike in the gaps between flashes.',
        check: 'karate:win:mv-redeemer',
        scene: {
          id: 'mv-sp07-light',
          lines: [
            l('narrator', 'At three in the morning the sky over the alley goes white. The alley folk cover their eyes.'),
            l('narrator', 'A figure lands: white and gold armour, wings of light, a face hidden behind a shining helm.'),
            l('redeemer', 'Al Simmons. I am the Redeemer. Not the first one. Heaven sends me to end you, and the thing you wear.'),
            l('spawn', 'Heaven. Again. You lot need a hobby.'),
            l('redeemer', 'Your soul belongs to the Pit. Better it burns clean than marches in Hell’s army.'),
            l('spawn', 'I quit Hell’s army. I left it without a king. Didn’t anyone tell you?'),
            l('redeemer', 'Hell without a king is Hell waiting for a new one.', 'think'),
            l('narrator', 'Your Nubbin, who has never once been afraid of Spawn, looks up at the Redeemer and backs away.', 'shock'),
            l('spawn', 'Huh. The little one’s never scared. What did they do to you?', 'think'),
          ],
        },
        done: {
          id: 'mv-sp07-light-done',
          lines: [
            l('narrator', 'The Redeemer stumbles back into the air, one wing guttering. A drop of blood falls on the pavement. Plain red.'),
            l('spawn', 'Angels don’t bleed like that. People do.', 'think'),
          ],
        },
      },
      {
        id: 'mv-sp07-truth',
        goal: 'Get the Redeemer clear before Heaven sends someone else.',
        hint: 'An escort run across the City course before dawn. A Fly Nubbin watches the sky.',
        check: 'escort:mv-redeemer:before-dawn',
        scene: {
          id: 'mv-sp07-truth',
          lines: [
            l('narrator', 'You find him at dawn in a ruined church, helm off. Under it is an ordinary, tired man.'),
            l('redeemer', 'I was dying in a hospital bed. A voice said: serve, and you will live.', 'sad'),
            l('spawn', '…Same offer. Different address.', 'think'),
            l('redeemer', 'They told me Hellspawn were monsters. They didn’t say I’d be sent after a man who sleeps in an alley with a Nubbin.'),
            l('redeemer', 'The things they’ve had me do. Towns they let burn because the burning suited the war.', 'sad'),
            l('spawn', 'So Heaven makes soldiers too. Takes dying people and turns them into weapons.', 'angry'),
            l('narrator', 'Your Nubbin, which backed away from the armour, walks up to the man without it and sits beside him.'),
            l('redeemer', 'Is there a way back? For men like us. Men who said yes to the wrong voice.', 'sad'),
            l('spawn', 'Ask me in a hundred years. I’m still on the road. It’s long, and nobody hands out maps.'),
            l('redeemer', 'When I go back without your head, they’ll take it all away. The life. Everything.'),
          ],
          choices: [
            {
              id: 'desert',
              label: '“Then don’t go back.”',
              set: { 'mv-sp-redeemer': 'deserted' },
              then: [
                l('redeemer', 'Desert Heaven. I never knew that was a choice.', 'think'),
                l('spawn', 'There’s always a choice. They just don’t print it on the forms.'),
              ],
            },
            {
              id: 'witness',
              label: '“Go back. Tell them what you saw.”',
              set: { 'mv-sp-redeemer': 'witness' },
              then: [
                l('redeemer', 'They won’t listen.'),
                l('spawn', 'Then someone up there will remember you said it. That counts for something.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp07-truth-done',
          lines: [
            l('narrator', 'The sun comes up. No more lights in the sky. Not yet.'),
            l('redeemer', 'Thank you. Both of you. All three of you.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp07-complete',
      lines: [
        l('spawn', 'Hell made me a weapon and lied to me. Turns out Heaven runs the same shop with better lighting.', 'angry'),
        l('spawn', 'Neither of them gets me. I don’t care what they offer.'),
        l('narrator', 'Your Nubbin finds a piece of the Redeemer’s armour in the gutter: a curved plate of gold, dented, gone dull.'),
        l('spawn', 'Keep it. Reminder that the shiny ones lie too.'),
        l('spawn', 'They called him the Redeemer. Nobody gets redeemed by being bought twice. You walk out of it on your own feet, or not at all.', 'think'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp07-plate',
        kind: 'item',
        label: 'Dull gold plate',
        description: 'A dented piece of the Redeemer’s armour. The shine went out of it when he took the helm off.',
      },
      {
        id: 'mv-sp07-title',
        kind: 'title',
        label: 'Neither Side',
        description: 'Title: you learned that Heaven’s hands are not clean either.',
      },
    ],
    sets: { 'mv-sp07': true },
    notes:
      'The Nubbin backing away from the Redeemer is deliberate: the one thing it fears is Heaven’s weapon, not Hell’s. Play a short whimper sound. ' +
      'This is a later Redeemer, after Malebolgia’s death; the role first appears in Spawn #16–18, and “Not the first one” nods to that. ' +
      'He is unnamed here. Several men wear the role across the comics (one of them Jason Wynn); check before naming. ' +
      'Burning towns are reported, not shown.',
  },

  // ---------------------------------------------------------------------- SP8
  {
    id: 'mv-sp08',
    code: 'SP8',
    title: 'Mammon and Cain',
    source: 'Spawn #150–164 (2005–07)',
    audience: 'adult',
    trigger: { where: SP_WHERE, when: 'After The Redeemer.' },
    requires: ['SP7'],
    speakers: [
      NUBBIN,
      SPAWN,
      COG,
      { id: 'mammon', name: 'Mammon', kind: 'other', basedOn: 'Mammon (Image Comics)' },
    ],
    steps: [
      {
        id: 'mv-sp08-mammon',
        goal: 'Find Cogliostro.',
        hint: 'He isn’t at the cemetery. Search the Expedition map; your fearless Nubbin can follow his scent.',
        check: 'expedition:clear:mv-cog-search',
        scene: {
          id: 'mv-sp08-mammon',
          lines: [
            l('narrator', 'The alley is cold, colder than it should be. A thin man in a very good suit waits by the barrel fire.'),
            l('mammon', 'Mr Simmons. A pleasure. You know my work, though not my name. I am Mammon.'),
            l('mammon', 'Malebolgia was a manager. Middle management. I hired him, and I let you remove him once he stopped being useful.', 'happy'),
            l('spawn', 'You set me up to kill him.', 'angry'),
            l('mammon', 'I set everyone up. It’s my job. It is, if you think about it, the only job.', 'think'),
            l('mammon', 'The war is coming, Al. Heaven and Hell, here, on your dirty little Earth. I’d like you on the winning side. Mine.'),
            l('narrator', 'Your Nubbin isn’t afraid of Mammon. It simply won’t go near him, the way it won’t go near spoiled fruit.'),
            l('mammon', 'And do ask your old friend Cogliostro who he really is. He’s been lying to you longer than I have. Much longer.'),
            l('spawn', '…What does that mean?'),
            l('mammon', 'It means “ask him”. But business first. There’s a signing bonus.', 'happy'),
            l('mammon', 'A face. Your own. Wanda’s kitchen at eight, the radio on, and five years that never happened. Nobody remembers the funeral.'),
            l('spawn', '…You can do that?', 'shock'),
            l('mammon', 'I can do anything that can be bought. You would be astonished what can be bought.'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask Mammon what it costs.',
              set: { 'mv-sp-mammon': 'asked' },
              then: [
                l('mammon', 'Nothing you would miss. Only everybody else.', 'happy'),
                l('spawn', 'There it is. There’s always a “there it is”.', 'angry'),
                l('mammon', 'Think it over, Al. The kitchen will keep. Good evening.'),
              ],
            },
            {
              id: 'refuse',
              label: '“No. Al Simmons isn’t for sale twice.”',
              set: { 'mv-sp-mammon': 'refused' },
              then: [
                l('mammon', 'Twice is when the price goes up, Keeper. That cuts both ways. Good evening.', 'think'),
                l('spawn', 'You answered for me.', 'think'),
                l('spawn', 'Good. I was taking too long.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp08-mammon-done',
          lines: [
            l('narrator', 'Your Nubbin leads you out of the city by the smell of oranges, to a hill above an empty field.'),
            l('spawn', 'He’s waiting for us. He knew we’d come.'),
          ],
        },
      },
      {
        id: 'mv-sp08-cain',
        goal: 'Stand ready with Spawn for the war Mammon promised.',
        hint: 'Bring both your Nubbins to the alley and talk to Spawn. They will be needed in Armageddon.',
        check: 'talk:mv-spawn:ready',
        scene: {
          id: 'mv-sp08-cain',
          lines: [
            l('narrator', 'Dusk. The old man sits beside a field that has been ploughed and left empty.'),
            l('cog', 'Mammon found you. I’m sorry. I hoped to tell you myself. I’ve hoped that for a very long time.', 'sad'),
            l('spawn', 'Who are you?'),
            l('cog', 'My first name was Cain. I worked a field like this one. I had a brother who kept sheep.', 'sad'),
            l('cog', 'I killed him. The first death by a human hand. Everything since has been me trying to stop where that led.'),
            l('cog', 'Using you, Simmons. Using others before you. I am not so different from Mammon.', 'think'),
            l('spawn', 'You trained me. You told me to save my power. Was that for me, or for your plan?', 'angry'),
            l('cog', 'Both. It is always both, Al.', 'sad'),
            l('narrator', 'Your Nubbin looks at him for a long time. Then it gives him back a segment of orange, from the bag he once shared.'),
            l('cog', '…Thank you, little one.', 'soft'),
          ],
          choices: [
            {
              id: 'forgive',
              label: '“He saved you more often than he used you.”',
              set: { 'mv-sp-cain': 'forgiven' },
              then: [
                l('spawn', 'Maybe. I’ll think about it. That’s more than Mammon gets.'),
                l('cog', 'That is more than I hoped for.', 'soft'),
              ],
            },
            {
              id: 'refuse',
              label: '“You don’t owe him anything.”',
              set: { 'mv-sp-cain': 'unforgiven' },
              then: [
                l('spawn', 'No. I don’t.', 'angry'),
                l('cog', 'That’s fair. I’ll be here when you need me, all the same.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-sp08-cain-done',
          lines: [
            l('narrator', 'Back in the alley, both your Nubbins settle by the barrel fire. Spawn makes room for them.'),
            l('spawn', 'Whatever’s coming, we meet it here.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-sp08-complete',
      lines: [
        l('narrator', 'The alley before dawn. Spawn sits on an upturned crate, chains quiet, your Nubbin asleep against his boot.'),
        l('spawn', 'Heaven used me. Hell used me. The man I trusted most is the first killer in the book.', 'think'),
        l('spawn', 'And the only one who never wanted a thing from me is the size of a loaf of bread.'),
        l('spawn', 'Mammon offered me Wanda’s kitchen. I can still smell it. That’s the trouble with Hell. It knows your address.', 'sad'),
        l('nubbin', 'Prrp.'),
        l('spawn', 'When the war comes, I’m not picking a side, Keeper. I’m picking this alley. And you lot.', 'soft'),
        l('narrator', 'High above, the sky begins to split: light on one side, fire on the other.'),
      ],
    },
    rewards: [
      {
        id: 'mv-sp08-title',
        kind: 'title',
        label: 'A Hellspawn’s Friend',
        description: 'Title: you stayed beside Al Simmons from the alley to the edge of the last war.',
      },
      {
        id: 'mv-sp08-line',
        kind: 'flag',
        label: 'Spawn line complete',
        description: 'All eight Spawn storylines are done. Counts toward Armageddon.',
      },
    ],
    sets: { 'mv-sp08': true, 'mv-sp-complete': true },
    notes:
      'Completes the Spawn line. Mammon is polite, amused and never raises his voice; he is the line’s real villain and E3’s opening threat. ' +
      'Mammon’s offer (a face, Wanda, five erased years) is the line’s sharpest temptation; mv-sp-mammon (asked | refused) is cosmetic but E3’s Herald echoes it. ' +
      'The Cain reveal is quiet: an empty ploughed field, dusk, no flashback of the first murder. ' +
      'The final narration line leads directly into E3 Armageddon (the sky splitting). Verify issue range for the Mammon and Cain reveals.',
  },
];

export const CHECKS: string[] = [
  'expedition:clear:mv-russell-woods',
  'karate:win:mv-committee-men',
  'talk:mv-marlene',
  'expedition:clear:mv-khonshu-tomb',
  'assign:mv-three-lives',
  'karate:win:mv-bushman',
  'visit:mv-marc-recovery:5',
  'karate:win:mv-taskmaster:no-repeat',
  'race:finish:cliff',
  'escort:mv-girl:no-alone',
  'expedition:clear:mv-asylum-wards',
  'karate:win:mv-khonshu-avatar:3-rounds',
  'expedition:clear:mv-mission-night:4',
  'karate:win:mv-hunters-moon:guard-allies',
  'expedition:clear:mv-khonshu-raids:3',
  'karate:win:mv-khonshu-guardians',
  'expedition:clear:mv-rat-city',
  'give:mv-spawn:blanket',
  'expedition:clear:mv-twist-docks',
  'karate:win:mv-violator:low-burn',
  'karate:win:mv-cog-training:no-burn',
  'karate:win:mv-angela',
  'escort:mv-alley-folk:3',
  'trust:mv-spawn:>30',
  'expedition:clear:mv-wynn-tower:stealth',
  'race:finish:mv-city',
  'expedition:clear:mv-hell-road',
  'karate:win:mv-malebolgia',
  'expedition:clear:mv-hell-road:return',
  'karate:win:mv-redeemer',
  'escort:mv-redeemer:before-dawn',
  'expedition:clear:mv-cog-search',
  'talk:mv-spawn:ready',
];
