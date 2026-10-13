/**
 * The campaign: "Hazel's Grove". Twelve chapters, eight endings. Every line here is
 * player-facing text; the rules that drive it live in sim/campaign.ts.
 *
 * Speakers: the ten Keepers (by trainer id), Moss the old Eternal, Sable the Shadow
 * Nubbin, Corvin Vale, Gran Hazel, and the narrator. The player's own Keeper is "you";
 * if the player picked a Keeper who has lines, an understudy takes them (see
 * UNDERSTUDY).
 */

export type Mood = 'neutral' | 'happy' | 'sad' | 'angry' | 'think' | 'shock' | 'soft';

export interface Line {
  who: string;
  text: string;
  mood?: Mood;
}

export interface Choice {
  id: string;
  label: string;
  /** Flags to set when picked. */
  set?: Record<string, number | boolean | string>;
  /** Friendship changes per Keeper id. */
  friendship?: Record<string, number>;
  /** Lines shown after picking, before the scene ends. */
  then?: Line[];
}

export interface Scene {
  id: string;
  lines: Line[];
  choices?: Choice[];
  /** Flags to set when the scene ends. */
  set?: Record<string, number | boolean | string>;
}

export interface Chapter {
  n: number;
  title: string;
  opening: string;
  /** Goal id (sim/campaign.ts decides when it is met) and the journal text. */
  goal: string;
  goalText: string;
  hint: string;
  closing: string;
}

export const SPEAKERS: Record<string, { name: string; kind: 'keeper' | 'nubbin' | 'other' }> = {
  you: { name: 'You', kind: 'keeper' },
  narrator: { name: '', kind: 'other' },
  moss: { name: 'Moss', kind: 'nubbin' },
  sable: { name: 'Sable', kind: 'nubbin' },
  corvin: { name: 'Corvin Vale', kind: 'keeper' },
  hazel: { name: 'Gran Hazel', kind: 'keeper' },
  fern: { name: 'Fern', kind: 'keeper' },
  marina: { name: 'Marina', kind: 'keeper' },
  sparks: { name: 'Sparks', kind: 'keeper' },
  clover: { name: 'Clover', kind: 'keeper' },
  pixel: { name: 'Pixel', kind: 'keeper' },
  luna: { name: 'Luna', kind: 'keeper' },
  ember: { name: 'Ember', kind: 'keeper' },
  byte: { name: 'Byte', kind: 'keeper' },
  dusty: { name: 'Dusty', kind: 'keeper' },
  nova: { name: 'Nova', kind: 'keeper' },
};

/** If the player is this Keeper, that Keeper's lines go to the understudy. */
export const UNDERSTUDY: Record<string, string> = {
  fern: 'clover',
  marina: 'nova',
  sparks: 'pixel',
  clover: 'fern',
  pixel: 'byte',
  luna: 'nova',
  ember: 'sparks',
  byte: 'pixel',
  dusty: 'nova',
  nova: 'marina',
};

export const CHAPTERS: Chapter[] = [
  {
    n: 1,
    title: 'The Letter',
    opening: 'c1-letter',
    goal: 'firstHatch',
    goalText: 'Hatch your first egg and pet the Nubbin that comes out.',
    hint: 'Hold an egg and shake it to hurry it along. Tap a Nubbin and choose Pet.',
    closing: 'c1-close',
  },
  {
    n: 2,
    title: 'Shells and Promises',
    opening: 'c2-open',
    goal: 'feedTwice',
    goalText: 'Collect fruit from the trees and feed a Nubbin by hand, twice.',
    hint: 'Tap a tree to shake it. Tap fruit to pick it up. Tap a Nubbin and choose Feed.',
    closing: 'c2-corvin',
  },
  {
    n: 3,
    title: 'The One Who Hides',
    opening: 'c3-open',
    goal: 'sableTrust20',
    goalText: 'Win a little of Sable’s trust (20).',
    hint: 'Sable runs when you come close. Leave fruit nearby, be patient, pet her when she lets you. Never throw her.',
    closing: 'c3-close',
  },
  {
    n: 4,
    title: 'Moss Remembers',
    opening: 'c4-open',
    goal: 'lanternsAndMoss',
    goalText: 'Pet Moss on the hill and light all four lanterns.',
    hint: 'Tap a lantern post to light it. Moss sits on the western hill.',
    closing: 'c4-close',
  },
  {
    n: 5,
    title: 'The Circuit',
    opening: 'c5-open',
    goal: 'winRace',
    goalText: 'Win a race, any course, any tier.',
    hint: 'Open Races from the top bar. A grown Nubbin with trained stats does best.',
    closing: 'c5-close',
  },
  {
    n: 6,
    title: 'Rain on the Hill',
    opening: 'c6-open',
    goal: 'talkDusty',
    goalText: 'Sit with Dusty by the flower.',
    hint: 'Walk up to Dusty and tap them.',
    closing: 'c6-close',
  },
  {
    n: 7,
    title: 'What Fear Teaches',
    opening: 'c7-open',
    goal: 'sableTrust45',
    goalText: 'Bring Sable’s trust to 45.',
    hint: 'Feeding and petting raise trust. Hunger and throws destroy it. Shadow Nubbins heal slowly.',
    closing: 'c7-close',
  },
  {
    n: 8,
    title: 'The Hollow',
    opening: 'c8-open',
    goal: 'expedition',
    goalText: 'Take a Nubbin on an Expedition and come back.',
    hint: 'Open the Expedition from the top bar.',
    closing: 'c8-close',
  },
  {
    n: 9,
    title: 'Corvin’s Garden',
    opening: 'c9-open',
    goal: 'corvinChoice',
    goalText: 'Decide what to do about Corvin’s garden.',
    hint: 'The choice is made in the scene. Each path leads somewhere different.',
    closing: 'c9-close',
  },
  {
    n: 10,
    title: 'The Long Night',
    opening: 'c10-open',
    goal: 'lanternsAgain',
    goalText: 'Light all four lanterns for Moss.',
    hint: 'Tap each lantern post. Moss needs to have been loved: pet him often before now.',
    closing: 'c10-close',
  },
  {
    n: 11,
    title: 'Hazel',
    opening: 'c11-open',
    goal: 'threeFriends',
    goalText: 'Talk with three different Keepers.',
    hint: 'Walk up to the visiting Keepers and tap them.',
    closing: 'c11-close',
  },
  {
    n: 12,
    title: 'Keepers',
    opening: 'c12-open',
    goal: 'finalChoice',
    goalText: 'Decide what the Grove will be.',
    hint: 'The ending is chosen by everything you did. See the Paths page.',
    closing: 'c12-close',
  },
];

const S = (id: string, lines: Line[], extra: Partial<Scene> = {}): Scene => ({ id, lines, ...extra });

export const SCENES: Scene[] = [
  // ---------------------------------------------------------------- chapter 1
  S('c1-letter', [
    { who: 'narrator', text: 'The gate is stuck. It always was. You lift and push, the way she taught you.' },
    { who: 'narrator', text: 'The Grove is overgrown and quiet. On the signpost, under a stone, a letter in your grandmother’s hand.' },
    { who: 'hazel', text: '“If you’re reading this, I’ve gone up the hill and I’m not coming down for a while. Don’t be dramatic about it.”', mood: 'soft' },
    { who: 'hazel', text: '“There are two eggs in the long grass. They were waiting for someone with warm hands. That’s you.”', mood: 'soft' },
    { who: 'hazel', text: '“Rules. One: feed them before you feed yourself. Two: never, ever throw one. Three: when you don’t know what to do, sit down next to them and wait.”' },
    { who: 'hazel', text: '“Moss will be watching from the hill. He’s older than the trees and twice as stubborn. He’ll come down when he decides you’re worth it.”' },
    { who: 'hazel', text: '“Love, Gran. P.S. The gate sticks. Lift and push.”', mood: 'happy' },
    { who: 'narrator', text: 'Something small and grey watches from the top of the western hill, very still, and does not come down.' },
    { who: 'fern', text: 'Hello? Oh! You’re Hazel’s. You’ve got her chin. I’m Fern, from next door. I’ve been keeping the trees alive, badly.', mood: 'happy' },
    { who: 'fern', text: 'Go on, find the eggs. They’ve been humming for a week. I’ll be around if you need anything. Mostly I need things from you, honestly.' },
  ]),
  S('c1-close', [
    { who: 'sparks', text: 'HEY. New Keeper. Don’t move. There’s a lantern post behind you and I’ve nearly fixed it.', mood: 'shock' },
    { who: 'narrator', text: 'There is a crackle, a small blue flash, and the smell of burnt hair.' },
    { who: 'sparks', text: 'Fixed it. Mostly. The hair grows back, before you ask. I’m Sparks. I run the fast ones. Yours is cute. Is it fast? It looks fast.', mood: 'happy' },
    { who: 'fern', text: 'It is three minutes old, Sparks.' },
    { who: 'sparks', text: 'Potential, Fern. I’m talking about potential.' },
    { who: 'narrator', text: 'Your Nubbin looks up at you, then at Sparks, then at you again, and leans a little closer to your leg.' },
    { who: 'narrator', text: 'On the hill, the grey shape has moved one step down.' },
  ]),

  // ---------------------------------------------------------------- chapter 2
  S('c2-open', [
    { who: 'marina', text: 'Morning. Marina. I keep the tide pools past the ridge. Hazel used to trade me fruit for swimming lessons. For the Nubbins, not for her.', mood: 'happy' },
    { who: 'marina', text: 'The trees drop fruit on their own, but a shake hurries them. A Nubbin fed by your hand remembers the hand. That matters more than people think.' },
    { who: 'marina', text: 'Oh, and if a man in a grey coat comes by talking about “investment”, don’t sell him anything. Not fruit. Not eggs. Nothing.', mood: 'think' },
  ]),
  S(
    'c2-corvin',
    [
      { who: 'narrator', text: 'A man in a grey coat is leaning on the gate. He didn’t have to lift and push. He just waited for it to open.' },
      { who: 'corvin', text: 'Hazel’s heir. You have her stubborn little chin. Corvin Vale. I run the Circuit, up the valley. The real races.' },
      { who: 'corvin', text: 'I knew your grandmother well. I was her student, once. We disagreed about methods. She thought love was a method.', mood: 'think' },
      { who: 'corvin', text: 'Your young one there. Good bones. I will give you two hundred Shells for it, right now, and it will eat better with me than it ever will here.' },
      { who: 'narrator', text: 'Your Nubbin has gone very still behind your legs.' },
    ],
    {
      choices: [
        {
          id: 'refuse',
          label: 'No. They’re not for sale.',
          set: { corvinOffer: 'refused' },
          friendship: { marina: 2, ember: 2 },
          then: [
            { who: 'corvin', text: 'Of course. Her chin. The offer stands. Everyone sells eventually, when things get hard. Things always get hard.' },
            { who: 'narrator', text: 'He goes. The gate swings shut behind him on its own, which it has never once done for you.' },
          ],
        },
        {
          id: 'sell',
          label: 'Two hundred? …Fine. Take it.',
          set: { corvinOffer: 'sold', soldNubbin: true },
          friendship: { marina: -4, ember: -4, clover: -3 },
          then: [
            { who: 'corvin', text: 'Sensible. Hazel never was.' },
            { who: 'narrator', text: 'He lifts your Nubbin by the scruff, not roughly, but not gently either. It looks back at you the whole way to the gate. It does not make a sound.' },
            { who: 'narrator', text: 'Two hundred Shells sit in your hand. They are very heavy for something so small.' },
          ],
        },
        {
          id: 'consider',
          label: 'Let me think about it.',
          set: { corvinOffer: 'considered' },
          friendship: { marina: -1 },
          then: [
            { who: 'corvin', text: 'Think. I like a Keeper who thinks. I’ll be at the Circuit when you’ve finished.' },
            { who: 'narrator', text: 'Your Nubbin comes out from behind your legs slowly, and does not quite look at you.' },
          ],
        },
      ],
    },
  ),

  // ---------------------------------------------------------------- chapter 3
  S(
    'c3-open',
    [
      { who: 'narrator', text: 'Night. The lanterns are out. Something is at the far edge of the Grove, half in the long grass.' },
      { who: 'narrator', text: 'A Nubbin, grey as ash, the little ball above its head dark and still. One wing is held wrong. When you breathe, it flinches.' },
      { who: 'luna', text: 'Don’t. Not yet.', mood: 'soft' },
      { who: 'luna', text: 'Luna. I garden at night; I see what comes in at night. That one has been here three evenings. It eats what I leave and runs if I so much as stand up.' },
      { who: 'luna', text: 'It’s gone Shadow. That’s what happens when a Nubbin stops believing hands are safe. It isn’t cruel. It isn’t anything. It’s just… waiting for the next bad thing.' },
      { who: 'luna', text: 'I’ve been calling her Sable. She hasn’t objected. What will you do?' },
    ],
    {
      choices: [
        {
          id: 'slow',
          label: 'Sit down. Put fruit on the ground. Wait.',
          set: { sableFirst: 'slow', sableTrustBonus: 6 },
          friendship: { luna: 4 },
          then: [
            { who: 'narrator', text: 'You sit. You put the fruit down. For a long time nothing happens, and then a small grey shape takes one step, and another, and eats, watching you the entire time.' },
            { who: 'luna', text: 'That’s the whole trick. That’s all of it. Hazel would have liked you.', mood: 'happy' },
          ],
        },
        {
          id: 'grab',
          label: 'Catch her before she runs again.',
          set: { sableFirst: 'grab', sableTrustBonus: -8 },
          friendship: { luna: -3 },
          then: [
            { who: 'narrator', text: 'You lunge. You get a wing. She screams, a sound you did not know they could make, twists free, and is gone into the dark.' },
            { who: 'luna', text: '…She’ll come back. They do. But you have made the next part much harder, for both of you.', mood: 'sad' },
          ],
        },
      ],
    },
  ),
  S('c3-close', [
    { who: 'narrator', text: 'Sable lets you within two steps now. She does not come closer. But she does not run.' },
    { who: 'clover', text: 'Oh, she’s letting you near! I’m Clover. I keep the gentle ones. I’ve been so worried about her. Luna told me not to fuss, so I’ve been fussing quietly.', mood: 'happy' },
    { who: 'clover', text: 'Can I tell you something? A Shadow Nubbin doesn’t turn back. The grey stays. People think that means they’re broken.' },
    { who: 'clover', text: 'They aren’t. They’re just carrying the thing that happened. You can’t take it off them. You can only make it lighter.', mood: 'soft' },
    { who: 'narrator', text: 'Sable eats the fruit you left, and this time, when she finishes, she sits down instead of leaving.' },
  ]),

  // ---------------------------------------------------------------- chapter 4
  S('c4-open', [
    { who: 'narrator', text: 'The grey shape on the hill has come all the way down. He is old. You can see it in how he sits: carefully, like something that has decided to.' },
    { who: 'moss', text: '…You lift and push.', mood: 'think' },
    { who: 'narrator', text: 'The voice is small and dry and comes from somewhere behind your ears rather than in front of them.' },
    { who: 'moss', text: 'Eternals can speak, a little, to Keepers who sit still long enough. Hazel sat still for forty years. You have managed about a week. Not bad.' },
    { who: 'moss', text: 'She didn’t vanish. Vanishing is for people with no sense of theatre. She went to the Hollow, past the waterfall, to find the ones that got lost. She said she’d be back for the lanterns.' },
    { who: 'moss', text: 'Tonight is the lantern night. Four posts. Light them all and she might remember the way. Or she might not. Either way I would like to see it, one more year.' },
  ]),
  S('c4-close', [
    { who: 'narrator', text: 'Four lanterns, and the whole Grove gold. The Keepers have come, all of them, carrying cups of something hot and talking too loudly.' },
    { who: 'pixel', text: 'Pixel. Hi. I did the lantern timing circuit, Sparks did the part that explodes. Is it true you can hear Moss? Byte says it’s a hoax.', mood: 'happy' },
    { who: 'byte', text: 'I said it was unverified.' },
    { who: 'moss', text: 'Tell the pale one his shoelace is untied.' },
    { who: 'narrator', text: 'You tell Byte his shoelace is untied. Byte looks down. Byte goes very quiet.' },
    { who: 'luna', text: 'Hazel used to stand right there, by the pond, and not say anything. And it was somehow the best part.', mood: 'soft' },
    { who: 'narrator', text: 'Nobody comes down the hill. The lanterns burn until morning anyway.' },
  ]),

  // ---------------------------------------------------------------- chapter 5
  S('c5-open', [
    { who: 'ember', text: 'Ember. I don’t do small talk. Corvin Vale is running the Circuit this week and he’s invited you. That’s not a kindness. He wants to see what you’ve got so he can put a price on it.', mood: 'angry' },
    { who: 'ember', text: 'Years ago I had a Nubbin called Ash. Fast. Brave. I was young and I wanted to win. Corvin said he could make her a champion in a month. I let him take her for training.', mood: 'sad' },
    { who: 'ember', text: 'She came back grey. She won every race after that. She never once looked at me again.' },
    { who: 'ember', text: 'Go race. Win if you can. But watch how he talks to the ones who lose.', mood: 'angry' },
  ]),
  S('c5-close', [
    { who: 'corvin', text: 'Hazel’s heir wins. Of course. She always said the trick was to make them want to run for you. Sentimental. Effective, I’ll grant.' },
    { who: 'corvin', text: 'Mine run because the alternative is worse. It is faster. Ask Ember’s Ash, if she’s still speaking to anyone.' },
    { who: 'narrator', text: 'Behind him a line of grey Nubbins stands perfectly still, not touching each other, not looking at anything.' },
    { who: 'ember', text: 'Ash. Ash, it’s me.', mood: 'sad' },
    { who: 'narrator', text: 'One of the grey ones turns her head, very slightly, and then turns it back.' },
    { who: 'corvin', text: 'You see? Discipline. Come to the garden sometime. I’ll show you how it’s done.' },
  ]),

  // ---------------------------------------------------------------- chapter 6
  S('c6-open', [
    { who: 'narrator', text: 'It rains. Dusty is sitting on the hill in it, next to a small cocoon that is going slowly see-through.' },
    { who: 'dusty', text: 'Her name’s Fossil. Original, I know. I dug her egg out of the cliff face when I was eleven. She’s been with me twenty years.', mood: 'soft' },
    { who: 'dusty', text: 'She’s done. Not reborn. Done. You can tell by the light. Rebirth glows; this just… thins.' },
    { who: 'dusty', text: 'Everyone keeps telling me it means she was happy enough to let go. That’s true. It’s also the worst thing anyone’s ever said to me.', mood: 'sad' },
    { who: 'narrator', text: 'The cocoon is almost gone. Where it was, a flower is pushing up through the wet grass.' },
    { who: 'dusty', text: 'Would you sit with me a bit. You don’t have to say anything. Hazel never did.' },
  ]),
  S('c6-close', [
    { who: 'narrator', text: 'You sit with Dusty until the rain stops. Neither of you says anything. It is somehow the best part.' },
    { who: 'dusty', text: 'Thank you. Right. I’m going to go and dig something up. That’s what I do when I feel like this. It usually works.', mood: 'soft' },
    { who: 'dusty', text: 'Yours will go one day. All of them. Love them anyway. Love them harder because of it. That’s the whole trade, and it’s a good one.' },
    { who: 'narrator', text: 'Moss has come to sit by the flower. He doesn’t say anything either.' },
  ]),

  // ---------------------------------------------------------------- chapter 7
  S('c7-open', [
    { who: 'narrator', text: 'Sable sleeps near you now. Not next to you. Near. When you move in your sleep she wakes, every time.' },
    { who: 'luna', text: 'I found out where she came from. Corvin’s garden. He trains them with cold and with hunger. Food when they obey; nothing when they don’t. It works. It’s fast.', mood: 'angry' },
    { who: 'luna', text: 'Sable wouldn’t race. So she got nothing, for a long time. And then one night the gate was open.' },
    { who: 'luna', text: 'She chose you, you know. She could have gone anywhere. She watched this Grove for three nights and decided your hands looked slow enough.', mood: 'soft' },
    { who: 'narrator', text: 'Sable is watching you from the grass. Her little ball, still dark, bobs once.' },
  ]),
  S('c7-close', [
    { who: 'narrator', text: 'Sable walks up to you, in daylight, in front of everyone, and leans her whole weight against your shin.' },
    { who: 'clover', text: 'Oh. Oh, look at her.', mood: 'happy' },
    { who: 'luna', text: 'Still grey. Always will be. And look at her anyway.', mood: 'soft' },
    { who: 'sable', text: '…', mood: 'soft' },
    { who: 'narrator', text: 'The dark ball above her head flickers, just for a moment, with something that might be a heart.' },
  ]),

  // ---------------------------------------------------------------- chapter 8
  S('c8-open', [
    { who: 'moss', text: 'The Hollow. Past the falls, past where the paths stop. Hazel went in with a lantern and a bag of fruit and the stubborn chin.' },
    { who: 'nova', text: 'Nova. I go places. The Hollow is where the lost ones end up: strays, runaways, the ones people stopped feeding. Hazel’s been feeding them. For a year.', mood: 'think' },
    { who: 'nova', text: 'I’ve seen her. From a distance. She didn’t wave. She was busy. She looked… small.' },
    { who: 'nova', text: 'Take a Nubbin that trusts you and go. Not to bring her back. Just to see. Take fruit. Take more fruit than that.' },
  ]),
  S('c8-close', [
    { who: 'narrator', text: 'You didn’t find her. You found a camp: a cold fire, a dozen bowls, a dozen grey shapes watching from the trees, and on a flat stone, a notebook in her hand.' },
    { who: 'hazel', text: '“Day 300-something. Lost count. Fed nineteen today. The brown one let me touch her ear. Took two months. Worth it.”', mood: 'soft' },
    { who: 'hazel', text: '“The doctor said a year. I decided it would be a good one. I was right. I’m always right; it’s very tiring for everyone.”' },
    { who: 'hazel', text: '“If my grandchild reads this: I’m not sorry. I’m sorry you had to find out this way. Both are true. Lift and push.”', mood: 'soft' },
    { who: 'narrator', text: 'Your Nubbin puts its head on your knee and keeps it there until you can stand up.' },
  ]),

  // ---------------------------------------------------------------- chapter 9
  S(
    'c9-open',
    [
      { who: 'narrator', text: 'Corvin’s garden is clean, square and silent. Thirty grey Nubbins in thirty grey rows. Not one of them is touching another.' },
      { who: 'corvin', text: 'You came. Good. Look at the results. Not one of them has ever thrown a race, bitten a judge, or run off into the night. Yours can’t say that.' },
      { who: 'ember', text: 'Ash is in the third row. She won’t look at me. You did that.', mood: 'angry' },
      { who: 'corvin', text: 'I made her a champion, Ember. You made her a pet. One of those lasts.' },
      { who: 'narrator', text: 'Ember’s hands are shaking. Corvin’s are not. Thirty pairs of eyes watch you, and wait for the next bad thing.' },
    ],
    {
      choices: [
        {
          id: 'confront',
          label: 'Tell him what Hazel wrote. Make him look at them.',
          set: { corvin: 'reconciled' },
          friendship: { ember: 3, luna: 2 },
          then: [
            { who: 'narrator', text: 'You read him the notebook. Day 300-something. The brown one let me touch her ear. Took two months. Worth it.' },
            { who: 'corvin', text: '…She said that to me once. “Took two months. Worth it.” I told her I didn’t have two months. I was twenty-two. I had nothing but months.', mood: 'sad' },
            { who: 'narrator', text: 'He looks at the third row for a long time. Then he opens the gate, and does not close it.' },
            { who: 'corvin', text: 'Tell Ember Ash can go. Tell her I never made it quicker. I only made it quieter.' },
          ],
        },
        {
          id: 'bargain',
          label: 'Buy Ash back. Whatever it costs.',
          set: { corvin: 'bargained', boughtBack: true },
          friendship: { ember: 5 },
          then: [
            { who: 'corvin', text: 'Two hundred. The same as always. A fair price for a champion who no longer wins.' },
            { who: 'narrator', text: 'You pay. Ash walks out beside Ember without looking at either of you. She is grey, and she is going home, and both are true.' },
            { who: 'ember', text: 'I don’t know how to thank you. I’ll figure it out. Give me a few years.', mood: 'soft' },
          ],
        },
        {
          id: 'force',
          label: 'Open every pen. Now.',
          set: { corvin: 'forced', freedByForce: true },
          friendship: { ember: 2, marina: -2, fern: -2 },
          then: [
            { who: 'narrator', text: 'You throw the latches. Thirty grey Nubbins do not move. They have never been told they could.' },
            { who: 'narrator', text: 'Then Ash takes one step. Then all of them, a grey tide pouring out past Corvin and into the trees, into the Hollow, into the dark.' },
            { who: 'corvin', text: 'You think you freed them. You scattered them. Half will starve. Hazel would have fed them one at a time for a year. You had an afternoon.', mood: 'angry' },
            { who: 'ember', text: 'She looked at me. On her way past. She looked at me.', mood: 'soft' },
          ],
        },
      ],
    },
  ),
  S('c9-close', [
    { who: 'marina', text: 'Whatever you did up there, the valley is talking about it. Fern says it was brave. Byte says it was statistically unwise. Both of them are right about most things.' },
    { who: 'narrator', text: 'Sable is waiting at the gate when you get back. She has never waited at the gate before.' },
  ]),

  // ---------------------------------------------------------------- chapter 10
  S('c10-open', [
    { who: 'narrator', text: 'Moss has not come down the hill today. When you climb up, he is sitting exactly where he sat the first day, and he is a little harder to see.' },
    { who: 'moss', text: 'Eternals don’t age. We fade. We are made of being remembered, and the ones who remembered me best are mostly flowers now.', mood: 'soft' },
    { who: 'moss', text: 'Lanterns help. Not the light. The gathering. Light the four, get them all here, and let me look at a Grove full of people one more time. I’ll decide after.' },
    { who: 'byte', text: 'Statistically, an Eternal that has been petted regularly fades 60% slower. I ran the numbers. I would like it noted that I ran them while believing it was a hoax.', mood: 'think' },
  ]),
  S('c10-close', [
    { who: 'narrator', text: 'Four lanterns. Ten Keepers. Thirty-one Nubbins, one of them grey, one of them so old he is nearly made of light.' },
    { who: 'moss', text: 'Hazel stood there. You stand there. The chin is the same. The hands are slower. That’s better, actually.', mood: 'soft' },
    { who: 'moss', text: 'I’ve decided. I’ll stay a while. Someone has to tell the pale one about his shoelaces.' },
    { who: 'byte', text: 'They are TIED.' },
    { who: 'moss', text: 'Are they.' },
    { who: 'narrator', text: 'Byte looks down. The whole Grove laughs, and the lanterns burn until morning, and on the hill a second lantern you did not light is coming slowly down the path.' },
  ]),

  // ---------------------------------------------------------------- chapter 11
  S('c11-open', [
    { who: 'narrator', text: 'She is smaller than you remember. Everyone is, eventually. She has a lantern in one hand and a very thin grey Nubbin asleep in the crook of the other arm.' },
    { who: 'hazel', text: 'You lit the lanterns. I could see them from the Hollow. I thought: either that’s my grandchild, or Sparks has finally blown the whole place up.', mood: 'happy' },
    { who: 'hazel', text: 'I’m not staying long. The doctor gave me a year and I’ve had fourteen months, which I will be mentioning to him. But I wanted to see you do it. Keep them. Properly.' },
    { who: 'hazel', text: 'Go and talk to the others. All of them. A Grove isn’t the Nubbins, love. It’s the people who show up when the lanterns are lit.', mood: 'soft' },
  ]),
  S('c11-close', [
    { who: 'hazel', text: 'Good. They like you. Sparks likes everyone, that doesn’t count, but Ember likes you, and Ember doesn’t like anyone. I’m not even sure Ember likes Ember.' },
    { who: 'hazel', text: 'Sit with me. Here. By the pond. Don’t say anything.', mood: 'soft' },
    { who: 'narrator', text: 'You sit. The thin grey Nubbin in her arm wakes, looks at you, and goes back to sleep. Moss sits on her other side. Nobody says anything. It is the best part.' },
    { who: 'hazel', text: 'Tomorrow I want to see the whole Grove. Then I’m going to go up the hill and have a very long sit-down, and you are not to be dramatic about it.' },
  ]),

  // ---------------------------------------------------------------- chapter 12
  S(
    'c12-open',
    [
      { who: 'narrator', text: 'Morning. Every Keeper is here. Every Nubbin. Hazel stands by the pond in the place where she doesn’t say anything, and waits for you to.' },
      { who: 'hazel', text: 'It’s yours now. Properly. So tell me. What is it going to be?', mood: 'soft' },
    ],
    {
      choices: [
        {
          id: 'keep',
          label: 'A home. For all of them. I’ll keep the gate stuck.',
          set: { finalChoice: 'keep' },
          then: [{ who: 'hazel', text: 'Lift and push. Good.', mood: 'happy' }],
        },
        {
          id: 'free',
          label: 'Open. No gate. They stay if they want to.',
          set: { finalChoice: 'free', letThemGo: true },
          then: [
            { who: 'hazel', text: '…That’s not how I did it. It might be how it should be done. Go on, then. Let’s see who stays.', mood: 'think' },
          ],
        },
      ],
    },
  ),
  S('c12-close', [{ who: 'narrator', text: '…' }]),

  // ---------------------------------------------------------------- triggered scenes
  S('t-first-shadow', [
    { who: 'narrator', text: 'Your Nubbin has gone grey. The ball above its head is dark. When you reach for it, it flinches away from your hand.' },
    { who: 'luna', text: 'That’s on you. I’m not going to pretend it isn’t. Too many throws, or too many hungry nights, or both.', mood: 'angry' },
    { who: 'luna', text: 'It doesn’t come back from grey. It can come back from scared. Slowly. If you’re patient every single day and never once aren’t.', mood: 'soft' },
  ]),
  S('t-ran-away', [
    { who: 'narrator', text: 'The long grass at the edge of the Grove is pressed flat where something small pushed through it, and the gate is swinging.' },
    { who: 'fern', text: 'It’s gone. They do that, when they’ve decided nothing here is worth staying for. It might come back. They sometimes do, to the edge, to see if anything’s changed.', mood: 'sad' },
  ]),
  S('t-stray-returned', [
    { who: 'narrator', text: 'Something grey is sitting at the very edge of the Grove, in the long grass, not coming in. Watching the gate. Watching you.' },
    { who: 'clover', text: 'Oh. Oh, they came back. Slowly, now. Fruit on the ground. Sit. Wait. You know how.', mood: 'soft' },
  ]),
  S('t-sable-bonded', [
    { who: 'narrator', text: 'Sable climbs into your lap. All the way in. She is grey and she is heavy and she is warm, and the ball above her head is a small dark heart.' },
    { who: 'luna', text: 'There. That’s what they can’t see at the Circuit. Grey and loved. Both at once.', mood: 'soft' },
  ]),
  S('t-moss-first-pet', [
    { who: 'moss', text: 'Careful. I am very old and I bruise like fruit.' },
    { who: 'moss', text: '…No, don’t stop.', mood: 'soft' },
  ]),
  S('t-talk-generic', [{ who: 'narrator', text: 'A nod, a smile, a few words about the weather. It helps.' }]),

  // ---------------------------------------------------------------- endings
  S('end-hazels-grove', [
    { who: 'narrator', text: 'HAZEL’S GROVE' },
    { who: 'narrator', text: 'The gate sticks. Everyone who matters knows to lift and push. Corvin comes on Sundays and sits by the pond and says nothing, badly, but he is learning.' },
    { who: 'narrator', text: 'Hazel had her long sit-down on the hill in the spring. There is a flower there that Moss will not let anyone step near.' },
    { who: 'narrator', text: 'Sable sleeps on your feet. Grey as ash. Heart above her head. Both at once, forever.' },
    { who: 'hazel', text: 'Told you. Love is a method.', mood: 'happy' },
  ]),
  S('end-eternal-dawn', [
    { who: 'narrator', text: 'ETERNAL DAWN' },
    { who: 'narrator', text: 'One of yours has stopped aging. Moss looked at it for a long time, and then at you, and then went up the hill and sat down with Hazel, and did not come back.' },
    { who: 'moss', text: 'Someone has to remember the pale one’s shoelaces. It isn’t going to be me forever. Good. That’s good.', mood: 'soft' },
    { who: 'narrator', text: 'The new Eternal sits where Moss sat, and watches the gate, and will not come down until it decides you are worth it. It already has.' },
  ]),
  S('end-shadow-keeper', [
    { who: 'narrator', text: 'THE SHADOW’S KEEPER' },
    { who: 'narrator', text: 'Corvin closed the Circuit and went somewhere nobody asks about. Ember never forgave him. You never asked her to.' },
    { who: 'narrator', text: 'Grey Nubbins find their way to your gate now. Word gets around, in whatever way word gets around among creatures that do not speak.' },
    { who: 'narrator', text: 'Sable meets each one at the edge and sits with it. She does not come closer. She does not run. She shows them how.' },
  ]),
  S('end-moss-sleeps', [
    { who: 'narrator', text: 'MOSS SLEEPS' },
    { who: 'narrator', text: 'There was no fourth lantern night. Moss went up the hill one evening a little harder to see than the evening before, and in the morning he was a shape in the grass that the wind went through.' },
    { who: 'narrator', text: 'Sable carries his ball now. Nobody knows how. It floats above hers, pale and small, and sometimes, when the lanterns are lit, it flickers.' },
    { who: 'luna', text: 'He’s not gone. He’s just remembered by fewer people. That’s all fading is. Remember him louder.', mood: 'soft' },
  ]),
  S('end-wild-grove', [
    { who: 'narrator', text: 'WILD GROVE' },
    { who: 'narrator', text: 'You took the gate off its hinges. Some stayed. Most didn’t. The grey ones you scattered from Corvin’s garden come and go through the Hollow, and you leave fruit, and some of it is eaten.' },
    { who: 'narrator', text: 'Hazel went with you, the first few trips. Then she went up the hill. You go to the Hollow alone now, with a lantern and a bag of fruit and the stubborn chin.' },
    { who: 'nova', text: 'I saw you out there. You didn’t wave. You were busy. You looked… like her.', mood: 'soft' },
  ]),
  S('end-empty-lantern', [
    { who: 'narrator', text: 'THE EMPTY LANTERN' },
    { who: 'narrator', text: 'Sable never came back. Luna still leaves fruit at the edge every night. Some mornings it is gone, and nobody says anything about who might have taken it.' },
    { who: 'narrator', text: 'Hazel did not come down the hill. You lit the lanterns anyway. Three of them, and one left dark, by the long grass, for anyone who might be watching from it.' },
    { who: 'hazel', text: '“When you don’t know what to do, sit down next to them and wait.” You are still waiting. That counts. That counts for a lot.', mood: 'soft' },
  ]),
  S('end-collector', [
    { who: 'narrator', text: 'THE COLLECTOR' },
    { who: 'narrator', text: 'Two hundred Shells buys a lot of eggs. They hatch, and they are fast, and they are grey by autumn, every one.' },
    { who: 'narrator', text: 'Moss went up the hill the day the second one went grey. He didn’t say anything. He didn’t need to.' },
    { who: 'corvin', text: 'I told you. Everyone sells, eventually. I’m almost sorry I was right.', mood: 'think' },
    { who: 'narrator', text: 'The gate opens by itself now. It has stopped sticking. You find that you miss it.' },
  ]),
  S('end-long-road', [
    { who: 'narrator', text: 'THE LONG ROAD' },
    { who: 'narrator', text: 'Sable is still here. Still grey. Still two steps away, never one. She eats what you leave and sleeps near, not next to.' },
    { who: 'narrator', text: 'Hazel said two months for an ear. It has been longer than that. You sit down next to her every evening and wait, and you have stopped counting, which Hazel says is the point.' },
    { who: 'clover', text: 'She stayed. Out of the whole valley, she picked this Grove and she stayed. Don’t you dare call that nothing.', mood: 'soft' },
  ]),
];

export const ENDINGS: Record<string, { title: string; how: string }> = {
  'hazels-grove': {
    title: 'Hazel’s Grove',
    how: 'Bond with Sable (trust 70+), confront Corvin with Hazel’s notebook in chapter 9, keep Moss loved (affection 40+ by chapter 10), never sell a Nubbin, and choose “a home” at the end.',
  },
  'eternal-dawn': {
    title: 'Eternal Dawn (secret)',
    how: 'Raise one of your own Nubbins to Eternal during the campaign: two rebirths, then a Normal-type evolution with a strong alignment. Sable must still be with you.',
  },
  'shadow-keeper': {
    title: 'The Shadow’s Keeper',
    how: 'Bond with Sable, but do not reconcile with Corvin: buy Ash back or open the pens by force in chapter 9.',
  },
  'moss-sleeps': {
    title: 'Moss Sleeps',
    how: 'Bond with Sable, but let Moss fade: leave his affection under 40 when chapter 10 begins.',
  },
  'wild-grove': {
    title: 'Wild Grove',
    how: 'Open the pens by force in chapter 9, then choose “open, no gate” at the end.',
  },
  'empty-lantern': {
    title: 'The Empty Lantern',
    how: 'Lose Sable: let her trust fall under 5 for ten minutes so she runs away, and do not take her back in before the end.',
  },
  collector: {
    title: 'The Collector',
    how: 'Sell your Nubbin to Corvin in chapter 2 and never buy anyone back.',
  },
  'long-road': {
    title: 'The Long Road',
    how: 'Reach the end with Sable still with you but not yet bonded (trust under 70). The default ending.',
  },
};

export const STORY_TEXT = {
  campaign: 'Campaign',
  freeGrove: 'Free Grove',
  title: 'Hazel’s Grove',
  tagline: 'A story about slow hands.',
  newCampaign: 'New campaign',
  continueCampaign: 'Continue campaign',
  continueGrove: 'Continue Grove',
  newGrove: 'New Grove',
  chooseKeeper: 'Choose your Keeper',
  journal: 'Journal',
  chapter: (n: number, title: string) => `Chapter ${n}: ${title}`,
  goal: 'Goal',
  hint: 'Hint',
  paths: 'Paths',
  pathsHelp: 'Eight endings. Here is how to reach each one.',
  reached: 'Reached',
  friends: 'Friends',
  trust: 'Trust',
  shadow: 'Shadow',
  bonded: 'Bonded',
  stray: 'Stray',
  tapToContinue: 'Tap to continue',
  theEnd: 'The End',
  endingReached: (title: string) => `Ending: ${title}`,
  playOn: 'Keep playing',
  chapterStarted: (n: number, title: string) => `Chapter ${n}: ${title}`,
  turnedShadow: (name: string) => `${name} has gone Shadow.`,
  shadowBonded: (name: string) => `${name} loves you again.`,
  ranAway: (name: string) => `${name} has run away.`,
  strayReturned: (name: string) => `${name} is back at the edge of the Grove.`,
  lanternLit: 'Lantern lit',
  talkedTo: (name: string) => `You talked with ${name}.`,
  newGroveConfirm: 'Erase the Free Grove and start a new one?',
  resetCampaign: 'Reset campaign',
  resetCampaignConfirm: 'Erase the campaign and start the story over?',
} as const;
