/**
 * Fun quests Q76–Q85: The Hound of the Grove (based on the Sherlock Holmes stories).
 *
 * Ten small valley cases: nobody dies, nobody is shot, and the worst crime is a stolen bead.
 * Holmes solves every case, Watson writes them up, and the Keeper is the one-person Irregulars:
 * fetching, carrying, holding the lantern and noticing small things. Nubbins and animals do not
 * speak. Audience 'all' throughout. All quests are optional, one time only, never reset, and
 * never touch a Grove flag. Each needs the one before it. They do not appear during Chapters 9–11.
 *
 * Lifted text (public domain; Arthur Conan Doyle, 1887–1917, as listed in the outline, checked
 * against Project Gutenberg): A Study in Scarlet (#244) Q76; A Scandal in Bohemia (#1661) Q76, Q83;
 * The Red-Headed League (#1661) Q77; The Blue Carbuncle (#1661) Q78; Silver Blaze (#834) Q79,
 * adapted; The Sign of Four (#2097) Q80; The Dancing Men (#108) Q81; The Musgrave Ritual (#834)
 * Q82; The Hound of the Baskervilles (#2852) Q84; His Last Bow (#2350) Q85.
 * Every quoted line is swapped in `childLines`.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const BY = say('byte');
const DU = say('dusty');
const SP = say('sparks');
const PX = say('pixel');
const FE = say('fern');

const AFTER = 'After the one before it, in the Free Grove or the campaign (never during Chapters 9–11)';

// ---------------------------------------------------------------- speakers

const HOLMES: Speaker = {
  id: 'holmes',
  name: 'Mr Hollis Holme',
  kind: 'keeper',
  basedOn: 'Sherlock Holmes (Arthur Conan Doyle)',
};
/** From Q77 on he answers to the name he gave himself at the end of Q76. */
const HOLMES_S: Speaker = { ...HOLMES, name: 'Holmes' };
const WATSON: Speaker = {
  id: 'watson',
  name: 'Dr Weston Warde',
  kind: 'keeper',
  basedOn: 'Dr John Watson (Arthur Conan Doyle)',
};
const LESTRADE: Speaker = {
  id: 'lestrade',
  name: 'Inspector Larch',
  kind: 'keeper',
  basedOn: 'Inspector Lestrade (Arthur Conan Doyle)',
};
const WILSON: Speaker = {
  id: 'old-wilson',
  name: 'Old Mr Willet',
  kind: 'keeper',
  basedOn: 'Jabez Wilson, the red-headed pawnbroker (The Red-Headed League)',
};
const JEM: Speaker = {
  id: 'jem-ryder',
  name: 'Jem Rudd',
  kind: 'keeper',
  basedOn: 'James Ryder, the hotel attendant (The Blue Carbuncle)',
};
const COUNTESS: Speaker = {
  id: 'lady-marrow',
  name: 'Lady Marrowby',
  kind: 'keeper',
  basedOn: 'The Countess of Morcar (The Blue Carbuncle)',
};
const SILAS: Speaker = {
  id: 'silas-brown',
  name: 'Silas Brindle',
  kind: 'keeper',
  basedOn: 'Silas Brown, the rival trainer (Silver Blaze)',
};
const HETTY: Speaker = {
  id: 'hetty',
  name: 'Hetty',
  kind: 'keeper',
  basedOn: 'The correspondents of the dancing figures (The Dancing Men)',
};
const SAM: Speaker = {
  id: 'q81-sam',
  name: 'Sam',
  kind: 'keeper',
  basedOn: 'The correspondents of the dancing figures (The Dancing Men)',
};
const KRAMM: Speaker = {
  id: 'count-kramm',
  name: 'The Masked Count',
  kind: 'keeper',
  basedOn: 'The King of Bohemia, as Count von Kramm (A Scandal in Bohemia)',
};
const STAPLETON: Speaker = {
  id: 'stapleton',
  name: 'Mr Stapling',
  kind: 'keeper',
  basedOn: 'Stapleton the naturalist (The Hound of the Baskervilles)',
};
const HO = say('holmes');
const WA = say('watson');
const LE = say('lestrade');
const WI = say('old-wilson');
const JE = say('jem-ryder');
const CT = say('lady-marrow');
const SB = say('silas-brown');
const HE = say('hetty');
const SA = say('q81-sam');
const KR = say('count-kramm');
const ST = say('stapleton');

// ---------------------------------------------------------------- variant scenes (Q84, Q85)

const sc = (id: string, lines: Line[]): Scene => ({ id, lines });

export const QUESTS_HOLMES_VARIANTS: Scene[] = [
  sc('q84-var-guide', [
    N('A thin figure with a crook and a flat cap waves from the first marker stick. It is Jem Rudd, and he has lost the hunted look.'),
    JE('Mind the sticks, and keep to the left of them. I put every one in myself.', 'happy'),
    JE('Mr Holme gave me a second chance, and the heath gave me sheep. Nobody has asked me for a goose since.'),
    N('He walks you across the bog in a long, steady curve. Your Nubbin steps exactly where he steps.'),
    WA('Splendid. Dry boots at last.', 'happy'),
  ]),
  sc('q84-var-nose', [
    N('There is no guide here. There is only grass that looks like grass, and grass that looks like grass and will swallow your boot.'),
    N('Your Nubbin lowers its nose, the way Toby taught it. Sheep, sheep, old tar, a hint of lantern oil. That way.'),
    N('It finds the safe path slowly, stopping to sniff at every bend. Behind you, Watson follows exactly in your footprints, except once.'),
    WA('Ah. That one was not a footprint. That was a puddle with ambitions.', 'shock'),
    N('He goes in to the knees, and comes out with a small, dignified squelch. Nobody mentions it, and everybody remembers it.'),
    N('Later, on a stone, Watson empties that boot. Nobody says anything until he has finished.'),
  ]),
  sc('q81-var-children', [
    HO('You said children. You were right, and I was nearly too clever to notice. Make a note, Watson.', 'soft'),
    WA('I have underlined it.', 'happy'),
  ]),
  sc('q85-var-jem', [
    N('Someone is already at the hives, tying down a lid with a bit of string and a great deal of care.'),
    JE('Morning. Mr Holme says the bees will not mind my past, so long as I do not wave my hat at them.', 'happy'),
    HO('He is the best beekeeper’s boy in the county. He is also the only one.', 'soft'),
    N('Jem carries the heaviest hive up the bank without being asked, and the bees settle on him like a coat.'),
  ]),
  sc('q85-var-lestrade', [
    N('Inspector Larch comes puffing up the bank with a paper of sugar for the bees. Nobody has told him about the bees.'),
    LE('Mr Holme, I have the paperwork for your, er, retirement, and… what is that humming?', 'shock'),
    N('Eleven seconds later the Inspector is running down the bank with his hat held over his ears, and the bees are in no hurry at all.'),
    HO('Do tell Larch the sugar was thoughtful. I shall tell him myself, when he can hear.', 'soft'),
  ]),
  sc('q85-var-loupe', [
    HO('You and I have disagreed a good deal this year. I count it among the best things about the year.', 'soft'),
    HO('So you may have this, which is to say my second pair of eyes. Do not tell Watson I have two.', 'happy'),
    N('He presses a small brass pocket lens into your hand. It is warm from his coat.'),
  ]),
  sc('q85-var-cap', [
    HO('You never once told me I was wrong. It was very restful, and very bad for me.', 'soft'),
    HO('So you may have the cap. A man who agrees with me deserves something to put on his head in a wind.', 'happy'),
    N('He sets the ear-flapped cap on your Nubbin. It comes down over both eyes, and your Nubbin does not mind.'),
  ]),
];

// ---------------------------------------------------------------- quests

export const QUESTS_HOLMES: Quest[] = [
  // ------------------------------------------------------------------ Q76
  {
    id: 'q76',
    code: 'Q76',
    title: 'You Have Been at the Tide Pools',
    source: 'A Study in Scarlet and A Scandal in Bohemia: the first meeting and the art of noticing',
    audience: 'all',
    trigger: {
      where: 'The shop door, on the first misty morning you pass it after Chapter 2',
      when: 'The first misty morning you pass the shop after Chapter 2, in the Free Grove or the campaign (never during Chapters 9–11)',
    },
    speakers: [HOLMES, WATSON],
    steps: [
      {
        id: 'q76-s1',
        goal: 'Take Dr Warde to the shop with the room to share.',
        hint: 'Walk with the stranger along the lane; he follows. The card in the shop window is the place.',
        check: 'escort:watson:shop',
        scene: {
          id: 'q76-intro',
          lines: [
            N('The mist has come in off the pond and settled in the lane like a cat. A man in a travel-worn coat is reading a card in the shop window.'),
            N('ROOM ABOVE THE SHOP TO SHARE. The card has a ring on it where somebody has put down a very hot mug.'),
            WA('Forgive me. I have just come back from the war with a limp and an allowance, and I am looking for cheap rooms.', 'sad'),
            WA('Dr Warde. Weston, to my friends, once I have some.'),
            Y('I know the owner of the shop. I can take you in.'),
            WA('That is the most useful sentence anyone has said to me this month.', 'happy'),
          ],
        },
        done: {
          id: 'q76-arrive',
          lines: [
            N('The shop smells of jam and rain. In the back, a thin man in his shirtsleeves is holding a jar of plum jam up to the lamp.'),
            N('He is dusting the lid with flour and looking at it through a glass. There are a great many lids on the table.'),
            HO('Fingerprints, you see. Somebody in this valley has been into the plum jam without paying, and I intend to find who.', 'think'),
            N('Byte is by the counter, holding a jar of plum jam. He puts it back, slowly, when Mr Holme looks up.'),
          ],
        },
      },
      {
        id: 'q76-s2',
        goal: 'Stay in the room above the shop while Mr Holme reads you.',
        hint: 'Climb the stairs behind him and wait. He will do the talking.',
        check: 'visit:room-above-shop:holmes',
        scene: {
          id: 'q76-reading',
          lines: [
            N('Byte follows you up the stairs, hands in his pockets, well away from the jam.'),
            HO('Ah. A new tenant. Mr Holme. I notice you have not taken off your hat for ten minutes, which means it is a good one.', 'happy'),
            HO('You have been in Afghanistan, I perceive.', 'think'),
            WA('How on earth did you know that?', 'shock'),
            HO('I never guess. It is a shocking habit. Your arm is held stiffly, your face is tanned only to the cuff, and you carry yourself like a doctor.', 'happy'),
            N('He turns his attention to you, which is a little like a lighthouse turning.'),
            HO('And you. Salt on both boots, and a damp hem. The tide pools, before nine, in the dark.', 'think'),
            HO('Fluff from a Nubbin on your left sleeve only. Ink on your thumb, from a letter you have read many times.'),
            HO('You see, but you do not observe. The stairs, for example. How many?', 'happy'),
            Y('I… do not know.'),
            HO('Seventeen. I have climbed them hundreds of times. You have climbed them once. I have the better view.', 'soft'),
          ],
          choices: [
            {
              id: 'how',
              label: 'Ask how he knew about the letter.',
              then: [
                HO('Folded and refolded along one crease. The ink on your thumb is where the corner lives. It is a loved letter.', 'soft'),
                N('You decide to say nothing about who it is from. He seems to know that too.'),
              ],
            },
            {
              id: 'byte-wait',
              label: 'Wait for Byte to say something.',
              then: [
                BY('It is a trick. He asked someone in the village. Nobody can know all that from a sleeve.', 'angry'),
                HO('Then you may ask the village, Mr Byte. They will tell you I have not yet spoken to a soul in the valley.', 'happy'),
                BY('…I hate that this is going to be a thing.', 'sad'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'q76-complete',
      lines: [
        N('By noon, Dr Warde’s bag is on a chair and Mr Holme’s violin is on the other. They have agreed on everything except what to call the room.'),
        HO('We shall call it 221B. The shop has no number, but the room should have a good one.', 'happy'),
        WA('Why 221B?', 'think'),
        HO('Because I like how it sounds, Watson. A name is a good thing to have already.', 'soft'),
        WA('It is Warde, actually. But I think I am about to be called Watson from now on.', 'happy'),
        HO('Then call me Holmes, with an s. It seems only fair.', 'happy'),
        WA('What does the s stand for?', 'think'),
        HO('Showing off.', 'soft'),
        N('Holmes presses a brass magnifying glass into your hand. It has a dent in the rim, from a fall in some other country.'),
        HO('You introduced us, so it is yours. Hold it to anything and you will see more of it, which is the whole of my method.', 'soft'),
        N('From now on, in Photo mode, you can zoom in on anything the Grove has to show.'),
      ],
    },
    rewards: [
      {
        id: 'q76-magnifying-glass',
        kind: 'feature',
        label: 'Magnifying Glass',
        description: 'In Photo mode, a magnifying glass that zooms in on anything. Unlimited.',
      },
    ],
    childLines: {
      'q76-reading#1': 'You have come a long way, I perceive.',
      'q76-reading#7': 'You look, but you do not look closely. The stairs, for example. How many?',
    },
    notes:
      'Misty morning in the lane, the first one after Chapter 2. Holmes is thin, long-jawed, always testing something (jam, then ' +
      'later clay, then bees). Watson walks with a stick and a limp. The shop gets a new upstairs window and a brass "221B" ' +
      'plaque. The magnifying glass is a Photo mode zoom tool, usable on any subject, unlimited. Approved quotes ' +
      '"You have been in Afghanistan, I perceive." and "You see, but you do not observe." each used once; both swapped in ' +
      'childLines. The tide-pool reading is already the Learning Grove line and is not swapped. Byte is the valley sceptic and ' +
      'recurs through the pack: he keeps trying to catch Holmes guessing and never does.',
  },

  // ------------------------------------------------------------------ Q77
  {
    id: 'q77',
    code: 'Q77',
    title: 'The Red-Crested League',
    source: 'The Red-Headed League: the copying job and the cellar',
    audience: 'all',
    trigger: { where: 'The seed shop, from the morning after Q76', when: AFTER },
    requires: ['Q76'],
    speakers: [HOLMES_S, WATSON, LESTRADE, WILSON],
    steps: [
      {
        id: 'q77-s1',
        goal: 'Hear Mr Willet’s story and look at the League’s office door.',
        hint: 'Go to the lane behind the seed shop. The door with the notice is on the first floor.',
        check: 'visit:league-office:door',
        scene: {
          id: 'q77-intro',
          lines: [
            N('Old Mr Willet’s Nubbin has a crest of bright red feathers that sticks up like a flame. It is very proud of this, and a little embarrassed by it.'),
            WI('It paid four Shells a morning. All I had to do was sit in an office and copy out the Collection book, from Apples onward.', 'sad'),
            WI('Eight weeks. Then today I came and the door said THE LEAGUE IS DISSOLVED. I have lost my four Shells, and my good opinion of people.'),
            WA('That seems an odd sort of job.', 'think'),
            HO('Charming. It is the oddest I have seen all week, and I have only been here since Tuesday.', 'happy'),
            HO('Watson, the lane outside. If you please.', 'think'),
            N('Holmes taps the lane with his stick, three times, then listens, like a man tuning a piano with his foot.'),
          ],
        },
        done: {
          id: 'q77-door',
          lines: [
            N('The door has a card tacked up with one pin and a certain amount of hope. It is neat, and new, and not quite level.'),
            WI('My new assistant found me the job. A lovely lad. Hardly ever at his desk.'),
            HO('Look at the knees of Mr Willet’s eager new assistant, who got him the job. They are worn through, and stained with clay.', 'think'),
            HO('A man who spends his days at a desk does not wear his knees like that. A man who digs does.'),
          ],
        },
      },
      {
        id: 'q77-s2',
        goal: 'Wait in the dark cellar under the Keepers’ hall with Holmes and the Inspector.',
        hint: 'Go to the hall after nightfall. Stand by the crates and keep very still.',
        check: 'wait:cellar:keepers-hall:midnight',
        scene: {
          id: 'q77-cellar',
          lines: [
            N('Under the Keepers’ hall it is cold, dark and smells of old apples. The Harvest Show’s prize Shells sit in a locked chest in the corner.'),
            HO('It is quite a three pipe problem, and I beg that you won’t speak to me for fifty minutes.', 'think'),
            N('He holds a pipe in his teeth. It is cold, and he never lights it.'),
            WA('You gave those up, Holmes.', 'soft'),
            HO('The problems didn’t.', 'happy'),
            N('Inspector Larch, up from the market town, arrives with a lantern and a deeply uncomfortable look. He sits on a barrel that turns out to be a pickle barrel.'),
            LE('Do you think this is wise? I have a dinner to go to.', 'sad'),
            HO('You may go at midnight. Not before.'),
            N('At midnight there is a scrape from under the floor, and a flagstone lifts.'),
            N('Two men climb out of a tunnel with a spade and a sack, and find a lantern in their faces.'),
          ],
          choices: [
            {
              id: 'hold-lantern',
              label: 'Hold the dark lantern steady.',
              then: [N('Your hand does not wobble, even when you very much want it to. Holmes notices, and says nothing, kindly.')],
            },
            {
              id: 'shout',
              label: 'Shout “Stop!” as loudly as you can.',
              then: [
                N('It echoes. The two men jump a foot, and one drops the sack onto the other’s toe.'),
                LE('Well. That did the job, though I would have chosen a quieter way.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'q77-caught',
          lines: [
            LE('The Harvest Show prize Shells, and an entire tunnel to the seed shop’s cellar. Clever. Thoroughly clever.', 'shock'),
            LE('Come along, you two. This will make a very long statement.'),
            HO('The League was a way to get Mr Willet out of the shop for eight weeks so they could dig under it. The red crest was only the bait.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'q77-complete',
      lines: [
        N('The seed shop is quiet again. Mr Willet sits on a sack of barley with his Nubbin on his lap, and looks, at last, a little less foolish.'),
        WI('Eight weeks of apples, and for what? I wish I had known they were digging. I would have brought them tea.', 'sad'),
        HO('You have lost nothing but four Shells a morning, and your belief in the honesty of notices. I suggest you keep the second.', 'soft'),
        WI('And my Nubbin’s crest? Is it worth anything now?'),
        N('Holmes presents the Nubbin with a ribbon of red cloth, tied in a bow.'),
        HO('It is worth a good deal. It is the only reason I was called. Wear it well.', 'happy'),
        N('At dusk Holmes sits at the window above the shop with a cold pipe, thinking. It is not the same problem, but it is the same kind of silence.'),
      ],
    },
    rewards: [
      {
        id: 'q77-red-crest',
        kind: 'cosmetic',
        label: 'Red Crest',
        description: 'A tall red crest of feathers for any Nubbin.',
      },
      {
        id: 'q77-dark-lantern',
        kind: 'decor',
        label: 'Dark Lantern',
        description: 'A shuttered brass lantern, for the shelf or the hand.',
      },
    ],
    childLines: {
      'q77-cellar#1': 'This is a three-cup-of-tea problem. Please don’t talk for a bit.',
    },
    notes:
      'The Keepers’ hall cellar is a new interior with a pickle barrel and a flagstone that lifts. The clay-stained knees are ' +
      'a prop on a silent assistant figure (only seen in the lane). Holmes holds the cold pipe in the cellar and never lights ' +
      'it. Approved quote "It is quite a three pipe problem, and I beg that you won’t speak to me for fifty minutes." is used ' +
      'once and swapped in childLines. Watson’s "You gave those up" exchange is from the outline. The red crest is a Nubbin ' +
      'cosmetic. Holmes does not ask "Well?" in this quest.',
  },

  // ------------------------------------------------------------------ Q78
  {
    id: 'q78',
    code: 'Q78',
    title: 'The Blue Bead',
    source: 'The Blue Carbuncle: the hat, the goose and the second chance',
    audience: 'all',
    trigger: {
      where: 'The lane outside the shop, the week of the Harvest Supper',
      when: 'The week of the Harvest Supper (autumn), after Q77, in the Free Grove or the campaign (never during Chapters 9–11)',
    },
    requires: ['Q77'],
    speakers: [HOLMES_S, WATSON, LESTRADE, JEM, COUNTESS],
    steps: [
      {
        id: 'q78-s1',
        goal: 'Bring the battered hat and the cross goose upstairs to Holmes.',
        hint: 'Pick up the hat from the lane. The goose will walk along behind it, complaining.',
        check: 'carry:item:battered-hat:holmes',
        scene: {
          id: 'q78-intro',
          lines: [
            N('A scuffle in the lane, a shout, and then silence. Where it happened there is a battered hat, and a goose who is extremely cross about everything.'),
            N('The goose has never been so insulted. It hisses at you, then at the hat, then at the sky for good measure.'),
            WA('Someone has run off and left a perfectly good goose. That is not the behaviour of a thief.', 'think'),
            HO('Or it is exactly the behaviour of a thief who had a bad morning. Bring them both up, if you would.', 'happy'),
          ],
        },
        done: {
          id: 'q78-hat',
          lines: [
            N('Holmes holds the hat up to the window, turns it over, and looks at the sweatband through his glass.'),
            HO('He is a man of some intelligence. He has fallen on hard times, though not lately. His wife no longer loves him.', 'think'),
            HO('He goes out very little, and his house has no gas. And the hat has, I suspect, a very small connection to this goose.'),
            HO('Well?', 'happy'),
          ],
          choices: [
            {
              id: 'agree-hat',
              label: 'It sounds right to me.',
              then: [HO('Of course it does. It is nearly always right.', 'happy')],
            },
            {
              id: 'contradict-hat',
              label: 'The hat is much too clean for someone whose wife has stopped caring.',
              set: { 'q78-contradicted': true },
              then: [
                HO('Hm. Sharp. I had not considered that she might brush it out of guilt.', 'think'),
                HO('I stand corrected, by half. Do go on contradicting me. It is the best exercise I get.', 'soft'),
              ],
            },
          ],
        },
      },
      {
        id: 'q78-s2',
        goal: 'Follow the trail to Jem Rudd and hear what he has to say.',
        hint: 'The goose came from his sister’s farm. Find the young porter at the Supper hall.',
        check: 'talk:jem-ryder:supper-hall',
        scene: {
          id: 'q78-trail',
          lines: [
            N('The goose coughs in the shop, politely at first and then not. Something small and blue skitters across the floor.'),
            N('It is a bead the size of a pea, as blue as deep water. It throws a tiny shaft of light onto the ceiling.'),
            WA('The Countess’s bead. It was taken from the Supper prize table on Tuesday, and a travelling tinker has been blamed for it.', 'shock'),
            HO('The tinker did nothing at all. The man who took it has a sister with a farm, and a very bad sense of geese.', 'happy'),
            N('At the Supper hall, a young porter is stacking tables. He has the look of someone listening to every footstep.'),
            JE('Oh. It is you. Is it, I mean, is something the matter?', 'shock'),
            HO('Mr Rudd. I believe you hid something in a goose.', 'think'),
            N('Jem sits down on the nearest table. All the colour goes out of his face, and a little of it comes back as tears.'),
            JE('I only meant to hide it until the fuss went down. Then I took the wrong goose. They all looked the same!', 'sad'),
            JE('I never meant for the tinker to be blamed. I could not sleep for it.', 'sad'),
          ],
        },
      },
      {
        id: 'q78-s3',
        goal: 'Decide what is to happen to Jem Rudd.',
        hint: 'Holmes will ask you. There is no wrong answer, but each one has a different ending.',
        check: 'choose:q78:jem',
        scene: {
          id: 'q78-choice',
          lines: [
            N('Nobody speaks. The goose, in the corner, makes the only noise.'),
            HO('He is frightened enough to stop. But you found the hat, and you carried the goose. I think you should decide.', 'soft'),
            HO('I suppose that I am commuting a felony, but it is just possible that I am saving a soul.', 'think'),
            HO('What would you do?'),
          ],
          choices: [
            {
              id: 'let-go',
              label: 'Let him go, with a warning.',
              set: { 'q78-jem': 'freed' },
              then: [
                HO('Then go, Mr Rudd, and do not do it again. I shall tell Lady Marrowby the bead has been found, and say nothing more.', 'soft'),
                JE('I will. I will not. I mean, thank you. Thank you.', 'happy'),
                N('He is out of the door before the sentence is done. The goose, to be fair, goes with him as far as the corner.'),
              ],
            },
            {
              id: 'call-lestrade',
              label: 'Send for Inspector Larch.',
              set: { 'q78-jem': 'lestrade' },
              then: [
                LE('A theft is a theft, even a small one. Come along, young man.'),
                JE('I only wanted…', 'sad'),
                N('Jem goes quietly. At the door he looks back at you once, and you look at the floor.'),
              ],
            },
            {
              id: 'own-up',
              label: 'Make him walk to the Countess and say it himself.',
              set: { 'q78-jem': 'owned' },
              then: [
                HO('Then up the hill we go, Mr Rudd. It will be the hardest walk you have ever done, and the shortest.', 'soft'),
                N('Lady Marrowby hears him out in her great, cold hall. Her face does something complicated, and then she hands him her handkerchief.'),
                CT('You have given it back, and you have said it to my face. Do not make me regret my handkerchief.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'q78-after',
          lines: [
            N('The tinker is cleared before supper. He is given a hot pie, an apology, and the Grove’s second-best chair.'),
            N('Lady Marrowby has her bead back, and it hangs from her neck on a ribbon, throwing a little blue light across the Supper table.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q78-complete',
      lines: [
        N('At the end of the day Holmes returns the hat to its owner, a perfectly decent man who hardly remembers where he put it.'),
        HO('The hat, then, was the whole case. A battered hat, and a goose that would not behave. I find I prefer my cases small.', 'happy'),
        WA('You said the man was intelligent and unloved. He was neither.', 'think'),
        HO('Then I was wrong, and the goose was right most of all. Mark it down, Watson.', 'soft'),
        N('The goose follows you round for the rest of the day, once. It does not know why, and neither do you.'),
      ],
    },
    rewards: [
      {
        id: 'q78-battered-hat',
        kind: 'cosmetic',
        label: 'The Battered Hat',
        description: 'A well-worn brown hat, for a Nubbin who has seen some things.',
      },
      {
        id: 'q78-goose',
        kind: 'cosmetic',
        label: 'The Goose',
        description: 'A very cross goose follows you round the Grove for the rest of the day, once.',
      },
    ],
    childLines: {
      'q78-choice#2': 'I think he is frightened enough to stop. Sometimes a second chance is the right answer.',
    },
    notes:
      'The goose follows for one day, once; it is not repeatable and not a pet. The blue bead is a tiny prop with a light shaft. ' +
      'The signature choice writes q78-jem ("freed", "lestrade" or "owned"); the "Well?" choice writes q78-contradicted. Both ' +
      'are read only by Q84 and Q85 through the variant scenes in QUESTS_HOLMES_VARIANTS. Holmes asks "Well?" after the hat ' +
      'reading (Q78’s chance to contradict him; Q79 and Q81 give the others). Approved quote "I suppose that I am commuting a ' +
      'felony, but it is just possible that I am saving a soul." used once; swapped in childLines. "lestrade" is the only ' +
      'branch where Jem is taken away.',
  },

  // ------------------------------------------------------------------ Q79
  {
    id: 'q79',
    code: 'Q79',
    title: 'The Gate in the Night-Time',
    source: 'Silver Blaze: the curious incident',
    audience: 'all',
    trigger: {
      where: 'Your own gate, the morning before the autumn Cup',
      when: 'The night before the autumn Cup at the race track, after Q78, in the Free Grove or the campaign (never during Chapters 9–11)',
    },
    requires: ['Q78'],
    speakers: [HOLMES_S, WATSON, SILAS],
    steps: [
      {
        id: 'q79-s1',
        goal: 'Walk the hedge with Holmes and ask Sparks one question.',
        hint: 'Start at the gate and follow the hedge round. Sparks is by the gate.',
        check: 'walk:hedge:holmes',
        scene: {
          id: 'q79-intro',
          lines: [
            N('A famous racing Nubbin called Silver Blaze has been boarding in your Grove before the Cup. This morning its straw bed is empty.'),
            SP('I slept by the gate all night. Nobody came through it. I would have heard.', 'sad'),
            WA('Is there anything to be done? The Cup is tomorrow.', 'shock'),
            HO('Is there any point to which you would wish to draw my attention?', 'think'),
            WA('To the curious incident of the gate in the night-time.', 'think'),
            HO('The gate did nothing in the night-time.', 'happy'),
            WA('That was the curious incident.', 'soft'),
            N('Holmes walks the hedge slowly, looking at the base of it as if it owed him money.'),
          ],
        },
        done: {
          id: 'q79-question',
          lines: [
            HO('Miss Sparks, one question. Does the gate stick and scrape when it is opened?', 'think'),
            SP('Of course it does. Everyone in the valley knows it does. You cannot open it quietly. You never could.'),
            HO('Then nobody came in, and nobody went out through it. Silver Blaze did not use the gate.', 'happy'),
            HO('Well?', 'think'),
          ],
          choices: [
            {
              id: 'agree-gate',
              label: 'It left through the hedge.',
              then: [HO('Exactly so. Look at the gap.', 'happy')],
            },
            {
              id: 'contradict-gate',
              label: 'Silver Blaze could have been carried over the wall.',
              set: { 'q79-contradicted': true },
              then: [
                HO('A thought. But look at the ground, and tell me where the boot marks are.', 'think'),
                N('There are none, and you admit it. Holmes is not the least bit smug, which is somehow worse.'),
                HO('A good objection, even a wrong one. It sharpens the blade.', 'soft'),
              ],
            },
          ],
        },
      },
      {
        id: 'q79-s2',
        goal: 'Find Silver Blaze in Silas Brindle’s paddock and wash it in the pond.',
        hint: 'Go through the gap in the hedge to the neighbouring land. Lead it to the pond to wash.',
        check: 'swim:silver-blaze:pond',
        scene: {
          id: 'q79-paddock',
          lines: [
            N('A rival trainer’s paddock lies on the other side of the hedge. In it is a handsome brown Nubbin with a very brown blaze, standing a little too still.'),
            SB('That is a perfectly ordinary brown Nubbin. I bought it at a fair.', 'shock'),
            HO('Mr Brindle, a fair does not sell racers with a hedge in their fur and the straw of this Grove on their feet.', 'think'),
            SB('…I found it wandering. I did not think anyone would mind if I tidied it.', 'sad'),
            HO('You dyed its white blaze brown so that it would not be recognised, and you meant to enter it, or to stop it entering. I am not yet sure which.', 'happy'),
            N('Silas sits down on an upturned bucket. He has been awake all night, and looks it.'),
          ],
        },
        done: {
          id: 'q79-wash',
          lines: [
            N('At the pond, you lead Silver Blaze into the shallows. The brown runs off in long, muddy ribbons.'),
            N('Under it, the silver blaze comes back, like a lamp being turned up. The Nubbin shakes itself, delighted, and soaks everyone.'),
            SB('I am sorry. I am truly sorry. Please do not tell the stewards.', 'sad'),
            HO('You will tell the stewards yourself, Mr Brindle, after the Cup, and you will bring them tea.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'q79-complete',
      lines: [
        N('Silver Blaze runs the Cup with the sun on its face, and the silver blaze shines on its forehead as it crosses the line first.'),
        WA('Holmes, you were right about everything.', 'happy'),
        HO('I was right about one thing: a gate that always squeaks is a witness when it does not. The rest was luck, and Mr Brindle’s paintbrush.', 'soft'),
        N('Silver Blaze’s Keeper presses a small card into your palm, with a swatch of white paint on it. It is a blaze for your Nubbin, if it wants one.'),
        HO('And for you, an old cap with flaps on the ears. I have no further use for it, having a cap I like better.', 'happy'),
        N('The cap is a little too big, and smells faintly of pipe smoke. Your Nubbin adores it.'),
      ],
    },
    rewards: [
      {
        id: 'q79-travelling-cap',
        kind: 'cosmetic',
        label: 'Ear-Flapped Travelling Cap',
        description: 'A brown cap with flaps over the ears, as worn by a man who walks a great deal.',
      },
      {
        id: 'q79-silver-blaze',
        kind: 'cosmetic',
        label: 'Silver Blaze Marking',
        description: 'A white stripe down the forehead, for any Nubbin.',
      },
    ],
    childLines: {
      'q79-intro#3': 'Is there anything you would like me to look at?',
      'q79-intro#4': 'The gate. It always squeaks, and last night it didn’t.',
      'q79-intro#5': 'The gate did nothing at all in the night.',
      'q79-intro#6': 'That is what is so odd about it.',
    },
    notes:
      'The Cup is a story beat, not a playable race (the race track is only a backdrop). The gate that sticks and scrapes is ' +
      'canon and reads no flag. Silas Brindle’s paddock is on the far side of a gap in the hedge, with an upturned bucket. ' +
      'The pond wash is a short walk-in animation, not a minigame. Holmes asks "Well?" at the end of the question scene ' +
      '(Q79’s chance to contradict him; Q78 and Q81 give the others); the choice writes q79-contradicted. The adapted quote ' +
      '(Silver Blaze, "gate" for "dog" and "night-time" as in the original) is used once, swapped in four short childLines. ' +
      'The travelling cap here is a different item from the cap Holmes gives in Q85 (variant q85-var-cap): name them apart in the wardrobe.',
  },

  // ------------------------------------------------------------------ Q80
  {
    id: 'q80',
    code: 'Q80',
    title: 'The Nose',
    source: 'The Sign of Four: Toby and the tar trail',
    audience: 'all',
    trigger: { where: 'Pixel’s workshop', when: AFTER },
    requires: ['Q79'],
    speakers: [HOLMES_S, WATSON],
    steps: [
      {
        id: 'q80-s1',
        goal: 'Fetch Toby, the dog with the amazing nose.',
        hint: 'Toby lives behind the mill. Bring him back to the workshop on his lead.',
        check: 'escort:toby:workshop',
        scene: {
          id: 'q80-intro',
          lines: [
            PX('My box of brass cogs is gone. And somebody has been in with tar on their feet. Look. All over my clean floor!', 'angry'),
            N('The footprints are dark and sticky. They go round the bench, round the lathe, and out through the door.'),
            WA('I know a dog who could follow that. His name is Toby, and he is rather ugly, but he is excellent.', 'happy'),
            HO('I would rather have Toby’s help than that of the whole detective force of London.', 'happy'),
            N('Toby, a lop-eared hound with an expression of enormous patience, trots back with you from behind the mill.'),
          ],
        },
        done: {
          id: 'q80-toby',
          lines: [
            N('Toby sniffs the footprints once and sets off across the valley with his nose to the ground and his tail like a flag.'),
            N('Your Nubbin trots behind him, copying everything he does. When he stops to sniff a post, your Nubbin stops to sniff a post.'),
            N('Byte has come along to watch Holmes be wrong. He looks very cheerful about it.'),
          ],
        },
      },
      {
        id: 'q80-s2',
        goal: 'Follow Toby across the valley to the end of the trail.',
        hint: 'Keep close to Toby. He will not hurry, but he does not stop.',
        check: 'walk:tar-trail:toby',
        scene: {
          id: 'q80-trail',
          lines: [
            N('Across the meadow, over the stile, down the lane and round the bridge. Toby never once looks up.'),
            N('He leads you, proud as a drum major, straight to Sparks’s tar barrel by the boat shed. There he sits down, with a satisfied look.'),
            SP('It is a barrel of tar. I keep tar in it. That is what it is for.', 'think'),
            WA('The footprints, Holmes. They lead to the barrel, and nowhere else.', 'shock'),
            PX('Oh. Oh no. They are my footprints. I borrowed the tar yesterday.', 'shock'),
            BY('I did say. I said, “Pixel, there is tar on your boots.”', 'happy'),
            PX('You said boots. You did not say floor.', 'angry'),
            N('Toby looks from one of you to the other, with a face that says he would like a biscuit regardless.'),
            HO('Then the footprints tell us nothing, and Toby has done what he was asked. A great achievement, in its way.', 'soft'),
            N('Byte, watching Holmes be right again, looks less cheerful.'),
          ],
        },
      },
      {
        id: 'q80-s3',
        goal: 'Use your Nubbin’s new nose to find the missing cogs.',
        hint: 'Lead your Nubbin to the Workshop roof and let it sniff. It has been paying attention.',
        check: 'find:item:brass-cogs:magpie-nest',
        scene: {
          id: 'q80-nose',
          lines: [
            HO('Not the door. Not the window, for it was shut, and not the chimney, which is a good deal too narrow for a thief.', 'think'),
            HO('How often have I said to you that when you have eliminated the impossible, whatever remains, however improbable, must be the truth?', 'happy'),
            WA('Quite often.', 'soft'),
            HO('Then the skylight, which was open. And something small, quick and shiny-minded that came in by it.'),
            N('Your Nubbin lifts its nose, the way Toby does. It sniffs the air once, twice, and sets off across the yard.'),
            N('It climbs the water butt, then the fence, then the shed, and stops at a bundle of twigs wedged against the Workshop roof.'),
            N('A magpie’s nest. In it are brass cogs, a thimble, a button, a spoon and one very surprised egg.'),
          ],
        },
        done: {
          id: 'q80-cogs',
          lines: [
            PX('My cogs! And my best thimble! And a spoon that I did not know was missing!', 'happy'),
            N('The magpie watches from the chimney with her head on one side. She makes no apology, and keeps the egg.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q80-complete',
      lines: [
        N('Pixel sets a small wooden box on the Workshop roof and puts a button in it. The magpie inspects it, takes it, and approves.'),
        PX('She can keep the nest, as long as she lets me borrow the cogs sometimes.', 'happy'),
        HO('Your Nubbin has learnt more from Toby in a morning than most dogs learn in a lifetime. Mind it does not take up tar.', 'soft'),
        N('From now on, hold the button for Find and your Nubbin will point its nose at the nearest fallen fruit, as often as you like.'),
        N('The magpie keeps a nest of shiny things on the Workshop roof from now on, and does not seem to know she has been caught.'),
      ],
    },
    rewards: [
      {
        id: 'q80-find',
        kind: 'feature',
        label: 'Find',
        description: 'Hold the button and your Nubbin points its nose at the nearest fallen fruit. Unlimited.',
      },
    ],
    childLines: {
      'q80-intro#3': 'Toby has the best nose in the valley. He is worth ten detectives.',
      'q80-nose#1': 'If you rule out everything that cannot be true, whatever is left must be the answer, however odd.',
    },
    notes:
      'Toby is a lop-eared dog on a lead; he does not speak. He walks at a fixed pace and the player follows. The tar trail ' +
      'ends at Sparks’s boat-shed barrel. The magpie’s nest of shiny things stays on the Workshop roof for good (Tier 2). ' +
      'Find is a new button: hold it and the Nubbin points toward the nearest fallen fruit; unlimited, no timer. The Nubbin’s ' +
      'tracking from this quest is what it uses in Q84 (the nose branch). Approved quotes "when you have eliminated the ' +
      'impossible, whatever remains, however improbable, must be the truth" and "I would rather have Toby’s help than that ' +
      'of the whole detective force of London." each used once; both swapped in childLines. The outline’s capitals are an ' +
      'emphasis marker, not set in the text.',
  },

  // ------------------------------------------------------------------ Q81
  {
    id: 'q81',
    code: 'Q81',
    title: 'The Dancing Nubbins',
    source: 'The Dancing Men: the cipher of little figures',
    audience: 'all',
    trigger: { where: 'The Workshop wall, then the bridge, then Fern’s gate', when: AFTER },
    requires: ['Q80'],
    speakers: [HOLMES_S, WATSON, HETTY, SAM],
    steps: [
      {
        id: 'q81-s1',
        goal: 'Copy the chalk figures from the Workshop wall, the bridge and Fern’s gate.',
        hint: 'Use the magnifying glass to read the figures. Copy each one into Holmes’s notebook.',
        check: 'collect:chalk-figures:3',
        scene: {
          id: 'q81-intro',
          lines: [
            N('Small chalk figures of Nubbins, dancing, have appeared on the Workshop wall, the bridge and Fern’s gate.'),
            N('Each has stick limbs and a little head, and each is in a different pose. Some of them are holding flags.'),
            FE('It is a curse. I am certain of it. Nobody puts a chalk drawing on a gate unless they mean harm.', 'shock'),
            HO('Fern, I assure you, no curse in history has been drawn in chalk. It rubs off in the rain.', 'happy'),
            HO('Copy every one, if you would. I need them in order.', 'think'),
          ],
        },
        done: {
          id: 'q81-copied',
          lines: [
            N('Holmes lays the three copies side by side and counts the figures that turn up most. His pencil moves very fast.'),
            HO('One figure comes up more than any other. In English, that would be the letter E. This is a cipher, and an easy one.', 'happy'),
            HO('Well?', 'think'),
          ],
          choices: [
            {
              id: 'agree-code',
              label: 'It is a code, and the flags mark the end of each word.',
              then: [HO('Capital. You will make a detective yet.', 'happy')],
            },
            {
              id: 'contradict-code',
              label: 'Maybe it is just children doodling.',
              set: { 'q81-contradicted': true },
              then: [
                HO('Children doodle. They do not repeat a figure with a flag in the same place on three different walls.', 'think'),
                HO('But you are quite right that I should check. I like a sceptic. One at a time, though; Byte covers the rest.', 'soft'),
              ],
            },
          ],
        },
      },
      {
        id: 'q81-s2',
        goal: 'Find who is writing the code, and bring both families to the pond.',
        hint: 'Holmes will decode the messages. Follow them to the pond at the end of the day.',
        check: 'meet:hetty-sam:pond',
        scene: {
          id: 'q81-decode',
          lines: [
            HO('What one man can invent another can discover.', 'happy'),
            N('He chalks his own reply on the garden wall, in the dancing figures. It is eight figures long.'),
            N('By evening there is a second message beneath it, in a hand much smaller than his. Holmes reads it aloud, slowly.'),
            HO('MEET AT THE POND. BRING THE KITE.', 'happy'),
            WA('It is two children, then. A kite, and a pond.', 'soft'),
            HO('Two children whose families, I gather, have been feuding over a hedge for some months. Their letters have been entirely in chalk.'),
            N('Hetty and Sam come to the pond from opposite sides, each with a dusty hand and a guilty look.'),
            HE('We only wanted to talk. Our mums would not let us.', 'sad'),
            SA('The code was my idea. Hetty did all the hard letters.', 'soft'),
          ],
        },
        done: {
          id: 'q81-families',
          lines: [
            N('Holmes has quietly sent a note, in the same code, to both households. By teatime, both families are at the pond with their arms folded.'),
            N('The hedge turns out to be nine inches off. After some argument it is moved, and everyone is a little embarrassed.'),
            HE('Is it all right if we still use the code? It is much more fun than just saying things.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q81-complete',
      lines: [
        N('The kite goes up at dusk, a red diamond with a long tail, and the two families watch it from either side of the pond.'),
        WA('The best case we have had. Nobody is sorry, and nobody is ruined.', 'happy'),
        HO('The best ones are the ones where all that is wrong is that two people did not say a thing. The rest is just chalk.', 'soft'),
        N('Hetty gives you a stick of chalk in a small tin, and a little paper kite to take home.'),
        N('You can write dancing-Nubbin letters on any path now. People will not know what they say, and that is half the point.'),
      ],
    },
    rewards: [
      {
        id: 'q81-chalk-set',
        kind: 'feature',
        label: 'Dancing Chalk Set',
        description: 'A chalk set that draws dancing-Nubbin letters on paths. Unlimited.',
      },
      {
        id: 'q81-kite',
        kind: 'decor',
        label: 'Kite',
        description: 'A red diamond kite with a long tail, to fly from the pond or the hill.',
      },
    ],
    childLines: {
      'q81-decode#0': 'Count them. The shape you see most is probably the letter E.',
    },
    notes:
      'The chalk figures appear in three places in order: Workshop wall, bridge, Fern’s gate. They are readable with the Q76 ' +
      'magnifying glass in Photo mode. The cipher is a simple substitution (a figure per letter, flags mark word ends); ' +
      'a small decoding display is optional. Hetty and Sam’s families have quarrelled over a hedge. Holmes asks "Well?" ' +
      'after the count (Q81’s chance to contradict him); the choice writes q81-contradicted; if it is true, play "q81-var-children" (in QUESTS_HOLMES_VARIANTS) straight after "q81-complete". Approved quote "What one man can ' +
      'invent another can discover." used once, swapped in childLines. The chalk set draws on path tiles only.',
  },

  // ------------------------------------------------------------------ Q82
  {
    id: 'q82',
    code: 'Q82',
    title: 'The Ritual',
    source: 'The Musgrave Ritual: the old directions and the shadow',
    audience: 'all',
    trigger: {
      where: 'The meadow, on a sunny afternoon',
      when: 'A sunny afternoon after Q81, in the Free Grove or the campaign (never during Chapters 9–11)',
    },
    requires: ['Q81'],
    speakers: [HOLMES_S, WATSON],
    steps: [
      {
        id: 'q82-s1',
        goal: 'Help Holmes measure the tree’s shadow in the meadow.',
        hint: 'Stand where he points, hold the rod upright, and watch the shadow.',
        check: 'place:rod:meadow:shadow',
        scene: {
          id: 'q82-intro',
          lines: [
            WA('You never told me about your early cases, Holmes. You always say they were not interesting enough.', 'soft'),
            HO('I said they were not remarkable. One of them was interesting. It concerned an old family, and a very old question.', 'think'),
            HO('“Whose was it?” “His who is gone.” “Who shall have it?” “He who will come.” Nobody had understood it for two hundred years.', 'think'),
            N('Holmes acts it out in the meadow with a rod, a tape and a tree. He is plainly having the time of his life.'),
            HO('A rod six feet long throws a shadow nine feet long. So a tree sixty-four feet tall throws ninety-six. Hold the rod, please.', 'happy'),
            N('You hold the rod. Your Nubbin holds the other end of the tape, very seriously, and only drops it once.'),
          ],
        },
        done: {
          id: 'q82-shadow',
          lines: [
            N('The shadow of the great oak ends at a patch of long grass. Holmes marks the spot with a peg.'),
            HO('This is where the old directions begin. From here, it is a matter of counting.', 'happy'),
          ],
        },
      },
      {
        id: 'q82-s2',
        goal: 'Follow the old directions and find the tin hidden in the Grove.',
        hint: 'Count your steps: north, east, south, then west. Dig where you finish.',
        check: 'walk:ritual:10-5-2-1',
        scene: {
          id: 'q82-ritual',
          lines: [
            HO('Now it is your turn. I have hidden a tin somewhere in the Grove, and I will give you the old directions.', 'happy'),
            HO('North by ten and by ten, east by five and by five, south by two and by two, west by one and by one, and so under.', 'think'),
            WA('What does “so under” mean?', 'think'),
            HO('Dig, Watson. It means dig.', 'happy'),
            N('You count your steps out loud: ten north, five east, two south, one west. The spot you stand on is quite ordinary and quite certain.'),
            N('Your Nubbin digs, being very good at it. A moment later it sits back with a rusty tin in its paws.'),
          ],
        },
        done: {
          id: 'q82-tin',
          lines: [
            N('Inside the tin are six toffees, still sticky, and a dented tin crown from some old village play.'),
            WA('The toffees are a joke, I suppose.', 'soft'),
            HO('They are an investment. The crown, on the other hand, is a very serious and ancient article, and is yours.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'q82-complete',
      lines: [
        N('The toffees are shared out on the meadow grass, and the crown is put on your Nubbin, where it sits at a thoughtful angle.'),
        WA('You never did tell me how that case ended, Holmes.', 'soft'),
        HO('With a crown in a hole and a family’s long question answered. I found it very satisfying and very sad. Those are often the same thing.', 'soft'),
        N('Holmes drives a short stick into the ground and ties a bit of string to it, an old sundial made from a sunny afternoon.'),
        HO('For the garden. It tells the time only roughly, but it tells it honestly, which is more than most clocks.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q82-tin-crown',
        kind: 'cosmetic',
        label: 'Tin Crown',
        description: 'A dented tin crown from an old village play, for any Nubbin.',
      },
      {
        id: 'q82-sundial',
        kind: 'decor',
        label: 'Sundial',
        description: 'A small garden sundial that tells the time roughly and honestly.',
      },
    ],
    childLines: {
      'q82-intro#2': 'There was an old riddle. “Whose is it?” “The one who is gone.” “Who gets it?” “The one who will come.” Nobody solved it for years.',
      'q82-ritual#1': 'Ten steps north. Five east. Two south. One west. Now dig.',
    },
    notes:
      'The meadow oak is used for this quest only. The shadow is a staging beat (rod, tape, peg); the player only holds the ' +
      'rod and watches. In step 2 the player counts steps out loud (10 north, 5 east, 2 south, 1 west) from the peg; the Nubbin ' +
      'digs automatically where the walk ends. The two lifted passages (the catechism, and "North by ten and by ten…") are ' +
      'each used once, in step 1 and step 2; both swapped in childLines. The sundial is a decoration; its time-telling ' +
      'is cosmetic and sets no clock.',
  },

  // ------------------------------------------------------------------ Q83
  {
    id: 'q83',
    code: 'Q83',
    title: 'The Woman',
    source: 'A Scandal in Bohemia: the photograph and the smoke-rocket',
    audience: 'all',
    trigger: { where: 'The room above the shop, in the evening', when: AFTER },
    requires: ['Q82'],
    speakers: [HOLMES_S, WATSON, KRAMM],
    steps: [
      {
        id: 'q83-s1',
        goal: 'Listen to the masked visitor and agree to help get the photograph back.',
        hint: 'Climb the stairs at dusk. The masked man will not give his real name.',
        check: 'talk:count-kramm:221b',
        scene: {
          id: 'q83-intro',
          lines: [
            N('A tall man in a long coat and a velvet mask comes up the stairs at dusk. He gives his name as the Count von Kramm, and nobody believes him.'),
            KR('There is a photograph. A Photo mode picture, taken at a ball. I am in it, dancing very badly with a travelling singer called Irene Alder.', 'sad'),
            KR('She has threatened to show it. I cannot have that, Mr Holme.'),
            HO('You wish to have it back, without the lady being harmed, and without a great fuss. Quite right.', 'think'),
            WA('A singer. Do we know her?', 'soft'),
            HO('Only by reputation. It is a very good one, and I cannot say that of many.', 'happy'),
          ],
        },
        done: {
          id: 'q83-plan',
          lines: [
            HO('We shall need a clergyman, a smoke-rocket, and a Keeper with a good voice.', 'happy'),
            N('Holmes comes down in a plain black coat, a white collar and a soft round hat. He looks entirely like a curate who has lost his way.'),
          ],
        },
      },
      {
        id: 'q83-s2',
        goal: 'Throw the smoke-rocket through the window and shout “Fire!”',
        hint: 'Stand at the singer’s gate. Wait for Holmes’s sign, then throw and shout.',
        check: 'give:item:smoke-rocket:irene-window',
        scene: {
          id: 'q83-rocket',
          lines: [
            N('Irene Alder’s cottage has lace curtains and a garden full of foxgloves. Holmes, in his clergyman’s collar, stumbles onto the doorstep.'),
            N('Someone helps him up, which is the whole of the plan. Within a minute he is in her front room, looking pale.'),
            HO('Now.', 'think'),
            N('You throw the little smoke-rocket through the open window. It makes a great deal of smoke and no fire at all.'),
            Y('Fire! Fire!', 'shock'),
            N('In the front room, the singer’s eyes flick to a cupboard by the fireplace, for one moment, before she looks away again.'),
            HO('When people think their house is on fire, they look at what they love most. Thank you, madam.', 'happy'),
          ],
        },
        done: {
          id: 'q83-cupboard',
          lines: [
            N('The smoke clears, and the lace curtains settle. Holmes comes out, quite satisfied, and walks you both back to the lane.'),
            HO('Tomorrow morning, when she has gone out, we shall go in and take it. Do not look so grave. It is a very small crime.', 'soft'),
          ],
        },
      },
      {
        id: 'q83-s3',
        goal: 'Go to the cottage in the morning and look in the cupboard.',
        hint: 'Go back at first light, with Holmes and Dr Warde.',
        check: 'inspect:cupboard:irene-cottage',
        scene: {
          id: 'q83-morning',
          lines: [
            N('The cottage door is open, and the front room is empty. The curtains are drawn, and a single foxglove stands in a glass on the sill.'),
            N('In the cupboard there is no photograph. There is a letter, and a framed picture of Irene Alder in a travelling dress, laughing.'),
            HO('She saw through the clergyman before I had finished falling over. She dressed as a young man and called good evening to me at my own door.', 'think'),
            WA('So she has beaten you.', 'shock'),
            HO('Entirely. And rather beautifully. She has gone away, kept the photograph for her own security, and promised in a letter never to use it.', 'soft'),
          ],
        },
        done: {
          id: 'q83-letter',
          lines: [
            N('Holmes reads the letter twice, then folds it carefully and puts it in his breast pocket.'),
            HO('I should like to keep the picture, Watson, if I may. As a fee.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'q83-complete',
      lines: [
        N('The Count von Kramm is told the photograph is safe, since Irene has promised never to use it. He goes home content, in a coat that is nearly his own.'),
        WA('To Holmes she is always the woman. I have written it down, and I shall not change it.', 'soft'),
        WA('Holmes was beaten, and by a singer. He has never been happier.', 'happy'),
        N('Irene’s picture goes in a plain frame on the mantelpiece at 221B, between the violin and the jar of plum jam.'),
        HO('You will find a clergyman’s hat, coat and collar in the cupboard, if you want them. They are very good for being overlooked.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'q83-clergyman',
        kind: 'cosmetic',
        label: 'Clergyman Disguise',
        description: 'A round black hat, a white collar and a soft black coat, for a Nubbin who would rather not be noticed.',
      },
      {
        id: 'q83-irene-photo',
        kind: 'decor',
        label: 'Irene’s Photograph',
        description: 'A framed picture of a travelling singer, laughing.',
      },
    ],
    childLines: {
      'q83-complete#1': 'Of all Holmes’s cases, there is one he thinks about most, and the lady got away with it.',
    },
    notes:
      'A masked visitor who gives a false name; "Count von Kramm" is a mask, not a fact. The smoke-rocket is a harmless puff ' +
      'effect with no fire art; nobody is endangered. Irene is glimpsed only (in the front-room cutaway, and in the framed ' +
      'picture) and never speaks. The line "To Sherlock Holmes she is always THE woman." is lifted: THE is italic in the ' +
      'Gutenberg text, but Line text has no markup, so it is set plain here (use italics on that word if the dialogue box ever ' +
      'supports it). Used once; swapped in childLines. The "photograph" is an ordinary Photo mode picture; the quest does ' +
      'not require the player to take one.',
  },

  // ------------------------------------------------------------------ Q84
  {
    id: 'q84',
    code: 'Q84',
    title: 'The Hound of the Heath',
    source: 'The Hound of the Baskervilles: the paw prints and the glow on the moor',
    audience: 'all',
    trigger: {
      where: 'The room above the shop, on a misty autumn evening',
      when: 'A misty autumn evening after Q83 (Chapter 7 or 8, or any autumn in the Free Grove; never during Chapters 9–11)',
    },
    requires: ['Q83'],
    speakers: [HOLMES_S, WATSON, STAPLETON, JEM, LESTRADE],
    steps: [
      {
        id: 'q84-s1',
        goal: 'Listen to Dusty’s story, then go ahead to the heath with Dr Warde.',
        hint: 'Go up to the room above the shop. Holmes says he is too busy, and sends you and Watson on.',
        check: 'visit:heath:watson',
        scene: {
          id: 'q84-intro',
          lines: [
            N('Dusty comes to the room above the shop with a very pale face and earth under every claw.'),
            DU('Mr Holme, on the high heath above our cliff there are paw prints. They are huge. And at night, something glows out there and howls.', 'shock'),
            DU('Mr Holme, they were the footprints of a gigantic hound!', 'shock'),
            HO('I am afraid I am very busy with a matter of bees, Dusty. Watson and the Keeper will go ahead. I shall follow, in my own time.', 'think'),
            WA('You are not coming?', 'shock'),
            HO('I am coming. I merely have a great deal to think about, and I do it best alone.', 'happy'),
            DU('They are the biggest paw prints I have ever dug round. And I dig a lot.', 'sad'),
          ],
        },
      },
      {
        id: 'q84-s2',
        goal: 'Meet Mr Stapling on the heath and cross the bog by the safe path.',
        hint: 'Follow the heath path to the bog. A wrong step means mud to the waist.',
        check: 'walk:heath:safe-path',
        scene: {
          id: 'q84-path',
          lines: [
            N('The high heath is brown and purple, and the mist lies in it like milk in a saucer. Somewhere out there, a sheep coughs.'),
            ST('Good evening. Stapling. I am a naturalist. I am here for the moths, and the peace and quiet.', 'happy'),
            N('He carries a butterfly net and a tin of pins, and he is very eager to tell you about the bog.'),
            ST('Beautiful, is it not? Mud to the waist, if you step wrong. I should not go out there in the dark. Not for the world.', 'think'),
            N('Behind him, a long green stretch of grass lies perfectly flat and perfectly still, which is exactly the problem.'),
          ],
        },
        done: {
          id: 'q84-bog',
          lines: [
            N('On the far side, Watson sits on a stone and checks both boots, from habit. Nobody says anything until he has finished.'),
            WA('We are on the heath. The hound has not appeared. I suggest we find somewhere to be afraid in comfort.', 'soft'),
          ],
        },
      },
      {
        id: 'q84-s3',
        goal: 'Find the stone hut and wait for the glow to come out of the mist.',
        hint: 'The old hut is at the end of the safe path. Wait inside until nightfall.',
        check: 'wait:stone-hut:glow',
        scene: {
          id: 'q84-hut',
          lines: [
            N('In the old stone hut a lamp is already burning, and a long coat hangs from a nail. It is Holmes’s, and so is the pipe on the table.'),
            HO('Ah. You are a little later than I expected.', 'happy'),
            WA('You were here all along?', 'shock'),
            HO('Camping, my dear fellow. I have been camping. The world is full of obvious things which nobody by any chance ever observes.', 'happy'),
            N('Outside, at dusk, a low blue glow rises out of the mist, and a long, low howl follows it across the heath.'),
            N('It is an enormous shape on four legs, shining faintly, and it is coming straight towards you.'),
            N('It reaches Holmes, sits down, puts its great paws on his knees, and licks his face from chin to forehead.'),
            HO('Good evening. I see you are not a hound of hell. I see you are a hound of a rather large and sloppy sort.', 'happy'),
          ],
        },
        done: {
          id: 'q84-hound',
          lines: [
            N('The glow is fungus. The hound has been kept in a barn among rotten logs, until its coat was streaked with a faint, harmless shine.'),
            HO('An enormous, gentle stray, kept by a man who wished the walkers to stay away from his rare moths.', 'think'),
            N('Behind you, Mr Stapling turns and runs. He gets about twenty yards before the heath takes him to the waist.'),
          ],
        },
      },
    ],
    complete: {
      id: 'q84-complete',
      lines: [
        N('It takes everyone to pull Mr Stapling out of the bog, and his butterfly net, and his boots. Nobody is hurt, and everybody is muddy.'),
        HO('The hound is not a hound of hell, nor was it ever a threat. It is a very large dog, which has been unfairly used.', 'soft'),
        DU('It is the nicest hound I have ever met. Can I have a go at digging near it?', 'happy'),
        N('The hound lies down at your feet and puts its head on your boots. Its glow is pale blue, and rather warm.'),
        HO('He is yours, if he will have you. He will sleep by your gate on misty nights. Do give him a wide blanket.', 'happy'),
        N('You are given a collar of soft blue light, the same colour as the fungus. It does not glow brightly, but it never goes out.'),
      ],
    },
    rewards: [
      {
        id: 'q84-hound',
        kind: 'feature',
        label: 'The Hound',
        description: 'A gentle, faintly glowing hound who sleeps by your gate on misty nights.',
      },
      {
        id: 'q84-glow-collar',
        kind: 'cosmetic',
        label: 'Glowing Collar',
        description: 'A soft blue collar that glows faintly in the dark.',
      },
    ],
    childLines: {
      'q84-intro#2': 'Mr Holme, the paw prints are enormous. They are the biggest I have ever seen!',
      'q84-hut#3': 'Camping, my dear fellow. The world is full of obvious things that nobody ever really looks at.',
    },
    notes:
      'A misty autumn evening (Chapter 7 or 8, or any autumn in the Free Grove). The heath is above Dusty’s cliff. The bog is ' +
      'a walk-through puzzle with a safe path. The Q78 payoff plays directly after scene "q84-path" (before step 2 completes): ' +
      'if q78-jem is "freed" or "owned", play variant "q84-var-guide" (Jem, now a shepherd, shows the safe path marked with ' +
      'sticks); if q78-jem is "lestrade", play "q84-var-nose" (your Nubbin finds the path by Toby’s nose from Q80, slowly, ' +
      'and Watson goes in to the knees). Both are in QUESTS_HOLMES_VARIANTS. The hound is a gentle stray kept in a barn among glowing ' +
      'fungus; nobody is harmed. Mr Stapling sinks to his waist and is pulled out by everyone. The hound sleeps by the gate ' +
      'on misty nights from then on (Tier 2). Approved quotes "Mr. Holmes, they were the footprints of a gigantic hound!" ' +
      '(Dusty speaks it; "Mr. Holmes" becomes "Mr Holme" for the renamed character) and "The world is full of obvious things ' +
      'which nobody by any chance ever observes." each used once; both swapped in childLines.',
  },

  // ------------------------------------------------------------------ Q85
  {
    id: 'q85',
    code: 'Q85',
    title: 'The Bees',
    source: 'His Last Bow: the retired detective’s bees',
    audience: 'all',
    trigger: {
      where: 'The sunny bank above the orchard, on a fine morning',
      when: 'A fine morning after Q84, in the Free Grove or the campaign (never during Chapters 9–11)',
    },
    requires: ['Q84'],
    speakers: [HOLMES_S, WATSON, JEM, LESTRADE],
    steps: [
      {
        id: 'q85-s1',
        goal: 'Help Holmes build three hives.',
        hint: 'Bring wood from the Workshop and set the hives where Holmes points.',
        check: 'build:decor:beehive:3',
        scene: {
          id: 'q85-intro',
          lines: [
            HO('I am retiring, Watson. I intend to keep bees on the sunny bank above the orchard.', 'happy'),
            WA('You have been retiring for a month. You will be bored in a week.', 'soft'),
            HO('Bees are not boring. They are the most reliable witnesses I have ever met.', 'happy'),
            HO('Here is the fruit of my leisured ease, the magnum opus of my latter years!', 'happy'),
            N('He holds up a slim brown book. On the cover, in his small and exact handwriting, it says Practical Handbook of Bee Culture.'),
            N('Under the title, in smaller letters: with Some Observations upon the Segregation of the Queen.'),
          ],
        },
        done: {
          id: 'q85-hives',
          lines: [
            N('You build three hives in the Workshop yard. Holmes inspects every lid, and adds a fourth nail to each, in case of burglars.'),
            N('The first bee arrives before the lids are on. She inspects everyone, and approves of nobody in particular.'),
          ],
        },
      },
      {
        id: 'q85-s2',
        goal: 'Carry the hives up and settle the bees.',
        hint: 'Lift the hives onto the bank, and stay calm and slow while the bees move in.',
        check: 'carry:decor:beehive:bank',
        scene: {
          id: 'q85-settle',
          lines: [
            N('The first hive is heavy and the second is heavier. The third, for no reason you can name, weighs about the same as a small piano.'),
            N('Holmes walks ahead with a smoker in one hand and his book in the other, narrating the whole thing like a lecturer on a ship.'),
            HO('Slowly. Bees dislike surprises. Which is, you will note, the same as most criminals.', 'happy'),
            N('Someone is coming up the bank behind you.'),
          ],
        },
        done: {
          id: 'q85-hive-done',
          lines: [
            N('The bees move into the hives in the early afternoon, in a long dark ribbon through the sun. Somebody has to hold the lid, and it is you.'),
            WA('They are rather beautiful, Holmes. I had never noticed.', 'soft'),
            HO('That is the problem with noticing. You have to practise it on small things first.', 'soft'),
            N('Byte has come up the bank behind you, with his arms folded and a jar under one elbow.'),
            BY('I came to catch you guessing. Ten quests. Not once.', 'sad'),
            HO('And the plum jam, Mr Byte?', 'think'),
            BY('…I was testing whether it was real. It was. I will pay.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'q85-complete',
      lines: [
        N('Holmes stays in the valley with his bees, and Watson stays in the room above the shop, writing it all up.'),
        HO('Bees never lie about where the flowers are. I find that restful.', 'soft'),
        WA('I have called the new collection The Hound of the Grove. Nobody has complained yet.', 'happy'),
        N('The hives hum in the sunshine on the bank, and the flowers around them bloom a little brighter than before.'),
        N('Holmes sits by them in the afternoons with a notebook on his knee and a cold pipe in his teeth. It is the only kind of retirement he could ever have borne.'),
      ],
    },
    rewards: [
      {
        id: 'q85-beehive',
        kind: 'decor',
        label: 'Beehive',
        description: 'A hive on the bank. Flowers within reach of it bloom a little brighter.',
      },
      {
        id: 'q85-parting-gift',
        kind: 'cosmetic',
        label: 'Holmes’s Parting Gift',
        description: 'His brass pocket lens if you ever disagreed with him in a case, his ear-flapped cap if you did not.',
      },
    ],
    childLines: {
      'q85-intro#3': 'Here is my life’s great work, written at last in my spare time!',
      'q85-intro#5': 'Under the title, in smaller letters: with Some Notes on Queens.',
    },
    notes:
      'A sunny bank above the orchard, a fine morning. Jem or Lestrade arrives directly after scene "q85-settle": if q78-jem ' +
      'is "freed" or "owned", play "q85-var-jem" (Jem helps carry the hives and stays on as Holmes’s beekeeper’s boy); if ' +
      '"lestrade", play "q85-var-lestrade" (the Inspector is stung). Just before the complete scene, play "q85-var-loupe" if ' +
      'any of q78-contradicted, q79-contradicted or q81-contradicted is true (Holmes gives a brass pocket lens, a cosmetic ' +
      'matching the Q76 glass); otherwise play "q85-var-cap" (Holmes gives the ear-flapped cap). All variants are in ' +
      'QUESTS_HOLMES_VARIANTS. Holmes and Watson stay in the valley as residents: Holmes on the bank with his bees, Watson at the ' +
      'window above the shop (Tier 2). Flowers within reach of the hive bloom a little brighter (cosmetic). The approved ' +
      'quote "Here is the fruit of my leisured ease, the magnum opus of my latter years!" is used once, and the book’s own ' +
      'subtitle once more; both swapped in childLines.',
  },
];

export const QUESTS_HOLMES_FLAGS: string[] = ['q78-jem', 'q78-contradicted', 'q79-contradicted', 'q81-contradicted'];

export const QUESTS_HOLMES_CHECKS: string[] = [
  'escort:watson:shop',
  'visit:room-above-shop:holmes',
  'visit:league-office:door',
  'wait:cellar:keepers-hall:midnight',
  'carry:item:battered-hat:holmes',
  'talk:jem-ryder:supper-hall',
  'choose:q78:jem',
  'walk:hedge:holmes',
  'swim:silver-blaze:pond',
  'escort:toby:workshop',
  'walk:tar-trail:toby',
  'find:item:brass-cogs:magpie-nest',
  'collect:chalk-figures:3',
  'meet:hetty-sam:pond',
  'place:rod:meadow:shadow',
  'walk:ritual:10-5-2-1',
  'talk:count-kramm:221b',
  'give:item:smoke-rocket:irene-window',
  'inspect:cupboard:irene-cottage',
  'visit:heath:watson',
  'walk:heath:safe-path',
  'wait:stone-hut:glow',
  'build:decor:beehive:3',
  'carry:decor:beehive:bank',
];
