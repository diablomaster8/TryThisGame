/**
 * R0297 (FUN-08): two-line exchanges when two Keepers pass in the Grove. Each pair has a handful
 * of short, dry exchanges: a setup, then a payoff. Chapter gates keep a Keeper from chatting
 * before they have arrived in the story. Jokes stop at chapter 8; chapters 9 to 11 (the Long Night
 * and the days after) have quiet exchanges only, and chapter 12 brings warm callbacks.
 * Nubbins and Moss never speak, and nobody here is new.
 */
export interface ChatterLine {
  who: string;
  text: string;
}
export interface ChatterExchange {
  /** Hazel’s Grove chapter range it can play in (inclusive). */
  minChapter: number;
  maxChapter?: number;
  lines: readonly [ChatterLine, ChatterLine];
}
/** By pair key: the two trainer ids sorted alphabetically and joined with '|', e.g. 'fern|sparks'. */
export const CHATTER: Record<string, readonly ChatterExchange[]> = {
  'fern|sparks': [
    {
      minChapter: 1,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'I made the pear tree a lantern.' },
        { who: 'fern', text: 'It’s a pear tree, Sparks. It already has a job.' },
      ],
    },
    {
      minChapter: 1,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'There’s a scorch mark on my fence.' },
        { who: 'sparks', text: 'That’s a tan. Fences tan.' },
      ],
    },
    {
      minChapter: 1,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'Why is your stone in a wheelbarrow?' },
        { who: 'fern', text: 'It’s being driven to a better view. Don’t tell it.' },
      ],
    },
    {
      minChapter: 1,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'Please don’t light anything near the beans.' },
        { who: 'sparks', text: 'Define near.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'sparks', text: 'I brought extra wicks, Fern. Just in case.' },
        { who: 'fern', text: 'Thank you. Put them by the stone. It likes company.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'fern', text: 'Your lanterns held all night.' },
        { who: 'sparks', text: 'I know. I checked them seventeen times. Eighteen.' },
      ],
    },
  ],
  'marina|sparks': [
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'Rule four, Sparks.' },
        { who: 'sparks', text: 'I haven’t done anything yet.' },
      ],
    },
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'New rule: don’t be Marina.' },
        { who: 'marina', text: 'You can’t make rules. You’ve never read mine.' },
      ],
    },
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'Don’t run on the wet rocks.' },
        { who: 'sparks', text: 'I’m not running. I’m falling very fast on purpose.' },
      ],
    },
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'Can you make the pond faster?' },
        { who: 'marina', text: 'It’s water, Sparks. It goes at the speed of water.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'marina', text: 'Sit with me a minute, Sparks.' },
        { who: 'sparks', text: 'Sitting. Not even tapping my foot.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'marina', text: 'The tide came back.' },
        { who: 'sparks', text: 'It always does. You said. Don’t quote me at me.' },
      ],
    },
  ],
  'byte|sparks': [
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'Your lap time was optimistic.' },
        { who: 'sparks', text: 'My legs were optimistic. They were right.' },
      ],
    },
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'Byte, why four stopwatches?' },
        { who: 'byte', text: 'One is for timing the others.' },
      ],
    },
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'Your lap was eleven seconds.' },
        { who: 'sparks', text: 'It felt like nine.' },
      ],
    },
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'How fast was I?' },
        { who: 'byte', text: 'Stopwatch one says fast. Stopwatch two says “really?”' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'sparks', text: 'Walk the lanterns with me, Byte?' },
        { who: 'byte', text: 'I’ll bring the stopwatches. Switched off.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'byte', text: 'Stopwatch two says you’re improving.' },
        { who: 'sparks', text: 'Stopwatch two is my favourite.' },
      ],
    },
  ],
  'clover|fern': [
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'Clover, your scarf is in my bean row.' },
        { who: 'clover', text: 'Is it? It was behind me a minute ago.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'Have you eaten, dear?' },
        { who: 'fern', text: 'I’ve had half a pear and an argument.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'Clover, my stone is wearing a hat.' },
        { who: 'clover', text: 'It looked chilly. It’s a good stone.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'The hens look cold. Shall I knit them something?' },
        { who: 'fern', text: 'They look smug. They’re fine.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'fern', text: 'I’ve baked too much again.' },
        { who: 'clover', text: 'Then we’ll sit and eat it, and nobody counts.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'fern', text: 'Your scarf has reached the gate.' },
        { who: 'clover', text: 'It’s keeping the draught out. Probably.' },
      ],
    },
  ],
  'dusty|nova': [
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'dusty', text: 'Your map’s upside down.' },
        { who: 'nova', text: 'It’s the right way up. The Grove is wrong.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'dusty', text: 'Where did you find that spoon?' },
        { who: 'nova', text: 'Three valleys away.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'How old is that rock?' },
        { who: 'dusty', text: 'Older than you. Ruder than Sparks.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'dusty', text: 'Where are you off to?' },
        { who: 'nova', text: 'Somewhere. I’ll know when I’m there.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'nova', text: 'I’ve walked through longer nights than this.' },
        { who: 'dusty', text: 'Good. Walk this one next to me.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'dusty', text: 'You came back.' },
        { who: 'nova', text: 'I always do. It’s a flaw in my map.' },
      ],
    },
  ],
  'ember|luna': [
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'Luna, you’re asleep on the sparring mat.' },
        { who: 'luna', text: 'It’s the only soft thing you own.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'luna', text: 'Why are you glaring at the scarecrow?' },
        { who: 'ember', text: 'He knows what he did.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'Spar with me at noon.' },
        { who: 'luna', text: 'I’ll lose at moonrise. It’s more civilised.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'I think the scarecrow cheats.' },
        { who: 'luna', text: 'I watched it all night. It never moved. Suspicious.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'ember', text: 'Can I sit by your moonflowers?' },
        { who: 'luna', text: 'Of course. I’ll stay up with you.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'ember', text: 'You stayed up for the sunrise?' },
        { who: 'luna', text: 'Overrated. I’d go again.' },
      ],
    },
  ],
  'byte|pixel': [
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'My shoelace is undone.' },
        { who: 'pixel', text: 'It was undone at our wedding.' },
      ],
    },
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'pixel', text: 'The robot wandered off again.' },
        { who: 'byte', text: 'I know. It took stopwatch three with it.' },
      ],
    },
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'Your clock is four minutes fast.' },
        { who: 'pixel', text: 'It’s not fast. It’s early.' },
      ],
    },
    {
      minChapter: 4,
      maxChapter: 8,
      lines: [
        { who: 'pixel', text: 'I improved the kettle.' },
        { who: 'byte', text: 'Pixel, it now plays a tune.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'byte', text: 'I’ve left the workshop light on.' },
        { who: 'pixel', text: 'I saw it from the lane. Good.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'pixel', text: 'Your lace is undone.' },
        { who: 'byte', text: 'I know. Leave it. It’s tradition.' },
      ],
    },
  ],
  'clover|marina': [
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'Marina, have you eaten?' },
        { who: 'marina', text: 'I had a crab. It was in my boot.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'Clover, your scarf is in the tide pool.' },
        { who: 'clover', text: 'Oh no. Is it?' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'Do you need a blanket?' },
        { who: 'marina', text: 'I’m wet, Clover.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'Everyone needs a rule.' },
        { who: 'clover', text: 'Mine is biscuits first.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'clover', text: 'Come in and sit. The tide can manage itself.' },
        { who: 'marina', text: 'It always does. I’m still learning that.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'marina', text: 'Your scarf made it to the ledge.' },
        { who: 'clover', text: 'Did it? I thought I’d run out of wool.' },
      ],
    },
  ],
  'ember|sparks': [
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'I’m on a losing streak against the scarecrow.' },
        { who: 'sparks', text: 'Sir? I’d lose to Sir.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'Sparks, why is the scarecrow smoking?' },
        { who: 'sparks', text: 'Test fire. He took it well.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'sparks', text: 'Race you to the dojo.' },
        { who: 'ember', text: 'Twenty press-ups first.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'You hit the scarecrow with a lantern.' },
        { who: 'sparks', text: 'It was loose.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'sparks', text: 'I’m not racing tonight.' },
        { who: 'ember', text: 'Me neither. I’ll walk with you.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'ember', text: 'I beat the scarecrow.' },
        { who: 'sparks', text: 'Did he let you?' },
      ],
    },
  ],
  'fern|marina': [
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'There’s a bucket in my bean row. It says Marina.' },
        { who: 'marina', text: 'Then it’s a very well-travelled bucket.' },
      ],
    },
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'Is it true you water at five past noon?' },
        { who: 'fern', text: 'Hazel said never at noon. She didn’t say five past.' },
      ],
    },
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'How’s the pear tree?' },
        { who: 'fern', text: 'Still not speaking to me.' },
      ],
    },
    {
      minChapter: 2,
      maxChapter: 8,
      lines: [
        { who: 'marina', text: 'Whose pie is that on your sill?' },
        { who: 'fern', text: 'No idea. It’s excellent, though.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'marina', text: 'You’re up late, Fern.' },
        { who: 'fern', text: 'Baking. It’s something to do with my hands.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'marina', text: 'The tide pools are full again.' },
        { who: 'fern', text: 'So are the beans. We’re both showing off.' },
      ],
    },
  ],
  'luna|nova': [
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'Luna, is it morning?' },
        { who: 'luna', text: 'I wouldn’t know. I’ve been resting my eyes.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'I walked all night to see the dawn.' },
        { who: 'luna', text: 'Why? It comes anyway.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'Luna, which way is north?' },
        { who: 'luna', text: 'Towards the moonflowers. They face the moon.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'luna', text: 'Your boots are by my bench again.' },
        { who: 'nova', text: 'That’s where I left them. The other pair’s by the pond.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'nova', text: 'I’ll keep the late watch with you.' },
        { who: 'luna', text: 'Good. Somebody should. Two is better.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'luna', text: 'Stay till moonrise?' },
        { who: 'nova', text: 'Till moonrise. Then I’ll go the long way round.' },
      ],
    },
  ],
  'dusty|fern': [
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'dusty', text: 'Fern, I found a spoon in your beds.' },
        { who: 'fern', text: 'It’s mine. From Tuesday.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'Is that your trowel in my row?' },
        { who: 'dusty', text: 'It’s a dig site now. Very promising.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'dusty', text: 'May I examine your stone?' },
        { who: 'fern', text: 'It’s shy.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'fern', text: 'Tea?' },
        { who: 'dusty', text: 'If it’s in an ancient cup.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'dusty', text: 'I’ll dig the young beds over for you.' },
        { who: 'fern', text: 'Thank you. Mind the stone.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'dusty', text: 'That’s fourteen spoons.' },
        { who: 'fern', text: 'Are you building a picnic?' },
      ],
    },
  ],
  'byte|ember': [
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'Forty-one losses to the scarecrow. I logged them.' },
        { who: 'ember', text: 'Log this: I’ll make it forty-two.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'ember', text: 'Time me doing press-ups.' },
        { who: 'byte', text: 'Forty-nine in two minutes. Then a long sit.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'Your guard drops four centimetres on the left.' },
        { who: 'ember', text: 'Only the left? I’m improving.' },
      ],
    },
    {
      minChapter: 5,
      maxChapter: 8,
      lines: [
        { who: 'byte', text: 'Your sparring partner looks tired.' },
        { who: 'ember', text: 'He’s a scarecrow.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'byte', text: 'Want company at the gate?' },
        { who: 'ember', text: 'Yes. Don’t talk numbers.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'ember', text: 'How long was I out there?' },
        { who: 'byte', text: 'I stopped counting. First time ever.' },
      ],
    },
  ],
  'clover|luna': [
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'Luna, you’ve fallen asleep on the hatching shelf.' },
        { who: 'luna', text: 'It’s warm. I’m helping.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'luna', text: 'Is that a scarf or a river?' },
        { who: 'clover', text: 'It’s still a scarf. I think.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'You’ve missed breakfast again.' },
        { who: 'luna', text: 'I’m having it at moonrise. With the owls.' },
      ],
    },
    {
      minChapter: 3,
      maxChapter: 8,
      lines: [
        { who: 'clover', text: 'Would you watch the nursery tonight?' },
        { who: 'luna', text: 'I’m up anyway. Best-watched babies in the valley.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'clover', text: 'Did you sleep at all, dear?' },
        { who: 'luna', text: 'No. I thought I’d keep the night company.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'luna', text: 'Your scarf is longer than the night.' },
        { who: 'clover', text: 'That’s the plan. Shorter nights.' },
      ],
    },
  ],
  'nova|pixel': [
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'I found your robot two valleys over.' },
        { who: 'pixel', text: 'Again? It’s a good walker.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'pixel', text: 'Is your map a circuit?' },
        { who: 'nova', text: 'It’s a map. It’s upside down.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'Your compass points at your robot.' },
        { who: 'pixel', text: 'It’s version one. Everything points at the robot.' },
      ],
    },
    {
      minChapter: 6,
      maxChapter: 8,
      lines: [
        { who: 'nova', text: 'Brought you a spring from the far hills.' },
        { who: 'pixel', text: 'It’s a good spring. It’s going in my sock.' },
      ],
    },
    {
      minChapter: 9,
      maxChapter: 11,
      lines: [
        { who: 'pixel', text: 'I fixed your lamp. It’ll stay lit.' },
        { who: 'nova', text: 'Thank you. I’ll keep it close.' },
      ],
    },
    {
      minChapter: 12,
      lines: [
        { who: 'nova', text: 'Pixel, your robot’s wandered off again.' },
        { who: 'pixel', text: 'It’s learning. Eventually it wanders back.' },
      ],
    },
  ],
};
