/**
 * Atlas campaign, page A12: The Mirror Shard (Part M, rank 3). Eighteen quests, A12-1 to A12-18.
 *
 * SOURCE. Hans Christian Andersen, "Sneedronningen" (The Snow Queen), Nye Eventyr, 1844: all seven
 * stories, from the troll's mirror to the summer homecoming. Rights: public domain everywhere
 * (Andersen died in 1875). The English edition Part M worked from is the Victorian translation in
 * Project Gutenberg's Andersen's Fairy Tales (eBook #1597), also public domain. Its translator is
 * uncredited there, so name no translator on screen until the credit is confirmed. Nothing comes from
 * any film or later adaptation (no Frozen names, songs, designs or plot changes). All art is
 * original, in a cut-paper style that nods to Andersen's own paper cutting; every figure is our own.
 *
 * AUDIENCE. 'all'. No line is lifted verbatim (see LIFTED TEXT), so there are no childLines. The
 * softenings Part M asks for are built in (see CARE NOTES). The Learning Grove edu versions are not
 * in this file.
 *
 * FRAME. Nova's atlas falls open at a page of cut paper: rooftops and two attic windows. You and
 * your Nubbin step into it as Grandmother's new lodger, in the room under the eaves. Gerda is the
 * hero, and only she goes in to Kay at the end. You jump into her boat when it drifts and go with
 * her; your Nubbin rides in her muff (A12-8 to A12-10) and later inside her coat. At the bush with
 * red berries you stop and wait, because the Finnish woman says you must. A12-15 and A12-16 are seen
 * from the bush: your Nubbin breathes a clear patch in the frost and the atlas shows you the next page.
 * Andersen's talking animals and flowers talk (canon 31); your Nubbin never does.
 *
 * GROVE FLAGS READ (read-only; the Atlas never writes a Grove flag). They are exclusive: S19 runs
 * only if the stone was unmade, so a save has `keptStone` or `cinder`, or neither.
 *   - keptStone (c10-edge: true). The Snow Queen knows you.
 *       A12-4: A12_VARIANTS 'a12-04-kept' plays after a12-04-square-done. Her sledge stops by
 *         you, "You keep things too", and she holds open her bearskin. Choice: refuse, or say
 *         nothing and step back. Either way she drives on. No kiss is offered to the player.
 *       A12-14: 'a12-14-prayer-kept' replaces a12-14-prayer. The snowflakes part for you, the stone
 *         hums, and you sit back down.
 *       A12-18: 'a12-18-pocket' plays after a12-18-roses-done. Grandmother asks why your hand is
 *         always on your pocket.
 *   - cinder (S19: 'forgiven' | 'remembered'). Your Nubbin carries Cinder's ember in a little lantern.
 *     Forgiven, it burns steady; remembered, it flickers but never goes out.
 *       A12-1: 'a12-01-ember-forgiven' or '-remembered' plays after a12-01-arrive-done.
 *       A12-12: 'a12-12-ember-forgiven' or '-remembered' plays after a12-12-chimney-done (the
 *         Finnish woman's line about the right size for a fire).
 *       A12-13: 'a12-13-wait-forgiven' or '-remembered' replaces a12-13-wait (the ember keeps
 *         you both from freezing).
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a12-):
 *   - a12-01 … a12-18: each quest on completion. a12-done: the whole page (A12-18). The Great Voyage
 *     festival reads it through atlasDone('A12').
 *   - a12-nubbin = no | night (A12-9, a12-09-keep): the signature choice. The robber girl asks to
 *     keep your Nubbin. It picks A12_VARIANTS in A12-10 (her goodbye), A12-17 (tied or untied
 *     pigeons, 8 quests later) and A12-18 (the last image), plus the red cap on the Grove petpet.
 *
 * LIFTED TEXT. None verbatim. Part M lists eight passages from the #1597 translation, and marks all
 * eight [unverified] (Gutenberg's #1597 page was cut off before the story, and Wikisource could not
 * be reached; lines 3 to 8 match Lit2Go's copy, which is secondary). So every beat is told in our
 * own words:
 *   1. The opening ("let us begin"): our own version, a12-01-show#6.
 *   2. The heart "like a lump of ice": our own image (a stone in a frosty field), a12-01-shards#7.
 *   3. Bae's "who should know better" line: our own version, a12-10-morning#2.
 *   4–5. The Finnish woman on Gerda's power and her heart: our own version, a12-12-power#8–9.
 *   6. The Snow Queen's promise (be your own master; the whole world and new skates): our own
 *      version, a12-15-south#7–8.
 *   7. Kay's "where have you been" line: our own version, a12-16-tears#2.
 *   8. "grown up, and yet children": our own version, a12-18-roses#4.
 * If any is verified against #1597 later, it can be swapped in verbatim, with a childLines entry.
 * The name "Mirror of Understanding" (the seventh story) is confirmed against #1597's text on
 * BookRags and is used as a name only (a12-15-puzzle#1). Andersen's word, Eternity, is used as the
 * word in the ice (a12-16-word#2). The rose hymn is never given in words, and neither is Gerda's
 * prayer or Grandmother's reading. Everything else is original.
 *
 * CARE NOTES.
 *   - Names: always "the Sámi woman" and "the Finnish woman", never "Lapp woman". The place is
 *     "the far north" or "Lapland".
 *   - The Sámi woman (A12-11, A12-17) is a host in her own home: practical, warm, a good cook. She
 *     has no magic beyond Andersen's letter on the dried fish. No noaidi drum or any sacred item. Her
 *     son has the family herd out on the winter grazing: herding is a living livelihood, not a prop.
 *     Her dress (the gákti) follows the Sámi adviser commissioned before art, so the script never
 *     describes it; it is never a costume reward.
 *   - The Finnish woman (Andersen's Finnekonen, who may be Sámi in the Danish usage of his day) casts
 *     no spells. Andersen's knotted winds and her reading of the skin are cut. She gives advice, says
 *     Gerda's power is her own, and that is all. The Sámi adviser decides how she is drawn and whether
 *     "the Finnish woman" is the right name; the script uses it as Part M says.
 *   - The reindeer is "Bae" (Andersen's Bæ; the old translation misprints "Bac").
 *   - Faith: Gerda's prayer and Grandmother's Bible are Andersen's. They're brief and respectful, and
 *     narrated, never quoted. The bright figures of A12-14 are drawn as small shining figures with
 *     helmets and spears, as Andersen describes them; nobody comments on them.
 *   - Softened for 'all': the old robber woman makes no threats (she peers in, drinks, naps). The
 *     coachman and footmen run off unhurt. The robber girl's knife never touches Bae; she waves it at
 *     the ceiling and cuts his rope with it. The pigeons' nest is cold "a long time", not lost. The
 *     raven's death is one quiet line (A12-17). The Snow Queen's warning about kisses is cut, and no
 *     kiss is ever offered to the player.
 *   - Comedy is Andersen's: the raven's courtly gossip, the narcissus admiring itself, the letter in
 *     the soup pot, the palace raven's headache from too much kitchen food.
 *   - The third rule is acted out at the bush (A12-13 to A12-16) and never named.
 */
import type { Choice, Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Mirror Shard page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'The Snow Queen (H. C. Andersen, 1844)';

// ------------------------------------------------------------------ speakers

const sGerda = sp('a12-gerda', 'Gerda', 'Gerda (H. C. Andersen, The Snow Queen, 1844); original design');
const sKay = sp('a12-kay', 'Kay', 'Kay (H. C. Andersen, The Snow Queen, 1844); original design');
const sGran = sp('a12-gran', 'Grandmother', 'Kay and Gerda’s grandmother (The Snow Queen, 1844); original design');
const sQueen = sp('a12-queen', 'The Snow Queen', 'The Snow Queen (H. C. Andersen, 1844); original design, nothing from any film');
const sTroll = sp('a12-troll', 'The Troll', 'The wicked sprite or troll of the first story, voiced by Grandmother in a shadow-show');
const sOldWoman = sp('a12-old-woman', 'The Old Woman', 'The old woman who understood magic (The Snow Queen, third story)');
const sRoses = sp('a12-roses', 'The Roses', 'The buried rose bush (The Snow Queen, third story)');
const sBindweed = sp('a12-bindweed', 'The Bindweed', 'The convolvulus (The Snow Queen, third story)');
const sSnowdrop = sp('a12-snowdrop', 'The Snowdrop', 'The snowdrop (The Snow Queen, third story)');
const sButtercup = sp('a12-buttercup', 'The Buttercup', 'The buttercup (The Snow Queen, third story)');
const sNarcissus = sp('a12-narcissus', 'The Narcissus', 'The narcissus (The Snow Queen, third story)');
const sRaven = sp('a12-raven', 'The Raven', 'The crow of the fourth story (Danish Krage); "raven" on this page');
const sPalaceRaven = sp('a12-palace-raven', 'The Palace Raven', 'The crow’s tame sweetheart at the palace (The Snow Queen, fourth story)');
const sPrince = sp('a12-prince', 'The Prince', 'The prince (The Snow Queen, fourth story)');
const sPrincess = sp('a12-princess', 'The Princess', 'The clever princess (The Snow Queen, fourth story)');
const sRobber = sp('a12-robber-girl', 'The Robber Girl', 'The little robber maiden (The Snow Queen, fifth story)');
const sBae = sp('a12-bae', 'Bae', 'The reindeer Bæ (The Snow Queen, fifth to seventh stories; "Bac" in the old translation)');
const sPigeons = sp('a12-pigeons', 'The Wood Pigeons', 'The two wood pigeons (The Snow Queen, fifth story)');
const sSami = sp('a12-sami', 'The Sámi Woman', 'The "Lapland woman" of the sixth story; design and dress by the Sámi adviser');
const sFinnish = sp('a12-finnish', 'The Finnish Woman', 'The "Finland woman" (Danish Finnekonen) of the sixth story; design by the Sámi adviser');

const N = say('narrator');
const Y = say('you');
const GE = say('a12-gerda');
const KA = say('a12-kay');
const GR = say('a12-gran');
const QU = say('a12-queen');
const TR = say('a12-troll');
const OW = say('a12-old-woman');
const RO = say('a12-roses');
const BW = say('a12-bindweed');
const SD = say('a12-snowdrop');
const BC = say('a12-buttercup');
const NA = say('a12-narcissus');
const RA = say('a12-raven');
const PR = say('a12-palace-raven');
const PN = say('a12-prince');
const PS = say('a12-princess');
const RG = say('a12-robber-girl');
const BA = say('a12-bae');
const PI = say('a12-pigeons');
const SA = say('a12-sami');
const FI = say('a12-finnish');

// ------------------------------------------------------------------ shared pieces

/** A12-10, step 3: the robber girl unties Bae (both a12-nubbin paths, after their own openings). */
const A10_FREE: Line[] = [
  RG('Bae, I’m untying you. Run home to Lapland, use your legs, and carry this girl to the Snow Queen’s, where her friend is.'),
  RG('You heard her story. You were listening; she talks loud enough.'),
  N('Bae leaps for joy. The robber girl lifts Gerda onto his back, ties her on, and gives her a little cushion to sit on.'),
  RG('Here are your fur boots. It’ll be cold. I’m keeping the muff; it’s too pretty.'),
  RG('But you’re not freezing on my account. Have Mother’s big mittens. They come right up to your elbows.'),
  RG('Two loaves and a ham. And don’t cry. I hate it when people cry. Look happy.'),
  BA('Climb on behind her, lodger. You weigh less than a sack of salt, and I’ve carried worse.'),
  N('The robber girl coaxes the big dogs inside. Then she cuts Bae’s rope with her knife, and opens the door.'),
  RG('Run! And look after her!'),
];

const A10_FREE_CHOICES: Choice[] = [
  {
    id: 'wave',
    label: 'Wave goodbye to the robber girl.',
    then: [N('You wave. She doesn’t wave back, but she watches until you’re out of sight, which is nearly the same.')],
  },
  {
    id: 'nod',
    label: 'Nod to her, as one equal to another.',
    then: [N('You nod. She nods back, once, hard, like somebody shutting a box.')],
  },
];

/** A12-13, step 2: how you wait (base and both ember variants). */
const A13_WAIT_CHOICES: Choice[] = [
  {
    id: 'count',
    label: 'Count the berries again.',
    then: [N('Two hundred and twelve, or two hundred and eleven. Your Nubbin points at one you’ve missed.')],
  },
  {
    id: 'hum',
    label: 'Hum Gerda’s rose tune, under your breath.',
    then: [N('You hum it, not loud. Your Nubbin hums it back a beat behind, the way it did under the rose arch.')],
  },
  {
    id: 'sit',
    label: 'Just sit.',
    then: [N('You just sit, and it turns out you’re good at it. You didn’t use to be.')],
  },
];

/** A12-17, step 3: the robber girl's news (both a12-nubbin paths). */
const A17_NEWS: Line[] = [
  RG('So this is him. Hm. I wonder if he was worth running to the end of the world for.', 'think'),
  KA('I wonder that too.', 'sad'),
  GE('How are the prince and princess? And the ravens?'),
  RG('The prince and princess have gone abroad. The raven died. He was old.'),
  RG('His sweetheart wears a black thread round her leg now, and tells everybody about it.'),
];

const A17_CHOICES: Choice[] = [
  {
    id: 'sorry',
    label: 'Say you’re sorry about the raven.',
    then: [RG('Don’t be. He had a good post and all the scraps he wanted. Not many get that.', 'soft')],
  },
  {
    id: 'cap',
    label: 'Admire her red cap.',
    then: [RG('It’s a good cap. You can’t have it.', 'happy')],
  },
];

/** A12-18: the close of the complete scene (both a12-nubbin paths). */
const A18_END: Line[] = [
  N('The page settles under your hand, like a paper cut-out laid flat on a table.'),
  N('You’re back in the Grove, with Nova’s atlas on your knee. When you open it again, a rose petal slides out of the fold and lands on your boot.'),
  N('On the cottage windowsill stands a window box with a rose tree in it that wasn’t there this morning.'),
  N('Another stands on the lantern shed across the way, and between them somebody has laid a plank.'),
];

// =================================================================== THE MIRROR SHARD

export const ATLAS_A12: Quest[] = [
  // ---------------------------------------------------------------- A12-1
  {
    id: 'a12-01',
    code: 'A12-1',
    title: 'The Troll’s Mirror',
    source: `${SRC}, first story: the mirror and its pieces`,
    audience: 'all',
    trigger: { where: WHERE, when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.' },
    speakers: [sGran, sKay, sGerda, sTroll],
    steps: [
      {
        id: 'a12-01-s1',
        goal: 'Step into the cut-paper town and take the room under the eaves.',
        hint: 'Touch the page, then climb the attic stairs to Grandmother.',
        check: 'explore:a12-attic:stairs',
        scene: {
          id: 'a12-01-arrive',
          lines: [
            N('Nova’s atlas falls open at a page of cut paper: rooftops, chimneys, and two attic windows with a gutter between them.'),
            N('The paper is so fine it stirs when you breathe. Then it’s a steep wooden stair, and you’re on it, with a bag and your Nubbin.'),
            GR('There you are. The lodger. You’ll want the room under the eaves, and the bed by the chimney.'),
            GR('The other bed has opinions. Mind your head on the beam; everybody hits it, the first week.'),
            N('Grandmother is small and quick, with her spectacles pushed up into white hair.'),
            N('Across the gutter, in the window opposite, two faces appear: a boy and a girl, both trying to see you at once.'),
            KA('Is that the new lodger? Has it got a dog?'),
            GE('That’s not a dog, Kay. Look at its ears.'),
            N('Grandmother looks at your Nubbin over her spectacles.'),
            GR('And what’s this? It isn’t a cat. I’ve had cats.', 'think'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Tell her it’s a Nubbin.',
              then: [GR('A Nubbin. Well, it can have the end of the bed and the heel of the loaf, same as a cat.')],
            },
            {
              id: 'friend',
              label: 'Say it’s your friend, and it goes where you go.',
              then: [GR('Good. Things that go where you go are worth a bed.', 'soft')],
            },
            {
              id: 'bow',
              label: 'Let your Nubbin bow.',
              then: [
                N('Your Nubbin bows, nearly falls down the stairs, and is caught by Grandmother without her looking.'),
                GR('Manners. It can stay.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-01-arrive-done',
          lines: [
            GR('That’s Kay and Gerda. They live across the gutter, one each side, and they’re in here more than they’re out.'),
            GR('Evenings, there’s a story. You can hold the candle. Lodgers always hold the candle.'),
          ],
        },
      },
      {
        id: 'a12-01-s2',
        goal: 'Hold the candle for Grandmother’s shadow-show.',
        hint: 'Stand by the attic wall and keep the candle still.',
        check: 'place:a12-candle:attic-wall',
        scene: {
          id: 'a12-01-show',
          lines: [
            N('It’s late summer, and the light goes about nine. Kay and Gerda come across by the gutter boxes, the way they always do in summer.'),
            N('Grandmother sits with a sheet of black paper and a long pair of scissors, snipping without looking.'),
            GR('Candle a bit higher. There. Now the wall’s a stage, and you’re the sun. Don’t wobble; suns don’t.'),
            KA('Do the troll one. The troll one’s best.', 'happy'),
            GE('It’s frightening.'),
            KA('That’s why.'),
            GR('Right. Steady, all of you. This story starts badly and gets better, which is the best sort.'),
            N('A paper troll steps onto the wall, all knees and grin. He holds a mirror, cut so thin the candle shows through it.'),
            GR('He was a wicked troll, the worst there was, and he had made a mirror that was wrong in a particular way.'),
            GR('Anything good or lovely, held up to it, shrank to nearly nothing. Anything mean or ugly got bigger and worse.'),
            GR('A green meadow in that glass looked like boiled spinach. A kind thought showed up as a sneer.', 'think'),
            KA('I’d like to look in it.'),
            GE('I wouldn’t.', 'sad'),
          ],
        },
        done: {
          id: 'a12-01-show-done',
          lines: [
            N('Grandmother does the troll’s voice. It’s lower than you would expect, and very pleased with itself.'),
            TR('Ha! Look how small goodness goes! Look how big the rest of it gets! Isn’t it wonderful?', 'happy'),
          ],
        },
      },
      {
        id: 'a12-01-s3',
        goal: 'Watch the troll’s mirror break.',
        hint: 'Keep the candle steady to the end of the show.',
        check: 'watch:a12-shadow-show:mirror',
        scene: {
          id: 'a12-01-shards',
          lines: [
            GR('The troll kept a school, if you can believe it, and his pupils carried the mirror all round the world.'),
            GR('Soon there wasn’t a country or a person left that hadn’t been seen in it the wrong way round.'),
            GR('Then they thought they’d fly up to the sky with it, and make fun of the angels too.'),
            N('The paper mirror climbs the wall in little jerks. The higher it goes, the wider its painted grin spreads.'),
            GR('And it grinned so hard it shook, and shook, until it slipped right out of their hands.', 'shock'),
            N('Grandmother opens her fingers. A handful of paper snips falls through the candlelight like snow.'),
            GR('It broke into more pieces than there are people. Some no bigger than a grain of sand, and they blew everywhere.'),
            GR('Get one in your eye and everything looks wrong. Get one in your heart and it goes hard and cold, like a stone in a frosty field.'),
            KA('And then what?'),
            GR('Then you need somebody to come and fetch you.', 'soft'),
          ],
          choices: [
            {
              id: 'brush',
              label: 'Brush the paper snips off Gerda’s sleeve.',
              then: [N('You brush them off. Gerda checks her other sleeve herself, twice, and then Kay’s.')],
            },
            {
              id: 'catch',
              label: 'Catch a snip as it falls.',
              then: [N('You catch one on your palm, and it’s only paper. You look at it anyway, a little longer than you meant to.')],
            },
            {
              id: 'ask',
              label: 'Ask who comes to fetch you.',
              then: [GR('Whoever loves you most and is too stubborn to stop. That’s usually how it goes.')],
            },
          ],
        },
        done: {
          id: 'a12-01-shards-done',
          lines: [
            N('The troll laughs on the wall until his paper sides split. Grandmother blows out the candle.'),
            N('In the dark, the draught from the window lifts one snip that isn’t paper. It glints once, and is gone.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a12-01-complete',
      lines: [
        N('Later, in the room under the eaves, you lie in the bed by the chimney. The other bed creaks, as promised.'),
        N('From your window you can see the gutter, the two boxes across it, and two small rose trees still flowering in the dark.'),
        N('Your Nubbin curls up on your feet. Somewhere across the town a clock strikes, slow and sure.'),
        N('You fall asleep to the sound of rain beginning, very softly, on the roof.'),
      ],
    },
    rewards: [],
    sets: { 'a12-01': true },
    notes:
      'OPENING: the atlas page is cut paper, white on dark, and folds open into the attic as you step through (a slow ' +
      'unfold, two seconds). The whole page keeps a cut-paper look: flat figures, crisp edges, snow as paper snips. ' +
      'The shadow-show (a12-01-show, a12-01-shards) is played on the attic wall with Grandmother’s paper figures; the ' +
      'troll speaks in her voice (speaker a12-troll, voiced by the same actor as Grandmother, lower). The candle ' +
      'is a held prop: the check completes when the player has kept it in place to the end of the show. ' +
      'Lifted text: none. a12-01-show#6 is our own opening, and a12-01-shards#7 our own image for the frozen heart ' +
      '(Part M’s lines 1 and 2 are [unverified]). ' +
      'CINDER: if cinder is set, play A12_VARIANTS a12-01-ember-forgiven or a12-01-ember-remembered straight after ' +
      'a12-01-arrive-done. From then on your Nubbin carries a little lantern with the ember in it, on this page only. ' +
      'SIM: the ember is S19’s Cinder’s Ember decor, read-only. It is shown here, never moved from the Grove.',
  },

  // ---------------------------------------------------------------- A12-2
  {
    id: 'a12-02',
    code: 'A12-2',
    title: 'Two Windows',
    source: `${SRC}, second story: a little boy and a little girl`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-1') },
    requires: ['A12-1'],
    speakers: [sGerda, sKay, sGran],
    steps: [
      {
        id: 'a12-02-s1',
        goal: 'Water the roses in the gutter boxes.',
        hint: 'Climb out to the gutter with the watering can and do the top of the arch.',
        check: 'carry:a12-watering-can:gutter',
        scene: {
          id: 'a12-02-roses',
          lines: [
            N('In the morning you see it all properly: two attics with roofs that nearly touch, and a lead gutter running between them.'),
            N('Long ago the two families each put a box across the gutter. Now peas hang over the edges, and in each box grows a rose tree.'),
            N('The roses have climbed into an arch over the gutter. Under it are two little stools, and two children who think it’s the best room in town.'),
            GE('You’re tallest. You can do the top of the arch. Don’t drown the peas; they sulk.'),
            KA('Peas don’t sulk.'),
            GE('These ones do.'),
            KA('Gran says the roses are older than both of us put together. She says they’ll still be here when we’re old.'),
            N('Your Nubbin tries to help by sitting in the watering can.'),
          ],
          choices: [
            {
              id: 'top',
              label: 'Water the top of the arch, carefully.',
              then: [N('You water the high roses. A few drops roll off the petals onto Kay’s head, and he pretends not to notice, very badly.')],
            },
            {
              id: 'peas',
              label: 'Give the peas a bit extra, in case.',
              then: [GE('See? They’re cheering up already.', 'happy'), KA('They look exactly the same.')],
            },
            {
              id: 'nubbin',
              label: 'Lift your Nubbin out of the can first.',
              then: [N('Your Nubbin comes out of the can dripping and offended. Gerda dries it on her apron, and it forgives everybody.')],
            },
          ],
        },
        done: {
          id: 'a12-02-roses-done',
          lines: [
            GE('In winter we can’t climb across. We have to go down all our stairs and up all the others.'),
            KA('It takes years.'),
            GE('It takes two minutes.'),
          ],
        },
      },
      {
        id: 'a12-02-s2',
        goal: 'Warm a coin on the stove and melt a peephole in the frozen window.',
        hint: 'Hold a copper coin on the stove, then press it to the glass.',
        check: 'craft:a12-peephole:window',
        scene: {
          id: 'a12-02-frost',
          lines: [
            N('Winter comes, and the windows freeze over with ferns of ice. You can’t see across the gutter at all.'),
            N('Kay and Gerda have a trick for this. They warm copper coins on the stove and press them to the glass.'),
            N('Each coin melts a round peephole, as neat as a button. A bright eye looks through each one, across the snow.'),
            N('Downstairs, Grandmother is watching the snow come down past the window.'),
            GR('Look at the white bees swarming.', 'soft'),
            KA('Have they got a queen? Like real bees?'),
            GR('They have. She flies where the swarm is thickest. She’s the biggest of them, and she never stays on the ground for long.'),
            GR('Some nights she flies through the streets and looks in at the windows. That’s when the frost comes up in flowers.'),
            KA('Let her try. I’d put her on the hot stove, and she’d melt.', 'happy'),
          ],
          choices: [
            {
              id: 'rude',
              label: 'Tell Kay that’s no way to treat a guest.',
              then: [KA('She isn’t a guest. She’s weather.')],
            },
            {
              id: 'seen',
              label: 'Ask Grandmother if she’s ever seen her.',
              then: [GR('Once or twice. Through the glass. Not close, and that’s how I like it.', 'think')],
            },
            {
              id: 'peep',
              label: 'Look out of your own peephole.',
              then: [N('The flakes go past your peephole in their thousands. One of them seems, for a moment, to look back.')],
            },
          ],
        },
        done: {
          id: 'a12-02-frost-done',
          lines: [N('Grandmother smooths Kay’s hair and starts a story about a goose instead. She doesn’t mention the queen again.')],
        },
      },
      {
        id: 'a12-02-s3',
        goal: 'Look out of your window that night.',
        hint: 'Wait at your peephole after the house has gone to bed.',
        check: 'watch:a12-window:night',
        scene: {
          id: 'a12-02-night',
          lines: [
            N('That night you can’t sleep. Your Nubbin can’t either; it sits on the sill with its nose to your peephole.'),
            N('Across the gutter Kay is up too, half undressed, standing on a chair at his window.'),
            N('A few flakes drift down. One, bigger than the rest, settles on the edge of a flower box, and stays.'),
            N('It grows. It grows into a woman, tall and fine, dressed in white gauze made of a million starry flakes.'),
            N('She is lovely, and she is ice, all of her, dazzling and glittering. And she is alive.'),
            N('Her eyes are like two bright stars, but there is no rest in them at all.'),
            N('She looks in at Kay’s window. She nods to him, and lifts one hand, and beckons.'),
          ],
          choices: [
            {
              id: 'knock',
              label: 'Knock on your window.',
              then: [
                N('You knock hard on the glass. Kay jumps down off his chair, and the woman turns her head towards you, slowly.'),
                N('Then she isn’t there. Something large and white goes past the window, like a bird.'),
              ],
            },
            {
              id: 'call',
              label: 'Call Kay’s name.',
              then: [
                N('You call his name across the gutter. Kay startles and jumps down from his chair.'),
                N('When you look again there’s nobody on the box. Something white goes past, like a big bird in the dark.'),
              ],
            },
            {
              id: 'hold',
              label: 'Pull your Nubbin back from the glass.',
              then: [
                N('You lift your Nubbin away from the window. It’s cold right through, and it burrows into your shirt.'),
                N('Kay jumps down off his chair. When you look again a big white bird is passing, and the box is empty.'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-02-night-done',
          lines: [N('You sit up until morning. The frost on your window has grown into flowers you have never seen in any garden.')],
        },
      },
    ],
    complete: {
      id: 'a12-02-complete',
      lines: [
        KA('It was a dream. I dreamed a lady on the box. That’s all.'),
        GE('I dreamed you were standing on a chair.', 'think'),
        KA('Well, I wasn’t.'),
        N('Grandmother, cutting the bread, looks at Kay a moment longer than usual.'),
        N('Then the thaw comes, and the swallows, and the roses wake up in the gutter as if nothing at all has happened.'),
      ],
    },
    rewards: [],
    sets: { 'a12-02': true },
    notes:
      'Seasons turn inside the quest: late summer (s1), deep winter (s2, s3), then the thaw in the complete scene. ' +
      'The Snow Queen at the window (a12-02-night) has no lines: she nods and beckons only. Draw her as cut white ' +
      'paper with ice-light behind it; her eyes are two small bright stars. She must be beautiful and unsettling, ' +
      'never a monster. No design from any film. The peephole is a small craft: warm the coin at the stove (hold), ' +
      'press it to the frosted pane (tap).',
  },

  // ---------------------------------------------------------------- A12-3
  {
    id: 'a12-03',
    code: 'A12-3',
    title: 'The Splinter',
    source: `${SRC}, second story: the splinter in Kay’s eye and heart`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-2') },
    requires: ['A12-2'],
    speakers: [sKay, sGerda, sGran],
    steps: [
      {
        id: 'a12-03-s1',
        goal: 'Sit under the rose arch with Kay and Gerda.',
        hint: 'Climb out to the gutter and take the spare stool.',
        check: 'sit:a12-roses:gutter',
        scene: {
          id: 'a12-03-arch',
          lines: [
            N('It’s summer, and the roses have never been so good. Gerda has learned a hymn with roses in it, and sings it all day.'),
            N('She sings it to Kay under the arch, and he sings it back. Your Nubbin hums the tune a beat behind them both.'),
            N('They’re looking at a picture book of animals and birds. Kay is doing the noises, and the noises are terrible.'),
            KA('That’s an elk. It goes like this.'),
            GE('It does not.', 'happy'),
            N('Across the town, the church clock begins to strike five.'),
            KA('Ow!', 'shock'),
            KA('Something stung me. In my heart. And my eye, something’s gone in my eye.', 'sad'),
            N('In the low sun you see it: a glint, smaller than a grain of sand, there and gone.'),
          ],
          choices: [
            {
              id: 'eye',
              label: 'Look in Kay’s eye.',
              then: [N('You hold his eyelid gently and look, and there’s nothing there. You are almost sure there’s nothing there.')],
            },
            {
              id: 'hand',
              label: 'Hold Kay’s hand till it stops.',
              then: [N('You hold his hand, and it’s warm. After a moment it isn’t quite as warm, and you tell yourself it is.')],
            },
            {
              id: 'gran',
              label: 'Call Grandmother.',
              then: [
                N('Grandmother comes up, peers into his eye with her spectacles on, and finds nothing at all.'),
                GR('Blink. Again. There. Gone.'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-03-arch-done',
          lines: [KA('It’s gone. I think it’s gone.'), N('It hasn’t gone.')],
        },
      },
      {
        id: 'a12-03-s2',
        goal: 'Put the rose box straight after Kay kicks it.',
        hint: 'Lift the box back onto the gutter and press the earth round the roots.',
        check: 'place:a12-rose-box:gutter',
        scene: {
          id: 'a12-03-kick',
          lines: [
            GE('Kay? Are you all right?', 'sad'),
            KA('Why are you crying? It makes you look ugly.', 'angry'),
            KA('There’s nothing the matter with me. Ugh. That rose has a worm in it. And that one’s all crooked.'),
            KA('They’re ugly roses. They match the ugly boxes.'),
            N('He kicks the box. It skids along the gutter, and he snaps off two roses and drops them over the edge.'),
            N('You reach for him, and then you understand what you saw.'),
            N('You can’t take a splinter out of a heart. Not with your hands, and not with anything you own.', 'sad'),
            N('Kay goes in and slams his window. Gerda stands in the gutter with her picture book held against her chest.'),
            GE('He said it was a book for babies.', 'sad'),
          ],
          choices: [
            {
              id: 'roses',
              label: 'Fetch the two roses back for Gerda.',
              then: [N('You lean over the gutter’s edge and fish them back. Gerda puts them in a cup of water on her sill.')],
            },
            {
              id: 'knock',
              label: 'Knock on Kay’s window.',
              then: [
                N('You knock. Kay opens it, looks at you, and does a perfect, horrible impression of your face.'),
                N('Then he shuts it again.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Straighten the box together.',
              then: [N('You and Gerda lift the box back into place without a word. Your Nubbin pats the earth flat round the roots.')],
            },
          ],
        },
        done: {
          id: 'a12-03-kick-done',
          lines: [N('The rose tree has lost two flowers and a bit of bark. Roses forgive that sort of thing, if they’re left alone.')],
        },
      },
      {
        id: 'a12-03-s3',
        goal: 'Go out in the snow when Kay calls you to see his glass.',
        hint: 'Follow Gerda down to the street and look where Kay shows you.',
        check: 'watch:a12-kay:burning-glass',
        scene: {
          id: 'a12-03-glass',
          lines: [
            N('All that autumn Kay is clever and cruel. He puts on Grandmother’s spectacles and does her voice, and the whole street laughs.'),
            N('He can do anybody. He does Gerda best of all, and he only does the bits that hurt.'),
            GR('He’s a sharp lad. Too sharp, lately.', 'sad'),
            N('When the snow comes he runs out with a big burning-glass, and holds out the blue tail of his coat to catch the flakes.'),
            KA('Look in the glass, Gerda. Look how perfect they are.', 'happy'),
            N('Under the glass each flake is a star, sharp and exact, every arm the same as every other.'),
            KA('Much better than real flowers. Not a single thing wrong with them. If only they didn’t melt.'),
            GE('Real flowers smell of something.'),
            KA('That’s what’s wrong with them.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look in the glass.',
              then: [N('You look. The flake is beautiful and perfect, and you feel nothing at all looking at it, which frightens you.')],
            },
            {
              id: 'snowball',
              label: 'Throw a snowball at Kay.',
              then: [N('It gets him on the shoulder. For a second he almost laughs like he used to, and then he brushes it off and looks bored.')],
            },
            {
              id: 'gerda',
              label: 'Stand by Gerda.',
              then: [N('You stand next to Gerda, and neither of you says anything. Your Nubbin leans on her boot.')],
            },
          ],
        },
        done: {
          id: 'a12-03-glass-done',
          lines: [
            KA('I’m allowed in the big square tomorrow, with the boys who go sledging. Gran said.'),
            GE('Gran said maybe.', 'think'),
          ],
        },
      },
    ],
    complete: {
      id: 'a12-03-complete',
      lines: [
        N('That evening Gerda sits on her stool in the gutter, in the cold, under the bare arch.'),
        GE('He’s still in there. I know he is. It’s just that something’s got in front of him.', 'soft'),
        N('She looks at you as if you might know what to do. You don’t, and you don’t pretend you do.'),
        N('You sit down next to her instead, on Kay’s stool, and wait with her until Grandmother calls you both in.'),
      ],
    },
    rewards: [],
    sets: { 'a12-03': true },
    notes:
      'The splinter is a single glint on screen, never a wound. Kay’s cruelty is a child’s (mockery, a kicked box, ' +
      'snapped roses); keep his portrait cool rather than villainous. The rose hymn is heard as a hummed tune only, ' +
      'never sung in words (no lyrics): an original melody, simple enough to hum, reused in A12-13 and A12-16. ' +
      'Snowflakes under the burning-glass are drawn as six-armed crystals (true to life; the Learning Grove version ' +
      'can teach this).',
  },

  // ---------------------------------------------------------------- A12-4
  {
    id: 'a12-04',
    code: 'A12-4',
    title: 'The Big Sledge',
    source: `${SRC}, second story: the white sledge`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-3') },
    requires: ['A12-3'],
    speakers: [sKay, sGerda, sQueen],
    steps: [
      {
        id: 'a12-04-s1',
        goal: 'Follow Kay to the great square.',
        hint: 'Go down to the square and keep Kay in sight.',
        check: 'walk:a12-square:sledges',
        scene: {
          id: 'a12-04-square',
          lines: [
            N('Kay comes past with big gloves on and his sledge on his back.'),
            KA('I’m allowed in the big square. I’m going.'),
            GE('Go with him. Please. Just keep an eye on him. He won’t let me.', 'sad'),
            N('The square is full of noise. The boldest boys tie their sledges to farmers’ carts and get pulled a good way for nothing.'),
            N('Then a great sledge comes in, painted white. Somebody sits in it wrapped in a rough white fur, with a white cap on.'),
            N('It drives round the square. Every boy watches it, and the white driver watches only Kay.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout to Kay to stay put.',
              then: [KA('Mind your own business, lodger!', 'angry'), N('He doesn’t even look round. He’s watching the white sledge.')],
            },
            {
              id: 'cord',
              label: 'Push through to get hold of his cord.',
              then: [N('You push through the crowd towards him. There are too many boys and too many sledges, and the square is suddenly very wide.')],
            },
            {
              id: 'nubbin',
              label: 'Pick up your Nubbin. It’s gone very still.',
              then: [N('You pick it up. It’s staring at the white sledge, and it’s cold to the touch, the way it was at the window.')],
            },
          ],
        },
        done: {
          id: 'a12-04-square-done',
          lines: [N('Kay has his cord in his hands. He’s tying a careful knot, with his tongue between his teeth, the way he does sums.')],
        },
      },
      {
        id: 'a12-04-s2',
        goal: 'Run after the white sledge.',
        hint: 'Run! Keep after it through the town gate.',
        check: 'race:a12-sledge:town-gate',
        scene: {
          id: 'a12-04-chase',
          lines: [
            N('As the white sledge comes round again, Kay ties his little sledge to it, and off he goes.'),
            N('Faster, into the next street, and faster. The driver turns and nods to Kay, kindly, as if they’ve known each other for years.'),
            N('Every time Kay reaches to untie the cord, the driver nods again. Every time, Kay sits still.'),
            N('You run. Your Nubbin runs ahead of you, and then you scoop it up and run faster.'),
            N('The sledges go out through the town gate. The snow comes down so thick that you can’t see your own hand.'),
            KA('Stop! Stop! I want to get off!', 'shock'),
            N('He tries to say his prayers, and all that comes is his times tables.'),
            N('You lose them. Then the snow parts for a moment, and you see them from a rise: the sledge has stopped.'),
          ],
        },
        done: {
          id: 'a12-04-chase-done',
          lines: [
            N('The driver stands up. The fur and the cap are all snow, and the driver is a lady, tall and slender and glittering white.'),
            N('It’s the woman from the window. It’s the Snow Queen.'),
          ],
        },
      },
      {
        id: 'a12-04-s3',
        goal: 'Watch from the rise.',
        hint: 'Stay on the rise. You can’t reach them from here.',
        check: 'watch:a12-queen:rise',
        scene: {
          id: 'a12-04-kiss',
          lines: [
            QU('We’ve come a long way. But you’re shivering. Creep in under my bearskin.'),
            N('She sits Kay beside her and wraps the fur round him. He looks as if he’s sinking into a snowdrift.'),
            QU('Are you still cold?'),
            N('She kisses his forehead. It’s colder than ice, and it goes straight to his heart, which is nearly ice already.'),
            N('For a moment he looks as if it will be the end of him. Then he looks perfectly well, and he doesn’t feel the cold at all.'),
            KA('My sledge! Don’t forget my sledge.'),
            N('It’s tied to one of the white hens that fly behind her. She kisses his forehead once more, and you watch him forget.'),
            N('Gerda, Grandmother, the roses, the attic: you see them go out of his face like lamps going out down a street.', 'sad'),
            N('Then the sledge rises over the forest. The wolves howl, and the moon comes out huge and white.'),
          ],
          choices: [
            {
              id: 'call',
              label: 'Call his name, as loud as you can.',
              then: [N('You shout his name. The wind takes it the other way, back towards the town, as if it means to deliver it to Gerda.')],
            },
            {
              id: 'watch',
              label: 'Stand and watch until they’re gone.',
              then: [N('You watch until the sledge is a speck, and then a star, and then nothing.')],
            },
          ],
        },
        done: {
          id: 'a12-04-kiss-done',
          lines: [N('You walk back in the dark. The town gate is still open, and nobody has noticed anything at all.')],
        },
      },
    ],
    complete: {
      id: 'a12-04-complete',
      lines: [
        N('Gerda is waiting at the top of the stairs. You tell her everything: the white sledge, the lady, the cord.'),
        GE('Then he isn’t lost. He’s been taken. That’s different.', 'think'),
        N('By the end of the week the town says Kay fell in the river by the school. People are very sure about it.'),
        GE('He didn’t. He hates getting wet. He’d never go near it.'),
        N('Grandmother cries quietly for a long winter. Gerda doesn’t, which is worse.'),
      ],
    },
    rewards: [],
    sets: { 'a12-04': true },
    notes:
      'KEPT STONE: if keptStone is set, play A12_VARIANTS a12-04-kept straight after a12-04-square-done (the white ' +
      'sledge stops beside you on its way round; choice: refuse, or say nothing and step back; either way she drives on). ' +
      'Then a12-04-chase plays as written. No kiss is ever offered to the player, and the Snow Queen never names the ' +
      'stone. The two kisses on Kay are forehead kisses, cold light only, as Andersen has them; Andersen’s warning ' +
      '“no more kisses” is cut. Kay’s little sledge flies behind on a white hen (a cut-paper bird). The race check ' +
      'cannot be lost: you always lose sight of them at the gate, and the step completes at the rise.',
  },

  // ---------------------------------------------------------------- A12-5
  {
    id: 'a12-05',
    code: 'A12-5',
    title: 'The Red Shoes',
    source: `${SRC}, third story: the red shoes and the boat`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-4') },
    requires: ['A12-4'],
    speakers: [sGerda],
    steps: [
      {
        id: 'a12-05-s1',
        goal: 'Sit with Gerda through the long winter.',
        hint: 'Find Gerda on her stool by the gutter.',
        check: 'sit:a12-gerda:gutter',
        scene: {
          id: 'a12-05-winter',
          lines: [
            N('It’s a long, dark winter. Everybody in the town has stopped saying Kay’s name, except Gerda.'),
            GE('They say he’s dead. They say it to Gran in the shop, as if that’s helping.'),
            N('Then spring comes. The sun comes out over the roofs, warm on the gutter for the first time since the sledges.'),
            GE('Kay is dead and gone.', 'sad'),
            N('The sunshine doesn’t believe it. Neither do the swallows, who come back and sit on the gutter and say so, in swallow.'),
            GE('I don’t believe it either.', 'soft'),
          ],
          choices: [
            {
              id: 'agree',
              label: '“Nor do I.”',
              then: [Y('Nor do I.'), GE('Good. That’s three of us, and the swallows.')],
            },
            {
              id: 'north',
              label: 'Remind her what you saw: the sledge went north.',
              then: [GE('North. Then I’ll go north. I’ll start by asking the river, in case.', 'think')],
            },
            {
              id: 'sit',
              label: 'Sit with her and say nothing.',
              then: [N('You sit together a long time. A swallow lands on the box between you and looks from one of you to the other.')],
            },
          ],
        },
        done: {
          id: 'a12-05-winter-done',
          lines: [GE('I’m going to give the river my red shoes. Kay never saw them. They’re the best thing I’ve got.')],
        },
      },
      {
        id: 'a12-05-s2',
        goal: 'Go down to the river with Gerda at dawn.',
        hint: 'Walk with Gerda out of the town to where the boats lie in the rushes.',
        check: 'escort:a12-gerda:river',
        scene: {
          id: 'a12-05-river',
          lines: [
            N('Early in the morning Gerda puts on her new red shoes. She kisses Grandmother, who is still asleep, and goes out.'),
            N('You go with her, out of the gate and down to the river, with your Nubbin under your arm.'),
            GE('River? Is it true you took my friend? I’ll give you my red shoes if you give him back.'),
            N('The little waves nod at her, oddly, as if they understand.'),
            N('She takes off the shoes and throws them in. They don’t go far, and the waves carry them straight back to her feet.'),
            GE('I didn’t throw them far enough. The river can’t take them unless they go right out in the middle.'),
            N('There’s a boat among the rushes. Before you can say anything she climbs in and goes to the far end.'),
          ],
          choices: [
            {
              id: 'wait',
              label: 'Stay on the bank. It’s her offering.',
              then: [N('You stay on the bank. It’s hers to give, and she gives it.')],
            },
            {
              id: 'warn',
              label: 'Tell her to be careful.',
              then: [GE('I am being careful. I’m being careful and quick.', 'think')],
            },
          ],
        },
        done: {
          id: 'a12-05-river-done',
          lines: [
            N('She throws the shoes from the end of the boat. The boat isn’t tied, and it slides out of the rushes, and keeps going.'),
            GE('Oh!', 'shock'),
          ],
        },
      },
      {
        id: 'a12-05-s3',
        goal: 'Jump into the boat after Gerda.',
        hint: 'Take a run along the bank and jump!',
        check: 'climb:a12-boat:rushes',
        scene: {
          id: 'a12-05-boat',
          lines: [
            N('The boat is a yard out already, and gliding. Gerda scrambles to the near end, but there’s only water between her and the bank.'),
            N('Your Nubbin jumps first. You don’t think about it at all; you jump after it.'),
            N('You land in the bottom of the boat in a heap. Gerda grabs your coat with both hands, and doesn’t let go for a while.'),
            GE('You came. You didn’t have to come.', 'soft'),
            N('The sparrows fly along the bank beside you, as if to say they’d have come too, if they were bigger.'),
            N('The red shoes float along behind the boat. They can’t catch up, and the boat can’t stop.'),
            GE('Maybe the river’s taking me to Kay. Maybe that’s its answer.', 'think'),
          ],
          choices: [
            {
              id: 'oar',
              label: 'Look for an oar.',
              then: [N('There’s no oar: only a bailing can, a bit of rope and a very old apple. Your Nubbin eats the apple.')],
            },
            {
              id: 'shoes',
              label: 'Reach for the red shoes.',
              then: [N('You stretch over the side. Your fingers brush one shoe, and then the current takes it, as if the river has said yes.')],
            },
            {
              id: 'sit',
              label: 'Sit back and let it take you.',
              then: [N('You sit back. Gerda sits beside you in her stockings, and watches the banks go by.')],
            },
          ],
        },
        done: {
          id: 'a12-05-boat-done',
          lines: [N('The banks are lovely: flowers, old trees, sheep and cows on the slopes. There isn’t a single person anywhere.')],
        },
      },
    ],
    complete: {
      id: 'a12-05-complete',
      lines: [
        N('All day the boat goes downstream. Gerda sings a little, to keep her spirits up, and your Nubbin hums along.'),
        N('Then you come to a cherry orchard, and a little house with odd red and blue windows and a thatched roof.'),
        N('Outside stand two wooden soldiers, presenting arms as the boat goes by.'),
        GE('Hello! Hello! Can you help us?'),
        N('The soldiers don’t answer, being wooden. But somebody else does.'),
      ],
    },
    rewards: [],
    sets: { 'a12-05': true },
    notes:
      'The boat is never in danger: a calm river, a sunny day, the banks always close. Your jump always lands. The ' +
      'sparrows and swallows are birds only; the line “say so, in swallow” is narration, not speech. Gerda is in her ' +
      'stockings from here until the palace gives her boots (A12-8). The wooden soldiers are painted toys.',
  },

  // ---------------------------------------------------------------- A12-6
  {
    id: 'a12-06',
    code: 'A12-6',
    title: 'The Garden That Forgets',
    source: `${SRC}, third story: the flower garden of the woman who understood magic`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-5') },
    requires: ['A12-5'],
    speakers: [sGerda, sOldWoman, sRoses, sBindweed, sSnowdrop, sButtercup, sNarcissus],
    steps: [
      {
        id: 'a12-06-s1',
        goal: 'Meet the old woman of the cherry house.',
        hint: 'Let her pull the boat in with her stick, then go inside.',
        check: 'talk:a12-old-woman:cherry-house',
        scene: {
          id: 'a12-06-cherries',
          lines: [
            N('A very old woman comes out of the house, leaning on a crooked stick. She wears a big sun hat painted with lovely flowers.'),
            OW('You poor little thing. However did you get out on this big wide river?', 'soft'),
            N('She hooks the boat with her stick and draws it in to the bank. She’s strong, for somebody so old.'),
            N('She takes you both inside and gives you cherries, as many as you like. Gerda tells her everything.'),
            OW('Kay? Hm. He hasn’t come by. He will, I expect. Don’t be sad. Eat your cherries.'),
            N('While Gerda eats, the old woman combs her hair with a golden comb. With every stroke Gerda looks a little less worried.'),
            N('The old woman isn’t wicked. She knows a little magic, for her own amusement, and she has always wanted a little girl.'),
            N('You feel drowsy too, and the cherries are very good. It’s hard to remember what you were in such a hurry about.'),
          ],
          choices: [
            {
              id: 'eat',
              label: 'Have another cherry.',
              then: [N('You have another. It’s the best cherry you’ve ever eaten, and you can’t remember the second best.')],
            },
            {
              id: 'ask',
              label: 'Ask her the way north.',
              then: [
                OW('North? Nobody goes north from here. Have a cherry.', 'happy'),
                N('You have a cherry. You forget the question halfway through it.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Give a cherry to your Nubbin.',
              then: [N('Your Nubbin takes the cherry and doesn’t eat it. It tucks it in your pocket, for later, and keeps one eye on the comb.')],
            },
          ],
        },
        done: {
          id: 'a12-06-cherries-done',
          lines: [
            N('While you doze by the stove, the old woman goes out into the garden. She points her stick at every rose bush in turn.'),
            N('One by one they sink into the black earth, and the earth closes over them as if they had never been.'),
          ],
        },
      },
      {
        id: 'a12-06-s2',
        goal: 'Spend the summer in the old woman’s garden.',
        hint: 'Explore the flower beds, and follow your Nubbin.',
        check: 'explore:a12-garden:beds',
        scene: {
          id: 'a12-06-garden',
          lines: [
            N('The garden has every flower you can think of, from every season, all in bloom at once. It never seems to change.'),
            N('Gerda plays there all day, and sleeps in a bed with silk pillows stuffed with violets. She has stopped asking about Kay.'),
            N('You can’t remember what day it is. You can’t remember if there have been days.'),
            N('Your Nubbin keeps going back to one bare patch of earth by the wall, and digging, and looking at you.'),
            N('One afternoon the old woman sits in the sun with her painted hat beside her on the bench.'),
            N('Gerda looks at the hat. The best flower painted on it is a rose; the old woman forgot to wipe it off.'),
            GE('Roses. Where are the roses? There aren’t any roses here.', 'shock'),
            N('She runs from bed to bed, searching and searching. There isn’t one, anywhere.'),
          ],
          choices: [
            {
              id: 'patch',
              label: 'Show her where your Nubbin has been digging.',
              then: [N('You take her to the bare patch. Your Nubbin sits beside it, very upright, as if it has waited all summer to be asked.')],
            },
            {
              id: 'search',
              label: 'Search with her.',
              then: [N('You search the whole garden with her, bed by bed. At the end, by the wall, your Nubbin is sitting on a bare patch.')],
            },
          ],
        },
        done: {
          id: 'a12-06-garden-done',
          lines: [
            N('Gerda sits down by the bare patch and cries. Her warm tears fall on the earth, right where a rose bush sank.'),
            N('The bush comes up all at once, in full flower, as fresh as the day it went down.'),
          ],
        },
      },
      {
        id: 'a12-06-s3',
        goal: 'Ask the flowers if they know where Kay is.',
        hint: 'Talk to the roses, then to the other flowers in turn.',
        check: 'talk:a12-flowers:beds',
        scene: {
          id: 'a12-06-flowers',
          lines: [
            GE('Oh, I’ve been so long! I was going to find Kay! Do you know where he is? Is he dead?'),
            RO('He isn’t dead. We’ve been down in the earth all this time, and he wasn’t there.', 'soft'),
            GE('Thank you. Oh, thank you!', 'happy'),
            N('Then Gerda goes to the other flowers, one after another, and asks each of them about Kay.'),
            N('Every flower is dreaming its own story in the sun. Not one of them knows a thing about Kay.'),
            BW('There’s a castle with a balcony, and a girl leaning on it, waiting for someone. That is my story.'),
            GE('Is it Kay she’s waiting for?'),
            BW('It’s my story. It isn’t about anybody else.'),
          ],
          choices: [
            {
              id: 'snowdrop',
              label: 'Ask the snowdrop.',
              then: [
                SD('Two girls on a swing between two trees, blowing soap bubbles. Every bubble is a whole world. Then it bursts.'),
                GE('That’s a lovely story. It isn’t any help at all.'),
              ],
            },
            {
              id: 'buttercup',
              label: 'Ask the buttercup.',
              then: [
                BC('An old granny in a sunny yard, and her granddaughter comes home to see her. That’s all. It’s enough.', 'soft'),
                GE('Poor Gran. She’s at home without either of us.', 'sad'),
              ],
            },
            {
              id: 'narcissus',
              label: 'Ask the narcissus.',
              then: [
                NA('I can see myself! I can see myself! Oh, how lovely I smell.', 'happy'),
                GE('That isn’t about Kay. That isn’t about anybody.'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-06-flowers-done',
          lines: [GE('It’s no good. They only know their own stories.'), GE('I have to go. I’ve stayed far too long already.')],
        },
      },
    ],
    complete: {
      id: 'a12-06-complete',
      lines: [
        N('Gerda runs to the end of the garden. The gate is shut, the latch is rusty, and it won’t give.'),
        N('You put your shoulder to it with her, and your Nubbin pushes too, and the gate creaks open.'),
        N('Outside, it’s late autumn. The leaves are yellow and falling, and the mist is cold and wet.'),
        GE('How long have I been? In there it was always summer.', 'sad'),
        N('Nobody comes after you. You look back once, and the garden is still in summer, as if nothing ever happens there.'),
        N('Gerda’s feet are bare and sore. She keeps walking anyway, and you keep walking with her.'),
      ],
    },
    rewards: [],
    sets: { 'a12-06': true },
    notes:
      'The old woman is kind and lonely, never a witch: her magic is the comb, the stick and the endless summer, and ' +
      'it is gentle. The forgetting shows as a soft haze over the screen and the journal goal fading a little, not ' +
      'as a fail state. The flowers speak (they are Andersen’s); each tells its own dream. Andersen’s tiger-lily (a ' +
      'funeral pyre) and hyacinths (three dead sisters) are left out for an all-ages page. Bindweed is the plain ' +
      'name for Andersen’s convolvulus. The roses’ line keeps Andersen’s idea that they were under the earth and Kay ' +
      'was not there, said softly.',
  },

  // ---------------------------------------------------------------- A12-7
  {
    id: 'a12-07',
    code: 'A12-7',
    title: 'The Raven',
    source: `${SRC}, fourth story: the prince and princess`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-6') },
    requires: ['A12-6'],
    speakers: [sGerda, sRaven, sPalaceRaven],
    steps: [
      {
        id: 'a12-07-s1',
        goal: 'Meet the raven in the snow.',
        hint: 'Rest by the hedge where the big black bird is hopping.',
        check: 'talk:a12-raven:hedge',
        scene: {
          id: 'a12-07-hedge',
          lines: [
            N('Winter comes on fast. You stop to rest by a hedge, and a big black raven hops across the snow towards you.'),
            RA('Caw! Good day. Good day! And where are you two going, out in the wide world all on your own?'),
            N('Gerda tells him the whole story, and asks if he has seen Kay. The raven nods, very seriously.'),
            RA('It might be. It might be!', 'think'),
            GE('Really? Is he alive?'),
            RA('Gently, gently. I think it may be Kay. But I think he’s forgotten you, for the princess.'),
            RA('In this kingdom there lives a princess who is tremendously clever. She’s read every newspaper in the world.', 'happy'),
            RA('And forgotten them all again. That’s how clever she is.'),
          ],
          choices: [
            {
              id: 'polite',
              label: 'Ask him, politely, to go on.',
              then: [RA('Politely! There’s a rare thing. I shall go on at once.', 'happy')],
            },
            {
              id: 'how',
              label: 'Ask how a raven knows all this.',
              then: [RA('I have a sweetheart at the palace. She’s tame. She tells me everything, and I tell everybody.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin say hello.',
              then: [N('Your Nubbin bows to the raven. The raven bows back, lower, so as not to be outdone.')],
            },
          ],
        },
        done: {
          id: 'a12-07-hedge-done',
          lines: [RA('She wanted to marry. But she wanted a husband who could answer when he was spoken to, not one who just stood about looking grand.')],
        },
      },
      {
        id: 'a12-07-s2',
        goal: 'Hear about the boy with the creaking boots.',
        hint: 'Sit by the hedge and let the raven tell it.',
        check: 'sit:a12-raven:hedge',
        scene: {
          id: 'a12-07-boots',
          lines: [
            RA('So they put it in the papers. Any good-looking young man could come and talk to her, and the best talker would marry her.'),
            RA('Such crowds! They talked well enough in the street. Then they saw the guards in silver, and the footmen in gold on the stairs.'),
            RA('And they went dumb. All they could do was say back the last word she’d said. She didn’t care to hear it twice.', 'happy'),
            RA('On the third day along came a little fellow, no horse, no carriage, marching straight up to the palace.'),
            RA('His eyes shone like yours. He had lovely long hair, and very shabby clothes.'),
            GE('That was Kay! Oh, I’ve found him!', 'happy'),
            RA('He had a little knapsack on his back.'),
            GE('No, that was his sledge. He had his sledge with him.'),
            RA('Very likely. I didn’t look closely. But his boots creaked terribly, all over the hall, and he wasn’t the least bit afraid.'),
            RA('He said he hadn’t come to woo her, only to hear how clever she was. And he liked her, and she liked him.'),
          ],
          choices: [
            {
              id: 'believe',
              label: 'It must be Kay.',
              then: [GE('It must be. He was always clever. He could do sums in his head, even fractions.', 'happy')],
            },
            {
              id: 'doubt',
              label: 'Plenty of boys have long hair and creaky boots.',
              then: [
                GE('Not plenty. Not like Kay’s.'),
                RA('She has a point. I’ve never met another pair that creaked like that.'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-07-boots-done',
          lines: [GE('Please, can you get us in? I have to see him.'), RA('I’ll speak to my sweetheart. Wait here.')],
        },
      },
      {
        id: 'a12-07-s3',
        goal: 'Wait by the palace garden after dark.',
        hint: 'Wait in the avenue until the palace lights go out.',
        check: 'wait:a12-palace:avenue',
        scene: {
          id: 'a12-07-avenue',
          lines: [
            N('At dusk the raven comes back with a little bread roll from the palace kitchen, and gives it to Gerda.'),
            RA('My sweetheart sends her regards. You can’t go in by the front, of course. Guards in silver. Footmen in gold.'),
            RA('But don’t cry. My sweetheart knows a little back staircase up to the bedroom, and she knows where the key is kept.'),
            N('You go into the palace garden, along the great avenue. The leaves are falling, one at a time.'),
            N('In the palace the lights go out one by one. The raven leads you to a back door, standing just ajar.'),
            N('Gerda’s heart is beating so hard you can hear it. Your own isn’t much quieter.'),
          ],
          choices: [
            {
              id: 'first',
              label: 'Go in first.',
              then: [N('You go in first, just in case. The back stairs smell of soap and toast.')],
            },
            {
              id: 'hand',
              label: 'Take Gerda’s hand.',
              then: [N('You take her hand. It’s shaking, and then it isn’t.')],
            },
          ],
        },
        done: {
          id: 'a12-07-avenue-done',
          lines: [
            N('At the top of the stairs a little lamp burns on a cupboard. Beside it stands the tame raven, turning her head this way and that.'),
            PR('My intended has told me so much about you, little miss.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a12-07-complete',
      lines: [
        PR('Your story is very touching. Take the lamp, would you, and I’ll lead the way.'),
        N('Things rush past you on the walls: shadows of horses with flying manes, of huntsmen, of ladies riding.'),
        PR('Only dreams. They come to fetch the gentlefolk’s thoughts out hunting. All the better: you can look at them asleep.'),
        N('Your Nubbin ducks under a dream horse, just in case.'),
      ],
    },
    rewards: [],
    sets: { 'a12-07': true },
    notes:
      'Andersen’s Danish has a crow (Krage); Part M calls him the raven, so the page does. Both birds talk (Andersen’s), ' +
      'with the comedy of court manners: the forest raven grand and gossipy, his sweetheart prim. The princess’s ' +
      'newspaper joke is Andersen’s idea, told in our words. The dreams on the walls are cut-paper shadows racing past.',
  },

  // ---------------------------------------------------------------- A12-8
  {
    id: 'a12-08',
    code: 'A12-8',
    title: 'Not Kay',
    source: `${SRC}, fourth story: the prince and princess`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-7') },
    requires: ['A12-7'],
    speakers: [sGerda, sPalaceRaven, sRaven, sPrince, sPrincess],
    steps: [
      {
        id: 'a12-08-s1',
        goal: 'Climb the back stairs through the palace halls.',
        hint: 'Follow the tame raven, and keep the lamp low.',
        check: 'climb:a12-back-stairs:palace',
        scene: {
          id: 'a12-08-halls',
          lines: [
            N('You go from hall to hall, each grander than the last. The walls are rose-coloured satin, with silk flowers sewn on.'),
            N('The dreams keep rushing past, so fast that you can’t make out whose they are.'),
            PR('Wipe your feet. Not you, the little one. Well, all of you.'),
            N('Then the bedroom. The ceiling is a great palm tree with leaves of glass, and from it hang two beds, each like a lily.'),
            N('One bed is white, and the princess is asleep in it. The other bed is red.'),
            GE('Kay will be in the red one.', 'soft'),
          ],
          choices: [
            {
              id: 'lamp',
              label: 'Hold the lamp up for her.',
              then: [N('You hold the lamp up. It shakes a little in your hand, and you make it stop.')],
            },
            {
              id: 'door',
              label: 'Stay back by the door with the raven.',
              then: [N('You stay by the door, because this bit is Gerda’s. The tame raven approves of your manners.')],
            },
          ],
        },
        done: { id: 'a12-08-halls-done', lines: [N('Gerda tiptoes to the red bed.')] },
      },
      {
        id: 'a12-08-s2',
        goal: 'Wait while Gerda looks in the red bed.',
        hint: 'Keep the light steady while she bends back a red petal.',
        check: 'inspect:a12-red-bed:chamber',
        scene: {
          id: 'a12-08-redbed',
          lines: [
            N('Gerda bends back one of the red petals. Underneath is a brown neck, and dark hair on the pillow.'),
            GE('Kay!', 'happy'),
            N('She says his name aloud and holds the lamp close. The dreams come galloping back into the room.'),
            N('He wakes up. He turns his head.'),
            N('It isn’t Kay.'),
            N('The prince has a neck like Kay’s, and that is all.'),
            N('He’s young and handsome and very surprised, and he isn’t Kay at all.'),
            N('The princess peeps out of her white lily and asks what in the world is going on.'),
            N('Gerda cries, and tells them the whole story, and everything the ravens have done for her.', 'sad'),
          ],
          choices: [
            {
              id: 'fault',
              label: 'Say it’s all your fault, really.',
              then: [PS('Is it? It doesn’t sound like it. It sounds like the ravens’ fault, and quite a nice fault.')],
            },
            {
              id: 'ravens',
              label: 'Put in a word for the ravens.',
              then: [N('You tell them the ravens only meant to help. The tame raven, in the doorway, fluffs up with pride.')],
            },
            {
              id: 'quiet',
              label: 'Hold the lamp and let Gerda tell it.',
              then: [N('You hold the lamp and say nothing. Gerda tells it well, all of it, right from the troll’s mirror.')],
            },
          ],
        },
        done: {
          id: 'a12-08-redbed-done',
          lines: [PN('You poor child. You poor little thing.', 'soft'), PS('Nobody’s angry. Though the ravens mustn’t make a habit of it.')],
        },
      },
      {
        id: 'a12-08-s3',
        goal: 'See what the prince and princess give Gerda.',
        hint: 'In the morning, help Gerda ask for what she needs.',
        check: 'collect:a12-gifts:palace',
        scene: {
          id: 'a12-08-gifts',
          lines: [
            PS('Ravens, would you like to fly away free? Or have a post at court, with all the kitchen scraps you can eat?'),
            N('Both ravens bow, and ask for the post. They are thinking of their old age.'),
            RA('A bird must think ahead.', 'think'),
            N('The prince gets out of his bed and lets Gerda sleep in it. She folds her hands and thinks how kind people and animals are.'),
            N('In the morning she is dressed in silk and velvet from head to foot, and asked to stay at the palace and be happy.'),
            GE('Thank you. But please, could I have a little carriage and a horse, and some boots? I have to find Kay.'),
            PN('Boots. And a muff, for the cold. And not a little carriage. A proper one.'),
          ],
          choices: [
            {
              id: 'muff',
              label: 'Put your Nubbin in the muff.',
              then: [
                N('Your Nubbin climbs into the muff and turns round twice. Gerda puts her hands in after it.'),
                GE('Oh, it’s warm! It’s like holding a little stove.', 'happy'),
              ],
            },
            {
              id: 'boots',
              label: 'Check that the boots fit.',
              then: [N('You kneel and press the toes: room to grow, room for socks. While you’re busy, your Nubbin climbs into the muff.')],
            },
          ],
        },
        done: {
          id: 'a12-08-gifts-done',
          lines: [N('The coach is pure gold. The prince’s and princess’s arms shine on the door like a star.')],
        },
      },
    ],
    complete: {
      id: 'a12-08-complete',
      lines: [
        N('The coach is lined with sugar plums, and there’s fruit and gingerbread on the seat. Footmen ride behind in golden crowns.'),
        N('The raven rides along for the first few miles, sitting beside Gerda, because he can’t ride backwards.'),
        N('His sweetheart stays in the palace doorway, flapping. She has had a headache since her promotion, from eating too much.'),
        GE('Goodbye! Goodbye!', 'happy'),
        N('The raven flies up into a tree, and flaps his black wings for as long as he can see the coach shining.'),
        N('Gerda keeps her hands in the muff the whole way, and your Nubbin keeps them warm.'),
      ],
    },
    rewards: [],
    sets: { 'a12-08': true },
    notes:
      'From the complete scene until A12-10 your Nubbin rides in Gerda’s muff (both choices end there). The muff is ' +
      'white fur, cut paper with a soft edge. Gerda gets boots here (Part M’s Q8 says boots, as Andersen does). The ' +
      'prince’s surprise is played for gentle comedy, never embarrassment; he and the princess are kind from their ' +
      'first line.',
  },

  // ---------------------------------------------------------------- A12-9
  {
    id: 'a12-09',
    code: 'A12-9',
    title: 'The Robber Girl',
    source: `${SRC}, fifth story: the little robber girl`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-8') },
    requires: ['A12-8'],
    speakers: [sGerda, sRobber, sBae],
    steps: [
      {
        id: 'a12-09-s1',
        goal: 'Ride the golden coach through the dark forest.',
        hint: 'Keep your head down when the coach stops.',
        check: 'watch:a12-coach:dark-forest',
        scene: {
          id: 'a12-09-forest',
          lines: [
            N('The road goes into a dark forest. The golden coach shines among the trees like a torch, and it shines too far.'),
            N('Robbers come out of the dark, shouting “Gold! It’s gold!”, and grab the horses.'),
            N('The coachman and the footmen jump down and run for the trees, crowns and all. Nobody stops them; nobody wants footmen.'),
            N('An old robber woman with a bristly chin pulls the door open and peers in. Then a girl shoves her out of the way.'),
            RG('She’s mine. She can play with me. She can give me her muff and her pretty dress, and sleep in my bed.'),
            N('The robber girl is Gerda’s size, broader in the shoulders, with black eyes that look almost sad.'),
            RG('Nobody touches her while I like her. Are you a princess?'),
            GE('No.'),
            N('Gerda tells her everything, there in the dark coach. The robber girl pushes her hands into the muff to warm them.'),
            RG('What’s this? It’s alive. It’s warm. Oh.', 'shock'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell her it’s your Nubbin.',
              then: [RG('A Nubbin. Never heard of one. I like it.')],
            },
            {
              id: 'gerda',
              label: 'Let Gerda explain.',
              then: [GE('It’s the lodger’s. It’s kept my hands warm all the way from the palace.'), RG('Has it, now.', 'think')],
            },
          ],
        },
        done: {
          id: 'a12-09-forest-done',
          lines: [N('The robber girl keeps one hand in the muff the whole way, and won’t take it out.')],
        },
      },
      {
        id: 'a12-09-s2',
        goal: 'Go into the robbers’ castle.',
        hint: 'Follow the robber girl in, past the dogs.',
        check: 'escort:a12-gerda:robber-castle',
        scene: {
          id: 'a12-09-castle',
          lines: [
            N('The coach stops in the yard of a robbers’ castle, cracked from top to bottom. Ravens and crows fly out of every hole.'),
            N('Huge dogs leap up at you. They don’t bark; they aren’t allowed.'),
            N('In the great hall a fire burns on the stone floor. Soup bubbles in a big pot, and the smoke goes where it likes.'),
            RG('You’ll sleep with me and all my animals tonight.'),
            N('In her corner there’s straw and old rugs. Above it, on rails and perches, sit about a hundred pigeons, asleep.'),
            RG('All mine. Those two are wood pigeons; they’d fly off if they weren’t tied. And here’s my dear old Bae.'),
            N('She tugs a reindeer forward by his antler. He has a bright copper ring round his neck, tied to the wall.'),
            RG('He’d run off too, if he could. Everybody would. That’s why you tie things.'),
            N('She pulls a long knife out of a crack in the wall and waves it about, mostly at the ceiling.'),
            GE('Do you sleep with the knife?'),
            RG('Always. You never know what might happen.'),
          ],
          choices: [
            {
              id: 'away',
              label: 'Ask her to put the knife away.',
              then: [RG('No.'), N('But she sticks it back in the wall, within reach, which for her is a kind of yes.')],
            },
            {
              id: 'bae',
              label: 'Stroke Bae’s nose.',
              then: [N('Bae lowers his head and lets you. His nose is soft and his eyes are tired.')],
            },
          ],
        },
        done: {
          id: 'a12-09-castle-done',
          lines: [RG('Now tell me about Kay again. The lodger can listen. And the warm thing stays where I can see it.')],
        },
      },
      {
        id: 'a12-09-s3',
        goal: 'Answer the robber girl. She wants your Nubbin.',
        hint: 'Choose what to say. Either answer is honest.',
        check: 'choose:a12-nubbin:straw',
        scene: {
          id: 'a12-09-keep',
          lines: [
            N('She holds out both hands, the way she held them out to the muff.'),
            RG('I want that one. It’s warm. I’ll keep it with the pigeons and the reindeer. It’s mine now.'),
            GE('It isn’t yours. It isn’t mine either.', 'think'),
            RG('I didn’t ask you.'),
            N('Your Nubbin looks at you, not frightened. It looks as if it’s waiting to see what sort of person you are.'),
            N('The robber girl’s hands are still out. They’re chapped, and there’s a scar across one knuckle.'),
          ],
          choices: [
            {
              id: 'no',
              label: '“No.” Plainly, and kindly.',
              set: { 'a12-nubbin': 'no' },
              then: [
                Y('No.'),
                RG('No?', 'angry'),
                Y('No. It isn’t a thing you keep. It stays with me.'),
                N('She stares at you a long time. Then she shrugs, as if she meant to lose.'),
                RG('Fine. Keep your warm thing.', 'angry'),
              ],
            },
            {
              id: 'night',
              label: '“You can hold it for one night.”',
              set: { 'a12-nubbin': 'night' },
              then: [
                Y('You can hold it tonight. In the morning it comes back to me.'),
                RG('One night?', 'think'),
                N('She takes your Nubbin in both hands, very carefully, as if it might break or might bite.'),
                RG('One night. Fine.'),
                N('Your Nubbin settles against her shoulder and goes straight to sleep. She looks at it as if nobody has ever done that before.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-09-keep-done',
          lines: [
            N('The robber girl falls asleep with one arm round Gerda’s neck, and snores.'),
            N('Gerda lies awake and stares at the pigeons. You lie awake and stare at Gerda.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a12-09-complete',
      lines: [
        N('By the fire the robbers sing and drink. The old robber woman turns a somersault, badly.'),
        N('Bae stands in the dark with his copper ring on, looking at the door.'),
        N('The pigeons shuffle on their perches and murmur. One of them opens an eye.'),
        N('Nobody in the corner is asleep except the robber girl, and she sleeps like somebody who has won.'),
      ],
    },
    rewards: [],
    sets: { 'a12-09': true },
    notes:
      'SIGNATURE CHOICE (a12-09-keep): a12-nubbin = no | night. Neither is wrong; “no” is a boundary, “one night” is ' +
      'trust. It pays off in A12-10 (her goodbye: a12-10-free or A12_VARIANTS a12-10-free-night), A12-17 (the pigeons ' +
      'on her saddle, tied or untied: a12-17-rider or a12-17-rider-night, 8 quests later) and A12-18 (the last ' +
      'image: a12-18-complete or a12-18-complete-night), and in the red cap on the Grove petpet. On the night path ' +
      'your Nubbin sleeps on the robber girl’s shoulder from here until a12-10-free-night. ' +
      'SOFTENED: the old robber woman has no lines and makes no threats (she peers in, drinks, naps, turns a ' +
      'somersault). The coachman and footmen run off unhurt. The knife is waved at the ceiling and never pointed at ' +
      'anyone; it never touches Bae. The robber girl is rough, lonely and fair, never a villain.',
  },

  // ---------------------------------------------------------------- A12-10
  {
    id: 'a12-10',
    code: 'A12-10',
    title: 'The Reindeer',
    source: `${SRC}, fifth story: the little robber girl`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-9') },
    requires: ['A12-9'],
    speakers: [sGerda, sPigeons, sBae, sRobber],
    steps: [
      {
        id: 'a12-10-s1',
        goal: 'Listen to the wood pigeons in the night.',
        hint: 'Lie still in the straw and listen.',
        check: 'wait:a12-pigeons:perches',
        scene: {
          id: 'a12-10-pigeons',
          lines: [
            PI('Coo, coo. We have seen little Kay.'),
            GE('What? What did you say?', 'shock'),
            PI('A white hen was carrying his sledge. He was sitting in the Snow Queen’s carriage.'),
            PI('It went low over the forest while we were in our nest. She breathed on us as she passed, and we were cold for a long time after.'),
            GE('Where was she going? Do you know?'),
            PI('North, we think. To Lapland, where there’s always snow and ice. Ask the reindeer; he’s tied up just there.'),
            BA('Snow and ice! It’s glorious there. You can leap about free in great glittering valleys.', 'happy'),
            BA('The Snow Queen has her summer tent there. But her strong castle is far to the north, on the island they call Spitsbergen.'),
            GE('Oh, Kay. Little Kay.', 'sad'),
          ],
          choices: [
            {
              id: 'way',
              label: 'Whisper to Bae: does he know the way?',
              then: [BA('Know it? I could find it with my eyes shut. I’d go tonight, if not for this ring.', 'sad')],
            },
            {
              id: 'hand',
              label: 'Hold Gerda’s hand in the dark.',
              then: [N('You find her hand in the straw. She holds on so tight it hurts, and you don’t mind.')],
            },
            {
              id: 'hush',
              label: 'Hush them before the robber girl wakes.',
              then: [N('The robber girl stirs and mutters something about knives. Everybody goes very quiet until she snores again.')],
            },
          ],
        },
        done: {
          id: 'a12-10-pigeons-done',
          lines: [N('Nobody sleeps much after that, except the robber girl and, on the far perch, one very old pigeon.')],
        },
      },
      {
        id: 'a12-10-s2',
        goal: 'In the morning, ask Bae the way north.',
        hint: 'Talk to Bae while the robber girl listens.',
        check: 'talk:a12-bae:straw',
        scene: {
          id: 'a12-10-morning',
          lines: [
            N('In the morning Gerda tells the robber girl everything the pigeons said. The robber girl looks serious, and nods.'),
            RG('Lapland. Bae, do you know where Lapland is?'),
            BA('Do I know? Ask a fish if it knows the river. I was born there. I ran on those snowfields as a calf.', 'happy'),
            N('His eyes shine as he says it. He has been standing in this corner a long time.'),
            RG('Listen. The men are all out. Only Mother’s here, and at noon she has a drink from the big bottle and a nap.'),
            RG('Then I’ll do something for you.'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank her.',
              then: [RG('Don’t thank me yet. I haven’t done it. I might change my mind.', 'angry')],
            },
            {
              id: 'why',
              label: 'Ask her why.',
              then: [RG('Because I want to. That’s why I do everything.')],
            },
          ],
        },
        done: {
          id: 'a12-10-morning-done',
          lines: [N('At noon the old robber woman takes a long drink from the big bottle, sits down, and her chin goes onto her chest.')],
        },
      },
      {
        id: 'a12-10-s3',
        goal: 'Go with Gerda and Bae.',
        hint: 'Help tie Gerda onto Bae’s back, then climb on behind her.',
        check: 'climb:a12-bae:robber-castle',
        scene: {
          id: 'a12-10-free',
          lines: [
            N('The robber girl goes to Bae. She doesn’t look at you, and she doesn’t look at your Nubbin.'),
            RG('Don’t think this is because of you. I was going to anyway.', 'angry'),
            ...A10_FREE,
          ],
          choices: A10_FREE_CHOICES,
        },
        done: {
          id: 'a12-10-free-done',
          lines: [
            N('Bae flies off over stumps and bushes, through the great forest, over marshes and plains, as fast as he can go.'),
            N('Above you the sky flares up, green and white, in great sheets of light.'),
            BA('Those are my old lights! Look at them flash!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a12-10-complete',
      lines: [
        N('You ride north day and night. The bread runs out, and then the ham.'),
        N('Gerda’s hands are in the robber woman’s great mittens. Your Nubbin rides inside her coat, against her heart.'),
        GE('Is it much further?'),
        BA('Yes. But we’re nearer than we were.'),
      ],
    },
    rewards: [],
    sets: { 'a12-10': true },
    notes:
      'NUBBIN PAYOFF (a12-nubbin). The step 3 scene shown, a12-10-free, is for “no”: she frees Bae anyway, scowling. ' +
      'For “night” play A12_VARIANTS a12-10-free-night instead: she hands your Nubbin back unasked, says that if she ' +
      'can give one back she can give two, and frees Bae. Both keep the muff with her, give the boots and mittens, and ' +
      'use the same choices. ' +
      'SOFTENED: the knife cuts Bae’s rope and nothing else; Andersen’s knife-tickling of the reindeer is cut. The ' +
      'pigeons’ nest is “cold for a long time”, not lost. Lifted text: none. Bae’s answer at a12-10-morning#2 is our own ' +
      '(Part M’s line 3 is [unverified]). Riding: you sit behind Gerda on Bae (an Atlas-world liberty; Bae says you ' +
      'weigh less than a sack of salt). The northern lights are original cut-paper sheets of colour. Spitsbergen is ' +
      'Andersen’s name for the island (Svalbard today); the Learning Grove version can say so.',
  },

  // ---------------------------------------------------------------- A12-11
  {
    id: 'a12-11',
    code: 'A12-11',
    title: 'The Sámi Woman',
    source: `${SRC}, sixth story: the Lapland woman (the Sámi woman on this page)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-10') },
    requires: ['A12-10'],
    speakers: [sGerda, sBae, sSami],
    steps: [
      {
        id: 'a12-11-s1',
        goal: 'Find the little house in the snow.',
        hint: 'Follow Bae towards the smoke and the lamplight.',
        check: 'find:a12-hut:snowfield',
        scene: {
          id: 'a12-11-hut',
          lines: [
            N('Bae stops at a little house. Its roof comes right down to the snow, and smoke rises from the middle of it.'),
            N('The door is so low you have to go in on hands and knees. Your Nubbin goes in on its belly.'),
            N('Inside, by the light of her lamp, a woman is frying fish. Nobody else is at home.'),
            N('She looks up at a reindeer, a frozen girl and a lodger all crawling through her door at once, and doesn’t turn a hair.'),
            SA('Well. Come in, then. Shut the cold out behind you. Mind the pan.'),
            N('Gerda is so cold she can’t speak. The woman sits her by the lamp straight away and rubs her hands.'),
          ],
          choices: [
            {
              id: 'feet',
              label: 'Help rub Gerda’s feet.',
              then: [N('You rub Gerda’s feet while the woman does her hands. Neither of you says much; there isn’t time for much.')],
            },
            {
              id: 'pan',
              label: 'Mind the pan.',
              then: [N('You mind the pan. The fish is nearly done, and you turn it, and the woman nods: right side, right moment.')],
            },
          ],
        },
        done: {
          id: 'a12-11-hut-done',
          lines: [SA('There. Fingers are coming back. Toes next. You’ve come a long way in those boots.', 'soft')],
        },
      },
      {
        id: 'a12-11-s2',
        goal: 'Get warm while Bae tells his story.',
        hint: 'Sit by the lamp and eat what you’re given.',
        check: 'sit:a12-hut:lamp',
        scene: {
          id: 'a12-11-lamp',
          lines: [
            N('Bae tells his own story first, because it seems to him much the more important. Then he tells Gerda’s.'),
            SA('You’ve been tied up a long while, by the look of your neck. Hold still.'),
            N('She looks over Bae’s legs and the rubbed place under his chin, quickly and gently, like somebody who has done it all her life.'),
            SA('My son has our herd out on the winter grazing. I know a tired reindeer when one comes to my door.'),
            N('She feeds you fish and broth, and fetches Bae a heap of lichen from her store. Nobody leaves her house hungry.'),
            SA('You poor things. You’ve a long way still to go. Hundreds of miles, to where the Snow Queen is.'),
            GE('Do you know where she is? Have you seen her?'),
            SA('I know her weather. Everybody up here does. She lets off her lights every evening, further north.'),
          ],
          choices: [
            {
              id: 'herd',
              label: 'Ask about her herd.',
              then: [SA('Big enough. Too big to count in a hurry. My son knows each one by its face, and pretends he doesn’t.', 'happy')],
            },
            {
              id: 'thank',
              label: 'Thank her for the food.',
              then: [SA('It’s only fish. You’d do the same, if I came to your door.')],
            },
            {
              id: 'lichen',
              label: 'Help feed Bae his lichen.',
              then: [N('Bae eats from your hands, delicately, then all at once. The woman watches, and shows you how to hold it better.')],
            },
          ],
        },
        done: {
          id: 'a12-11-lamp-done',
          lines: [SA('I’ll tell you who’ll know more: my friend, further north. She knows that country better than I do.')],
        },
      },
      {
        id: 'a12-11-s3',
        goal: 'Carry the message on the dried fish.',
        hint: 'Take the fish from the Sámi woman and keep it safe.',
        check: 'carry:a12-fish-letter:hut',
        scene: {
          id: 'a12-11-fish',
          lines: [
            SA('I’ve no paper. I’ll write it on a fish. She’ll read it.'),
            N('She takes a dried cod off the rack and writes a few lines on it, with care. Then she hands it to you.'),
            SA('Look after that. Don’t let the reindeer eat it, and don’t eat it yourself, however long the road.'),
            N('She ties Gerda back onto Bae with her own knots, which are better. Then she gives you a reindeer skin, rolled up.'),
            SA('To sit on, wherever you end up sitting. Snow is colder from underneath.', 'think'),
            N('She doesn’t say how she knows you’ll end up sitting. She knows the country.'),
          ],
          choices: [
            {
              id: 'coat',
              label: 'Put the fish inside your coat.',
              then: [N('You tuck it into your coat. It smells strongly of fish, and so will you, for the rest of the journey.')],
            },
            {
              id: 'why',
              label: 'Ask why she thinks you’ll be sitting.',
              then: [SA('Everybody who goes north ends up waiting for somebody. That’s what the north is mostly for.')],
            },
          ],
        },
        done: {
          id: 'a12-11-fish-done',
          lines: [SA('Go well. And come back this way, after. I’ll want to know how it ends.')],
        },
      },
    ],
    complete: {
      id: 'a12-11-complete',
      lines: [
        N('Bae runs on into the night. Overhead the lights burn blue all night long, the most beautiful you have ever seen.'),
        GE('She didn’t ask for anything. Not even our names.', 'soft'),
        N('The fish letter is warm inside your coat. Your Nubbin keeps sniffing at it, hopefully.'),
        BA('Not far now. Further than you’d like, but not far.'),
      ],
    },
    rewards: [],
    sets: { 'a12-11': true },
    notes:
      'SÁMI CARE (Part M; follow the Sámi adviser, commissioned before art). Say “the Sámi woman”, never “Lapp woman”. ' +
      'She is a host in her own home: practical, warm, a good cook, unflappable. She has no magic beyond writing a ' +
      'letter on a dried fish, which is Andersen’s and simply practical. No drum, no sacred item, nothing mystical. ' +
      'Her son has the family herd out on the winter grazing: herding is shown as a living livelihood. The script ' +
      'never describes her dress; the adviser decides the gákti, the house and its furnishings, and it is never a ' +
      'costume reward. The house follows Andersen (a low roof down to the snow, a low door), drawn as the adviser ' +
      'approves. She is not named, as in Andersen; if the adviser wants her named, add it here.',
  },

  // ---------------------------------------------------------------- A12-12
  {
    id: 'a12-12',
    code: 'A12-12',
    title: 'The Finnish Woman',
    source: `${SRC}, sixth story: the Finland woman (the Finnish woman on this page)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-11') },
    requires: ['A12-11'],
    speakers: [sGerda, sBae, sFinnish],
    steps: [
      {
        id: 'a12-12-s1',
        goal: 'Deliver the fish letter.',
        hint: 'There’s no door. Knock on the chimney.',
        check: 'deliver:a12-fish-letter:chimney',
        scene: {
          id: 'a12-12-chimney',
          lines: [
            N('The Finnish woman’s house has no door at all. Bae knocks on the chimney with his antlers, and a voice inside says come down.'),
            N('Inside, it’s so hot that the air shimmers. The Finnish woman is small, with her sleeves rolled up and very wise eyes.'),
            FI('Off. Boots off, mittens off, coat open, or you’ll cook. And you, put this on your head.'),
            N('She puts a block of ice on Bae’s head. He looks very relieved.'),
            N('You give her the fish. She reads it once, twice, three times, until she has it by heart.'),
            N('Then she puts it in the soup pot, because it’s good to eat and she never wastes anything.'),
          ],
          choices: [
            {
              id: 'soup',
              label: 'Watch the letter go in the soup.',
              then: [N('It goes in with a respectful plop. Your Nubbin watches the pot as if the message might still have something to add.')],
            },
            {
              id: 'ice',
              label: 'Ask for a block of ice for yourself.',
              then: [FI('Ha! Here. You’re cooking too. Everybody does, the first time.', 'happy')],
            },
          ],
        },
        done: { id: 'a12-12-chimney-done', lines: [FI('Well. So you’re the ones. Sit.')] },
      },
      {
        id: 'a12-12-s2',
        goal: 'Listen while Bae asks the Finnish woman for help.',
        hint: 'Sit in the heat and listen.',
        check: 'sit:a12-finnish:stove',
        scene: {
          id: 'a12-12-power',
          lines: [
            N('Bae tells his own story first, and then Gerda’s. The Finnish woman blinks her wise eyes, and says nothing.'),
            BA('You’re so clever. Can’t you give her something? A drink to give her the strength of twelve men, to beat the Snow Queen?', 'sad'),
            FI('The strength of twelve men! Much good that would do her.', 'think'),
            N('But Bae begs, and Gerda looks at her with wet eyes, and the Finnish woman blinks again.'),
            N('She takes Bae into a corner, puts fresh ice on his head, and speaks low. You’re near enough to hear.'),
            FI('Little Kay is with the Snow Queen. He likes everything there. He thinks it’s the best place in the world.'),
            FI('That’s because there’s a splinter in his heart and a grain of glass in his eye. They must come out, or he’ll never be himself again.'),
            BA('But can’t you give Gerda something? Something to make her stronger than all of it?'),
            FI('I can’t give her more than she’s got. Don’t you see how much that is? People help her. Animals carry her. She’s come this far barefoot.'),
            FI('It doesn’t come from me. It’s in her heart, because she’s a child who loves somebody and means it all the way through.', 'soft'),
            FI('She mustn’t hear it from us. If she can’t reach the Snow Queen and get that glass out herself, then we can’t help her.'),
          ],
        },
        done: {
          id: 'a12-12-power-done',
          lines: [N('Gerda, by the stove, hasn’t heard a word. She has fallen asleep in the heat, with her boots and mittens beside her.')],
        },
      },
      {
        id: 'a12-12-s3',
        goal: 'Ask the Finnish woman if you should go with Gerda.',
        hint: 'Ask her in the corner, before Bae sets off.',
        check: 'talk:a12-finnish:corner',
        scene: {
          id: 'a12-12-ask',
          lines: [
            N('You go to the corner too, and ask it straight out: should you go with Gerda, all the way in?'),
            FI('No.'),
            FI('Two miles on, the Snow Queen’s garden begins. There’s a big bush there with red berries, standing in the snow.'),
            FI('You take her as far as the bush. Then you stop. Then you wait.'),
            FI('Some doors only open for one person. If you go through with her, it won’t open at all.', 'think'),
            N('She looks at your Nubbin, and then at you, as if checking that you’re the waiting sort.'),
          ],
          choices: [
            {
              id: 'long',
              label: '“How long?”',
              then: [FI('As long as it takes. That’s the only length waiting comes in.')],
            },
            {
              id: 'if',
              label: '“And if she doesn’t come out?”',
              then: [FI('Then you’ll still have waited, and that’s worth something. But she’ll come.', 'soft')],
            },
            {
              id: 'nod',
              label: 'Nod. You understand.',
              then: [FI('Good. Most people argue. Most people have to be told twice.')],
            },
          ],
        },
        done: {
          id: 'a12-12-ask-done',
          lines: [FI('Now go. And don’t stand about talking at the bush. Put her down, and let the reindeer come straight back.')],
        },
      },
    ],
    complete: {
      id: 'a12-12-complete',
      lines: [
        N('The Finnish woman lifts the sleeping Gerda onto Bae. Bae is off like a shot, and you hang on behind.'),
        GE('Oh! My boots! My mittens! They’re by the stove!', 'shock'),
        N('Bae doesn’t dare stop. He runs and runs through the hard cold, towards a dark shape in the snow.'),
        N('You look back once. The little hot house is a spark, and then nothing.'),
      ],
    },
    rewards: [],
    sets: { 'a12-12': true },
    notes:
      'THE FINNISH WOMAN (Part M care note). Andersen’s Finnekonen may be Sámi in the Danish usage of his day, and the ' +
      'old “Sámi sorcerer” trope sits behind her. So she casts no spells: Andersen’s knotted winds and her reading of ' +
      'the skin are cut. The ice on Bae’s head is for the heat, and the fish goes in the soup because she wastes ' +
      'nothing; both are comic and ordinary. She gives advice, says Gerda’s power is her own, and that is all. The ' +
      'Sámi adviser decides how she is drawn and whether “the Finnish woman” is the right name. ' +
      'LIFTED TEXT: none. a12-12-power#8–9 are our own words for Part M’s lines 4 and 5 (both [unverified]). ' +
      'CINDER: if cinder is set, play A12_VARIANTS a12-12-ember-forgiven or a12-12-ember-remembered straight after ' +
      'a12-12-chimney-done (she looks at the ember: “That was a fierce fire once…”). ' +
      'Her line at a12-12-ask#4 explains why you wait; nobody names Hazel’s third rule.',
  },

  // ---------------------------------------------------------------- A12-13
  {
    id: 'a12-13',
    code: 'A12-13',
    title: 'The Bush with Red Berries',
    source: `${SRC}, sixth story: the bush with red berries`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-12') },
    requires: ['A12-12'],
    speakers: [sGerda, sBae],
    steps: [
      {
        id: 'a12-13-s1',
        goal: 'Reach the bush with red berries.',
        hint: 'Hold on to Bae until he stops at the bush.',
        check: 'find:a12-bush:red-berries',
        scene: {
          id: 'a12-13-bush',
          lines: [
            N('The bush stands alone in the snow, dark green, covered in berries as red as Gerda’s shoes.'),
            N('Bae sets Gerda down. He touches his nose to her cheek, and big bright tears run down his face.'),
            BA('I can’t go further. She said. Go well, little one.', 'sad'),
            N('Then he turns and runs back the way you came, as fast as he can, so that he won’t change his mind.'),
            N('Gerda stands in the snow in her stockings, with no boots and no mittens, in the middle of the far north.'),
            N('In the distance something glitters, huge and cold: walls of drifted snow, and windows of wind.'),
          ],
          choices: [
            {
              id: 'coat',
              label: 'Offer Gerda your coat.',
              then: [GE('No. You have to wait, and waiting’s the coldest part. You keep it.', 'soft')],
            },
            {
              id: 'nubbin',
              label: 'Offer her your Nubbin, to keep her hands warm.',
              then: [
                N('Gerda strokes your Nubbin once, and shakes her head.'),
                GE('It would only get cold in there. Keep it warm for me, so it’s warm when we come back.', 'soft'),
              ],
            },
            {
              id: 'go',
              label: '“Go on, then.”',
              then: [Y('Go on, then.'), GE('I’m going.', 'happy')],
            },
          ],
        },
        done: {
          id: 'a12-13-bush-done',
          lines: [
            N('Gerda runs off across the snow. She doesn’t look back, and you understand why.'),
            N('Then you’re alone by the bush with your Nubbin, and the quiet comes down.'),
          ],
        },
      },
      {
        id: 'a12-13-s2',
        goal: 'Wait by the bush, as long as it takes.',
        hint: 'Sit on the reindeer skin and wait. There’s nothing else to do, and that’s the job.',
        check: 'wait:a12-bush:red-berries',
        scene: {
          id: 'a12-13-wait',
          lines: [
            N('You unroll the Sámi woman’s reindeer skin and sit on it. She was right: snow is colder from underneath.'),
            N('Your Nubbin climbs inside your coat and presses itself against you. You keep each other warm, the slow way.'),
            N('There’s no wind here. Just the cold, and the quiet, and the bush, and the red berries.'),
            N('You count the berries. Then you count them again, get a different number, and decide not to mind.'),
            N('Far off, the lights go up over the palace, green and white. Nobody is watching them but you.'),
            N('You don’t know how long it will be. You know you’ll be here when it’s over.', 'soft'),
          ],
          choices: A13_WAIT_CHOICES,
        },
        done: {
          id: 'a12-13-wait-done',
          lines: [N('Your feet go numb, and come back, and go numb again. You stay.')],
        },
      },
    ],
    complete: {
      id: 'a12-13-complete',
      lines: [
        N('Night comes, if it ever went. The stars come out so thick they look like frost on a window.'),
        N('Across the snow, very small, Gerda is still walking. Something is moving over the snow towards her.'),
        N('You stand up on the skin to see better. You don’t step off it.'),
        N('Your Nubbin sits up inside your coat and looks out. You hold it a little tighter, and you stay where you are.'),
      ],
    },
    rewards: [],
    sets: { 'a12-13': true },
    notes:
      'THE WAIT. a12-13-wait is the heart of the Keeper’s part on this page: keep it slow, with no music cue, wind ' +
      'only. The wait check completes when the player has sat on the skin through the scene (no timer, no real-time ' +
      'delay; the light changes on screen as the hours pass). You are never in danger: the cold is felt, not fatal. ' +
      'CINDER: if cinder is set, play A12_VARIANTS a12-13-wait-forgiven or a12-13-wait-remembered in place of ' +
      'a12-13-wait. The ember keeps you both from freezing; forgiven it burns steady, remembered it flickers but ' +
      'never goes out. Same choices. Gerda turns down your coat and your Nubbin: she goes on as Andersen sends her, ' +
      'barefoot, on her own power.',
  },

  // ---------------------------------------------------------------- A12-14
  {
    id: 'a12-14',
    code: 'A12-14',
    title: 'The Snowflake Guards',
    source: `${SRC}, sixth story: the Snow Queen’s guards`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-13') },
    requires: ['A12-13'],
    speakers: [sGerda],
    steps: [
      {
        id: 'a12-14-s1',
        goal: 'Watch Gerda from the bush.',
        hint: 'Stand on the reindeer skin and look out across the snow.',
        check: 'watch:a12-gerda:snowfield',
        scene: {
          id: 'a12-14-guards',
          lines: [
            N('Gerda is a dark speck on the white. Towards her, along the ground, come the snowflakes.'),
            N('They don’t fall from the sky; the sky is clear. They run along the snow, and the nearer they get, the bigger they grow.'),
            N('You remember Kay’s burning-glass, and how big the flakes looked under it. These are bigger, and they are alive.'),
            N('Some are like great ugly porcupines, and some like knots of snakes with their heads sticking out.'),
            N('Some are like fat little bears with their fur on end. All of them are dazzling white.'),
            N('They are the Snow Queen’s guards. They close round Gerda in a ring.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout to her.',
              then: [N('You shout. The cold takes the sound out of your mouth and drops it in the snow a yard away.')],
            },
            {
              id: 'step',
              label: 'Take one step off the skin.',
              then: [N('You take one step. Then you remember what the Finnish woman said, and you step back on.')],
            },
            {
              id: 'hold',
              label: 'Hold your Nubbin tight.',
              then: [N('You hold it, and it holds you. Neither of you takes your eyes off the speck in the ring.')],
            },
          ],
        },
        done: { id: 'a12-14-guards-done', lines: [N('Gerda stops. She doesn’t run.')] },
      },
      {
        id: 'a12-14-s2',
        goal: 'Watch what Gerda does.',
        hint: 'Keep watching. Don’t look away.',
        check: 'watch:a12-prayer:snowfield',
        scene: {
          id: 'a12-14-prayer',
          lines: [
            N('Gerda folds her hands and says her prayer, the one Grandmother taught her. You can’t hear it from here, and you don’t need to.'),
            N('It’s so cold that her breath comes out like smoke. The smoke grows thicker as she prays.'),
            N('Then it turns into small bright figures, with helmets on their heads and spears and shields in their hands.'),
            N('They grow as they touch the ground, and there are more of them with every breath she takes.'),
            N('By the time she has finished her prayer, a whole crowd of them stands round her, shining.'),
            N('They break the snowflake guards into a hundred pieces, and clear the road ahead of her.'),
            N('They stroke her hands and feet so that she feels the cold less, and she walks on, quickly and bravely.', 'soft'),
          ],
        },
        done: {
          id: 'a12-14-prayer-done',
          lines: [N('The bright figures go with her all the way to the palace gate. Then they’re gone, like breath on a window.')],
        },
      },
    ],
    complete: {
      id: 'a12-14-complete',
      lines: [
        N('The palace gate is made of cutting winds. Gerda says her evening prayer, and the winds drop as if they’ve gone to sleep.'),
        N('She goes in. The gate closes behind her, and the winds get up again.'),
        N('You sit back down on the reindeer skin. Your Nubbin puts its chin on your arm.'),
        N('Now there’s nothing to watch but the walls. You watch them anyway.'),
      ],
    },
    rewards: [],
    sets: { 'a12-14': true },
    notes:
      'Seen from far off, from the bush. The snowflake guards are strange, not gory: cut-paper shapes that grow as ' +
      'they come. FAITH: Gerda’s prayer is Andersen’s; it is narrated and never quoted, and nobody comments on it. The ' +
      'bright figures are drawn as Andersen describes them (small shining figures with helmets, spears and shields), ' +
      'gentle, in warm light. ' +
      'KEPT STONE: if keptStone is set, play A12_VARIANTS a12-14-prayer-kept in place of a12-14-prayer: Gerda’s ' +
      'figures clear her road as before; then the snowflakes part for you, the stone in your pocket hums, the road is ' +
      'open, and you could walk in. You don’t (choice: sit back down, or turn your back). Same done scene.',
  },

  // ---------------------------------------------------------------- A12-15
  {
    id: 'a12-15',
    code: 'A12-15',
    title: 'The Ice Puzzle',
    source: `${SRC}, seventh story: the Snow Queen’s palace`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-14') },
    requires: ['A12-14'],
    speakers: [sQueen, sKay],
    steps: [
      {
        id: 'a12-15-s1',
        goal: 'Watch the Snow Queen fly south.',
        hint: 'Look through the clear patch in the frost, then up at the sky.',
        check: 'watch:a12-queen:sky',
        scene: {
          id: 'a12-15-south',
          lines: [
            N('Your Nubbin breathes on the frozen crust by your feet. The frost clears like a window, and the atlas does what atlases do.'),
            N('It shows you the next page while you’re still on this one: inside the palace, a little earlier, in cut paper and ice.'),
            N('The halls are drifted snow, and the windows are cutting winds. There are more than a hundred of them, lit by the northern lights.'),
            N('They are vast and empty and icy and glittering. Nobody has ever had any fun in them, not once.'),
            N('The Snow Queen stands in the greatest hall, ready to go.'),
            QU('I’m off to the warm lands. I want to look into the black pots, the ones that smoke. I’ll whiten them a little.'),
            QU('It does them good. Good for the lemons and the grapes.'),
            QU('Work out the word while I’m gone. Make it, and nobody will ever tell you what to do again.'),
            QU('I’ll give you the whole world for it. And a new pair of skates.'),
          ],
          choices: [
            {
              id: 'up',
              label: 'Look up as she passes.',
              then: [N('A moment later she goes over the bush, high up, a long white streak heading south. She doesn’t look down.')],
            },
            {
              id: 'down',
              label: 'Keep your head down.',
              then: [N('You keep your head down. A long white shadow goes over the snow, and the berries rattle on the bush.')],
            },
          ],
        },
        done: {
          id: 'a12-15-south-done',
          lines: [N('In the great hall Kay is alone. It’s miles long, and he is the only thing in it that moves, and only just.')],
        },
      },
      {
        id: 'a12-15-s2',
        goal: 'Watch Kay at his puzzle.',
        hint: 'Keep looking through the clear patch in the frost.',
        check: 'watch:a12-kay:mirror-lake',
        scene: {
          id: 'a12-15-puzzle',
          lines: [
            N('In the middle of the hall is a frozen lake, cracked into a thousand pieces, every piece exactly like every other.'),
            N('The Snow Queen calls it the Mirror of Understanding. She says it’s the only one, and the best in the world.'),
            N('Kay sits on it. He is blue with cold, nearly black, and he doesn’t notice; she kissed the shivering out of him.'),
            N('He drags flat, sharp pieces of ice about, fits them together, pulls them apart, and fits them again.'),
            N('To him the shapes are the most important things in the world. That’s the grain of glass in his eye.'),
            N('He makes whole words out of ice. But there’s one word he can’t make, and it’s the only one she wants.'),
            KA('Nearly. It’s nearly. It just needs one more piece.'),
            N('It doesn’t. He sits and thinks until he creaks, so stiff and still that you’d think he had frozen.', 'sad'),
          ],
          choices: [
            {
              id: 'name',
              label: 'Say his name, out loud, to nobody.',
              then: [Y('Kay.'), N('Of course he can’t hear you. Somebody should say it, out here, so you did.')],
            },
            {
              id: 'away',
              label: 'Look away for a moment.',
              then: [N('You look away, at the red berries, and it helps a bit. Then you look back, because somebody should.')],
            },
            {
              id: 'watch',
              label: 'Keep watching.',
              then: [N('You keep watching. Your Nubbin watches too, without blinking, the way it watches an egg that’s about to hatch.')],
            },
          ],
        },
        done: {
          id: 'a12-15-puzzle-done',
          lines: [N('Then, at the far end of the hall, a small figure in stockings comes in through the gate of winds.')],
        },
      },
    ],
    complete: {
      id: 'a12-15-complete',
      lines: [
        N('Gerda walks into the empty hall. It takes her a long time to cross; it’s miles long.'),
        N('Kay doesn’t look up. He is still counting pieces.'),
        N('Your Nubbin holds its breath. You find you’re holding yours.'),
        N('Over the palace the northern lights go quiet, as if they want to see too.'),
      ],
    },
    rewards: [],
    sets: { 'a12-15': true },
    notes:
      'SEEN FROM THE BUSH. You never go in. Your Nubbin breathes a clear patch in the frost and the atlas shows the ' +
      'palace in it, as a cut-paper scene in ice light (the same device as the shadow-show in A12-1). The patch stays ' +
      'open through A12-16 and fogs over in a12-16-complete. a12-15-south is “a little earlier” than the wait; the ' +
      'Snow Queen’s shadow then passes over the bush in real time. The black pots are Etna and Vesuvius in Andersen; ' +
      'the page doesn’t name them (the Learning Grove can). ' +
      'LIFTED TEXT: none. The Snow Queen’s promise (a12-15-south#7–8) is in our own words (Part M’s line 6 is ' +
      '[unverified]). “Mirror of Understanding” (a12-15-puzzle#1) is used as a name only, confirmed against #1597’s ' +
      'text on BookRags. The word Kay can’t make is not named here; it appears in A12-16.',
  },

  // ---------------------------------------------------------------- A12-16
  {
    id: 'a12-16',
    code: 'A12-16',
    title: 'Gerda’s Tears',
    source: `${SRC}, seventh story: what happened in the palace`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-15') },
    requires: ['A12-15'],
    speakers: [sGerda, sKay],
    steps: [
      {
        id: 'a12-16-s1',
        goal: 'Watch Gerda find Kay.',
        hint: 'Watch through the clear patch in the frost.',
        check: 'watch:a12-gerda:great-hall',
        scene: {
          id: 'a12-16-found',
          lines: [
            N('Gerda sees him. She knows him at once, and she runs, and throws her arms round his neck and holds on.'),
            GE('Kay! Kay, it’s you! I’ve found you!', 'happy'),
            N('Kay sits quite still. He is stiff and cold, and he doesn’t know her.'),
            N('Gerda cries. Not a little: she cries the way you cry at the end of a very long way.', 'sad'),
            N('Her tears fall on his chest. They’re hot, and they go through, all the way to his heart.'),
            N('They thaw the ice round his heart. They melt the little splinter of glass inside it, as if it had never been.'),
            N('Kay looks at her.'),
          ],
          choices: [
            {
              id: 'stand',
              label: 'Stand up on the skin.',
              then: [N('You stand up; you can’t help it. Your Nubbin climbs onto your shoulder to see.')],
            },
            {
              id: 'still',
              label: 'Stay perfectly still.',
              then: [N('You don’t move. You don’t want to break anything, even from two miles off.')],
            },
          ],
        },
        done: {
          id: 'a12-16-found-done',
          lines: [N('Gerda sings the hymn with the roses in it, the one from the gutter boxes. You know the tune, and you hum it with her.')],
        },
      },
      {
        id: 'a12-16-s2',
        goal: 'Watch Kay come back.',
        hint: 'Keep watching. This is the part you waited for.',
        check: 'watch:a12-kay:tears',
        scene: {
          id: 'a12-16-tears',
          lines: [
            N('Kay bursts into tears. He cries so hard that the grain of glass washes out of his eye.'),
            N('He blinks. He sees her.'),
            KA('Gerda? Gerda, it’s you. Where did you go? Where did I go? How long have I been away?', 'shock'),
            N('He looks round the hall as if he’s seeing it for the first time.'),
            KA('It’s so cold in here. It’s so big, and so empty.', 'sad'),
            N('He holds on to Gerda, and she laughs and cries at once. So, two miles away, do you.'),
          ],
          choices: [
            {
              id: 'cheer',
              label: 'Cheer.',
              then: [N('You cheer out loud, alone, in the middle of the far north. Your Nubbin squeaks as loud as it can.')],
            },
            {
              id: 'sit',
              label: 'Sit down hard on the skin.',
              then: [N('Your legs go. You sit down on the reindeer skin and laugh, and can’t stop.')],
            },
          ],
        },
        done: { id: 'a12-16-tears-done', lines: [N('Even the pieces of ice begin to move.')] },
      },
      {
        id: 'a12-16-s3',
        goal: 'Watch the ice spell the word.',
        hint: 'Watch the pieces of ice on the frozen lake.',
        check: 'watch:a12-ice:word',
        scene: {
          id: 'a12-16-word',
          lines: [
            N('It is such a glad moment that the pieces of ice dance. They spin round Kay and Gerda, glittering.'),
            N('When they’re tired, they lie down. They lie down in the shape of a word, the very word Kay couldn’t make.'),
            N('It says ETERNITY, in letters of ice, as clear as a sign.'),
            N('Kay didn’t make it. It made itself, the moment he stopped trying to be clever and started being glad.'),
            N('Gerda kisses his cheeks, and they go pink. She kisses his eyes, and they shine like hers.'),
            N('She kisses his hands and feet, and he is well and strong again. The Snow Queen can come home whenever she likes.'),
          ],
          choices: [
            {
              id: 'read',
              label: 'Read the word out loud.',
              then: [Y('Eternity.'), N('It’s a long word for something so simple. Your Nubbin seems to agree.')],
            },
            {
              id: 'gerda',
              label: 'Look at Gerda instead of the word.',
              then: [N('You look at Gerda. The word is the Snow Queen’s business, and Gerda is yours.')],
            },
          ],
        },
        done: {
          id: 'a12-16-word-done',
          lines: [N('Kay’s freedom is written there on the lake, in shining letters. Nobody can unwrite it.')],
        },
      },
    ],
    complete: {
      id: 'a12-16-complete',
      lines: [
        N('Kay and Gerda take each other’s hands and walk out of the great palace.'),
        N('They talk about Grandmother, and the roses up on the roof. Wherever they go, the winds drop and the sun comes out.'),
        N('The clear patch in the frost fogs over. It doesn’t need to show you anything now; you can see them coming.'),
        GE('There! By the bush! That’s our lodger. They waited!', 'happy'),
        KA('Waited? Out here? For me?', 'think'),
      ],
    },
    rewards: [],
    sets: { 'a12-16': true },
    notes:
      'Seen from the bush through the clear frost (see A12-15). Gerda’s kisses are a child’s, on cheeks, eyes, hands ' +
      'and feet, as Andersen has them. The rose hymn is hummed, never sung in words. ' +
      'THE WORD: Andersen’s word in the ice is Eternity (Danish Evigheden). It is used as written; it quietly rhymes ' +
      'with the Grove’s Eternals (love, not cleverness, makes the eternal thing), and nobody points that out. ' +
      'LIFTED TEXT: none. Kay’s line at a12-16-tears#2 is our own (Part M’s line 7 is [unverified]). Gerda calls you ' +
      '“our lodger” and uses “they” for you, so it fits any Keeper.',
  },

  // ---------------------------------------------------------------- A12-17
  {
    id: 'a12-17',
    code: 'A12-17',
    title: 'The Road Home',
    source: `${SRC}, seventh story: the journey home`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-16') },
    requires: ['A12-16'],
    speakers: [sGerda, sKay, sBae, sFinnish, sSami, sRobber],
    steps: [
      {
        id: 'a12-17-s1',
        goal: 'Meet Bae back at the bush.',
        hint: 'Stay by the bush. Bae is coming back.',
        check: 'wait:a12-bae:bush',
        scene: {
          id: 'a12-17-doe',
          lines: [
            N('Bae is back at the bush when they reach it. He has brought a young doe with him, sleek and calm.'),
            N('She gives the children her warm milk to drink, and touches her nose to their faces.'),
            BA('I said I’d come straight back. I never said I’d stay away.', 'happy'),
            KA('Hello, lodger. Gerda says you saw the sledge. I’m sorry about the face I did at you.', 'sad'),
            N('He means the impression at the window, a long time ago. He remembers it, and he’s ashamed of it, which is a good sign.'),
            GE('He’s back. He’s really back. He’s cross about his feet, which is how I know.', 'happy'),
          ],
          choices: [
            {
              id: 'face',
              label: 'Tell Kay it was a very good impression.',
              then: [KA('It was, wasn’t it. I won’t do it again. Probably.', 'happy')],
            },
            {
              id: 'hug',
              label: 'Hug them both.',
              then: [N('You hug them both at once. Your Nubbin gets squashed in the middle and doesn’t mind at all.')],
            },
            {
              id: 'skin',
              label: 'Wrap them in the reindeer skin.',
              then: [N('You wrap the skin round both of them. They look like a very small, very pleased bundle of reindeer.')],
            },
          ],
        },
        done: {
          id: 'a12-17-doe-done',
          lines: [N('Bae and the doe carry them south. You walk alongside with a hand on Bae’s shoulder, and your feet don’t feel the snow.')],
        },
      },
      {
        id: 'a12-17-s2',
        goal: 'Go south by the Finnish woman’s house and the Sámi woman’s.',
        hint: 'Stop at both houses on the way.',
        check: 'escort:a12-children:south',
        scene: {
          id: 'a12-17-south',
          lines: [
            N('First you stop at the Finnish woman’s hot little house. The children get warm, and she gives Gerda back her boots and mittens.'),
            FI('I told you she’d come. You waited well. Most people fidget.'),
            N('Then on to the Sámi woman. She has sewn new clothes for both children, and has her sledge ready.'),
            SA('Well. You’re back, and there’s two of them. So that’s how it ends.', 'happy'),
            N('She drives you south herself, with Bae and the doe running alongside, to the edge of her country.'),
            N('There the first green is coming through the snow, and it’s time to say goodbye.'),
            SA('Go well, all of you. Even the one that wanted to eat my letter.'),
          ],
          choices: [
            {
              id: 'thanks',
              label: 'Thank her for everything.',
              then: [SA('It was only fish and a skin. Keep the skin. You’ve made good use of it.', 'soft')],
            },
            {
              id: 'bae',
              label: 'Say goodbye to Bae.',
              then: [
                BA('Goodbye, lodger. You sit well. I’ve never seen anybody sit so well.', 'happy'),
                N('He touches his nose to your Nubbin, very gently, and turns for home.'),
              ],
            },
          ],
        },
        done: {
          id: 'a12-17-south-done',
          lines: [N('Bae and the doe turn north and run, side by side, until they’re part of the snow.')],
        },
      },
      {
        id: 'a12-17-s3',
        goal: 'Meet the rider in the forest.',
        hint: 'Walk on into the green forest.',
        check: 'talk:a12-robber-girl:forest',
        scene: {
          id: 'a12-17-rider',
          lines: [
            N('The first birds are singing, and the forest has green buds. Out of it comes a fine horse that Gerda knows: it pulled the golden coach.'),
            N('On it rides a girl in a bright red cap. It’s the robber girl.'),
            RG('I got bored at home. I’m off to see the world. North first, and somewhere else if north’s no good.'),
            N('Two wood pigeons ride on her saddle, tied by the leg. They coo at Gerda as if they remember her.'),
            ...A17_NEWS,
          ],
          choices: A17_CHOICES,
        },
        done: {
          id: 'a12-17-rider-done',
          lines: [
            N('As she rides off, she tosses something small and red over her shoulder. It lands on your Nubbin’s head: a little red cap.'),
            RG('Robbers always have two of everything!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a12-17-complete',
      lines: [
        N('The robber girl rides off into the wide world without looking back. You suspect she never looks back.'),
        N('Kay and Gerda walk on hand in hand. It’s spring, and there are flowers everywhere.'),
        N('Your Nubbin wears its red cap at a slant, the way she does.'),
        N('Somewhere ahead, church bells are ringing.'),
      ],
    },
    rewards: [
      {
        id: 'a12-reindeer-petpet',
        kind: 'cosmetic',
        label: 'Reindeer Petpet',
        description:
          'A small reindeer, after the robber girl’s Bae, that trots at your Nubbin’s heels. If you let the robber girl hold your Nubbin for a night, it wears her red cap.',
      },
      {
        id: 'a12-red-cap',
        kind: 'cosmetic',
        label: 'The Robber Girl’s Red Cap',
        description: 'A small bright red cap for your Nubbin, worn at a slant. Robbers always have two of everything.',
      },
    ],
    sets: { 'a12-17': true },
    notes:
      'NUBBIN PAYOFF (a12-nubbin, 8 quests after the choice). The step 3 scene shown, a12-17-rider, is for “no”: the ' +
      'pigeons are tied. For “night” play A12_VARIANTS a12-17-rider-night: the pigeons are untied (“Mostly.”). Same ' +
      'done scene and choices. ' +
      'SOFTENED: the raven’s death is one quiet line (a12-17-rider, from A17_NEWS: “The raven died. He was old.”). The ' +
      'robber girl carries no pistols. The Sámi woman’s new clothes and sledge are Andersen’s, and her kindness is ' +
      'practical (see the A12-11 care note). The Finnish woman gives back the boots and mittens Gerda left by her ' +
      'stove. ' +
      'REWARDS: the reindeer petpet (cosmetic companion; on the night path it wears a red cap: the sim reads ' +
      'a12-nubbin from the Atlas save, read-only) and the red cap for your Nubbin, both one-time. The petpet’s harness ' +
      'and markings are original and not Sámi-specific; show the design to the Sámi adviser.',
  },

  // ---------------------------------------------------------------- A12-18
  {
    id: 'a12-18',
    code: 'A12-18',
    title: 'Summer',
    source: `${SRC}, seventh story: home`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A12-17') },
    requires: ['A12-17'],
    speakers: [sKay, sGerda, sGran],
    steps: [
      {
        id: 'a12-18-s1',
        goal: 'Walk home into the town.',
        hint: 'Follow the church bells to Grandmother’s door.',
        check: 'walk:a12-town:bells',
        scene: {
          id: 'a12-18-bells',
          lines: [
            N('The church bells are ringing, and you know the high towers. It’s the town: yours for a while, and theirs for always.'),
            N('You go through the streets to Grandmother’s door, up the stairs, and into the room.'),
            N('Everything is where it was. The clock says tick, tick, and its hands go round.'),
            N('But as Kay and Gerda come through the door, they notice something. They’ve grown up.'),
            KA('Was the door always this low?', 'think'),
            GE('We’ve been gone a long time.', 'soft'),
          ],
          choices: [
            {
              id: 'duck',
              label: 'Duck under the beam, out of habit.',
              then: [N('You duck. Kay, who never had to before, hits his head on it, and laughs.')],
            },
            {
              id: 'clock',
              label: 'Listen to the clock.',
              then: [N('Tick, tick: it kept going the whole time. Somebody kept winding it.')],
            },
          ],
        },
        done: {
          id: 'a12-18-bells-done',
          lines: [N('The window is open. The roses in the gutter boxes are in full bloom, and they’re growing right in at the window.')],
        },
      },
      {
        id: 'a12-18-s2',
        goal: 'Sit by the roses with Kay and Gerda.',
        hint: 'Climb out to the little stools under the rose arch.',
        check: 'sit:a12-stools:roses',
        scene: {
          id: 'a12-18-roses',
          lines: [
            N('There are the two little stools under the arch. Kay and Gerda sit on them, holding hands, too big for them now.'),
            N('The Snow Queen’s cold empty halls have gone out of their heads, like a heavy dream after breakfast.'),
            N('Grandmother sits in the sun, reading aloud from her Bible. She reads slowly, and stops when she reaches a part she likes.'),
            N('Kay and Gerda look at each other. All at once they understand the old hymn about the roses, the one they used to sing.'),
            N('They’re grown up, and they’re children too, in the place where it counts.', 'soft'),
            N('And it is summer: warm, glorious summer.'),
          ],
          choices: [
            {
              id: 'gutter',
              label: 'Sit on the gutter’s edge beside them.',
              then: [N('You sit on the edge of the gutter with your feet over the boxes. Grandmother looks up, nods, and reads on.')],
            },
            {
              id: 'water',
              label: 'Fetch the watering can.',
              then: [N('You water the top of the arch, carefully. A drop lands on Kay, and he pretends not to notice, very badly.')],
            },
          ],
        },
        done: {
          id: 'a12-18-roses-done',
          lines: [GR('There you are, lodger. I kept your room.', 'soft'), GR('I thought you’d want it back, after.')],
        },
      },
    ],
    complete: {
      id: 'a12-18-complete',
      lines: [
        N('Your Nubbin climbs out among the roses and sits there alone in the middle of them, in its red cap, quite content.'),
        N('Nobody is holding it, and nobody needs to. It stays because it wants to.', 'soft'),
        ...A18_END,
      ],
    },
    rewards: [
      {
        id: 'a12-rose-boxes',
        kind: 'decor',
        label: 'Gerda’s Rose Boxes',
        description:
          'Two window boxes with a rose tree in each: one on the cottage sill, one on the lantern shed, joined by a plank. The roses grow over it into an arch.',
      },
      {
        id: 'a12-great-voyage-bookmark',
        kind: 'item',
        label: 'Great Voyage Bookmark',
        description: 'A strip of cut paper shaped like a little boat on a river. It marks the Mirror Shard page, and counts towards the Great Voyage festival.',
      },
    ],
    sets: { 'a12-18': true, 'a12-done': true },
    notes:
      'NUBBIN PAYOFF (a12-nubbin), the last image. The complete scene shown, a12-18-complete, is for “no”: your ' +
      'Nubbin sits alone among the roses, quite content. For “night” play A12_VARIANTS a12-18-complete-night: an ' +
      'untied wood pigeon lands on the roses in the gutter. Both end with A18_END (the Grove and the rose boxes). ' +
      'KEPT STONE: if keptStone is set, play A12_VARIANTS a12-18-pocket straight after a12-18-roses-done (Grandmother ' +
      'asks why your hand is always on your pocket). ' +
      'FAITH: Grandmother’s Bible reading is narrated, never quoted. The rose hymn is understood, never sung in words. ' +
      'LIFTED TEXT: none. a12-18-roses#4 is our own version of Andersen’s last line (Part M’s line 8 is [unverified]). ' +
      'SIM: (a) the rose boxes are a new decor pair placed for you on the cottage sill and the lantern shed, with a ' +
      'plank between; the roses bloom by season on their own, with no watering chore. (b) The bookmark is an item in ' +
      'the atlas; the Great Voyage festival (A2, A6, A9, A10, A12, A14, A19, any two) reads atlasDone(\'A12\'). Both ' +
      'rewards are one-time.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say where each plays.
 *   cinder (Grove, read-only): a12-01-ember-*, a12-12-ember-*, a12-13-wait-*.
 *   keptStone (Grove, read-only): a12-04-kept, a12-14-prayer-kept, a12-18-pocket.
 *   a12-nubbin = night (A12-9): a12-10-free-night, a12-17-rider-night, a12-18-complete-night.
 */
export const A12_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A12-1, after a12-01-arrive-done (cinder)
  {
    id: 'a12-01-ember-forgiven',
    lines: [
      N('Your Nubbin is carrying something: a little lantern, and in it Cinder’s ember, small and red.'),
      N('It burns steady, the colour of a hearth with the door shut. Grandmother holds her hands out to it without thinking.'),
      GR('Now that’s a good little fire. Bring it up with you; the eaves get cold.', 'soft'),
    ],
  },
  {
    id: 'a12-01-ember-remembered',
    lines: [
      N('Your Nubbin is carrying something: a little lantern, and in it Cinder’s ember, small and red.'),
      N('It flickers now and then, as if it’s remembering something. It never goes out.'),
      GR('That one’s got a story in it. Bring it up with you; the eaves get cold.', 'think'),
    ],
  },
  // ---------------------------------------------------------------- A12-4, after a12-04-square-done (keptStone)
  {
    id: 'a12-04-kept',
    lines: [
      N('As it comes round the square again, the white sledge doesn’t pass you. It stops, right beside you.'),
      N('The driver looks down. Under the white cap is a face of ice, lovely and still, with eyes like two stars.'),
      QU('You keep things too.'),
      N('She says nothing about the stone in your pocket. She doesn’t need to.'),
      N('She lifts the edge of her white bearskin and holds it open. Inside it’s soft and white and very quiet.'),
      N('It’s a place where you will never feel the cold again. You can see that as clearly as you can see her.'),
    ],
    choices: [
      {
        id: 'refuse',
        label: '“No.”',
        then: [
          Y('No, thank you.'),
          N('She looks at you a moment longer, without anger. Then she lets the bearskin fall, and drives on.'),
        ],
      },
      {
        id: 'step',
        label: 'Say nothing. Step back.',
        then: [
          N('You step back, out of reach of the fur. She watches you do it, and she almost smiles.'),
          N('Then she lets the bearskin fall, and drives on.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- A12-10, step 3 scene (night)
  {
    id: 'a12-10-free-night',
    lines: [
      N('The robber girl comes to you before she goes to Bae. Your Nubbin is in her arms, still half asleep.'),
      N('She holds it out to you. You didn’t ask, and she gives it back anyway.'),
      RG('There. I gave it back. Nobody made me.', 'think'),
      RG('And if I can give one back, I can give two.'),
      N('She goes to Bae and puts her hand flat on his neck, by the copper ring.'),
      ...A10_FREE,
    ],
    choices: A10_FREE_CHOICES,
  },
  // ---------------------------------------------------------------- A12-12, after a12-12-chimney-done (cinder)
  {
    id: 'a12-12-ember-forgiven',
    lines: [
      N('The Finnish woman stops. She’s looking at the little lantern your Nubbin carries, and the ember burning steady in it.'),
      FI('That was a fierce fire once.', 'think'),
      FI('It only keeps someone warm now. That’s the right size for a fire.', 'soft'),
      N('She bends and warms her hands at it for a moment, as if she were greeting somebody.'),
    ],
  },
  {
    id: 'a12-12-ember-remembered',
    lines: [
      N('The Finnish woman stops. She’s looking at the little lantern your Nubbin carries, and the ember flickering in it.'),
      FI('That was a fierce fire once.', 'think'),
      FI('It only keeps someone warm now. That’s the right size for a fire.', 'soft'),
      N('The ember flickers while she looks at it. It doesn’t go out.'),
    ],
  },
  // ---------------------------------------------------------------- A12-13, step 2 scene (cinder)
  {
    id: 'a12-13-wait-forgiven',
    lines: [
      N('You unroll the Sámi woman’s reindeer skin and sit on it. Your Nubbin sets its little lantern down between your feet.'),
      N('Cinder’s ember burns steady inside it. It isn’t much of a fire, and it’s exactly enough.'),
      N('The cold comes right up to the edge of its light and stops there, as if it knows better.'),
      N('There’s no wind here. Just the quiet, and the bush, and the red berries.'),
      N('You count the berries. Then you count them again, get a different number, and decide not to mind.'),
      N('You don’t know how long it will be. You know you’ll be here when it’s over.', 'soft'),
    ],
    choices: A13_WAIT_CHOICES,
  },
  {
    id: 'a12-13-wait-remembered',
    lines: [
      N('You unroll the Sámi woman’s reindeer skin and sit on it. Your Nubbin sets its little lantern down between your feet.'),
      N('Cinder’s ember flickers inside it now and then, as if remembering something. It never goes out.'),
      N('It keeps you both from freezing. That’s all it does now, and it does it all night.'),
      N('There’s no wind here. Just the quiet, and the bush, and the red berries.'),
      N('You count the berries. Then you count them again, get a different number, and decide not to mind.'),
      N('You don’t know how long it will be. You know you’ll be here when it’s over.', 'soft'),
    ],
    choices: A13_WAIT_CHOICES,
  },
  // ---------------------------------------------------------------- A12-14, step 2 scene (keptStone)
  {
    id: 'a12-14-prayer-kept',
    lines: [
      N('Gerda folds her hands and says her prayer. Her breath turns to smoke, and the smoke turns to small bright figures.'),
      N('There are more of them with every breath. They break the guards into a hundred pieces, and she walks on, quickly and bravely.'),
      N('Then some of the snowflakes turn, and come running along the ground towards you.'),
      N('They reach the edge of the skin and stop. Then they part, left and right, like servants at a door.'),
      N('In your pocket the stone hums, which it has never done before. It sounds pleased.'),
      N('The road to the palace lies open in front of you, clear and smooth and white. Nothing would stop you.'),
      N('You could walk in. You know exactly how welcome you would be.', 'think'),
    ],
    choices: [
      {
        id: 'sit',
        label: 'Sit back down.',
        then: [
          N('You sit down on the reindeer skin. After a while the snowflakes close the road again, as if disappointed.'),
          N('The stone goes quiet. Your Nubbin climbs back inside your coat.'),
        ],
      },
      {
        id: 'turn',
        label: 'Turn your back on the road.',
        then: [
          N('You turn round and face the way you came. Behind you the snowflakes close up, softly, like a door being shut.'),
          N('The stone goes quiet. Your Nubbin climbs back inside your coat.'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- A12-17, step 3 scene (night)
  {
    id: 'a12-17-rider-night',
    lines: [
      N('The first birds are singing, and the forest has green buds. Out of it comes a fine horse that Gerda knows: it pulled the golden coach.'),
      N('On it rides a girl in a bright red cap. It’s the robber girl.'),
      RG('I got bored at home. I’m off to see the world. North first, and somewhere else if north’s no good.'),
      N('Two wood pigeons ride on her saddle, and they aren’t tied. They could go whenever they liked, and they don’t.'),
      N('You look at the pigeons, and then at her.'),
      RG('They’re not tied any more.'),
      RG('Mostly.', 'think'),
      ...A17_NEWS,
    ],
    choices: A17_CHOICES,
  },
  // ---------------------------------------------------------------- A12-18, after a12-18-roses-done (keptStone)
  {
    id: 'a12-18-pocket',
    lines: [
      GR('Lodger. Why is your hand always on your pocket?', 'think'),
      N('You look down, and it is. You hadn’t noticed.'),
      GR('Kay kept his hand on that burning-glass of his, all that last winter. I’d not like to see it again.', 'sad'),
    ],
    choices: [
      {
        id: 'habit',
        label: '“Habit.”',
        then: [GR('A habit’s only a thing we’ve stopped noticing. Notice it, then. That’s all I ask.')],
      },
      {
        id: 'keeping',
        label: '“Something I’m keeping.”',
        then: [GR('Keeping is fine. Just make sure it’s you doing the keeping, and not the other way about.', 'soft')],
      },
      {
        id: 'hand',
        label: 'Say nothing. Take your hand out of your pocket.',
        then: [N('You take your hand out. It’s cold, and Grandmother holds it in both of hers until it isn’t.')],
      },
    ],
  },
  // ---------------------------------------------------------------- A12-18, complete (night)
  {
    id: 'a12-18-complete-night',
    lines: [
      N('A wood pigeon comes down out of the sky and lands on the roses in the gutter. Nothing is tied to its leg, and it stays.'),
      N('It might be one of the robber girl’s, and it might not. Either way, nobody tied it, and it chose this.'),
      N('Your Nubbin, in its red cap, sits down beside it, and they look out over the rooftops together.'),
      ...A18_END,
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads keptStone and cinder and writes no Grove flag. */
export const ATLAS_A12_FLAGS: string[] = [
  'a12-01',
  'a12-02',
  'a12-03',
  'a12-04',
  'a12-05',
  'a12-06',
  'a12-07',
  'a12-08',
  'a12-09',
  'a12-10',
  'a12-11',
  'a12-12',
  'a12-13',
  'a12-14',
  'a12-15',
  'a12-16',
  'a12-17',
  'a12-18',
  'a12-done', // A12-18: the whole page; read by atlasDone('A12') for the Great Voyage festival
  'a12-nubbin', // no | night (a12-09-keep): A12-10, A12-17, A12-18 and the red cap on the Grove petpet
];

export const ATLAS_A12_CHECKS: string[] = [
  'explore:a12-attic:stairs',
  'place:a12-candle:attic-wall',
  'watch:a12-shadow-show:mirror',
  'carry:a12-watering-can:gutter',
  'craft:a12-peephole:window',
  'watch:a12-window:night',
  'sit:a12-roses:gutter',
  'place:a12-rose-box:gutter',
  'watch:a12-kay:burning-glass',
  'walk:a12-square:sledges',
  'race:a12-sledge:town-gate',
  'watch:a12-queen:rise',
  'sit:a12-gerda:gutter',
  'escort:a12-gerda:river',
  'climb:a12-boat:rushes',
  'talk:a12-old-woman:cherry-house',
  'explore:a12-garden:beds',
  'talk:a12-flowers:beds',
  'talk:a12-raven:hedge',
  'sit:a12-raven:hedge',
  'wait:a12-palace:avenue',
  'climb:a12-back-stairs:palace',
  'inspect:a12-red-bed:chamber',
  'collect:a12-gifts:palace',
  'watch:a12-coach:dark-forest',
  'escort:a12-gerda:robber-castle',
  'choose:a12-nubbin:straw',
  'wait:a12-pigeons:perches',
  'talk:a12-bae:straw',
  'climb:a12-bae:robber-castle',
  'find:a12-hut:snowfield',
  'sit:a12-hut:lamp',
  'carry:a12-fish-letter:hut',
  'deliver:a12-fish-letter:chimney',
  'sit:a12-finnish:stove',
  'talk:a12-finnish:corner',
  'find:a12-bush:red-berries',
  'wait:a12-bush:red-berries',
  'watch:a12-gerda:snowfield',
  'watch:a12-prayer:snowfield',
  'watch:a12-queen:sky',
  'watch:a12-kay:mirror-lake',
  'watch:a12-gerda:great-hall',
  'watch:a12-kay:tears',
  'watch:a12-ice:word',
  'wait:a12-bae:bush',
  'escort:a12-children:south',
  'talk:a12-robber-girl:forest',
  'walk:a12-town:bells',
  'sit:a12-stools:roses',
];
