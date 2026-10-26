/**
 * Three of the side stories that change the campaign of "Hazel’s Grove" (story bible v2). The
 * other campaign-changing stories live elsewhere: S13 and S19 in side-stories-new-3.ts, and the
 * Part M ones (S23, S26, S27) in their own files.
 *
 *   S2  Wisp                  ch3 → ch7 (paid off at the Long Night, ch10)
 *       wisp = spared | driven | sable, s2Done
 *   S9  The Gate That Sticks  ch11 → ch12 morning (after the stone is unmade)
 *       corvinGate = family | guest | shut, s9Done
 *       “family” is offered when at least two of these are true: corvin = reconciled; s3Done;
 *       s6Done; s8Done; millLetter = kept (S13); visitors (S23). If millLetter = kept,
 *       s13-letter-given plays after s9-trowel.
 *   S10 Fourteen Months       ch11 → ch12 (after the final choice)
 *       hazel = secret | told, walk = you | moss | sable | corvin, s10Done
 *
 * The bible overrides every older script. Audience 'all'; no licensed quotes, so no childLines.
 *
 * Timing convention (as in the other side-story files): a step’s `scene` plays the moment the
 * previous step’s `check` is met (straight after the previous `done`), so step scenes here are
 * short bridges, and the big chapter-bound beats sit in `done` scenes, whose checks wait for the
 * right chapter.
 *
 * Branching: Scene and Choice have no condition fields, so every branch is a separate scene in
 * SIDE_STORIES_MAIN_VARIANTS. Each quest’s `notes` says which variant replaces which scene, and
 * when. Choices are never hidden: if a choice must not be offered, a variant scene without it
 * is played instead.
 */
import type { Choice, Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const M = say('moss');
const C = say('corvin');
const H = say('hazel');
const LU = say('luna');
const CL = say('clover');
const FE = say('fern');
const SP = say('sparks');
const EM = say('ember');
const BY = say('byte');
const W = say('wisp');
const YH = say('young-hazel');

// ---------------------------------------------------------------- new speakers
const WISP: Speaker = { id: 'wisp', name: 'Wisp', kind: 'nubbin', basedOn: 'Gollum (The Lord of the Rings)' };
const YOUNG_HAZEL: Speaker = { id: 'young-hazel', name: 'Young Hazel', kind: 'keeper' };

// ================================================================== S2 shared pieces
const S2_NIGHT_LINES: Line[] = [
  N('Night, from Luna’s garden, with the moonflowers open. Two grey shapes sit at the edge of the Grove.'),
  LU('Get down. Listen.', 'soft'),
  N('Wisp is close to Sable, closer than he lets anyone get. Tonight his voice is all whisper.'),
  W('hands are for throwing. they all throw. in the end.', 'soft'),
  W('come back to the dark. no hands there. the dark never threw anyone.', 'soft'),
  N('Sable doesn’t answer. She looks at Wisp. Then she looks at the cottage, at your window.'),
  N('She doesn’t move towards either.'),
  LU('Moss says the cold leaves them half a voice. That’s the only reason he can talk at all.', 'think'),
  LU('And he’s spending every bit of it talking her out of the Grove.', 'angry'),
  N('Clover has crept up behind you in a dressing gown, holding a bag of fruit as if it might go off.'),
  CL('You don’t feed him because he’s earned it. You feed him because you’re you.', 'soft'),
  LU('He bit the hand that carried him, Clover.', 'angry'),
  CL('He was cold. I’d have bitten too.', 'soft'),
  LU('She leaned on a shin this week. A shin. Do you know how far that is, for her?', 'think'),
  LU('One more month of that voice in her ear and she’ll be back under a hedge. She won’t come out twice.'),
  LU('I’m not choosing against him. I’m choosing her. Somebody has to.', 'sad'),
  CL('And where does he go? Back to the dark he keeps talking about. On his own. Talking to nobody.', 'sad'),
  N('Neither of them looks at you. They both very carefully don’t.'),
];

const S2_MOSS_RULE = M('Feed them before you feed yourself. She never said only the good ones. I checked. I was there.', 'soft');

// ================================================================== S9 shared pieces
const S9_GATE_OPEN: Line[] = [
  N('First light. The pond is grey and still. Hazel sits beside it with a cup, her back to the gate.'),
  N('Corvin is at the gate. He has been there all night.'),
  N('There is frost on his shoulders, the ordinary kind that melts.'),
  C('Hazel’s grandchild.', 'soft'),
  N('His hands rest on the top bar. They aren’t blue any more.'),
  N('They shake a little, the way warm hands do in the cold.'),
  N('At the edge of the long grass a grey ear turns towards his voice, and goes flat.'),
];
const S9_GATE_CLOSE: Line[] = [
  C('I know who’s sitting by that pond. I know what I took from her. I’m asking anyway.'),
  N('Behind you, Hazel drinks her tea and does not turn round. She is listening to every word.'),
];
const S9_FAMILY_EXTRA: Line[] = [
  C('Things have been reaching me this week. Left on my wall. Never signed.', 'think'),
  C('A pie, yesterday. I’ve been afraid to eat it, and more afraid not to.'),
  C('I didn’t know what to do with any of it. I still don’t. I kept all of it anyway.', 'soft'),
];

const S9_FAMILY: Choice = {
  id: 'family',
  label: 'Show him the trick. “Lift and push.”',
  set: { corvinGate: 'family' },
  friendship: { luna: 1, clover: 1 },
  then: [
    Y('Lift and push. Both at once. It was never the latch.'),
    N('He looks at you. Then he puts both hands on the bar, lifts the gate a finger’s width, and pushes.'),
    N('It swings open. It sticks again behind him, the way it does for everyone who lives here.'),
    C('…Oh.', 'shock'),
    C('That’s all it ever was.', 'soft'),
    N('He walks to the pond and sits down an arm’s length from Hazel. She hands him the cup without looking.'),
    N('Neither of them says anything. He isn’t very good at it yet. She is.'),
    N('In the long grass, the grey ear is still flat. Not today, then. Perhaps not this year.'),
  ],
};
const S9_GUEST: Choice = {
  id: 'guest',
  label: 'Open it for him. Don’t show him how.',
  set: { corvinGate: 'guest' },
  then: [
    N('You lift and push, and the gate opens. He watches your hands, and you turn them so he can’t quite see.'),
    C('Thank you.', 'soft'),
    C('I’ll have to knock, every time. That’s right. That’s more than right.', 'think'),
    N('By the pond, Hazel lifts one hand a few inches and lets it fall. It might be a wave.'),
  ],
};
const S9_SHUT: Choice = {
  id: 'shut',
  label: 'Leave it shut.',
  set: { corvinGate: 'shut' },
  friendship: { ember: 1 },
  then: [
    N('You don’t move. He looks at you, then at the latch, and nods, as if you’ve told him the time.'),
    C('Yes. All right. Yes.', 'sad'),
    C('It ought to cost something. I’d think less of the place if it didn’t.', 'think'),
    C('Thank you for taking the trowel. I mean that.', 'soft'),
    N('He takes his hands off the gate one at a time. He goes down the lane, and is gone before Sparks arrives.'),
    N('By the pond, Hazel finishes her tea. She sits a while longer than she needs to.'),
  ],
};

// ================================================================== S10 shared pieces
const S10_POSTS_START: Line[] = [
  N('At the stream lantern she laughs at nothing at all, and then explains that Briar would have.'),
  H('Briar’s. You can’t stand here and be gloomy. People have tried.', 'happy'),
  N('At the old wall she says nothing. She puts her hand flat on the post, the way you’d touch a sleeping friend.'),
  H('Hush’s. For keeping. I kept a great deal here, one way and another.', 'soft'),
];

/* At the long-grass post Hazel asks the one question she has never asked anyone. Both answers are honest. */
const S10_POST_ASK: Line[] = [
  H('Can I ask you something? I’ve never asked anyone. There’s never been anyone to ask.', 'think'),
  H('Should I have gone after him? That night. Instead of wedging a gate and waiting.', 'soft'),
];
const s10PostChoices = (last: Line): Choice[] => [
  {
    id: 'waited',
    label: 'You were right to wait. He had to come back on his own.',
    set: { 's10-post': 'waited' },
    then: [
      H('Maybe. It’s a very comfortable answer. I’ve been suspicious of it for twenty-two years.', 'think'),
      H('But you can’t carry anyone back. I’ve tried, with Nubbins. They only ever walk.', 'soft'),
      last,
    ],
  },
  {
    id: 'gone',
    label: 'Somebody should have gone after him.',
    set: { 's10-post': 'gone' },
    then: [
      H('Yes. Some nights I think so too.', 'sad'),
      H('I’d have dragged him home by the ear, and he’d have hated me properly, and the valley might never have gone grey.', 'think'),
      H('Or I’d have stood in that cold garden long enough to start liking the quiet. I don’t know. I never will.', 'soft'),
      last,
    ],
  },
];

const S10_NIGHT_SECRET: Line[] = [
  N('You walk her home. At the cottage door she stops, with one hand on the frame.'),
  H('Tomorrow they’ll all come. You’ll tell them what the Grove is going to be. I want to hear you say it.'),
  H('After that, nobody fuss. I mean it.', 'soft'),
  H('They still think I’m here for the holidays. Let them. It’s been lovely, being ordinary.', 'happy'),
  N('She goes in. Through the window you see her sit on the edge of the bed for a long time before she lies down.'),
];
const S10_NIGHT_TOLD: Line[] = [
  N('You walk her home. The Keepers have stayed late by the pond, and none of them wants to be the first to leave.'),
  N('Hazel sends them home one by one, like a teacher at the end of a long day.'),
  H('Look at them. Lumps. Every one of them.', 'happy'),
  H('Tomorrow you’ll tell them what the Grove is going to be.'),
  H('They can walk me to the bottom. Not one step further. Tell them. They listen to you.', 'soft'),
  N('She goes in. Down the lane, somebody is crying very quietly, and somebody else is passing them a handkerchief.'),
];

const S10_FOOT_LINES: Line[] = [
  N('The foot of the hill path. The grass is long here. It is the exact place she always stopped for breath.'),
  N('She looks back at the Grove once: the pond, the gate, the four posts.'),
  H('It looks like somebody lives here. It hasn’t looked like that for a long time.', 'soft'),
  H('Now, then. I can walk up on my own. I’d rather not.', 'soft'),
  H('Who’s coming?'),
];

/* Each choice only decides who walks. The walk itself is the campaign scene c12-walk-<walk>
 * (campaign-book3.ts), which plays straight after this one. */
const WALK_YOU: Choice = {
  id: 'walk-you',
  label: 'Just me, Gran.',
  set: { walk: 'you' },
  then: [H('Good. The quiet way. I like the quiet way.', 'soft')],
};
const WALK_MOSS: Choice = {
  id: 'walk-moss',
  label: 'Moss. He’s already decided.',
  set: { walk: 'moss' },
  then: [H('Him? Of course he has. He decided about me forty years ago and never once checked.', 'happy')],
};
const WALK_SABLE: Choice = {
  id: 'walk-sable',
  label: 'Sable.',
  set: { walk: 'sable' },
  then: [H('The grey one? …Yes. I’d like that very much.', 'soft')],
};
const WALK_CORVIN: Choice = {
  id: 'walk-corvin',
  label: 'Corvin. Let him carry the lantern.',
  set: { walk: 'corvin' },
  then: [H('Corvin. …Yes. He used to carry it for me. Somebody fetch him before he talks himself out of it.', 'soft')],
};

/**
 * The foot of the hill, with exactly the walk choices that are allowed.
 * Id: 's10-foot' plus '-' and the letters m (Moss can walk), s (Sable can), c (Corvin can),
 * in that order, e.g. 's10-foot-ms'. With none of them it is plain 's10-foot' (you alone).
 */
const s10Foot = (moss: boolean, sable: boolean, corvin: boolean): Scene => {
  const tag = (moss ? 'm' : '') + (sable ? 's' : '') + (corvin ? 'c' : '');
  if (!tag) {
    // Nobody else can walk, so there is nothing to choose: a line, with walk = you set on exit.
    return {
      id: 's10-foot',
      lines: [
        ...S10_FOOT_LINES.slice(0, -1),
        H('Just you, then. Good. The quiet way. I like the quiet way.', 'soft'),
      ],
      set: { walk: 'you' },
    };
  }
  const choices: Choice[] = [WALK_YOU];
  if (moss) choices.push(WALK_MOSS);
  if (sable) choices.push(WALK_SABLE);
  if (corvin) choices.push(WALK_CORVIN);
  return { id: tag ? `s10-foot-${tag}` : 's10-foot', lines: S10_FOOT_LINES, choices };
};
const S10_FOOT_ALL = s10Foot(true, true, true);
const S10_FOOT_VARIANTS: Scene[] = [];
for (const m of [false, true])
  for (const s of [false, true])
    for (const c of [false, true]) if (!(m && s && c)) S10_FOOT_VARIANTS.push(s10Foot(m, s, c));

const S10_LETTER: Line[] = [
  N('Morning. Your Nubbins are up before you. The gate is stuck. You lift and push.'),
  N('Her lantern is back on the hook by the cottage door. Somebody brought it down at first light.'),
  N('You haven’t lit it yet.'),
  N('On the signpost, under the stone, where the first one was: a letter in your grandmother’s hand.'),
  H('“If you’re reading this, I’ve gone up the hill, and this time I’m staying. Don’t be dramatic about it.”', 'soft'),
  H('“Be a little dramatic. I’ve earned a little.”', 'happy'),
  H('“You kept my three rules, more or less, which is more than I did. Here’s a fourth, because I can’t help myself.”'),
  H('“Show up. Every morning, same stuck gate, same stubborn chin. That’s all a Grove ever was. The rest is fruit.”', 'soft'),
  H('“Tell Fern to prune the trees. Tell Sparks the hair grows back. Tell Byte his shoelaces are untied.”', 'happy'),
  H('“Leave fruit at the edge for the ones in the long grass. You won’t always see who eats it. Leave it anyway.”', 'soft'),
  H('“If he came to the gate, you’ll have decided about Corvin by now. Whatever you decided, I’d have done it worse.”', 'think'),
  H('“I’m not sorry. I’m sorry it’s now. Both are true. You knew that already.”', 'soft'),
  H('“Love, Gran. P.S. The gate sticks. You know the rest.”', 'happy'),
];

// ================================================================== the quests
export const SIDE_STORIES_MAIN: Quest[] = [
  // ================================================================== S2
  {
    id: 's2',
    code: 'S2',
    title: 'Wisp',
    source: 'The Lord of the Rings: the wretched creature spared out of pity',
    audience: 'all',
    trigger: {
      where: 'The edge of the long grass, where you leave fruit for Sable',
      when: 'Chapter 3, the morning after you first leave fruit out for Sable (after c3-open). The decision falls in chapter 7.',
    },
    speakers: [WISP],
    steps: [
      // ------------------------------------------------ 1. chapter 3: the thief
      {
        id: 's2-step1',
        goal: 'Sit up after dark by Sable’s fruit, and keep still.',
        hint: 'Leave fruit at the edge of the long grass, then wait nearby at night without moving.',
        check: 'watch:night:sable-fruit',
        scene: {
          id: 's2-fruit',
          lines: [
            N('Morning. The fruit you left for Sable is gone.'),
            N('That would be good news, but Sable is curled in the long grass looking thinner, not fatter.'),
            N('There is frost on the grass round her, though it is nearly midsummer.'),
            LU('You’ve seen the frost. Good. Most people see frost at midsummer and go in for a cardigan.', 'think'),
            LU('I saw her eat one piece last night. Then something else came out of the dark and took the rest.'),
            LU('Not shared. Took.'),
            Y('Another Nubbin?'),
            LU('A grey one. Thinner than her. He moves like he’s always expecting a boot.', 'sad'),
            LU('Sit up tonight. Leave the fruit where you always do, and keep still. Still as a post.'),
            LU('He wants something here. I’d like to know what, before he takes it.'),
          ],
        },
        done: {
          id: 's2-thief',
          lines: [
            N('Past midnight. Sable creeps out of the grass to the fruit and takes one bite.'),
            N('Then the grass parts again, and something comes through: grey, thin as a stick, one ear torn to a fringe.'),
            N('He shoulders her aside, not hard, and drags the fruit towards the dark. Sable lets him.'),
            N('Then he sees your lantern. He creeps to it and presses his cheek against the warm glass.'),
            N('He is shaking. He keeps shaking, even there.'),
            N('Then he sees you.'),
            W('Hsss. Hers. Not yours. Not hands.', 'angry'),
            N('And under the hiss, much smaller, another voice.'),
            W('…she ate. she ate today. good.', 'soft'),
            N('He is gone before you can breathe out. Sable looks at the place where he went for a long time.'),
            LU('Greys don’t talk. They don’t. I’ve known a dozen.', 'shock'),
            LU('Something’s talking through the cracks in that one. Two somethings.', 'think'),
            LU('Call him Wisp. He’ll hate it. Everyone should have a name they hate a little.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 2. chapters 3–6: warm things go missing
      {
        id: 's2-step2',
        goal: 'Keep an eye on Wisp. When the weather turns, find where he sleeps.',
        hint: 'This picks up in the chapter 6 rain. The warm things went somewhere warm.',
        check: 'find:wisp:rain',
        scene: {
          id: 's2-missing',
          lines: [
            N('Over the next days, things go missing from the Grove. Not only fruit now. Warm things.'),
            FE('Someone’s had my left glove. Left me the right. I can’t decide if that’s cruel or considerate.', 'think'),
            N('Your left sock, off the line. A candle stub from the cottage window. The tea cosy, which nobody will admit to missing.'),
            N('And the round stone Hazel kept by the hearth for warming eggs. Its dish is empty.'),
            CL('He’s cold. That’s all it is. Can’t we feed him too? I can see the light through his ears.', 'sad'),
            LU('Shoo him off, Clover. I mean it.', 'angry'),
            LU('Every time Sable gets near a hand, he hisses at it. And she listens. She was taught to listen to that voice.'),
            CL('He was taught too. Somebody taught him.', 'soft'),
            LU('…I know. It doesn’t make him any quieter.', 'sad'),
            N('In the fork of the fruit tree, Wisp licks his torn ear and watches you, with the patience of something that has been right before.'),
          ],
          choices: [
            {
              id: 'feed-both',
              label: 'Put down two piles of fruit: one each.',
              set: { 's2-early': 'fed' },
              friendship: { clover: 2 },
              then: [
                N('Wisp waits until you are far away and eats his pile. Then he eats most of hers.'),
                CL('That’s not quite how I pictured it. But he did eat.', 'sad'),
              ],
            },
            {
              id: 'shoo',
              label: 'Clap your hands and shoo him off.',
              set: { 's2-early': 'shooed' },
              friendship: { luna: 2, clover: -1 },
              then: [
                N('Wisp bolts to the edge of the grass and no further. Sable flinches at the clap too.'),
                LU('Not the hands. Never the hands. Use your voice next time.', 'think'),
              ],
            },
            {
              id: 'wait',
              label: 'Sit down where you are, and wait.',
              set: { 's2-early': 'waited' },
              friendship: { luna: 1, clover: 1 },
              then: [
                N('You sit. Wisp hisses until he runs out of hiss, and Sable eats, watching you both.'),
                LU('That works on her. I didn’t know it worked on him.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 's2-rain',
          lines: [
            N('It has rained for a day and a night. The stream is over its stones, brown and loud.'),
            N('Behind the cottage, where the chimney bricks hold the day’s heat, the woodpile has slumped into a pool.'),
            N('Under it is a nest, or what is left of one: Fern’s glove, the sock, the tea cosy, all sodden through.'),
            N('And Wisp, on the last dry log, shaking so hard the water ripples round him. Hazel’s egg stone is in his paws.'),
            W('mine. warm. mine.', 'soft'),
            W('…was warm. was.', 'soft'),
            N('He tries to stand, and his legs fold. He is too cold to hiss.'),
            CL('The bathhouse is warm. Hazel kept it warm for exactly this. Please.', 'sad'),
            LU('If you carry him, he’ll fight. Hold him anyway. Hold him like you expected it.', 'soft'),
            N('Across the yard, in the long grass, Sable is watching. She has seen hands pick up a Nubbin before.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Pick him up. Hold on.',
              set: { 's2-carried': true },
              friendship: { clover: 2, luna: 1 },
              then: [
                N('He fights, then stops fighting. He weighs less than the stone he won’t let go of.'),
                N('In the steam of the bathhouse his fur lifts and his eyes go sharp. He looks at your hands, and bites one, hard.'),
                W('Hsss. Hands. Hands, hands.', 'angry'),
                N('He scrambles to the warmest corner with the stone, and glares until his tail stops dripping.'),
                CL('He’s warm now. Look at him. Warm right through.', 'soft'),
                N('He is. And he is still shaking.'),
              ],
            },
            {
              id: 'clover',
              label: 'Fetch a blanket, and let Clover lift him.',
              set: { 's2-carried': false },
              friendship: { clover: 1 },
              then: [
                N('Clover wraps him up like a loaf and carries him in at a run, talking to him the whole way.'),
                N('In the steam of the bathhouse his fur lifts and his eyes go sharp. He bites her, hard, through the blanket.'),
                CL('Ow. Yes. All right. That’s fair.', 'sad'),
                N('He scrambles to the warmest corner with the stone. He is warm now, right through.'),
                N('And he is still shaking.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 3. chapter 7: the decision
      {
        id: 's2-step3',
        goal: 'Keep winning Sable’s trust. Wisp is never far from her.',
        hint: 'This picks up in chapter 7. Once Sable leans on you, visit Luna’s night garden after dark.',
        check: 'night:luna-garden:chapter-7',
        scene: {
          id: 's2-number',
          lines: [
            CL('Warm. Dry. Fed. And look at him.', 'sad'),
            LU('…Then it was never the cold.', 'sad'),
            N('Nobody says anything for a while. The rain drums on the bathhouse roof.'),
            N('High on Wisp’s flank, half washed off, is a number someone once painted on in grey.'),
            LU('That paint. I’ve seen that paint before. Square numbers, very neat.', 'think'),
            LU('I’m going to ask around. Don’t tell Sable. I know that’s silly.'),
            N('When you come out, Sable is by the bathhouse door. She sniffs your hands very carefully, and doesn’t run.'),
          ],
        },
        done: {
          id: 's2-night',
          lines: S2_NIGHT_LINES,
          choices: [
            {
              id: 'spared',
              label: 'Keep feeding him. Even after the bite.',
              set: { wisp: 'spared' },
              friendship: { clover: 3, luna: 1 },
              then: [
                N('In the morning you put down two piles of fruit, not one. And the next morning, and the one after.'),
                N('Wisp eats his with his back to you. On the fourth morning, he eats it facing you.'),
                W('hands are for throwing. hands are for… not hers. maybe not hers.', 'soft'),
                N('Sable sees. Sable sees everything. She comes one step closer than she did yesterday.'),
                N('It isn’t free. Your other sock goes missing on the fifth morning, and the hiss is still there, most nights.'),
                LU('He’s still talking to her. I can hear him. I hope you’re right.', 'think'),
              ],
            },
            {
              id: 'driven',
              label: 'Drive him off. Sable needs the quiet.',
              set: { wisp: 'driven' },
              friendship: { luna: 2, clover: -3 },
              then: [
                N('You walk at him, steady, not fast, until he backs into the long grass. Then further. Then gone.'),
                W('Hsss. See? See? Hands.', 'angry'),
                N('Sable watches him go and doesn’t follow. She doesn’t look at you for the rest of the night, either.'),
                N('But near dawn she eats her whole pile, every scrap, and sleeps in the open where you can see her.'),
                LU('It was the sensible thing. I keep telling myself so.', 'sad'),
                CL('I know it was. I’m still not speaking to you till Thursday.', 'sad'),
              ],
            },
            {
              id: 'sable',
              label: 'Let Sable decide.',
              set: { wisp: 'sable' },
              friendship: { luna: 3, clover: 3 },
              then: [
                N('You put down one pile of fruit between them, and step back.'),
                N('Sable looks at it, then at you. Then she pushes half the pile across the grass with her nose, to Wisp.'),
                W('…hers. she gave. hers.', 'soft'),
                N('He eats it at the very edge of the Grove. When he has finished, he doesn’t leave. He just doesn’t come in.'),
                LU('Well. That’s a better answer than either of ours.', 'soft'),
                CL('Or we’ve just handed the smallest one here the biggest choice, because we couldn’t make it.', 'think'),
                LU('…Yes. That too.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 's2-complete',
      lines: [
        N(
          'Morning. Frost on the grass at the edge of the Grove, in two small circles where two grey things slept.',
        ),
        N(
          'Wisp is curled in one of them, the egg stone between his paws. It has been cold for weeks. He keeps it anyway.',
        ),
        FE(
          'He’s given me back my left glove. Now the right one’s gone. I think it’s a rotation.',
          'happy',
        ),
        N('Under the cottage step, something hisses. It sounds pleased with itself.'),
        M('He’ll never give that back, you know. Not if he lives to be as old as me.', 'think'),
        S2_MOSS_RULE,
        N('…'),
        M('Grey things remember who fed them. That’s all I’ll say. I’m old, and I’ve seen it go both ways.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 's2-wisp-stray',
        kind: 'feature',
        label: 'Wisp at the edge',
        description:
          'If you spared him or let Sable decide, Wisp settles under the cottage step as a stray who can be recruited.',
      },
      {
        id: 's2-wisp',
        kind: 'flag',
        label: 'Wisp',
        description:
          'Spared, driven off, or Sable’s choice. Decides who unmakes the stone at the Long Night, and adds epilogue lines.',
      },
    ],
    sets: { s2Done: true },
    notes:
      'WISP. A thin grey (Shadow) Nubbin, one ear torn to a fringe, a half-washed grey number on his flank (Corvin’s row ' +
      'paint; hint only, Luna learns where Sable came from in chapter 7 proper). He covets warm things. Greys do not talk: ' +
      'Wisp speaks only with the shard’s echo (bible, The Stillness), in two voices, never more than a few broken words. The ' +
      'hiss: mood angry, capitalised, harsh blip, jagged text box. The whisper: mood soft, lowercase, faint breathy blip. ' +
      'He is warm after the bathhouse and still trembles: the trembling is fear, not cold. Do not stop it anywhere; the ' +
      'first time he is not trembling is the chapter 10 dawn (bible), and that is the payoff. ' +
      'TIMING. Step 1 opens in chapter 3 the morning after the player first leaves fruit for Sable. s2-missing plays ' +
      'straight after s2-thief (it narrates the days that follow). The find:wisp:rain check becomes possible only in the ' +
      'chapter 6 rain, behind the cottage at the woodpile; s2-rain plays there. s2-number plays straight after the carry. ' +
      'The night:luna-garden:chapter-7 check is met at the first night after c7-close (chapter 7’s goal is Sable trust 45, ' +
      'and Moss has explained the Stillness in that chapter, which Luna refers to). s2-night holds the decision; the ' +
      'complete scene plays the next morning. ' +
      'If Sable has left the Grove before the chapter 7 night, the story stops there and wisp stays unset (epilogues read ' +
      'it as never met). No trust penalties: S2 does not slow the campaign. ' +
      'VARIANTS. The complete scene s2-complete is for wisp = spared. For wisp = sable play s2-complete-sable instead; for ' +
      'wisp = driven play s2-complete-driven instead (both in SIDE_STORIES_MAIN_VARIANTS). ' +
      'WHAT IT CHANGES. Nothing in chapters 8 or 9 (no back way, no third-row cameo; chapter 9 has no side-story options). ' +
      'At the Long Night (chapter 10), if wisp is spared or sable, Wisp, who has wanted the warm stone all along, snatches ' +
      'the shard from the bearer at the water’s edge (“mine — warm — mine”) and tumbles into the Wellspring; it unmakes ' +
      '(stoneUnmadeBy = wisp). Otherwise Moss takes it in (stoneUnmadeBy = moss). His hoarding of Hazel’s cold egg stone ' +
      'here is the setup; he never gives it back. Epilogue lines: spared, Sable’s choice, driven off, or never met. ' +
      'Small flags: s2-early (fed | shooed | waited) and s2-carried (bool) pay off in s2-night (src/sim/choice-payoffs.ts): ' +
      's2-early adds one Luna line after “Get down. Listen.”; s2-carried = true adds a narration line after Luna’s bite ' +
      'line, and false (Clover carried him) adds Clover’s “badge” line. ' +
      'HOME. If spared (or Sable’s choice), Wisp sleeps at the edge of the long grass until the story ends, then settles ' +
      'under the cottage step (bible). The bathhouse in s2-rain and s2-number is optional decor; it is never his home.',
  },

  // ================================================================== S9
  {
    id: 's9',
    code: 'S9',
    title: 'The Gate That Sticks',
    source: 'The Lord of the Rings: the fallen apprentice (Saruman) and the one who stole and must come home (Boromir)',
    audience: 'all',
    trigger: {
      where: 'Your gate, at dusk',
      when: 'Chapter 11, Hazel’s second evening home, after the stone has been unmade at the Long Night. Ends on chapter 12’s morning, before c12-open.',
    },
    speakers: [],
    steps: [
      // ------------------------------------------------ 1. chapter 11: the rattle
      {
        id: 's9-step1',
        goal: 'Take the old trowel to Hazel.',
        hint: 'She’s on the cottage step. Give it to her from your bag.',
        check: 'give:item:old-trowel:hazel',
        scene: {
          id: 's9-dusk',
          set: { s9Started: true },
          lines: [
            N('Dusk, on Hazel’s second evening home. The gate rattles.'),
            N('Not the clean clack of someone who knows the trick. A long, uncertain rattle. Then another.'),
            H('That’ll be him.', 'soft'),
            N('Hazel doesn’t get up from the step. She doesn’t look round. Her eyes are shut.'),
            H('Go on. I jammed it so I’d hear him. I’ve heard him. That’s my part done.'),
            N('Corvin Vale is at the gate, hatless, in a coat that has been slept in. No runners behind him. No rows.'),
            N('His hands are on the top bar, red and raw, like hands brought in out of the snow.'),
            C('I can feel them. My hands. I’d forgotten it hurts, coming back. Nobody mentions that it hurts.', 'sad'),
            N('His hand goes to his breast pocket, finds it flat, and comes away. He does it twice while you watch.'),
            N('He lifts the latch and pushes, as anyone would. The gate shifts in its frame, and sticks.'),
            C('It used to open for me. I’d wait, and it would just swing. I thought that meant something.', 'think'),
            C('Wood shrinks in a frost. It was the cold in my pocket. I took it for welcome.'),
            N('He takes something from inside his coat and passes it through the bars, handle first: a trowel, the blade worn thin.'),
            C('Hers. I dug with it, under the long grass, twenty-two years ago. I’ve kept it oiled. Don’t say it’s from me.', 'soft'),
          ],
          choices: [
            {
              id: 'why',
              label: 'Why now?',
              then: [
                C('Because I can feel my hands. I didn’t have a reason before. I had a stone.', 'soft'),
                N('He goes down the lane. He looks back once, at the cottage, where Hazel sits with her eyes shut.'),
              ],
            },
            {
              id: 'come-in',
              label: 'Do you want to come in?',
              then: [
                C('Want. Yes.', 'soft'),
                C('Not tonight. I haven’t asked. If I ever come in, it’ll be because I asked.', 'think'),
                N('He goes down the lane, and doesn’t look back. You think it costs him something not to.'),
              ],
            },
            {
              id: 'take',
              label: 'Say nothing. Take the trowel.',
              then: [
                N('You take it. The handle is warm from his coat.'),
                C('Thank you.', 'soft'),
                N('He goes down the lane. He looks back once, at the cottage, where Hazel sits with her eyes shut.'),
              ],
            },
          ],
        },
        done: {
          id: 's9-trowel',
          lines: [
            N('Hazel turns the trowel over in her hands, and runs her thumb along the worn edge.'),
            H('I wondered where that went. I bought another. It was never as good.', 'think'),
            H('You’ll want the story. You’ve been very good about not asking. It’s been unbearable to watch.', 'happy'),
            H('He came to me at twenty-two, with nothing but months. Clever. Quick. Hungry, in a way I took for keen.'),
            H('He found the old clay tablets in this cottage. Older than me. Older than the wall. They told him where the fourth one lay.', 'think'),
            H('One winter he tried their method on mine. My Nubbins, in my Grove. Quiet as stones, by morning.', 'sad'),
            H('I stopped him. I said things. He said things. I was right, which as you know is very tiring for everyone.'),
            H('That night he opened the gate, let the buyers in, and went with them. Nubbins, and the stone.', 'sad'),
            H('In the morning I wedged the gate.'),
            Y('So he couldn’t get back in.'),
            H('No, love. So I’d hear him if he ever came back.', 'soft'),
          ],
          choices: [
            {
              id: 'hate',
              label: 'How can you not hate him?',
              then: [
                H('I did, for a good while. It’s heavy, hating someone. I had Nubbins to look for, so I put it down.'),
                H('I didn’t forgive him. I just needed both hands.', 'think'),
              ],
            },
            {
              id: 'found',
              label: 'Did you find them? The ones he took?',
              then: [
                H('Most. It’s in the register. The rest I stopped looking for, one winter. I’ve never forgiven myself for stopping.', 'sad'),
              ],
            },
            {
              id: 'sit',
              label: 'Sit down next to her. Say nothing.',
              then: [
                N('You sit. She leans, just a little, so that your shoulders touch.'),
                H('There. Better than anything you could have said. Don’t let it go to your head.', 'soft'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------ 2. chapter 11: he asks
      {
        id: 's9-step2',
        goal: 'Go down to the gate at dusk tomorrow.',
        hint: 'Corvin comes at sundown. Stand by the gate. You don’t need to open it.',
        check: 'talk:corvin:gate:dusk-2',
        scene: {
          id: 's9-yours',
          lines: [
            N('She sets the trowel on the step beside her, blade down, as if it might get away.'),
            H('He’ll be back tomorrow at dusk. Same time. He was always a creature of habit. That was half the trouble.'),
            H('I’m not going down there. I’ve done my part. I listened for twenty-two years.', 'soft'),
            H('It’s your gate now. Don’t look at me like that. I only wedged it.', 'happy'),
            Y('What do I say to him?'),
            H('Nothing, to start with. Rule three works on people too. It works on people worst of all.', 'think'),
          ],
        },
        done: {
          id: 's9-ask',
          lines: [
            N('Sundown. He is there before you, as if he never left. Perhaps he didn’t.'),
            C('I’ve been practising this. In the lane. Out loud. A sheep heard most of it.', 'think'),
            N('He puts both hands on the top bar. He doesn’t try the latch.'),
            C('Twenty-two years ago I stood here and opened this gate for men with carts. I didn’t ask anyone.'),
            C('I’ve opened every gate since. Mine. The Circuit’s. Other people’s. I never once had to ask.'),
            C('So.'),
            N('…'),
            C('I would like to come in.', 'soft'),
            N('He says it to the gate, not to you. Then he looks up, and says it again, to you.'),
            C('I would like to come in. I don’t expect it. I’m only asking.', 'soft'),
            C('I’ll stand here till first light. If it’s still shut then, I’ll understand. I’ll understand better than anyone.'),
            N('He lets go of the bar and steps back into the lane, out of the lamplight. He doesn’t go far.'),
          ],
        },
      },
      // ------------------------------------------------ 3. chapter 12 morning: the gate
      {
        id: 's9-step3',
        goal: 'Be at the gate at first light, before the others come.',
        hint: 'Chapter 12 begins at dawn. Go to the gate before anything else.',
        check: 'reach:gate:dawn:chapter-12',
        scene: {
          id: 's9-word',
          lines: [
            N('Word gets round, as it does in a valley this size. By supper, everyone knows Corvin Vale has asked to come in.'),
            EM('He took Ash. I’m not telling you what to do. I’m telling you what he did. That’s different.', 'angry'),
            EM('And some of what sleeps in your long grass came out of his rows. They live on your side of that gate too.', 'think'),
            LU('Sable came out of his garden. I keep thinking that. And then I keep thinking: she came out.', 'think'),
            FE('I’d let him in. Then I’d lie awake all night. Both of those are true, so I’m no use to you whatsoever.', 'think'),
            CL('The grey stays, you know. On him too, I expect. You can only make it lighter.', 'soft'),
            BY('For the record, I’ve modelled it. Redemption has a terrible base rate.', 'think'),
            BY('I’d still open the gate. I don’t know why. Don’t put that in the record.'),
            N('Hazel says nothing at all. On her way out to the pond, she leaves the cottage door on the latch, which she never does.'),
          ],
        },
        done: {
          id: 's9-gate',
          lines: [...S9_GATE_OPEN, ...S9_GATE_CLOSE],
          choices: [S9_GUEST, S9_SHUT],
        },
      },
    ],
    complete: {
      id: 's9-complete',
      lines: [
        N('Sparks arrives first, at a run, as always. Then Fern, then everyone: a whole valley coming up the lane.'),
        N('One by one they lift and push. The gate opens for each of them, and sticks again behind them.'),
        H('Good gate, that. I never did unwedge it.', 'soft'),
        N('She doesn’t say anything else about it, then or ever. You understand that this is how she says it’s finished.'),
      ],
    },
    rewards: [
      {
        id: 's9-corvin-gate',
        kind: 'flag',
        label: 'corvinGate',
        description:
          'family, guest or shut: whether Corvin learns the trick, is let in as a guest who must knock, or is left outside.',
      },
      {
        id: 's9-chair',
        kind: 'decor',
        label: 'Corvin’s chair by the pond',
        description: 'With corvinGate = family, a plain wooden chair appears by the pond, an arm’s length from Hazel’s spot.',
      },
      {
        id: 's9-epilogue',
        kind: 'feature',
        label: 'The gate in the epilogue',
        description:
          'Every ending gains a Corvin line: Sundays by the pond (family), short knocked visits (guest), the lane (shut), or an empty chair by the pond (not started).',
      },
    ],
    sets: { s9Done: true },
    notes:
      'THEME. A man who stole the cold, and now has to ask to come in. Corvin is thawed because the shard has been unmade: ' +
      'his hands are warm and hurt. He never once asks before s9-ask; that line is the whole story. ' +
      'FLAG. corvinGate, not corvin: chapter 9’s corvin (reconciled | bargained | forced) is untouched. ' +
      'AVAILABILITY. Opens only if the stone was unmade at the Long Night (keptStone false); if kept, Corvin never thaws ' +
      'and S9 never starts. Plays on every chapter 9 route, the Collector partner route included. Moss is not in this ' +
      'story (he may have faded at the Long Night); Hazel is home. ' +
      'TIMING. Step 1 opens at dusk on Hazel’s second evening home in chapter 11 (her first evening belongs to S10’s step ' +
      'scene). Give the player the item old-trowel when s9-dusk ends. s9-dusk is Corvin’s first arrival after the Long ' +
      'Night (bible): he tries the latch and it sticks. s9-yours plays straight after s9-trowel (after ' +
      's13-letter-given, when that plays). The ' +
      'talk:corvin:gate:dusk-2 check is the next dusk. s9-word plays straight after s9-ask, that evening. ' +
      'THE EVE OF CHAPTER 12. The night of s9-ask is the eve of chapter 12: chapter 11’s close (c11-close) waits until ' +
      's9-ask has played, or until S9 cannot start (keptStone), or until S9 is still on step 1 or 2 at the dusk after ' +
      'threeFriends is met (then c11-close plays that evening, c11-gate is skipped, and S9 jumps to its dawn gate scene ' +
      'before c12-open); see the engine backlog. After c11-close, the campaign ' +
      'scene c11-gate plays: Corvin is back at the gate, tries the latch once for form’s sake, and it sticks. Hazel’s ' +
      'stance there is the same as here (it’s your gate now; she has done her part). He stands there till first light, ' +
      'as he says in s9-ask. The reach:gate:dawn:chapter-12 check is chapter 12’s first light; the gate scene and the ' +
      'complete scene both play before c12-open. If chapter 12 begins before step 2 is done, skip to the gate scene ' +
      'anyway (he still comes). ' +
      'THE MILL LETTER. If millLetter = kept (S13, The Mill Cellar), the short scene s13-letter-given plays straight after ' +
      's9-trowel, before s9-yours: you give Corvin his father’s letter now that he can feel again. That scene is written in ' +
      'the S13 file, not here. With millLetter burned or grave, or S13 not played, nothing extra plays. ' +
      'THE FAMILY GATE (variant scenes). Count how many of these six are true: corvin = reconciled; s3Done; s6Done; ' +
      's8Done; millLetter = kept; visitors (S23). If the count is 2 or more, play s9-gate-family ' +
      '(SIDE_STORIES_MAIN_VARIANTS) in place of the done scene s9-gate. It adds two Corvin lines about things reaching ' +
      'him from the valley (the stories that tell the truth about the Midsummer race, bring Ash home, find Bramble, carry ' +
      'his father’s letter to him, or send the wardens’ echoes to his door). The lines are worded so they hold for any ' +
      'two of the six. It offers family | guest | shut. Otherwise s9-gate plays, offering only guest | shut. No choice ' +
      'is ever hidden; the variant is the gate. ' +
      'BOTH SIDES. The gate scene must not lean: his warm, shaking hands argue for opening; the grey ear in the long grass ' +
      'that flattens at his voice argues for shutting (it stays flat even on family). s9-word gives each side a voice ' +
      '(Ember and Fern for caution, Luna and Byte for the gate). Corvin himself says shutting it is fair. ' +
      'WHAT IT CHANGES. Epilogue lines (family: Sundays by the pond; guest: short visits, he knocks; shut: gone down the ' +
      'lane; not started: an empty chair by the pond). S10: walk = corvin is offered only with corvinGate = family. ' +
      'Chapter 2 continuity: the gate swinging for him was frost shrinking the swollen wood (the shard in his pocket).',
  },

  // ================================================================== S10
  {
    id: 's10',
    code: 'S10',
    title: 'Fourteen Months',
    source: 'The Grey Havens in The Lord of the Rings, and Spiritfarer: a farewell that is prepared for, not sprung',
    audience: 'all',
    trigger: {
      where: 'The cottage step, at dusk',
      when: 'Chapter 11, Hazel’s first evening home (after c11-open). Ends in chapter 12, after the final choice in c12-open.',
    },
    speakers: [YOUNG_HAZEL],
    steps: [
      // ------------------------------------------------ 1. chapter 11: the secret, and wish one
      {
        id: 's10-step1',
        goal: 'Wish one: write your Nubbins into Hazel’s hatch register.',
        hint: 'The register is on the cottage bookshelf. Open it and add every Nubbin you’ve hatched.',
        check: 'write:hatch-register:your-nubbins',
        scene: {
          id: 's10-step',
          lines: [
            N('Dusk, her first evening home. Hazel is on the cottage step with her boots off and her feet in a bowl of warm water.'),
            N('She is very pleased about the water. She has a blanket round her shoulders, though the evening is mild.'),
            H('Sit. Not there. There. I like to see the pond.'),
            H('A year, the doctor said. I’ve had fourteen months. I’m going to make him buy me a cake.', 'happy'),
            N('She says it the way she’d say the weather. Then she watches to see how you take it.'),
            H('Don’t be brave at me. I’ve been brave at myself for fourteen months. It’s exhausting.', 'think'),
            H('I want three things before I go up the hill. Small ones. I’ve written them down, so don’t argue.'),
            N('A seed packet, from her apron pocket. Three lines on the back, in pencil. The third has a little drawing.'),
            H('But first, a favour. Don’t tell them. The valley. Sparks, Fern, any of them.', 'think'),
            H('I want them to come round and argue about races and the weather. I don’t want a week of goodbyes.'),
            H('So. Will you keep it? It’s a big thing to ask. I’m asking anyway.', 'soft'),
          ],
          choices: [
            {
              id: 'secret',
              label: 'I’ll keep it. They’ll hear it from you, or not at all.',
              set: { hazel: 'secret' },
              then: [
                H('Good. Thank you.', 'soft'),
                H('I’ll leave them something. I’m good at letters. You may have noticed.', 'happy'),
                N('She wiggles her toes in the water, and that, apparently, is the end of that.'),
                N('Over the hedge, Sparks waves and shouts something about Saturday’s race.'),
                N('You wave back. It weighs a great deal.'),
                H('Number one. Write yours in my register. All of them. I want them in the book before I go.'),
              ],
            },
            {
              id: 'told',
              label: 'They love you. They should get to say goodbye.',
              set: { hazel: 'told' },
              then: [
                H('…They’ll be dreadful about it. Clover will cry on me. Sparks will try to fix it.', 'think'),
                H('Byte will bring a graph.'),
                H('Fine. Tell them. Tell them to be normal about it, and when they aren’t, tell them again.', 'soft'),
                H('Number one. Write yours in my register. All of them. I want them in the book before I go.'),
              ],
            },
          ],
        },
        done: {
          id: 's10-register',
          lines: [
            N('Hazel reads your pages slowly, a finger under each line, the way she reads seed catalogues.'),
            H('Oh, that’s a terrible name. I love it.', 'happy'),
            H('“Hatched in a hurry”? They all hatch in a hurry, love. Write the weather. You’ll want the weather, later.'),
            N('Under your last line she takes the pencil and writes one more, small and firm.'),
            N('“Keeper from this page on,” it says, and then your name.'),
            H('There. Now it’s in the book. Things in the book stay.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------ 2. wish two: one race
      {
        id: 's10-step2',
        goal: 'Wish two: enter any race while Hazel watches from the back row.',
        hint: 'Open Races from the top bar. Any course, any tier. Winning doesn’t matter.',
        check: 'race:enter:any:hazel-watching',
        scene: {
          id: 's10-wish2',
          lines: [
            H('Number two. One race. I want to sit in the stands with a terrible pie, like a normal person.', 'happy'),
            H('Forty years, and I never once sat at the back. Always in the gap, or down at the rail, being a nuisance.'),
            SP('Hazel’s coming to a race? HAZEL’S coming to a RACE?', 'shock'),
            N('Sparks has appeared from nowhere, as she does, holding a flag. Nobody knows where she got the flag.'),
            SP('I’m saving you a seat. Front row. I’ll fight Ember for it. I’ll lose, but I’ll fight her.', 'happy'),
            H('Sparks, love. I want to sit at the back.'),
            SP('…Back row. I’ll fight Ember for the back row.'),
            H('Bring whichever one wants to go. Fast or slow. I don’t mind about winning. I never did, whatever they tell you.', 'soft'),
            SP('She minded. She once threw a hat at a finish line.', 'think'),
            H('It was a very small hat.'),
          ],
          choices: [
            {
              id: 'fast',
              label: 'Bring the fast one. Give her something to shout about.',
              set: { 's10-racer': 'fast' },
              then: [H('Oh, you’re cruel. I’ll be hoarse by the second bend. Good.', 'happy')],
            },
            {
              id: 'slow',
              label: 'Bring the slow one. The one who stops to look at things.',
              set: { 's10-racer': 'slow' },
              then: [
                H('The dawdler? Oh, good. We’ll be there all afternoon. I’ll get a second pie.', 'happy'),
                SP('Back row’s got the best view of the last place. I’ve always said so. I’ve never said so.'),
              ],
            },
          ],
        },
        done: {
          id: 's10-cheer',
          lines: [
            N('The usual roar from the stands, and under it, from the back row, one voice that carries over all the others.'),
            N('Sparks, beside her, shouted herself hoarse on the first lap and has been cheering in mime ever since.'),
            N('Win or lose, when you come off the course Hazel is on her feet, holding half a pie, beaming.'),
            H('That one runs for you. Don’t ever spend that.', 'soft'),
            H('You can spend Shells. You can spend time. You can spend a perfectly good pie, and I have. Never that.', 'happy'),
            N('She sits down again rather suddenly, and stays sitting while the stands empty. Nobody hurries her.'),
          ],
        },
      },
      // ------------------------------------------------ 3. wish three: the four lanterns
      {
        id: 's10-step3',
        goal: 'Wish three: walk Hazel to the other three lanterns: the stream, the old wall, the long grass.',
        hint: 'Keep to her pace. She stops at each post; stop with her.',
        check: 'walk:lanterns:three:hazel',
        scene: {
          id: 's10-wish3',
          lines: [
            N('Dusk. The last line on the seed packet has the drawing: four little posts in a row, and two stick figures.'),
            H('Number three. Walk the four lanterns with me. Once. Slowly. I’ll be slow whether you like it or not.', 'happy'),
            N('She takes your arm at the pond lantern. Not leaning. Holding.'),
            H('Moss’s post. I’ll tell you something about it, and then you’re not to make a fuss.', 'soft'),
            H('I came here young. I didn’t know one end of a Nubbin from the other, and I was too proud to ask.'),
            N('For a moment the pond is younger, and so is the light. There is snow on the bank.'),
            N('A young woman sits by the frozen pond in a coat too big for her, with a bucket of feed she doesn’t know how to give.'),
            YH('I don’t know what I’m doing. I don’t know what any of this is for.', 'sad'),
            N('A small, old, green-grey thing sits down a little way off. It doesn’t come closer. It doesn’t go away.'),
            N('It sits there the next day, and the next. All that winter it sits beside her, and says nothing at all.'),
            N('At the first thaw she looks down, and it is looking up at her.'),
            M('…You’ll do.', 'soft'),
            N('The light goes back to being now.'),
            H('Rule three. I thought I’d made it up. I’d been on the end of it for a whole winter.', 'soft'),
          ],
        },
        done: {
          id: 's10-lanterns',
          lines: [
            ...S10_POSTS_START,
            N('Then the long grass. The fourth post is lit. It has burned steady since the Long Night, all on its own.'),
            N('Hazel stops. She looks at it for a long time.'),
            H('Twenty-two years I came out every night and looked at this post. Flicker, flicker.', 'soft'),
            H('I stopped hoping, after a while. I never stopped looking. They’re different things. Remember that.', 'soft'),
            N('…'),
            ...S10_POST_ASK,
          ],
          choices: s10PostChoices(H('That was the one I wanted. Thank you, love.', 'soft')),
        },
      },
      // ------------------------------------------------ 4. chapter 12: the walk
      {
        id: 's10-step4',
        goal: 'Tell Hazel what the Grove will be. Then walk with her to the foot of the hill.',
        hint: 'After the final choice in chapter 12, follow Hazel across the Grove to the hill path.',
        check: 'walk:hazel:hill-foot',
        scene: { id: 's10-night', lines: S10_NIGHT_SECRET },
        done: S10_FOOT_ALL,
      },
    ],
    complete: {
      id: 's10-letter',
      lines: [
        ...S10_LETTER,
        N(
          'Behind you, someone lifts and pushes the gate: Fern, with a basket. Then Sparks. Then everyone, one by one.',
        ),
        N(
          'They have come to see why you are standing so still. You hold the letter out. You don’t have to say anything.',
        ),
        N('Byte looks down. His shoelaces are untied.'),
        N('He leaves them.'),
      ],
    },
    rewards: [
      {
        id: 's10-lantern',
        kind: 'decor',
        label: 'Hazel’s lantern',
        description: 'The lantern she carried up the hill. It hangs by the cottage door and can be lit on any night.',
      },
      {
        id: 's10-letter-reward',
        kind: 'item',
        label: 'Hazel’s second letter',
        description: 'Left under the signpost stone, where the first one was. Kept in the Journal beside it.',
      },
      {
        id: 's10-final-scene',
        kind: 'feature',
        label: 'The walk up the hill',
        description: 'Who walks Hazel up the hill becomes the final scene of every ending but the Collector.',
      },
      {
        id: 's10-flags',
        kind: 'flag',
        label: 'hazel, walk',
        description: 'hazel = secret or told; walk = you, moss, sable or corvin.',
      },
    ],
    sets: { s10Done: true },
    notes:
      'REGISTER. Hazel is ill, quietly. Never name an illness, a symptom list, or a word like dying. Show it only in small ' +
      'things: a blanket on a mild evening, sitting down suddenly, the bed’s edge, her pace. She stays funny to the end. ' +
      'TIMING. Step 1 opens on Hazel’s first evening home in chapter 11, after c11-open (S9’s dusk is her second evening). ' +
      'The secret/told choice comes first so that hazel = told can turn the chapter 11 Keeper talks into goodbyes (those ' +
      'lines belong to the chapter 11 script). Steps 2 and 3 run on later chapter 11 days. The wishes are in order but have ' +
      'no deadline inside chapter 11; if chapter 12 begins with wishes unfinished, they lapse quietly and the quest jumps ' +
      'to step 4. STEP 4’S SCENE IS AN EXCEPTION to the timing convention: s10-night (or s10-night-told) does not play ' +
      'straight after s10-lanterns. It plays on the eve of chapter 12, after c11-close (and after c11-gate, when that ' +
      'plays), as you walk Hazel home from the pond; see the engine backlog. Step 4’s check is only possible after ' +
      'c12-open’s final choice; the foot-of-the-hill scene then plays, and the letter (complete) plays the next morning, ' +
      'then the ending. ' +
      'Without S10, the chapter 12 script walks you up alone (bible). Wish three replaces the old “sit by the pond for a ' +
      'minute” wish so it no longer repeats c11-close. ' +
      'THE MEMORY. s10-wish3 holds Moss choosing young Hazel: he sat beside her a whole winter before he said a word. Moss ' +
      'is far older than Hazel; he did not hatch for her. Use the young-hazel portrait, snow, a warm light wash. Moss appears ' +
      'only in this memory and in walk = moss, so the story works if he faded at the Long Night. ' +
      'VARIANTS (all in SIDE_STORIES_MAIN_VARIANTS). ' +
      '(0) s10-wish3 is for a player who has not played S1. If s1Done is true, play s10-wish3-s1 instead: Hazel tells the ' +
      'winter herself and the flashback is not replayed. ' +
      '(1) s10-lanterns is for a lit Long-Grass lantern. If keptStone is true, play s10-lanterns-kept instead (the post still ' +
      'flickers). ' +
      '(2) Step 4’s scene s10-night is for hazel = secret; with hazel = told play s10-night-told instead. ' +
      '(3) The done scene: build the id as s10-foot plus a dash and the letters, in order, m if Moss is still in the ' +
      'world (mossReturned true, or the wisp route with mossFaded false, or the keep route, where he stays on the hill: ' +
      'c11-moss-here or c11-moss-kept), s if Sable is ' +
      'bonded, c if corvinGate = family; with none, plain s10-foot (no choice: a line that sets walk = you). On the keep route (keptStone) Moss ' +
      'stays in the world even when mossFaded is true, and walk = moss there always ends in end-epi-walk-moss-stayed ' +
      '(campaign-book3.ts), faded or not; on unmade routes it ends in end-epi-walk-moss. The quest lists s10-foot-msc (all ' +
      'four); the other seven are variants. Each choice only sets walk; the campaign scene c12-walk-<walk> (campaign-book3.ts) ' +
      'then plays the climb, the top and the way down, so the walk exists in one place. ' +
      'With hazel = told, the Keepers stand silently at the foot of the path in staging and go no further. ' +
      '(4) The complete scene s10-letter is for hazel = secret; with hazel = told play s10-letter-told instead. ' +
      '(4a) LINE VARIANT. With letThemGo (“Open”: c12-open lifts the gate off its hinges), the first line of S10_LETTER, ' +
      '“Morning. Your Nubbins are up before you. The gate is stuck. You lift and push.”, becomes “Morning. Your Nubbins are ' +
      'up before you. There is no gate to stick. You lift and push at the air anyway.” In both letter scenes; and in ' +
      's10-letter-told, “The Keepers are already at the gate.” becomes “The Keepers are already at the gateposts.” ' +
      '(5) THE REGISTER. If S18 put Hazel’s hatch register in the museum’s centre case (s18-centre = register), it is ' +
      'on loan: Professor Delve brings it back to the cottage table for wish one, and step 1’s hint becomes “Professor ' +
      'Delve has brought the register back from the museum. It’s on the cottage table.” ' +
      'WHAT IT CHANGES. walk sets the final scene of every ending except the Collector (see the c12-walk-* and end-epi-walk-* scenes in campaign-book3.ts). hazel ' +
      'decides whether the valley knew. Neither changes Moss’s fading, which the bible fixes at the start of chapter 10. ' +
      'Give the player Hazel’s lantern (decor) when the letter scene ends; it hangs by the door. ' +
      'SMALL FLAGS (flavour only, nothing reads them except optional epilogue colour): s10-racer (fast | slow), from ' +
      's10-wish2, says which Nubbin ran wish two; s10-post (waited | gone), from s10-lanterns / s10-lanterns-kept, is your ' +
      'answer to Hazel’s question at the long-grass post. Neither answer is right; Hazel agrees and doubts with both.',
  },
];

// ================================================================== variant scenes
/** Branch scenes. Each replaces the named scene when its condition holds (see the quests’ notes). */
export const SIDE_STORIES_MAIN_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- S2: replaces s2-complete
  {
    id: 's2-complete-sable',
    lines: [
      N(
        'Morning. Frost on the grass at the edge of the Grove, in two small circles, side by side.',
      ),
      N(
        'Wisp is still at the edge, the egg stone between his paws. He hasn’t come in. He hasn’t gone, either.',
      ),
      FE(
        'He’s given me back my left glove. Now the right one’s gone. I think it’s a rotation.',
        'happy',
      ),
      N('Under the cottage step, something hisses. It sounds pleased with itself.'),
      M('She chose. That’s worth more than anything we’d have chosen for her.', 'soft'),
      S2_MOSS_RULE,
      N('…'),
      M('Grey things remember who fed them. That’s all I’ll say. I’m old, and I’ve seen it go both ways.', 'soft'),
    ],
  },
  {
    id: 's2-complete-driven',
    lines: [
      N(
        'Morning. Frost on the grass at the edge of the Grove, in one small circle where one grey thing slept.',
      ),
      N(
        'In the hedge there is a gap the size of a thin Nubbin, and a sock caught on a thorn. Nobody claims it.',
      ),
      N(
        'Sable sits by the gap for most of the morning. Then she comes back and eats her fruit, all of it.',
      ),
      LU('She’s eating. That’s what we wanted.', 'sad'),
      M('Yes.', 'soft'),
      CL('It’s Thursday. I’m speaking to you again.', 'soft'),
      CL('I’ve hung a blanket on the hedge. In case anyone thin comes past. Nobody in particular.', 'soft'),
      N('…'),
      M('Sensible things are sometimes right. It doesn’t make them warm.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- S9: replaces s9-gate
  {
    id: 's9-gate-family',
    lines: [...S9_GATE_OPEN, ...S9_FAMILY_EXTRA, ...S9_GATE_CLOSE],
    choices: [S9_FAMILY, S9_GUEST, S9_SHUT],
  },
  // ---------------------------------------------------------------- S10: replaces s10-lanterns
  {
    id: 's10-lanterns-kept',
    lines: [
      ...S10_POSTS_START,
      N('Then the long grass. The fourth post flickers, the way it has for twenty-two years.'),
      N('Hazel stops. She looks at it, and then at you, for a long time.'),
      H('Still flickering. Well.', 'soft'),
      H('I stopped hoping, after a while. I never stopped looking. They’re different things. Remember that.', 'soft'),
      N('…'),
      ...S10_POST_ASK,
    ],
    choices: s10PostChoices(H('Thank you for walking it with me. I mean that. Whatever else.', 'soft')),
  },
  // ---------------------------------------------------------------- S10: replaces s10-wish3 (s1Done)
  {
    id: 's10-wish3-s1',
    lines: [
      N(
        'Dusk. The last line on the seed packet has the drawing: four little posts in a row, and two stick figures.',
      ),
      H(
        'Number three. Walk the four lanterns with me. Once. Slowly. I’ll be slow whether you like it or not.',
        'happy',
      ),
      N('She takes your arm at the pond lantern. Not leaning. Holding.'),
      H(
        'Moss’s post. I’ll tell you something about it, and then you’re not to make a fuss.',
        'soft',
      ),
      H('He’ll have told you about the winter. He’ll have left out the fidgeting.', 'happy'),
      H(
        'I counted the hens. I unpicked my mittens. I never once asked him to say a word. It nearly killed me.',
      ),
      H(
        'Then at the thaw he looked up and said “You’ll do”. I was so startled I sat down in the snow.',
        'happy',
      ),
      H(
        'Rule three. I thought I’d made it up. I’d been on the end of it for a whole winter.',
        'soft',
      ),
    ],
  },
  // ---------------------------------------------------------------- S10: replaces s10-night
  { id: 's10-night-told', lines: S10_NIGHT_TOLD },
  // ---------------------------------------------------------------- S10: replace s10-foot-msc
  ...S10_FOOT_VARIANTS,
  // ---------------------------------------------------------------- S10: replaces s10-letter
  {
    id: 's10-letter-told',
    lines: [
      ...S10_LETTER,
      N('The Keepers are already at the gate. By the look of them, none of them slept much.'),
      N('You read it out to them, all of it. Clover cries. Byte checks his shoelaces.'),
      N('They are untied.'),
    ],
  },
];

/** Every flag these stories set or read. */
export const SIDE_STORIES_MAIN_FLAGS: string[] = [
  // set
  'wisp',
  's2-early',
  's2-carried',
  's2Done',
  'corvinGate',
  's9Done',
  'hazel',
  'walk',
  's10Done',
  's10-racer',
  's10-post',
  // read
  'corvin',
  'millLetter',
  's3Done',
  's6Done',
  's8Done',
  'visitors',
  'keptStone',
  'mossFaded',
  'mossReturned',
  's18-centre',
  's1Done',
];

export const CHECKS: string[] = [
  // S2
  'watch:night:sable-fruit',
  'find:wisp:rain',
  'night:luna-garden:chapter-7',
  // S9
  'give:item:old-trowel:hazel',
  'talk:corvin:gate:dusk-2',
  'reach:gate:dawn:chapter-12',
  // S10
  'write:hatch-register:your-nubbins',
  'race:enter:any:hazel-watching',
  'walk:lanterns:three:hazel',
  'walk:hazel:hill-foot',
];
