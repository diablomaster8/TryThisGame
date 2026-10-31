/**
 * R0367 (FUN-78): comic micro-scenes for the five Keepers with the least comic airtime in the
 * everyday chapters: Clover, Luna, Ember, Pixel and Dusty. Three each, fifteen in all: one
 * early, one in book 2 and one in chapter 12 (warm callbacks). Each plays once, on a quiet
 * stretch of the goal phase, after a full breather (sim/campaign-micro.ts). None plays in
 * chapters 9 to 11, none sets a flag, and none reaches the Learning Grove (main game only).
 * Pixel is she/her, Dusty they/them. Nubbins do not speak.
 */
import type { Scene, Line, LineGesture, Mood } from '../config/story';

const S = (id: string, lines: Line[]): Scene => ({ id, lines });

const say =
  (who: string) =>
  (text: string, mood?: Mood, gesture?: LineGesture): Line => ({
    who,
    text,
    ...(mood ? { mood } : {}),
    ...(gesture ? { gesture } : {}),
  });
const gag = (l: Line): Line => ({ ...l, gag: true });

const N = say('narrator');
const CLOVER = say('clover');
const LUNA = say('luna');
const EMBER = say('ember');
const PIXEL = say('pixel');
const DUSTY = say('dusty');

/** When each micro-scene may play: the Keeper's id and an inclusive chapter window. */
export interface MicroSlot {
  id: string;
  keeper: string;
  from: number;
  to: number;
}

/**
 * The windows, earliest first. Clover and Luna arrive in chapter 3, Pixel in 4, Ember and
 * Dusty in 5. Chapter 13 is the free play after the ending, so a late scene can still land.
 * Dusty's first stays in chapter 5, away from Fossil's farewell in chapter 6.
 */
export const MICRO_SLOTS: readonly MicroSlot[] = [
  { id: 't-micro-clover-1', keeper: 'clover', from: 3, to: 4 },
  { id: 't-micro-luna-1', keeper: 'luna', from: 3, to: 4 },
  { id: 't-micro-pixel-1', keeper: 'pixel', from: 4, to: 4 },
  { id: 't-micro-dusty-1', keeper: 'dusty', from: 5, to: 5 },
  { id: 't-micro-ember-1', keeper: 'ember', from: 5, to: 6 },
  { id: 't-micro-clover-2', keeper: 'clover', from: 5, to: 8 },
  { id: 't-micro-luna-2', keeper: 'luna', from: 5, to: 8 },
  { id: 't-micro-pixel-2', keeper: 'pixel', from: 5, to: 8 },
  { id: 't-micro-ember-2', keeper: 'ember', from: 7, to: 8 },
  { id: 't-micro-dusty-2', keeper: 'dusty', from: 7, to: 8 },
  { id: 't-micro-clover-3', keeper: 'clover', from: 12, to: 13 },
  { id: 't-micro-luna-3', keeper: 'luna', from: 12, to: 13 },
  { id: 't-micro-pixel-3', keeper: 'pixel', from: 12, to: 13 },
  { id: 't-micro-ember-3', keeper: 'ember', from: 12, to: 13 },
  { id: 't-micro-dusty-3', keeper: 'dusty', from: 12, to: 13 },
];

export const MICRO_SCENES: Scene[] = [
  // ---- early (chapters 3 to 5)
  S('t-micro-clover-1', [
    N('Clover is kneeling by your Nubbin with a length of red string.'),
    CLOVER('Hold still, dear. I’m measuring you for a scarf.'),
    N('Your Nubbin holds very still. It is looking at the string.'),
    CLOVER('Round the neck… and a bit extra for growing.', 'think'),
    gag(N('The string goes into your Nubbin at one end. It does not come out.')),
    CLOVER('Oh. Well.', 'shock'),
    gag(CLOVER('The scarf will now be approximately this big.')),
    gag(N('She holds her hands apart, then a little wider, to be kind.')),
  ]),
  S('t-micro-luna-1', [
    N('Luna is standing in the long grass at midday, eyes shut, holding a watering can.'),
    LUNA('I’m not asleep. I’m listening to the moonflowers.'),
    N('It is noon. Moonflowers are not out at noon.'),
    gag(LUNA('They’re asleep. I’m listening to them be asleep.', 'happy')),
    gag(N('The watering can has been pouring onto her boot the whole time.')),
    gag(LUNA('That’s on purpose. Boots get thirsty.')),
    gag(N('Your Nubbin climbs into the can. Luna waters it too, gently, without opening her eyes.')),
  ]),
  S('t-micro-pixel-1', [
    N('Pixel has screwed a small brass clock to the fence post by the pond.'),
    PIXEL('It tells your Nubbin when it’s lunchtime.'),
    N('The clock ticks. Your Nubbin watches it with deep suspicion.'),
    gag(N('At noon a tiny door opens, and a wooden plum on a spring pops out.')),
    gag(N('Your Nubbin eats the wooden plum.')),
    PIXEL('Hm.', 'think'),
    gag(PIXEL('Version two: a less edible plum.')),
    gag(N('She writes on her wrist in pencil. It says: plum.')),
  ]),
  S('t-micro-dusty-1', [
    N('Dusty is on their knees in your crop plot with a trowel and a soft brush.'),
    DUSTY('Don’t worry. I’m not digging up your beans. I’m digging under them.'),
    N('After an hour they lift something out and hold it up to the light.'),
    DUSTY('Look at that. Look at the age on that.', 'happy'),
    gag(N('It is a spoon.')),
    gag(DUSTY('Old spoon.', 'think')),
    gag(N('Your Nubbin takes the spoon, licks it, and buries it again.')),
    DUSTY('Good instinct. That’s how the old ones kept things.', undefined, 'nod'),
  ]),
  S('t-micro-ember-1', [
    N('Ember is by the dojo door, showing your Nubbin a fighting stance.'),
    EMBER('Feet apart. Weight low. Eyes on me.'),
    gag(N('Your Nubbin puts its feet apart, its weight low, and its eyes on a butterfly.')),
    EMBER('On me.', 'angry'),
    gag(N('The butterfly lands on Ember’s nose. Your Nubbin holds the stance perfectly.')),
    gag(EMBER('…Fine. That’s focus. I’ll allow it.', 'think')),
    N('She doesn’t brush the butterfly off for quite a long time.', 'soft'),
  ]),
  // ---- book 2 (chapters 5 to 8)
  S('t-micro-clover-2', [
    N('Clover has knitted a tea cosy with a bobble on top, the colour of a ripe plum.'),
    CLOVER('For your teapot, dear. You do have a teapot?'),
    gag(N('Before you can find the teapot, your Nubbin has climbed into the cosy.')),
    gag(N('Only its feet and the bobble show. It walks into the fence, very warmly.')),
    CLOVER('Oh, it suits it.', 'happy'),
    CLOVER('I’ll do the teapot another one. Teapots are patient.'),
    gag(N('By evening your Nubbin will not be parted from it. The teapot stays cold.')),
  ]),
  S('t-micro-luna-2', [
    N('Luna is lying flat on your lawn in the middle of the afternoon.'),
    LUNA('Practising. The stars come out at nine. I like to be in position.'),
    gag(N('Your Nubbin lies down beside her, exactly the same way, arms out.')),
    gag(N('Within a minute it is snoring. Within two, so is Luna.')),
    gag(N('A hen walks over both of them. Neither stirs.')),
    N('At nine the stars come out. Luna wakes at dawn and smiles at the sky.'),
    gag(LUNA('Best stars all year.', 'happy')),
  ]),
  S('t-micro-pixel-2', [
    N('Pixel is timing your Nubbin’s nap with three stopwatches.'),
    gag(PIXEL('Byte uses one stopwatch. That’s why Byte is wrong.')),
    gag(N('Your Nubbin rolls over. All three stopwatches click.')),
    PIXEL('Forty-one minutes. Forty-one minutes. Forty-three minutes.', 'think'),
    N('She looks at the third stopwatch for a long time.'),
    gag(PIXEL('That one’s Byte’s.')),
    gag(N('She puts it in a separate pocket, to talk to later.')),
  ]),
  S('t-micro-ember-2', [
    N('Ember is sitting on the wall with her arms folded, being unfriendly at the view.'),
    N('Your Nubbin climbs up beside her and leans on her arm.'),
    EMBER('No.', 'angry'),
    gag(N('Your Nubbin falls asleep on her arm.')),
    gag(N('She says no again, very quietly, so as not to wake it.')),
    gag(N('An hour later she is still there, glaring at anyone who comes near.')),
    gag(EMBER('It’s resting. Don’t make a thing of it.', 'angry')),
  ]),
  S('t-micro-dusty-2', [
    N('Dusty sets a small paper label beside your Nubbin, the kind they use for bones in the cliff.'),
    gag(DUSTY('Specimen. Round. Recent. Damp at one end.')),
    gag(N('Your Nubbin reads the label upside down, then eats it.')),
    gag(DUSTY('Specimen consumes own records.', 'think')),
    N('They write a second label and hold it a little higher.'),
    gag(N('Your Nubbin jumps.')),
    gag(DUSTY('Noted. In my head, where it’s safe.')),
  ]),
  // ---- chapter 12 (warm callbacks)
  S('t-micro-clover-3', [
    N('Clover arrives with a soft parcel tied up in red string. Your Nubbin eyes the string.'),
    CLOVER('The scarf. I said I’d do it, and I have.', 'happy'),
    gag(N('It goes round your Nubbin four times, then round you twice.')),
    gag(CLOVER('I measured from memory. My memory is generous.')),
    gag(N('Wrapped to the eyes, your Nubbin waddles off to show the hens.')),
    gag(N('The scarf goes on following it for some time after it has gone.')),
    CLOVER('It’ll grow into it. Things do, here.', 'soft'),
  ]),
  S('t-micro-luna-3', [
    N('Luna is planting moonflower seeds along your fence, one every step, humming.'),
    gag(N('Your Nubbin follows one step behind, digging each seed up to have a look.')),
    LUNA('You’re helping.', 'happy'),
    gag(N('It puts every seed back. Upside down.')),
    gag(LUNA('Then they’ll come up a little later, and a little surprised.')),
    gag(N('A week on, the fence is lined with moonflowers, each leaning as if it had to turn round.')),
    LUNA('Best ones I’ve grown. Don’t tell them.', 'soft'),
  ]),
  S('t-micro-pixel-3', [
    N('Pixel gives your Nubbin a lantern the size of a thimble, on a stick.'),
    PIXEL('It lights at dusk. Exactly at dusk. I’ve timed it against the sun.'),
    gag(N('Your Nubbin carries it about all afternoon, held very high, like someone important.')),
    gag(N('At dusk the lantern lights. Your Nubbin is so surprised it sits down.')),
    gag(PIXEL('All my clocks, and that’s the best review I’ve ever had.', 'happy')),
    gag(N('She writes it on her wrist. It says: sat down.')),
    gag(PIXEL('Byte’s getting one too. His will be late.')),
  ]),
  S('t-micro-ember-3', [
    N('Ember is on the sparring mat, facing your Nubbin. They both bow.'),
    EMBER('One round. Don’t go easy on me.'),
    gag(N('Your Nubbin runs at her, trips on its own foot, and rolls into her ankle.')),
    gag(N('Ember falls over with great care, like a tree that has thought about it.')),
    gag(EMBER('Oof. Beaten.', 'shock')),
    gag(N('Your Nubbin stands on her chest with both arms up.')),
    gag(EMBER('Tell anyone and I’ll deny it.', 'happy')),
    N('She is smiling, though. You’ve seen it now, and that counts.', 'soft'),
  ]),
  S('t-micro-dusty-3', [
    N('Dusty is digging a small, neat hole by the gate.'),
    DUSTY('A time capsule. For whoever digs here next. I want them to find something good.'),
    gag(N('Into the hole go a pressed flower, a blue ribbon, and one old spoon.')),
    gag(N('Your Nubbin climbs in after the spoon.')),
    DUSTY('No. Not you. You stay up here and get found every day.', 'soft'),
    N('They lift it out and brush it down with the soft brush, very carefully.'),
    gag(DUSTY('Specimen. Round. Recent. Very much kept.', 'happy')),
  ]),
];

export const MICRO_FLAGS: string[] = [];

export const MICRO_NOTES: Record<string, string> = Object.fromEntries(
  MICRO_SLOTS.map((s) => [
    s.id,
    `R0367 (FUN-78) ambient micro-scene for ${s.keeper}, chapters ${s.from}–${s.to}. Queued by sim/campaign-micro.ts on a quiet stretch after a full breather, once, never in chapters 9–11, never in the Learning Grove. Sets no flags.`,
  ]),
);
