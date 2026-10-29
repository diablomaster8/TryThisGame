/**
 * R0296 (FUN-07): each Keeper's daily antics in the Grove. A story day (two minutes of sim
 * time) picks three of a Keeper's stations; they walk to each in turn, do their bit there
 * (the icon is the prop gag in the bubble) and say one of its lines. Stations are spots in
 * the Grove's ground plan; the sim moves the spot to open ground if it is blocked. `night`
 * stations are only used at night, `day` ones only by day.
 */
export interface RoutineStation {
  id: string;
  x: number;
  z: number;
  icon: string;
  lines: readonly string[];
  when?: 'day' | 'night';
}

export const ROUTINES: Record<string, readonly RoutineStation[]> = {
  fern: [
    {
      id: 'pear',
      x: -6,
      z: -4,
      icon: '🍐',
      lines: ['Sorry about earlier, pear tree.', 'There. Now we’re square, you and me.'],
    },
    {
      id: 'stone',
      x: 2.4,
      z: 20.4,
      icon: '🪨',
      lines: ['Just checking on my stone. It’s fine. It’s a stone.', 'Still the best one.'],
    },
    {
      id: 'weeds',
      x: -9,
      z: 2,
      icon: '🌱',
      lines: ['That’s not a weed. That’s a decision.', 'I’ll leave this one. It looks hopeful.'],
    },
    {
      id: 'pond',
      x: -1,
      z: 5.5,
      icon: '🐸',
      lines: ['Good morning, frog.', 'The frog says hello. I’m almost sure.'],
    },
  ],
  sparks: [
    {
      id: 'fourth-lantern',
      x: -7.2,
      z: -5,
      icon: '⚡',
      lines: ['That flash was meant to be blue.', 'My eyebrows are fine. Thank you for asking.'],
    },
    {
      id: 'stream-lantern',
      x: 4.8,
      z: -2,
      icon: '🏮',
      lines: ['This one only singed me a bit.', 'Lit first try. Nobody saw it.'],
    },
    {
      id: 'well',
      x: -3,
      z: 9,
      icon: '🪣',
      lines: ['Race you to the well! Oh. I’m already here.', 'I win.'],
    },
  ],
  byte: [
    {
      id: 'timing',
      x: 0,
      z: 3,
      icon: '⏱',
      lines: ['Eleven seconds to cross the grass. Personal best.', 'Again. That one blinked.'],
    },
    {
      id: 'shoelace',
      x: -8,
      z: -12,
      icon: '👟',
      lines: ['Timing how long a shoelace stays tied.', 'Four minutes. A record, for me.'],
    },
    {
      id: 'gate',
      x: 3.6,
      z: 19.5,
      icon: '⏱',
      lines: ['The gate takes two pushes. I’ve timed both.', 'Lift and push: 3.4 seconds.'],
    },
  ],
  marina: [
    {
      id: 'bucket',
      x: 1.5,
      z: 6,
      icon: '🪣',
      lines: ['That puddle is not for splashing in.', 'Fine. It’s for splashing in.'],
    },
    {
      id: 'shore',
      x: 12,
      z: 6,
      icon: '🌊',
      lines: ['Rule four. Don’t be Sparks.', 'The water’s lovely. Don’t tell Sparks.'],
    },
    {
      id: 'reeds',
      x: -3.5,
      z: 2,
      icon: '🌾',
      lines: [
        'The reeds want cutting back. The reeds disagree.',
        'Something just swam past my boot.',
      ],
    },
  ],
  dusty: [
    {
      id: 'dig',
      x: -12,
      z: 6,
      icon: '🥄',
      lines: ['Ancient.', 'Another one. Also ancient.'],
    },
    {
      id: 'wall',
      x: 9.5,
      z: 9,
      icon: '🔍',
      lines: ['This stone has been here a very long time.', 'So has that one. I’m making a list.'],
    },
    {
      id: 'hill',
      x: -14,
      z: 12,
      icon: '🦴',
      lines: ['A bone. No. A stick. An ancient stick.', 'Everything’s old if you wait.'],
    },
  ],
  pixel: [
    {
      id: 'robot',
      x: 3,
      z: -9,
      icon: '🤖',
      lines: ['Come back! You don’t even like grass!', 'It always goes left. Why does it go left?'],
    },
    {
      id: 'shed',
      x: 6,
      z: -2.6,
      icon: '🔧',
      lines: ['One more screw and it’ll stop squeaking.', 'Now it squeaks in a different key.'],
    },
    {
      id: 'path',
      x: 0,
      z: 12,
      icon: '🤖',
      lines: ['There you are.', 'It found a beetle. They’re friends now.'],
    },
  ],
  clover: [
    {
      id: 'knit',
      x: -10,
      z: 4,
      icon: '🧣',
      lines: ['Just one more row.', 'It’s not too long. The Grove is too short.'],
    },
    {
      id: 'blankets',
      x: -6.5,
      z: 9.5,
      icon: '🧺',
      lines: ['Blankets aired. Nubbins inspected.', 'Everyone warm? Everyone warm.'],
    },
    {
      id: 'soup',
      x: -2,
      z: 7,
      icon: '🍲',
      lines: ['Soup’s on later. It’s always on later.', 'Taste that. No, really.'],
    },
  ],
  ember: [
    {
      id: 'scarecrow',
      x: 13,
      z: -8,
      icon: '🥊',
      lines: ['Best of three. Again.', 'It didn’t move. That’s its whole technique.'],
    },
    {
      id: 'stretch',
      x: 10,
      z: -4,
      icon: '💪',
      lines: ['Stretch first. Always stretch first.', 'That’s ten. Probably ten.'],
    },
    {
      id: 'run',
      x: 6,
      z: 2,
      icon: '🏃',
      lines: ['Laps. For the legs.', 'Your Nubbins are faster than me. Good.'],
    },
  ],
  luna: [
    {
      id: 'bench',
      x: -13,
      z: 15,
      icon: '💤',
      lines: ['Zzz.', 'Five more minutes. Or hours.'],
      when: 'day',
    },
    {
      id: 'shade',
      x: -11,
      z: 10,
      icon: '💤',
      lines: ['Resting my eyes.', 'I’m awake. I’m listening. Zzz.'],
      when: 'day',
    },
    {
      id: 'stars',
      x: -8,
      z: 14,
      icon: '🌙',
      lines: ['Now it’s a proper time of day.', 'The owls and I have an arrangement.'],
      when: 'night',
    },
    {
      id: 'pond-night',
      x: -2,
      z: 7.5,
      icon: '✨',
      lines: ['The pond’s much better with stars in it.', 'Shh. The frogs are working.'],
      when: 'night',
    },
  ],
  nova: [
    {
      id: 'map',
      x: 17,
      z: 7,
      icon: '🗺',
      lines: ['The map says north is that way. The map is upside down.', 'Found it. Wait. No.'],
    },
    {
      id: 'ridge',
      x: 15,
      z: 13,
      icon: '🧭',
      lines: ['This compass is very sure of itself.', 'I’m not lost. I’m early somewhere else.'],
    },
    {
      id: 'gate-wrong',
      x: 5,
      z: 18,
      icon: '🗺',
      lines: ['This is definitely the way to the ridge.', 'It’s the gate. I meant the gate.'],
    },
  ],
};
