/**
 * Atlas campaign, page A28: The Box of Stories (Part M, rank 33). Twelve quests, A28-1 to A28-12.
 *
 * SOURCE. The Anansesem, the spider stories of the Akan (Asante) people of Ghana, a living oral
 * tradition, and their Caribbean tellings (the Anancy stories of Jamaica). No rights holder: the
 * tales are traditional and belong to the people who tell them. The only written text used is R. S.
 * Rattray, Akan-Ashanti Folk-Tales (Oxford: Clarendon Press, 1930), Rattray's own "as nearly
 * literal as possible" translation. Rattray died in 1938: out of copyright in the UK since 2009 and
 * in the US public domain since 1 January 2026. The 1930 illustrations by Gold Coast artists are
 * NOT reused (they need a separate check). The Sky-god tale (Rattray's no. 17) is retold in our own
 * words: its full text was not checked.
 *
 * AUDIENCE. 'all'. Each lifted line has a `childLines` replacement for the Learning Grove. The
 * Learning Grove's own versions (both bands, no lifted text) are not in this file.
 *
 * FRAME. Nova's atlas opens at night in an Asante village courtyard: a carved stool, a fire, a ring
 * of listeners. An old storyteller, Nana Ama, begins, and you fall into her tale, where Kwaku Ananse
 * takes you on as his carrier ("a spider has eight legs and nowhere to put a python"). Ananse keeps
 * his story; you hold things, carry things and sit with people. Your Nubbin keeps getting stuck to
 * things (the running gag) and is stung once, on the nose, in A28-4, and holds a grudge. Her voice
 * comes through the trees now and then (A28-1, A28-9). A28-11 turns the page to a Jamaican yard,
 * years later; A28-12 returns to the courtyard, where it is your turn to tell one back. Ananse,
 * Aso, Ntikuma, Ya Nsia, the python, the leopard and the fairy talk, as the tales' own do (canon
 * 31). Your Nubbin never talks. Wisp speaks only as in the Grove: a few broken words in his two
 * voices (canon 17; S2's convention: the whisper lowercase with mood soft, the hiss "Hsss." with
 * mood angry). The shard's echo is a scar, like his grey, so it outlasts the unmaking: the campaign's
 * own end-epi-wisp-spared and -sable keep his voice after stoneUnmadeBy = wisp, and so does this page.
 *
 * GROVE STATE READ (read-only; the Atlas never writes a Grove flag):
 *   - wisp, read when A28-2 starts (A28-8 then goes by a28-wisp; A28-12 reads it again for driven):
 *       spared | sable = Wisp comes, riding in your bag next to his egg stone. The art shows him on
 *         every scene of the page from a28-02-road-wisp on (in your bag, on your shoulder, in a
 *         tree); before that he stays hidden in the bag. The script names him only in the variants:
 *           A28-2:  a28-02-road-wisp replaces a28-02-road (sets a28-wisp = came; the trade is struck).
 *           A28-8:  a28-08-debt-wisp replaces a28-08-debt (sets a28-trade = wisp).
 *           A28-12: a28-12-last-wisp replaces a28-12-last.
 *       driven = Wisp is not there. A28-12: a28-12-last-driven replaces a28-12-last (choice, sets
 *         a28-gate = unknown | back; changes nothing in the Grove).
 *       unset  = Wisp is not there. A28-8's base scene: your Nubbin makes the trade (a28-trade =
 *         nubbin), and A28-12's base a28-12-last pays it off.
 *     A28-12 decides by a28-wisp first (came → -wisp), then by the Grove's wisp (driven → -driven),
 *     else the base, so a save that changes mid-page stays consistent.
 *   - stoneUnmadeBy = wisp: art only. Wisp is not trembling anywhere on the page (no line says he
 *     is). Otherwise he trembles a little in the cold of the night scenes (A28-6's dusk under the
 *     odum tree, A28-11's yard and A28-12's courtyard; A28-10's funeral is by day).
 *   - s24Done: Hazel's margin note, ATLAS_A28_VARIANTS 'a28-margin-hazel', plays once, straight
 *     after a28-01-complete (or the first time the page is opened after s24Done is set, if A28-1 was
 *     already done). From then on the pencil note is drawn in the courtyard margin.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a28-):
 *   - a28-01 … a28-12 on each quest; a28-done on A28-12 (the Grove's story box reads it through
 *     atlasDone('A28')).
 *   - a28-fairy = freed | left | sat (A28-6, a28-06-wait): THE SIGNATURE CHOICE. Paid off in A28-9
 *     (a28-09-scatter-done and variants), A28-10 (a28-10-dance-done and variants) and A28-12
 *     (a28-12-tell and variants). The base scenes are for left.
 *   - a28-wisp = came (a28-02-road-wisp).
 *   - a28-trade = wisp | nubbin (A28-8: who traded with Ananse). The Grove's Wisp-under-the-step
 *     ambient reads it (SIM below).
 *   - a28-gate = unknown | back (a28-12-last-driven only).
 *
 * LIFTED TEXT (public domain; Rattray 1930, checked 2026-10-15 against the Internet Archive scan,
 * item akanashantifolkt0000ratt, OCR text; set with curly apostrophes; brackets Rattray added are
 * dropped on screen, as the outline directs). Every other line is our own:
 *   1. Preface, the storyteller's opening disclaimer: "We don’t really mean to say so; we don’t
 *      really mean to say so." a28-01-stool#1.
 *   2. "How Wisdom Came Among the Tribe", opening: "They say that Kwaku, the Spider, was there,"
 *      (Rattray's small-capital "THEY" set in normal case). a28-09-sweep#1 and a28-12-return#3.
 *   3. The same tale, Ntikuma: "Oh, your eyes have surely died (for shame), would it not have been
 *      better if you had turned round the gourd and put it on your back, then doubtless you would
 *      have been able to climb?" Split over two lines to keep under 160 characters, the bracket
 *      dropped. a28-09-tree#5 and #6.
 *   4. The same tale, Ananse: "Clear out, you and your old-fashioned sayings." a28-09-tree#8.
 *   5. The same tale, a fragment: "and he cast it away, and there was a sound of scattering, tesee !"
 *      Set with a capital "And" and "tesee!". a28-09-scatter#3.
 *   6. The closing formula (as it ends Rattray's first tale): "This, my story, which I have related,
 *      if it be sweet, (or) if it be not sweet, take some elsewhere, and let some come back to me."
 *      The bracket dropped. a28-12-complete#1.
 *   The Sky-god's price (A28-2) and blessing (A28-7) are retold in our own words.
 *
 * CARE NOTES.
 *   - ADVISERS. Akan (Ghanaian) advisers for every name (Nana Ama is a placeholder: Ama is a
 *     Saturday-born girl's name), the courtyard, the stool, the funeral (A28-10), dress, cloth and
 *     any Twi word; and for the children's call-back in A28-1 ("Tell it anyway!" is our placeholder
 *     for the real response, if there is a customary one). Jamaican advisers for A28-11: the elder's
 *     name (Miss Ivy is a placeholder) and every line she says. Present Anansesem as a living
 *     tradition, told today, not a museum piece.
 *   - SPEECH. Jamaican speech is written by Jamaican writers or not at all. A28-11's elder speaks
 *     plain English here, as a placeholder for a Jamaican writer's lines. No dialect spelling.
 *   - NYAME is the Akan Supreme Being and still revered. Here he is a great king who keeps his word,
 *     never mocked, never a fool. He is shown only as a voice and a light at the end of the court;
 *     never a body or a face. Jokes in his court are at Ananse's expense, never his.
 *   - SOFTENED FOR ALL. The python, the hornets, the leopard and the fairy go up to the Sky-god
 *     alive and unharmed (A28-3 to A28-7 each say so). Ya Nsia goes as an honoured guest of the
 *     court and is fine; Ananse is still awful for offering. The funeral (A28-10) is warm and busy,
 *     with no body, coffin or grave shown.
 *   - SLAVERY is one sentence in A28-11 (a28-11-step#5), said plainly and with dignity by the elder.
 *     Never played, shown or turned into a mechanic. No ships or chains on screen.
 *   - THE GUM DOLL is a carved wooden doll, round-headed and plain, not a caricature of anyone. The
 *     phrase "tar baby" appears nowhere, in script, art names or asset ids.
 *   - MMOATIA is part of Akan belief, not just this tale: small, quick and dignified, never a joke.
 *   - Art is original. Ananse is a spider the size of a cooking pot, in a hat (the hat matters in
 *     A28-10); no copy of any published Anansi design or of the 1930 plates.
 *   - Hazel's third rule is acted out in A28-6's "sit with her" choice, and never quoted or named.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Box of Stories page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const TALES = 'Anansesem, the Akan spider stories (Ghana), with Rattray, Akan-Ashanti Folk-Tales (1930)';

// ------------------------------------------------------------------ speakers

const STORYTELLER = sp('a28-storyteller', 'Nana Ama', 'an Asante storyteller on the stool (the Anansesem tradition); placeholder name, advisers to confirm');
const CHILDREN = sp('a28-children', 'The Children', 'the listeners who answer the storyteller (Anansesem tradition)');
const ANANSE = sp('a28-ananse', 'Kwaku Ananse', 'Kwaku Ananse the spider (Akan tales); original design');
const NYAME = sp('a28-nyame', 'Nyame', 'Nyame, the Sky-god (Akan); shown only as a voice and a light');
const ASO = sp('a28-aso', 'Aso', 'Aso, Ananse’s wife (Akan tales); original design');
const ONINI = sp('a28-onini', 'Onini', 'Onini the python (Rattray no. 17, retold); original design');
const OSEBO = sp('a28-osebo', 'Osebo', 'Osebo the leopard (Rattray no. 17, retold); original design');
const MMOATIA = sp('a28-mmoatia', 'Mmoatia', 'a mmoatia, a fairy of Akan belief (Rattray no. 17, retold); original design');
const YA_NSIA = sp('a28-ya-nsia', 'Ya Nsia', 'Ya Nsia, Ananse’s old mother (Rattray no. 17, retold); original design');
const NTIKUMA = sp('a28-ntikuma', 'Ntikuma', 'Ntikuma, Ananse’s son (Akan tales); original design');
const MOURNER = sp('a28-mourner', 'A Cousin', 'a relative at the funeral (Akan tales, the bald-head story); original');
const ELDER = sp('a28-elder', 'Miss Ivy', 'a Jamaican elder who tells Anancy stories; placeholder name and lines, Jamaican writers to supply');
const YARD_CHILD = sp('a28-yard-child', 'A Boy on the Step', 'a child listening to Anancy stories in Jamaica; original');
/** The existing Wisp (S2). Shared id. Shadows whisper with the shard’s echo; lowercase is his half-voice. */
const WISP: Speaker = {
  id: 'wisp',
  name: 'Wisp',
  kind: 'nubbin',
  basedOn: 'the Grove’s grey thief (S2); in this page only, Ananse’s trading partner',
};

const N = say('narrator');
const Y = say('you');
const ST = say('a28-storyteller');
const CH = say('a28-children');
const AN = say('a28-ananse');
const NY = say('a28-nyame');
const AS = say('a28-aso');
const ON = say('a28-onini');
const OS = say('a28-osebo');
const MM = say('a28-mmoatia');
const YA = say('a28-ya-nsia');
const NT = say('a28-ntikuma');
const MO = say('a28-mourner');
const EL = say('a28-elder');
const YC = say('a28-yard-child');
const W = say('wisp');

// ------------------------------------------------------------------ lifted text (Rattray 1930, verified)

/** Preface: the storyteller's opening disclaimer. Rattray 1930, checked against the Internet Archive scan. */
const LIFT_DISCLAIMER = 'We don’t really mean to say so; we don’t really mean to say so.';
/** "How Wisdom Came Among the Tribe", opening words. Rattray 1930 ("THEY" set in normal case). */
const LIFT_THEY_SAY = 'They say that Kwaku, the Spider, was there,';
/** The same tale, Ntikuma, first half. Rattray 1930 (bracketed "(for shame)" dropped). */
const LIFT_EYES_A =
  'Oh, your eyes have surely died, would it not have been better if you had turned round the gourd and put it on your back,';
/** The same tale, Ntikuma, second half. Rattray 1930. */
const LIFT_EYES_B = 'then doubtless you would have been able to climb?';
/** The same tale, Ananse. Rattray 1930. */
const LIFT_CLEAR_OUT = 'Clear out, you and your old-fashioned sayings.';
/** The same tale, a fragment. Rattray 1930 (capital "And", "tesee!" closed up). */
const LIFT_TESEE = 'And he cast it away, and there was a sound of scattering, tesee!';
/** The closing formula. Rattray 1930 (bracketed "(or)" set plain). */
const LIFT_CLOSING =
  'This, my story, which I have related, if it be sweet, or if it be not sweet, take some elsewhere, and let some come back to me.';

// =================================================================== quests

export const ATLAS_A28: Quest[] = [
  // ---------------------------------------------------------------- A28-1
  {
    id: 'a28-01',
    code: 'A28-1',
    title: 'We Don’t Really Mean It',
    source: `${TALES}: the storyteller’s opening (Rattray, preface)`,
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page. Not before adviser sign-off.',
    },
    speakers: [STORYTELLER, CHILDREN, ANANSE],
    steps: [
      {
        id: 'a28-01-s1',
        goal: 'Step into the courtyard on the atlas page and find a place in the ring.',
        hint: 'Touch the carved stool on the page, then walk towards the fire.',
        check: 'visit:a28-courtyard:evening',
        scene: {
          id: 'a28-01-courtyard',
          lines: [
            N('Nova’s atlas falls open at a page the colour of a warm night: a courtyard, a carved stool, and a ring of faces round a fire.'),
            N('You touch the stool. The paper is warm, and then the air is, and you are standing at the edge of the ring.'),
            N('Crickets and woodsmoke. Somewhere a pot is being scraped, and somebody is laughing at whoever is scraping it.'),
            N('Children sit on mats round the fire, elbowing for the front. Grown-ups lean in the doorways with their arms folded.'),
            CH('Nana’s coming! Nana!', 'happy'),
            N('An old woman crosses the courtyard, slowly, because she can. She has a cloth over one shoulder and all the time in the world.'),
            N('Your Nubbin looks at the one empty mat, right at the front, and then at you.'),
          ],
          choices: [
            {
              id: 'front',
              label: 'Sit on the front mat.',
              then: [N('A small girl shuffles over to make room, without once taking her eyes off the stool.')],
            },
            {
              id: 'back',
              label: 'Sit at the back, by a doorway.',
              then: [
                N('A man in the doorway nods to you, as if latecomers are expected and nearly forgiven.'),
                N('Your Nubbin goes to the front anyway, and sits on the end of the girl’s mat.'),
              ],
            },
          ],
        },
        done: {
          id: 'a28-01-courtyard-done',
          lines: [
            N('The old woman lowers herself on to the stool. The fire pops.'),
            N('Everybody goes quiet, even the grown-ups, even the man still scraping the pot.'),
          ],
        },
      },
      {
        id: 'a28-01-s2',
        goal: 'Listen to how the storyteller begins, and answer her with the children.',
        hint: 'Stay on your mat by the fire until she has spoken.',
        check: 'sit:a28-mat:story',
        scene: {
          id: 'a28-01-stool',
          lines: [
            ST('Before I begin, you must all understand something.', 'think'),
            ST(LIFT_DISCLAIMER),
            N('She says it twice, the way you knock twice on a door you fully intend to open.'),
            N('At once the children shout back at her, all together, loud enough to lift the moths off the wall.'),
            CH('Tell it! Tell it anyway!', 'happy'),
            N('The girl beside you nudges you: you are meant to shout too. Everybody is.'),
          ],
          choices: [
            {
              id: 'shout',
              label: 'Shout it with them.',
              then: [
                Y('Tell it anyway!', 'happy'),
                N('Your Nubbin shouts too. It comes out as a squeak, and the old woman points at it, delighted.'),
              ],
            },
            {
              id: 'mouth',
              label: 'Mouth it, a bit shyly.',
              then: [N('The girl shouts it again, for both of you. Your Nubbin bounces in time, which seems to count.')],
            },
          ],
        },
        done: {
          id: 'a28-01-stool-done',
          lines: [
            ST('Good. Now that we all agree none of it happened, I can tell you exactly how it happened.', 'happy'),
            N('The children laugh. You laugh too, a beat behind them.'),
          ],
        },
      },
      {
        id: 'a28-01-s3',
        goal: 'Fall into the story, and meet the one it is about.',
        hint: 'Keep listening. When the courtyard fades, look for whoever is sitting beside you.',
        check: 'explore:a28-tale:spider',
        scene: {
          id: 'a28-01-fall',
          lines: [
            ST('This is a story about Kwaku Ananse, the spider. Who else would it be about?'),
            CH('Ananse!', 'happy'),
            ST('Once there were no stories on the earth at all. Not one. Imagine that.'),
            N('You try. It is like trying to imagine a room with no corners.'),
            ST('Every story there was belonged to the Sky-god, Nyame, and he kept them by him.'),
            N('Her voice goes low, and the courtyard goes with it. The walls thin out and the stars come down close.'),
            N('Your Nubbin grips your sleeve. Then the mat under you is red earth, there are trees, and it is morning.'),
            N('Something is sitting on a fallen log beside you, swinging a great many legs.'),
          ],
        },
        done: {
          id: 'a28-01-fall-done',
          lines: [
            N('It is a spider the size of a cooking pot, in a hat, and it is looking at you the way a trader looks at a cart.'),
            AN('You have two arms. And a bag. Excellent.', 'think'),
            AN('A spider has eight legs and nowhere at all to put a python.'),
            N('Your Nubbin reaches for a silver thread on the log, and sticks to it.'),
            N('The spider unpicks it without looking, like somebody who has done this many times before.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-01-complete',
      lines: [
        AN('I am Kwaku Ananse. You will carry things for me, and in return you will see the cleverest thing ever done.', 'happy'),
        N('Behind you, very faint, you can still hear the fire, and the old woman’s voice going on.'),
        AN('That’s her. She’s telling us. Don’t worry about it; she gets me right. Mostly right.'),
        AN('Come. We are going to see the Sky-god. Walk tall. Not too tall. He is taller.'),
        N('Your Nubbin falls in behind him, stepping where he steps, which is hard work with eight legs to copy.'),
      ],
    },
    rewards: [],
    sets: { 'a28-01': true },
    childLines: {
      'a28-01-stool#1': 'None of what I’m going to tell you is really true. Not really. Not really at all.',
    },
    notes:
      'OPENING: the page is a night courtyard in an Asante village, drawn with Akan advisers (stool, cloth, house fronts); the ' +
      'old woman is a respected storyteller, never a figure of fun. The children’s call-back "Tell it anyway!" is our ' +
      'placeholder: if advisers give a customary response, use it (and add a childLines entry if it is lifted text). Your ' +
      'Nubbin’s squeak is a sound effect, not speech. HAZEL’S MARGIN NOTE: if s24Done is set when a28-01-complete ends, play ' +
      'ATLAS_A28_VARIANTS a28-margin-hazel straight after it; otherwise the first time the page opens after s24Done is set. ' +
      'Ananse: a spider the size of a cooking pot with a hat (the hat is needed in A28-10).',
  },

  // ---------------------------------------------------------------- A28-2
  {
    id: 'a28-02',
    code: 'A28-2',
    title: 'The Sky-god’s Stories',
    source: `${TALES}: how the Sky-god’s stories came to be called spider stories (Rattray no. 17), the price; retold`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-1') },
    requires: ['A28-1'],
    speakers: [ANANSE, NYAME, WISP],
    steps: [
      {
        id: 'a28-02-s1',
        goal: 'Climb Ananse’s thread up to the Sky-god’s court.',
        hint: 'Follow Ananse up the silver line from the clearing.',
        check: 'climb:a28-web:sky',
        scene: {
          id: 'a28-02-climb',
          lines: [
            N('Ananse spins a thread straight up into the morning and climbs it, and you climb after him. Nobody explains how.'),
            N('Your Nubbin rides on your shoulders, sticks to your hair, and stays stuck all the way up.'),
            AN('Don’t look down. Down is where all the people who didn’t think of this are.', 'happy'),
            N('At the top is a court of white cloud. Elders sit on carved stools, and at the far end is a light too bright to look at.'),
            N('Rich men are leaving as you arrive. Their servants carry their gifts out after them, all refused.'),
            AN('Kings. Big towns. They came to buy the Sky-god’s stories. Couldn’t pay.', 'think'),
            AN('I, on the other hand, have no money at all. It’s a great advantage. Nobody watches a poor spider.'),
          ],
          choices: [
            {
              id: 'pay',
              label: 'Ask what he means to pay with, then.',
              then: [AN('With whatever he asks for. That’s the trick. Agree first. Work out how afterwards.')],
            },
            {
              id: 'hair',
              label: 'Unstick your Nubbin from your hair first.',
              then: [N('It takes a while. An elder on a stool watches the whole business with deep interest, and nods when it is done.')],
            },
          ],
        },
        done: {
          id: 'a28-02-climb-done',
          lines: [N('Ananse straightens his hat, takes three steps forward, and bows so low that the brim touches the cloud.')],
        },
      },
      {
        id: 'a28-02-s2',
        goal: 'Stand with Ananse while he asks the Sky-god his price.',
        hint: 'Stay a respectful step behind Ananse in the court.',
        check: 'talk:a28-nyame:court',
        scene: {
          id: 'a28-02-price',
          lines: [
            NY('Kwaku Ananse. You have come a long way up, for a spider.'),
            AN('Great one. I have come to buy your stories.', 'happy'),
            N('A murmur goes round the elders. One of them stops chewing.'),
            NY('Great towns have come to buy them. Kings have come. They have all gone home again with their gold.'),
            NY('What makes you think you can pay what they could not?'),
            AN('Name the price, great one. Whatever it is, I will pay it.'),
            NY('Then hear it. Bring me Onini, the python. Bring me Mmoboro, the hornets that sting like fire.'),
            NY('Bring me Osebo, the leopard, whose teeth are like spears. And bring me Mmoatia, the fairy whom nobody sees.'),
            N('The elders look at the little spider with his one hat and his two helpers. Somebody coughs, kindly.'),
            AN('I will bring them all. And to show I mean it, I will add my own old mother, Ya Nsia. Her too.', 'happy'),
            N('Your Nubbin turns and stares at him. So do you.'),
            NY('So be it. Go, Kwaku Ananse.'),
          ],
          choices: [
            {
              id: 'mother',
              label: 'Whisper, “Your mother?”',
              then: [AN('She’ll love it up here. Very good stools.', 'think')],
            },
            {
              id: 'silent',
              label: 'Say nothing. Some things don’t need saying.',
              then: [N('Ananse glances at you sideways, as if your silence has told him something he’d rather not hear.')],
            },
          ],
        },
        done: {
          id: 'a28-02-price-done',
          lines: [
            N('On the way down the thread Ananse is humming. You are counting on your fingers: a python, a swarm, a leopard, a fairy.'),
            N('Your Nubbin is counting too, on its toes, and has run out.'),
          ],
        },
      },
      {
        id: 'a28-02-s3',
        goal: 'Walk into the forest with Ananse to plan the first capture.',
        hint: 'Sit with Ananse on the root at the foot of the thread.',
        check: 'walk:a28-forest:path',
        scene: {
          id: 'a28-02-road',
          lines: [
            N('At the foot of the thread Ananse sits down on a root and looks you over properly, for the first time.'),
            AN('Eight legs, I have. Two arms, you have. And one of those, you have.', 'think'),
            AN('What does it do?'),
            N('Your Nubbin, as if it has been asked, sits down in a puddle of sap and sticks.'),
            AN('Ah. A specialist.'),
            AN('Kwaku, they call me, because I was born on a Wednesday. Everyone has a day. What’s yours?'),
          ],
          choices: [
            {
              id: 'day',
              label: 'Tell him the day you were born on.',
              then: [AN('A fine day. Not as fine as Wednesday. But fine.', 'happy')],
            },
            {
              id: 'unknown',
              label: 'Say you don’t know.',
              then: [AN('Then you can choose one. That’s better still. I’d choose Wednesday.')],
            },
          ],
        },
        done: {
          id: 'a28-02-road-done',
          lines: [
            N('He gets up, dusts off his hat, and points into the trees with three legs at once.'),
            AN('Python first. He’s the vainest. Vain ones are easy.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-02-complete',
      lines: [
        N('The forest is enormous, green and noisy. Somewhere in it is a python, and somewhere a fairy.'),
        AN('One thing at a time. That’s how you eat a whole yam.', 'happy'),
        N('He sets off. You set off after him, and your Nubbin sets off after you, with a leaf stuck to its foot.'),
        N('The price was set in a court in the sky. You have agreed to help pay it, which nobody asked you to do.'),
      ],
    },
    rewards: [],
    sets: { 'a28-02': true },
    notes:
      'NYAME is a voice and a light at the end of the court, never a body or a face (advisers to approve the court’s look). ' +
      'The price and Ananse’s offer of his mother are retold, not quoted. WISP (read when this quest starts): if wisp = spared ' +
      'or sable, play ATLAS_A28_VARIANTS a28-02-road-wisp in place of a28-02-road; it sets a28-wisp = came, and from then on ' +
      'the art shows Wisp in your bag or on your shoulder in every scene of the page. With stoneUnmadeBy = wisp he is not ' +
      'trembling.',
  },

  // ---------------------------------------------------------------- A28-3
  {
    id: 'a28-03',
    code: 'A28-3',
    title: 'Onini the Python',
    source: `${TALES}: the python and the palm branch (Rattray no. 17, retold)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-2') },
    requires: ['A28-2'],
    speakers: [ANANSE, ASO, ONINI],
    steps: [
      {
        id: 'a28-03-s1',
        goal: 'Find a long palm branch and some creeper for Ananse.',
        hint: 'Look along the forest floor for a fallen branch; the creeper is where your Nubbin walks into it.',
        check: 'collect:a28-branch:palm',
        scene: {
          id: 'a28-03-branch',
          lines: [
            AN('We need a palm branch. A long one. And creeper, for tying. Plenty of creeper.'),
            N('You find a fallen palm branch longer than a canoe. Your Nubbin finds the creeper by walking into it.'),
            AN('Now. My wife Aso is coming. When she gets here we will have a terrible argument, and you will look shocked.'),
            N('A spider in a headcloth comes along the path with a basket, already looking tired of him.'),
            AS('What are you doing with that branch, Kwaku?', 'think'),
            AN('Not now, Aso. Argue with me. Loudly. By the python’s tree.'),
            AS('I always argue with you loudly. I don’t need a reason.'),
          ],
        },
        done: {
          id: 'a28-03-branch-done',
          lines: [
            N('The three of you drag the branch to a great tree with roots like knuckles.'),
            N('Something long is asleep up in it, and you can hear it breathing.'),
          ],
        },
      },
      {
        id: 'a28-03-s2',
        goal: 'Watch Ananse and Aso’s argument from close by, with a straight face.',
        hint: 'Stand by the branch under the python’s tree.',
        check: 'watch:a28-onini:argument',
        scene: {
          id: 'a28-03-argue',
          lines: [
            AN('He IS longer than this branch!', 'angry'),
            AS('He is NOT! He’s shorter! Anybody can see it!', 'angry'),
            AN('Longer!'),
            AS('Shorter! Ask anybody you like!'),
            N('They are both very good at this. You start to suspect they’ve had a great deal of practice.'),
            N('A head comes down out of the tree, very slowly, followed by an enormous amount of python.'),
            ON('What is all this noise about my length?'),
            AN('Onini! Thank goodness. My wife says you’re shorter than this branch. I say you’re longer. Settle it for us?'),
            ON('Shorter? Lay the branch down. I will lie beside it.', 'angry'),
            N('He pours himself along the branch and stretches, and stretches harder. There is still a hand’s width of branch to spare.'),
          ],
          choices: [
            {
              id: 'nearly',
              label: 'Tell Onini he very nearly has it.',
              then: [ON('Nearly is not a length a python accepts.', 'angry')],
            },
            {
              id: 'straight',
              label: 'Keep a very straight face.',
              then: [N('You manage. Your Nubbin does not, and has to turn round and look hard at a tree.')],
            },
          ],
        },
        done: {
          id: 'a28-03-argue-done',
          lines: [AN('Your tail keeps slipping, that’s the trouble. My helper will hold it, so we can measure you properly.')],
        },
      },
      {
        id: 'a28-03-s3',
        goal: 'Hold the python’s tail while Ananse “measures” him.',
        hint: 'Take the tail end of the python and don’t let go.',
        check: 'carry:a28-onini:tail',
        scene: {
          id: 'a28-03-tie',
          lines: [
            N('You hold the tail end. It is heavy, dry and much stronger than you are.'),
            AN('Just to measure you properly. Head end now. And a bit in the middle. For accuracy.'),
            N('Round and round goes the creeper, quick and neat, nose to tail. Onini doesn’t notice until he can’t move to notice.'),
            ON('This is not measuring.', 'shock'),
            AN('No. You are very long, though. I’ll tell everyone.', 'happy'),
            N('Your Nubbin, helping with a knot, ties its own foot into it.'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Tell Onini you’re sorry.',
              then: [ON('Sorry, from the one holding my tail.', 'sad'), N('That is fair. You keep holding it anyway, and feel bad.')],
            },
            {
              id: 'pat',
              label: 'Pat the python’s nose, carefully.',
              then: [N('He looks at you with one cold eye. It isn’t friendship, but it isn’t biting either.')],
            },
          ],
        },
        done: {
          id: 'a28-03-tie-done',
          lines: [N('Ananse unties your Nubbin’s foot, one strand at a time, and leaves the python exactly as tied as he was.')],
        },
      },
    ],
    complete: {
      id: 'a28-03-complete',
      lines: [
        AN('One! One, for a spider with no money! Aso, did you see?', 'happy'),
        AS('I saw. I argued. You’re welcome.', 'think'),
        N('Onini goes up the thread to the Sky-god, wrapped like a parcel and loudly offended the whole way.'),
        N('He will be well looked after up there. It is a court, not a kitchen.'),
        AN('Hornets next. Find me a gourd.'),
      ],
    },
    rewards: [],
    sets: { 'a28-03': true },
    notes:
      'Comic, quick. Aso is Ananse’s equal in the argument and wins most of the exchanges. Onini is unharmed and goes up alive ' +
      '(softened for All); the creeper is loose enough to look comfortable. Wisp (if a28-wisp) watches from your bag.',
  },

  // ---------------------------------------------------------------- A28-4
  {
    id: 'a28-04',
    code: 'A28-4',
    title: 'Mmoboro the Hornets',
    source: `${TALES}: the hornets and the rain (Rattray no. 17, retold)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-3') },
    requires: ['A28-3'],
    speakers: [ANANSE],
    steps: [
      {
        id: 'a28-04-s1',
        goal: 'Fill a gourd with water for Ananse’s “rain”.',
        hint: 'Take the full gourd to the stream and fill it to the brim.',
        check: 'collect:a28-gourd:water',
        scene: {
          id: 'a28-04-gourd',
          lines: [
            N('Ananse cuts the top off a dry gourd and hands it to you. Then he hands you a second gourd, for water.'),
            AN('The dry one is the house. The wet one is the rain. Don’t mix them up.'),
            N('He picks a plantain leaf as wide as a door and holds it over his head, like a chief under an umbrella.'),
            AN('Fill it to the brim. Hornets can tell a stingy rain.'),
            N('You fill the gourd at a stream. Your Nubbin, helping, gets about half of it.'),
            N('Ananse practises looking dry under his leaf. He is very good at it already.'),
          ],
          choices: [
            {
              id: 'why',
              label: 'Ask why the hornets would believe it’s raining.',
              then: [AN('Because I’ll tell them. Nobody argues with weather.', 'happy')],
            },
            {
              id: 'leaf',
              label: 'Offer to hold the leaf.',
              then: [AN('No. The leaf is the costume. I am the actor. You are the weather.')],
            },
          ],
        },
        done: {
          id: 'a28-04-gourd-done',
          lines: [N('The nest hangs from a branch like a grey paper lantern. It hums, and it hums louder the closer you get.')],
        },
      },
      {
        id: 'a28-04-s2',
        goal: 'Pour the rain when Ananse gives the word.',
        hint: 'Stand under the nest with the water gourd, and wait for Ananse.',
        check: 'watch:a28-mmoboro:nest',
        scene: {
          id: 'a28-04-rain',
          lines: [
            AN('Now. Pour.'),
            N('You tip water over the nest. Ananse tips the rest over his own leaf, so that it drums.'),
            AN('Rain! Rain, Mmoboro! The rain’s come, and you’ll all be soaked!', 'shock'),
            AN('Look at me, I have a leaf. You have nothing! Come into my gourd. It’s lovely and dry in here.'),
            N('The humming changes note. One hornet comes out, then ten, then all of them, wet and cross and looking for a roof.'),
            N('They pour into the dry gourd like smoke going back down a chimney.'),
          ],
        },
      },
      {
        id: 'a28-04-s3',
        goal: 'Stop up the gourd before the hornets work it out.',
        hint: 'Take the plug of grass from Ananse and close the gourd, quickly.',
        check: 'place:a28-stopper:gourd',
        scene: {
          id: 'a28-04-stopper',
          lines: [
            N('Ananse holds out a plug of twisted grass. All eight of his legs are jiggling.'),
            AN('Now! Now, now, now!', 'shock'),
            N('A hornet’s head pokes out of the gourd’s mouth, looks about, and goes back in to tell the others.'),
            AN('Quickly, before one of them has a thought!', 'shock'),
            N('Inside the gourd the hornets are beginning to notice that it isn’t raining in there.'),
            N('Your Nubbin stands on tiptoe beside you, ready to help with whatever this is.'),
          ],
          choices: [
            {
              id: 'jam',
              label: 'Jam the stopper in.',
              then: [N('It goes in with a squeak. The gourd buzzes in your hands like a pot coming to the boil.')],
            },
            {
              id: 'sit',
              label: 'Let your Nubbin close it.',
              then: [N('Your Nubbin sits on the hole, which is about the right size. You slide the grass in under it, carefully.')],
            },
          ],
        },
        done: {
          id: 'a28-04-stopper-done',
          lines: [
            N('One last hornet, late for everything, lands on your Nubbin’s nose, thinks about it, and stings.'),
            N('Your Nubbin looks at you with enormous eyes. Then it looks at the gourd, and its eyes go narrow.'),
            AN('Two!', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-04-complete',
      lines: [
        N('Ananse does a small dance on all eight legs, with the gourd held high over his hat.'),
        N('The hornets go up the thread to the Sky-god. They buzz the whole way, but they go, and none the worse.'),
        N('Your Nubbin’s nose has a small red lump on it. It holds a grudge against the gourd, the hornets and, a little, the sky.'),
        AN('Leopard next. For a leopard, we dig.'),
      ],
    },
    rewards: [],
    sets: { 'a28-04': true },
    notes:
      'The sting is a cartoon beat: a puff, a small red bump that stays on your Nubbin’s nose until A28-8 (its "grudge" ' +
      'face is an idle that plays near any gourd on the page). No pain cries. One hornet escapes the count on purpose: it ' +
      'is the "last hornet" in A28-8’s Wisp variant.',
  },

  // ---------------------------------------------------------------- A28-5
  {
    id: 'a28-05',
    code: 'A28-5',
    title: 'Osebo the Leopard',
    source: `${TALES}: the leopard and the pit (Rattray no. 17, retold)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-4') },
    requires: ['A28-4'],
    speakers: [ANANSE, OSEBO],
    steps: [
      {
        id: 'a28-05-s1',
        goal: 'Help Ananse dig a pit across the leopard’s path.',
        hint: 'Dig where Ananse has scratched a line, then cover the hole with sticks and leaves.',
        check: 'build:a28-pit:path',
        scene: {
          id: 'a28-05-pit',
          lines: [
            N('Ananse finds the leopard’s path by its smell, which is strong, and its prints, which are larger than you would like.'),
            AN('Here. Dig. Deep enough for a leopard to sit in and think about his life.'),
            N('You dig. Ananse supervises, which mostly means sitting on the spoil heap and saying “deeper”.'),
            N('Your Nubbin digs too, with great energy and no direction, and ends up in a smaller hole of its own.'),
            AN('Now sticks across the top. Then leaves. It must look like nothing at all.'),
            N('When you have finished, it looks like a path. You have to remember very hard where it isn’t.'),
          ],
        },
        done: {
          id: 'a28-05-pit-done',
          lines: [AN('Now we go home and sleep. Leopards walk at night. That is when the hole earns its keep.')],
        },
      },
      {
        id: 'a28-05-s2',
        goal: 'Come back to the pit at dawn and see what is in it.',
        hint: 'Rest at Ananse’s, then return to the leopard’s path at first light.',
        check: 'wait:a28-osebo:dawn',
        scene: {
          id: 'a28-05-fall',
          lines: [
            N('In the night there is a crash, a thump, and a long, low, astonished growl.'),
            N('At first light you creep back along the path. The sticks have gone, and the pit has a leopard in it.'),
            OS('Who dug this? Who digs a hole in a leopard’s own road?', 'angry'),
            N('Osebo is magnificent, spotted all over, and very, very embarrassed.'),
            N('Ananse puts on a face of enormous concern, which he must keep somewhere handy.'),
            AN('Osebo! My poor friend! What a terrible hole! Who would do such a thing?', 'sad'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Look anywhere but at the spoil heap.',
              then: [N('You look at the sky, and so does your Nubbin. The spoil heap is right behind you, being obvious.')],
            },
            {
              id: 'help',
              label: 'Ask Osebo if he’s hurt.',
              then: [OS('Only my dignity. Which is worse.', 'sad')],
            },
          ],
        },
      },
      {
        id: 'a28-05-s3',
        goal: 'Carry the leopard, safely bundled, to the foot of the thread.',
        hint: 'Take one end of the bundle; your Nubbin will take the tail.',
        check: 'carry:a28-osebo:bundle',
        scene: {
          id: 'a28-05-web',
          lines: [
            AN('Let me help you out. Spiders are wonderful with ropes. I’ll bend this young tree down and tie a line to it.'),
            OS('You? Help? You’re a spider.', 'think'),
            AN('Exactly. Put your arms through this loop, and the tree will lift you right out.'),
            N('The leopard climbs into a loop that turns out to be more loops than he thought.'),
            N('The web goes round and round and round. When the tree springs up, Osebo goes with it, wrapped, furious and unhurt.'),
            OS('Spider. When I get out of this.', 'angry'),
            AN('Yes, yes. Everyone says that.', 'happy'),
          ],
          choices: [
            {
              id: 'court',
              label: 'Tell Osebo the Sky-god keeps a fine court.',
              then: [OS('Then the Sky-god can come and untie me himself.', 'angry')],
            },
            {
              id: 'quiet',
              label: 'Say nothing, and take the heavy end.',
              then: [N('Osebo looks at you upside down. He seems to think better of you for not explaining.')],
            },
          ],
        },
        done: {
          id: 'a28-05-web-done',
          lines: [
            N('The bundle is very heavy and very cross. You carry the front, and your Nubbin carries the tip of the tail, which keeps twitching.'),
            N('By the time you reach the thread, your Nubbin is stuck to the web, and has to go most of the way up before Ananse unpicks it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-05-complete',
      lines: [
        N('Osebo goes up to the Sky-god alive and extremely cross, which is the way many tellings have it.'),
        AN('Three! Python, hornets, leopard. And my mother, of course. She’s practically packed.', 'happy'),
        AN('Now the hard one. Nobody sees a fairy unless she wants to be seen.', 'think'),
        AN('So we will make her want to.'),
      ],
    },
    rewards: [],
    sets: { 'a28-05': true },
    notes:
      'Softened for All: the pit is shallow enough that the leopard sits in it, sulking; no injury. The web bundle is soft and ' +
      'round, the leopard’s face sticking out, scowling. The step-2 check waits for the page’s own dawn (a short page night), ' +
      'never the real clock.',
  },

  // ---------------------------------------------------------------- A28-6
  {
    id: 'a28-06',
    code: 'A28-6',
    title: 'Mmoatia and the Gum Doll',
    source: `${TALES}: the fairy and the gum doll (Rattray no. 17, retold)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-5') },
    requires: ['A28-5'],
    speakers: [ANANSE, MMOATIA],
    steps: [
      {
        id: 'a28-06-s1',
        goal: 'Carve a small doll for Ananse’s trap.',
        hint: 'Take the soft wood and knife from Ananse, and carve at the table by his door.',
        check: 'craft:a28-doll:carve',
        scene: {
          id: 'a28-06-doll',
          lines: [
            N('Ananse gives you a block of soft wood and a small knife, and points at it as if the rest is obvious.'),
            AN('A doll. A small one, the size of a fairy. Arms, legs, a face. Nothing fancy.'),
            N('You carve, and it comes out round-headed and solemn, with its arms held out. Your Nubbin looks at it and sits up straighter.'),
            AN('Lovely. Now the gum.'),
            N('He coats the doll all over from a gourd of sticky sap, thick and shining. Your Nubbin touches it once, which is a mistake.'),
            N('It takes both of you to get it loose.'),
          ],
        },
        done: {
          id: 'a28-06-doll-done',
          lines: [
            N('Ananse sets a bowl of mashed yam in the doll’s lap and props it under a great odum tree, where the fairies come to play.'),
            AN('Now we hide, and we are very, very quiet. You especially.'),
          ],
        },
      },
      {
        id: 'a28-06-s2',
        goal: 'Hide by the odum tree and watch who comes for the yam.',
        hint: 'Crouch behind the big root and keep still until dusk.',
        check: 'watch:a28-mmoatia:odum',
        scene: {
          id: 'a28-06-fairy',
          lines: [
            N('You hide behind a root until dusk. Something small and quick comes down out of the odum tree.'),
            N('Mmoatia is no taller than your knee. She has a sharp, clever face and moves like a bird making up its mind.'),
            MM('Oh. Yam. Little one, may I have some of your yam?'),
            N('The doll says nothing. Mmoatia takes this for yes, and eats, neatly, every last bit.'),
            MM('Thank you. That was very good. I said thank you.'),
            N('The doll says nothing.'),
            MM('When somebody thanks you, you answer them. Were you never taught?', 'angry'),
            N('She slaps the doll with one hand, and the hand sticks. She slaps it with the other, and that sticks too.'),
            MM('Let go of me! Let go!', 'shock'),
            N('Ananse is out from behind his root and halfway up the path already.'),
            AN('Rope! Stay there, both of you. I’ll fetch rope!', 'happy'),
          ],
        },
        done: {
          id: 'a28-06-fairy-done',
          lines: [
            N('Then he is gone. The fairy pulls, and the doll leans, and nothing comes apart.'),
            N('She stops, and breathes. She looks straight at your root, as if she has known you were there all along.'),
          ],
        },
      },
      {
        id: 'a28-06-s3',
        goal: 'Decide what to do while Ananse is away fetching rope.',
        hint: 'Go to the fairy under the odum tree.',
        check: 'choose:a28-mmoatia:odum',
        scene: {
          id: 'a28-06-wait',
          lines: [
            N('It is nearly dark under the odum tree. Far off, a spider is looking for rope and not hurrying.'),
            MM('You. You’re with him.', 'angry'),
            N('She isn’t crying. She has gone very still, the way small wild things go still when they are caught and thinking.'),
            MM('He’ll take me up to the Sky-god. That’s what this is.'),
            N('Her hands are fixed to the doll’s chest, side by side. The gum shines.'),
            N('Your Nubbin looks at her, and at you, and at its own paw, which has been stuck to things all day.'),
          ],
          choices: [
            {
              id: 'freed',
              label: 'Work one of her hands free.',
              set: { 'a28-fairy': 'freed' },
              then: [
                N('You work the gum loose with your thumbs, slowly. One small hand comes free; the other stays fast.'),
                MM('One? Only one?', 'think'),
                Y('The other has to stay. It’s his story. But you can have that one back.'),
                N('She flexes her free hand, opening and closing it, and looks at you for a long time.'),
              ],
            },
            {
              id: 'left',
              label: 'Leave her be.',
              set: { 'a28-fairy': 'left' },
              then: [
                N('You stay by your root. It isn’t your story to change, and you know it.'),
                MM('Of course. He has helpers.', 'sad'),
                N('She turns her face away and waits for the rope, with her chin up.'),
              ],
            },
            {
              id: 'sat',
              label: 'Sit down beside her, say nothing, and wait.',
              set: { 'a28-fairy': 'sat' },
              then: [
                N('You sit down beside her in the leaves, and say nothing. Your Nubbin sits on her other side.'),
                N('She glares at you both. After a while she stops glaring.'),
                N('When the frogs start up, she leans, very slightly, against your arm.'),
              ],
            },
          ],
        },
        done: {
          id: 'a28-06-wait-done',
          lines: [
            N('Ananse comes back at last with an armful of rope, puffing and very pleased with himself.'),
            AN('Four! Four, and my mother makes five! Who has ever done such a thing?', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-06-complete',
      lines: [
        N('Ananse ties the fairy, doll and all, and even he is careful about it.'),
        N('She goes up the thread with her chin high. A fairy can be caught; she doesn’t have to be humble about it.'),
        AN('Tomorrow, the court. Wash. You’re covered in gum.'),
        N('Your Nubbin, specifically, is stuck to the yam bowl. You carry them both home, and it seems perfectly content.'),
      ],
    },
    rewards: [
      {
        id: 'a28-cushion',
        kind: 'decor',
        label: 'Doll Cushion',
        description: 'A round-headed cushion shaped like the carved doll under the odum tree. Not sticky. Nubbins sit on it anyway, just in case.',
      },
    ],
    sets: { 'a28-06': true },
    notes:
      'THE SIGNATURE CHOICE (a28-06-wait) sets a28-fairy = freed | left | sat, paid off in A28-9, A28-10 and A28-12. With freed, ' +
      'one hand stays stuck, so the tale holds: she is still caught and still goes up. The doll is a plain carved wooden doll, ' +
      'not a caricature of anyone, and is never called anything but "the doll" or "the gum doll". Mmoatia is small, quick and ' +
      'dignified (advisers: her look, which is part of Akan belief). Never a joke at her expense; the comedy is Ananse’s. ' +
      'The odum tree is drawn from reference (advisers).',
  },

  // ---------------------------------------------------------------- A28-7
  {
    id: 'a28-07',
    code: 'A28-7',
    title: 'Spider Stories',
    source: `${TALES}: the price paid and the stories named (Rattray no. 17, retold)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-6') },
    requires: ['A28-6'],
    speakers: [ANANSE, NYAME, YA_NSIA, OSEBO, ONINI],
    steps: [
      {
        id: 'a28-07-s1',
        goal: 'Walk with Ananse’s mother to the Sky-god’s court.',
        hint: 'Find Ya Nsia at Ananse’s door and go up the thread with her.',
        check: 'escort:a28-ya-nsia:court',
        scene: {
          id: 'a28-07-mother',
          lines: [
            N('Ananse’s mother is waiting at his door, small and upright, in her good cloth, with a bundle on her knee.'),
            YA('Kwaku. You told them I was included.', 'think'),
            AN('As an honoured guest, Mother! The best stools in the sky!', 'happy'),
            YA('Mm. Your father used to promise me stools.'),
            N('She gets up, and takes your arm, not his. Your Nubbin carries her bundle, which is mostly snacks.'),
            YA('He was always like this. Even in the egg. He’d have sold the shell.'),
          ],
          choices: [
            {
              id: 'proud',
              label: 'Tell her she must be proud of him.',
              then: [YA('Proud. Tired. It’s the same face, with a spider.', 'happy')],
            },
            {
              id: 'arm',
              label: 'Just give her your arm, and walk.',
              then: [N('She pats your hand twice, the way you pat a horse that has been sensible.')],
            },
          ],
        },
        done: {
          id: 'a28-07-mother-done',
          lines: [N('Up you go, all of you, the old lady first, the bundle second, and Ananse last, rehearsing.')],
        },
      },
      {
        id: 'a28-07-s2',
        goal: 'Stand in the Sky-god’s court while Ananse pays the price.',
        hint: 'Take your place among the elders, a step behind Ananse.',
        check: 'talk:a28-nyame:stories',
        scene: {
          id: 'a28-07-court',
          lines: [
            N('The elders are all there, on their carved stools, and the light at the end of the court is very bright today.'),
            N('Ananse lays the price on the cloud, one piece at a time: the python, the gourd of hornets, the leopard, the fairy.'),
            ON('I am still longer than that branch.', 'angry'),
            OS('Spider. I haven’t forgotten.', 'angry'),
            AN('And my mother, Ya Nsia, great one.', 'happy'),
            YA('Good afternoon. These are very good stools.', 'happy'),
            N('Nobody says anything for a while. One of the elders is smiling at the floor.'),
            NY('Kings came to buy my stories, and great towns. They could not pay.'),
            NY('Kwaku Ananse has paid. From today the stories are his.'),
            NY('From today they will be called by his name. Every story told on the earth will be a spider story.'),
            N('The elders stand. Ananse takes his hat off and holds it to his chest, and for once he doesn’t say anything at all.'),
          ],
          choices: [
            {
              id: 'bow',
              label: 'Bow, as the elders do.',
              then: [N('You bow. Your Nubbin bows too, too low, and has to be helped up off the cloud.')],
            },
            {
              id: 'clap',
              label: 'Clap, before you can stop yourself.',
              then: [N('You are the only one. Then an elder claps, and another, and the court fills with it.')],
            },
          ],
        },
        done: {
          id: 'a28-07-court-done',
          lines: [
            NY('Ya Nsia will stay with us, as our guest. She will want for nothing.'),
            YA('I’ll want for the snacks, if the small one gives them back.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-07-complete',
      lines: [
        N('At the edge of the court the elders hand Ananse a carved box. It is heavy, and something inside it is talking.'),
        N('The python is given a long warm shelf, the leopard a shady corner. The hornets are let out into a garden in the sky.'),
        N('Mmoatia, you notice, doesn’t stay at court long. Fairies are hard to keep, even for a Sky-god who keeps his word.'),
        YA('Here. For the small one. It got stuck to more of this business than anybody.', 'soft'),
        N('She drapes something over your Nubbin: a shawl of spider silk, soft as breath, and only a very little sticky.'),
      ],
    },
    rewards: [
      {
        id: 'a28-shawl',
        kind: 'cosmetic',
        label: 'Spider-Silk Shawl',
        description: 'A soft grey shawl of spider silk for your Nubbin, a gift from Ya Nsia. It shines in the evening. Leaves stick to it, a little.',
      },
    ],
    sets: { 'a28-07': true },
    notes:
      'NYAME: voice and light only; his lines are a king keeping his word, plain and grave, no joke at his expense. His ' +
      'blessing is retold (the tale’s text was not checked). YA NSIA is fine and honoured: comfortable, fed, given the best ' +
      'stool; the joke is on Ananse for offering her. The "carved box" is our image; the tale says only that the stories were ' +
      'the Sky-god’s. The captured creatures are all shown well kept (alive, comfortable) per the softening for All.',
  },

  // ---------------------------------------------------------------- A28-8
  {
    id: 'a28-08',
    code: 'A28-8',
    title: 'The Box Opens',
    source: `${TALES}: the box of stories (our image) and a bad trade`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-7') },
    requires: ['A28-7'],
    speakers: [ANANSE, WISP],
    steps: [
      {
        id: 'a28-08-s1',
        goal: 'Help Ananse carry the box of stories home.',
        hint: 'Take one end of the box and go down the thread with Ananse.',
        check: 'carry:a28-box:home',
        scene: {
          id: 'a28-08-carry',
          lines: [
            N('The box is heavier than it looks. It’s warm, like bread, and it hums with a hundred small voices.'),
            AN('Careful. Careful! That’s every story in the world you’re holding by the corner.'),
            N('You hold it more carefully. Your Nubbin presses its ear to the lid and goes cross-eyed with listening.'),
            AN('Mine. All of them. Spider stories, the Sky-god said. My name on every single one.', 'happy'),
            N('At his door he sets it down on the step and sits beside it, with his hat pushed back, looking at it.'),
            AN('I’m not going to open it. I just want to look at it.'),
          ],
        },
        done: {
          id: 'a28-08-carry-done',
          lines: [N('He looks at it for a long time. Then he looks at you, as if you might have opinions about lids.')],
        },
      },
      {
        id: 'a28-08-s2',
        goal: 'Watch what happens when Ananse lifts the lid, just a little.',
        hint: 'Stay on the step with Ananse.',
        check: 'watch:a28-box:open',
        scene: {
          id: 'a28-08-open',
          lines: [
            AN('Just a peep. One story. A little one, to see they’re all there.'),
            N('He lifts the lid a finger’s width.'),
            N('Out comes a story, bright as a bird, and then another, and then all of them at once, in a rush of wings.'),
            AN('No! No, no, come back! You’re mine!', 'shock'),
            N('They go over the trees and over the hills and away over the sea, every way at once, to every place there is.'),
            N('A few small ones circle the house, as if checking they’ve left nothing behind. Then they go too.'),
            N('For a moment your Nubbin has one by the tail, very small and wriggly. It lets go, and the story flies off.'),
          ],
          choices: [
            {
              id: 'sorry',
              label: 'Tell Ananse you’re sorry.',
              then: [AN('Sorry? Why? They’re still mine. Whoever tells them. That was the deal.', 'think')],
            },
            {
              id: 'watch',
              label: 'Watch them go, all the way to the edge of the sky.',
              then: [N('You watch until the last one is only a glint. It seems the right thing to do with stories.')],
            },
          ],
        },
        done: {
          id: 'a28-08-open-done',
          lines: [AN('Everywhere. Everyone will be telling them now. Badly, mostly.', 'happy')],
        },
      },
      {
        id: 'a28-08-s3',
        goal: 'See whether Ananse pays what he owes.',
        hint: 'Stay by the empty box on Ananse’s step.',
        check: 'give:a28-ananse:trade',
        scene: {
          id: 'a28-08-debt',
          lines: [
            N('Ananse sits by the empty box. Your Nubbin sits by Ananse, holding a buttercup it picked on the way down.'),
            AN('What have you got there?', 'think'),
            N('Your Nubbin holds it out, to show him. It is a very good buttercup.'),
            AN('I’ll trade you. One story, for that. An excellent price. Stories are scarce, round here, suddenly.'),
            N('Your Nubbin thinks about it with its whole face, and then hands it over.'),
            AN('Ahem. Here is your story.'),
            AN('“Ananse.”', 'happy'),
            N('That is the whole story. Your Nubbin waits for more, and there isn’t any.'),
            AN('Well, they’re all about me now, aren’t they? That’s every story, really. Very concentrated.'),
          ],
          set: { 'a28-trade': 'nubbin' },
          choices: [
            {
              id: 'fair',
              label: 'Tell him that is not a story.',
              then: [AN('It has a beginning, a middle and an end. They just happen to be the same word.', 'happy')],
            },
            {
              id: 'let',
              label: 'Let your Nubbin decide if it was fair.',
              then: [N('Your Nubbin thinks, and nods. It seems to have enjoyed the story very much, because it was about someone.')],
            },
          ],
        },
        done: {
          id: 'a28-08-debt-done',
          lines: [N('Ananse tucks the buttercup into his hatband, looking very pleased. So, oddly, does your Nubbin.')],
        },
      },
    ],
    complete: {
      id: 'a28-08-complete',
      lines: [
        N('Evening comes down on Ananse’s house. The box sits on the step, empty, with its lid open.'),
        AN('You know what the best part is? I don’t have to keep them now. Somebody else does the carrying.', 'happy'),
        N('Very far off, through the trees, you hear the courtyard fire, and the old woman laughing at something.'),
        AN('There. She’s telling one. Mine.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a28-08': true },
    notes:
      'The box opening: stories as small bright birds of light, each a different colour; they fly to every edge of the page. ' +
      'Nothing recognisable from any published story. WISP (decided by a28-wisp = came): play ATLAS_A28_VARIANTS ' +
      'a28-08-debt-wisp in place of a28-08-debt (it sets a28-trade = wisp). Otherwise (wisp driven or unset) the base scene, ' +
      'which sets a28-trade = nubbin. Your Nubbin’s hornet bump goes down in this quest.',
  },

  // ---------------------------------------------------------------- A28-9
  {
    id: 'a28-09',
    code: 'A28-9',
    title: 'The Pot of Wisdom',
    source: `${TALES}: how wisdom came among the tribe (Rattray, Akan-Ashanti Folk-Tales, 1930)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-8') },
    requires: ['A28-8'],
    speakers: [STORYTELLER, ANANSE, NTIKUMA, MMOATIA],
    steps: [
      {
        id: 'a28-09-s1',
        goal: 'Hold the gourd pot while Ananse sweeps up all the wisdom in the world.',
        hint: 'Follow Ananse with the pot and keep it upright.',
        check: 'collect:a28-wisdom:pot',
        scene: {
          id: 'a28-09-sweep',
          lines: [
            N('The forest flickers, and for a moment you are back in the courtyard: the fire, the faces, the old woman leaning forward.'),
            ST(LIFT_THEY_SAY),
            ST('and that one day he swept up all the wisdom in the world, every scrap of it, and put it in a pot.'),
            N('The courtyard fades. You are in the forest again, holding a gourd pot, and Ananse is sweeping.'),
            N('He sweeps under stones, out of birds’ nests and off the tops of sleeping heads. Wisdom looks like bright dust.'),
            AN('Mine. All of it. Nobody else will ever know anything again, unless they ask me very nicely.', 'happy'),
            N('Your Nubbin gets swept up with a pile of it. Ananse tips it back out.'),
            AN('Not you. You’re not wisdom. You’re luggage.'),
          ],
        },
        done: {
          id: 'a28-09-sweep-done',
          lines: [AN('Now I’ll hang it at the top of the tallest tree, where nobody can reach it but me.')],
        },
      },
      {
        id: 'a28-09-s2',
        goal: 'Watch Ananse try to climb with the pot.',
        hint: 'Stand at the foot of the tall tree.',
        check: 'watch:a28-ananse:climb',
        scene: {
          id: 'a28-09-tree',
          lines: [
            N('He ties the pot in front of him, under his chin, and starts up the trunk.'),
            N('The pot bumps the bark, and he slides down. He tries again, and it bumps again, and he slides again.'),
            AN('This tree is very badly made.', 'angry'),
            N('A small spider has come out of the bushes to watch. He has his father’s face, without the trouble in it.'),
            N('It is Ntikuma, Ananse’s son. He watches three more tries, and then he speaks up.'),
            NT(LIFT_EYES_A),
            NT(LIFT_EYES_B),
            N('Ananse stops, halfway up the trunk.'),
            AN(LIFT_CLEAR_OUT, 'angry'),
            N('But he looks down at the pot, and at his own back, and at his son.'),
          ],
          choices: [
            {
              id: 'laugh',
              label: 'Try very hard not to laugh.',
              then: [N('You succeed, just. Your Nubbin has its paws over its mouth, which is nearly the same thing.')],
            },
            {
              id: 'nod',
              label: 'Give Ntikuma a small nod.',
              then: [N('Ntikuma nods back, very seriously. Two people who have each been right about a pot.')],
            },
          ],
        },
      },
      {
        id: 'a28-09-s3',
        goal: 'See what Ananse does with all that wisdom now.',
        hint: 'Stay under the tall tree, and hold out your hands.',
        check: 'watch:a28-wisdom:scatter',
        scene: {
          id: 'a28-09-scatter',
          lines: [
            N('Ananse sits in a fork of the tree for a long while, with the pot in his lap.'),
            AN('A small boy. A small boy knew a thing I didn’t. With all of it right here in my arms.', 'sad'),
            N('He pulls the pot free of its cords. Through the leaves comes the old woman’s voice, from far away by the fire.'),
            ST(LIFT_TESEE),
            N('Wisdom bursts across the forest like seed off a dandelion clock. It lands on everybody, some more and some less.'),
            ST('And that is why there is a little wisdom everywhere, and nobody has all of it.'),
          ],
        },
        done: {
          id: 'a28-09-scatter-done',
          lines: [
            N('The pieces come down on the far side of the clearing, on the ants, the frogs and a very surprised goat.'),
            N('None come your way. Your Nubbin holds out its paws anyway, just in case.'),
            N('They stay empty. It isn’t sorry it tried.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-09-complete',
      lines: [
        N('Ananse climbs down. Ntikuma is waiting at the bottom with the broken pot, and gives it back to him.'),
        AN('I would have thought of the back. Eventually.', 'think'),
        N('They walk home together, the big spider and the small one. Ananse keeps a leg on his son’s shoulder all the way.'),
        N('You keep the broken gourd. It still sparkles a little when it tips.'),
      ],
    },
    rewards: [
      {
        id: 'a28-gourd-pot',
        kind: 'decor',
        label: 'Gourd of Wisdom',
        description: 'A mended gourd pot. Now and then it tips over on its own and spills a little sparkle, then rights itself. Nobody gets wiser.',
      },
    ],
    sets: { 'a28-09': true },
    childLines: {
      'a28-09-sweep#1': 'Long ago, they say, the spider Kwaku Ananse was there,',
      'a28-09-tree#5': 'Father, if you tied the pot on your back instead of your front,',
      'a28-09-tree#6': 'you could climb that tree with no trouble at all.',
      'a28-09-tree#8': 'Off you go, and take your clever ideas with you!',
      'a28-09-scatter#3': 'He threw the pot down, and the wisdom scattered everywhere, pitter-patter!',
    },
    notes:
      'LIFTED TEXT, Rattray 1930, verified: a28-09-sweep#1 (the tale’s opening, in normal case), a28-09-tree#5 and #6 (Ntikuma, ' +
      'split for length, bracket dropped), #8 (Ananse), a28-09-scatter#3 (the "tesee!" fragment). Each has a childLines ' +
      'replacement. Our own continuation follows sweep#1. THE FAIRY (a28-fairy, A28-6): a28-09-scatter-done is for left. For ' +
      'freed play ATLAS_A28_VARIANTS a28-09-scatter-done-freed; for sat, a28-09-scatter-done-sat. Ntikuma: a small spider, ' +
      'serious and polite; his father’s hat is too big for him in one idle.',
  },

  // ---------------------------------------------------------------- A28-10
  {
    id: 'a28-10',
    code: 'A28-10',
    title: 'The Bald Head',
    source: `${TALES}: why the spider is bald (the funeral and the beans)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-9') },
    requires: ['A28-9'],
    speakers: [ANANSE, ASO, MOURNER, MMOATIA],
    steps: [
      {
        id: 'a28-10-s1',
        goal: 'Go with Ananse and Aso to the funeral of Aso’s mother.',
        hint: 'Walk with them to the family house, where the drums are.',
        check: 'visit:a28-funeral:yard',
        scene: {
          id: 'a28-10-funeral',
          lines: [
            N('Aso’s mother has died, old and well loved, and the whole family has come to see her off.'),
            N('The yard is full: drums, cooking, cousins, children underfoot, and everybody talking about her at once.'),
            AS('She’d have hated the fuss. She’d have counted every chair.', 'soft'),
            MO('Kwaku! Will you eat? There’s enough here for the whole village.'),
            AN('Eat? At my mother-in-law’s funeral? Never! I shall fast, out of respect, until it is all over.', 'sad'),
            N('Aso looks at him, and so does everybody who knows him. The cousin shrugs and takes the bowl away.'),
            AS('He has never fasted for anything in his life.'),
          ],
          choices: [
            {
              id: 'aso',
              label: 'Tell Aso you’re sorry about her mother.',
              then: [AS('Thank you. She was a hard woman, and fair. She’d have liked you.', 'soft')],
            },
            {
              id: 'help',
              label: 'Help carry chairs for the guests.',
              then: [N('You carry chairs. Your Nubbin carries a stool on its head and gets cheered by several aunties.')],
            },
          ],
        },
        done: {
          id: 'a28-10-funeral-done',
          lines: [N('By noon Ananse is looking at every pot in the yard the way a dog looks at a gate.')],
        },
      },
      {
        id: 'a28-10-s2',
        goal: 'Keep an eye on Ananse. He is up to something.',
        hint: 'Follow Ananse when he slips round the back of the cooking fires.',
        check: 'watch:a28-ananse:beans',
        scene: {
          id: 'a28-10-beans',
          lines: [
            N('Ananse slips round behind the cooking fires, where a pot of beans is bubbling, and looks both ways.'),
            N('He doesn’t see you. Or he does, and thinks you are furniture.'),
            N('He scoops a pawful of beans, hot from the pot, and has nowhere to put them.'),
            N('So he takes off his hat, drops them in, and puts his hat back on.'),
            AN('Ow. Ow. Ow ow ow.', 'shock'),
            N('Just then a cousin comes round the corner, and Ananse stands up very straight, smiling, with steam coming out from under his hat.'),
          ],
          choices: [
            {
              id: 'warn',
              label: 'Whisper to Ananse to take the hat off.',
              then: [AN('Take it off? In front of people? With my dignity?', 'shock')],
            },
            {
              id: 'cover',
              label: 'Step in front of him, so the cousin can’t see.',
              then: [N('You try. Ananse is short, but the steam is tall.')],
            },
          ],
        },
      },
      {
        id: 'a28-10-s3',
        goal: 'Help Ananse look dignified.',
        hint: 'Stay close to Ananse in the crowd. It won’t work, but try.',
        check: 'puzzle:a28-ananse:dignity',
        scene: {
          id: 'a28-10-dance',
          lines: [
            N('The beans are very hot. Ananse begins to shake his head, gently at first, then not gently at all.'),
            MO('Kwaku, what are you doing?', 'think'),
            AN('A dance! A hat-shaking dance. It is done in my village at funerals. Very old. Very respectful.'),
            N('He shakes his head harder, and the hat shakes harder. Several small children join in, delighted.'),
            N('You fan him with a plantain leaf, which helps nobody. Your Nubbin starts dancing too, sincerely, which makes it worse.'),
            AS('Kwaku. Stop.', 'angry'),
          ],
        },
        done: {
          id: 'a28-10-dance-done',
          lines: [
            N('Then the hat comes off on its own, sailing up into the air, and the beans come down all over the yard.'),
            N('Every hair on Ananse’s head has been scorched clean away. There is a short silence, and then a very long laugh.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-10-complete',
      lines: [
        N('Ananse runs into the long grass and hides there, hat in hand, for the rest of the afternoon.'),
        AS('Serves him right. Mother would have laughed till she cried.', 'happy'),
        N('The funeral goes on, warmer than before, and somebody tells the story of the beans before the drums have even stopped.'),
        N('And that is why the spider is bald to this day, and keeps to the grass when people look at him.'),
      ],
    },
    rewards: [],
    sets: { 'a28-10': true },
    notes:
      'Softened for All: the funeral is warm and busy, a celebration of a long life; no body, coffin or grave shown. Advisers: ' +
      'funeral dress and cloth colours, drumming, the family house, who sits where. The beans are cartoon-hot (steam, a hop), ' +
      'no burns shown; Ananse’s bald head is a shine, comic and harmless. THE FAIRY (a28-fairy): a28-10-dance-done is for left ' +
      '(the hat comes off on its own). For freed play ATLAS_A28_VARIANTS a28-10-dance-done-freed (she tips it off, laughing); ' +
      'for sat, a28-10-dance-done-sat (the hat comes off, and she brings a cool leaf afterwards). The cousin (a28-mourner) is ' +
      'one of Aso’s family.',
  },

  // ---------------------------------------------------------------- A28-11
  {
    id: 'a28-11',
    code: 'A28-11',
    title: 'Across the Water',
    source: 'The Anancy stories of Jamaica, a living tradition (lines to be written by Jamaican writers)',
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-10') },
    requires: ['A28-10'],
    speakers: [ELDER, YARD_CHILD],
    steps: [
      {
        id: 'a28-11-s1',
        goal: 'Follow the page as it turns, and see where the spider has gone.',
        hint: 'Turn the corner of the page when it lifts by itself.',
        check: 'explore:a28-yard:night',
        scene: {
          id: 'a28-11-yard',
          lines: [
            N('The page lifts on its own, as if a wind has got under it, and turns.'),
            N('It is night again, but a different night: warmer, louder with frogs, and the air tastes of the sea.'),
            N('A yard with a breadfruit tree and a lamp on a nail. The house door is open, and a radio is talking quietly inside.'),
            N('On the front step sits an old woman with a cup of tea, and on the steps below her, a handful of children.'),
            N('It is years later, and a long way across the water. You can tell, the way you can tell in dreams.'),
            N('Your Nubbin, without being asked, goes and sits on the bottom step with the children.'),
          ],
        },
        done: {
          id: 'a28-11-yard-done',
          lines: [N('One of the children budges up to make room for you, too. Nobody asks where you’ve come from.')],
        },
      },
      {
        id: 'a28-11-s2',
        goal: 'Sit on the step and listen to the elder.',
        hint: 'Take the space the children have made for you.',
        check: 'sit:a28-step:story',
        scene: {
          id: 'a28-11-step',
          lines: [
            YC('Miss Ivy. Tell an Anancy one. Please.'),
            EL('An Anancy one. Hm. Which one have I not told you yet?', 'think'),
            YC('You’ve told us all of them.'),
            EL('Then I’ll tell one again. That’s what they’re for.', 'happy'),
            N('She puts her cup down. Before she starts, she says where he comes from, the way you would say where a cousin lives.'),
            EL('He came here with people who were stolen from the Gold Coast, and they kept him, because he was small and clever and never stayed caught.'),
            N('The children nod; they know. It is not a secret, and it is not the story: it is where the story stands.'),
          ],
        },
        done: {
          id: 'a28-11-step-done',
          lines: [EL('Now. Anancy, and the gum.', 'happy')],
        },
      },
      {
        id: 'a28-11-s3',
        goal: 'Hear Miss Ivy’s way of telling the gum-doll story.',
        hint: 'Stay on the step until the story is done.',
        check: 'talk:a28-elder:gum',
        scene: {
          id: 'a28-11-gum',
          lines: [
            EL('Anancy was stealing peas from a farmer’s field. Every night, a few more peas, and never a sound.'),
            EL('So the farmer made a little man out of wood, and covered him in gum, and stood him in the middle of the peas.'),
            EL('And Anancy came along in the dark, and said good evening, and the little man said nothing at all.'),
            N('The children are mouthing the next part along with her. Your Nubbin is mouthing too, without knowing the words.'),
            EL('So Anancy slapped him. And stuck. And slapped him with the other hand, and stuck again.'),
            N('In her story it is the spider who gets caught. In yours, he did the catching.'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'Tell her you heard it the other way round.',
              then: [
                EL('Did you now? Where?', 'think'),
                Y('A long way off. The spider made the doll, and a fairy got stuck.'),
                EL('Well. That one’s right too. He gets about, that spider.', 'happy'),
              ],
            },
            {
              id: 'listen',
              label: 'Just listen to the end.',
              then: [EL('And how did he get loose? Same way as always. He talked.', 'happy'), N('The children cheer.')],
            },
          ],
        },
        done: {
          id: 'a28-11-gum-done',
          lines: [
            N('Your Nubbin looks at its paw, which has been stuck to something all the way through this story, and seems comforted.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a28-11-complete',
      lines: [
        N('The lamp on the nail hums. Somebody inside turns the radio off.'),
        EL('There are a hundred ways to tell him. Every one of them is right, as long as he gets away at the end.', 'soft'),
        N('Two tellings of one story, on two sides of an ocean, and neither one is wrong.'),
        N('The page lifts again, and you feel it begin to turn back.'),
      ],
    },
    rewards: [],
    sets: { 'a28-11': true },
    notes:
      'JAMAICAN WRITERS: every line of Miss Ivy and the boy is a placeholder in plain English. Jamaican writers write the final ' +
      'lines (and her name), or the page ships with these plain ones; no dialect spelling, ever, and never for comedy. ' +
      'SLAVERY: a28-11-step#5 is the one sentence, said plainly and with dignity; nothing is shown (no ships, no chains), it is ' +
      'never played or turned into a mechanic, and nobody makes a moment of it beyond the next narration. The yard is a home ' +
      'yard today or in living memory, not a museum. The gum figure in her story is "a little man out of wood"; never "tar ' +
      'baby". The page’s two tellings (the spider caught / the spider catching) are both right, as the outline says.',
  },

  // ---------------------------------------------------------------- A28-12
  {
    id: 'a28-12',
    code: 'A28-12',
    title: 'Take Some Elsewhere',
    source: `${TALES}: the storyteller’s closing (Rattray 1930)`,
    audience: 'all',
    trigger: { where: WHERE, when: after('A28-11') },
    requires: ['A28-11'],
    speakers: [STORYTELLER, CHILDREN, WISP],
    steps: [
      {
        id: 'a28-12-s1',
        goal: 'Come back to the courtyard fire.',
        hint: 'Let the page turn back, and find your mat by the fire.',
        check: 'sit:a28-mat:courtyard',
        scene: {
          id: 'a28-12-return',
          lines: [
            N('The page turns back. It is the courtyard again: the fire lower now, the children sleepier, the moths still at the wall.'),
            N('You are sitting on your mat, as if you never left it. Your Nubbin is beside you, sticky in three places.'),
            ST('Again? You want another? It’s late.', 'think'),
            ST(LIFT_THEY_SAY),
            ST('and… no. No, I’ve told enough. Somebody else tells one now.', 'happy'),
            N('She turns on the stool and looks straight at you.'),
            ST('You. The one who has been away. Your turn.'),
            N('Your Nubbin climbs up on to the stool beside her, as if it has been invited too.'),
          ],
        },
        done: {
          id: 'a28-12-return-done',
          lines: [N('The children turn round on their mats to look at you. Everybody waits, exactly as they waited for her.')],
        },
      },
      {
        id: 'a28-12-s2',
        goal: 'Tell the courtyard a story of your own.',
        hint: 'Stand by the stool. You know which story it is.',
        check: 'talk:a28-courtyard:tale',
        scene: {
          id: 'a28-12-tell',
          lines: [
            Y('This one’s about a fairy, and a doll covered in gum.'),
            N('You tell them about the odum tree, and the yam, and the thank-you that nobody answered.'),
            N('You tell them how she stuck, both hands, and how the spider ran for rope.'),
            Y('And while he was gone, somebody stayed by a root and didn’t help her. It wasn’t their story to change.'),
            Y('So she waited for the rope with her chin up, and she went up to the sky caught. But she went up proud.'),
            N('The courtyard is quiet. A small boy at the front is frowning, which is the best sign there is.'),
            ST('Hm. That one is a true one.', 'soft'),
            ST('Things get caught. That’s how it is. I’ll keep a piece of that. The chin.'),
          ],
        },
        done: {
          id: 'a28-12-tell-done',
          lines: [
            N('She taps her own chin and lifts it, just a little. Several of the children copy her.'),
          ],
        },
      },
      {
        id: 'a28-12-s3',
        goal: 'Hear the storyteller’s last story of the night.',
        hint: 'Sit back down on your mat.',
        check: 'sit:a28-mat:last',
        scene: {
          id: 'a28-12-last',
          lines: [
            ST('One more. A short one. Mine, this time. I heard it from a spider.', 'happy'),
            ST('There was a small round one, who once paid a whole buttercup for a story.'),
            ST('And the story was one word long, and the word was the spider’s own name.'),
            N('Your Nubbin sits up very straight on the stool.'),
            ST('And the small round one thought it fair. And do you know? It was right.', 'soft'),
            ST('Because it was a story about someone. And that is all any of them are.'),
          ],
        },
        done: {
          id: 'a28-12-last-done',
          lines: [N('Your Nubbin is beaming. The children don’t quite understand, and laugh anyway.')],
        },
      },
    ],
    complete: {
      id: 'a28-12-complete',
      lines: [
        N('The old woman stands up from the stool, slowly, because she can. She says the last words, the ones that close it.'),
        ST(LIFT_CLOSING),
        CH('Some come back!', 'happy'),
        N('The fire sinks and the walls thin. The courtyard folds itself up into a page, warm under your hands.'),
        N('You are sitting in the Grove with Nova’s atlas open on your knees, and you have brought some of it away.'),
        N('By the cottage hearth sits a carved box you have never seen before. Its lid is closed, and something inside is humming.'),
      ],
    },
    rewards: [
      {
        id: 'a28-story-box',
        kind: 'feature',
        label: 'The Story Box',
        description:
          'A carved box by the cottage hearth. Open it in the evening and your Nubbins gather round while it plays a story from a page you’ve finished, told in Nubbin mime.',
      },
    ],
    sets: { 'a28-12': true, 'a28-done': true },
    childLines: {
      'a28-12-return#3': 'Long ago, they say, the spider Kwaku Ananse was there,',
      'a28-12-complete#1': 'That’s my story. If you liked it, or if you didn’t, take a bit of it with you, and bring a bit back to me.',
    },
    notes:
      'LIFTED TEXT, Rattray 1930, verified: a28-12-return#3 (the wisdom tale’s opening, which she starts and then hands over) ' +
      'and a28-12-complete#1 (the closing formula). Each has a childLines entry. "Some come back!" is our own call-back ' +
      '(advisers may supply a customary one). THE FAIRY (a28-fairy, A28-6), step 2: a28-12-tell is for left ("a true one"). ' +
      'For freed play ATLAS_A28_VARIANTS a28-12-tell-freed ("a clever one"); for sat, a28-12-tell-sat ("a kind one"). WISP, ' +
      'step 3: a28-12-last is for a28-trade = nubbin with no Wisp history (Grove wisp unset). With a28-wisp = came, play ' +
      'a28-12-last-wisp (Wisp leaves the page carrying the story). Else with the Grove’s wisp = driven, play a28-12-last-driven ' +
      '(a choice; sets a28-gate, Atlas only, changes nothing in the Grove). SIM: see the variants block header for the story ' +
      'box and Wisp’s ambient.',
  },
];

// =================================================================== variants

/**
 * Variant scenes, chosen by flags. Each names the scene it replaces or follows.
 *
 * SIM (Grove side, read-only reads of the Atlas save):
 *   - The story box (reward a28-story-box): a decor-feature by the cottage hearth, enabled by atlasDone('A28'). Open it in
 *     the Grove's evening and the Nubbins gather; it plays one finished Atlas page in Nubbin mime (a short wordless
 *     animation per page; the pick is seeded among finished pages, never "one per day"). Unlimited.
 *   - With atlasFlag('A28', 'a28-trade') = wisp and the Grove's Wisp present: Wisp's sleeping spot under the cottage step
 *     shows the egg stone and the empty hornet gourd, stoppered (Fern's glove stays with Ananse: Wisp traded it away in
 *     a28-08-debt-wisp); sometimes (seeded) he drags the story box
 *     to the step at night, and it is back by the hearth by morning. Ambient only; no flag written.
 *   - The gourd decoration (a28-gourd-pot) tips over at seeded random intervals and rights itself with a sparkle. Ambient.
 */
export const ATLAS_A28_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- Hazel's margin note (s24Done)
  {
    id: 'a28-margin-hazel',
    lines: [
      N('In the margin beside the courtyard, in soft pencil you have never noticed before, there is a note. You know the hand.'),
      N('“Nova says here they tell you it isn’t true before they start. Best manners I ever heard of.”'),
      N('Underneath, smaller, is a spider drawn in four quick lines, wearing a hat.'),
    ],
  },

  // ---------------------------------------------------------------- A28-2, wisp = spared | sable: replaces a28-02-road
  {
    id: 'a28-02-road-wisp',
    set: { 'a28-wisp': 'came' },
    lines: [
      N('At the foot of the thread your bag shifts. A grey head comes out of it, torn ear first, and looks at the forest with deep suspicion.'),
      N('It is Wisp, who would not be left at home. Nor would he leave the egg stone, and it is in his paws now.'),
      AN('Hello. What’s that?', 'think'),
      W('…mine.', 'soft'),
      AN('Of course it’s yours. Lovely thing. Smooth. I’d give you a story for it.', 'happy'),
      AN('Not now, obviously. Once I own them. Which will be very soon. A story, for the stone. Fair?'),
      N('Wisp hisses, long and low. Then he puts out one paw to shake, and keeps the stone tight in the other.'),
      N('Ananse shakes it with one leg, and keeps three crossed behind his back.'),
      W('deal. …mine still.', 'soft'),
      AN('Of course. Of course. Everything in its time.', 'happy'),
      N('Your Nubbin, meanwhile, has sat down in a puddle of sap and stuck. Nobody is surprised.'),
    ],
    choices: [
      {
        id: 'warn',
        label: 'Tell Wisp he doesn’t have to.',
        then: [W('Hsss. Deal.', 'angry'), N('He has decided. You can see it in his ears.')],
      },
      {
        id: 'let',
        label: 'Let them shake on it.',
        then: [N('You let it be. A thief and a spider deserve each other, and they both look delighted.')],
      },
    ],
  },

  // ---------------------------------------------------------------- A28-8, a28-wisp = came: replaces a28-08-debt
  {
    id: 'a28-08-debt-wisp',
    set: { 'a28-trade': 'wisp' },
    lines: [
      N('Ananse sits by the empty box. Wisp climbs out of your bag and sits directly in front of him, staring.'),
      W('story. owed.', 'soft'),
      AN('Ah. Yes. The debt. A spider always pays.', 'think'),
      N('He looks at the empty box, and round his doorstep. Then he picks up a small stoppered gourd and holds it out.'),
      AN('A story. In a gourd. Very rare. Don’t open it till you’re home.'),
      N('Wisp opens it at once. Out comes one hornet, the last of the swarm, very annoyed, and stings him on the nose.'),
      N('Your Nubbin, nose still lumpy, watches this with deep and private satisfaction.'),
      N('Wisp sneezes. Then he reaches into the bag behind him and puts something on the step: Fern’s old left glove.'),
      W('warm. was warm.', 'soft'),
      AN('A glove! One glove. I have eight hands. This is… thank you.', 'shock'),
      N('Ananse puts the glove on one foot. Wisp puts the gourd in your bag next to the stone.'),
      N('Each of them is quite sure he has won. You decide not to tell either of them.'),
    ],
    choices: [
      {
        id: 'nose',
        label: 'Check Wisp’s nose.',
        then: [N('He lets you look, for once: a small bump. Your Nubbin pats it, gently, as one veteran to another.')],
      },
      {
        id: 'glove',
        label: 'Ask Ananse where the story is, then.',
        then: [AN('It’s in the gourd. It was the hornet. A short story with a sting in it. All the best ones have.', 'happy')],
      },
    ],
  },

  // ---------------------------------------------------------------- A28-9, a28-fairy = freed: replaces a28-09-scatter-done
  {
    id: 'a28-09-scatter-done-freed',
    lines: [
      N('The pieces come down on the far side of the clearing, on the ants, the frogs and a very surprised goat.'),
      N('Then something small and quick darts out of the trees: Mmoatia, home from the sky and nobody’s prisoner.'),
      N('She catches one bright piece in her free hand, the hand you gave back, before it can touch the ground.'),
      MM('Here. A hand for a hand.', 'soft'),
      N('She drops it into your Nubbin’s paws and is gone again before anyone can thank her. Your Nubbin holds it very still.'),
    ],
  },

  // ---------------------------------------------------------------- A28-9, a28-fairy = sat: replaces a28-09-scatter-done
  {
    id: 'a28-09-scatter-done-sat',
    lines: [
      N('Somebody sits down next to you under the tree. It is Mmoatia, home from the sky, and she says nothing at all.'),
      N('The wisdom comes down on the clearing like warm rain, and on the two of you, and on your Nubbin between you.'),
      N('None of you move to catch any. You sit, and get rained on, together.'),
      N('When it stops, she leans, very slightly, against your arm. Then she is gone.'),
    ],
  },

  // ---------------------------------------------------------------- A28-10, a28-fairy = freed: replaces a28-10-dance-done
  {
    id: 'a28-10-dance-done-freed',
    lines: [
      N('Behind Ananse, half hidden in the crowd, a small figure is laughing into her free hand. It is Mmoatia.'),
      N('She reaches up with that hand and tips his hat clean off.'),
      N('The beans come down all over the yard. Every hair on Ananse’s head has been scorched clean away.'),
      MM('A spider caught me once. Fair’s fair.', 'happy'),
      N('There is a short silence, and then a very long laugh, and hers is the loudest.'),
    ],
  },

  // ---------------------------------------------------------------- A28-10, a28-fairy = sat: replaces a28-10-dance-done
  {
    id: 'a28-10-dance-done-sat',
    lines: [
      N('Then the hat comes off on its own, sailing up into the air, and the beans come down all over the yard.'),
      N('Every hair on Ananse’s head has been scorched clean away. There is a short silence, and then a very long laugh.'),
      N('Later, when he is hiding in the long grass, someone small sits down beside him. It is Mmoatia.'),
      N('She says nothing. She lays a cool, wet leaf on his poor bald head, and stays a while.'),
      N('Ananse, for once in his life, says nothing either.'),
    ],
  },

  // ---------------------------------------------------------------- A28-12, a28-fairy = freed: replaces a28-12-tell
  {
    id: 'a28-12-tell-freed',
    lines: [
      Y('This one’s about a fairy, and a doll covered in gum.'),
      N('You tell them about the odum tree, and the yam, and the thank-you that nobody answered.'),
      N('You tell them how she stuck, both hands, and how the spider ran for rope.'),
      Y('And while he was gone, somebody worked one of her hands loose. Only one. The other had to stay.'),
      Y('So she went up to the sky caught, but with a hand of her own. And she used it, later. Mostly on hats.'),
      N('The children laugh, and one of them claps with one hand on his knee.'),
      ST('Ha! That one is a clever one.', 'happy'),
      ST('One hand free, and the story still holds. I’ll keep a piece of that. The hand.'),
    ],
  },

  // ---------------------------------------------------------------- A28-12, a28-fairy = sat: replaces a28-12-tell
  {
    id: 'a28-12-tell-sat',
    lines: [
      Y('This one’s about a fairy, and a doll covered in gum.'),
      N('You tell them about the odum tree, and the yam, and the thank-you that nobody answered.'),
      N('You tell them how she stuck, both hands, and how the spider ran for rope.'),
      Y('And while he was gone, somebody sat down next to her. They didn’t say anything. They just waited with her.'),
      Y('She was still caught when the rope came. But she wasn’t on her own.'),
      N('The courtyard is very quiet. A girl at the back leans against her brother, and he lets her.'),
      ST('Mm. That one is a kind one.', 'soft'),
      ST('Nothing got fixed in it, and it’s better anyway. I’ll keep a piece of that. The sitting.'),
    ],
  },

  // ---------------------------------------------------------------- A28-12, a28-wisp = came: replaces a28-12-last
  {
    id: 'a28-12-last-wisp',
    lines: [
      ST('One more. A short one. Mine, this time. Nobody asked for it, so listen properly.'),
      N('Wisp has come out of your bag. He sits at the edge of the firelight with the egg stone in his paws.'),
      ST('There was a grey thief with a torn ear, who wanted every warm thing in the world.'),
      ST('And he kept a stone that had gone cold. He kept it long after it was any use to anyone.'),
      ST('He traded with a spider once, and both of them were cheated, and both of them went home pleased.'),
      ST('But the spider threw something in for nothing, and never knew. The best thing in the whole bargain.'),
      N('Wisp’s ears have come up. He has stopped looking at the fire, and is looking at her.'),
      ST('A story. Not the one in the gourd. This one. The one about him.', 'soft'),
      N('Wisp listens to the very end, without moving. Then he gets up, carefully, the way you get up holding something full.'),
    ],
  },

  // ---------------------------------------------------------------- A28-12, Grove wisp = driven: replaces a28-12-last
  {
    id: 'a28-12-last-driven',
    lines: [
      ST('One more. A short one. Mine. But I don’t know the end, so you’ll have to help me.', 'think'),
      ST('There was a grey one who was sent away from a garden. A thief, they said, and they were right.'),
      ST('And still, some evenings, he comes down the lane, and looks at the gate, and doesn’t try it.'),
      N('The children have gone very quiet. Your Nubbin is looking at you.'),
      ST('How does it end?'),
    ],
    choices: [
      {
        id: 'unknown',
        label: 'Say, “I don’t know.”',
        set: { 'a28-gate': 'unknown' },
        then: [
          ST('No. Neither do I. That is a good answer. Most true stories end that way, for a long while.', 'soft'),
          ST('Keep it open, then. Somebody will finish it.'),
        ],
      },
      {
        id: 'back',
        label: 'Say, “He comes back.”',
        set: { 'a28-gate': 'back' },
        then: [
          ST('Does he? Good. Then that’s how I’ll tell it.', 'happy'),
          ST('Saying it is half of it. The rest is somebody opening the gate.', 'soft'),
        ],
      },
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads wisp, stoneUnmadeBy and s24Done from the Grove and writes no Grove flag. */
export const ATLAS_A28_FLAGS: string[] = [
  'a28-01',
  'a28-02',
  'a28-03',
  'a28-04',
  'a28-05',
  'a28-06',
  'a28-07',
  'a28-08',
  'a28-09',
  'a28-10',
  'a28-11',
  'a28-12',
  'a28-done', // A28-12: the whole page; the Grove's story box reads it through atlasDone('A28')
  'a28-fairy', // freed | left | sat (a28-06-wait): A28-9, A28-10 and A28-12
  'a28-wisp', // came (a28-02-road-wisp): A28-8 and A28-12
  'a28-trade', // wisp | nubbin (a28-08-debt / a28-08-debt-wisp): A28-12; the Grove's Wisp ambient
  'a28-gate', // unknown | back (a28-12-last-driven): Atlas only, changes nothing
];

export const ATLAS_A28_CHECKS: string[] = [
  'visit:a28-courtyard:evening',
  'sit:a28-mat:story',
  'explore:a28-tale:spider',
  'climb:a28-web:sky',
  'talk:a28-nyame:court',
  'walk:a28-forest:path',
  'collect:a28-branch:palm',
  'watch:a28-onini:argument',
  'carry:a28-onini:tail',
  'collect:a28-gourd:water',
  'watch:a28-mmoboro:nest',
  'place:a28-stopper:gourd',
  'build:a28-pit:path',
  'wait:a28-osebo:dawn',
  'carry:a28-osebo:bundle',
  'craft:a28-doll:carve',
  'watch:a28-mmoatia:odum',
  'choose:a28-mmoatia:odum',
  'escort:a28-ya-nsia:court',
  'talk:a28-nyame:stories',
  'carry:a28-box:home',
  'watch:a28-box:open',
  'give:a28-ananse:trade',
  'collect:a28-wisdom:pot',
  'watch:a28-ananse:climb',
  'watch:a28-wisdom:scatter',
  'visit:a28-funeral:yard',
  'watch:a28-ananse:beans',
  'puzzle:a28-ananse:dignity',
  'explore:a28-yard:night',
  'sit:a28-step:story',
  'talk:a28-elder:gum',
  'sit:a28-mat:courtyard',
  'talk:a28-courtyard:tale',
  'sit:a28-mat:last',
];
