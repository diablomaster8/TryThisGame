/**
 * Atlas campaign, page A10: The Heart of the Island (Part L). Fourteen quests, A10-1 to A10-14.
 *
 * SOURCE. Moana (Walt Disney Animation Studios, 2016; directed by Ron Clements and John Musker).
 * Rights: The Walt Disney Company, which also holds trade marks in the name and the designs.
 * The film draws on many Pacific peoples' traditions: the demigod Māui belongs to Polynesian
 * tradition (Hawaiʻi, Aotearoa, Samoa, Tonga, Tahiti and beyond), not to the film. This page
 * needs a licence before ship (an open decision for Maor). All dialogue is original; no line of
 * the film's script is used. Nothing from the film's songs: no lyrics, no titles, no melodies,
 * no song-shaped speeches. Gramma Tala's song in A10-12 is our own, and it is described, never
 * written out. All art is original: our own Moana, Maui, Tala, canoe and Kakamora designs, in
 * the atlas's watercolour-on-tapa style; no Disney model sheet, pose or colour key.
 *
 * AUDIENCE. 'all'. No text is lifted or quoted, so no quest needs `childLines`. The Learning
 * Grove version (both bands) is a separate task; its topics are in the outline (star compass,
 * swells and birds; Hōkūleʻa's 1976 voyage to Tahiti; coral reefs; the Pacific on a map).
 *
 * FRAME. Nova's atlas falls open at a page washed in sea-blue, and you and your Nubbin step out
 * onto the beach of Motunui. Gramma Tala takes you in as a guest from "somewhere past the reef".
 * Moana is the hero and keeps her story: she is chosen, she sails, she finds Maui, she restores
 * the heart. You are a guest who carries, holds, bails and watches. Your Nubbin stows away on her
 * canoe in A10-5, curled up in the hull with Heihei the rooster; the ocean lifts you aboard after
 * it. Running jokes: Heihei and your Nubbin are inseparable and equally unhelpful; Maui is sure
 * your Nubbin is "a coconut with opinions"; the Kakamora think it is one of theirs. Nobody on the
 * page speaks for the ocean, Heihei, Pua, the Kakamora, Te Kā or Te Fiti: none of them talk. Your
 * Nubbin never talks.
 *
 * GROVE FLAGS READ: none. The outline asks for no Grove variants on this page. One piece of
 * engine data sits outside this file: S24 (side-stories-s24.ts) defines Hazel's margin note for
 * this page, shown beside A10-5 "Setting Sail" once s24Done is set ("The grandmother goes first
 * and tells her to go..."). The page has no margin variant of its own and needs none.
 *
 * CHOICES. Every quest has at least one choice point (14 points, 29 options). Only a10-03-step
 * and a10-13-walk set flags; the rest are small, flagless moments at the edges (what you say,
 * what you hand over, where your Nubbin goes). None of them touches Moana's or Maui's story.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a10-; the Atlas never writes a Grove flag):
 *   - a10-01 … a10-14: each quest on completion. a10-done: the whole page (A10-14); the Great
 *     Voyage festival (A2, A6, A9, A10, any two) reads it through atlasDone('A10').
 *   - a10-step = glide | wave (A10-3, a10-03-step): Gramma's step. Pays off in A10-12 (the manta
 *     moves in it and your Nubbin answers: a10-12-manta or A10_VARIANTS a10-12-manta-wave) and
 *     A10-14 (your Nubbin dances it at the bow: a10-14-bow or a10-14-bow-wave), and in the Grove
 *     canoe's idle animation.
 *   - a10-approach = gift | word | walk (A10-13, a10-13-walk): how you walk to Te Kā behind
 *     Moana. Pays off at once in Te Fiti's answer (the choice's own lines), in A10-14's complete
 *     scene (a10-14-complete, a10-14-complete-word, a10-14-complete-walk) and in the detail on
 *     the Grove canoe. It is the page's second signature choice; it sits one quest from the end
 *     by the outline's design, so its long payoff is the Grove detail.
 *
 * LIFTED TEXT: none. The outline lists no quotes and we use none (0 of the 3 allowed). The film's
 * famous lines are deliberately not echoed: Moana's declaration in A10-12 and her words to Te Kā
 * in A10-13 are our own, and different in shape. Maui's boasts list deeds from Polynesian
 * tradition (fishing up islands, slowing the sun, bringing fire), not the film's lines.
 *
 * CARE NOTES.
 *   - Maui is a revered figure across Polynesia. He may boast, sulk and be wrong, as the film's
 *     Maui is, but he is never a buffoon: his deeds are real, his grief is real, and the narration
 *     never mocks him. No comic tattoo character: his tattoos are records of his deeds, shown and
 *     spoken of with respect.
 *   - Gramma Tala's stingray tattoo and Maui's tattoos are described plainly and respectfully,
 *     never played for jokes; the Learning Grove version must not invite children to copy them.
 *   - Sacred elements are not performed: no haka, no chant text, no prayer. Where Maui opens
 *     Lalotai, he speaks old words that the page does not write down.
 *   - Gramma Tala's death (A10-5) is said plainly and gently, with comfort straight after (the
 *     manta). Tui's lost friend is told in one line. Maui's abandonment as a baby is told softly.
 *   - Te Kā is fire and noise but never hurts anyone on screen for longer than a line; Tamatoa is
 *     vain and funny, never cruel to the Nubbin.
 *   - Work with Pacific Islander cultural advisers before scripting is final (CV4 step 2). Ask
 *     them in particular about: the wayfinding lines in A10-8, the cave of canoes, Gramma's song,
 *     Maui's portrayal, and the use of "Te Fiti", "Te Kā" and "Lalotai".
 *   - Don't reuse the film's songs (see SOURCE).
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

const WHERE = 'Nova’s atlas: the Heart of the Island page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;

// ------------------------------------------------------------------ speakers

const MOANA = sp('a10-moana', 'Moana', 'Moana of Motunui (Moana, Disney, 2016); original design');
const TALA = sp('a10-tala', 'Gramma Tala', 'Gramma Tala, Moana’s grandmother (Moana, Disney, 2016); original design');
const TUI = sp('a10-tui', 'Chief Tui', 'Chief Tui, Moana’s father (Moana, Disney, 2016); original design');
const SINA = sp('a10-sina', 'Sina', 'Sina, Moana’s mother (Moana, Disney, 2016); original design');
const MAUI = sp(
  'a10-maui',
  'Maui',
  'Maui as the film tells him (Moana, Disney, 2016), after the demigod Māui of Polynesian tradition; original design',
);
const TAMATOA = sp('a10-tamatoa', 'Tamatoa', 'Tamatoa, the giant crab of Lalotai (Moana, Disney, 2016); original design');
const FISHER = sp('a10-fisher', 'Old fisherman', 'a Motunui villager (Moana, Disney, 2016); original character');
const FARMER = sp('a10-farmer', 'Coconut farmer', 'a Motunui villager (Moana, Disney, 2016); original character');

const N = say('narrator');
const Y = say('you');
const M = say('a10-moana');
const G = say('a10-tala');
const T = say('a10-tui');
const S = say('a10-sina');
const MU = say('a10-maui');
const TM = say('a10-tamatoa');
const F = say('a10-fisher');
const FM = say('a10-farmer');

// ------------------------------------------------------------------ shared pieces

/** A10-14 complete: the way home and the rewards, shared by all three approach variants. */
const A14_HOME: Line[] = [
  N('The page gives a long, slow sigh, like a sail letting go of the wind.'),
  N('You are back in the Grove with Nova’s atlas on your knee. Your Nubbin smells of salt and is still swaying.'),
  N('By the pond there is a small voyaging canoe, twin-hulled, with a woven sail no bigger than a tablecloth.'),
  N('Up on the hill, a ring of flat stones has appeared in the grass, each one marked with a house of the rising stars.'),
];

// =================================================================== THE HEART OF THE ISLAND

export const ATLAS_A10: Quest[] = [
  // ---------------------------------------------------------------- A10-1
  {
    id: 'a10-01',
    code: 'A10-1',
    title: 'The Chosen One',
    source: 'Moana (2016): the prologue, Gramma Tala’s story and the toddler on the beach',
    audience: 'all',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove; the first quest on the page.',
    },
    speakers: [TALA, TUI, MOANA],
    steps: [
      {
        id: 'a10-01-s1',
        goal: 'Step onto the island and find the voice telling a story.',
        hint: 'Touch the page, then follow the children’s laughter to the open house.',
        check: 'explore:a10-motunui:beach',
        scene: {
          id: 'a10-01-page',
          lines: [
            N('Nova’s atlas falls open at a page washed in sea-blue. There is an island in the middle of it, very green, ringed with white.'),
            N('The paint goes warm under your hand, then wet. Then it is sand, and you and your Nubbin are standing in it.'),
            N('Behind the palms there is a house with no walls, only a roof on posts. A crowd of small children sits inside it.'),
            N('An old woman is telling them a story with her hands. A painted cloth hangs behind her: an island shaped like a sleeping woman.'),
            G('Before the palms, before the fish, there was the sea and nothing else. Then the mother island came up out of it.', 'soft'),
            G('Her heart could make things grow. She gave that away to every island she could reach. Green, and more green, and more.', 'happy'),
            N('She spots you at the edge of the shade, and doesn’t miss a beat. She just shuffles up to make room.'),
            G('Sit, sit. Somebody from past the reef. We don’t get many. Your little one can sit on the end.'),
            N('Your Nubbin sits on the end, beside a toddler with a great deal of hair. The toddler pats it, firmly, like a drum.'),
          ],
        },
        done: {
          id: 'a10-01-page-done',
          lines: [
            G('Now. Where was I? The heart. Everyone wanted it. And one of them came to take it.', 'think'),
          ],
        },
      },
      {
        id: 'a10-01-s2',
        goal: 'Hear the rest of the story, the frightening bit included.',
        hint: 'Stay in the shade with the children until the story is done.',
        check: 'sit:a10-tala:story-house',
        scene: {
          id: 'a10-01-story',
          lines: [
            G('A trickster. A shapeshifter, with a great fish hook the gods gave him. Maui.'),
            G('He took the heart, and the mother island began to crumble. As he fled, a demon of earth and fire rose up after him.'),
            N('Most of the children squeal and hide behind each other. The toddler leans forward, delighted.'),
            G('Maui was struck from the sky, and the heart and his hook fell into the sea. Nobody has found them since.'),
            G('And the darkness is still spreading, island by island. One day it will reach us.', 'sad'),
            N('A tall man ducks in under the roof, with the face of a father who has heard this story before.'),
            T('Mother. That’s enough. They won’t sleep for a week.'),
            T('There is no darkness, and nobody here needs to cross the reef. We have fish, we have coconuts, we have each other. That’s plenty.'),
            N('The children scatter. The toddler is carried off under his arm, upside down, still waving at your Nubbin.'),
            G('He’s my son, and he’s a good chief. He’s also wrong. Both at once. You’ll find that’s quite common.', 'soft'),
          ],
        },
        done: {
          id: 'a10-01-story-done',
          lines: [
            N('Gramma Tala picks up a stick and walks off towards the shore, humming. She doesn’t look back to see if you follow, and you do.'),
          ],
        },
      },
      {
        id: 'a10-01-s3',
        goal: 'Watch over the baby turtle on the beach.',
        hint: 'Go down to the waterline where the toddler has escaped to.',
        check: 'watch:a10-turtle:shore',
        scene: {
          id: 'a10-01-turtle',
          lines: [
            N('The toddler has got loose again. She is down on the wet sand, frowning at something small and flat.'),
            N('It is a baby turtle, trying to reach the water. Seabirds circle above it, with ideas.'),
            N('The toddler pulls a big leaf off a bush and holds it over the turtle like a roof. She walks beside it, step by step.'),
          ],
          choices: [
            {
              id: 'shade',
              label: 'Send your Nubbin to walk on the other side.',
              then: [N('Your Nubbin waddles along the other side of the turtle, holding up its arms. Together they make a very small, very slow parade.')],
            },
            {
              id: 'birds',
              label: 'Wave the birds away.',
              then: [N('You flap your arms at the birds, and your Nubbin flaps its tiny wings. The birds decide, on balance, to go and bother someone else.')],
            },
          ],
        },
        done: {
          id: 'a10-01-turtle-done',
          lines: [
            N('The turtle reaches the foam and is gone. The toddler claps, and so does your Nubbin, mostly missing.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-01-complete',
      lines: [
        N('Then the sea pulls back from the toddler’s feet, and keeps pulling, and stands up in a wall of clear water.'),
        N('Fish hang in it like flecks in glass. The wall leans down to look at her, the way a dog leans down to a puppy.'),
        N('It sets a shell in her hands, then another. Then a small green stone with a spiral cut into it.'),
        T('Moana! Moana, where are you?'),
        N('The water falls back to being just the sea. The toddler runs to her father’s voice, and the green stone drops in the sand.'),
        N('Gramma Tala bends, slowly, and picks it up. She tucks it into the shell at her neck.'),
        G('The sea picks who it picks, and never explains itself. Grandchildren are the same.', 'soft'),
        N('The page ripples. When it settles, the palms are taller, and some years have gone by.'),
      ],
    },
    rewards: [],
    sets: { 'a10-01': true },
    notes:
      'OPENING: the atlas page is a sea-blue wash that deepens into a beach (a slow bleed of colour, two seconds). ' +
      'The story cloth behind Tala is our own painting, not the film’s. Moana is a toddler in this quest only; she ' +
      'never speaks here. The water wall is gentle and lit from inside: no wave crashes. The page ripple at the end ' +
      'is the time skip to Moana at sixteen; it plays as the page turning by itself.',
  },

  // ---------------------------------------------------------------- A10-2
  {
    id: 'a10-02',
    code: 'A10-2',
    title: 'The Reef',
    source: 'Moana (2016): the blight on Motunui, and Moana’s first try past the reef',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-1') },
    requires: ['A10-1'],
    speakers: [MOANA, TUI, FARMER, FISHER],
    steps: [
      {
        id: 'a10-02-s1',
        goal: 'Walk the village with the chief’s daughter, and see the coconut trees.',
        hint: 'Meet Moana by the chief’s house and go up to the grove.',
        check: 'inspect:a10-coconuts:grove',
        scene: {
          id: 'a10-02-coconuts',
          lines: [
            N('Moana is sixteen now, and is being taught to be chief, which mostly means people bringing her problems.'),
            M('You’re Gramma’s guest! She said you’d come back. She says that about everyone, but she was right this time.', 'happy'),
            M('Come on. The coconut farmers want me. They always want me before breakfast.'),
            FM('Look at this. Cracked one open this morning.'),
            N('He holds out a coconut split in half. Inside, where it should be white, it is black and soft and smells of nothing good.'),
            FM('Whole trees of them. Not just old trees. Young ones too.'),
            M('Then we clear those trees and plant a new grove over there. It’s good ground. We just haven’t used it.', 'think'),
            N('The farmer nods slowly, which on Motunui means yes, and also means we’ll see.'),
          ],
          choices: [
            {
              id: 'dig',
              label: 'Offer to dig the first hole for the new grove.',
              then: [
                FM('A guest who digs. Now I’ve seen everything.', 'happy'),
                N('You dig. Your Nubbin helps by sitting in the hole, to check it is the right size.'),
              ],
            },
            {
              id: 'ask',
              label: 'Ask how long the trees have been sick.',
              then: [
                FM('Since the rains. It started on the far side and walked this way, a tree at a time.', 'think'),
                N('Moana looks towards the far side of the island, and then past it, at the sea. She doesn’t say anything.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-02-coconuts-done',
          lines: [
            M('That’s one. Next it’ll be the roofs, or the fishing. It’s always the fishing.'),
          ],
        },
      },
      {
        id: 'a10-02-s2',
        goal: 'Go down to the lagoon, where the nets have come in empty.',
        hint: 'Find the fishermen at the boat shelter.',
        check: 'talk:a10-fisher:lagoon',
        scene: {
          id: 'a10-02-lagoon',
          lines: [
            N('The fishing canoes are drawn up on the sand, their nets draped over them, dry. Nothing in them but weed.'),
            F('Every day, fewer. Today, none. The lagoon’s been fished out, or the fish have gone somewhere.', 'sad'),
            M('Different nets? The far side of the island?'),
            F('Tried both. Nothing.'),
            N('Moana looks past the lagoon, to where the waves break white on the reef. Past that, the sea is a darker blue.'),
            M('Then we go out past the reef. The fish must be out there somewhere.', 'think'),
            N('The fishermen go very quiet. One of them looks over your shoulder, where the chief has just walked up.'),
            T('We don’t cross the reef.'),
            T('We have one rule, and it keeps us safe. You know it. You’ll be chief. You’ll keep it too.'),
            N('Moana opens her mouth, and closes it again. Your Nubbin, sensing a mood, sits on her foot.'),
          ],
        },
        done: {
          id: 'a10-02-lagoon-done',
          lines: [
            N('The chief walks off. Moana watches the reef for a long time, chewing the inside of her cheek.'),
            M('He didn’t say why. He never says why.', 'angry'),
          ],
        },
      },
      {
        id: 'a10-02-s3',
        goal: 'Go out to the breakers with Moana, and bring her back in.',
        hint: 'Wade out to the reef edge and be ready to pull.',
        check: 'swim:a10-reef:breakers',
        scene: {
          id: 'a10-02-breakers',
          lines: [
            N('An hour later, Moana is pushing a small canoe off the sand, with a spotted pig sitting in the front of it.'),
            M('That’s Pua. He’s coming for luck. Don’t tell anyone. I’m only going to look.'),
            N('She paddles well in the lagoon. At the reef, the waves come in bigger and closer, one after another, like a crowd at a door.'),
            N('The third wave lifts the canoe, turns it over, and throws it back towards the beach like a leaf.'),
            Y('Moana!', 'shock'),
            N('You wade in up to your chest. Your Nubbin paddles past you, much faster, its tiny wings going like a fan.'),
            N('Between you, you get hold of her arm, and then Pua, who is very much not enjoying this.'),
          ],
        },
        done: {
          id: 'a10-02-breakers-done',
          lines: [
            N('Moana sits on the sand with a cut on her foot and the canoe in two pieces beside her. Pua stands well up the beach, sulking.'),
            M('Fine. Fine. Point taken.', 'sad'),
            N('Your Nubbin comes out of the shallows last. In its mouth is a small white shell with a spiral on it, like a tiny staircase.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-02-complete',
      lines: [
        M('He’s right. I nearly drowned the pig. Maybe I’m meant to stay, and be a good chief, and keep the rule.', 'sad'),
        N('She looks at the cut on her foot, and not at the reef. It takes some effort.'),
        N('Your Nubbin drops the spiral shell in your hand, very pleased with itself. You put it somewhere safe.'),
        N('Down the beach, out of sight round the point, somebody is laughing on her own, and splashing.'),
        M('That’ll be Gramma. She dances with the sea. Everybody thinks she’s odd. She says that’s their business.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a10-02': true },
    notes:
      'The spiral shell is a plot prop (Atlas save only, not a reward). It can be given in A10-13 (a10-approach = ' +
      'gift). The capsize is safe on screen: Moana is in the water for one line and you have her arm by the next. ' +
      'Pua the pig and the fishermen never come near danger; Pua does not talk. The blackened coconut is drawn as ' +
      'grey and soft, not rotten-gross.',
  },

  // ---------------------------------------------------------------- A10-3
  {
    id: 'a10-03',
    code: 'A10-3',
    title: 'Gramma Tala',
    source: 'Moana (2016): Gramma Tala dances with the waves',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-2') },
    requires: ['A10-2'],
    speakers: [TALA, MOANA],
    steps: [
      {
        id: 'a10-03-s1',
        goal: 'Find Gramma Tala dancing at the water’s edge.',
        hint: 'Walk round the point, to where the waves come in long and low.',
        check: 'visit:a10-tala:point',
        scene: {
          id: 'a10-03-point',
          lines: [
            N('Round the point, the waves come in long and slow. Gramma Tala is dancing in the edge of them, in a skirt that is soaked to the knee.'),
            N('She moves the way the water moves. Forward when it comes in, back when it goes, as if the two of them had rehearsed.'),
            N('On her back, from shoulder to shoulder, is a tattoo of a manta ray. It is old, and the lines have softened, and it is beautiful.'),
            G('Don’t stand there like a post. The sea doesn’t bite. Not today.'),
            M('Gramma, you shouldn’t be out here on your own.'),
            G('I’m not on my own. I’ve got the sea, and a guest, and a round little thing with wings. That’s a crowd.', 'happy'),
            G('Mantas are my favourites. When I’m finished here, that’s what I’ll be. I’ve told everyone. They don’t have to go to meetings.'),
            M('Gramma!'),
          ],
        },
        done: {
          id: 'a10-03-point-done',
          lines: [
            N('Your Nubbin has crept down into the foam and is trying to copy her. It mostly falls over, very sincerely.'),
            G('Oh, now. That one has the makings.', 'happy'),
          ],
        },
      },
      {
        id: 'a10-03-s2',
        goal: 'Let Gramma Tala teach your Nubbin one step.',
        hint: 'Stand in the shallows with your Nubbin and choose a step.',
        check: 'choose:a10-step:point',
        scene: {
          id: 'a10-03-step',
          lines: [
            G('Come here, small one. Feet in the water. Feel it pull? That’s the sea saying hello.'),
            N('Your Nubbin stands in the foam, rocking a little each time it goes out.'),
            G('I’ve got two steps for a beginner. One for the manta, one for the wave. You only get one today. I’m old, my knees are older.'),
            G('Which shall it be?', 'think'),
          ],
          choices: [
            {
              id: 'glide',
              label: 'The stingray glide.',
              set: { 'a10-step': 'glide' },
              then: [
                G('Arms out wide, and soft. Lean, and let the sea carry you sideways. Don’t flap. Mantas never flap. They fly in the water.'),
                N('Your Nubbin spreads its arms, leans, and slides along the foam on one foot, perfectly level, for very nearly a second.', 'happy'),
              ],
            },
            {
              id: 'wave',
              label: 'The wave step.',
              set: { 'a10-step': 'wave' },
              then: [
                G('Up on your toes when it comes in. Down and back when it goes. Roll your arms like the water rolls over itself.'),
                N('Your Nubbin rises, sinks, rises, rolling its little arms, a beat behind the sea and then, suddenly, right on it.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-03-step-done',
          lines: [
            G('There. That’s yours now. A step’s like a name. Once somebody’s taught it to you, it doesn’t come off.', 'soft'),
          ],
        },
      },
      {
        id: 'a10-03-s3',
        goal: 'Sit on the sand with Gramma and Moana while the tide turns.',
        hint: 'Sit down beside Gramma Tala on the dry sand.',
        check: 'sit:a10-tala:point',
        scene: {
          id: 'a10-03-sand',
          lines: [
            N('Gramma sits down on the dry sand with a noise like a sack of shells. Moana sits beside her, and you on the other side.'),
            M('I tried to go past the reef this morning. I nearly drowned Pua.'),
            G('I know. I saw. You went out on the wrong side, in the wrong boat, at the wrong tide. Otherwise, very good.', 'happy'),
            M('Dad says the reef keeps us safe.'),
            G('It does. Safe is a good thing. It isn’t the only thing.', 'soft'),
            G('Your father once had a reason for his rule. You should ask him for it, one day. Gently.'),
            N('She looks at Moana for a long moment, as if she is weighing something in her hand.'),
            G('You’ve got a question in you the size of a canoe. You always have. Ask it.', 'think'),
          ],
        },
        done: {
          id: 'a10-03-sand-done',
          lines: [
            M('Who we are. Where we came from. Why we never leave.', 'think'),
            G('Good. Get your guest. Bring a torch. It’s a walk.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-03-complete',
      lines: [
        N('Gramma gets up, which takes three tries and a hand from you. She does not mention the hand.'),
        N('Your Nubbin walks behind her up the beach, still doing its step, a little crooked, every few paces.'),
        G('It’ll come. Everything worth having comes slow. Mantas, grandchildren, steps.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a10-03': true },
    notes:
      'SIGNATURE CHOICE (a10-step, a10-03-step). Pays off in A10-12 (the manta moves in this step; a10-12-manta for ' +
      'glide, A10_VARIANTS a10-12-manta-wave for wave) and A10-14 (your Nubbin dances it at the bow; a10-14-bow or ' +
      'a10-14-bow-wave), and in the Grove canoe’s idle animation. Animation: the glide is a sideways one-foot slide ' +
      'with arms out level; the wave step is a rise-and-sink with rolling arms. Both are ours, not the film’s ' +
      'choreography. Tala’s manta tattoo is drawn as soft, faded lines on her back; it is never a joke. The camera ' +
      'keeps her dancing at a respectful distance.',
  },

  // ---------------------------------------------------------------- A10-4
  {
    id: 'a10-04',
    code: 'A10-4',
    title: 'The Cave of Canoes',
    source: 'Moana (2016): the hidden cave and the ancestors’ voyaging canoes',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-3') },
    requires: ['A10-3'],
    speakers: [TALA, MOANA],
    steps: [
      {
        id: 'a10-04-s1',
        goal: 'Follow Gramma Tala behind the waterfall.',
        hint: 'Carry the torch up the stream to where the water falls over the rocks.',
        check: 'walk:a10-cave:waterfall',
        scene: {
          id: 'a10-04-falls',
          lines: [
            N('Gramma leads you up a stream to a rock face with a waterfall coming down it, thin and noisy.'),
            G('There. Behind it. I’ve been waiting a long time to show somebody. You first, Moana. Guest second. Round one third.'),
            N('Moana looks at the waterfall, then at Gramma, and steps through. You hear her gasp on the other side.'),
            N('You follow, and the water hits your head like a cold hand. Your Nubbin goes through at a run with its eyes shut.'),
            N('Behind the falls there is a passage in the rock, sloping down, and the sound of the sea somewhere at the bottom of it.'),
            G('Go on, then. Light the way. I’ll be along. My knees take the long way round.'),
          ],
        },
        done: {
          id: 'a10-04-falls-done',
          lines: [
            N('The torch makes the wet rock shine. Your Nubbin’s emote ball glows a little too, which is no help but is company.'),
          ],
        },
      },
      {
        id: 'a10-04-s2',
        goal: 'Find what is hidden at the bottom of the cave.',
        hint: 'Go down the passage and look at the shapes in the dark.',
        check: 'inspect:a10-cave:canoes',
        scene: {
          id: 'a10-04-canoes',
          lines: [
            N('The passage opens into a cavern as big as the meeting house. A dim blue light comes in from the sea at the far end.'),
            N('Moana lifts the torch, and the shapes in the dark turn into boats.'),
            N('Not fishing canoes. Great voyaging canoes, twin-hulled, with their sails furled and their steering oars laid along the decks.'),
            N('There are dozens of them, under dust and cobweb, and every one is finer than anything on the beach.', 'shock'),
            M('Whose are these? Who built them? We don’t build these. Nobody builds these.', 'shock'),
            N('Your Nubbin climbs up onto the nearest hull and sits there, very small, under a mast as tall as a tree.'),
            N('At the front of the cave is a great drum. The skin is old, but tight.'),
          ],
          choices: [
            {
              id: 'dust',
              label: 'Brush the dust off the nearest prow.',
              then: [
                N('Under the dust the wood is carved: waves, stars, and a long line of small figures, each with a hand on the next one’s shoulder.'),
              ],
            },
            {
              id: 'torch',
              label: 'Hold the torch high so Moana can see.',
              then: [
                N('You hold the torch up. Moana walks the length of the cave touching each hull as she passes, the way you’d count heads.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-04-canoes-done',
          lines: [
            G('Bang the drum, Moana. Go on. It’s been waiting for you.', 'soft'),
          ],
        },
      },
      {
        id: 'a10-04-s3',
        goal: 'Watch what the drum remembers.',
        hint: 'Stand back while Moana beats the drum.',
        check: 'watch:a10-ancestors:drum',
        scene: {
          id: 'a10-04-drum',
          lines: [
            N('Moana beats the drum once. The sound goes all round the cave and comes back bigger.'),
            N('She beats it again, and again, and the torchlight seems to move on the sails, as if a wind were filling them.'),
            N('Then you are not in a cave. You are on the open sea, on the deck of one of those canoes, in full sail under the stars.'),
            N('All round you are more canoes, and on them people steering, singing, reading the sky, laughing at the tops of their voices.'),
            N('A woman at a steering oar looks straight at you and grins, the way you’d grin at someone who has nearly worked out a joke.'),
            N('They find an island, and land, and plant, and build. Then they load the canoes again and sail on to find the next one.'),
            N('Your Nubbin, on the deck beside you, is doing its step without seeming to know it.'),
          ],
        },
        done: {
          id: 'a10-04-drum-done',
          lines: [
            N('The drum stops ringing. You are in the cave again, with dust on your feet and the sound of the sea at the far end.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-04-complete',
      lines: [
        M('They didn’t stay. They went. Every island, they found it and they left it and went on. We did that.', 'happy'),
        G('We did. Until the darkness came, and the boats stopped coming home, and the chiefs said: no more. Stay inside the reef.'),
        G('And we hid the boats. And we forgot. All but a few of us, being stubborn.', 'soft'),
        N('Gramma opens the shell at her neck and takes out the green stone with the spiral on it.'),
        G('The ocean gave you this when you were small. I kept it for you. It’s the heart of Te Fiti, the mother island.', 'soft'),
        G('The darkness is here, Moana. The coconuts, the fish. Someone has to find Maui and make him put it back.'),
        M('I have to tell Dad. Now. Right now.', 'happy'),
        N('She is out of the cave before Gramma has finished smiling. Your Nubbin runs after her, and then back for you.'),
      ],
    },
    rewards: [],
    sets: { 'a10-04': true },
    notes:
      'The cave and canoes are our own design: twin hulls, crab-claw sails, carved steering oars, drawn after real ' +
      'Polynesian voyaging canoes (adviser review). The vision is wordless: the ancestors sing, but we hear no words ' +
      'and no tune from the film, only drums, wind and laughter. Moana’s line in the complete scene is deliberately ' +
      'not the film’s famous one.',
  },

  // ---------------------------------------------------------------- A10-5
  {
    id: 'a10-05',
    code: 'A10-5',
    title: 'Setting Sail',
    source: 'Moana (2016): the council, Tala’s last night, and Moana leaving Motunui',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-4') },
    requires: ['A10-4'],
    speakers: [MOANA, TUI, TALA, SINA],
    steps: [
      {
        id: 'a10-05-s1',
        goal: 'Stand by Moana while she tells the chief what she found.',
        hint: 'Go to the meeting house, where the elders are gathered.',
        check: 'talk:a10-tui:council',
        scene: {
          id: 'a10-05-council',
          lines: [
            N('Moana bursts into the meeting house with cobweb in her hair. The elders look up from a very long talk about roof thatch.'),
            M('Our people sailed. There are boats in a cave, real boats, and we can find more fish, and Maui, and fix everything.', 'happy'),
            T('The cave. She showed you the cave.', 'angry'),
            M('You knew? You knew, and you never…'),
            T('We are not going past the reef. I’ll burn those boats before I see one leave this beach.', 'angry'),
            N('The meeting house goes very still. Somebody puts down a roof bundle without a sound.'),
            T('When I was your age, I went past the reef. My best friend came with me. The sea was rough, and I came home, and he didn’t.', 'sad'),
            T('I won’t lose you to it. I won’t.', 'sad'),
            N('For a moment he isn’t a chief at all, only a man who has been afraid for a very long time.'),
          ],
        },
        done: {
          id: 'a10-05-council-done',
          lines: [
            N('Then a boy runs in from outside, breathless, with news: Gramma Tala has fallen, down by the shore.', 'shock'),
          ],
        },
      },
      {
        id: 'a10-05-s2',
        goal: 'Sit with Gramma Tala in her house.',
        hint: 'Go to Gramma’s house and sit by her mat.',
        check: 'sit:a10-tala:bedside',
        scene: {
          id: 'a10-05-bedside',
          lines: [
            N('Gramma lies on her mat with a healer beside her. She is very small all of a sudden, and her hands are cool.'),
            N('Moana kneels by her head, and you sit at the foot. Your Nubbin sits on the mat, carefully, as if it knows.'),
            G('Don’t fuss. I’m old. Old people do this. It’s allowed.', 'soft'),
            G('You have to go. Tonight. While your father is busy being frightened of the right thing for the wrong reason.'),
            M('I can’t leave you. Not now.', 'sad'),
            G('I’ll be the bit of you that keeps going when you want to stop. That’s not poetry. That’s just how grandmothers work.', 'soft'),
            N('She presses the shell with the heart in it into Moana’s hand and folds her fingers over it.'),
            G('Find Maui. Take him across the sea. Make him give it back. And mind your guest. Guests are a responsibility.', 'happy'),
            N('Then she turns her head to your Nubbin, and smiles, and moves one hand on the mat, in the step she taught it.'),
          ],
        },
        done: {
          id: 'a10-05-bedside-done',
          lines: [
            G('Go on. I’m only resting.', 'soft'),
          ],
        },
      },
      {
        id: 'a10-05-s3',
        goal: 'Carry food and water down to the hidden canoe in the dark.',
        hint: 'Take the bundles from Sina and carry them to the cave’s sea mouth.',
        check: 'carry:a10-provisions:cave-mouth',
        scene: {
          id: 'a10-05-pack',
          lines: [
            N('In Moana’s house, someone is already packing. It’s her mother, Sina, folding food into bundles by the light of one lamp.'),
            S('Dried fish. Coconuts, the good ones. Water. More water. You always forget water.'),
            M('Mum. I…'),
            S('I know. I heard. I’m not going to stop you. I’m going to make sure you’ve got enough to eat.', 'soft'),
            N('She holds Moana for a long time. Then she holds you, briefly, as if you were hers too, and hands you a bundle.'),
            N('You carry the bundles down the dark path to the cave’s sea mouth, where Moana has dragged out the smallest of the canoes.'),
            N('It still looks enormous. Moana loads it with her jaw set and her hands shaking.'),
          ],
          choices: [
            {
              id: 'steady',
              label: 'Hold the canoe steady while she loads.',
              then: [
                N('You hold the hull still against the swell. By the third bundle her hands are steadier, or she has stopped letting you see.'),
              ],
            },
            {
              id: 'water',
              label: 'Tell her what Sina said about water.',
              then: [
                M('I do always forget water.', 'soft'),
                N('She counts the water gourds out loud, all of them, and then once more, for her mother.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-05-pack-done',
          lines: [
            N('When you turn round, your Nubbin is gone. So is the village rooster, Heihei, who is not known for going anywhere on purpose.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-05-complete',
      lines: [
        N('Moana pushes the canoe off into the dark lagoon. The sail goes up crooked, and she doesn’t know how to fix it yet.'),
        N('From under the deck at the bow comes a small, determined cluck, and then a small, determined squeak.'),
        Y('Wait! Moana! My Nubbin’s in your boat!', 'shock'),
        N('You wade in after it, up to your waist, up to your chest. Then the sea lifts you, quite gently, and puts you on the deck.'),
        M('Did the ocean just give me a passenger?', 'shock'),
        N('Behind you, on the shore, the lamps are lit in Gramma Tala’s house. As you watch, the brightest of them goes out.'),
        N('Gramma Tala has died, quietly, in her sleep, with her family round her. Moana sees the light go, and knows.', 'sad'),
        N('Then, under the canoe, something glows. A great manta ray, lit from inside, glides past beneath you and out through the reef.', 'soft'),
        N('Moana wipes her eyes, and turns the canoe after it.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a10-05': true },
    notes:
      'DEATH, ALL AUDIENCES. Tala’s death is said once, plainly, and followed straight away by the manta (comfort). ' +
      'We never see her body; the light in the window going out is the only image. Tui’s lost friend is told in one ' +
      'line and not shown. From the complete scene on, your Nubbin rides in the bow hull with Heihei (the stowaway ' +
      'frame) and you ride on deck. Heihei never talks; he walks into things. The manta is soft blue light, our own ' +
      'design, and must read as Gramma to a child without anyone saying so.',
  },

  // ---------------------------------------------------------------- A10-6
  {
    id: 'a10-06',
    code: 'A10-6',
    title: 'Maui',
    source: 'Moana (2016): the storm, the island and the demigod',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-5') },
    requires: ['A10-5'],
    speakers: [MOANA, MAUI],
    steps: [
      {
        id: 'a10-06-s1',
        goal: 'Ride out the storm in the canoe.',
        hint: 'Bail water and hold on to the mast.',
        check: 'explore:a10-ocean:storm',
        scene: {
          id: 'a10-06-storm',
          lines: [
            N('The first day is blue and easy. Your Nubbin and Heihei come out of the hull and sit on the deck, both looking surprised to be at sea.'),
            M('Gramma said to sail by the hook-shaped stars. Those. There. I think. Maybe.', 'think'),
            N('On the second night a storm comes up out of nowhere, black and loud, and the sea stands up in hills.'),
            M('Bail! Bail, and hold on to something!', 'shock'),
            N('You bail with a coconut shell. Your Nubbin bails with its hands, very fast, mostly onto you.'),
            N('A wave the size of the meeting house rolls the canoe over, and everything goes dark and cold and loud.'),
          ],
        },
        done: {
          id: 'a10-06-storm-done',
          lines: [
            N('You wake on a beach with sand in your mouth. The canoe lies tipped on its side nearby, and Moana is shaking water out of her ears.'),
            N('Your Nubbin is asleep on top of Heihei, who hasn’t noticed.'),
          ],
        },
      },
      {
        id: 'a10-06-s2',
        goal: 'Meet the demigod on his rock.',
        hint: 'Walk up the beach towards the giant shadow.',
        check: 'talk:a10-maui:rock',
        scene: {
          id: 'a10-06-maui',
          lines: [
            N('A shadow falls across the beach. It belongs to a man the size of a small hill, with hair like a storm cloud and a broad grin.'),
            N('Every part of his skin that you can see is covered in tattoos. Each one is a picture of a great deed.'),
            MU('Visitors! At last. A thousand years on a rock, and finally, an audience. You’ll want to know who I am.', 'happy'),
            MU('Maui. I pulled islands up out of the sea on a fishing line. I slowed the sun so your days would be long enough.'),
            MU('I brought fire down to people so they could cook. Most people like to say thank you. Some of them cry. Either is fine.'),
            N('He leans down to your Nubbin, which leans back.'),
            MU('And what is this? A coconut with opinions?', 'think'),
            M('My island is dying because of what you took. I’m Moana, and you’re coming with me to put it back.', 'angry'),
            MU('Am I.', 'think'),
          ],
          choices: [
            {
              id: 'thank',
              label: 'Thank him for the long days.',
              then: [
                MU('See? Somebody was brought up properly.', 'happy'),
                N('Moana gives you a long look. You are supposed to be on her side.'),
              ],
            },
            {
              id: 'behind',
              label: 'Keep your Nubbin behind your legs.',
              then: [
                N('Your Nubbin peers round your knee at him, and Maui peers back. Your Nubbin doesn’t blink first, which bothers him more than it should.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-06-maui-done',
          lines: [
            MU('Thanks for the boat, by the way. I’ve been waiting a very long time for a boat.', 'happy'),
          ],
        },
      },
      {
        id: 'a10-06-s3',
        goal: 'Get out of the cave Maui shut you in.',
        hint: 'Climb up inside the great carved figure to the hole at the top.',
        check: 'climb:a10-cave:statue',
        scene: {
          id: 'a10-06-statue',
          lines: [
            N('Somehow, in the space of three boasts, he has herded you all into a cave and rolled a boulder over the mouth.'),
            M('He’s taking the boat. He is taking my boat!', 'angry'),
            N('Inside the cave there is a huge stone figure of Maui, carved by somebody who admired him very much. It is hollow.'),
            N('Moana starts climbing up inside it. You go after her, with your Nubbin riding on your shoulder.'),
            N('At the top is a hole, and through the hole is the sky, and far below is the sea and a canoe sailing away from the island.'),
            M('Right.', 'angry'),
            N('She jumps, and you shut your eyes and jump after her. Your Nubbin shuts its eyes too, which is unnecessary, as it is already falling.'),
          ],
        },
        done: {
          id: 'a10-06-statue-done',
          lines: [
            N('The sea catches you all like a hand. It sets you on the canoe’s deck in a neat row, damp and blinking.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-06-complete',
      lines: [
        MU('No. No, no. You can’t be on my boat.', 'shock'),
        M('Your boat?', 'angry'),
        N('He picks Moana up and drops her over the side. The sea puts her straight back on the deck.'),
        N('He does it again. The sea puts her back again, slightly wetter, with an air of patience.'),
        N('He tries it with your Nubbin. The sea puts your Nubbin back on his head.'),
        MU('Fine. Fine! The ocean’s on your side. The ocean was always a bit of a show-off.', 'angry'),
        N('Heihei walks across the deck, off the edge, and into the sea. The sea puts him back too, and he doesn’t notice that either.'),
      ],
    },
    rewards: [],
    sets: { 'a10-06': true },
    notes:
      'MAUI. His three deeds (fishing up islands, slowing the sun, bringing fire) are from Polynesian tradition and are ' +
      'told straight; his boasting is in the delivery, not in mocking the deeds. His tattoos are drawn as records of ' +
      'deeds, with respect; no moving tattoo character. Nothing in his lines echoes the film’s song or its title. ' +
      'Moana’s demand is our own wording. The sea returns people gently; no one is thrown far.',
  },

  // ---------------------------------------------------------------- A10-7
  {
    id: 'a10-07',
    code: 'A10-7',
    title: 'The Kakamora',
    source: 'Moana (2016): the coconut-armoured pirates',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-6') },
    requires: ['A10-6'],
    speakers: [MOANA, MAUI],
    steps: [
      {
        id: 'a10-07-s1',
        goal: 'Watch the strange boat come out of the fog.',
        hint: 'Stand at the stern and look into the fog bank.',
        check: 'watch:a10-kakamora:fog',
        scene: {
          id: 'a10-07-fog',
          lines: [
            N('Maui has agreed to nothing, but he is steering, which Moana is counting as a start.'),
            N('A fog bank lies across the sea ahead. Out of it comes a sound of drums, and then a boat made of driftwood and lashed-together logs.'),
            N('Then another boat, and another, all joined into one great floating raft, crewed by little round people in coconut armour.'),
            N('Each one has a face painted on the front of its coconut. Some faces are fierce; some are just very proud of their paint.'),
            MU('Kakamora. Pirates. Everything they see, they take. Including small things. Including you.', 'shock'),
            N('Your Nubbin looks at the Kakamora, and the Kakamora look at your Nubbin. A long, round silence passes between them.'),
          ],
          choices: [
            {
              id: 'wave',
              label: 'Let your Nubbin wave at them.',
              then: [N('Your Nubbin waves. Forty coconuts wave back, slowly, all at once, which is somehow worse than drums.')],
            },
            {
              id: 'hold',
              label: 'Scoop your Nubbin up and hold it close.',
              then: [N('You pick your Nubbin up. Across the water, several painted faces look hurt, and one of them looks at you.')],
            },
          ],
        },
        done: {
          id: 'a10-07-fog-done',
          lines: [
            M('Why are they looking at it like that?', 'think'),
            MU('They think it’s one of theirs. A little one. That has lost its coconut.', 'think'),
          ],
        },
      },
      {
        id: 'a10-07-s2',
        goal: 'Get Heihei back from the pirates.',
        hint: 'Follow Moana across to the big raft. Your Nubbin will be welcome there.',
        check: 'minigame:a10-kakamora:chase',
        scene: {
          id: 'a10-07-chase',
          lines: [
            N('Darts thunk into the deck as coconut-armoured pirates swarm aboard. One of them grabs Heihei and scampers off with him.'),
            M('Heihei’s swallowed the heart! I saw him! He thought it was a pebble!', 'shock'),
            MU('Then I’d say goodbye to the heart. And the chicken. Lovely chicken.'),
            N('Moana jumps across to the pirate raft. Your Nubbin, after a moment’s thought, jumps after her.'),
            N('The Kakamora part to let it through, and some of them pat it. One of them paints a fierce face on its tummy.'),
            N('Your Nubbin walks straight through their ranks to Heihei, picks him up under one arm, and walks back out again.'),
            N('Nobody stops it. They are too busy cheering what they think is the smallest pirate they have ever seen.'),
          ],
        },
        done: {
          id: 'a10-07-chase-done',
          lines: [
            N('Moana swings back across on a rope with your Nubbin clinging to her back, and Heihei clinging to your Nubbin.'),
            N('Heihei is calmly eating a dart.'),
          ],
        },
      },
      {
        id: 'a10-07-s3',
        goal: 'Get the canoe clear of the pirate raft.',
        hint: 'Take the sheet line and hold the sail tight while Maui steers.',
        check: 'race:a10-canoe:escape',
        scene: {
          id: 'a10-07-escape',
          lines: [
            MU('Hold that line! Tighter! No, the other line!', 'angry'),
            N('You hold a rope that hums like a bowstring. The canoe leans over and leaps away.'),
            N('The raft comes after you, drums going, faster than anything that big should be.'),
            N('Moana scrambles to the bow, finds the gap between two raft-boats, and points.'),
            M('There! Go between them!'),
            N('Maui swings the steering oar and the canoe shoots through the gap. Behind you, the two halves of the raft bump, and come unlashed.'),
          ],
        },
        done: {
          id: 'a10-07-escape-done',
          lines: [
            N('The pirates drift away in the fog, drumming crossly, in two directions at once.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-07-complete',
      lines: [
        N('Heihei coughs up the green stone onto the deck with no fuss at all. Moana washes it, twice.'),
        M('Now. You’ll help me. You owe me. I saved your boat.', 'happy'),
        MU('My boat.', 'angry'),
        MU('Listen. Te Fiti’s heart has a demon of fire guarding it. Te Kā. I can’t get past Te Kā without my hook.'),
        MU('And my hook is at the bottom of the world, in the Realm of Monsters. And you can’t even sail.', 'think'),
        M('Then teach me.'),
        N('Your Nubbin still has a fierce face painted on its tummy. It looks down at it, often, with pride.'),
      ],
    },
    rewards: [],
    sets: { 'a10-07': true },
    notes:
      'The chase is a light minigame: hop the Nubbin from raft-boat to raft-boat, the Kakamora pat it instead of ' +
      'fighting it. Darts are blunt and stick in wood only; nobody is hit. The painted face on the Nubbin’s tummy is ' +
      'cosmetic on this page only (Atlas save), and fades in A10-9’s geyser. The Kakamora never speak; they drum.',
  },

  // ---------------------------------------------------------------- A10-8
  {
    id: 'a10-08',
    code: 'A10-8',
    title: 'Wayfinding',
    source: 'Moana (2016): Maui teaches Moana to read the sea',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-7') },
    requires: ['A10-7'],
    speakers: [MOANA, MAUI],
    steps: [
      {
        id: 'a10-08-s1',
        goal: 'Learn to read the stars with your hand.',
        hint: 'Sit at the stern after dark and hold your hand out to the horizon.',
        check: 'talk:a10-maui:stars',
        scene: {
          id: 'a10-08-stars',
          lines: [
            N('Night falls clear. The sky is so full of stars that it looks crowded.'),
            MU('Right. You want to sail, you start with the stars. Hold your hand out. Flat. Little finger on the line of the sea.'),
            N('Moana holds out her hand, and you hold out yours. Your Nubbin holds out something, roughly hand-shaped.'),
            MU('Stars rise in the same places on the sea’s edge, every night. Learn where each one comes up, and where it goes down.'),
            MU('Then you know which way you’re pointing. Your hand tells you how high it’s climbed, and that tells you how far north you are.'),
            M('That’s it? That’s the secret?', 'think'),
            MU('That’s the first night of it. It takes years. Most of a life.', 'soft'),
          ],
        },
        done: {
          id: 'a10-08-stars-done',
          lines: [
            N('Moana checks her hand against the same star every few minutes, as if it might move without asking.'),
          ],
        },
      },
      {
        id: 'a10-08-s2',
        goal: 'Feel the swell through the hull.',
        hint: 'Lie down on the deck and put one hand flat on the wood.',
        check: 'inspect:a10-swell:hull',
        scene: {
          id: 'a10-08-swell',
          lines: [
            MU('Clouds come and cover the stars. Then what?'),
            M('Then… you’re lost?'),
            MU('Lie down. Put your hand on the hull. Shut your eyes. And for once in your life, be quiet.', 'think'),
            N('You lie on the warm wood. Underneath you, the canoe is lifting and falling, lifting and falling, slow as breathing.'),
            MU('That’s the big swell. It comes from far away, from the same quarter, for days. Keep it at the same angle, you keep your course.'),
            MU('And when it bounces off an island, it crosses itself. You can feel the island before you can see it.'),
            N('Moana lies very still. Her face changes, the way a face does when it hears its own name in a crowd.', 'soft'),
            M('There. Two. Two swells. One from there, one from there.', 'happy'),
          ],
          choices: [
            {
              id: 'feel',
              label: 'Feel for the second swell yourself.',
              then: [
                N('You press your palm flat and wait. It takes a long time, and then there it is: a smaller lift, crossing the big one, like a second heartbeat.'),
              ],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin try.',
              then: [
                N('Your Nubbin lies down with its whole face on the wood. Whatever it feels, it feels it very deeply, and falls asleep.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-08-swell-done',
          lines: [
            MU('Huh. Not bad. Not good. Not bad.', 'think'),
          ],
        },
      },
      {
        id: 'a10-08-s3',
        goal: 'Watch for the bird that is going home.',
        hint: 'At dusk, keep watch from the bow for a single bird.',
        check: 'watch:a10-birds:dusk',
        scene: {
          id: 'a10-08-birds',
          lines: [
            N('At dusk, Maui sits at the bow beside your Nubbin. The two of them watch the sky with the same squint.'),
            MU('In the morning, fishing birds fly out from land. In the evening, they fly home to it. Watch which way they go.'),
            N('A single white bird crosses the red sky, low and steady, in a hurry to be somewhere.'),
            N('Your Nubbin points at it with its whole arm. Then its whole body.', 'happy'),
            MU('Good. That way’s land. And see that cloud? Green on its belly. That’s a lagoon under it, shining up.'),
            M('Stars. Swells. Birds. Clouds.', 'think'),
            MU('The rest is memory. Every turn you’ve made since your own beach, kept in your head in order. Lose that, and the sky can’t help you.', 'soft'),
          ],
        },
        done: {
          id: 'a10-08-birds-done',
          lines: [
            N('Moana takes the steering oar for the first time. Maui lets her, which is the nicest thing he has done so far.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-08-complete',
      lines: [
        N('That night Moana sits up late, weaving with strips of pandanus leaf left over from patching the sail.'),
        N('In the morning there is a tiny woven sail tied to your Nubbin’s back, between its wings. It fits perfectly.'),
        M('Every voyager needs a sail. Even a small one. Especially a small one.', 'happy'),
        N('Your Nubbin turns round and round, trying to see it. Heihei turns round too, in solidarity, or by accident.'),
      ],
    },
    rewards: [
      {
        id: 'a10-woven-sail',
        kind: 'cosmetic',
        label: 'Woven Sail',
        description: 'A tiny sail of woven pandanus leaf, tied between your Nubbin’s wings. It fills out a little when your Nubbin runs.',
      },
    ],
    sets: { 'a10-08': true },
    notes:
      'WAYFINDING. The techniques are real and simplified: star rising and setting points on the horizon (the star ' +
      'compass), a hand held at arm’s length to gauge a star’s height, steady ocean swells and the cross-swell an ' +
      'island makes, land-roosting seabirds (terns and noddies) flying home at dusk, and the green tint under clouds ' +
      'over a lagoon. Advisers to check every line in this quest. Maui’s last line is our own and differs in shape ' +
      'from the film’s wayfinding speech. REWARD: the woven sail is granted on this quest’s completion (one-time) and ' +
      'goes to the Grove wardrobe at once.',
  },

  // ---------------------------------------------------------------- A10-9
  {
    id: 'a10-09',
    code: 'A10-9',
    title: 'Lalotai',
    source: 'Moana (2016): the Realm of Monsters and Tamatoa',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-8') },
    requires: ['A10-8'],
    speakers: [MOANA, MAUI, TAMATOA],
    steps: [
      {
        id: 'a10-09-s1',
        goal: 'Climb the tall rock at the edge of the world.',
        hint: 'Climb the stone pillar after Moana, ledge by ledge.',
        check: 'climb:a10-pillar:lalotai',
        scene: {
          id: 'a10-09-pillar',
          lines: [
            N('A stone pillar stands alone in the sea, so tall the top of it is in cloud.'),
            MU('The way down to Lalotai is at the top. Yes, the way down is up. Don’t look at me like that. I didn’t build it.'),
            N('Maui climbs it the easy way, which is by being enormous. Moana climbs it the hard way, with her fingers and her toes.'),
            N('You climb behind her. Your Nubbin climbs behind you, holding your heel, which you would rather it didn’t.'),
            N('At the top there is a flat place, and a great carved stone, and the wind tugging at everything.'),
            N('Maui puts his hands on the stone and says some old words, low and quiet. The page doesn’t write them down.', 'soft'),
            N('The rock opens like a mouth. Below it there is nothing at all, and a long way down, a glow.'),
          ],
        },
        done: {
          id: 'a10-09-pillar-done',
          lines: [
            MU('Wait here. This is a monster realm. No place for a… Moana? Moana!', 'shock'),
            N('She has already jumped, and so has your Nubbin. You sigh, and jump after them.'),
          ],
        },
      },
      {
        id: 'a10-09-s2',
        goal: 'Find your way through the Realm of Monsters.',
        hint: 'Follow the glowing plants and keep your Nubbin close.',
        check: 'explore:a10-lalotai:depths',
        scene: {
          id: 'a10-09-depths',
          lines: [
            N('You land on something soft that turns out to be a giant flower, which closes up a little, interested.'),
            N('Lalotai is upside down. The sea is the sky here, a far-off ripple overhead, and everything below glows: purple, green, gold.'),
            N('Plants swing round to watch you pass. Something with too many eyes blinks at you from a crack, and decides not to bother.'),
            M('Maui’s hook. He said it would be with something that collects things. Something that likes shiny things.', 'think'),
            N('Your Nubbin’s emote ball floats above its head, glowing softly, as it always does.'),
            N('A lot of eyes in the dark turn towards it at once.', 'shock'),
          ],
        },
        done: {
          id: 'a10-09-depths-done',
          lines: [
            N('A trail of shining things leads down into a cave: shells, bones, a lost earring, a whole fishing canoe painted gold.'),
          ],
        },
      },
      {
        id: 'a10-09-s3',
        goal: 'Get the hook back from the crab who has it.',
        hint: 'Keep Tamatoa talking while Moana works round behind him.',
        check: 'puzzle:a10-tamatoa:lair',
        scene: {
          id: 'a10-09-lair',
          lines: [
            N('At the bottom of the cave is a crab the size of a house. His shell is crusted all over with treasure, and he is admiring it.'),
            N('On the very top of his shell, among the gold, is a huge fish hook carved from bone.'),
            TM('Visitors. How rare. Most things that come down here are lunch, and lunch doesn’t usually knock.'),
            TM('Oh. Oh, what is that? On the little round one. The floating thing. It glows.', 'happy'),
            N('He leans right down to your Nubbin’s emote ball, his eyes on stalks, very close.'),
            TM('I must have it. It would go just here, by my left eye. Everyone would look at it, and then at me.', 'happy'),
            N('Your Nubbin, worried, turns its ball into a question mark. Tamatoa gasps with delight.'),
            TM('It does tricks!', 'shock'),
          ],
          choices: [
            {
              id: 'show',
              label: 'Let your Nubbin show off its ball.',
              then: [N('Your Nubbin makes a heart, a spiral, a plain ball, an exclamation mark. Tamatoa claps his claws, completely lost.')],
            },
            {
              id: 'ask',
              label: 'Ask Tamatoa about his shell.',
              then: [TM('Since you ask. Every piece is a story, and every story is about me. Let me start at the bottom left…', 'happy')],
            },
          ],
        },
        done: {
          id: 'a10-09-lair-done',
          lines: [
            N('Behind him, Moana has climbed up his shell with her hands full of glowing weed, and is quietly lifting off the hook.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-09-complete',
      lines: [
        TM('Wait. That’s mine. Everything here is mine.', 'angry'),
        N('Moana throws the hook to Maui, and Maui catches it. Tamatoa turns, and turns, and topples onto his back with his legs waving.'),
        TM('Somebody turn me over! This is very undignified! I am never undignified!', 'angry'),
        N('A geyser of warm water bursts up from the floor and carries all of you, very fast, back up into the real sky.'),
        N('You land in the sea beside the canoe. Your Nubbin lands in it too, and the paint on its tummy finally washes off.'),
        N('Down below, faintly, you can still hear Tamatoa asking for help, and also for compliments.'),
      ],
    },
    rewards: [],
    sets: { 'a10-09': true },
    notes:
      'LALOTAI. Monsters are strange and glowing, never gory; nothing eats anybody. Tamatoa is vain, not cruel: he ' +
      'covets the emote ball, he never grabs the Nubbin. No song: he talks, and only in prose. Maui’s words at the ' +
      'pillar are not written and not voiced as a chant; play a low murmur under wind. Both choices in a10-09-lair ' +
      'lead to the same done scene. The emote ball tricks use the Nubbin’s real emote set (plain, heart, spiral, ' +
      'exclamation, question).',
  },

  // ---------------------------------------------------------------- A10-10
  {
    id: 'a10-10',
    code: 'A10-10',
    title: 'The Hook',
    source: 'Moana (2016): Maui relearns his shapes, and tells how he came to be',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-9') },
    requires: ['A10-9'],
    speakers: [MOANA, MAUI],
    steps: [
      {
        id: 'a10-10-s1',
        goal: 'Watch Maui try to change shape.',
        hint: 'Keep well back on the deck while Maui practises.',
        check: 'watch:a10-maui:practice',
        scene: {
          id: 'a10-10-practice',
          lines: [
            MU('Right. Now we’re back in business. Hawk.', 'happy'),
            N('There is a flash of light. Where Maui was, there is a fish, flapping on the deck.'),
            MU('Hawk!', 'angry'),
            N('A flash, and a pig. Your Nubbin and Pua would have got on.'),
            MU('A thousand years without it. It’s like a muscle. It’s like… stop laughing. Hawk!', 'angry'),
            N('A flash. Something with a hawk’s wings and a shark’s head flops off the side of the canoe into the sea.'),
            N('Your Nubbin, to be supportive, flaps its own wings. It doesn’t take off either.'),
          ],
        },
        done: {
          id: 'a10-10-practice-done',
          lines: [
            N('Maui climbs back aboard as himself, dripping, and sits down hard at the stern with his back to everyone.'),
          ],
        },
      },
      {
        id: 'a10-10-s2',
        goal: 'Sit with Maui while he tells you about his tattoos.',
        hint: 'Sit down near Maui at the stern. Don’t push.',
        check: 'sit:a10-maui:stern',
        scene: {
          id: 'a10-10-story',
          lines: [
            N('Nobody says anything for a long time. Moana sits near Maui, you sit near Moana, and your Nubbin sits nearest of all.'),
            M('Your tattoos. Are they all things you did?'),
            MU('Every one. I earned every one. The sun. The fire. The islands. The coconut. The wind.', 'soft'),
            M('There’s a space. On your back. With nothing in it.'),
            N('Maui is quiet for so long that you think he won’t answer.'),
            MU('I wasn’t born a demigod. I was born a baby. To people. And they didn’t want me. They let the sea take me.', 'sad'),
            MU('The gods found me. Made me what I am. And I went back to the people and gave them everything. Islands. Fire. Long days.', 'sad'),
            MU('So they’d want me. So they’d love me. That’s what the gifts were for. All of them.', 'sad'),
            N('Moana doesn’t say anything for a moment. Then she says the true thing, plainly.'),
            M('The gifts were kind. But nobody should have to earn being kept. Babies don’t. You didn’t.', 'soft'),
          ],
          choices: [
            {
              id: 'water',
              label: 'Pass him the water gourd.',
              then: [
                N('You hand him the water. He takes it without looking, and holds it, and doesn’t drink, and doesn’t give it back.'),
              ],
            },
            {
              id: 'closer',
              label: 'Say nothing. Sit a little closer.',
              then: [
                N('You shift along the deck, not much. Your Nubbin, who has never understood not much, climbs into Maui’s lap and stays there.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-10-story-done',
          lines: [
            N('Maui doesn’t answer. But he doesn’t turn his back again either.'),
          ],
        },
      },
      {
        id: 'a10-10-s3',
        goal: 'Help Maui find his hawk.',
        hint: 'Hold the canoe steady and steer into the wind while Maui tries again.',
        check: 'minigame:a10-hook:hawk',
        scene: {
          id: 'a10-10-hawk',
          lines: [
            M('Try again. Not because you have to. Because you can.'),
            MU('…Hawk.', 'think'),
            N('A flash, and the flash is softer this time.'),
            N('A great hawk lifts off the stern, beats once, twice, and climbs into the sky in a long, wide spiral.', 'happy'),
            M('Ha! Look at him go!', 'happy'),
            N('You hold the canoe into the wind. Your Nubbin stands on the bow with its arms up, as if it’s doing the flying.'),
          ],
        },
        done: {
          id: 'a10-10-hawk-done',
          lines: [
            N('The hawk dives, pulls up just over the waves, and lands on the mast. It is very obviously grinning.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-10-complete',
      lines: [
        MU('Did you see that? The roll at the end? I did a roll.', 'happy'),
        M('We saw. Everyone saw. The fish saw.', 'happy'),
        N('He teaches her the rest that afternoon, properly: tacking, steering, reading the shapes of waves. He’s a good teacher, when he forgets to show off.'),
        N('That evening, Moana steers alone while Maui sleeps. Your Nubbin keeps watch beside her, until it doesn’t.'),
      ],
    },
    rewards: [],
    sets: { 'a10-10': true },
    notes:
      'MAUI’S STORY, ALL AUDIENCES. The abandonment is told softly: "they let the sea take me", never "threw". Keep ' +
      'his deeds (sun, fire, islands, wind, the first coconut) in tradition’s terms, and the empty space on his back ' +
      'as the film’s idea without the film’s wording. Advisers to check. Shapeshift failures are funny and harmless: ' +
      'fish, pig, a hawk-shark that falls in the sea. The hawk is ours (no film model).',
  },

  // ---------------------------------------------------------------- A10-11
  {
    id: 'a10-11',
    code: 'A10-11',
    title: 'Te Kā',
    source: 'Moana (2016): the first battle at the barrier islands, and Maui leaves',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-10') },
    requires: ['A10-10'],
    speakers: [MOANA, MAUI],
    steps: [
      {
        id: 'a10-11-s1',
        goal: 'Sail up to the barrier islands at night.',
        hint: 'Keep watch from the bow as the canoe closes on the dark islands.',
        check: 'watch:a10-te-ka:barrier',
        scene: {
          id: 'a10-11-barrier',
          lines: [
            N('A ring of black islands lies across the sea, smoking. Behind them, faint and far, is the shape of a great green island, asleep.'),
            MU('Te Fiti’s behind the ring. And between us and her is Te Kā. Keep away from the shore. Let me go first.'),
            M('I can get through. I know the swell now. There’s a gap.'),
            MU('Moana. Let me go first.'),
            N('The ash on the black island moves, and stands up. It is a giant made of rock and fire, taller than the pillar at the edge of the world.'),
            N('Your Nubbin hides under the deck with Heihei, which is the first sensible thing either of them has done all trip.'),
          ],
        },
        done: {
          id: 'a10-11-barrier-done',
          lines: [
            N('Te Kā roars. It isn’t a word: it’s the sound of a mountain having a very bad day.'),
          ],
        },
      },
      {
        id: 'a10-11-s2',
        goal: 'Get the canoe out from under the fire.',
        hint: 'Bail and hold the sail as Moana turns for the gap.',
        check: 'race:a10-canoe:barrier',
        scene: {
          id: 'a10-11-gap',
          lines: [
            N('Moana turns for the gap. Maui flies as the hawk, at Te Kā’s face, to draw it off.'),
            N('Te Kā swats at him with a hand like a hillside. He swerves, and dives, and comes back again.'),
            M('Nearly. Nearly there!'),
            N('Te Kā turns from the hawk to the canoe. Its hand comes down.'),
            N('Maui drops out of the sky in his own shape and blocks it with his hook. There is a crack like lightning.', 'shock'),
            N('The wave throws the canoe backwards, out past the ring, far out into the dark sea. You hold on to anything you can.'),
          ],
          choices: [
            {
              id: 'line',
              label: 'Grab the sail line.',
              then: [N('You get the line and keep it, though it burns your palms. The sail tears, but it stays on the canoe, because of you.')],
            },
            {
              id: 'heihei',
              label: 'Grab Heihei, who has wandered out again.',
              then: [N('You catch Heihei by the tail feathers as he strolls towards the edge. He looks at you as if you are the strange one.')],
            },
          ],
        },
        done: {
          id: 'a10-11-gap-done',
          lines: [
            N('When the sea is quiet again, the canoe is a long way off, with a torn sail. Te Kā’s glow sinks back down into the ash.'),
          ],
        },
      },
      {
        id: 'a10-11-s3',
        goal: 'Stand by while Maui and Moana argue.',
        hint: 'Stay on the deck. This isn’t your argument.',
        check: 'talk:a10-maui:wreck',
        scene: {
          id: 'a10-11-crack',
          lines: [
            N('Maui is holding his hook in both hands. There is a crack running right through it, from the point nearly to the grip.'),
            MU('I told you to turn back. I told you. Look at it.', 'angry'),
            M('We can fix it. We’ll try again. We’ll go round the other way.'),
            MU('One more hit and it’s gone. That hook is the only thing anyone ever wanted from me. Break it, and there’s nothing left to want.', 'angry'),
            M('That’s not true. You know that’s not true.', 'sad'),
            MU('The sea should have asked somebody who listens.', 'angry'),
            N('That lands, and stays. Moana doesn’t answer.', 'sad'),
            MU('I’m sorry. I am. Good luck.', 'sad'),
            N('There is a flash. A hawk lifts off the stern, and flies away to the north, and doesn’t look back.'),
          ],
        },
        done: {
          id: 'a10-11-crack-done',
          lines: [
            N('Moana watches until he is a speck, and then until he isn’t.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-11-complete',
      lines: [
        N('Moana sits at the bow with the green stone in her hand. She doesn’t cry, which is worse.'),
        M('I can’t do this. I’m not enough for it.', 'sad'),
        M('Find somebody who is. Please. Take it back.', 'sad'),
        N('She leans over the side and holds out the stone. The sea rises up, gently, and takes it from her hand, and sinks back down.'),
        N('You don’t say anything; you sit down beside her. Your Nubbin comes out from under the deck and sits beside you.'),
        N('The three of you sit like that, with Heihei, for a long time, while the canoe drifts.'),
      ],
    },
    rewards: [],
    sets: { 'a10-11': true },
    notes:
      'TE KĀ, ALL AUDIENCES. Fire and noise, never a burnt person: the hand that comes down is blocked, the wave ' +
      'throws the canoe clear and nobody is hurt. Hazel’s third rule is acted out in the complete scene and never ' +
      'quoted or named. You don’t answer Maui; this argument belongs to him and Moana.',
  },

  // ---------------------------------------------------------------- A10-12
  {
    id: 'a10-12',
    code: 'A10-12',
    title: 'The Manta Ray',
    source: 'Moana (2016): Gramma Tala’s spirit comes back',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-11') },
    requires: ['A10-11'],
    speakers: [MOANA, TALA],
    steps: [
      {
        id: 'a10-12-s1',
        goal: 'Watch the light that comes up through the water.',
        hint: 'Look over the side of the canoe.',
        check: 'watch:a10-manta:night',
        scene: {
          id: 'a10-12-light',
          lines: [
            N('Late in the night, a soft blue light comes up through the sea under the canoe.'),
            N('It is a manta ray, glowing from inside, circling slowly round the hulls.'),
            N('Moana looks up. Sitting at the stern, as if she has always been there, is Gramma Tala.', 'soft'),
            G('Well. You’re a long way past the reef.'),
            M('Gramma?', 'shock'),
            G('I told you. I said I’d come back as one of those. Nobody listens to their grandmother.', 'happy'),
            N('Moana goes to her and holds on, and Gramma holds on back. She is a bit see-through round the edges, but her arms are real enough.'),
          ],
          choices: [
            {
              id: 'room',
              label: 'Go to the bow and give them room.',
              then: [
                N('You take your Nubbin to the bow and look at the stars for a while. Over Moana’s shoulder, Gramma catches your eye and nods.'),
              ],
            },
            {
              id: 'hello',
              label: 'Bring your Nubbin to say hello.',
              then: [
                N('Your Nubbin pats Gramma’s knee, very gently, as if checking that she is there. She is, just about.'),
                G('Hello, small one. Still a bit crooked? Good. Crooked is how you know it’s yours.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-12-light-done',
          lines: [
            G('I’m not here to tell you what to do. I never did that. I’m here because you’re sad, and I’m nosy.', 'soft'),
          ],
        },
      },
      {
        id: 'a10-12-s2',
        goal: 'Watch the manta, and let your Nubbin answer it.',
        hint: 'Bring your Nubbin to the side and let it see the manta move.',
        check: 'watch:a10-manta:step',
        scene: {
          id: 'a10-12-manta',
          lines: [
            N('The manta turns in the water and rises, and moves along the side of the canoe with its great wings out wide and level.'),
            N('It isn’t swimming. It is gliding: leaning, letting the sea carry it sideways, never once flapping.'),
            N('Your Nubbin stands up very slowly on the deck.'),
            N('Then it spreads its arms, and leans, and slides along the planks on one foot, level and soft, the way Gramma taught it.', 'happy'),
            N('The manta glides, and your Nubbin glides. They go up the side of the canoe together, the big one in the sea and the small one on deck.'),
            G('There. You didn’t forget. I told you it doesn’t come off.', 'soft'),
            N('Moana laughs, wet-faced. It is the first time she has laughed since the barrier.'),
          ],
        },
        done: {
          id: 'a10-12-manta-done',
          lines: [
            G('Things you’re taught with love, you keep. You don’t have to try. They stay put.', 'soft'),
          ],
        },
      },
      {
        id: 'a10-12-s3',
        goal: 'Listen to Gramma’s song.',
        hint: 'Sit with Moana and Gramma under the stars.',
        check: 'sit:a10-tala:stern',
        scene: {
          id: 'a10-12-song',
          lines: [
            G('Tell me about yourself. Not the chief’s daughter bit. The rest.', 'soft'),
            M('I don’t know. I thought I did. I got it all wrong.', 'sad'),
            N('Gramma doesn’t answer. She starts to sing instead, very low, an old voyaging song you have never heard.'),
            N('It has no words you can catch. It has the names of islands in it, and the names of people, one after another, going back and back.'),
            N('Overhead, the stars move. They become sails: the great canoes from the cave, crossing the sky, full of people looking down.'),
            N('Your Nubbin looks up at them with its mouth open. One of the steerers waves.'),
            N('Moana stands. She is crying and she is standing up straight, both at once.'),
            M('Everything I was taught, I’ve still got. Gramma’s stories. Dad’s care for people. Maui’s swells. None of it came off.', 'soft'),
            M('It doesn’t matter who picked me. I’m picking me. I’ll take it back myself.', 'happy'),
          ],
        },
        done: {
          id: 'a10-12-song-done',
          lines: [
            N('She dives over the side, down and down into the dark, and comes up a long minute later with the green stone in her fist.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-12-complete',
      lines: [
        N('When she climbs back aboard, the stern is empty. Out on the water, the manta turns once, and glides off towards Te Fiti.'),
        N('Moana mends the sail by starlight while you hold the edges. Your Nubbin holds Heihei, who is trying to eat the thread.'),
        M('She’s not gone, is she? Not really.'),
        Y('I don’t think anybody you love is ever all the way gone.', 'soft'),
        M('No. I don’t either.', 'soft'),
        N('At dawn she turns the canoe back towards the ring of black islands, and doesn’t hesitate.'),
      ],
    },
    rewards: [],
    sets: { 'a10-12': true },
    notes:
      'STEP PAYOFF (a10-step, from A10-3, nine quests back). a10-12-manta (step 2 scene) is for glide; for wave play ' +
      'A10_VARIANTS a10-12-manta-wave instead. GRAMMA’S SONG is original and is never written out: no lyrics, no verse, ' +
      'no melody from the film. Compose a short, low, unaccompanied tune of our own for it (audio brief to the ' +
      'composer; advisers to hear it). Moana’s two lines of declaration are our own and differ in shape and wording ' +
      'from the film’s; do not "fix" them towards it. The sky canoes are the ancestors from A10-4, same designs.',
  },

  // ---------------------------------------------------------------- A10-13
  {
    id: 'a10-13',
    code: 'A10-13',
    title: 'Te Fiti',
    source: 'Moana (2016): the return to the barrier, and what Te Kā really is',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-12') },
    requires: ['A10-12'],
    speakers: [MOANA, MAUI],
    steps: [
      {
        id: 'a10-13-s1',
        goal: 'Run the barrier again.',
        hint: 'Hold the sail while Moana weaves the canoe through the ring.',
        check: 'race:a10-canoe:ring',
        scene: {
          id: 'a10-13-run',
          lines: [
            N('This time Moana doesn’t go straight. She reads the swell bouncing off the black islands and sails the cross of it, left, right, left.'),
            N('Te Kā rises out of the ash, roaring. Its fire falls where the canoe was a moment ago, and never where it is.'),
            M('Hold it! Hold it, now let go! Now!'),
            N('You let go of the sail line. The canoe spins round a rock as if it were dancing.'),
            N('Then Te Kā’s hand comes down ahead of you, and there is nowhere left to go.'),
            N('And a hawk drops out of the sky, and turns into a man with a cracked hook, and stands in front of the canoe.', 'shock'),
            MU('Told you to let me go first.', 'happy'),
            M('You came back!', 'happy'),
            MU('I’ve got a lot of other tattoos. I could do with one I didn’t do for applause.'),
          ],
        },
        done: {
          id: 'a10-13-run-done',
          lines: [
            MU('Go! I’ll hold her! Go!'),
            N('He meets Te Kā’s fist with the hook, and the crack spreads, and the hook breaks in his hands. He stands there anyway.'),
          ],
        },
      },
      {
        id: 'a10-13-s2',
        goal: 'Look across at the island where Te Fiti should be.',
        hint: 'Climb the mast to see over the black rocks.',
        check: 'inspect:a10-spiral:island',
        scene: {
          id: 'a10-13-spiral',
          lines: [
            N('Moana scrambles up the mast. You go up behind her, to see what she sees.'),
            N('Past the ring of black islands, where the great green island should be sleeping, there is nothing. Only a hollow in the sea.', 'shock'),
            M('She’s gone. Te Fiti isn’t there.'),
            N('Moana looks back at Te Kā. On its chest, among the cracks and the glowing rock, there is a mark: a spiral.'),
            N('It is the same spiral that is on the stone in her hand. The same spiral on the shell in your pocket.'),
            M('Oh.', 'soft'),
            M('She’s not guarding the heart. She is the heart’s home. She’s Te Fiti, without it.', 'soft'),
          ],
        },
        done: {
          id: 'a10-13-spiral-done',
          lines: [
            N('Moana climbs down. She faces the open water between the canoe and Te Kā, and she holds up her hand.'),
            N('The sea parts. A path opens, wet sand and shells, straight from the canoe to the burning giant.', 'shock'),
          ],
        },
      },
      {
        id: 'a10-13-s3',
        goal: 'Walk the path behind Moana, in your own way.',
        hint: 'Follow Moana down the path through the sea. Choose how you go.',
        check: 'walk:a10-te-ka:path',
        scene: {
          id: 'a10-13-walk',
          lines: [
            N('Moana walks down the path through the sea. Te Kā sees her, and turns, and comes roaring down to meet her.'),
            N('She doesn’t run, or raise a hand. She keeps walking.'),
            N('You step down onto the wet sand behind her, with your Nubbin at your side. Your heart is going like Moana’s drum.'),
          ],
          choices: [
            {
              id: 'gift',
              label: 'Carry the spiral shell, held out in your open hand.',
              set: { 'a10-approach': 'gift' },
              then: [
                N('You take out the little spiral shell your Nubbin found on Motunui’s reef, and walk with it held out on your palm.'),
                N('Te Kā’s glowing eyes drop to it: the same spiral. For a moment the roar goes quieter.', 'soft'),
              ],
            },
            {
              id: 'word',
              label: 'Say, out loud, that you remember her.',
              set: { 'a10-approach': 'word' },
              then: [
                Y('We remember you. All the green. The islands. We remember who gave them.', 'soft'),
                N('Your voice is very small against the fire. It carries anyway, the way voices do over water.'),
              ],
            },
            {
              id: 'walk',
              label: 'Just keep walking, slowly, hands open.',
              set: { 'a10-approach': 'walk' },
              then: [
                N('You don’t say anything, and you don’t hold anything. You walk, slowly, with your hands open, the way Moana is walking.'),
                N('Your Nubbin walks beside you, step for step, which is a lot of steps for it.'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-13-walk-done',
          lines: [
            N('Te Kā reaches Moana and stoops, enormous, fire running off it like water. Moana stands still and lifts her face.'),
            M('I see the spiral. I know you. You’ve been waiting a long time for somebody to bring it home.', 'soft'),
            N('She touches her forehead to Te Kā’s, gently. The giant goes very still.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-13-complete',
      lines: [
        N('Moana sets the green stone into the spiral on Te Kā’s chest. It fits like a key.'),
        N('The fire goes out of the rock, and the cracks fill with moss, then ferns, then flowers. The giant’s shape softens into a green woman, lying down.'),
        N('She becomes an island again: green and more green and more, as far as you can see.', 'happy'),
        N('Te Fiti opens her eyes, just once, and looks at Moana, and then at you, and then, for rather a long time, at your Nubbin.'),
        N('She reaches into the earth of herself and takes out Maui’s hook, mended and new, and holds it out to him.', 'soft'),
        MU('I’m sorry. For what I took. I’m sorry.', 'sad'),
        N('Te Fiti smiles. Then she lies back down, and is an island, and the sea round her goes clear and full of fish.', 'soft'),
      ],
    },
    rewards: [],
    sets: { 'a10-13': true },
    notes:
      'SIGNATURE CHOICE (a10-approach, a10-13-walk). The choice’s own lines are the first payoff. It pays off again in ' +
      'A10-14’s complete scene (a10-14-complete for gift; A10_VARIANTS a10-14-complete-word and a10-14-complete-walk) ' +
      'and in the Grove canoe detail: gift → a white spiral shell painted on the prow; word → a row of small spirals cut ' +
      'along the hull; walk → two small painted footprints on the bow deck. The shell is used up by the gift ' +
      '(it stays with Te Fiti). Moana’s words to Te Kā are our own, not the film’s. Te Kā and Te Fiti never speak. ' +
      'Maui’s broken hook: he is not hurt.',
  },

  // ---------------------------------------------------------------- A10-14
  {
    id: 'a10-14',
    code: 'A10-14',
    title: 'Voyagers Again',
    source: 'Moana (2016): Moana comes home, and Motunui sails again',
    audience: 'all',
    trigger: { where: WHERE, when: after('A10-13') },
    requires: ['A10-13'],
    speakers: [MOANA, MAUI, TUI, SINA],
    steps: [
      {
        id: 'a10-14-s1',
        goal: 'Say goodbye to Maui.',
        hint: 'Stand with Moana on the deck while Maui gets ready to fly.',
        check: 'talk:a10-maui:farewell',
        scene: {
          id: 'a10-14-farewell',
          lines: [
            N('The canoe rides easy on a clear sea. Maui sits on the stern for the last time, turning his new hook over in his hands.'),
            MU('You could come with me, you know. Lots of islands. You’d be good at it.'),
            M('I know. I’ve got an island. And a lot of people to teach.', 'happy'),
            MU('Teach them well. The stars, the swells. The birds. Don’t leave out the birds.', 'soft'),
            N('He looks down at his arm. Among the old marks of his deeds, there is a new one: a girl at a steering oar.', 'soft'),
            MU('I didn’t do that one. It just turned up. Best one I’ve got.', 'happy'),
            N('He gives your Nubbin a tap on the head with one finger, very carefully.'),
            MU('Goodbye, coconut. You were the least use of anybody, and I’ll miss you most.', 'happy'),
          ],
          choices: [
            {
              id: 'heart',
              label: 'Let your Nubbin say goodbye its own way.',
              then: [
                N('Your Nubbin turns its emote ball into a heart and holds it up as high as it can reach. Maui looks at it a moment longer than he means to.'),
              ],
            },
            {
              id: 'hawks',
              label: 'Tell him you’ll watch for hawks.',
              then: [
                Y('We’ll watch for hawks. Any hawk. Just in case.', 'soft'),
                MU('Do. If it does a roll at the top, it’s me.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'a10-14-farewell-done',
          lines: [
            N('A flash, and a hawk climbs into the sky in a long spiral, does a roll at the top, and is gone.'),
          ],
        },
      },
      {
        id: 'a10-14-s2',
        goal: 'Bring the canoe home to Motunui.',
        hint: 'Sail in through the gap in the reef.',
        check: 'deliver:a10-canoe:motunui',
        scene: {
          id: 'a10-14-home',
          lines: [
            N('Motunui comes up over the edge of the sea, green and greener. The coconut trees are heavy with fruit.'),
            N('There are fish in the lagoon. You can see them from the canoe, flicking silver over the sand.'),
            N('Moana steers in through the reef herself, through the same breakers that threw her out, without a wobble.'),
            N('Her mother is running down the beach. Her father is running behind, which a chief does not usually do.'),
            T('Moana!'),
            N('He holds her so tightly she squeaks. Then he holds her at arm’s length and looks at her, the way you look at a map.'),
            T('You went past the reef.', 'soft'),
            M('I went past the reef. And I came home. Both.', 'happy'),
            S('Of course she did. I packed her lunch.', 'happy'),
          ],
        },
        done: {
          id: 'a10-14-home-done',
          lines: [
            N('Moana climbs the cairn of chiefs’ stones on the hill, and sets a shell on top, where her stone should go.'),
          ],
        },
      },
      {
        id: 'a10-14-s3',
        goal: 'Sail out with Motunui’s first voyage, and watch from the bow.',
        hint: 'Help carry the canoes out from the cave, then take your place at the bow.',
        check: 'watch:a10-voyage:bow',
        scene: {
          id: 'a10-14-bow',
          lines: [
            N('The whole village goes up the stream and through the waterfall. One by one, the great canoes come out of the cave into the light.'),
            N('You carry the end of a steering oar and your Nubbin carries Heihei. Pua carries nothing, and supervises.'),
            N('The sails go up, all of them. Moana stands at the steering oar of the first canoe, holding her hand out flat to the horizon.'),
            N('Out past the reef, a blue light comes up under the hulls. The manta, gliding beside you, wings out wide.', 'soft'),
            N('Your Nubbin climbs to the very tip of the bow. Then it spreads its arms, and leans, and does Gramma’s glide, out over the water.', 'happy'),
            N('The manta glides with it. The people on the canoes see, and point, and some of them begin to laugh, and some to cry.'),
            T('That’s my mother’s step. She did it on the beach every evening. I thought it was just her.', 'soft'),
            M('It’s never just one person. That’s the whole point of it.', 'soft'),
          ],
        },
        done: {
          id: 'a10-14-bow-done',
          lines: [
            N('The canoes sail on together, towards the next island, which nobody has seen yet.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'a10-14-complete',
      lines: [
        N('Moana finds you at the bow at sunset, and sits beside you a while.'),
        M('You never told me where you came from. Somewhere past the reef, Gramma said.'),
        Y('A garden. With a pond in it. I’m a long way from it.', 'soft'),
        M('Then you know the way home. You always know where you started.', 'soft'),
        N('Out in the sea behind you, where the path through the water was, Te Fiti’s shore is green. Your spiral shell is on it somewhere, with her.'),
        ...A14_HOME,
        N('A small white spiral shell is painted on the canoe’s prow, where the real one would have gone. Your Nubbin checks on it twice, then sits in the boat.', 'happy'),
      ],
    },
    rewards: [
      {
        id: 'a10-voyaging-canoe',
        kind: 'decor',
        label: 'Voyaging Canoe',
        description:
          'A small twin-hulled canoe with a woven sail, moored by the Grove pond. Nubbins sit in it, and sometimes practise Gramma’s step at the bow.',
      },
      {
        id: 'a10-star-compass',
        kind: 'feature',
        label: 'Star Compass',
        description: 'A ring of flat stones on the Grove hill. At night, stand in the middle and it names the stars rising and setting at each stone.',
      },
      {
        id: 'a10-great-voyage-bookmark',
        kind: 'item',
        label: 'Great Voyage Bookmark',
        description: 'A strip of woven leaf with a manta painted on it. It marks the island page, and counts towards the Great Voyage festival.',
      },
    ],
    sets: { 'a10-14': true, 'a10-done': true },
    notes:
      'STEP PAYOFF (a10-step). a10-14-bow (step 3 scene) is for glide; for wave play A10_VARIANTS a10-14-bow-wave. ' +
      'APPROACH PAYOFF (a10-approach). a10-14-complete is for gift; for word play A10_VARIANTS a10-14-complete-word; ' +
      'for walk play a10-14-complete-walk. Maui’s new mark is drawn small and plain, our own design, with respect. ' +
      'The cairn shell is Moana’s own, not the Nubbin’s (that one stayed with Te Fiti in the gift route). ' +
      'SIM: (a) Voyaging Canoe: a decor piece moored at the pond edge; Nubbins may sit in it (a sit spot) and play the ' +
      'idle step animation chosen by a10-step (glide or wave), read from the Atlas save, read-only, through ' +
      'atlasFlag(\'a10-step\'). Its prow detail reads atlasFlag(\'a10-approach\') (painted shell, carved spirals, painted ' +
      'footprints). (b) Star Compass: a hill feature; at night, standing in the ring shows the names of the stars ' +
      'rising and setting at each stone (real star names, adviser-checked; unlimited, no prizes). (c) The woven sail ' +
      'was granted at A10-8. (d) The bookmark is an item in the atlas; the Great Voyage festival (A2, A6, A9, A10, any ' +
      'two) reads atlasDone(\'A10\'). All rewards are one-time.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags (Atlas save only). Each quest's notes say which scene each one replaces.
 *   a10-step (A10-3): a10-12-manta-wave, a10-14-bow-wave.
 *   a10-approach (A10-13): a10-14-complete-word, a10-14-complete-walk.
 *   Defaults: when a flag is unset (it never should be, as both choices are compulsory), the base
 *   scene plays: glide for a10-step, gift for a10-approach.
 */
export const A10_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A10-12, step 2 (wave)
  {
    id: 'a10-12-manta-wave',
    lines: [
      N('The manta turns in the water and rises, and rolls along the side of the canoe, up with each swell and down with it.'),
      N('It isn’t swimming. It is riding the sea: rising when the water rises, sinking when it falls, its wing-tips rolling over.'),
      N('Your Nubbin stands up very slowly on the deck.'),
      N('Then it goes up on its toes, and down and back, rolling its little arms, the way Gramma taught it, right on the beat of the sea.', 'happy'),
      N('The manta rises, and your Nubbin rises. They go up the side of the canoe together, the big one in the sea and the small one on deck.'),
      G('There. You didn’t forget. I told you it doesn’t come off.', 'soft'),
      N('Moana laughs, wet-faced. It is the first time she has laughed since the barrier.'),
    ],
  },
  // ---------------------------------------------------------------- A10-14, step 3 (wave)
  {
    id: 'a10-14-bow-wave',
    lines: [
      N('The whole village goes up the stream and through the waterfall. One by one, the great canoes come out of the cave into the light.'),
      N('You carry the end of a steering oar and your Nubbin carries Heihei. Pua carries nothing, and supervises.'),
      N('The sails go up, all of them. Moana stands at the steering oar of the first canoe, holding her hand out flat to the horizon.'),
      N('Out past the reef, a blue light comes up under the hulls. The manta, rising and sinking with the swell beside you.', 'soft'),
      N('Your Nubbin climbs to the very tip of the bow. Then it rises on its toes, and sinks, and rolls its arms: Gramma’s wave step, on the beat.', 'happy'),
      N('The manta rolls with it. The people on the canoes see, and point, and some of them begin to laugh, and some to cry.'),
      T('That’s my mother’s step. She did it on the beach every evening. I thought it was just her.', 'soft'),
      M('It’s never just one person. That’s the whole point of it.', 'soft'),
    ],
  },
  // ---------------------------------------------------------------- A10-14, complete (word)
  {
    id: 'a10-14-complete-word',
    lines: [
      N('Moana finds you at the bow at sunset, and sits beside you a while.'),
      M('You never told me where you came from. Somewhere past the reef, Gramma said.'),
      Y('A garden. With a pond in it. I’m a long way from it.', 'soft'),
      M('Then you know the way home. You always know where you started.', 'soft'),
      M('What you said to her, on the path. That you remembered. I think she heard that. I think it helped.', 'soft'),
      ...A14_HOME,
      N('Along the canoe’s hull runs a line of small carved spirals, one for each thing remembered. Your Nubbin counts them, and loses count.', 'happy'),
    ],
  },
  // ---------------------------------------------------------------- A10-14, complete (walk)
  {
    id: 'a10-14-complete-walk',
    lines: [
      N('Moana finds you at the bow at sunset, and sits beside you a while.'),
      M('You never told me where you came from. Somewhere past the reef, Gramma said.'),
      Y('A garden. With a pond in it. I’m a long way from it.', 'soft'),
      M('Then you know the way home. You always know where you started.', 'soft'),
      M('On the path, you didn’t say anything. You just came. That was the bravest thing on the whole sea, after me.', 'happy'),
      ...A14_HOME,
      N('On the canoe’s bow deck, two pairs of small footprints are painted: yours, and a rounder pair beside them. Your Nubbin stands in its pair.', 'happy'),
    ],
  },
];

// =================================================================== flags and checks

export const ATLAS_A10_FLAGS: string[] = [
  'a10-01',
  'a10-02',
  'a10-03',
  'a10-04',
  'a10-05',
  'a10-06',
  'a10-07',
  'a10-08',
  'a10-09',
  'a10-10',
  'a10-11',
  'a10-12',
  'a10-13',
  'a10-14',
  'a10-done',
  'a10-step', // glide | wave (a10-03-step): A10-12, A10-14 and the Grove canoe's idle step
  'a10-approach', // gift | word | walk (a10-13-walk): A10-13, A10-14 and the Grove canoe's prow detail
];

export const ATLAS_A10_CHECKS: string[] = [
  'explore:a10-motunui:beach',
  'sit:a10-tala:story-house',
  'watch:a10-turtle:shore',
  'inspect:a10-coconuts:grove',
  'talk:a10-fisher:lagoon',
  'swim:a10-reef:breakers',
  'visit:a10-tala:point',
  'choose:a10-step:point',
  'sit:a10-tala:point',
  'walk:a10-cave:waterfall',
  'inspect:a10-cave:canoes',
  'watch:a10-ancestors:drum',
  'talk:a10-tui:council',
  'sit:a10-tala:bedside',
  'carry:a10-provisions:cave-mouth',
  'explore:a10-ocean:storm',
  'talk:a10-maui:rock',
  'climb:a10-cave:statue',
  'watch:a10-kakamora:fog',
  'minigame:a10-kakamora:chase',
  'race:a10-canoe:escape',
  'talk:a10-maui:stars',
  'inspect:a10-swell:hull',
  'watch:a10-birds:dusk',
  'climb:a10-pillar:lalotai',
  'explore:a10-lalotai:depths',
  'puzzle:a10-tamatoa:lair',
  'watch:a10-maui:practice',
  'sit:a10-maui:stern',
  'minigame:a10-hook:hawk',
  'watch:a10-te-ka:barrier',
  'race:a10-canoe:barrier',
  'talk:a10-maui:wreck',
  'watch:a10-manta:night',
  'watch:a10-manta:step',
  'sit:a10-tala:stern',
  'race:a10-canoe:ring',
  'inspect:a10-spiral:island',
  'walk:a10-te-ka:path',
  'talk:a10-maui:farewell',
  'deliver:a10-canoe:motunui',
  'watch:a10-voyage:bow',
];
