/**
 * Readers: the paid reading services and the Neopia talkers.
 *
 * - fortune-teller: Madame Zinnia, the Grove kindergarten's fortune teller (replaces FORTUNE_LINES).
 * - doctor: Dr Fettle, who reads the DoctorReport numbers aloud in plain words.
 * - aunt-wen: Aunt Wen's cloud-and-bone reading, unlocked by Q58 at the fortune tent.
 * - island-mystic, wise-old-king, grumpy-old-king: Neopia section talkers (`any` only).
 *
 * Condition terms used in `when` (joined by `&`; the reader picks the most specific match):
 *   band:sun|moon|neutral        adult form band, or the child hint band
 *   type:swim|fly|run|power|normal  adult form type, or the winning lean
 *   stage:egg|child|cocoon|adult
 *   personality:cheerful|shy|mischievous|lazy
 *   rebirth:likely|unlikely      Fortune.rebirthLikely
 *   eternal:sun|moon|neutral
 *   shadow:true, bond:true, stray:true, shiny:true
 *   family:pocket|digi|neo       species family ('neo' is the planned Neopia family)
 *   rebirths:N, generation:N     with optional comparison (<, <=, >, >=)
 *   trust, alignment, happiness, affection, hunger, energy, lifetimeHappiness:
 *                                DoctorReport values with comparisons (hunger/energy 0..100)
 *   lean:<type>                  the type whose lean is highest (DoctorReport.lean)
 *   any                          always matches
 */
import type { Reader, Speaker } from './types';

/** Speaker ids used in the readers' intro and outro lines. */
export const READER_SPEAKERS: Speaker[] = [
  { id: 'zinnia', name: 'Madame Zinnia', kind: 'other' },
  { id: 'dr-fettle', name: 'Dr Fettle', kind: 'other' },
  {
    id: 'aunt-wen',
    name: 'Aunt Wen',
    kind: 'other',
    basedOn: 'Aunt Wu (Avatar: The Last Airbender, "The Fortuneteller")',
  },
  { id: 'island-mystic', name: 'The Island Mystic', kind: 'other', basedOn: 'Island Mystic (Neopets)' },
  { id: 'wise-old-king', name: 'The Wise Old King', kind: 'other', basedOn: 'King Hagan (Neopets)' },
  { id: 'grumpy-old-king', name: 'The Grumpy Old King', kind: 'other', basedOn: 'King Skarl (Neopets)' },
];

/** Readers have no quest checks. */
export const CHECKS: string[] = [];

export const READERS: Reader[] = [
  // ---------------------------------------------------------------------------
  // 1. Madame Zinnia, the kindergarten fortune teller
  // ---------------------------------------------------------------------------
  {
    id: 'fortune-teller',
    name: 'Madame Zinnia',
    where: 'Grove kindergarten: the striped fortune tent behind the classroom',
    intro: [
      { who: 'narrator', text: 'Bead curtains clatter. The tent smells of cinnamon and slightly burnt candle.' },
      { who: 'zinnia', text: 'A Keeper! And a little one! Come in, come in. Mind the crystal ball, it sulks.', mood: 'happy' },
      { who: 'zinnia', text: 'Pop the darling on the velvet. Not that velvet, petal. That velvet is my lunch.' },
      { who: 'zinnia', text: 'Now hush. The mists are gathering... the mists are... yes. Yes! I see something!', mood: 'think' },
    ],
    readings: [
      // Adult forms: band x type
      { id: 'ft-sun-swim', when: 'band:sun&type:swim', text: "A bright little halo that loves the water. It will dive for anything that sparkles and bring it all to you. The pond is your treasure chest now." },
      { id: 'ft-sun-fly', when: 'band:sun&type:fly', text: "A small sun with a sky inside it! It will glide over the Grove like a blessing with ears. Keep the high branches clear, darling." },
      { id: 'ft-sun-run', when: 'band:sun&type:run', text: "Light feet and a lighter heart. It runs not to get away but to get somewhere, and somewhere is always you. Usually you holding fruit." },
      { id: 'ft-sun-power', when: 'band:sun&type:power', text: "Oh, the strong ones with halos are my favourites. It will lift heavy things for small friends and never once mention it." },
      { id: 'ft-sun-normal', when: 'band:sun&type:normal', text: "The cards say: kind, and nothing else needed. A round, ordinary little angel. Ordinary is a gift, petal. Ask anyone who isn't." },
      { id: 'ft-moon-swim', when: 'band:moon&type:swim', text: "Deep water and a deep mind. It will sit at the bottom of the pond thinking thoughts nobody has thought before. Bring a towel and patience." },
      { id: 'ft-moon-fly', when: 'band:moon&type:fly', text: "Night wings and very bright eyes. It will swoop at dusk, startle the lanterns, and come home enormously pleased with itself." },
      { id: 'ft-moon-run', when: 'band:moon&type:run', text: "Quick as a rumour! There and gone before my cards finish falling. Keep an eye on your snacks, darling." },
      { id: 'ft-moon-power', when: 'band:moon&type:power', text: "Horns, muscles, and a soft spot it hides behind both. It will guard the Grove at night like a grumpy little castle." },
      { id: 'ft-moon-normal', when: 'band:moon&type:normal', text: "A small moon with nothing to prove. It keeps its own counsel, and it will keep your secrets. Rarer than pearls, those." },
      { id: 'ft-neutral-swim', when: 'band:neutral&type:swim', text: "Neither sun nor moon, all puddle! It will float, and paddle, and float again. A life of very serious floating." },
      { id: 'ft-neutral-fly', when: 'band:neutral&type:fly', text: "A drifter on the warm air. It goes where the wind is friendliest and always finds its way back to the tallest tree." },
      { id: 'ft-neutral-run', when: 'band:neutral&type:run', text: "Balanced and swift. It will lap the garden a hundred times a day, just to check it is all still there. It is, darling. Tell it so." },
      { id: 'ft-neutral-power', when: 'band:neutral&type:power', text: "Sturdy in the middle and sturdy at the edges. It will push boulders for the joy of it and nap on top of them after." },
      { id: 'ft-neutral-normal', when: 'band:neutral&type:normal', text: "Ah, the plain little dear. Not sun, not moon, nothing but itself. The cards approve. So do I." },

      // Child hints: band
      { id: 'ft-child-sun', when: 'stage:child&band:sun', text: "The light leans towards this one, petal. Keep being kind and it may grow a halo to match." },
      { id: 'ft-child-moon', when: 'stage:child&band:moon', text: "Shadows like this one. Not the scary sort, darling. The cosy, curled-up sort. It may grow towards the moon." },
      { id: 'ft-child-neutral', when: 'stage:child&band:neutral', text: "The scales sit perfectly level. Sun or moon, it hasn't chosen yet. Neither have you, I suspect." },
      // Child hints: type
      { id: 'ft-child-swim', when: 'stage:child&type:swim', text: "I see ripples. It keeps glancing at the water when it thinks you aren't looking. A swimmer is stirring in there." },
      { id: 'ft-child-fly', when: 'stage:child&type:fly', text: "Little arms flapping in secret! The sky is calling, and it is very much picking up." },
      { id: 'ft-child-run', when: 'stage:child&type:run', text: "Restless toes. It dreams of running; I can see the dust in its dreams. Give it room." },
      { id: 'ft-child-power', when: 'stage:child&type:power', text: "It pushes things just to see if they move. They usually do. A strong one is on the way." },
      { id: 'ft-child-normal', when: 'stage:child&type:normal', text: "The cards are shy today. No single gift leads. That means it can still become anything at all." },

      // Personality
      { id: 'ft-cheerful', when: 'personality:cheerful', text: "A sunny temper! It greets each morning like an old friend, and it greets you twice." },
      { id: 'ft-shy', when: 'personality:shy', text: "A quiet heart. It speaks with its ears, darling. Learn their language and you'll never need words." },
      { id: 'ft-mischievous', when: 'personality:mischievous', text: "Oh, a rascal. I see a stolen hat, three hidden fruits, and absolutely no regret whatsoever." },
      { id: 'ft-lazy', when: 'personality:lazy', text: "A born napper. It saves its energy for the important things, such as the next nap." },

      // Rebirth
      { id: 'ft-rebirth-likely', when: 'rebirth:likely', text: "I see a cocoon, and then a small new egg, still warm. It will come back to you, petal, with all its old love tucked inside." },
      {
        id: 'ft-rebirth-unlikely',
        when: 'rebirth:unlikely',
        text: "The cards are worried, darling. If its days stay grey and lonely, when its time comes it may fly off and not come back. More cuddles. Soon.",
        childText: "The cards want more cuddles and more fun for this one. Lots of happy days help it come back as a brand-new baby.",
      },

      // Eternals
      { id: 'ft-eternal-sun', when: 'eternal:sun', text: "Ancient and golden! It has been born and born again until the light simply decided to keep it." },
      { id: 'ft-eternal-moon', when: 'eternal:moon', text: "An old moon soul, round and patient. It has seen a great many nights, and it will see many more with you." },
      { id: 'ft-eternal-neutral', when: 'eternal:neutral', text: "Older than the hedges and perfectly balanced. The whole Grove leans on it a little. It has never once complained." },

      // Trust, Shadow, strays
      {
        id: 'ft-low-trust',
        when: 'trust:<15',
        text: "Careful, petal. The thread between you is thin as spider silk. Gentle hands from now on, or it will fray for good.",
        childText: "It is feeling a little scared right now. Be gentle and kind, and it will start to feel safe again.",
      },
      {
        id: 'ft-shadow',
        when: 'shadow:true',
        text: "The cards come out cold. This one was hurt, and it remembers. It will not trust quickly, but it can trust again if every day is gentle.",
        childText: "This one is very shy and a bit sad. Soft pats and lots of patience will help it feel safe with you.",
      },
      { id: 'ft-shadow-bond', when: 'shadow:true&bond:true', text: "Dark coat, warm heart. It learned to love again. That is the strongest magic I know, and I didn't even need the cards." },
      { id: 'ft-stray', when: 'stray:true', text: "A wanderer has come home and isn't sure it's welcome. Open the gate, darling. Say its name. That's all it's waiting for." },

      // Families
      { id: 'ft-family-pocket', when: 'family:pocket', text: "A pocket-sized soul from a faraway land! It has its own big plans for growing up, and will change when it's ready and not one moment before." },
      { id: 'ft-family-digi', when: 'family:digi', text: "Ooh, this one hums. A little digital heart, beeping to its own beat. Feed it on time and it will grow in ways that surprise even me." },
      { id: 'ft-family-neo', when: 'family:neo', text: "A visitor from Neopia! It has a feeling for shops, faeries and things in jars. Keep a few Shells handy; it has expensive taste." },

      // Rebirth count
      { id: 'ft-rebirths-first', when: 'rebirths:1', text: "Second time round! It remembers you somewhere under all that fluff. Watch how quickly it settles." },
      { id: 'ft-rebirths-many', when: 'rebirths:>2', text: "So many lives! It has worn out more cocoons than I have worn hats, and I have worn a scandalous number of hats." },

      // A few extras
      { id: 'ft-shiny', when: 'shiny:true', text: "Sparkles! The cards nearly blinded me. A shiny soul draws luck, and the occasional nosy neighbour." },
      { id: 'ft-egg', when: 'stage:egg', text: "An egg? Darling, I read faces, not shells. Very well: it is round, it is waiting, and it is going to be loved. There." },
      { id: 'ft-bred', when: 'generation:>1', text: "I see two parents shining in this one. It carries the best of both, and the stubborn bits too." },

      // General fortunes
      { id: 'ft-any-01', when: 'any', text: "A small kindness today will come back tomorrow, wearing a bow." },
      { id: 'ft-any-02', when: 'any', text: "Someone will offer you the last biscuit. It's a test, darling. Break it in half and pass the test." },
      { id: 'ft-any-03', when: 'any', text: "I see a puddle. A big one. The cards say: jump in it." },
      { id: 'ft-any-04', when: 'any', text: "A song is coming your way. You won't know the words. Hum." },
      { id: 'ft-any-05', when: 'any', text: "Under a leaf, a surprise. Probably a beetle. A very nice beetle." },
      { id: 'ft-any-06', when: 'any', text: "The stars say: more naps. The stars are terribly wise." },
      { id: 'ft-any-07', when: 'any', text: "You will find something you lost last week, in the very last place you look. Naturally." },
      { id: 'ft-any-08', when: 'any', text: "A visitor is coming. Possibly a butterfly. Possibly an aunt. The mists are unclear." },
      { id: 'ft-any-09', when: 'any', text: "Your little one is braver than it looks. So are you, petal." },
      { id: 'ft-any-10', when: 'any', text: "The cards show a hat. A truly excellent hat. Keep your eyes open." },
      { id: 'ft-any-11', when: 'any', text: "You will be right about something small and wrong about something smaller. Enjoy the first. Apologise for the second." },
      { id: 'ft-any-12', when: 'any', text: "You will laugh so hard you snort. The cards can see it coming. They're giggling already." },
      { id: 'ft-any-13', when: 'any', text: "A plum will roll under the fence at the exact moment you need cheering up. The cards arranged it. You're welcome." },
      { id: 'ft-any-14', when: 'any', text: "A friend will need a hand soon. You have two. Lend one." },
      { id: 'ft-any-15', when: 'any', text: "The pond knows something about you, and it's keeping quiet. Ponds are discreet. That's why I tell them everything." },
      { id: 'ft-any-16', when: 'any', text: "There's a shortcut through the garden. It's longer. Take it anyway." },
      { id: 'ft-any-17', when: 'any', text: "I see you being thanked for something you've completely forgotten doing." },
      { id: 'ft-any-18', when: 'any', text: "Your lucky colour is whatever you're wearing. You chose beautifully." },
      { id: 'ft-any-19', when: 'any', text: "A shell, a feather and a pebble. Keep the pebble. Don't ask me why." },
      { id: 'ft-any-20', when: 'any', text: "Someone small is going to copy the way you say goodnight. Say it nicely, petal. It's catching." },
      { id: 'ft-any-21', when: 'any', text: "A dream tonight with a door in it. Open it, darling." },
      { id: 'ft-any-22', when: 'any', text: "The wind changes at teatime. Bring the washing in." },
      { id: 'ft-any-23', when: 'any', text: "Look up tonight: third star from the chimney. It winks if you're polite. It never winks at me. Petty little star." },
      { id: 'ft-any-24', when: 'any', text: "A new friend has a funny walk. Be kind about it. They're kind about yours." },
      { id: 'ft-any-25', when: 'any', text: "The Grove likes you. It told me so. Trees are dreadful gossips." },
      { id: 'ft-any-26', when: 'any', text: "Your next egg will hatch on a Tuesday. Or the cards are bluffing. They bluff dreadfully; never play them at snap." },
      { id: 'ft-any-27', when: 'any', text: "Someone is proud of you and hasn't said so. I'm saying it for them." },
      { id: 'ft-any-28', when: 'any', text: "A gentle week ahead. Well, gentle-ish. One sock will go missing." },
      { id: 'ft-any-29', when: 'any', text: "Rain, then rainbows, then mud. Nobody ever predicts the mud. I predict the mud. That's why I'm worth every Shell." },
      { id: 'ft-any-30', when: 'any', text: "I see a race. Not the finish. The fun bit in the middle." },
      { id: 'ft-any-31', when: 'any', text: "Something tiny will make you laugh at the wrong moment. A sneeze, I think. Possibly a duck. Laugh anyway." },
      { id: 'ft-any-32', when: 'any', text: "Three Shells in a very odd place are waiting for you. Spend one on me." },
      { id: 'ft-any-33', when: 'any', text: "Someone has left a lantern on for you. Go home whenever you're ready." },
      { id: 'ft-any-34', when: 'any', text: "A wobbly start, a muddled middle and a lovely finish. Like my soufflés, and like most good days." },
      { id: 'ft-any-35', when: 'any', text: "Tomorrow smells of toast. Follow your nose. If it leads to a burnt bit, that still counts as breakfast." },
      { id: 'ft-any-36', when: 'any', text: "Someone will give you a silly nickname. Let it stick." },
      { id: 'ft-any-37', when: 'any', text: "The fog lifts before lunch, darling. If it doesn't, have lunch anyway. Fog respects a person who eats." },
      { id: 'ft-any-38', when: 'any', text: "Every small step counts. Even the backwards ones, if you're dancing." },
      { id: 'ft-any-39', when: 'any', text: "Something you planted will surprise you by growing. Possibly a bean. Possibly a friendship." },
      { id: 'ft-any-40', when: 'any', text: "The cards are blank! That means the page is yours. Write something lovely on it." },
    ],
    outro: [
      { who: 'zinnia', text: 'There. The future, wrapped and ribboned, at a very reasonable price.', mood: 'happy' },
      { who: 'zinnia', text: 'Come back when it has grown, darling. The cards adore a sequel.' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Dr Fettle, the kindergarten doctor
  // ---------------------------------------------------------------------------
  {
    id: 'doctor',
    name: 'Dr Fettle',
    where: "Grove kindergarten: the doctor's room by the front door",
    intro: [
      { who: 'dr-fettle', text: 'Up on the table. Good. Ears up, please. Lovely ears.' },
      { who: 'narrator', text: 'A cold stethoscope. A small, offended squeak.' },
      { who: 'dr-fettle', text: "Right. Let's see what's going on under all that fluff.", mood: 'think' },
    ],
    readings: [
      // Trust
      {
        id: 'dr-trust-0',
        when: 'trust:<15',
        text: "Trust is very low. It flinches when I reach for it. Slow hands, soft voice, no throwing. Every day. That's the most important thing I'll say today.",
        childText: "It doesn't feel safe yet. Slow hands, a soft voice and gentle pats every day will help it trust you.",
      },
      { id: 'dr-trust-15', when: 'trust:>=15&trust:<40', text: "Trust is on the low side. It's watching to see what you'll do. Keep your promises: food on time, gentle pats." },
      { id: 'dr-trust-40', when: 'trust:>=40&trust:<70', text: "Trust is good. It feels safe with you most of the time. A few more quiet afternoons together and it'll be rock solid." },
      { id: 'dr-trust-70', when: 'trust:>=70', text: "Trust is excellent. It fell asleep while I was listening to its heart. They only do that when they feel completely safe." },

      // Alignment
      { id: 'dr-align-moon', when: 'alignment:<=-0.5', text: "Alignment is well over on the moon side. That's a temperament, not a fault. Expect night wandering and firm opinions." },
      { id: 'dr-align-moonish', when: 'alignment:>-0.5&alignment:<-0.15', text: "Leaning moonward, but not settled. The next stretch of care will decide it." },
      { id: 'dr-align-middle', when: 'alignment:>=-0.15&alignment:<=0.15', text: "Alignment sits right in the middle. Could tip either way, or stay put. Both perfectly healthy." },
      { id: 'dr-align-sunnish', when: 'alignment:>0.15&alignment:<0.5', text: "Leaning towards the sun. The kindness is showing. Not settled yet, though." },
      { id: 'dr-align-sun', when: 'alignment:>=0.5', text: "Alignment is strongly sun. Bright little soul. Don't mistake that for soft; they're every bit as stubborn as the rest." },

      // Happiness (-100..100)
      { id: 'dr-happy-low', when: 'happiness:<-30', text: "Happiness is well below zero. Something's bothering it. Check food, rest, and whether anyone's been rough with it." },
      { id: 'dr-happy-dip', when: 'happiness:>=-30&happiness:<0', text: "Slightly unhappy. A bad day, maybe two. A game and a snack usually sorts it." },
      { id: 'dr-happy-fine', when: 'happiness:>=0&happiness:<30', text: "Happiness is fine. Not glowing, but fine. Fine is a perfectly good place to live." },
      { id: 'dr-happy-good', when: 'happiness:>=30&happiness:<70', text: "Happy and healthy. Tail going like a metronome. Whatever you're doing, write it down so you keep doing it." },
      { id: 'dr-happy-high', when: 'happiness:>=70', text: "Happiness is through the roof. I checked the reading twice. Then I checked it a third time, for fun." },

      // Affection (0..100)
      { id: 'dr-aff-low', when: 'affection:<20', text: "Affection is low. It doesn't know you well yet, or it hasn't been held much. Pet it. Talk to it. Daily." },
      { id: 'dr-aff-building', when: 'affection:>=20&affection:<50', text: "Affection is building. It likes you. It's deciding whether it loves you." },
      { id: 'dr-aff-good', when: 'affection:>=50&affection:<80', text: "Good affection. It looks for you whenever you leave the room." },
      { id: 'dr-aff-max', when: 'affection:>=80', text: "Affection is as high as it goes. It tried to climb out of my hands to get back to you." },

      // Hunger (100 = full)
      { id: 'dr-hunger-empty', when: 'hunger:<25', text: "Hunger is in the red. Feed it today. Now, ideally. I'll wait." },
      { id: 'dr-hunger-peckish', when: 'hunger:>=25&hunger:<50', text: "Getting peckish. A fruit within the hour, please." },
      { id: 'dr-hunger-fed', when: 'hunger:>=50&hunger:<80', text: "Nicely fed. Tummy makes the correct noise, which is no noise at all. Carry on." },
      { id: 'dr-hunger-full', when: 'hunger:>=80', text: "Stuffed. Hold the snacks for a while; it's had plenty." },

      // Energy (100 = rested)
      { id: 'dr-energy-empty', when: 'energy:<25', text: "Energy's nearly gone. It needs a proper nap somewhere quiet. No races today." },
      { id: 'dr-energy-low', when: 'energy:>=25&energy:<50', text: "Running a bit low. A rest before any training, please." },
      { id: 'dr-energy-good', when: 'energy:>=50&energy:<80', text: "Good energy. Enough for a lesson or a short race. Not both, whatever it tells you." },
      { id: 'dr-energy-full', when: 'energy:>=80', text: "Fully charged. It's about to bounce off my walls. Take it outside, quickly." },

      // Dominant type lean
      { id: 'dr-lean-swim', when: 'lean:swim', text: "Swim lean is the strongest. The webbing between its toes is filling out nicely. Keep it near water." },
      { id: 'dr-lean-fly', when: 'lean:fly', text: "Fly lean is out in front. Wing muscles are coming along. Mind your ceilings." },
      { id: 'dr-lean-run', when: 'lean:run', text: "Run lean leads. Strong legs, light frame. It ran a lap of my room while I was writing that down." },
      { id: 'dr-lean-power', when: 'lean:power', text: "Power lean is dominant. Dense little muscles. It nearly bent my stethoscope." },
      { id: 'dr-lean-normal', when: 'lean:normal', text: "No lean is clearly ahead. Balanced all round. Leave it like that and you'll get a Normal type." },

      // Lifetime happiness (decides rebirth)
      {
        id: 'dr-life-low',
        when: 'lifetimeHappiness:<0',
        text: "Over its whole life, it's been unhappy more often than not. That number decides whether it comes back as an egg. Not too late, but things need to change.",
        childText: "Over its whole life it hasn't had enough happy days yet. Lots of fun and cuddles from now on will help a great deal.",
      },
      { id: 'dr-life-under', when: 'lifetimeHappiness:>=0&lifetimeHappiness:<30', text: "Lifetime happiness is below what a rebirth needs. Steady good days will lift it. One brilliant day won't." },
      { id: 'dr-life-ok', when: 'lifetimeHappiness:>=30&lifetimeHappiness:<60', text: "Lifetime happiness is healthy. On this course, a rebirth is on the cards. Don't tell Zinnia I said cards." },
      { id: 'dr-life-high', when: 'lifetimeHappiness:>=60', text: "Lifetime happiness is excellent. This has been a good life so far. Well done, Keeper." },

      // Status
      {
        id: 'dr-shadow',
        when: 'shadow:true',
        text: "Coat's gone dark. That's Shadow: trust sat at the bottom too long. The fur stays dark, but the heart can come back. Slowly.",
        childText: "Its coat went dark because it got very scared. With lots of gentle care, it can learn to feel safe again.",
      },
      { id: 'dr-shadow-bond', when: 'shadow:true&bond:true', text: "Shadow coat, bonded heart. I don't see that often. You did something right, and you did it for a long time." },
      { id: 'dr-stray', when: 'stray:true', text: "Strays come in thin and wary. It's healthy enough, just tired. Give it a bed and a name, and don't rush it." },
      { id: 'dr-eternal-sun', when: 'eternal:sun', text: "An Eternal. Sun line. Heart like a metronome and not a grey hair on it. I'm mostly here to admire." },
      { id: 'dr-eternal-moon', when: 'eternal:moon', text: "An Eternal, moon line. Older than my practice and in better shape than me." },
      { id: 'dr-eternal-neutral', when: 'eternal:neutral', text: "A neutral Eternal. Perfectly steady readings. I could set my watch by it." },
      { id: 'dr-child', when: 'stage:child', text: "Growing well. Bones are soft at this age. No throwing, please. Not ever, at any age." },
      { id: 'dr-adult', when: 'stage:adult', text: "A healthy adult. Joints good, eyes bright, and the ears swivel when I open the sticker drawer. Nothing wrong with those ears." },
      { id: 'dr-hungry-tired', when: 'hunger:<25&energy:<25', text: "Hungry and exhausted, both. Food first, then sleep. Training can wait until next week." },
      { id: 'dr-happy-loved', when: 'happiness:>=70&affection:>=80', text: "Happy, loved, and fully aware of it. Honestly, I don't know why you brought it in. Have a sticker." },
      { id: 'dr-any-1', when: 'any', text: "All within normal ranges, which is rarer than you'd think. Most of my patients come in with a bean up a nostril." },
      { id: 'dr-any-2', when: 'any', text: "Clean bill of health. It sneezed on me, but that's not a medical issue. That's a manners issue." },
    ],
    outro: [
      { who: 'dr-fettle', text: 'Done. Come back if anything looks off.' },
      { who: 'dr-fettle', text: 'Or if it just wants another sticker. I have plenty.', mood: 'happy' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. Aunt Wen, clouds and bones (unlocked by Q58)
  // ---------------------------------------------------------------------------
  {
    id: 'aunt-wen',
    name: 'Aunt Wen',
    where: "The fortune tent, after Q58: Aunt Wen's stool by the brazier",
    intro: [
      { who: 'aunt-wen', text: "Sit. No, not there, that's the bone stool. There. Good." },
      { who: 'narrator', text: 'She drops a flat bone into the brazier. It cracks. She glances at the sky, then back at the bone.' },
      { who: 'aunt-wen', text: 'Ah. Yes. Of course. The bones never lie. They simply exaggerate.', mood: 'think' },
    ],
    readings: [
      // Love
      { id: 'wen-love-1', when: 'any', text: "The bones say someone is thinking of you. Possibly about lunch. Still counts." },
      { id: 'wen-love-2', when: 'any', text: "Love will come from the east. Or the west. The bones are very certain it will come from a direction." },
      { id: 'wen-love-3', when: 'personality:shy', text: "This one loves you very much and will never say so. It will sit on your foot instead. That is the same thing." },
      { id: 'wen-love-4', when: 'any', text: "A heart fruit is in your future. Do not eat it yourself. I mean it. The bones are still cross about last time." },
      { id: 'wen-love-5', when: 'band:sun', text: "The clouds show two halos, side by side. A friendship is coming. Wear a clean shirt." },
      { id: 'wen-love-6', when: 'any', text: "You will meet a stranger who becomes a friend, or a friend who becomes a stranger and then a friend again. The bones go in circles." },
      // Adventure
      { id: 'wen-adv-1', when: 'any', text: "A long journey lies ahead. Possibly to the pond. It is quite far, if you are small." },
      { id: 'wen-adv-2', when: 'type:run', text: "Its feet will take it somewhere amazing. The bones say: the other side of the garden. And then back." },
      { id: 'wen-adv-3', when: 'type:fly', text: "The clouds see it high up. Very high. Someone should get it down from there." },
      { id: 'wen-adv-4', when: 'any', text: "Danger approaches! Great danger! ...No, wait, that's just a crack in the bone. Carry on." },
      { id: 'wen-adv-5', when: 'band:moon', text: "Something mysterious happens tonight. The bones will not say what. The bones are being dramatic." },
      { id: 'wen-adv-6', when: 'any', text: "Great deeds await you. Small great deeds. Carrying a beetle out of the bath. Never underestimate a grateful beetle." },
      // Food
      { id: 'wen-food-1', when: 'any', text: "You will eat something round. The bones are never wrong about round things." },
      { id: 'wen-food-2', when: 'personality:lazy', text: "This one will find the snack long before it finds the effort. A wise creature. I respect it." },
      { id: 'wen-food-3', when: 'any', text: "Beware the third fruit. The first two are fine." },
      { id: 'wen-food-4', when: 'any', text: "That cloud looks like a pie. This means pie. Sometimes clouds are simple." },
      { id: 'wen-food-5', when: 'type:swim', text: "Fish? No. Fish-shaped? Yes. The bones see something fish-shaped for supper." },
      { id: 'wen-food-6', when: 'any', text: "Hunger is coming. Very soon. In fact, feed it now. ...See? That one was exactly right." },
      // Weather
      { id: 'wen-weather-1', when: 'any', text: "Rain tomorrow. The clouds say so, the bones say so, and my left knee has started complaining. The knee is never wrong." },
      { id: 'wen-weather-2', when: 'any', text: "The clouds are thick and grumpy. Something big is brewing. Probably weather. Weather is always brewing." },
      { id: 'wen-weather-3', when: 'any', text: "Wind from the hills. It will knock over exactly one thing you care about. Move the vase." },
      { id: 'wen-weather-4', when: 'any', text: "Clouds like little sheep, all heading east. Either fine weather is coming, or the sheep know something we don't." },
      { id: 'wen-weather-5', when: 'any', text: "When the mountain grumbles, you listen. I listened once, and a young Keeper did most of the running. Whole village thanked me. Today it's only snoring." },
      { id: 'wen-weather-8', when: 'any', text: "The bones say you will sit on the bone stool again. They are never wrong about that one. Up you get." },
      { id: 'wen-weather-7', when: 'any', text: "The bones and the clouds disagree today. I am siding with the bones. The clouds have never once paid rent." },
      { id: 'wen-weather-6', when: 'any', text: "Snow in the Grove? The bones say yes. The bones also once said a goat would become mayor." },
      // Rebirth
      { id: 'wen-rebirth-1', when: 'rebirth:likely', text: "I see an egg. Then a little face. Then the same face, smaller. It will come back to you." },
      { id: 'wen-rebirth-2', when: 'rebirth:unlikely', text: "The bones go quiet about the egg. Quiet means: more joy needed. Play with it. Feed it well. Make the bones talk." },
      { id: 'wen-rebirth-3', when: 'rebirths:>0', text: "This one has been here before. The bones can tell. It has the look of a creature who knows where the good stump is." },
      { id: 'wen-rebirth-4', when: 'any', text: "Every ending is a beginning that hasn't had its breakfast yet. Be patient with it." },
      { id: 'wen-rebirth-5', when: 'stage:cocoon', text: "A cocoon. The bones say: wait. The bones always say wait. This time they mean it." },
      { id: 'wen-rebirth-6', when: 'any', text: "The bones say it will have a long and happy life. The bones say that about everyone. They are usually right." },
    ],
    outro: [
      { who: 'aunt-wen', text: 'There. Your destiny. Mostly.', mood: 'happy' },
      { who: 'aunt-wen', text: 'If it turns out wrong, it was the clouds. If it turns out right, it was me.' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. The Island Mystic (Neopia: Mystery Island)
  // ---------------------------------------------------------------------------
  {
    id: 'island-mystic',
    name: 'The Island Mystic',
    where: 'Neopia section: the Mystery Island beach, by the carved mask',
    intro: [
      { who: 'narrator', text: 'Waves hiss on the sand. The great carved mask turns its eyes towards you.' },
      { who: 'island-mystic', text: 'A traveller. Sit by the fire. The sea is in no hurry, and neither am I.', mood: 'think' },
    ],
    readings: [
      { id: 'im-01', when: 'any', text: "The tide brings what you seek, but only once it has finished with it." },
      { id: 'im-02', when: 'any', text: "A coconut falls far from the tree when the tree is on a hill." },
      { id: 'im-03', when: 'any', text: "You will hear a drum where there is no drummer." },
      { id: 'im-04', when: 'any', text: "Your shadow walks behind you all day and never once complains. Buy it something nice." },
      { id: 'im-05', when: 'any', text: "Something lost in the sand wishes to be found by you." },
      { id: 'im-06', when: 'any', text: "The fire mountain sleeps, and so should you." },
      { id: 'im-07', when: 'any', text: "A friend with fins will show you the way. Do not ask him twice. He is sensitive about directions." },
      { id: 'im-08', when: 'any', text: "Three shells, one pearl. Choose the dull one." },
      { id: 'im-09', when: 'any', text: "Beware the quiet monkey. I have told eleven travellers this. Nine of them now have no sandwich." },
      { id: 'im-10', when: 'any', text: "The wind knows your name. It says it wrong. Do not correct the wind." },
      { id: 'im-11', when: 'any', text: "When the moon is round, so are the fish." },
      { id: 'im-12', when: 'any', text: "A carved mask smiles upon you. Do not ask which one." },
      { id: 'im-13', when: 'any', text: "Your luck is buried. I buried it. It seemed wise at the time. Bring a spade." },
      { id: 'im-14', when: 'any', text: "The palm bends but does not break. Bend more." },
      { id: 'im-15', when: 'any', text: "Tomorrow tastes of mango." },
      { id: 'im-16', when: 'any', text: "A wave is coming. Not from the sea. Someone across the beach is going to wave at you. Wave back. That is the whole prophecy." },
      { id: 'im-17', when: 'any', text: "You will trade something small for something strange." },
      { id: 'im-18', when: 'any', text: "The jungle has eyes, and they find you interesting." },
      { id: 'im-19', when: 'any', text: "Follow the crab, but walk forwards." },
      { id: 'im-20', when: 'any', text: "The volcano sleeps. The volcano snores. The spirits ask that you do not poke the volcano. They mean you specifically." },
      { id: 'im-21', when: 'any', text: "The island tells its secrets to those who sit still. You have fidgeted four times. The island has told you nothing." },
      { id: 'im-22', when: 'any', text: "An old stone will speak to you. Answer politely." },
      { id: 'im-23', when: 'any', text: "Your feet know a path your head has not found yet. Your head should stop arguing with your feet." },
      { id: 'im-24', when: 'any', text: "Many Shells lie ahead. Do not spend them all at the Tombola. The Tombola has never once given anybody a pony." },
      { id: 'im-25', when: 'any', text: "The parrot repeats. The wise one listens." },
      { id: 'im-26', when: 'any', text: "Under the next leaf, a codestone. Under the leaf after that, a very startled frog. Lift leaves gently." },
      { id: 'im-27', when: 'any', text: "The sun rises for the sleepers too. They miss it, and are much happier. Make of that what you will." },
      { id: 'im-28', when: 'any', text: "The storm passes. The sand stays. Mostly in your shoes." },
      { id: 'im-29', when: 'any', text: "A coconut will fall near you. Not on you. Near you. The spirits wanted you to have a fright and a snack." },
      { id: 'im-30', when: 'any', text: "Today, the coconut is on your side." },
      { id: 'im-31', when: 'any', text: "Greatness is near you. It is wearing a disguise." },
      { id: 'im-32', when: 'any', text: "Listen to the drums. Today they say 'snack'." },
      { id: 'im-33', when: 'any', text: "The quiet monkey sends its regards. Check your pockets." },
      { id: 'im-34', when: 'any', text: "The fish you did not catch tells stories about you." },
      { id: 'im-35', when: 'any', text: "A gift from the sea arrives with seaweed attached." },
      { id: 'im-36', when: 'any', text: "What you plant in sand grows in your dreams. What you plant in soil grows in soil. Plant in soil, friend." },
      { id: 'im-37', when: 'any', text: "The mask is pleased. Do not ruin it." },
      { id: 'im-38', when: 'any', text: "The stars over the island all point towards your home. Except one, which points at the snack hut. Trust that one." },
      { id: 'im-39', when: 'any', text: "A small step on hot sand is still a step. Several quick ones are a dance. The island approves of both." },
      { id: 'im-40', when: 'any', text: "The mask has seen your future. It is smiling. Draw your own conclusions." },
    ],
    outro: [
      { who: 'island-mystic', text: 'Go now. The spirits have spoken, and now they would like a nap.' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. The Wise Old King (Neopia: Brightvale)
  // ---------------------------------------------------------------------------
  {
    id: 'wise-old-king',
    name: 'The Wise Old King',
    where: 'Neopia section: the Brightvale throne room, among the scrolls',
    intro: [
      { who: 'narrator', text: 'Scrolls everywhere. The king strokes a beard of truly regal length.' },
      { who: 'wise-old-king', text: 'Ah, a seeker of wisdom. Approach. Mind the scrolls. Mind the other scrolls.', mood: 'think' },
    ],
    readings: [
      { id: 'wok-01', when: 'any', text: "A wise ruler counts his blessings. A wiser one counts his biscuits, for blessings seldom go missing from the tin." },
      { id: 'wok-02', when: 'any', text: "He who chases two Nubbins at once shall catch only a nap." },
      { id: 'wok-03', when: 'any', text: "The mountain does not hurry, and neither shall I, for I am the king and the mountain is late." },
      { id: 'wok-04', when: 'any', text: "Within every acorn sleeps a mighty oak, and the oak is quite cross about the arrangement." },
      { id: 'wok-05', when: 'any', text: "Speak softly, and carry a large scroll. If they still argue, unroll it. Nobody argues with forty feet of scroll." },
      { id: 'wok-06', when: 'any', text: "A book unread is a door unopened. A door unopened is a draught prevented. Reflect upon this." },
      { id: 'wok-07', when: 'any', text: "The river reaches the sea not by force but by patience, and by going downhill, which helps enormously." },
      { id: 'wok-08', when: 'any', text: "Know thyself. Then know thy neighbour. Then return thy neighbour's ladder." },
      { id: 'wok-09', when: 'any', text: "The early bird catches the worm, but the late king is brought breakfast. Choose your path." },
      { id: 'wok-10', when: 'any', text: "Wisdom is like soup: best when shared, and terrible in the beard." },
      { id: 'wok-11', when: 'any', text: "He who plants a tree plants shade for strangers. He who plants a turnip plants lunch. Both are noble." },
      { id: 'wok-12', when: 'any', text: "The longest journey begins with a single step, and with remembering where you left your boots." },
      { id: 'wok-13', when: 'any', text: "Do not count your eggs before they hatch. Count them after. It is far more rewarding." },
      { id: 'wok-14', when: 'any', text: "A king who listens hears much. A king who listens at doors hears more, but ought not to." },
      { id: 'wok-15', when: 'any', text: "Patience is a feather that one day becomes a pillow. Impatience is a pillow that one day becomes feathers, all over the floor." },
      { id: 'wok-16', when: 'any', text: "The stars never argue over who shines brightest. That is why they are stars and not courtiers." },
      { id: 'wok-17', when: 'any', text: "To learn, ask. To be wise, ask again. To be king, have someone else ask for you." },
      { id: 'wok-18', when: 'any', text: "A full bowl makes a happy Nubbin. An empty bowl makes a loud one." },
      { id: 'wok-19', when: 'any', text: "The wise snail does not envy the hare. The wise snail is already home." },
      { id: 'wok-20', when: 'any', text: "Truth is a lantern. Carry it carefully, and do not swing it at people." },
      { id: 'wok-21', when: 'any', text: "He who laughs last has merely understood slowly, and should be praised for his thoroughness." },
      { id: 'wok-22', when: 'any', text: "The tallest tower still begins on the ground floor, which is why the ground floor is so insufferably smug." },
      { id: 'wok-23', when: 'any', text: "A gentle word opens more gates than a battering ram, and is far easier to carry." },
      { id: 'wok-24', when: 'any', text: "Be like the pond: still, deep, and full of interesting frogs." },
      { id: 'wok-25', when: 'any', text: "The crown is heavy. That is why kings are so often seen sitting down." },
      { id: 'wok-26', when: 'any', text: "In the great library of life, return your books on time. The great librarian of life is extremely petty about fines." },
      { id: 'wok-27', when: 'any', text: "Rain falls on kings and turnips alike. Only the turnip says thank you." },
      { id: 'wok-28', when: 'any', text: "Measure twice and cut once. Better still, ask the carpenter." },
      { id: 'wok-29', when: 'any', text: "A clever man learns from his mistakes. A wise man learns from other people's. A king makes his in front of the whole court." },
      { id: 'wok-30', when: 'any', text: "The owl is wise because it says little. I say a great deal. Draw your own conclusions, quietly." },
    ],
    outro: [
      { who: 'wise-old-king', text: 'Go forth, and be wise. Or at least be well-read. That is the next best thing.', mood: 'happy' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 6. The Grumpy Old King (Neopia: Meridell)
  // ---------------------------------------------------------------------------
  {
    id: 'grumpy-old-king',
    name: 'The Grumpy Old King',
    where: 'Neopia section: the Meridell throne room',
    intro: [
      { who: 'grumpy-old-king', text: 'What? A visitor? Fine. FINE. Tell me a joke, or I shall tell you one.', mood: 'angry' },
      { who: 'grumpy-old-king', text: "Too slow. Here's mine. And you WILL laugh." },
    ],
    readings: [
      { id: 'gok-01', when: 'any', text: "Why did the Nubbin bring a ladder to kindergarten? It heard the lessons were on the next level!" },
      { id: 'gok-02', when: 'any', text: "What do you call a knight who's afraid of the dark? Sir Nightlight!" },
      { id: 'gok-03', when: 'any', text: "Why did the turnip get knighted? It was outstanding in its field." },
      { id: 'gok-04', when: 'any', text: "What did the castle say to the moat? 'Stop going round in circles about me!'" },
      { id: 'gok-05', when: 'any', text: "Why did the Kau join my royal guard? It wanted to be a moo-dieval knight. MOO-dieval. Laugh." },
      { id: 'gok-06', when: 'any', text: "Why did the cocoon get a library card? It was planning a big change and wanted to read up on it." },
      { id: 'gok-07', when: 'any', text: "What did the king say when someone took his throne? 'Well, I suppose I'll have to stand for it.'" },
      { id: 'gok-08', when: 'any', text: "Why did the potato join the royal guard? It had more eyes than anybody else." },
      { id: 'gok-09', when: 'any', text: "How does a moat say hello? It gives you a little wave. ...A WAVE. It's water. Do keep up." },
      { id: 'gok-10', when: 'any', text: "What do you call a dragon with a cold? A sneeze-breather. Stand well back." },
      { id: 'gok-11', when: 'any', text: "Why did the jelly refuse to argue with the king? It knew it would only go wobbly." },
      { id: 'gok-12', when: 'any', text: "Why did the snail join the cavalry? It wanted to be the fastest rider in Meridell. It's still on its way." },
      { id: 'gok-13', when: 'any', text: "What do you call a Nubbin in a raincoat? Dry. That's the joke. Laugh." },
      { id: 'gok-14', when: 'any', text: "What do you call a Babaa that knows karate? A lamb chop! HAH! Write that down. No, I'll write it down." },
      { id: 'gok-15', when: 'any', text: "Why wouldn't the cheese join the battle? It didn't want to get grated." },
      { id: 'gok-16', when: 'any', text: "What's a knight's favourite fish? A swordfish. Obviously." },
      { id: 'gok-17', when: 'any', text: "Why did the owl join the castle choir? It knew all the right 'whoo's." },
      { id: 'gok-18', when: 'any', text: "What do you call a king who loves jumping in puddles? His Royal Splashness." },
      { id: 'gok-19', when: 'any', text: "What's a Nubbin's favourite day of the week? Snoozeday. Followed closely by Snackday." },
      { id: 'gok-20', when: 'any', text: "Why did the cloud get a crown? It was the reign-maker." },
      { id: 'gok-21', when: 'any', text: "Why don't Skeiths ever make knights? They keep lying down on the job. And on the horse. And on the squire." },
      { id: 'gok-22', when: 'any', text: "What did the drawbridge say at the end of a long day? 'I really need a lift.'" },
      { id: 'gok-23', when: 'any', text: "Why are knights terrible at hide-and-seek? You can hear them clanking from three fields away." },
      { id: 'gok-24', when: 'any', text: "Why did the snowman visit the Grumpy Old King? He wanted to meet someone even frostier. ...Hmph." },
      { id: 'gok-25', when: 'any', text: "What do you call a carrot that tells fortunes? A root-reader. Madame Zinnia calls that slander. Madame Zinnia has never once laughed." },
      { id: 'gok-26', when: 'any', text: "Why did the Elephante bring its trunk to my castle? It was staying the week. That was in spring. Send help." },
      { id: 'gok-27', when: 'any', text: "Why are Meridell's turnips so well behaved? A strict root-ine. ROOT-ine! Oh, that's one of my best." },
      { id: 'gok-28', when: 'any', text: "Why did the Chia see the castle doctor? It was feeling a bit seedy. ...You're not laughing. I'm laughing enough for two." },
      { id: 'gok-29', when: 'any', text: "What do you call a Wocky that won't stop chatting in the library? A wocky-talky! HAH! Get out. No, stay. One more." },
      { id: 'gok-30', when: 'any', text: "Why did the jester bring a spoon to the throne room? He heard the king was in a stew." },
    ],
    outro: [
      { who: 'grumpy-old-king', text: "Hah! HAH! ...Well, I thought it was funny. Off you go.", mood: 'happy' },
    ],
  },
];
