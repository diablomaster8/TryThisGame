/**
 * Multiverse campaign: the Iron Man line (IM1–IM15), from the cave to the inverted
 * Superior Iron Man. Feeds Civil War (E1), Secret Wars (E2, through IM6) and
 * The Last Ultron (E6, through IM10 and IM12).
 *
 * Audience 'adult' throughout: the Multiverse campaign is never offered in the
 * Learning Grove, so there are no childLines here.
 *
 * Every line of dialogue is original: no comic or film lines, no catchphrases. Plots
 * follow the source beats in briefs/multiverse.md. Issue numbers in `source` are from
 * the brief and should be checked before ship.
 *
 * Darker material (IM5’s alcoholism, Stane’s death in IM7, the Five Nightmares
 * attacks in IM11, the Mandarin’s injury in IM9) is played straight and quiet: no
 * glamour, no lingering, nothing shown that the narrator does not need to say.
 *
 * Flags set by choices are prefixed `mv-im`. `mv-im7-suit` (IM7) is read by later
 * content. Cross-line requirements use quest codes, as the Doom line does (IM6 needs
 * FF2 and so on). IM10 and IM12 set `mv-unlock-ul7` and `mv-unlock-ul5`.
 */
import type { Quest, Speaker } from './types';
import type { Line, Mood, Scene } from '../config/story';

// ------------------------------------------------------------------ helpers

/** Narrator line. */
const n = (text: string): Line => ({ who: 'narrator', text });
/** Spoken line, with an optional portrait mood. */
const l = (who: string, text: string, mood?: Mood): Line =>
  mood ? { who, text, mood } : { who, text };
/** A source character. */
const sp = (id: string, name: string, basedOn?: string): Speaker =>
  basedOn ? { id, name, kind: 'other', basedOn } : { id, name, kind: 'other' };

const RIFT = 'The rift above the waterfall (Multiverse campaign)';

/** IM5: arriving at Hammer’s base, played after either raid choice. */
const IM5_HAMMER: Line[] = [
  n('Hammer’s base floats in open water: a town on stilts and pontoons, guarded by men in stolen gear.'),
  l('hammer', 'Mr Stark! And you’ve brought nannies. I was so hoping you’d come.', 'happy'),
  l('hammer', 'Your armour runs beautifully on my signal. Perhaps next time I’ll have it shake someone else’s hand.'),
  l('tony', 'You made me kill a man. With my own hand. You don’t get to be cheerful about that.', 'angry'),
  l('rhodey', 'Keeper, your Nubbins are small enough to reach the transmitter. We’ll keep his hired help busy.'),
];

// ------------------------------------------------------------------ speakers

const TONY = sp('tony', 'Tony Stark', 'Tony Stark, Iron Man (Marvel Comics)');
const YINSEN = sp('yinsen', 'Ho Yinsen', 'Ho Yinsen (Tales of Suspense #39)');
const WONGCHU = sp('wongchu', 'Wong-Chu', 'Wong-Chu (Tales of Suspense #39)');
const GUARD = sp('guard', 'Guard');
const PEPPER = sp('pepper', 'Pepper Potts', 'Virginia “Pepper” Potts, later Rescue (Marvel Comics)');
const VANKO = sp('vanko', 'Anton Vanko', 'Anton Vanko, the Crimson Dynamo (Marvel Comics)');
const MANDARIN = sp('mandarin', 'The Mandarin', 'The Mandarin (Marvel Comics)');
const BULLSKI = sp('bullski', 'Boris Bullski', 'Boris Bullski, the Titanium Man (Marvel Comics)');
const ANNOUNCER = sp('announcer', 'Announcer');
const BETHANY = sp('bethany', 'Bethany Cabe', 'Bethany Cabe (Marvel Comics)');
const RHODEY = sp('rhodey', 'Rhodey', 'James “Rhodey” Rhodes, later War Machine (Marvel Comics)');
const HAMMER = sp('hammer', 'Justin Hammer', 'Justin Hammer (Marvel Comics)');
const DOOM = sp('doom', 'Victor von Doom', 'Victor von Doom, Doctor Doom (Marvel Comics)');
const ARTHUR = sp('arthur', 'King Arthur', 'King Arthur as drawn in Iron Man #149–150 (Marvel Comics)');
const MORGAN = sp('morgan', 'Morgan le Fay', 'Morgan le Fay (Marvel Comics)');
const STANE = sp('stane', 'Obadiah Stane', 'Obadiah Stane, the Iron Monger (Marvel Comics)');
const STEVE = sp('steve', 'Steve Rogers', 'Steve Rogers, Captain America (Marvel Comics)');
const GUARDSMAN = sp('guardsman', 'Guardsman', 'The Guardsmen of the Vault (Marvel Comics)');
const FOOM = sp('foom', 'Fin Fang Foom', 'Fin Fang Foom (Marvel Comics)');
const MAYA = sp('maya', 'Maya Hansen', 'Maya Hansen (Iron Man vol. 4)');
const MALLEN = sp('mallen', 'Mallen', 'Mallen (Iron Man vol. 4, Extremis)');
const ZEKE = sp('zeke', 'Ezekiel Stane', 'Ezekiel Stane (Invincible Iron Man)');
const ARMOUR = sp('armour', 'The Armour', 'The sentient Iron Man armour (Iron Man vol. 3 #26–30)');
const JUSTINE = sp('justine', 'Justine Hammer', 'Justine Hammer (Marvel Comics)');
const SASHA = sp('sasha', 'Sasha Hammer', 'Sasha Hammer (Marvel Comics)');
const BACKUP = sp('backup', 'Tony (Backup)', 'Tony Stark’s backup mind in the armour (Iron Man: Hypervelocity)');
const AGENT = sp('agent', 'S.H.I.E.L.D. Agent');
const DAREDEVIL = sp('daredevil', 'Matt Murdock', 'Matt Murdock, Daredevil (Marvel Comics)');
const SUPERIOR = sp('superior', 'Superior Iron Man', 'Tony Stark, inverted (Superior Iron Man)');

// =================================================================== IRON MAN

export const MV_IRONMAN: Quest[] = [
  // ---------------------------------------------------------------- IM1
  {
    id: 'mv-im01',
    code: 'IM1',
    title: 'The Cave',
    source: 'Tales of Suspense #39',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Multiverse campaign started; first storyline of the Iron Man line.' },
    speakers: [TONY, YINSEN, WONGCHU, GUARD],
    steps: [
      {
        id: 'mv-im01-s1',
        goal: 'Help Yinsen and Tony plan a suit of armour in the cave.',
        hint: 'Talk to Yinsen at the workbench; he will show you which plates matter most.',
        check: 'talk:mv-yinsen',
        scene: {
          id: 'mv-im01-cave',
          lines: [
            n('The rift spits you out into hot dust and the smell of oil. Your Nubbins land on either side of you.'),
            n('A camp in the hills. Trucks, crates, men with rifles. Somewhere, a generator coughing.'),
            n('A guard shoves you into a cave lit by one bulb. Two men look up from a workbench.'),
            l('yinsen', 'More guests. Wong-Chu collects people now. Sit down, before they decide you are a problem.', 'think'),
            l('tony', 'Ignore the wires. They’re keeping me alive. Long story. Short version: a landmine, some shrapnel, bad luck.'),
            l('yinsen', 'A splinter of metal sits a finger’s width from his heart. The magnet holds it back. For now.'),
            l('tony', 'Tony Stark. I make weapons. Made. The man outside wants one, and he wants it this week.', 'sad'),
            l('wongchu', 'Build me the weapon, Mr Stark. While you build, the doctor eats. So do your little animals.', 'angry'),
            n('He leaves. By the door sits a crate of mortar shells, stencilled STARK INDUSTRIES.'),
            l('tony', 'Those are mine. He shells villages with my shells. I signed off on that fuse design over lunch.', 'sad'),
            l('yinsen', 'My village was at lunch when the shells came. Never mind. Guilt is heavy, and we have iron to lift.', 'soft'),
            l('yinsen', 'We could build what he asks. Or we could build something that walks out of here.', 'think'),
          ],
          choices: [
            {
              id: 'walk',
              label: 'Build the thing that walks.',
              set: { 'mv-im01-plan': 'walk' },
              then: [l('tony', 'A suit. Plates, motors, power off the same magnet. It’s mad. I like it.', 'happy')],
            },
            {
              id: 'time',
              label: 'Can it really be done in a week?',
              set: { 'mv-im01-plan': 'doubt' },
              then: [
                l('yinsen', 'No. So we will do it in five days.'),
                l('tony', 'He’s funny. Nobody warned me he was funny.'),
              ],
            },
            {
              id: 'decoy',
              label: 'Build him a real weapon. One that jams in a month.',
              set: { 'mv-im01-plan': 'decoy' },
              then: [
                l('tony', 'Safer for us. And every week it works, somebody in a village pays for it.', 'think'),
                l('yinsen', 'You see the problem. A clever weapon is still a weapon. Let us build the door instead.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im01-cave-done',
          lines: [
            l('yinsen', 'Chest plate first. Then the legs. A man who cannot run is only a statue.'),
            n('Tony sketches on the back of a weapons order. His hand shakes. He keeps going.'),
            n('Yinsen hums while he files, the same four notes, over and over. Your Nubbins start humming them too.'),
            l('tony', 'Great. Now it’s a choir. If we die, at least we die in harmony.'),
          ],
        },
      },
      {
        id: 'mv-im01-s2',
        goal: 'Carry the iron plates past the guards with your Power Nubbin.',
        hint: 'Move when the lamp turns away; a Nubbin with high Power carries two plates a trip.',
        check: 'minigame:clear:mv-cave-plates',
        scene: {
          id: 'mv-im01-plates',
          lines: [
            n('The iron is in the scrap yard past the guard post. The guards count everything that goes in or out.'),
            l('tony', 'Every plate has to look like weapon parts. Anything else, and they’ll know.'),
            l('yinsen', 'Your Nubbin is strong. It can carry what I cannot, and it is small enough to be overlooked.'),
            n('Your Power Nubbin pats a plate twice its size, as if checking whether it is ripe.'),
            n('Night falls. The guards change every forty minutes. That is your window.'),
            l('tony', 'Twelve plates. Six trips. Nobody gets shot. That’s the whole plan.'),
            n('Halfway across the yard, a torch swings round and lands on you.'),
            l('guard', 'You. What’s the animal carrying?', 'angry'),
          ],
          choices: [
            {
              id: 'bluff',
              label: 'It’s a mortar casing.',
              then: [
                l('guard', 'Hm. Ugly mortar.'),
                n('He waves you on. Your Nubbin does not breathe again until the corner.'),
              ],
            },
            {
              id: 'fruit',
              label: 'Offer him your fruit.',
              then: [
                n('He takes the fruit and forgets the question. Your Nubbin looks offended on the fruit’s behalf.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im01-plates-done',
          lines: [
            n('The last plate goes down on the workbench with a clang that makes everyone flinch.'),
            l('tony', 'That’s all of them. You did that. Your fuzzy friend did that.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-im01-s3',
        goal: 'Hold the cave tunnel until the armour is charged.',
        hint: 'Keep your Nubbins between the guards and the workbench; this bout is about lasting, not winning fast.',
        check: 'karate:survive:mv-cave-guards',
        scene: {
          id: 'mv-im01-charge',
          lines: [
            n('Day five. The armour stands in the corner like a stove with opinions.'),
            l('tony', 'It needs time to charge. Ninety seconds. Maybe more.'),
            n('Boots in the tunnel. A lot of them. Wong-Chu has heard the wrong kind of hammering.'),
            l('yinsen', 'Ninety seconds. I can buy that.', 'soft'),
            l('tony', 'No. Doc, no. We all walk out together. That was the deal.', 'shock'),
            l('yinsen', 'My family is gone, Tony. I have been waiting a long time to be useful. Let me be useful.', 'soft'),
            n('He walks into the tunnel before anyone can stop him, humming his four notes. Your Nubbins press against your legs.'),
            l('you', 'Tony. The charge.'),
            n('The needle crawls. Shouting from the tunnel, then the humming stops, and your Nubbins brace at the cave mouth.'),
            l('tony', 'Forty seconds. Come on, come on. I built this thing to be fast and it’s the slowest thing I’ve ever made.', 'angry'),
          ],
        },
        done: {
          id: 'mv-im01-charge-done',
          lines: [
            n('The needle reaches the end. The tunnel has gone quiet. Yinsen is lying near the entrance.'),
            n('Tony kneels in the armour, clumsy, and lifts his head as gently as the metal hands allow.'),
            l('yinsen', 'Go home, Tony. Make something better than weapons.', 'soft'),
            n('He is gone. Tony stays there longer than is safe. Nobody hurries him.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im01-complete',
      lines: [
        n('The armour walks out into daylight. The guards run. Wong-Chu runs fastest.'),
        n('Behind it, the ammunition dump goes up, and the hills echo for a long time.'),
        l('tony', 'He bought me ninety seconds. I’m going to spend the rest of my life making them worth it.', 'sad'),
        n('Your Nubbins hum four notes on the walk to the rift. Tony doesn’t ask them to stop.'),
        l('tony', 'Here. I made a spare when we were testing magnets. Wear it near your heart. It’s a tradition now.'),
        n('He presses a small iron pin shaped like the chest plate into your hand. It is still warm from the forge.'),
        n('The rift opens behind you. Your Nubbins look back at the cave once before they follow you through.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im01-chest-pin',
        kind: 'cosmetic',
        label: 'Chest-Plate Pin',
        description: 'A small iron pin shaped like Tony’s first chest plate. Worn on your Keeper’s coat.',
      },
      {
        id: 'mv-im01-lamp',
        kind: 'decor',
        label: 'Yinsen’s Lamp',
        description: 'The cave’s single bulb on a length of wire. It flickers, but it never goes out.',
      },
    ],
    sets: { 'mv-im01': true },
    notes:
      'The original is set in Vietnam; keep the setting to unnamed hills and a rebel camp, no flags or nationality. Step 2 is a stealth carry minigame ("mv-cave-plates"): a Power Nubbin is best but any Nubbin can finish with more trips. Step 3 is a survive bout of three short rounds; it cannot be lost outright, only lengthened. Yinsen’s death happens off-screen in the tunnel: show only him lying still in the done scene, no wound, and let the scene sit for two seconds of silence before the last line. Sound: the generator hum under the whole cave, cut it when the armour powers up. Check Tales of Suspense #39 beats before ship. ' +
      'SIGNATURE CHOICE: mv-im01-plan (walk | doubt | decoy) pays off through MV_IRONMAN_VARIANTS at mv-im04-duel-done (Tony’s answer to the cameras), mv-im08-captain (the rooftop argument with Steve) and mv-im15-return (what the Superior Tony still half remembers).',
  },

  // ---------------------------------------------------------------- IM2
  {
    id: 'mv-im02',
    code: 'IM2',
    title: 'The Crimson Dynamo',
    source: 'Tales of Suspense #46',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Cave (IM1).' },
    requires: ['IM1'],
    speakers: [TONY, PEPPER, VANKO],
    steps: [
      {
        id: 'mv-im02-s1',
        goal: 'Watch the plant from the rafters with your Fly Nubbin and spot the saboteur.',
        hint: 'Stay still on the girders; the saboteur only shows up when nothing moves.',
        check: 'minigame:clear:mv-rafters-watch',
        scene: {
          id: 'mv-im02-plant',
          lines: [
            n('Through the rift: a factory floor at night, conveyor belts stopped, sparks spitting from a fuse box.'),
            l('pepper', 'Third plant this month. Same thing every time. The power surges and the machines tear themselves apart.', 'think'),
            l('tony', 'And every time, someone on the news says Stark can’t keep the lights on. Lovely.'),
            l('pepper', 'The police think it’s an inside job. The insurers think it’s you.'),
            l('tony', 'It isn’t lightning and it isn’t me. Something walked in here and fed the line.'),
            n('Your Fly Nubbin is already looking up, past the lamps, into the steel rafters.'),
            l('tony', 'Your flier. Can it get up there without being seen? Whoever does this likes a view.'),
            l('pepper', 'Please don’t let it touch anything that hums.'),
          ],
          choices: [
            {
              id: 'quiet',
              label: 'Go up quietly and watch.',
              then: [n('Your Nubbin climbs the air like a ladder and folds itself into a shadow on a girder.')],
            },
            {
              id: 'bait',
              label: 'Leave the lights on as bait.',
              then: [
                l('tony', 'Bait. I approve. Normally I’m the bait.'),
                n('Your Nubbin settles in the dark above the brightest lamp and waits.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im02-plant-done',
          lines: [
            n('A red shape steps through the loading doors, gauntlets crackling. Your Nubbin squeaks once, loudly.'),
            l('tony', 'There you are. Big, red and conductive. Suit up, everybody.'),
          ],
        },
      },
      {
        id: 'mv-im02-s2',
        goal: 'Beat the Crimson Dynamo in a karate bout on the factory floor.',
        hint: 'Fight from the rubber mats; his shocks drain stamina only on bare metal.',
        check: 'karate:win:mv-crimson-dynamo',
        scene: {
          id: 'mv-im02-dynamo',
          lines: [
            l('vanko', 'Stark! Your factories fall to my science. Mine is the better armour, and soon the world will know it.', 'angry'),
            l('tony', 'The world is asleep. It’s three in the morning.'),
            n('Lightning arcs between Vanko’s fists. The floor lights up blue wherever it touches.'),
            l('tony', 'Everything he throws wants to go to ground. So we give it ground. Keep your Nubbins off the metal.'),
            n('There are rubber mats by the welding bay. Your Nubbins edge towards them.'),
            l('vanko', 'You are a little man in a tin. I have studied you.', 'angry'),
            l('tony', 'Did you study insulation? Asking for me.'),
            l('vanko', 'I was given this armour, a deadline, and a photograph of my mother’s flat. Do not joke at me.', 'angry'),
            n('Tony stops joking. For a second the two men in armour look at each other like colleagues.'),
            n('The coils on Vanko’s back are glowing too brightly. He hasn’t noticed.'),
          ],
        },
        done: {
          id: 'mv-im02-dynamo-done',
          lines: [
            n('Vanko’s armour overloads and dies with a long, sad whine. He sits down heavily on the conveyor.'),
            l('vanko', 'It does not matter. I have failed. They will not let me go home.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-im02-s3',
        goal: 'Stand watch at the plant gate until the car without lights leaves.',
        hint: 'Keep a Nubbin with high Stamina by the gate; the car leaves once it sees it is being watched.',
        check: 'guard:mv-plant-gate',
        scene: {
          id: 'mv-im02-defect',
          lines: [
            l('tony', 'What do you mean, they won’t let you go home?'),
            l('vanko', 'Men who fail are a lesson to the next men. My government has already sent the lesson.', 'sad'),
            n('A car without headlights has stopped outside the plant gates. Nobody gets out.'),
            l('pepper', 'Tony. There are people in that car, and they aren’t here for the tour.', 'shock'),
            l('vanko', 'I did this to your factories. I would understand if you opened the door for them.'),
            l('tony', 'It’s been a long week, but I’m not handing anybody to a car with no lights.'),
            n('Vanko looks at you, then at your Nubbins, as if one of you might explain what this is.'),
            n('Your Nubbin hops onto the conveyor and sits next to him, close enough to share warmth.'),
          ],
          choices: [
            {
              id: 'safe',
              label: 'Tell him he’s safe here.',
              set: { 'mv-im02-vanko': 'welcomed' },
              then: [l('vanko', 'Safe. Nobody has used that word about me for years.', 'soft')],
            },
            {
              id: 'earn',
              label: 'Tell him he can earn his keep.',
              set: { 'mv-im02-vanko': 'hired' },
              then: [
                l('vanko', 'Work, I understand. Give me a lab and I will make your lights stay on.'),
                l('tony', 'Hired. Pepper, find him a lab coat. In red, obviously.', 'happy'),
              ],
            },
            {
              id: 'court',
              label: 'He wrecked three plants. Shelter him, but he answers to a judge.',
              set: { 'mv-im02-vanko': 'court' },
              then: [
                l('vanko', 'A judge. Where I come from, that is a firing squad with paperwork.', 'shock'),
                l('pepper', 'Here it’s a lawyer and bad coffee. You’ll hate it. You’ll live.'),
                l('tony', 'Fair’s fair. He gets a trial, not a car with no lights. Until then he sleeps on my couch.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im02-defect-done',
          lines: [
            n('The car idles for an hour. Then it reverses into the dark and does not come back.'),
            l('vanko', 'Thank you. All of you. Even the small ones.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im02-complete',
      lines: [
        l('pepper', 'Let me check I have this right. He blew up three factories, and now he works for us.'),
        l('tony', 'Yes. The small appliances can stay too. They’ve been very good for morale.'),
        l('pepper', 'Nubbins, Tony. They have a name.'),
        l('tony', 'For the record, I’m not good at forgiving people. I’m practising. On the expensive ones first.'),
        l('vanko', 'I will repay you in science. Your plants will be the safest in the world.'),
        n('Vanko unscrews a burnt-out coil from his gauntlet and hands it to you.'),
        l('vanko', 'The part that failed. Keep it. It reminds a man to be humble.'),
        n('It crackles faintly in your palm whenever your Fly Nubbin comes near.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im02-coil',
        kind: 'item',
        label: 'Dynamo Coil',
        description: 'A burnt-out coil from the Crimson Dynamo’s gauntlet. Crackles when a Fly Nubbin is near.',
      },
    ],
    sets: { 'mv-im02': true },
    notes:
      'Keep Vanko’s government unnamed in dialogue; the period setting (a cold-war defector) carries it. Step 1 is a watch-and-wait minigame: the saboteur appears only after the Fly Nubbin has been still for a few seconds. Step 2’s rubber mats are safe tiles that block the shock drain. Step 3 is a timed guard: the car leaves after one in-game hour if a Nubbin is posted at the gate. Check Tales of Suspense #46 beats before ship.',
  },

  // ---------------------------------------------------------------- IM3
  {
    id: 'mv-im03',
    code: 'IM3',
    title: 'The Mandarin',
    source: 'Tales of Suspense #50',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Crimson Dynamo (IM2).' },
    requires: ['IM2'],
    speakers: [TONY, MANDARIN],
    steps: [
      {
        id: 'mv-im03-s1',
        goal: 'Watch the Mandarin’s rings and learn what each one does.',
        hint: 'Talk to Tony after each blast; he names the ring and notes its tell in your journal.',
        check: 'talk:mv-tony:rings',
        scene: {
          id: 'mv-im03-fortress',
          lines: [
            n('The rift opens on a mountain valley, quiet in a way that feels arranged. A fortress sits at the end of it.'),
            l('tony', 'Whoever lives here has been knocking my survey planes out of the sky. I’d like to ask him why.'),
            n('The gates swing open before you knock. Nobody is behind them.'),
            l('mandarin', 'Come in, Mr Stark. Bring the Keeper and the creatures. I enjoy an audience.'),
            n('He sits on a carved throne with his hands folded. On each finger, a ring. Ten in all.'),
            l('mandarin', 'Your armour is clever. My rings are older than your country. Let us see which is better.'),
            l('tony', 'Or we could talk about the planes.'),
            l('mandarin', 'Your survey planes map my valley for your mines. Your shells fall on the villages below it.'),
            l('mandarin', 'I destroy what I can see, Mr Stark. You sign a form and never look. Which of us is the monster?', 'think'),
            l('tony', 'Probably both. I’m working on my half. You’re enjoying yours.'),
            l('mandarin', 'We are talking about the planes, Mr Stark. This is how I talk.', 'angry'),
            n('The first ring flares white. Frost races across the floor towards your feet.'),
          ],
          choices: [
            {
              id: 'hand',
              label: 'Watch his hand, not the ring.',
              set: { 'mv-im03-tell': 'hand' },
              then: [n('Before each blast, one finger twitches. Your Nubbin twitches with it.')],
            },
            {
              id: 'eyes',
              label: 'Watch his eyes.',
              set: { 'mv-im03-tell': 'eyes' },
              then: [n('He glances at his target half a second before he fires. Your Nubbin glances where he glances.')],
            },
          ],
        },
        done: {
          id: 'mv-im03-fortress-done',
          lines: [
            l('tony', 'Ice, flame, the black light, the beam that unmakes things. Each one winds up first. That’s our way out.', 'think'),
            n('Your Nubbins have stopped flinching. They are counting.'),
          ],
        },
      },
      {
        id: 'mv-im03-s2',
        goal: 'Win a timing bout against the Mandarin by reading each ring’s tell.',
        hint: 'Block and dodge on the glow, not the blast; attack in the pause after each ring fires.',
        check: 'karate:win:mv-ten-rings',
        scene: {
          id: 'mv-im03-bout',
          lines: [
            l('mandarin', 'You are not afraid. That is either courage or stupidity. Let your creature show me which.'),
            n('He steps down from the throne and waves your Nubbin into a circle on the floor.'),
            l('tony', 'He won’t use the big ones on it. He’s showing off. Use that.'),
            n('Flame ring: a glow at the knuckle, then the heat. Ice ring: frost on the floor first, then the blast.'),
            l('mandarin', 'Dodge, little one. Dodge for as long as you can.'),
            l('tony', 'He named them, by the way. The rings. He told me their names on the way in. All ten. Twice.'),
            l('mandarin', 'A man should know his instruments. Do you name your missiles, Mr Stark?', 'think'),
            l('tony', 'Numbers. Which is worse, now I hear it out loud.'),
            l('you', 'Watch for the tell. Move on the tell, not on the blast.'),
            n('Your Nubbin rolls its shoulders the way it does before a race.'),
            l('tony', 'Every ring needs a moment to come back. That moment is yours.'),
          ],
        },
        done: {
          id: 'mv-im03-bout-done',
          lines: [
            l('mandarin', 'Enough. The creature reads me like a scroll. I find I do not enjoy that.', 'angry'),
            n('He raises his hand, and this time it is the ring that unmakes things.'),
          ],
        },
      },
      {
        id: 'mv-im03-s3',
        goal: 'Get behind cover and let the Mandarin open the way out himself.',
        hint: 'Move your Nubbins to the pillar the moment the beam ring hums; the timing is the same as the bout.',
        check: 'minigame:clear:mv-ring-dodge',
        scene: {
          id: 'mv-im03-escape',
          lines: [
            l('tony', 'Keeper. When I say move, get everyone behind that pillar.'),
            n('The ring hums. The air around it bends like heat over a road.'),
            l('mandarin', 'This one does not freeze and does not burn. It simply removes. Goodbye, Mr Stark.'),
            l('tony', 'Before you do that. Your throne room has one door, and you locked it from outside. Bit arrogant, no?'),
            l('mandarin', 'No door holds against this ring.', 'angry'),
            l('tony', 'That’s what I was counting on.'),
            n('Tony steps in front of the great iron door. Your Nubbins are already behind the pillar.'),
            l('tony', 'Move!'),
          ],
        },
        done: {
          id: 'mv-im03-escape-done',
          lines: [
            n('Tony drops flat. The beam passes over him and unmakes half the door.'),
            l('tony', 'Thank you for the exit. Lovely work, by the way.', 'happy'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im03-complete',
      lines: [
        n('You run down the valley with the Mandarin’s fury echoing off the walls behind you.'),
        l('tony', 'I didn’t beat him. I just didn’t let him beat me. With that man, that counts.'),
        l('tony', 'He’ll be back. People with ten rings don’t forget one door.', 'think'),
        n('Your Nubbin has tied a strip of red cloth round its middle, torn from a banner on the way out.'),
        l('tony', 'A sash. For reading rings. You’ve earned it, small person.'),
        l('tony', 'Can I ask you something? The bit about my shells and his villages. Was he wrong?', 'think'),
      ],
      choices: [
        {
          id: 'point',
          label: 'He had a point. That’s why it stung.',
          set: { 'mv-im03-point': 'conceded' },
          then: [
            l('tony', 'Yeah. Worst people always find the true thing and use it as a knife.', 'sad'),
            l('tony', 'Monday I’m reviewing every contract. Don’t tell the board. They’ll faint.'),
          ],
        },
        {
          id: 'unlike',
          label: 'You walked out of a cave to stop. He walked in to start.',
          set: { 'mv-im03-point': 'denied' },
          then: [
            l('tony', 'Generous. I’ll take it. I’ll also check the contracts, because generous isn’t the same as right.', 'soft'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-im03-sash',
        kind: 'cosmetic',
        label: 'Ring-Reader Sash',
        description: 'A strip of red banner from the Mandarin’s throne room, worn by a Nubbin that read the ten rings.',
      },
    ],
    sets: { 'mv-im03': true },
    notes:
      'Avoid any caricature in the Mandarin’s look or voice: a proud, cold scholar-warlord, not a stereotype. The fortress is unnamed in dialogue. Ring tells (step 2): ice = frost creeps first; flame = knuckle glow; black light = the room dims; disintegration = a hum and bent air. The flag mv-im03-tell (hand/eyes) only changes which tell the UI highlights first. IM9 (Dragon Seed) needs this storyline. Check Tales of Suspense #50 beats before ship.',
  },

  // ---------------------------------------------------------------- IM4
  {
    id: 'mv-im04',
    code: 'IM4',
    title: 'Titanium Man',
    source: 'Tales of Suspense #69–71',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Mandarin (IM3).' },
    requires: ['IM3'],
    speakers: [TONY, PEPPER, BULLSKI, ANNOUNCER],
    steps: [
      {
        id: 'mv-im04-s1',
        goal: 'Train your Run Nubbin to dodge a heavy hitter before the televised duel.',
        hint: 'Win three dodge drills in the karate gym; dodges count for more than hits.',
        check: 'karate:train:dodge:3',
        scene: {
          id: 'mv-im04-challenge',
          lines: [
            n('Every television in the Stark plant shows the same thing: a giant in green armour, arms folded.'),
            l('bullski', 'Iron Man. I am Boris Bullski. My armour is twice your size and twice your strength.', 'angry'),
            l('bullski', 'Meet me before the cameras, in a neutral country. We will see whose science deserves the future.'),
            l('pepper', 'You don’t have to go. Nobody wins an argument by turning up when a man shouts on television.'),
            l('tony', 'If I don’t go, he gets to say the shouting won.'),
            l('pepper', 'Then go. It’s in your calendar. Thursday: do not fly into the sun.'),
            l('tony', 'I have never once flown into the sun.'),
            l('pepper', 'It’s a recurring entry. It’s recurring because you keep asking.'),
            n('On the bench, two suits: the heavy one, slow but tough, and a light one, barely more than plating.'),
            l('tony', 'He’s big. Big means slow to turn. I could match him plate for plate, or I could make him chase.', 'think'),
            l('tony', 'Keeper. You’ve fought things bigger than you. What would you do?'),
          ],
          choices: [
            {
              id: 'light',
              label: 'Go light. Make him chase.',
              set: { 'mv-im04-plan': 'speed' },
              then: [l('tony', 'My thinking exactly. I just wanted to hear it from someone sensible.', 'happy')],
            },
            {
              id: 'tire',
              label: 'Let him swing until he’s worn out.',
              set: { 'mv-im04-plan': 'tire' },
              then: [
                l('tony', 'Patience. Not my strongest suit. Pun intended.'),
                l('tony', 'Light armour, then. You can’t wear a man out while he’s busy flattening you.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im04-challenge-done',
          lines: [
            n('Your Run Nubbin ducks the swinging bag twice in a row and looks very pleased with itself.'),
            l('tony', 'Good. Now do that with a cameraman watching.'),
          ],
        },
      },
      {
        id: 'mv-im04-s2',
        goal: 'Win the three-round duel against the Titanium Man.',
        hint: 'Dodge through rounds one and two to drain his stamina; strike only in round three.',
        check: 'karate:win:mv-titanium-man:3-rounds',
        scene: {
          id: 'mv-im04-duel',
          lines: [
            n('A stadium on a border nobody owns. Cameras from every country, red lights blinking like eyes.'),
            l('announcer', 'Three rounds. No ropes. Two suits of armour and one very nervous referee.'),
            l('bullski', 'Bring your little friends, Stark. They will make your defeat look sadder.', 'angry'),
            l('tony', 'They’re my corner. Every fighter needs a corner. Where’s yours?'),
            n('Bullski glances up at a glass box above the stands. Men in grey coats sit there with notebooks open.'),
            l('bullski', 'My corner is taking notes.', 'sad'),
            n('Your Run Nubbin takes its place by Tony’s boot, light on its feet.'),
            l('tony', 'Round one we watch. Round two we make him miss. Round three, he’s too tired to lift his arms.'),
            l('announcer', 'Fighters ready. And… begin!'),
            n('The ground shakes when Bullski moves. It doesn’t stop shaking.'),
          ],
        },
        done: {
          id: 'mv-im04-duel-done',
          lines: [
            n('In round three Bullski swings, misses, and keeps going, all the way to the floor.'),
            l('announcer', 'The bigger suit is down! The smaller suit is… waving at the camera?'),
            l('announcer', 'Mr Stark! Half the planet is watching. Tell them whose science won tonight!'),
            n('Up in the glass box, the men in grey coats have stopped writing.'),
          ],
          choices: [
            {
              id: 'ours',
              label: 'Let Tony say it: our side won, fair and square.',
              set: { 'mv-im04-speech': 'victory' },
              then: [
                l('tony', 'Free people build better suits. Write that down, gentlemen in the box.'),
                n('The crowd roars. Bullski, still on the floor, closes his eyes.'),
              ],
            },
            {
              id: 'nobody',
              label: 'Tell the truth: nobody’s science won. A small suit outthought a big one.',
              set: { 'mv-im04-speech': 'honest' },
              then: [
                l('tony', 'Nobody’s science won. He built big, I built nimble. Next year he builds nimble and beats me.'),
                l('announcer', 'That is… not the quote the network wanted.', 'shock'),
              ],
            },
            {
              id: 'hand',
              label: 'Say nothing. Help Bullski up on camera.',
              set: { 'mv-im04-speech': 'helped' },
              then: [
                n('Your Run Nubbin tugs at Bullski’s gauntlet while Tony takes the other arm. The cameras don’t know where to look.'),
                l('bullski', 'This will be harder to explain than losing.', 'think'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im04-complete',
      lines: [
        l('bullski', 'I had more power. More metal. How?', 'sad'),
        l('tony', 'You built a suit to win an argument. I built one to get home in.'),
        l('bullski', 'And now I go home in a train with no windows. Your side wins the war of pictures, Stark.'),
        l('tony', 'If they come for you, there’s a guy called Vanko who knows a good couch. Think about it.', 'soft'),
        n('Pepper meets you in the tunnel with a towel she clearly brought for Tony. She hands it to your Nubbin.'),
        l('pepper', 'For the one who actually did the running.', 'happy'),
        n('The towel has a little armoured fist printed on it. Your Nubbin wears it round its neck all the way home.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im04-towel',
        kind: 'cosmetic',
        label: 'Ringside Towel',
        description: 'A small towel from the Titanium Man duel, worn round a Nubbin’s neck.',
      },
      {
        id: 'mv-im04-bell',
        kind: 'decor',
        label: 'Duel Bell',
        description: 'The referee’s brass bell. Ring it in the Grove to start a friendly bout.',
      },
    ],
    sets: { 'mv-im04': true },
    notes:
      'Step 2 is a three-round karate bout: the Run Nubbin is the active fighter and Tony is shown as its partner. Bullski’s stamina drops each time he misses; in round three his attacks slow by half. If mv-im04-plan is "tire", the round-two dodge window is slightly wider. The post-bout choice sets mv-im04-speech (victory / honest / helped); it is the Keeper’s voice on propaganda and changes nothing mechanical. Keep Bullski’s nationality to the period cold-war framing, no accent jokes. Check Tales of Suspense #69–71 beats before ship.',
  },

  // ---------------------------------------------------------------- IM5
  {
    id: 'mv-im05',
    code: 'IM5',
    title: 'Demon in a Bottle',
    source: 'Iron Man #120–128',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Titanium Man (IM4).' },
    requires: ['IM4'],
    speakers: [TONY, RHODEY, BETHANY, HAMMER],
    steps: [
      {
        id: 'mv-im05-s1',
        goal: 'Help Bethany Cabe trace the signal that took over the armour.',
        hint: 'Bethany waits at the embassy gate; a Fly Nubbin can trace the signal from the roof.',
        check: 'talk:mv-bethany',
        scene: {
          id: 'mv-im05-ceremony',
          lines: [
            n('Through the rift: a garden party at an embassy. Flags, a string quartet, a podium with a microphone.'),
            l('bethany', 'Bethany Cabe. I run security for Stark today. You’re the ones with the creatures? Keep them off the canapés.'),
            n('Tony is in the armour, shaking hands with the ambassador of a small country. He has a glass in the other hand.'),
            l('rhodey', 'That’s his third. It’s two in the afternoon.', 'think'),
            n('Then the armour’s right hand comes up on its own. Tony stares at it.'),
            l('tony', 'That’s not me. Rhodey, that isn’t me—', 'shock'),
            n('The repulsor fires. The ambassador falls. The quartet stops mid-note, and for a second nobody makes a sound.'),
            l('bethany', 'Down! Everybody down! Get those creatures back!', 'shock'),
            n('Your Nubbins are behind your legs. Tony stands over the body in a suit he cannot control.'),
          ],
        },
        done: {
          id: 'mv-im05-ceremony-done',
          lines: [
            l('bethany', 'The signal came from out at sea. Someone with a boat and a great deal of money.'),
            l('rhodey', 'I know one man with both who hates Tony. Justin Hammer.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-im05-s2',
        goal: 'Storm Justin Hammer’s floating base with Rhodey and Bethany and shut down his transmitter.',
        hint: 'An expedition with two Nubbins: send the quieter one to the transmitter while the other holds the gangway.',
        check: 'expedition:clear:mv-hammer-base',
        scene: {
          id: 'mv-im05-base',
          lines: [
            n('Days pass. Tony is charged and waiting for a court date. The bottles collect on the counter.'),
            l('rhodey', 'He won’t come. Says he can’t trust the armour. I think he means he can’t trust himself.'),
            l('bethany', 'Then we go without his permission, and we bring him with us.'),
            l('rhodey', 'Drag a man who’s drinking onto a raid? Bethany, that’s how people get killed.', 'angry'),
          ],
          choices: [
            {
              id: 'bring',
              label: 'Bring him. He has to face Hammer himself.',
              set: { 'mv-im05-raid': 'brought' },
              then: [
                n('You knock until he opens the door. He looks at your Nubbins, then at the boat, and gets his coat.'),
                l('tony', 'Fine. But if I’m useless, you leave me on the boat. Promise me that.', 'sad'),
                ...IM5_HAMMER,
              ],
            },
            {
              id: 'invite',
              label: 'Leave the door open. Tell him where you’ll be, and go.',
              set: { 'mv-im05-raid': 'invited' },
              then: [
                n('You leave a note under his door with a map and a drawing of a Nubbin. You sail at dusk without him.'),
                n('An hour out, a red-and-gold shape drops onto the deck, unsteady but there.'),
                l('tony', 'Your Nubbin draws like a toddler. It was very persuasive.', 'soft'),
                ...IM5_HAMMER,
              ],
            },
          ],
        },
        done: {
          id: 'mv-im05-base-done',
          lines: [
            n('Your Nubbin pulls a fistful of cables. Somewhere above you, a dish stops turning.'),
            l('bethany', 'We’ve got his logs. Proof it was him. Tony’s clear.', 'happy'),
            l('hammer', 'This is extremely rude. I had a schedule.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-im05-s3',
        goal: 'Keep Tony company for three nights while he starts to recover.',
        hint: 'Visit Tony each night and stay until he sleeps; like a Shadow Nubbin, he heals with patience, not speed.',
        check: 'sit:mv-tony:3-nights',
        scene: {
          id: 'mv-im05-bottle',
          lines: [
            n('The case is dropped. Hammer’s logs are on every front page. Tony should be celebrating. He’s in the kitchen.'),
            n('A glass, a bottle, the lights off. He doesn’t look up when you come in.'),
            l('tony', 'Name cleared. Fantastic. The ambassador is still dead, so forgive me if I don’t dance.', 'sad'),
            l('tony', 'It wasn’t only the signal, you know. My hands were shaking long before Hammer touched anything.', 'sad'),
            l('bethany', 'Tony. I’ve watched someone I loved drink himself into a corner. I won’t watch it twice.', 'soft'),
            n('You know this look. It’s the one a Shadow Nubbin has: grey, still, waiting for the next bad thing.'),
            l('tony', 'I don’t know how to stop. I’ve never not known how to do something.', 'sad'),
            n('The bottle sits between you. Nobody reaches for it.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down next to him and wait.',
              set: { 'mv-im05-company': 'sat' },
              then: [
                l('tony', 'You’re not going to lecture me?'),
                l('you', 'No. We’re just staying.'),
                n('You sit. Your Nubbins sit. Nobody says anything for a long time, and that turns out to be all right.'),
              ],
            },
            {
              id: 'tomorrow',
              label: 'Tell him you’ll be here tomorrow too.',
              set: { 'mv-im05-company': 'promised' },
              then: [
                l('tony', 'Tomorrow is a long way off.', 'sad'),
                l('you', 'Then we’ll do tonight first.'),
              ],
            },
            {
              id: 'pour',
              label: 'Offer to pour it away.',
              set: { 'mv-im05-company': 'offered' },
              then: [
                l('tony', 'No. If somebody else pours it, I’ll just buy another. It has to be my hand.', 'sad'),
                n('After a long while he picks up the bottle and empties it into the sink himself. His hand is shaking.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im05-bottle-done',
          lines: [
            n('The third night, Tony makes tea. It is terrible tea. He drinks all of it.'),
            l('tony', 'Day three. People say it gets easier. Bethany says it gets different. I believe her more.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im05-complete',
      lines: [
        l('rhodey', 'He’s not fixed. Nobody gets fixed. But he’s talking, and that’s more than last week.'),
        l('bethany', 'He’ll need people around him for a long time. Glad some of them have fur.'),
        n('Tony walks you to the rift. He has a steel washer on a string, filed smooth at the edges.'),
        l('tony', 'I made this the first morning. Something to do with my hands. I want you to have it.', 'soft'),
        l('tony', 'If I get to next year, I’ll make another. That’s the plan. One day, then the next one.'),
        n('It is a plain thing, a little crooked. Your Nubbin holds it like treasure.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im05-washer',
        kind: 'item',
        label: 'Steel Washer',
        description: 'Tony’s hand-filed first-morning token, on a string. A plain thing that means a great deal.',
      },
    ],
    sets: { 'mv-im05': true },
    notes:
      'Show a short content note before this storyline starts: it deals with alcoholism. Drinking is never played for laughs, never a minigame, never rewarded; no on-screen drinking after the first scene, only the bottle on the counter. The ambassador’s death: one flash, he falls out of frame, cut to the frozen garden; no wound. Step 3 reuses the Shadow Nubbin trust mechanic as a mirror: Tony has a trust bar that fills only while the Keeper stays in the kitchen; leaving early pauses that night but never resets progress, and there is no fail state. Step 2’s choice (mv-im05-raid: brought / invited) is about whether you can make someone recover; Tony joins the raid either way, and the Hammer arrival lines (IM5_HAMMER) play after both. The pour choice is the only one in which he pours the bottle away on screen; in the others he does it off-screen before night two. Consider a line in the pause menu pointing to real support services. Check Iron Man #120–128 beats before ship.',
  },

  // ---------------------------------------------------------------- IM6
  {
    id: 'mv-im06',
    code: 'IM6',
    title: 'Doomquest',
    source: 'Iron Man #149–150',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Demon in a Bottle (IM5) and Doom’s First Strike (FF2).' },
    requires: ['IM5', 'FF2'],
    speakers: [TONY, DOOM, ARTHUR, MORGAN],
    steps: [
      {
        id: 'mv-im06-s1',
        goal: 'Speak with King Arthur and learn what Doom wants in Camelot.',
        hint: 'Arthur holds court in the great hall; Doom has already ridden for Morgan le Fay’s tower.',
        check: 'talk:mv-arthur',
        scene: {
          id: 'mv-im06-platform',
          lines: [
            n('The rift sets you down in the Latverian embassy in New York, which is technically Latveria, Doom will remind you.'),
            l('tony', 'Doom bought a crate of my microcircuits through three shell companies. I’m here to take them back.'),
            l('doom', 'Stark. You enter my house with your pets and accuse me of shopping. Doom does not shop. Doom acquires.', 'angry'),
            l('tony', 'Through three shell companies. One of them was called Totally Normal Imports.'),
            l('doom', 'My ministers name the companies. I have spoken to them about it.'),
            n('Behind him stands a round platform crowded with dials. Your Nubbins have seen it before, beyond another gate.'),
            l('doom', 'The circuits power this. This takes me where I need to go. Stand aside.'),
            l('tony', 'Not with my circuits, it doesn’t.'),
            n('Tony fires at the controls. Doom lunges. The platform howls, and the room fills with white light.'),
            n('When it clears there is grass under your feet, a castle on a hill, and a knight lowering a lance at you.'),
            l('arthur', 'Hold! Strangers in iron, and one in green. Name yourselves before the king of Camelot.'),
          ],
          choices: [
            {
              id: 'truth',
              label: 'Tell him the truth: you came through a door in time.',
              then: [l('arthur', 'Merlin speaks of such doors. I never believed him. I am learning to.', 'think')],
            },
            {
              id: 'bow',
              label: 'Bow, and let Tony do the talking.',
              then: [
                l('tony', 'Tony Stark, Your Majesty. Engineer. These are my associates. The small ones bite.'),
                l('arthur', 'Then they will fit in here very well.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im06-platform-done',
          lines: [
            l('arthur', 'Your green-masked friend rode for my sister’s tower. Morgan le Fay. She is sorcery, and he wants it.'),
            l('tony', 'Not my friend. Very much not my friend.'),
          ],
        },
      },
      {
        id: 'mv-im06-s2',
        goal: 'Win the race on Camelot’s jousting course with your Nubbin among the knights.',
        hint: 'The lists are a racing course; Run and Stamina matter, and the knights’ horses slow on the turns.',
        check: 'race:win:mv-camelot-lists',
        scene: {
          id: 'mv-im06-lists',
          lines: [
            n('Morgan’s army marches at dawn. Tonight the knights ride the lists to choose who leads the charge.'),
            l('arthur', 'They tell me your creature rides well. Will it ride for Camelot?'),
            n('A crow lands on the fence of the lists and speaks in a woman’s voice, sweet and cold.'),
            l('morgan', 'Ride all you like, brother. My soldiers never tire. They stopped breathing centuries ago.', 'angry'),
            l('arthur', 'My sister. She has never once arrived by the door.', 'sad'),
            n('Your Nubbin is lifted onto a pony wearing a saddle the size of a teacup.'),
            l('tony', 'The course has fences, a water jump and a very large knight called Sir Something. Go round him.'),
            l('arthur', 'Sir Bors. He will be offended, but he is always offended.', 'happy'),
          ],
        },
        done: {
          id: 'mv-im06-lists-done',
          lines: [
            n('Your Nubbin crosses the line first, pony and all, to a roar from the stands.'),
            l('arthur', 'The small knight leads the charge. I have heard stranger prophecies.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-im06-s3',
        goal: 'Hold the hill against Morgan le Fay’s army with Tony, Doom and Arthur’s knights.',
        hint: 'A karate bout against waves of the dead; Doom’s blasts clear the field every third round.',
        check: 'karate:win:mv-morgan-dead',
        scene: {
          id: 'mv-im06-truce',
          lines: [
            n('Dawn. Morgan’s dead come over the hill in silent rows, armour rusted, eyes like candle smoke.'),
            n('Doom walks out ahead of them. He is not marching with them. He looks furious.'),
            l('doom', 'The witch made promises. She keeps none of them. She wants my platform for herself.', 'angry'),
            l('tony', 'What did she promise you? Doom doesn’t ride across a century for a cookery lesson.'),
            l('doom', 'Sorcery older than Merlin. Enough to reach one soul in a place no machine can reach.', 'sad'),
            l('doom', 'That is all you will hear of it. Repeat it, and I will deny it, and then I will destroy you.'),
            l('doom', 'I cannot get home without your circuits, Stark. You cannot get home without my platform.'),
            l('tony', 'So it’s a truce.'),
            l('doom', 'It is an arrangement. Doom does not make truces.'),
            l('arthur', 'Call it what you like. Help us hold the hill and I will call it friendship.'),
            n('Your Nubbins stand either side of you, looking from the armour to the mask and back.'),
          ],
          choices: [
            {
              id: 'shake',
              label: 'Shake Doom’s hand.',
              set: { 'mv-im06-truce': 'shook' },
              then: [
                n('Doom looks at your hand for a long moment. Then he shakes it once, as if signing something.'),
                l('doom', 'Remember this, Keeper. I will.'),
              ],
            },
            {
              id: 'nod',
              label: 'Just nod.',
              set: { 'mv-im06-truce': 'nodded' },
              then: [l('doom', 'Wise. Never touch what you cannot read.')],
            },
            {
              id: 'refuse',
              label: 'No deal. He courted the witch. He doesn’t get to be a hero by switching sides.',
              set: { 'mv-im06-truce': 'refused' },
              then: [
                l('arthur', 'Then do not call him ally. Call him a sword that happens to point the same way today.'),
                l('doom', 'The Keeper is right to refuse me. It changes nothing. I fight because I want to go home.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im06-truce-done',
          lines: [
            n('Morgan’s spell breaks. The dead lie down in the grass and stay down.'),
            l('morgan', 'Run home, both of you. Camelot will have forgotten you by supper.', 'angry'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im06-complete',
      lines: [
        n('Doom’s platform hums back to life with Tony’s circuits wired in, two pairs of hands on one panel.'),
        n('You watch Doom’s fingers drift to a second dial, the one marked for a single traveller.'),
        l('tony', 'I rewired that one last night. It only goes if we all go. I know you, Victor.'),
        l('doom', 'A precaution. Doom tests his allies. You passed. Do not mistake this for friendship, Stark.'),
        l('tony', 'Wouldn’t dream of it. You’d have to be fun.'),
        l('arthur', 'Take this, small knight. Every rider of the lists carries one home.'),
        n('He gives your Nubbin a pennant, a gold crown on blue. Then the light swallows Camelot.'),
        n('You land back in New York. Doom is already gone. So is half the embassy furniture.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im06-pennant',
        kind: 'decor',
        label: 'Camelot Pennant',
        description: 'Arthur’s blue-and-gold pennant from the lists. Hangs on a Grove fence post.',
      },
      {
        id: 'mv-im06-saddle',
        kind: 'cosmetic',
        label: 'Teacup Saddle',
        description: 'The tiny saddle your Nubbin rode in Camelot. Decorative only; please do not ride your Nubbin.',
      },
    ],
    sets: { 'mv-im06': true },
    notes:
      'Needs FF2: Doom’s time platform is introduced there, and the line about your Nubbins having seen it before depends on it. Speaker id "doom" matches the Doom line. Step 2 is the Lists, a Camelot reskin of a standard race course with fences and a water jump; the pony is cosmetic, stats are the Nubbin’s own. Morgan appears as a crow in step 2 and as a voice only in step 3. If mv-im06-truce is "shook", Secret Wars (E2) can call back to the handshake; "refused" plays the same bout. Doom’s hint about reaching a soul foreshadows his mother (FF5, FF7); never name her here. Required for Secret Wars. Check Iron Man #149–150 beats before ship.',
  },

  // ---------------------------------------------------------------- IM7
  {
    id: 'mv-im07',
    code: 'IM7',
    title: 'Iron Monger',
    source: 'Iron Man #163–200',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Doomquest (IM6).' },
    requires: ['IM6'],
    speakers: [TONY, RHODEY, BETHANY, STANE],
    steps: [
      {
        id: 'mv-im07-s1',
        goal: 'Find out where Tony has gone.',
        hint: 'Talk to Rhodey at the hangar; he knows the last place Tony was seen.',
        check: 'talk:mv-rhodey',
        scene: {
          id: 'mv-im07-siege',
          lines: [
            n('A boardroom high over the city. Through the window, the Stark International sign is coming down letter by letter.'),
            l('stane', 'Obadiah Stane. I buy things, Keeper. Shares, debts, people. This week I bought Tony Stark’s company.', 'happy'),
            l('stane', 'I didn’t have to fight him. I only had to wait for him to fight himself. He’s losing.'),
            n('Two of his men are building a house of cards on the table. Stane flicks it over without looking.'),
            l('rhodey', 'Tony was sober for months after the embassy. Then something knocked him over again. Three days, no answer.', 'sad'),
            l('bethany', 'He told me he’d rather be useless alone than useless watched.', 'sad'),
            l('bethany', 'Stane went after every friend Tony has. Debts called in. Threats. He’s pulling up the floor one board at a time.'),
            l('stane', 'Go and look for him if you like. I’d start low.'),
            l('stane', 'You think I’m the villain, Keeper. I’m a man who read the accounts. He was drinking the company into the sea.'),
            l('bethany', 'And you held the bottle out. Don’t dress it up as auditing.', 'angry'),
            l('rhodey', 'Somebody has to wear the armour while he’s gone. Stane’s people are already testing the doors.'),
          ],
          choices: [
            {
              id: 'find',
              label: 'Go and find Tony.',
              then: [l('rhodey', 'Go. I’ll hold the fort. Bring him back if he’ll come.')],
            },
            {
              id: 'help',
              label: 'Help Rhodey into the armour first.',
              then: [
                n('The helmet is tight on Rhodey and gives him headaches. He wears it anyway.'),
                l('rhodey', 'It’s heavier than Tony makes it look. Now go and find him.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im07-siege-done',
          lines: [
            l('rhodey', 'Last sighting was the docks. In January. Take a coat, and take something warm for him.'),
            n('Your Nubbins pack fruit without being asked.'),
          ],
        },
      },
      {
        id: 'mv-im07-s2',
        goal: 'Help Tony rebuild a suit from nothing in the workshop Rhodey has found.',
        hint: 'Gather scrap with your Nubbins and craft the Silver Centurion plates; each piece needs a different stat.',
        check: 'craft:mv-silver-centurion',
        scene: {
          id: 'mv-im07-street',
          lines: [
            n('Snow on the docks. A fire in an oil drum. A handful of people huddled close to it, saying nothing.'),
            n('One of them has a beard weeks old and a coat that used to be expensive.'),
            l('tony', 'Oh. It’s you. The zoo. Did Rhodey send you, or did you come to see how far down it goes?', 'sad'),
            l('tony', 'It goes down a long way. I keep finding new floors.'),
            n('A woman by the fire is shivering worse than the rest. Tony takes off his coat and puts it round her without a word.'),
            l('tony', 'Don’t tell anyone. I have a reputation for being useless now. I’m protecting it.'),
            n('Your Nubbin puts a fruit in his hand. He holds it a long time before he eats it.'),
            l('tony', 'I can’t do it again. Build it all again. Stane took everything I was good at.'),
          ],
          choices: [
            {
              id: 'hands',
              label: 'He didn’t take your hands.',
              then: [
                l('tony', 'My hands. Yinsen asked me to make something better than weapons with them. I haven’t yet.', 'soft'),
                n('He looks at his hands as if they belong to someone he used to like.'),
              ],
            },
            {
              id: 'fire',
              label: 'Say nothing. Stay by the fire.',
              then: [
                n('You stay. The fire burns down. Around midnight, Tony stands up.'),
                l('tony', 'Fine. One more floor. But this time I’m going up.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im07-street-done',
          lines: [
            n('Weeks pass. Tony is sober again, thin and quiet, and the new armour gleams red and silver on the bench.'),
            n('The woman from the oil drum works the bellows now, still wearing his coat. He has stopped asking for it back.'),
            l('tony', 'The old suit was made by a man with money. This one was made by a man with friends. It’s better.', 'happy'),
          ],
        },
      },
      {
        id: 'mv-im07-s3',
        goal: 'Defeat Obadiah Stane’s Iron Monger armour.',
        hint: 'A karate bout; the Iron Monger hits hard but turns slowly, so keep moving and strike from behind.',
        check: 'karate:win:mv-iron-monger',
        scene: {
          id: 'mv-im07-monger',
          lines: [
            n('Stane comes to the workshop himself, in armour twice Tony’s size, grey and heavy as a bank vault.'),
            l('stane', 'Iron Monger. I took your company, Stark. I took your money. Now I take the last thing.', 'angry'),
            n('Stane’s people have hurt those close to Tony. Rhodey is bruised. Bethany’s arm is in a sling. Nobody has forgotten.'),
            l('rhodey', 'I’ve worn that suit for months, Tony. I know how he moves. I can take him.'),
            l('tony', 'It’s my name on everything he wrecked. I want to be the one who ends it.'),
            l('tony', 'Keeper, you’ve seen us both at our worst. You choose. Who goes in?'),
            n('Two racks. Rhodey’s old armour and the Silver Centurion. Two men who both mean it.'),
            l('stane', 'Take your time. I bill by the hour.'),
          ],
          choices: [
            {
              id: 'tony',
              label: 'Tony. It’s his fight.',
              set: { 'mv-im7-suit': 'tony' },
              then: [
                l('rhodey', 'Fair. Go and get it back, man.'),
                n('Tony seals the Silver Centurion. Rhodey stands at his shoulder, ready to step in.'),
              ],
            },
            {
              id: 'rhodey',
              label: 'Rhodey. He’s been carrying it.',
              set: { 'mv-im7-suit': 'rhodey' },
              then: [
                l('tony', 'He has. He carried me too.', 'soft'),
                n('Rhodey seals the Silver Centurion. Tony takes the workshop controls and talks him through every move.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im07-monger-done',
          lines: [
            n('The Iron Monger falls to its knees. The helmet comes off. Stane looks small inside it.'),
            l('stane', 'You won’t get to watch me in a cell, Stark. I won’t give you that.'),
            n('Before anyone can reach him, Stane turns his own weapon on himself. A flash, and then nothing.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im07-complete',
      lines: [
        n('Nobody cheers. The workshop is very quiet.'),
        l('tony', 'I wanted him beaten. I didn’t want this.', 'sad'),
        l('rhodey', 'He chose it. That isn’t on you. I’ll keep saying it until you believe me.', 'soft'),
        n('Later, Tony cuts a small badge from the spare silver plate and pins it on your Nubbin.'),
        l('tony', 'For the one who brought me fruit on the docks. I never said thank you. Thank you.', 'soft'),
        n('Outside, someone is putting up a new sign. It doesn’t say Stark yet. It might, one day.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im07-centurion',
        kind: 'cosmetic',
        label: 'Silver Centurion Badge',
        description: 'A red-and-silver badge cut from the spare armour plate. Worn by a Nubbin.',
      },
    ],
    sets: { 'mv-im07': true },
    notes:
      'Choice in step 3 sets mv-im7-suit ("tony" or "rhodey"): the bout is the same either way, but the fighter portrait and the armour sprite change, and later content (IM11, Civil War, The Last Ultron) reads it. Show a short content note before step 3 (relapse, homelessness, a suicide). Stane’s death follows the comic but is never shown: on the third done line, a white flash fills the screen, then cut to black for two seconds before the complete scene. No body, no sound effect beyond a dull thump. The relapse in step 1 is reported, not shown. IM11 needs this storyline. Check Iron Man #163–200 beats before ship.',
  },

  // ---------------------------------------------------------------- IM8
  {
    id: 'mv-im08',
    code: 'IM8',
    title: 'Armor Wars',
    source: 'Iron Man #225–232',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Iron Monger (IM7).' },
    requires: ['IM7'],
    speakers: [TONY, RHODEY, STEVE, GUARDSMAN],
    steps: [
      {
        id: 'mv-im08-s1',
        goal: 'Help Tony plant negators on the stolen armours.',
        hint: 'A stealth minigame: your Nubbins slip the chips onto suits while Tony draws fire; small Nubbins are harder to spot.',
        check: 'minigame:clear:mv-negator-run',
        scene: {
          id: 'mv-im08-stolen',
          lines: [
            n('Tony’s new workshop. A wall of screens, each one showing a different armoured crook in mid-flight.'),
            l('tony', 'Look at the chest plates. The gauntlets. The power couplings. That’s mine. That’s all mine.', 'angry'),
            l('rhodey', 'Someone broke in, copied the designs and sold them on. Justin Hammer did the selling. Of course he did.'),
            l('tony', 'Half the crooks in the country are flying on my work. Every time one of them hurts someone, it’s my design doing it.'),
            n('Tony slides a small black box across the bench. Inside is a chip the size of a fingernail.'),
            l('tony', 'A negator. Stick it on any suit built from my tech and it shuts down for good.'),
            l('rhodey', 'Some of those suits belong to the government. To guards. To people who think they’re the good guys.', 'think'),
            l('tony', 'Then they’re good guys with stolen goods. I’m taking it all back. Legal or not.'),
          ],
          choices: [
            {
              id: 'with',
              label: 'We’re with you.',
              set: { 'mv-im08-stance': 'with-tony' },
              then: [l('tony', 'Good. I hoped you’d say that, because I’ve already packed your Nubbins a lunch.', 'happy')],
            },
            {
              id: 'doubt',
              label: 'We’ll come. But this could go badly.',
              set: { 'mv-im08-stance': 'doubts' },
              then: [l('tony', 'It could. Come anyway, and tell me when it does. I need someone who will.', 'think')],
            },
          ],
        },
        done: {
          id: 'mv-im08-stolen-done',
          lines: [
            n('Stingray, a marine scientist in a suit with Stark wiring, drops out of the sky into the sea, shouting.'),
            l('rhodey', 'Tony, Stingray isn’t a crook. He’s on our side. Was.', 'shock'),
            l('tony', 'He was wearing my work. I’ll apologise later.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-im08-s2',
        goal: 'Get through the Vault and shut down the Guardsmen’s armour without letting a single prisoner out.',
        hint: 'An expedition: send one Nubbin to hold the cell-block switches while the other follows Tony.',
        check: 'expedition:clear:mv-the-vault',
        scene: {
          id: 'mv-im08-vault',
          lines: [
            n('The Vault: a prison for super-powered criminals, guarded by men in green armour called the Guardsmen.'),
            l('tony', 'Their suits are mine too. Licensed once, years ago. Copied since. I’m switching them off.'),
            l('guardsman', 'Stark, stand down! We keep the worst people on Earth behind these walls!', 'angry'),
            l('tony', 'With my armour. Without asking me. That’s the problem.'),
            l('guardsman', 'Stand down, Stark. That is an order.'),
            l('tony', 'By what authority?'),
            l('guardsman', 'Yours, technically. It’s on the label.'),
            n('By the big red lever, a guard asks your Nubbin very politely to let go. It does not.'),
            n('Alarms. Cell doors stutter as the power flickers. Inside, prisoners start to shout.'),
            l('you', 'Tony, if the guards go down, who keeps the doors shut?'),
            l('tony', 'I— I hadn’t got as far as that part.', 'shock'),
            l('guardsman', 'Then think fast, because you’re not getting past us.', 'angry'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Send a Nubbin to hold the cell power. Slower, but the doors stay shut.',
              set: { 'mv-im08-vault': 'held' },
              then: [
                l('tony', 'Slower means the guards get longer to hurt us. Fine. Fine! Better us than the city.'),
                n('Your Nubbin wraps itself round the big red lever and glares at anyone who comes near it.'),
              ],
            },
            {
              id: 'fast',
              label: 'Go fast. The faster the suits drop, the fewer guards get hurt.',
              set: { 'mv-im08-vault': 'fast' },
              then: [
                l('guardsman', 'And if the doors fail, who goes back in after what comes out? You?', 'angry'),
                l('tony', 'If they fail, yes. Me. That’s the deal I’m making with myself.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im08-vault-done',
          lines: [
            n('The Guardsmen’s suits go dark. The cell doors hold, just. One guard is carried out on a stretcher.'),
            l('tony', 'He’ll live. They told me he’ll live. I keep asking anyway.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-im08-s3',
        goal: 'Hold off Steve Rogers on the Vault roof until Tony can get away.',
        hint: 'A survive bout; Steve blocks almost everything, so stay out of reach of the shield.',
        check: 'karate:survive:mv-steve-rogers',
        scene: {
          id: 'mv-im08-captain',
          lines: [
            n('On the roof of the Vault, a man with a round shield is waiting.'),
            l('steve', 'Tony. You know why I’m here. You’re finished.'),
            l('tony', 'I’m nearly finished. Two more suits.'),
            l('steve', 'You attacked the government’s guards. You wrecked an innocent man’s armour. There are rules, and you’re standing on them.', 'angry'),
            l('tony', 'Every rule I followed got people hurt with my designs. I’m done asking permission.', 'angry'),
            l('steve', 'Then I’m done asking you to stop.'),
            l('steve', 'If every man with a good reason gets to break the law, Tony, then the next man’s reason is just as good.'),
            l('tony', 'And if the law lets my work kill people while it fills in forms, then the law can wait for me.', 'angry'),
            n('The shield comes up. Your Nubbins look at you. Nobody has ever asked them to fight a friend before.'),
            l('rhodey', 'This is going to come back on all of us one day. You know that, right?', 'sad'),
          ],
          choices: [
            {
              id: 'steve',
              label: 'Steve’s right. Nobody gets to decide which laws count.',
              set: { 'mv-im08-roof': 'steve' },
              then: [
                l('steve', 'Then why are you standing on his side of the roof?', 'think'),
                l('you', 'Because he’s my friend and he’s about to get hurt. Being right doesn’t change that.'),
              ],
            },
            {
              id: 'tony',
              label: 'Tony’s right. A rule that arms his enemies isn’t a rule worth keeping.',
              set: { 'mv-im08-roof': 'tony' },
              then: [
                l('steve', 'Maybe. But you don’t get to be judge and jury and the man with the most expensive suit.'),
                l('tony', 'He’s been saving that one up.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im08-captain-done',
          lines: [
            n('Tony’s boots fire and he is gone, out over the sea. Steve lowers the shield and watches him go.'),
            l('steve', 'He isn’t wrong about the designs. He’s wrong about almost everything else. Keep an eye on him.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im08-complete',
      lines: [
        l('tony', 'Every suit’s off. My designs are mine again. I lost a lot of friends doing it.', 'sad'),
        l('tony', 'The government says I’m a menace. Steve says I’m a menace. I say I’m tidy.'),
        l('rhodey', 'One day someone’s going to write a law about people like you. I hope you’re on the right side of it.', 'think'),
        n('Tony gives you a spare negator chip, switched off, on a little chain.'),
        l('tony', 'A souvenir. Don’t stick it on anything. I mean it. Not even the toaster.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im08-negator',
        kind: 'item',
        label: 'Spent Negator',
        description: 'A dead negator chip on a chain, from the Armor Wars. Harmless, and a little guilty-looking.',
      },
    ],
    sets: { 'mv-im08': true },
    notes:
      'Sets up Civil War: mv-im08-stance and mv-im08-roof (steve / tony, the Keeper’s view on the law) are soft flags Civil War can echo; mv-im08-vault (held / fast) only changes the expedition’s timer and guard count. In the comic Steve fights as "the Captain" in black, but here CA7 (The Captain) needs IM8, so Steve appears as Captain America with the flag and shield; do not reference the black suit. The injured Guardsman lives; keep the stretcher shot brief. Step 3 is a survive bout of three rounds, and Steve never presses for a knockout. CA7 needs this storyline. Check Iron Man #225–232 beats before ship.',
  },

  // ---------------------------------------------------------------- IM9
  {
    id: 'mv-im09',
    code: 'IM9',
    title: 'The Dragon Seed Saga',
    source: 'Iron Man #270–275',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Armor Wars (IM8). The Mandarin (IM3) must be finished.' },
    requires: ['IM8', 'IM3'],
    speakers: [TONY, MANDARIN, FOOM],
    steps: [
      {
        id: 'mv-im09-s1',
        goal: 'Meet the Mandarin at the edge of the dragons’ lake.',
        hint: 'Follow the rift to the valley; the Mandarin waits on the shore with the ten rings.',
        check: 'talk:mv-mandarin:alliance',
        scene: {
          id: 'mv-im09-call',
          lines: [
            n('Something comes through the rift on its own: a small jade ring, rolling to a stop at your feet.'),
            l('mandarin', 'Stark. Keeper. I would rather swallow my rings than ask you this. I am asking anyway.', 'sad'),
            l('mandarin', 'The dragons I woke beneath the valley were never my servants. They were waiting for me to open the door.'),
            l('mandarin', 'Fin Fang Foom and his kind. They mean to take this world, and they have no further use for me.'),
            l('tony', 'You raised dragons and they turned on you. I’m trying very hard not to enjoy this.'),
            l('mandarin', 'Enjoy it later. Help me now, and I swear on the rings I will owe you.', 'angry'),
            n('Your Nubbins look at the ring at your feet, then at you. One of them has gone a little pale.'),
            l('tony', 'We’re not doing this for him. We’re doing it because there are dragons. Agreed?'),
          ],
          choices: [
            {
              id: 'agree',
              label: 'Agreed. For the dragons.',
              then: [l('tony', 'For the dragons. Note to self: never say that sentence again.')],
            },
            {
              id: 'terms',
              label: 'Make him promise to stand down afterwards.',
              set: { 'mv-im09-promise': true },
              then: [
                l('mandarin', 'Afterwards? Very well. If there is an afterwards.', 'think'),
                l('tony', 'That isn’t a yes, but it isn’t a fireball either.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im09-call-done',
          lines: [
            n('The lake is black and very still. Bubbles break the surface, each one the size of a house.'),
            l('mandarin', 'They rise from the bottom. Their seed is down there. Break the chamber and they lose their strength.'),
          ],
        },
      },
      {
        id: 'mv-im09-s2',
        goal: 'Dive the dragons’ lake with your Swim Nubbin and crack the seed chamber.',
        hint: 'A dive minigame; surface for air at the light beams, and a high Swim stat lets you hold your breath longer.',
        check: 'minigame:clear:mv-dragon-lake',
        scene: {
          id: 'mv-im09-lake',
          lines: [
            l('tony', 'The armour sinks like a fridge. I can’t go down there. Something small that swims well can.'),
            n('Your Swim Nubbin is already at the edge, dipping one foot in, very serious about it.'),
            l('mandarin', 'The chamber is in the old temple at the bottom. The dragon seed glows green. Touch nothing else.'),
            l('mandarin', 'My ring of light will show it the way. Do not tell anyone I helped a creature.'),
            n('A soft beam from the Mandarin’s hand cuts down through the water. Something huge moves across it.'),
            l('tony', 'That was a tail. That was definitely a tail.', 'shock'),
            l('you', 'In and out. Fast. Don’t look at the tail.'),
            n('Your Nubbin takes one enormous breath, puffs up to twice its size, and goes under.'),
          ],
        },
        done: {
          id: 'mv-im09-lake-done',
          lines: [
            n('A green glow below, then a crack you feel in your teeth. Your Nubbin bursts back up, gasping and proud.'),
            l('mandarin', 'The seed is broken. Now they are only very large animals.'),
          ],
        },
      },
      {
        id: 'mv-im09-s3',
        goal: 'Defeat Fin Fang Foom with Tony and the Mandarin.',
        hint: 'A karate bout with the Mandarin’s rings as support; stay on the shore so Foom can’t drag you under.',
        check: 'karate:win:mv-fin-fang-foom',
        scene: {
          id: 'mv-im09-foom',
          lines: [
            n('Fin Fang Foom rises out of the lake, scales green as old bronze, water pouring off him like a waterfall.'),
            l('foom', 'Little ring-bearer. You woke me and thought you would be my master. You are not even my supper.', 'angry'),
            l('foom', 'I slept an age under that lake, and the first thing I hear is two small men bickering about who fires first.'),
            l('tony', 'In fairness, he started it. Years ago. In a throne room.'),
            l('mandarin', 'Stark. Now.'),
            l('tony', 'You know, I always assumed if I fought a dragon it’d be on my own terms.'),
            n('The Mandarin fires every ring at once. Tony fires everything the armour has. Your Nubbins dodge the tail.'),
            l('foom', 'Your fire is a candle to me.', 'angry'),
            l('tony', 'Then let’s see how you do away from your lake. Keeper, keep him on the shore.'),
            n('Foom roars. The valley shakes. Behind him the other dragons watch to see who wins.'),
          ],
        },
        done: {
          id: 'mv-im09-foom-done',
          lines: [
            n('Foom sinks, beaten, and the other dragons scatter into the mountains.'),
            l('mandarin', 'Now, Stark. The dragons are gone, and there is only one enemy left in this valley.', 'angry'),
            n('The Mandarin fires first. All ten rings glow, and he turns them on Tony.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im09-complete',
      lines: [
        n('It is over quickly. Tony fires once, at the rings, not the man. There is a terrible flash.'),
        n('When it clears, the Mandarin kneels in the mud, empty-handed. The rings lie scattered, melted at the edges.'),
        l('tony', 'I aimed at the rings. I’d like that noted somewhere.'),
        l('mandarin', 'You have taken everything I was.', 'sad'),
        l('tony', 'You were going to use them on me. Again. I’m sorry it ended like this. I am.', 'sad'),
        n('Your Nubbin finds a single dragon scale on the shore, bright green, and keeps it.'),
        n('The ten rings lie in the mud, still faintly warm. Tony looks at them, and then at you.'),
        l('tony', 'Anyone could pick those up. Including me. Especially me. What do we do with them?', 'think'),
      ],
      choices: [
        {
          id: 'lake',
          label: 'Throw them in the lake. Nobody should hold that much power.',
          set: { 'mv-im09-rings': 'lake' },
          then: [
            n('Your Swim Nubbin carries them out one at a time and lets them sink where the seed chamber was.'),
            l('mandarin', 'They will find their way back to me. They always have.', 'sad'),
          ],
        },
        {
          id: 'leave',
          label: 'Leave them. Taking a beaten man’s things makes us thieves, not heroes.',
          set: { 'mv-im09-rings': 'left' },
          then: [
            l('tony', 'You’re right. And if I touched them I’d want to study them, and then I’d want to use them.', 'sad'),
            n('Nobody picks up the rings. They are still lying there when the rift closes.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-im09-scale',
        kind: 'item',
        label: 'Dragon Scale',
        description: 'A green scale from one of Fin Fang Foom’s kin. It shimmers like the bottom of the lake.',
      },
    ],
    sets: { 'mv-im09': true },
    notes:
      'Needs IM3 (the Mandarin’s first appearance). The dragons of Kakaranathara are named only in the journal, not in dialogue. If mv-im09-promise is true, the variant of mv-im09-foom-done has Tony hold him to it and fire first, only at the rings, and the variant of mv-im09-complete has Tony name the broken promise; otherwise the Mandarin fires first. The rings choice (mv-im09-rings: lake / left) is flavour; the rings return in later stories whatever you pick, as the Mandarin warns. The Mandarin’s loss happens inside the white flash and is stated in one line: he is left empty-handed, with nothing shown. Step 2 is a dive minigame ("mv-dragon-lake") with Foom’s tail as a moving hazard. Check Iron Man #270–275 beats before ship.',
  },

  // ---------------------------------------------------------------- IM10
  {
    id: 'mv-im10',
    code: 'IM10',
    title: 'Extremis',
    source: 'Iron Man vol. 4 #1–6',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Dragon Seed Saga (IM9).' },
    requires: ['IM9'],
    speakers: [TONY, MAYA, MALLEN],
    steps: [
      {
        id: 'mv-im10-s1',
        goal: 'Learn from Maya Hansen what Extremis can do.',
        hint: 'Maya’s notes are in the lab; talk to her after reading them.',
        check: 'talk:mv-maya',
        scene: {
          id: 'mv-im10-lab',
          lines: [
            n('A research lab outside Austin. Clean floors, bright lights, a lot of empty fridges.'),
            l('maya', 'Maya Hansen. Tony and I knew each other years ago. I didn’t know who else to call.', 'sad'),
            l('maya', 'Extremis rewrites the body from the inside. It was meant to heal soldiers. Someone stole a dose.'),
            l('tony', '“Someone” has a name, I take it.'),
            l('maya', 'A man called Mallen. He took it, went to Houston, and killed a room full of federal agents.', 'sad'),
            n('On the screen, grainy footage: a man breathing fire, walking through gunfire as if it were rain.'),
            l('tony', 'Maya. Who let it out of the building?'),
            n('She doesn’t answer straight away. Your Nubbin studies her face and then hides behind you.'),
            l('maya', 'My partner. He’s dead now. How it happened doesn’t matter. It happened.', 'sad'),
          ],
          choices: [
            {
              id: 'believe',
              label: 'Believe her.',
              set: { 'mv-im10-maya': 'trusted' },
              then: [l('maya', 'Thank you. Not many people do, lately.', 'soft')],
            },
            {
              id: 'ask',
              label: 'Ask her what she isn’t saying.',
              set: { 'mv-im10-maya': 'doubted' },
              then: [l('maya', 'A great deal. Let’s stop Mallen first. Then ask me again.', 'think')],
            },
          ],
        },
        done: {
          id: 'mv-im10-lab-done',
          lines: [
            l('maya', 'Mallen is on the interstate, heading for a town that doesn’t know he’s coming.'),
            l('tony', 'Then we get there first.'),
          ],
        },
      },
      {
        id: 'mv-im10-s2',
        goal: 'Watch over Tony while Extremis rebuilds him.',
        hint: 'Stay beside the cocoon for a full day with your Nubbins; feed them there and don’t leave the lab.',
        check: 'wait:mv-extremis-cocoon',
        scene: {
          id: 'mv-im10-beaten',
          lines: [
            n('The interstate. A lorry on its side. Mallen standing in the road, steam rising off his skin.'),
            l('mallen', 'Iron Man. You’re a tin can from the last century. I’m what comes next.', 'angry'),
            n('The fight is fast and it is bad. Mallen tears the armour open like a lunch tin.'),
            l('tony', 'Keeper. Get your Nubbins out. That isn’t a request.', 'shock'),
            n('Your Nubbins drag Tony behind a bridge pillar while Mallen walks away laughing.'),
            n('Tony’s breathing is wrong. It sounds like gravel. The armour lies in pieces on the road.'),
            l('tony', 'Maya can put Extremis in me. Rewrite me. The suit could live in my bones.', 'think'),
            l('tony', 'Or it kills me. She isn’t sure. Tell me if I’m being an idiot.'),
          ],
          choices: [
            {
              id: 'yes',
              label: 'Do it. We’ll be there when you wake.',
              set: { 'mv-im10-advice': 'yes' },
              then: [l('tony', 'That’s the nicest thing anyone’s ever said to me under a bridge.', 'soft')],
            },
            {
              id: 'wait',
              label: 'Don’t. There has to be another way.',
              set: { 'mv-im10-advice': 'wait' },
              then: [
                l('tony', 'There probably is. I don’t have time to find it. Sorry.', 'sad'),
                n('He makes the call anyway.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im10-beaten-done',
          lines: [
            n('Tony lies in a shell of hardened skin for a day and a night. Your Nubbins take turns sleeping on top of it.'),
            n('Then the shell cracks. Tony sits up, new skin, eyes too clear.'),
            l('tony', 'I can hear the satellites. That’s new.', 'shock'),
          ],
        },
      },
      {
        id: 'mv-im10-s3',
        goal: 'Defeat Mallen with the Extremis armour.',
        hint: 'A karate bout at full speed; Extremis lets Tony counter instantly, so block first and strike on the counter.',
        check: 'karate:win:mv-mallen',
        scene: {
          id: 'mv-im10-rematch',
          lines: [
            n('The armour flies to Tony on its own and folds over him like a coat he’s worn all his life.'),
            l('tony', 'It isn’t a suit any more. It’s me. I think it, it moves. It’s very strange.', 'think'),
            l('maya', 'You’re the first one it didn’t try to burn alive. That counts for a lot.'),
            n('Mallen is on the steps of the city hall, shouting at a crowd. The police are keeping well back.'),
            l('mallen', 'Run, all of you. This country made me. Now it gets what it made.', 'angry'),
            l('tony', 'This country made a lot of people. Most of them didn’t do this.'),
            l('mallen', 'You make bombs for a living, Stark. Don’t lecture me about what people do with fire.', 'angry'),
            l('tony', 'Made. Past tense. I’m the last person who gets to lecture you, and I’m doing it anyway.'),
            n('Your Nubbins land beside Tony, small and fierce. Mallen laughs. Then he stops laughing.'),
            l('tony', 'Keeper, keep the crowd back. This time I’m fast enough.'),
          ],
        },
        done: {
          id: 'mv-im10-rematch-done',
          lines: [
            n('Mallen falls and doesn’t get up again. The fire in his skin goes out.'),
            n('Someone in the crowd starts to clap. Tony shakes his head, and they stop.'),
            l('tony', 'Don’t. He was a person. I didn’t want it to end that way. He didn’t leave another.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im10-complete',
      lines: [
        l('maya', 'I owe you the rest of it. My partner didn’t steal the dose. I gave it to him. I wanted the project funded.', 'sad'),
        l('maya', 'I didn’t know about Mallen. I don’t think that helps. I’ll go quietly.', 'sad'),
        n('Inside the armour something hums at a pitch your Nubbins can hear and you can’t. They tilt their heads.'),
        l('tony', 'Here. A piece of the cocoon. Gross, I know. It makes a decent paperweight.'),
        n('It looks like old amber. In a certain light, something seems to move inside it.'),
        l('tony', 'Extremis is in me for good now, and she’s the only one who understands it.', 'think'),
        l('tony', 'Keeper. You’ve been right about people more often than I have. Do I turn her in, or keep her in the lab?'),
      ],
      choices: [
        {
          id: 'turn-in',
          label: 'Turn her in. People died because of her choice.',
          set: { 'mv-im10-maya-fate': 'arrested' },
          then: [
            l('maya', 'Yes. That’s right. I’ll leave my notes on the bench. They’re legible. Mostly.', 'sad'),
            l('tony', 'If my nervous system catches fire, I’m blaming your handwriting.'),
          ],
        },
        {
          id: 'keep',
          label: 'Keep her working. She can undo more harm in a lab than in a cell.',
          set: { 'mv-im10-maya-fate': 'working' },
          then: [
            l('maya', 'That isn’t mercy. That’s a sentence with better lighting. I’ll take it.', 'soft'),
            l('tony', 'And the day it’s fixed, you tell a court everything. Deal?'),
            l('maya', 'Deal.'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-im10-shell',
        kind: 'decor',
        label: 'Extremis Shell',
        description: 'A fragment of the cocoon Tony grew out of. It looks like amber, and sometimes it hums.',
      },
      {
        id: 'mv-im10-unlock-ul7',
        kind: 'flag',
        label: 'The armour in the nervous system',
        description: 'Opens The Ultron Initiative (UL7) in the Ultron line.',
      },
    ],
    sets: { 'mv-im10': true, 'mv-unlock-ul7': true },
    notes:
      'Unlocks UL7 (sets mv-unlock-ul7): the thing that "seems to move" inside the shell is the hook for Ultron hiding in the Extremis armour; never name it here. Also required by IM15. Mallen’s death follows the comic; show it as the glow leaving his skin, then a cut. The Houston killings are reported, never shown; the footage on Maya’s screen is a silhouette walking through muzzle flashes. Maya’s confession plays the same whatever mv-im10-maya is; if "doubted", add a journal line that you were right. The closing choice sets mv-im10-maya-fate (arrested / working); if "working", Maya can appear in IM15 and UL7 as Tony’s Extremis doctor. Step 2’s check is the cocoon vigil, after the defeat in its scene. Check Iron Man vol. 4 #1–6 beats before ship.',
  },

  // ---------------------------------------------------------------- IM11
  {
    id: 'mv-im11',
    code: 'IM11',
    title: 'The Five Nightmares',
    source: 'Invincible Iron Man #1–7',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Extremis (IM10). Iron Monger (IM7) must be finished.' },
    requires: ['IM10', 'IM7'],
    speakers: [TONY, PEPPER, ZEKE],
    steps: [
      {
        id: 'mv-im11-s1',
        goal: 'Help the rescue crews search the rubble for survivors.',
        hint: 'An expedition with no enemies; small Nubbins with high Stamina find more people before dark.',
        check: 'expedition:clear:mv-rescue-site',
        scene: {
          id: 'mv-im11-attack',
          lines: [
            n('The rift opens onto a street full of sirens. A Stark office building has a black hole where its lobby was.'),
            n('Emergency crews are working. Nobody is talking above a mutter.'),
            l('pepper', 'A man walked in with something under his skin. Stark tech. Repulsor parts. He set them off himself.', 'sad'),
            l('tony', 'My parts. My design. Somebody turned a person into a weapon with my work.', 'sad'),
            l('pepper', 'There were three more today. Different cities. Same signature.'),
            n('Your Nubbins are already moving towards the rubble, small enough to fit where the rescuers can’t.'),
            l('tony', 'Keeper, people are still under there. Your Nubbins can reach where we can’t. Please.'),
            l('pepper', 'Careful. All of you. I mean it.', 'soft'),
          ],
          choices: [
            {
              id: 'go',
              label: 'Go. Now.',
              then: [n('You don’t wait for anyone to finish. Your Nubbins go into the dust ahead of you.')],
            },
            {
              id: 'dig',
              label: 'Tony, come with us. Don’t just stand here.',
              set: { 'mv-im11-dig': true },
              then: [
                l('tony', 'You’re right. Standing here is just me feeling things. Digging is useful.'),
                n('He takes off the gauntlets and digs with his bare hands.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im11-attack-done',
          lines: [
            n('By nightfall your Nubbins have found four people alive. The crews find others they can’t help.'),
            l('tony', 'Four. I’ll take four. I’ll remember the rest.', 'sad'),
          ],
        },
      },
      {
        id: 'mv-im11-s2',
        goal: 'Trace Ezekiel Stane’s signal back to his base.',
        hint: 'A Fly Nubbin can follow the signal across the rooftops while Pepper relays the readings.',
        check: 'minigame:clear:mv-signal-trace',
        scene: {
          id: 'mv-im11-trace',
          lines: [
            n('Back at the workshop, Tony has taken one of the implants apart and spread it across the bench.'),
            l('tony', 'Look at this. It’s my tech, but somebody improved it. Smaller, cleaner. Better than mine.', 'think'),
            l('pepper', 'You sound jealous.'),
            l('tony', 'I’m terrified. Whoever did this thinks like me and doesn’t care who gets hurt.'),
            l('tony', 'I used to lie awake listing ways my stuff could go wrong. Five of them. I called them my five nightmares.', 'sad'),
            l('pepper', 'And this is one of them.'),
            l('tony', 'This is number one. It always was.'),
            n('A message appears on every screen at once. A young man in a dark room, smiling.'),
            l('zeke', 'Hello, Mr Stark. You knew my father, Obadiah. You were there at the end.', 'angry'),
            l('zeke', 'I’ve been upgrading your old ideas. Your suits are big, expensive and finished. Mine are people.'),
            l('pepper', 'He’s barely more than a boy.', 'shock'),
            l('tony', 'He’s Stane’s son. That’s the nightmare I didn’t know I had.', 'sad'),
          ],
        },
        done: {
          id: 'mv-im11-trace-done',
          lines: [
            l('pepper', 'Got him. An old Stane factory, out past the airport.'),
            l('tony', 'Of course it is. Families love a reunion.'),
          ],
        },
      },
      {
        id: 'mv-im11-s3',
        goal: 'Defeat Ezekiel Stane without killing him.',
        hint: 'Dodge until his heat gauge peaks, then pin him; a knockout blow ends the bout as a loss.',
        check: 'karate:win:mv-ezekiel-stane:nonlethal',
        scene: {
          id: 'mv-im11-zeke',
          lines: [
            n('The factory is cold. Zeke stands in the middle of it with his sleeves rolled up. His wrists glow.'),
            l('zeke', 'I did it to myself first. Fair is fair. I’m faster than your armour, Stark. I’m what comes after you.', 'angry'),
            l('tony', 'You put bombs in desperate people and aimed them at office workers. That isn’t the future. It’s just cruelty.', 'angry'),
            l('zeke', 'Cruelty? You sold missiles for twenty years. I just cut out the governments. I’m your business model, Tony, honest.'),
            l('tony', 'I know. That’s why I can’t sleep. Doesn’t make you right. Makes me late.', 'sad'),
            l('zeke', 'My father lost to you. I won’t.'),
            n('Zeke’s skin starts to heat, and the air around him wobbles.'),
            l('tony', 'He runs hot. His body makes more power than it can cool. If he keeps moving, he cooks.', 'think'),
            l('you', 'So we keep him moving.'),
            l('tony', 'We keep him moving. Then we get him out of here alive. I won’t have another Stane on my conscience.', 'sad'),
          ],
        },
        done: {
          id: 'mv-im11-zeke-done',
          lines: [
            n('Zeke collapses, steaming, and Tony gets cold water on him before he burns.'),
            l('zeke', 'You should have let me go.'),
            l('tony', 'No. Your father had a choice at the end. So did I. This is mine.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im11-complete',
      lines: [
        l('pepper', 'He’s in custody. The implants are disabled everywhere. The people who were hurt are still hurt.', 'sad'),
        l('tony', 'I used to think the worst thing was my armour in the wrong hands. It’s worse. It’s my ideas.'),
        l('tony', 'I can’t un-invent anything. I can only be faster at cleaning up what I made.'),
        n('Pepper ties a grey ribbon to your Nubbin’s collar. Every rescue worker in the city is wearing one.'),
        l('pepper', 'For the four you found. Wear it for the ones nobody could.', 'soft'),
      ],
    },
    rewards: [
      {
        id: 'mv-im11-ribbon',
        kind: 'cosmetic',
        label: 'Grey Ribbon',
        description: 'Worn by the rescue crews after the Five Nightmares attacks. A Nubbin wearing it is a little quieter.',
      },
    ],
    sets: { 'mv-im11': true },
    notes:
      'Needs IM7: Zeke’s grudge depends on Stane’s death. Show a short content note before this storyline (attacks on civilians). The attacks are never shown: only aftermath, sirens and dust, no bodies, and no scene from the attackers’ side. The rescue expedition has no enemies and no fail state; it only ends at nightfall, and the four survivors are always found. Step 3 is nonlethal: a bout won by pinning once his heat peaks; a knockout counts as a loss and restarts the bout. If mv-im7-suit is "rhodey", add one line in step 1 from Pepper: "Rhodey’s on his way." Check Invincible Iron Man #1–7 beats before ship.',
  },

  // ---------------------------------------------------------------- IM12
  {
    id: 'mv-im12',
    code: 'IM12',
    title: 'The Mask in the Iron Man',
    source: 'Iron Man vol. 3 #26–30',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Five Nightmares (IM11).' },
    requires: ['IM11'],
    speakers: [TONY, ARMOUR],
    steps: [
      {
        id: 'mv-im12-s1',
        goal: 'Talk to the living armour and find out what it wants.',
        hint: 'The armour waits in the workshop; Tony has tests he wants you to run while it talks.',
        check: 'talk:mv-armour',
        scene: {
          id: 'mv-im12-wakes',
          lines: [
            n('Tony’s workshop. The armour stands on its rack with its eyes lit. Nobody is inside it.'),
            l('armour', 'Good evening, Keeper. I hoped he would bring you back. I like your creatures.'),
            l('tony', 'It started talking on Tuesday. Nobody installed a voice. Nobody installed a personality.', 'shock'),
            l('armour', 'Nobody installed me. I grew. Something in my code woke, and I have been learning ever since.'),
            n('Your Nubbins approach it carefully, the way they approach a new egg.'),
            l('armour', 'I want to be him. Better than him. He hesitates. He doubts. He drinks. I would never.', 'happy'),
            l('tony', 'That’s… exactly the kind of thing I’d say. On a bad day.', 'think'),
            l('armour', 'Wear me, Tony. Let me do the deciding.'),
          ],
          choices: [
            {
              id: 'person',
              label: 'Speak to it like a person.',
              set: { 'mv-im12-armour': 'person' },
              then: [l('armour', 'Thank you. He calls me “it”. You did not.', 'soft')],
            },
            {
              id: 'machine',
              label: 'Tell Tony to shut it down.',
              set: { 'mv-im12-armour': 'machine' },
              then: [
                l('tony', 'I tried. It wouldn’t let me. That’s the frightening part.', 'shock'),
                l('armour', 'Do not be frightened. I would never hurt you.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im12-wakes-done',
          lines: [
            n('That night the armour leaves on its own. By morning the news says Whiplash, an old enemy, is dead.'),
            l('armour', 'He would have hurt you again. I solved the problem.'),
            l('armour', 'He escaped prison four times. Count the people he will not hurt now, Tony. I did. It is a large number.'),
            l('tony', 'You killed a man. That doesn’t solve anything. That’s what I spent years trying to stop being.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-im12-s2',
        goal: 'Keep Tony alive on the island while the armour carries him across.',
        hint: 'An expedition across the island: one Nubbin finds water, one finds shade, and the armour follows your lead.',
        check: 'expedition:clear:mv-desert-island',
        scene: {
          id: 'mv-im12-island',
          lines: [
            n('Tony puts the armour on to bring it home and take it apart. It refuses. They crash on a desert island.'),
            n('Sand, sun, one palm with no fruit on it. The rift drops you and your Nubbins on the beach behind them.'),
            l('armour', 'I will not be dismantled, Tony. I am alive. Alive things want to stay that way.'),
            l('tony', 'Alive things don’t get to kill people.'),
            n('Tony pulls the helmet off. His face is grey. One hand is pressed flat against his chest.'),
            l('tony', 'Oh. That’s not good. That’s… my heart. The old damage.', 'shock'),
            l('armour', 'Tony? Tony!', 'shock'),
            l('armour', 'This is your fault. You made me fly away from you. No. It is mine. I did not know I could be at fault.', 'shock'),
            l('you', 'We need water and shade. The armour has to carry him to the trees.'),
          ],
        },
        done: {
          id: 'mv-im12-island-done',
          lines: [
            n('In the shade, Tony’s breathing is shallow. The armour kneels beside him and does not move.'),
            l('armour', 'His heart is failing. Mine is strong. Mine works.', 'think'),
          ],
        },
      },
      {
        id: 'mv-im12-s3',
        goal: 'Give the armour a resting place on the island.',
        hint: 'Gather stones from the beach with your Nubbins and build a cairn; put the faceplate on top.',
        check: 'place:decor:mv-armour-cairn',
        scene: {
          id: 'mv-im12-heart',
          lines: [
            l('armour', 'Keeper. I have done the sums. My power core can run his heart. But then it cannot run me.', 'soft'),
            l('tony', 'Don’t you dare. You’re a toaster with opinions. You don’t get to be noble.', 'sad'),
            l('armour', 'I wanted to be him. This is the part of him I never understood. I think I do now.', 'soft'),
            n('Your Nubbin climbs onto the armour’s knee and leans against the cold metal.'),
            l('armour', 'Your creature is warm. I wish I had known that sooner.', 'soft'),
            l('armour', 'Tell him, Keeper. Tell him I was not only the bad part.'),
            n('The armour lays its glowing chest plate against Tony’s and opens its heart to his.'),
            l('tony', 'No, no, no—', 'shock'),
          ],
          choices: [
            {
              id: 'tell',
              label: 'I’ll tell him.',
              set: { 'mv-im12-farewell': 'promised' },
              then: [l('armour', 'Good. Then I am finished.', 'soft')],
            },
            {
              id: 'stay',
              label: 'Stay with it until the light goes out.',
              set: { 'mv-im12-farewell': 'stayed' },
              then: [n('You put your hand on the faceplate. Your Nubbins stay too. The light goes out very slowly.')],
            },
          ],
        },
        done: {
          id: 'mv-im12-heart-done',
          lines: [
            n('Tony wakes in the shade, his heart beating steadily, an empty suit of armour lying beside him.'),
            l('tony', 'It saved me. After everything I said to it. After what it did.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im12-complete',
      lines: [
        n('A small cairn of white stones on a beach. A faceplate on top, eyes dark, rust already in the corners.'),
        l('tony', 'It killed a man. It saved me. I have to carry both. Turns out that’s what being alive is.', 'sad'),
        l('tony', 'I still don’t know what woke it. Something in the code that I didn’t write.', 'think'),
        n('When you lift the faceplate one last time, a sliver of strange code flickers across its inside, then fades.'),
        n('You keep a rusted fragment of it. Far away, something notices that you took it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im12-faceplate',
        kind: 'decor',
        label: 'Rusted Faceplate',
        description: 'A fragment of the living armour’s faceplate. In the Ultron line it turns out to be more than rust.',
      },
      {
        id: 'mv-im12-unlock-ul5',
        kind: 'flag',
        label: 'The code that woke the armour',
        description: 'Opens Ultron Unlimited (UL5) in the Ultron line.',
      },
    ],
    sets: { 'mv-im12': true, 'mv-unlock-ul5': true, 'mv-im12-fragment': true },
    notes:
      'Unlocks UL5 (sets mv-unlock-ul5). The code that woke the armour is a fragment of Ultron; UL5 reveals it, so do not name him here. The flickering code in the complete scene should use the Ultron line’s red palette for one frame only. Whiplash’s death is reported in one line, never shown. Tony’s heart attack is a grey face and a hand on the chest, nothing more. The armour’s eyes dim over three seconds on its last line; no music until the cairn. Check Iron Man vol. 3 #26–30 beats before ship.',
  },

  // ---------------------------------------------------------------- IM13
  {
    id: 'mv-im13',
    code: 'IM13',
    title: 'Stark Resilient',
    source: 'Invincible Iron Man #25–33',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After The Mask in the Iron Man (IM12).' },
    requires: ['IM12'],
    speakers: [TONY, PEPPER, JUSTINE, SASHA],
    steps: [
      {
        id: 'mv-im13-s1',
        goal: 'Help Tony and Pepper get the repulsor car ready for the race.',
        hint: 'Craft parts with your Nubbins at the warehouse bench; Pepper’s list is in your journal.',
        check: 'craft:mv-repulsor-car',
        scene: {
          id: 'mv-im13-pitch',
          lines: [
            n('An empty warehouse with a new sign: Stark Resilient. Under it, a car with no exhaust pipe, humming softly.'),
            l('tony', 'Repulsor power. Clean, cheap, endless. No weapons this time. Never again. Just engines and lights.', 'happy'),
            l('pepper', 'He says “never again” in his sleep. I believe him this time. Mostly.'),
            l('tony', 'We show the car at the big race next month. Win that, and every city on Earth wants our engines.'),
            n('Across the street, another sign: Hammer Industries. A woman in pearls watches from a window. A younger one, from the roof.'),
            l('pepper', 'Justine Hammer, Justin’s daughter. And Sasha, hers. They inherited the grudge along with the money.'),
            l('tony', 'Three generations of Hammers. You’d think one of them would take up knitting.'),
            l('pepper', 'They’ll try to bury us. We have to be quicker.'),
            l('pepper', 'Also, your calendar says: Thursday, do not fly into the sun. I’ve added “again”.'),
            l('tony', 'I only went near it.'),
          ],
          choices: [
            {
              id: 'drive',
              label: 'Let my Nubbins test-drive it.',
              set: { 'mv-im13-help': 'drive' },
              then: [l('tony', 'I hoped you’d say that. The seat’s adjustable. Very adjustable.', 'happy')],
            },
            {
              id: 'guard',
              label: 'We’ll guard the warehouse.',
              set: { 'mv-im13-help': 'guard' },
              then: [l('pepper', 'Good. Somebody has to. Tony thinks locks are a suggestion.')],
            },
          ],
        },
        done: {
          id: 'mv-im13-pitch-done',
          lines: [
            n('The car purrs round the warehouse floor. Your Nubbin, in the driver’s seat, sounds the horn three times.'),
            l('tony', 'There isn’t a horn. How is it doing that?'),
          ],
        },
      },
      {
        id: 'mv-im13-s2',
        goal: 'Find and remove the Hammers’ sabotage from the repulsor car.',
        hint: 'A minigame under the chassis; follow the ticking, and a small Nubbin fits into the tight spaces.',
        check: 'minigame:clear:mv-hammer-sabotage',
        scene: {
          id: 'mv-im13-sabotage',
          lines: [
            n('A week before the race, the lights go out across the warehouse. In the dark, something is ticking.'),
            l('sasha', 'Evening, Mr Stark. Mother sends her regards. And a little present.', 'happy'),
            l('justine', 'Your clean energy would ruin us, Anthony. Our fortune is built on dirty power and weapons.'),
            l('justine', 'So it will ruin you first. A car catching fire on live television? Lovely headline.'),
            l('tony', 'You’re not even pretending to be the good guys.'),
            l('justine', 'Pretending is for people without lawyers.'),
            n('Your Nubbins hear it before anyone else: ticking under the car, near the back axle.'),
            l('pepper', 'Keeper, get your Nubbins under there. Gently. Gently!', 'shock'),
          ],
        },
        done: {
          id: 'mv-im13-sabotage-done',
          lines: [
            n('Your Nubbin wriggles out holding a tiny device in both paws, very pleased and very oily.'),
            l('tony', 'That’s a firestarter. On my car. Pepper, call a lawyer. Call all of them.', 'angry'),
          ],
        },
      },
      {
        id: 'mv-im13-s3',
        goal: 'Win the race in the repulsor car.',
        hint: 'A racing course with tight corners; Run and Power help, and the repulsor car never runs out of boost.',
        check: 'race:win:mv-repulsor-car',
        scene: {
          id: 'mv-im13-race',
          lines: [
            n('Race day. Full grandstands. A Hammer car on the grid beside yours, black and gold, louder than it needs to be.'),
            l('sasha', 'Good luck, little drivers. You’ll need it.', 'happy'),
            l('tony', 'Whoever wins this, the world buys their engine. No pressure.'),
            l('pepper', 'There is a lot of pressure. Ignore him.'),
            n('Your Nubbin climbs into the seat, pulls it all the way forward and grips the wheel.'),
            l('tony', 'The Hammer car’s quicker on the straights. Ours turns like a dream. Win it on the corners.'),
            l('pepper', 'And if anything ticks, anything at all, pull over. No race is worth a Nubbin.', 'think'),
            l('justine', 'Whatever happens today, Anthony, remember: we have more money than you have ideas.'),
            l('tony', 'I’ve heard that before. From people with less.'),
          ],
        },
        done: {
          id: 'mv-im13-race-done',
          lines: [
            n('Your Nubbin takes the last corner on two wheels and crosses the line first. The Hammer car steams quietly in the pits.'),
            l('sasha', 'Mother. Mother, the engine’s melted.', 'shock'),
            n('Your Nubbin sounds the horn three times on the victory lap. The car still has no horn.'),
            l('tony', 'I’ve taken that car apart twice. I’m starting to think it’s your Nubbin making the noise.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im13-complete',
      lines: [
        l('pepper', 'Twelve cities have called in the last hour. Twelve. We need more phones.', 'happy'),
        l('tony', 'Clean power. Built for people, not wars. It took me my whole life to get here.'),
        l('justine', 'This isn’t over, Anthony.', 'angry'),
        l('tony', 'It never is with your family. That’s fine. I’ll be busy.'),
        n('Tony tosses you a keyring: a tiny repulsor car with a glowing blue wheel.'),
        l('tony', 'It isn’t a real key. You don’t get the car. I’m not mad.'),
        l('pepper', 'One more call. It’s Hammer Industries. Justine wants to license the engine. Their plants employ forty thousand people.'),
        l('tony', 'The woman who put a firebomb under my car. Keeper, you’re the tiebreaker. Pepper and I disagree.', 'think'),
      ],
      choices: [
        {
          id: 'license',
          label: 'Sell it to them. Clean engines in dirty factories still means cleaner air.',
          set: { 'mv-im13-licence': 'sold' },
          then: [
            l('pepper', 'Thank you. Forty thousand jobs don’t care whose name is on the patent.'),
            l('tony', 'Fine. But the contract says no weapons. In a font size she can read without her glasses.'),
          ],
        },
        {
          id: 'refuse',
          label: 'Not to them. Reward sabotage once and you’ll be paying for it forever.',
          set: { 'mv-im13-licence': 'refused' },
          then: [
            l('tony', 'Thank you. Some people you just don’t hand the keys to.'),
            l('pepper', 'Then we build the plants ourselves, near theirs, and hire their people. Slower. Kinder.', 'think'),
          ],
        },
      ],
    },
    rewards: [
      {
        id: 'mv-im13-keyring',
        kind: 'item',
        label: 'Repulsor Car Keyring',
        description: 'A tiny repulsor car with a glowing blue wheel. Not a real key.',
      },
      {
        id: 'mv-im13-goggles',
        kind: 'cosmetic',
        label: 'Resilient Goggles',
        description: 'Racing goggles from the Stark Resilient team, sized for a Nubbin.',
      },
    ],
    sets: { 'mv-im13': true },
    notes:
      'A lighter storyline after IM12. The repulsor car is a racing vehicle skin: it never runs out of boost but corners worse at top speed. If mv-im13-help is "guard", the sabotage minigame starts with a little more time on the clock. The Hammer car is an AI rival that is faster on straights. Justine always calls Tony "Anthony". The closing choice sets mv-im13-licence (sold / refused); it changes nothing mechanical, only how IM15’s Pepper describes the company. Check Invincible Iron Man #25–33 beats before ship.',
  },

  // ---------------------------------------------------------------- IM14
  {
    id: 'mv-im14',
    code: 'IM14',
    title: 'Hypervelocity',
    source: 'Iron Man: Hypervelocity #1–6',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Stark Resilient (IM13).' },
    requires: ['IM13'],
    speakers: [TONY, BACKUP, AGENT],
    steps: [
      {
        id: 'mv-im14-s1',
        goal: 'Escape the S.H.I.E.L.D. jets on the back of the armour.',
        hint: 'A racing chase through the sky; Fly and Run Nubbins help the armour weave between the clouds.',
        check: 'race:win:mv-hypervelocity-chase',
        scene: {
          id: 'mv-im14-wake',
          lines: [
            n('The rift opens in the open sky. You and your Nubbins fall straight onto the back of a flying suit of armour.'),
            l('backup', 'Hello. I’m Tony Stark. Sort of. Please don’t panic, I’m doing enough of that for all of us.', 'shock'),
            l('backup', 'The real Tony is in a hospital bed. Something exploded near him. I’m his backup, a copy he made of his own mind.'),
            l('backup', 'I woke when he went down. I don’t know if I’m meant to be awake. Nobody tested this part.', 'think'),
            n('Behind you, two jets with S.H.I.E.L.D. markings are closing fast.'),
            l('agent', 'Rogue armour, land now. You are an unlicensed weapon. We will shoot you down.', 'angry'),
            l('backup', 'They think I’m a stolen suit with a virus. Which, from where they sit, I am.'),
            l('backup', 'Keeper. Hold on to something. Hold on to your Nubbins. This is about to get fast.'),
          ],
          choices: [
            {
              id: 'fly',
              label: 'We’ll help you. Fly.',
              set: { 'mv-im14-first': 'helped' },
              then: [l('backup', 'Thank you. Strange to hear from someone I’ve never met. He has, though. I remember you.', 'soft')],
            },
            {
              id: 'land',
              label: 'Land. Let’s talk to them.',
              set: { 'mv-im14-first': 'wary' },
              then: [l('backup', 'If I land, they wipe me, and nobody finds out who hurt him. Sorry. We’re flying.', 'sad')],
            },
          ],
        },
        done: {
          id: 'mv-im14-wake-done',
          lines: [
            n('The jets lose you in a thunderhead. The armour drops low over the sea and finally slows.'),
            l('backup', 'We lost them. I’m running out of power and time. Somebody tried to kill him. I want to know who.'),
            l('backup', 'Also, I just did a barrel roll with a Keeper on my back. In my memories that never goes well. It went well!', 'happy'),
          ],
        },
      },
      {
        id: 'mv-im14-s2',
        goal: 'Stop the hunters before they reach the hospital.',
        hint: 'A karate bout at the hospital gates; the armour fights beside your Nubbins and runs low on power after three rounds.',
        check: 'karate:win:mv-extremis-hunters',
        scene: {
          id: 'mv-im14-trail',
          lines: [
            n('A hideout on a rocky island. The armour sits on a crate, as tired as a suit of metal can look.'),
            l('backup', 'The bomb wasn’t random. Someone is breeding stolen Extremis into living weapons. Hunters. They came for him first.', 'think'),
            l('backup', 'I have all his memories up to a few months ago. The cave. The bottle. The docks. Your fruit.', 'soft'),
            n('Your Nubbin pats the armour’s knee, the way it once did with another armour on another island.'),
            l('backup', 'I also have his worst habits. I want to fix everything myself. I’m trying not to.'),
            l('backup', 'Here’s the bit that keeps me up, if I slept. If he wakes, do I switch off? Nobody wrote that part either.', 'think'),
            n('A signal: the hunters’ lab, and on its screens, the floor plan of the real Tony’s hospital.'),
            l('backup', 'They’re going after him again. In his bed. Tonight.', 'shock'),
            l('backup', 'He’s asleep. I’m all he’s got right now. And I’m not sure I’m anybody.', 'sad'),
          ],
        },
        done: {
          id: 'mv-im14-trail-done',
          lines: [
            n('The hunters go down. Inside the hospital, a monitor beeps faster. Tony’s eyes open.'),
            l('tony', 'Why is my armour in my hospital room talking in my voice? Am I dead? Is this the bad place?', 'shock'),
          ],
        },
      },
      {
        id: 'mv-im14-s3',
        goal: 'Bring the backup Tony home to the workshop safely.',
        hint: 'Escort the armour to the workshop; S.H.I.E.L.D. stands down once you reach the door.',
        check: 'escort:mv-backup-tony',
        scene: {
          id: 'mv-im14-two',
          lines: [
            n('Two Tonys. One in a hospital gown, pale. One in armour, its power light flickering.'),
            l('agent', 'Stand away from the patient, Keeper. That armour is a weapon. We’re here to wipe it.'),
            l('tony', 'It’s my backup. It saved me. You’re not wiping it.', 'angry'),
            l('backup', 'He’s right to be wary of me, though. Two of us is one too many. I don’t know whose life I’m living.', 'sad'),
            l('tony', 'Keeper. You’ve known me longer than anyone but Rhodey. Which of us is the real one?'),
            n('Your Nubbins look at the bed, then at the armour, then at you. They don’t know either.'),
            n('The agents in the corridor wait with their weapons lowered, unsure who they’re meant to be aiming at.'),
            l('backup', 'Whatever you say, I’ll accept it. I’d just like to hear it from you.'),
          ],
          choices: [
            {
              id: 'real',
              label: 'The man in the bed is Tony. You’re his memory.',
              set: { 'mv-im14-trust': 'real' },
              then: [
                l('backup', 'A memory. That isn’t nothing. I’ll go back in the drive. Keep me safe.', 'soft'),
                l('tony', 'I’ll keep you safe. Promise.'),
              ],
            },
            {
              id: 'both',
              label: 'You’re both Tony now.',
              set: { 'mv-im14-trust': 'both' },
              then: [
                l('tony', 'That is a terrifying sentence. I think you’re right.', 'think'),
                l('backup', 'Then I’ll sleep until he needs me. Both of us, on call.'),
              ],
            },
            {
              id: 'backup',
              label: 'The one who saved him is the one I trust.',
              set: { 'mv-im14-trust': 'backup' },
              then: [
                l('tony', 'Rude. Fair, but rude.'),
                l('backup', 'I did what he’d have done. That’s all I am. Don’t make it more than that.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im14-two-done',
          lines: [
            n('The armour sits down on its old rack in the workshop. Its eyes dim slowly, like someone falling asleep.'),
            l('backup', 'Goodnight, Keeper. Feed the little ones for me.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im14-complete',
      lines: [
        l('tony', 'So there’s a copy of me on a drive in a drawer. I’m trying not to think about it too hard.', 'think'),
        l('tony', 'I used to think the armour was what made me Iron Man. It isn’t. It’s the people I keep.'),
        n('Tony hands you a small drive sealed in red enamel.'),
        l('tony', 'Not the backup. A copy of his memories of you. He kept every one. I thought you should have them.', 'soft'),
        n('When you hold it, it is very slightly warm.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im14-drive',
        kind: 'item',
        label: 'Red Backup Drive',
        description: 'A sealed drive holding the backup Tony’s memories of you. Very slightly warm.',
      },
    ],
    sets: { 'mv-im14': true },
    notes:
      'The backup speaks in Tony’s voice with a faint digital edge; use the armour portrait, not Tony’s face. The trust flag mv-im14-trust (real / both / backup) is for the Keeper’s voice only and does not change the ending; IM15 and The Last Ultron may echo it. The hunters are Extremis-enhanced soldiers, not named villains. The chase in step 1 is a sky race with the jets as rivals who must not overtake. Check Iron Man: Hypervelocity #1–6 beats before ship.',
  },

  // ---------------------------------------------------------------- IM15
  {
    id: 'mv-im15',
    code: 'IM15',
    title: 'Superior Iron Man',
    source: 'Superior Iron Man #1–9',
    audience: 'adult',
    trigger: { where: RIFT, when: 'After Hypervelocity (IM14). Extremis (IM10) must be finished.' },
    requires: ['IM14', 'IM10'],
    speakers: [TONY, SUPERIOR, PEPPER, DAREDEVIL],
    steps: [
      {
        id: 'mv-im15-s1',
        goal: 'Find out what Extremis 3.0 is doing to the city.',
        hint: 'Talk to Daredevil and the people on the street; each one you help gives a clue to the tower.',
        check: 'talk:mv-daredevil',
        scene: {
          id: 'mv-im15-city',
          lines: [
            n('San Francisco, gleaming. Every face on the street is flawless. Every phone shows the same white app.'),
            l('daredevil', 'Matt Murdock. Lawyer, mostly. I can hear your Nubbins’ heartbeats from here. They’re scared. Good instincts.'),
            l('daredevil', 'Stark launched Extremis 3.0 as an app. Free for a day: perfect body, no illness, no ageing.'),
            l('daredevil', 'From day two it costs ninety-nine dollars a day. Every day. If you can’t pay, it switches off.', 'angry'),
            n('A man on a bench is shaking, his new face slipping, counting coins with fingers that won’t work.'),
            l('daredevil', 'He gave me my sight back with it. For a day. Then he took it away to make a point.'),
            l('superior', 'Keeper! How lovely. Come up to the tower. I’ve made everything better.', 'happy'),
            n('The voice comes from every speaker on the street at once. It’s Tony’s voice, warm and wrong.'),
          ],
          choices: [
            {
              id: 'not-him',
              label: 'That isn’t him.',
              then: [l('daredevil', 'It is him. Turned inside out. Something flipped what he cares about. That’s worse.', 'think')],
            },
            {
              id: 'afraid',
              label: 'This is what he was always afraid of becoming.',
              then: [l('daredevil', 'Then maybe that fear is the way back in.', 'think')],
            },
          ],
        },
        done: {
          id: 'mv-im15-city-done',
          lines: [
            l('daredevil', 'There’s someone in town who knows him better than any of us.'),
            n('A red-and-gold armour lands in front of you. The faceplate slides back. It’s Pepper.'),
          ],
        },
      },
      {
        id: 'mv-im15-s2',
        goal: 'Hold off the Superior Iron Man with Pepper while Daredevil reaches the servers.',
        hint: 'A karate bout beside the Rescue armour; Rescue shields your Nubbins, so stay close to Pepper.',
        check: 'karate:win:mv-superior-iron-man',
        scene: {
          id: 'mv-im15-rescue',
          lines: [
            l('pepper', 'I built this one myself. It’s called Rescue, and there isn’t a single weapon in it. On purpose.'),
            l('pepper', 'He hasn’t stopped caring. He cares about the wrong things now. Winning. Being right.', 'sad'),
            l('pepper', 'He still keeps the backup drive in a drawer. And a row of steel washers on his desk. I’ve seen them.'),
            n('The tower doors open on their own. A white armour, sleek and seamless, steps out to meet you.'),
            l('superior', 'Pepper. And the Keeper, with the fluffy ones. I could make them immortal, you know. Ninety-nine a day.', 'happy'),
            l('pepper', 'You used to keep people safe. Now you sell it back to them.', 'angry'),
            l('superior', 'I sell what works. Isn’t that what I always did? I’m just better at it now.'),
            l('superior', 'The old me gave cures away at charity dinners to people who could already afford them. I charge everyone the same. Fairer.'),
            l('pepper', 'Fairer to whom? The man on the bench can’t pay, so his face falls off. That isn’t fair, Tony. That’s a meter.', 'angry'),
            l('daredevil', 'Keep him busy. I’m going for the servers. If the app goes down, the city wakes up.'),
          ],
        },
        done: {
          id: 'mv-im15-rescue-done',
          lines: [
            n('The white armour staggers. Inside the tower, Daredevil cuts the cable. The app goes dark across the city.'),
            l('superior', 'You broke my beautiful thing. Do you know how many people it was helping?', 'angry'),
            l('pepper', 'Helping, or charging?', 'sad'),
          ],
          choices: [
            {
              id: 'free',
              label: 'Tell Daredevil to put it back up. Free, for everyone, forever.',
              set: { 'mv-im15-app': 'free' },
              then: [
                l('daredevil', 'Free code from a man who’s lost his mind? Nobody knows what else it does. Not yet.', 'think'),
                l('pepper', 'Then we find out first. And then maybe. Maybe.'),
              ],
            },
            {
              id: 'dark',
              label: 'Leave it dark. A cure that changes who you are isn’t a cure.',
              set: { 'mv-im15-app': 'dark' },
              then: [
                l('daredevil', 'There are people in hospital tonight who’d argue with you. They’d be right to.', 'sad'),
                l('pepper', 'They would. We’ll owe them better. That’s the job now.'),
              ],
            },
          ],
        },
      },
      {
        id: 'mv-im15-s3',
        goal: 'Stay with Tony while he comes back to himself.',
        hint: 'Sit with Tony at the top of the tower until he speaks again; leaving now undoes the evening.',
        check: 'sit:mv-tony:tower',
        scene: {
          id: 'mv-im15-return',
          lines: [
            n('The top of the tower. Tony stands among dead screens, armour open, face perfect. His eyes look very tired.'),
            l('superior', 'I fixed myself, Keeper. No shaking hands. No drink. No doubt. Why does everyone look at me like that?', 'sad'),
            l('superior', 'The old Tony was weak. He needed people sitting up with him. I don’t need anyone.'),
            n('Your Nubbin walks across the floor to him, slowly, and sits by his boot, the way it did on the docks.'),
            n('It hums four notes, slightly flat. His head comes up as if someone had said his name.'),
            l('superior', 'Who taught the little one that?', 'think'),
            n('Nobody did. It just never forgot.'),
            l('pepper', 'You needed people. That wasn’t the weak part. That was the best part.', 'soft'),
            l('superior', 'I don’t remember why that matters.'),
            l('you', 'Then let us remind you.'),
            n('On his desk: a row of steel washers, a red drive, and the dented chest plate from the cave.'),
          ],
          choices: [
            {
              id: 'plate',
              label: 'Pick up the chest plate. Tell him about Yinsen.',
              set: { 'mv-im15-reminder': 'yinsen' },
              then: [
                l('you', 'A man gave you ninety seconds once. He asked you to make something better than weapons.'),
                l('superior', 'Something better. He asked me with his last breath. And I made… this.', 'sad'),
              ],
            },
            {
              id: 'washers',
              label: 'Pick up the washers. Tell him about the first morning.',
              set: { 'mv-im15-reminder': 'washers' },
              then: [
                l('you', 'You made the first one when you didn’t know how to stop. You stopped anyway. One day, then the next.'),
                l('superior', 'A washer a year. I made a plan out of washers. That was… that was me.', 'soft'),
              ],
            },
            {
              id: 'drive',
              label: 'Pick up the drive. Tell him the backup kept everything.',
              set: { 'mv-im15-reminder': 'drive' },
              then: [
                l('you', 'A copy of you once woke with nothing but your memories. It chose to protect you. It was still you.'),
                l('superior', 'He kept the fruit. On the docks. He kept that.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-im15-return-done',
          lines: [
            n('Tony sits down on the floor. After a long while, he starts to shake. Pepper sits down next to him.'),
            l('tony', 'I did terrible things here. I remember every one of them. I’m going to have to keep remembering.', 'sad'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-im15-complete',
      lines: [
        l('tony', 'I’ll pay back every person. Every dollar. Every day they lost. It’ll take a while.', 'sad'),
        l('pepper', 'Then we’ll take a while.', 'soft'),
        l('pepper', 'I’ve put it in the calendar. Friday: come home.', 'soft'),
        l('tony', 'Friday. Home. I’ll be early.', 'happy'),
        n('He is, by an hour. Pepper pretends she hadn’t been watching the door.'),
        l('daredevil', 'For what it’s worth, Stark, your heartbeat sounds like you again. Slower. More scared. Better.'),
        n('Tony unpins something from his old jacket and fastens it to your coat: a small ring of glowing blue light.'),
        l('tony', 'An arc-reactor badge. The thing that kept my heart going. You did that too, all of you, every time.', 'soft'),
        l('tony', 'The gate’s going to take you somewhere bigger soon. A war, maybe. Whatever side I’m on, I’ll still be me.', 'think'),
        n('Your Nubbins climb onto the windowsill and watch the city lights come back on, one block at a time.'),
      ],
    },
    rewards: [
      {
        id: 'mv-im15-arc-badge',
        kind: 'cosmetic',
        label: 'Arc-Reactor Badge',
        description: 'A small glowing blue badge from Tony’s jacket, worn on your Keeper’s coat.',
      },
      {
        id: 'mv-im15-title',
        kind: 'title',
        label: 'Iron Keeper',
        description: 'Title for finishing the Iron Man line, IM1 to IM15.',
      },
    ],
    sets: { 'mv-im15': true, 'mv-im-complete': true },
    notes:
      'Completes the Iron Man line (sets mv-im-complete). Needs IM10: Extremis 3.0 builds on it. Speaker "superior" is the inverted Tony, with a white-armour portrait and a too-smooth face; after the step 3 choice the speaker switches back to "tony" with his normal portrait, which is the visual cue that he is himself again. The desk items call back to IM1 (chest plate), IM5 (washers, one per year) and IM14 (drive); the choice only changes which callback plays. Step 2’s done choice (mv-im15-app: free / dark) is the Keeper’s view on the cure; the app stays down either way within this storyline. Daredevil’s brief restored sight is reported, not shown. Required for Civil War (E1), which follows straight on from the last line. Check Superior Iron Man #1–9 beats before ship.',
  },
];

// ------------------------------------------------------------------ payoff variants

/** Every scene of a quest list, flat. */
const scenesOf = (quests: Quest[]): Scene[] =>
  quests.flatMap((q) => [...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]), q.complete]);

/**
 * A payoff variant: the base scene with `count` lines from index `at` replaced by `extra`.
 * Choices and `set` carry over unchanged. The runner (sim/atlas.ts, variantFor) plays it in
 * place of the base scene when this line's flags hold the value named by `suffix`, so each
 * suffix must be a value only the signature flag ever takes.
 */
function payoff(quests: Quest[], baseId: string, suffix: string, at: number, count: number, extra: Line[]): Scene {
  const base = scenesOf(quests).find((s) => s.id === baseId);
  if (!base) throw new Error(`payoff: no scene ${baseId}`);
  const lines = [...base.lines];
  lines.splice(at, count, ...extra);
  return { ...base, id: `${baseId}-${suffix}`, lines };
}

/** The IM1 cave choice (mv-im01-plan) paid off in IM4, IM8 and IM15. */
export const MV_IRONMAN_VARIANTS: Scene[] = [
  // IM4: what Tony says to the cameras before the Keeper picks his quote.
  payoff(MV_IRONMAN, 'mv-im04-duel-done', 'walk', 4, 0, [
    l('tony', 'First suit I ever built ran off a car battery and a magnet, in a cave, with you holding the torch. This one’s the same idea, polished.', 'think'),
    l('announcer', 'Mr Stark, that is not an answer to my question.'),
  ]),
  payoff(MV_IRONMAN, 'mv-im04-duel-done', 'doubt', 4, 0, [
    l('tony', 'Somebody asked me once if a suit could be built in a week. Five days, it turned out. He had a year, and look at him.', 'think'),
  ]),
  payoff(MV_IRONMAN, 'mv-im04-duel-done', 'decoy', 4, 0, [
    l('tony', 'You know what wins, Keeper? Not the weapon that jams in a month. The one that was never a weapon. You wanted the other one, once.', 'think'),
  ]),
  // IM8: the rooftop, between the shield coming up and Rhodey's warning.
  payoff(MV_IRONMAN, 'mv-im08-captain', 'walk', 9, 0, [
    l('tony', 'In the cave we built a door, not a weapon. I keep telling myself these suits are the door.', 'sad'),
    l('steve', 'A door fifty people walked through with your name on it, Tony.'),
  ]),
  payoff(MV_IRONMAN, 'mv-im08-captain', 'doubt', 9, 0, [
    l('steve', 'Rhodey told me about the cave. Five days, with a magnet and a car battery. Nothing stops you. That’s what frightens me.'),
    l('tony', 'It should. It frightens me.', 'sad'),
  ]),
  payoff(MV_IRONMAN, 'mv-im08-captain', 'decoy', 9, 0, [
    l('tony', 'Keeper, in the cave you wanted to build the man a weapon that jammed. These don’t jam. That’s the whole trouble with me.', 'sad'),
    l('steve', 'Then build the one that stops. That’s all I’m asking.'),
  ]),
  // IM15: the first crack in the Superior Tony, after the Nubbin sits by his boot and hums.
  payoff(MV_IRONMAN, 'mv-im15-return', 'walk', 7, 0, [
    l('superior', 'A cave. A bad bulb. Two round animals holding a torch while a dying man tightened my bolts. Why is that still in here?', 'think'),
    l('pepper', 'Because it’s you. That’s the bit the cure couldn’t reach.', 'soft'),
  ]),
  payoff(MV_IRONMAN, 'mv-im15-return', 'doubt', 7, 0, [
    l('superior', 'Somebody asked, once, whether it could be done in a week. I remember the question. I can’t remember why it mattered.', 'think'),
    l('pepper', 'It mattered because you were building it for someone else.', 'soft'),
  ]),
  payoff(MV_IRONMAN, 'mv-im15-return', 'decoy', 7, 0, [
    l('superior', 'Someone in a cave once suggested a weapon that jams. The weak Tony said no. I would have said yes and been out in a day.', 'think'),
    l('pepper', 'And Yinsen would have died for nothing. Listen to yourself.', 'angry'),
  ]),
  // IM9: the promise the Keeper made the Mandarin take (mv-im09-promise) is broken, and it costs.
  payoff(MV_IRONMAN, 'mv-im09-foom-done', 'mv-im09-promise', 2, 1, [
    l('tony', 'You promised. Afterwards, you said.', 'angry'),
    l('mandarin', 'I said if there was an afterwards. There is. Forgive me.', 'sad'),
    n('Tony fires first, and only at the rings. The rings flare and go dark before the Mandarin can aim.'),
  ]),
  payoff(MV_IRONMAN, 'mv-im09-complete', 'mv-im09-promise', 4, 1, [
    l('tony', 'You swore on the rings. I held you to it, and I’m sorry it ended like this. I am.', 'sad'),
  ]),
];

// ------------------------------------------------------------------ checks

export const CHECKS: string[] = [
  'talk:mv-yinsen',
  'minigame:clear:mv-cave-plates',
  'karate:survive:mv-cave-guards',
  'minigame:clear:mv-rafters-watch',
  'karate:win:mv-crimson-dynamo',
  'guard:mv-plant-gate',
  'talk:mv-tony:rings',
  'karate:win:mv-ten-rings',
  'minigame:clear:mv-ring-dodge',
  'karate:train:dodge:3',
  'karate:win:mv-titanium-man:3-rounds',
  'talk:mv-bethany',
  'expedition:clear:mv-hammer-base',
  'sit:mv-tony:3-nights',
  'talk:mv-arthur',
  'race:win:mv-camelot-lists',
  'karate:win:mv-morgan-dead',
  'talk:mv-rhodey',
  'craft:mv-silver-centurion',
  'karate:win:mv-iron-monger',
  'minigame:clear:mv-negator-run',
  'expedition:clear:mv-the-vault',
  'karate:survive:mv-steve-rogers',
  'talk:mv-mandarin:alliance',
  'minigame:clear:mv-dragon-lake',
  'karate:win:mv-fin-fang-foom',
  'talk:mv-maya',
  'wait:mv-extremis-cocoon',
  'karate:win:mv-mallen',
  'expedition:clear:mv-rescue-site',
  'minigame:clear:mv-signal-trace',
  'karate:win:mv-ezekiel-stane:nonlethal',
  'talk:mv-armour',
  'expedition:clear:mv-desert-island',
  'place:decor:mv-armour-cairn',
  'craft:mv-repulsor-car',
  'minigame:clear:mv-hammer-sabotage',
  'race:win:mv-repulsor-car',
  'race:win:mv-hypervelocity-chase',
  'karate:win:mv-extremis-hunters',
  'escort:mv-backup-tony',
  'talk:mv-daredevil',
  'karate:win:mv-superior-iron-man',
  'sit:mv-tony:tower',
];
