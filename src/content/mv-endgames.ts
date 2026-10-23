/**
 * Multiverse campaign: the six endgames, E1–E6.
 *
 *   E1 Civil War         requires IM1–IM15 + CA1–CA10       choice `mv-cw`   = registration | resistance
 *   E2 Secret Wars       requires FF1–FF10 + IM6 + CA4      choice `mv-doom` = ally | rival
 *   E3 Armageddon        requires SP1–SP8 + MK1–MK8         choice `mv-mk`   = power | free
 *   E4 The 23rd Budokai  requires DB1–DB20                  choice `mv-wish` = spent | saved
 *   E5 So Long, Partner  requires TS1–TS12                  choice `mv-plush` = lost | bonnie
 *   E6 The Last Ultron   requires UL1–UL10 + E1 + E2        choice `mv-e6-ending` = trap | wish | eternal
 *
 * Audience 'adult' (18+) throughout: the Multiverse campaign is main game only, behind the
 * adult content setting (off by default), and is never offered in the Learning Grove, so
 * there are no childLines. Every line of dialogue is original; plots follow the
 * beats in briefs/multiverse.md. Issue and chapter numbers in `source` come from the brief
 * and should be checked before ship.
 *
 * BRANCHING. QuestStep has no condition field, so some steps here are conditional and are
 * marked in their ids and in each quest's `notes`:
 * - E1: `mv-e1-reg-*` steps play only when `mv-cw` = registration; `mv-e1-res-*` only when
 *   it is resistance. Every other E1 step plays for both.
 * - E6: ally steps, ending steps and epilogue steps each play only when their flag matches
 *   (see E6 notes for the full table). Steps whose condition is false are skipped silently.
 *
 * Each endgame sets `mv-e1`…`mv-e6` on completion, so other quests can require 'E1' etc.
 *
 * FLAGS FROM THE LINES: every line quest sets its own id as a flag (`mv-im01`, `mv-sp08`…),
 * and each line's last quest also sets `mv-<line>-complete` (MK8 sets `mv-mk-complete`, so
 * E3's `mv-mk` = power | free has no clash; SP8 sets `mv-sp-complete`). E3 also reads
 * `mv-sp-twist` and `mv-sp-cain` for small line swaps (see E3 notes).
 *
 * SAVES. The Multiverse has one save of its own. It may read Grove saves (Free Grove,
 * Hazel's Grove) and never writes them. E6's Eternal is a reflection that lives only in the
 * Multiverse save (see E6 notes).
 *
 * Every endgame has at least one choice where both answers are defensible. Choices that
 * only colour later lines use `mv-e<n>-` flags and are cosmetic.
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
const sp = (id: string, name: string, basedOn: string): Speaker => ({
  id,
  name,
  kind: 'other',
  basedOn,
});

const RIFT = 'The rift above the waterfall (Multiverse campaign)';

// ------------------------------------------------------------------ speakers

// Iron Man / Captain America / Civil War
const TONY = sp('tony', 'Tony Stark', 'Tony Stark, Iron Man (Marvel Comics)');
const STEVE = sp('steve', 'Steve Rogers', 'Steve Rogers, Captain America (Marvel Comics)');
const MIRIAM = sp('miriam', 'Miriam Sharpe', 'Miriam Sharpe, a mother who lost her son at Stamford (Civil War #1)');
const HILL = sp('hill', 'Maria Hill', 'Maria Hill, director of S.H.I.E.L.D. (Marvel Comics)');
const PETER = sp('peter', 'Peter Parker', 'Peter Parker, Spider-Man (Marvel Comics)');
const REED = sp('reed', 'Reed Richards', 'Reed Richards, Mister Fantastic (Marvel Comics)');
const FOSTER = sp('foster', 'Bill Foster', 'Bill Foster, Goliath (Marvel Comics)');
const CLONE = sp('clone', 'Thor?', 'Ragnarok, the cloned Thor built during Civil War (Marvel Comics)');
const SAM = sp('sam', 'Sam Wilson', 'Sam Wilson, the Falcon (Marvel Comics)');
const CAGE = sp('cage', 'Luke Cage', 'Luke Cage (Marvel Comics)');
const CASTLE = sp('castle', 'Frank Castle', 'Frank Castle, the Punisher (Marvel Comics)');
const SHARON = sp('sharon', 'Sharon Carter', 'Sharon Carter, Agent 13 (Marvel Comics)');
const KOBIK = sp('kobik', 'Kobik', 'Kobik, the Cosmic Cube as a child (Marvel Comics)');
const RHODEY = sp('rhodey', 'Rhodey', 'James “Rhodey” Rhodes, War Machine (Marvel Comics)');

// Doom / Fantastic Four / Secret Wars
const SUE = sp('sue', 'Sue Storm', 'Susan Storm, the Invisible Woman (Marvel Comics)');
const DOOM = sp('doom', 'Victor von Doom', 'Victor von Doom, Doctor Doom (Marvel Comics)');
const STRANGE = sp('strange', 'Doctor Strange', 'Stephen Strange, Doctor Strange (Marvel Comics)');
const OWEN = sp('owen', 'Owen Reece', 'Owen Reece, the Molecule Man (Marvel Comics)');
const VAL = sp('val', 'Valeria Richards', 'Valeria Richards (Marvel Comics)');
const FRANKLIN = sp('franklin', 'Franklin Richards', 'Franklin Richards (Marvel Comics)');
const TCHALLA = sp('tchalla', 'T’Challa', 'T’Challa, Black Panther (Marvel Comics)');
const LOTSO = sp('lotso', 'Lotso', 'Lots-o’-Huggin’ Bear, as a baron of Battleworld (Toy Story 3, Pixar)');

// Spawn / Moon Knight / Armageddon
const SPAWN = sp('spawn', 'Spawn', 'Al Simmons / Spawn (Image Comics)');
const COG = sp('cog', 'Cogliostro', 'Cogliostro, revealed as Cain (Image Comics)');
const MAMMON = sp('mammon', 'Mammon', 'Mammon (Spawn, Image Comics)');
const HERALD = sp('herald', 'The Herald', 'Heaven’s emissary in Spawn’s Armageddon arc (Spawn #150–164)');
const MARC = sp('marc', 'Marc Spector', 'Marc Spector / Moon Knight (Marvel Comics)');
const STEVEN = sp('steven', 'Steven Grant', 'Steven Grant, one of Moon Knight’s identities (Marvel Comics)');
const JAKE = sp('jake', 'Jake Lockley', 'Jake Lockley, one of Moon Knight’s identities (Marvel Comics)');
const KHONSHU = sp('khonshu', 'Khonshu', 'Khonshu (Marvel Comics)');
const MARLENE = sp('marlene', 'Marlene', 'Marlene Alraune (Marvel Comics)');
const BOBBY = sp('bobby', 'Bobby', 'An original alley regular from the Spawn line (not a source character)');

// Dragon Ball
const GOKU = sp('goku', 'Goku', 'Son Goku (Dragon Ball, Akira Toriyama / Toei)');
const KRILLIN = sp('krillin', 'Krillin', 'Krillin (Dragon Ball)');
const TIEN = sp('tien', 'Tien', 'Tien Shinhan (Dragon Ball)');
const TAO = sp('tao', 'Mercenary Tao', 'Mercenary Tao, rebuilt as a cyborg (Dragon Ball)');
const SHEN = sp('shen', 'Shen', 'Kami fighting in the borrowed body of Shen (Dragon Ball)');
const KAMI = sp('kami', 'Kami', 'Kami, guardian of the Earth (Dragon Ball)');
const PICCOLO = sp('piccolo', 'Piccolo', 'Piccolo Jr., entered as Ma Junior (Dragon Ball)');
const CHICHI = sp('chichi', 'Chi-Chi', 'Chi-Chi (Dragon Ball)');
const BULMA = sp('bulma', 'Bulma', 'Bulma (Dragon Ball)');
const YAJIROBE = sp('yajirobe', 'Yajirobe', 'Yajirobe (Dragon Ball)');
const ANNOUNCER = sp('announcer', 'The Announcer', 'The World Martial Arts Tournament announcer (Dragon Ball)');
const SHENRON = sp('shenron', 'Shenron', 'Shenron, the Eternal Dragon (Dragon Ball)');

// Toy Story
const WOODY = sp('woody', 'Woody', 'Sheriff Woody (Toy Story, Pixar)');
const BUZZ = sp('buzz', 'Buzz Lightyear', 'Buzz Lightyear (Toy Story, Pixar)');
const BO = sp('bo', 'Bo Peep', 'Bo Peep (Toy Story 4, Pixar)');
const DUKE = sp('duke', 'Duke Caboom', 'Duke Caboom (Toy Story 4, Pixar)');
const DUCKY = sp('ducky', 'Ducky', 'Ducky (Toy Story 4, Pixar)');
const BUNNY = sp('bunny', 'Bunny', 'Bunny (Toy Story 4, Pixar)');
const FORKY = sp('forky', 'Forky', 'Forky (Toy Story 4, Pixar)');
const GABBY = sp('gabby', 'Gabby Gabby', 'Gabby Gabby (Toy Story 4, Pixar)');
const JESSIE = sp('jessie', 'Jessie', 'Jessie the Yodelling Cowgirl (Toy Story, Pixar)');

// Ultron
const ULTRON = sp('ultron', 'Ultron', 'Ultron, the last one (Age of Ultron / Ultron Forever, Marvel Comics)');
const VISION = sp('vision', 'The Vision', 'The Vision (Marvel Comics)');
const JOCASTA = sp('jocasta', 'Jocasta', 'Jocasta (Marvel Comics)');
const HANK = sp('hank', 'Hank Pym (recording)', 'Young Hank Pym, recorded the night he planted the trap (Age of Ultron #10)');

export const MV_ENDGAMES: Quest[] = [
  // ================================================================== E1 CIVIL WAR
  {
    id: 'mv-e1',
    code: 'E1',
    title: 'Civil War',
    source: 'Civil War #1–7; epilogues from The Death of Captain America and Captain America: Reborn',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Once every Iron Man and Captain America storyline is finished. The rift opens on a sunny street in Stamford.' },
    requires: [
      'IM1', 'IM2', 'IM3', 'IM4', 'IM5', 'IM6', 'IM7', 'IM8', 'IM9', 'IM10', 'IM11', 'IM12', 'IM13', 'IM14', 'IM15',
      'CA1', 'CA2', 'CA3', 'CA4', 'CA5', 'CA6', 'CA7', 'CA8', 'CA9', 'CA10',
    ],
    speakers: [TONY, STEVE, MIRIAM, HILL, PETER, REED, FOSTER, CLONE, SAM, CAGE, CASTLE, SHARON, KOBIK],
    steps: [
      // ------------------------------------------------------------ 1. Stamford (both sides)
      {
        id: 'mv-e1-s1',
        goal: 'Dig through the wreckage at Stamford with your Nubbins.',
        hint: 'An expedition with no enemies. Small Nubbins fit where rescuers can’t; keep their stamina up and rotate them.',
        check: 'expedition:clear:mv-stamford-wreck',
        scene: {
          id: 'mv-e1-stamford',
          lines: [
            n('The rift opens on a sunny street in Stamford, Connecticut. A camera crew is filming four young heroes outside a house.'),
            n('They have a reality show. They need a big finish for the season. Inside the house are four wanted villains.'),
            n('A girl with a clipboard waves you out of the shot. Your Nubbins wave back. She sighs and calls for another take.'),
            n('Across the road is an elementary school. It is lunch break. The yard is full of children.'),
            n('The young heroes kick the door in. One of the villains is called Nitro. He comes out through the wall, glowing.'),
            n('Your Fly Nubbin sees it first. It goes rigid in the air and stops flapping.'),
            n('Then the whole street turns white.'),
            n('When the sound comes back there is no house. There is no school. There is a crater, and a long, slow cloud.'),
            n('Sirens start, far away, and for a long time they get no closer.'),
            l('tony', 'I came as fast as I could. It wasn’t fast enough. It’s never fast enough.', 'sad'),
            l('tony', 'Keeper. Your Nubbins are small. They can get into places my suits can’t. Please.'),
          ],
        },
        done: {
          id: 'mv-e1-stamford-done',
          lines: [
            n('Your Nubbins come out of the rubble with a backpack with a cartoon dog on it. They set it down by Tony and sit beside it.'),
            n('Days later, at the funeral, a woman walks straight through the crowd to Tony.'),
            l('miriam', 'My son was in that school. You people fight on television for fun, and nobody ever checks on any of you.', 'angry'),
            l('miriam', 'You paid for your suit yourself. Who did you answer to? Who answers for my boy?'),
            n('She leaves. Tony doesn’t move for a long time.'),
          ],
        },
      },
      // ------------------------------------------------------------ 2. The Act (choice)
      {
        id: 'mv-e1-s2',
        goal: 'Decide whether your Nubbins register or go into hiding.',
        hint: 'Talk to Tony and Steve. Your choice decides the next chapters, and who stands with you at the very end.',
        check: 'choose:mv-cw',
        scene: {
          id: 'mv-e1-act',
          lines: [
            n('Washington passes the Superhuman Registration Act in a week. Every masked hero must unmask, sign up, and take orders.'),
            n('A clause is added late one night: powered creatures from beyond the rift must be registered too. Your Nubbins get forms.'),
            l('tony', 'I helped write it. I know how it sounds. Imagine how it would sound if somebody worse had written it.', 'think'),
            l('tony', 'People wanted us gone. Registration is the deal that keeps us here: trained, licensed, answerable.'),
            n('On a S.H.I.E.L.D. helicarrier, Maria Hill asks Steve Rogers to lead the hunt for heroes who won’t sign.'),
            l('hill', 'You’ll bring them in, Captain. That’s an order from the people you work for.'),
            l('steve', 'I work for the people. That isn’t the same as whoever’s standing in this room.', 'angry'),
            n('Twenty agents raise their guns. Steve goes out of the window instead.'),
            n('That night the forms arrive: a photo slot, a box for a home address, a line for a thumbprint. Your Nubbins don’t have thumbs.'),
            l('steve', 'They’ll give your little ones numbers, Keeper. Then pens. I’ve seen where lists of names end up.', 'sad'),
            l('tony', 'It’s a form, Steve. A form and a training course. Nobody is building pens.'),
            n('Both of them look at you. Your Nubbins look at the forms.'),
          ],
          choices: [
            {
              id: 'registration',
              label: 'Sign the forms. Stand with Tony.',
              set: { 'mv-cw': 'registration' },
              then: [
                l('tony', 'Thank you. Really. It’s easier to fix a thing from the inside.', 'soft'),
                n('Your Nubbins get small laminated badges. One of them eats a corner off its badge.'),
                l('tony', 'That’s a federal document.'),
                n('It was the corner with the number on. Your Nubbin is, technically, unregistered again, and very pleased about it.'),
              ],
            },
            {
              id: 'resistance',
              label: 'Tear up the forms. Go with Steve.',
              set: { 'mv-cw': 'resistance' },
              then: [
                l('steve', 'Then we move tonight. Pack light. Nobody sleeps much where we’re going.'),
                n('Your Nubbins climb into a duffel bag without being asked. They have always liked bags.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e1-act-done',
          lines: [
            n('Tony and Steve meet once more, on a rooftop, without their masks.'),
            l('steve', 'You used to be the one who fought the people telling us what to do.'),
            l('tony', 'I grew up. You should try it.', 'angry'),
            n('They walk away in opposite directions. Neither of them looks back.'),
          ],
        },
      },
      // ------------------------------------------------------------ 3R. Unmasking (registration only)
      {
        id: 'mv-e1-reg-s3',
        goal: 'Stand beside Peter Parker at the press conference.',
        hint: 'Registration side only. Keep your Nubbins calm on the stage; the camera flashes frighten them.',
        check: 'talk:mv-peter-parker',
        scene: {
          id: 'mv-e1-unmask',
          lines: [
            n('Tony’s side has a headquarters, a budget and a press office. Your Nubbins get a room with a window and a fruit bowl.'),
            n('Tony has made Peter Parker a new suit: red and gold, full of gadgets, and fitted with a few things Peter hasn’t found yet.'),
            l('peter', 'He built me a suit. Nobody builds me things. My aunt knits. That’s about it.', 'happy'),
            l('tony', 'Today we show the country we mean it. One hero unmasks on live television. I need it to be you, Peter.'),
            l('peter', 'Me? I’ve kept this face secret since high school.', 'shock'),
            l('tony', 'That’s exactly why. If you can do it, anyone can.'),
            n('Backstage, Peter sits on a cardboard box with your Nubbins. He takes the mask off, then puts it back on, then off again.'),
            l('peter', 'My aunt’s in this. My wife. Every creep I ever stuck to a lamppost will know where they sleep.', 'sad'),
            l('peter', 'But he’s right, isn’t he? If we want people to trust us, we have to show them who we are.', 'think'),
            n('Somebody calls “two minutes”. The studio lights come up. Your Nubbins blink.'),
          ],
          choices: [
            {
              id: 'doubt',
              label: '“You don’t have to do this, Peter.”',
              set: { 'mv-e1-peter': 'peter-doubted' },
              then: [
                l('peter', 'I know. That’s the scary part. I’m choosing it.', 'sad'),
              ],
            },
            {
              id: 'stand',
              label: '“We’ll be right there on the stage with you.”',
              set: { 'mv-e1-peter': 'peter-stood' },
              then: [
                l('peter', 'With the little guys? Okay. Okay. Nobody can be scared next to those.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e1-unmask-done',
          lines: [
            n('Peter walks to the podium and takes off his mask. Every camera in the world flashes at once.'),
            l('peter', 'My name is Peter Parker. I’ve been Spider-Man since I was fifteen.'),
            n('Your Nubbins clap. For a second nobody else in the room does. Then everybody does.'),
          ],
        },
      },
      // ------------------------------------------------------------ 4R. The clone and Prison 42 (registration only)
      {
        id: 'mv-e1-reg-s4',
        goal: 'Hold the line in Tony’s ambush until the clone is called off.',
        hint: 'Registration side only. A survival bout: your Nubbins only have to stay on their feet.',
        check: 'karate:survive:mv-cw-ambush',
        scene: {
          id: 'mv-e1-ambush',
          lines: [
            n('Tony fakes a chemical-plant fire to draw the rebels out. Steve’s team arrives to put it out. Tony’s team is waiting for them.'),
            l('tony', 'Steve. It doesn’t have to be a fight. Sign, and we all go home.'),
            l('steve', 'Home’s where your people are taking my friends in handcuffs, Tony.'),
            n('The sky goes dark. Thor comes down with his hammer. Everybody stops. Thor has been gone for a year.'),
            l('reed', 'It isn’t Thor. Tony and I grew it from a hair. It has his strength. It does not have his judgement.', 'think'),
            l('clone', 'Kneel, or be broken.'),
            n('Bill Foster, Goliath, grows to sixty feet and steps between the clone and the smaller heroes.'),
            l('foster', 'I’ve been a giant longer than that thing’s been alive. Go on. Everybody run.'),
            n('The clone swings once. Lightning goes through Bill Foster. He falls, and he does not get up.'),
            n('Every hero on the field, on both sides, goes completely still. Your Nubbins run to him anyway.'),
            l('peter', 'He’s not breathing. Tony. Tony, he’s not breathing.', 'shock'),
            l('tony', 'That wasn’t supposed to happen. That was not supposed to happen.', 'shock'),
            l('reed', 'Its control code is on my tablet. I can end it now. Or we keep it, and learn exactly what went wrong.', 'think'),
          ],
          choices: [
            {
              id: 'shutdown',
              label: '“Shut it down. Now.”',
              set: { 'mv-e1-clone': 'shutdown' },
              then: [
                n('Reed taps once. The thing with Thor’s face folds to the ground like a coat with nobody in it.'),
                l('tony', 'Log it. All of it. Somebody is going to ask, and they should get an answer.', 'sad'),
              ],
            },
            {
              id: 'keep',
              label: '“Keep it. Find out why, so it never happens again.”',
              set: { 'mv-e1-clone': 'kept' },
              then: [
                l('reed', 'That is the responsible answer. I hate how much it sounds like the wrong one.', 'think'),
                n('Two agents walk the clone into a van. It looks back at the place where Bill fell, and does not seem to understand it.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e1-ambush-done',
          lines: [
            n('Afterwards Tony shows Peter where unregistered heroes go: Prison 42, built in the Negative Zone, outside normal space.'),
            l('peter', 'No trial. No lawyer. No way home. This isn’t what I took my mask off for.', 'sad'),
            n('That night Peter folds the red-and-gold suit and leaves it on his bed. Your Nubbins watch him go out of the window.'),
            l('tony', 'He’ll come back. People come back when they see the numbers.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------------------ 3S. Safehouses (resistance only)
      {
        id: 'mv-e1-res-s3',
        goal: 'Get your Nubbins to the next safehouse before the S.H.I.E.L.D. sweep.',
        hint: 'Resistance side only. A stealth expedition: keep your Nubbins out of the drones’ lights and keep moving.',
        check: 'expedition:clear:mv-safehouse-run',
        scene: {
          id: 'mv-e1-safehouse',
          lines: [
            n('Steve’s side calls itself the Secret Avengers. It has no budget, no headquarters, and a lot of borrowed vans.'),
            l('sam', 'Welcome to the underground. The coffee’s bad. Everything else is worse. You’ll love it.', 'happy'),
            n('The safehouses are lent by ordinary people: a dentist, a nun, a man who runs a laundrette and asks for nothing back.'),
            l('cage', 'S.H.I.E.L.D. visited my wife this morning. My kid was in the room. They called it a courtesy call.', 'angry'),
            l('steve', 'Nobody here is a criminal for being what they are. Not Luke. Not the Keeper’s little ones.'),
            n('Your Nubbins have been given a laundry basket with a blanket in it. They seem to think this is the best part of the war.'),
            n('At midnight the scanner crackles. S.H.I.E.L.D. drones are coming down the street, one door at a time.'),
            l('sam', 'Steve, the Keeper’s babies glow on infrared. They’re like tiny space heaters.', 'think'),
            l('steve', 'Then we keep them close and keep them moving. The laundrette has a back door.'),
            n('Down the street, the drones turn their lights on the dentist’s house.'),
          ],
          choices: [
            {
              id: 'carry',
              label: 'Carry the basket yourself.',
              set: { 'mv-e1-safehouse': 'carried' },
              then: [
                n('You tuck the basket under your arm. Somebody inside it is snoring.'),
              ],
            },
            {
              id: 'run',
              label: 'Let the Nubbins run ahead on their own.',
              set: { 'mv-e1-safehouse': 'ran' },
              then: [
                l('sam', 'They know the way better than I do. That’s embarrassing.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e1-safehouse-done',
          lines: [
            n('You make the laundrette with thirty seconds to spare. The dryers hide your Nubbins’ heat.'),
            l('cage', 'Never thought I’d owe my freedom to a tumble dryer.'),
          ],
        },
      },
      // ------------------------------------------------------------ 4S. The Punisher (resistance only)
      {
        id: 'mv-e1-res-s4',
        goal: 'See Frank Castle out of the Secret Avengers’ hideout.',
        hint: 'Resistance side only. Talk to Steve after Frank is thrown out. There is no bout; Frank won’t fight him.',
        check: 'talk:mv-frank-castle',
        scene: {
          id: 'mv-e1-punisher',
          lines: [
            n('The rebels hold Bill Foster’s wake in a church basement. He died in Tony’s ambush, between a clone of Thor and everybody else.'),
            l('steve', 'Bill grew to sixty feet so the rest of us could run. I’ll remember that longer than the rest of this war.', 'sad'),
            n('A new recruit arrives: a man in a black coat with a white skull on his chest. Frank Castle. The Punisher.'),
            l('castle', 'Your side needs somebody who’ll do the things you won’t. I came to help.'),
            l('sam', 'Steve. We’re short of people. I hate it, but we are.', 'think'),
            n('That night two small-time crooks come to the door, asking to join. They are nobodies. Frank shoots them both.'),
            n('Your Nubbins scatter under the pews. One of them won’t stop shaking.'),
            l('steve', 'Get out of my church.', 'angry'),
            n('Steve hits him. Frank doesn’t raise his hands. Steve hits him again, and Frank just takes it.'),
            l('castle', 'I won’t hit you back. You’re the only one of you I ever looked up to.'),
            l('steve', 'Then you know exactly why you can’t stay.', 'angry'),
            l('sam', 'Keeper. You’ve been in both camps now. Say something.', 'think'),
          ],
          choices: [
            {
              id: 'out',
              label: 'Stand with Steve. Frank goes.',
              set: { 'mv-e1-frank': 'out' },
              then: [
                n('You hold the door open. Frank looks at you, then at the Nubbins under the pews, and walks out into the rain.'),
              ],
            },
            {
              id: 'argue',
              label: '“Tony has a god on a leash. Can we afford to lose anyone?”',
              set: { 'mv-e1-frank': 'argued' },
              then: [
                l('steve', 'Probably not. That’s exactly what he’s counting on.', 'sad'),
                l('steve', 'If we win with him, we win as him. Then what was the point of not signing?'),
                n('Frank nods, as if that were a fair answer, and walks out into the rain on his own.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e1-punisher-done',
          lines: [
            n('The door shuts. Your Nubbins stay under the pews until Steve sits down on the floor beside them.'),
            l('steve', 'Every war has a man like that waiting at the door. You decide early whether you let him in.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------------------ 5. The last battle (both sides)
      {
        id: 'mv-e1-s5',
        goal: 'Fight through New York in the last battle of the war.',
        hint: 'The longest bout of the line. Your side fights beside you: armours if you registered, rebels if you resisted.',
        check: 'karate:survive:mv-cw-final',
        scene: {
          id: 'mv-e1-final',
          lines: [
            n('Steve’s rebels break into Prison 42 and free everyone inside. They all come out in the middle of New York.'),
            n('Tony’s side is waiting. Then everyone is fighting: in the streets, on the cars, through the shop windows of Times Square.'),
            n('Your Nubbins herd a school trip down into a subway entrance. Overhead, a billboard of Tony’s face falls flat into the road.'),
            l('tony', 'Steve! Look at what we’re doing!', 'angry'),
            l('steve', 'I am looking. I’m looking at you.', 'angry'),
            n('The shield takes Tony’s armour apart plate by plate. Tony goes down. Steve raises the shield for the last blow.'),
            n('Then hands grab his arms. A paramedic. A firefighter. A man from a deli. A woman in a bus driver’s jacket.'),
            l('steve', 'Let go. Let go of me, I’m trying to—', 'angry'),
            n('They don’t let go. They hold on the way your Nubbins hold on to you in a thunderstorm.'),
            n('Steve looks up. He sees the street: the smashed shopfronts, a bus on its side, the people.'),
            l('steve', 'We’re not fighting for them any more. We’re just fighting.', 'sad'),
            n('He opens his hands. The shield drops onto the road and rings like a bell.'),
            l('steve', 'Tell them to stand down. Everybody. I surrender.'),
          ],
          choices: [
            {
              id: 'steve',
              label: 'Go to Steve.',
              set: { 'mv-e1-after': 'steve' },
              then: [
                n('You pick up the shield and hold it out to him. He shakes his head. Your Nubbins sit on it instead.'),
              ],
            },
            {
              id: 'tony',
              label: 'Go to Tony.',
              set: { 'mv-e1-after': 'tony' },
              then: [
                n('You help Tony out of what’s left of the armour. He can’t look at anybody. Your Nubbins look at him anyway.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e1-final-done',
          lines: [
            n('Steve is led away in cuffs. Your Nubbins follow the police van for a whole block before you call them back.'),
            l('tony', 'I won. Somebody explain why it doesn’t feel like it.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------------------ 6. The courthouse (both sides)
      {
        id: 'mv-e1-s6',
        goal: 'Go to the courthouse to see Steve before his hearing.',
        hint: 'There is nothing to win here. Walk up the steps with him.',
        check: 'talk:mv-steve-courthouse',
        scene: {
          id: 'mv-e1-courthouse',
          lines: [
            n('Some weeks later. A grey morning. A crowd outside the courthouse, half of them shouting, half of them crying.'),
            n('Steve comes up the steps in chains. He sees your Nubbins in the crowd, and his whole face changes.'),
            l('steve', 'You came. I told them not to let anybody— I’m glad you came.', 'soft'),
            l('steve', 'Whatever they decide in there, look after the little ones for me. Promise me that.'),
            l('sharon', 'Steve, keep walking. Please. I don’t like how this crowd feels.', 'think'),
            n('A shot from a high window. Then more, from the crowd, close by.'),
            n('Steve falls on the steps. Your Nubbins are the first to reach him.'),
            l('sharon', 'No. No, no, no. Steve—', 'shock'),
            n('He looks at your Nubbins, not at the sky or the crowd. He starts to say something. He doesn’t finish it.'),
            n('The crowd goes very quiet. Somewhere a camera is still clicking.'),
          ],
        },
        done: {
          id: 'mv-e1-courthouse-done',
          lines: [
            l('tony', 'I’d give it all back. The Act, the suits, the win. Every bit of it, for one more argument with him.', 'sad'),
            n('Tony sits on the courthouse steps until dark. Your Nubbins sit with him. You don’t ask them to.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-e1-complete',
      lines: [
        n('A long time later, at the waterfall, something small knocks on the air from the other side of the rift.'),
        l('kobik', 'Hello. I promised not to change anything. So I didn’t. I only caught him while he was falling.'),
        l('kobik', 'Was that allowed? Catching isn’t changing. I thought about it for a very long time.'),
        n('A light the size of a doorway opens, and Steve Rogers stumbles out as if he has missed a step. He looks at his hands.'),
        l('steve', 'One second I was on the steps. Then somewhere bright, like a platform, waiting for a train.', 'think'),
        n('Your Nubbins hit him at knee height, all at once. He sits down hard in the grass and lets them.'),
        l('steve', 'Hey. Hey. I asked you to look after them. Looks like they looked after me.', 'soft'),
        l('steve', 'Tell Tony I’m back. And tell him we’ll need each other soon. Something’s coming.'),
        n('Above the waterfall, for a moment, the rift flickers red.'),
      ],
    },
    rewards: [
      {
        id: 'mv-e1-title',
        kind: 'title',
        label: 'Witness on the Steps',
        description: 'Keeper title for finishing Civil War.',
      },
      {
        id: 'mv-e1-ally',
        kind: 'flag',
        label: 'Civil War ally',
        description: 'Tony’s armoured army (registration) or Steve’s resistance (resistance) stands with you in The Last Ultron (E6).',
      },
    ],
    sets: { 'mv-e1': true },
    notes:
      'BRANCHING: step order is s1, s2, then either reg-s3 + reg-s4 (mv-cw = registration) or res-s3 + res-s4 (mv-cw = resistance), then s5, s6 for both. ' +
      'Each path plays six steps. The ending is the same either way; mv-cw only decides the E6 ally (Tony’s armours or Steve’s resistance). ' +
      'Stamford: the blast is a white-out cut, no bodies shown; the backpack is the only detail. Bill Foster’s death is one lightning flash and a fall, no gore. ' +
      'Frank shooting the two crooks is off-screen (two muzzle flashes through a doorway). The courthouse shooting is staged the same way: sound, a fall, no blood. ' +
      'On the resistance path, Bill Foster dies off-screen in the ambush and is mourned in res-s4. The prison break in s5 assumes Prison 42 exists on both paths; ' +
      'on the resistance path it is introduced by its name in s5 only. The complete scene ties Steve’s return to the CA line’s Cube thread (Kobik, CA10) without repeating CA10’s resurrection: Kobik keeps her promise not to change anything and only catches him as he falls. ' +
      'SIGNATURE CHOICE: mv-e1-peter (peter-doubted | peter-stood: whether Peter unmasked alone or with the Nubbins beside him) pays off through MV_ENDGAMES_VARIANTS at mv-e1-courthouse (how Peter stands in the crowd), mv-e2-incursion (what Reed heard from him before the raft) and mv-e6-tony / mv-e6-steve (whether Peter comes to the last war bare-faced). The values carry a peter- prefix because the runner matches variants by value and mv-e2-kneel also uses stood. The safehouse / after-battle flags are cosmetic. ' +
      'Each path has a hard call of its own: on registration, mv-e1-clone (shutdown | kept) after Goliath dies; on resistance, mv-e1-frank (out | argued) over the Punisher. ' +
      'Both are cosmetic; Frank leaves either way, as in the source, and the clone is never used again on screen. ' +
      'Check Civil War #1–7, Captain America #25 and Captain America: Reborn beats before ship.',
  },

  // ================================================================== E2 SECRET WARS
  {
    id: 'mv-e2',
    code: 'E2',
    title: 'Secret Wars',
    source: 'Secret Wars #1–9 (2015)',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Once the Doom line, Doomquest and The Cosmic Cube are finished. The rift opens on a sky with a second Earth in it.' },
    requires: [
      'FF1', 'FF2', 'FF3', 'FF4', 'FF5', 'FF6', 'FF7', 'FF8', 'FF9', 'FF10',
      'IM6', 'CA4',
    ],
    speakers: [REED, SUE, DOOM, STRANGE, OWEN, VAL, FRANKLIN, TCHALLA, LOTSO],
    steps: [
      // ------------------------------------------------------------ 1. Incursions
      {
        id: 'mv-e2-s1',
        goal: 'Get aboard Reed’s life raft before the last two Earths touch.',
        hint: 'A race under a falling sky. Speed matters more than stamina; don’t stop for fruit.',
        check: 'race:finish:mv-incursion-raft',
        scene: {
          id: 'mv-e2-incursion',
          lines: [
            n('The rift opens on a sky with another Earth in it. It is close enough to see weather on it. It is getting closer.'),
            l('reed', 'Incursions. Two universes touch at one point and both die. We’ve watched it happen for years.', 'sad'),
            l('reed', 'This is the last one. Every world, every timeline, ends today. I built a raft. It holds very few people.'),
            l('sue', 'Take the Keeper and the Nubbins. I’ll take the children on the other ship. We’ll meet on the other side.', 'soft'),
            l('reed', 'There isn’t an other side, Sue. That’s the whole point of a raft.', 'sad'),
            l('sue', 'Then you’ll build one. You always do.'),
            n('Franklin waves at your Nubbins from the other ship’s hatch. Valeria pulls him back inside by the collar.'),
            n('The two skies grind together. It sounds less like thunder than like a door closing on everything.'),
            l('tchalla', 'Richards. The raft. Now. You can grieve on board.'),
            n('Your Nubbins jump in first. Reed is the last aboard. Sue’s ship is a dot, then a spark, then nothing.'),
            n('Behind you, both Earths touch. There is a light so large it has no colour.'),
          ],
        },
        done: {
          id: 'mv-e2-incursion-done',
          lines: [
            n('You sleep. Nothing moves. There is no clock that can say for how long.'),
            n('When the raft opens there is grass outside, and a sky, and a wall of rock running all the way to the horizon.'),
          ],
        },
      },
      // ------------------------------------------------------------ 2. Battleworld
      {
        id: 'mv-e2-s2',
        goal: 'Cross three domains of Battleworld and reach Doom’s capital.',
        hint: 'An expedition through Sunnyside, the Lookout and Latveria. Each baron’s patrols follow a route; wait for the gap.',
        check: 'expedition:clear:mv-battleworld',
        scene: {
          id: 'mv-e2-battleworld',
          lines: [
            n('Eight years have passed outside the raft. In that time a world has been made out of the wreckage of all the others.'),
            n('It is a patchwork. Each patch is a piece of a dead universe, stitched to the next with a seam of rock.'),
            n('One patch is a daycare that smells of strawberries. One is a white lookout floating over cloud. One is a castle under a green flag.'),
            n('Every patch has a baron. Every baron kneels to the same man. His statue is on every hill. At the Lookout, the clouds are trimmed into his face.'),
            l('lotso', 'Well, hey there. New faces. Sunnyside’s a happy domain, friend. God Emperor Doom likes it happy.', 'happy'),
            l('lotso', 'And what Doom likes, I make sure of. Real sure. You keep those little critters in line, now.'),
            n('At the Lookout, an old green man in white robes watches the edge of the world. He says nothing to Doom’s soldiers at all.'),
            n('In Latveria the streets are clean, the trains run on time, and everyone looks at the ground when the guards go by.'),
            l('strange', 'You’re not from here. Nothing is from anywhere else, here. Quickly, before the Thors see you.', 'think'),
            n('Doctor Strange, Sheriff of Battleworld, pulls you into a side street. He is Doom’s right hand. He looks very worried.'),
            l('strange', 'Doom took the power of the Beyonders, the beings who ended the multiverse. He saved what he could. He made this.'),
            l('strange', 'He is God here. I helped him do it. Some days I am proud of that. Today is not one of those days.', 'sad'),
            n('Boots at the corner. A Thor patrol, hammers on shoulders. Everyone in the street kneels to the nearest statue of Doom.'),
            l('strange', 'Kneel. It costs nothing. Everybody does it.', 'think'),
          ],
          choices: [
            {
              id: 'kneel',
              label: 'Kneel, and tell the Nubbins to kneel.',
              set: { 'mv-e2-kneel': 'knelt' },
              then: [
                n('Your Nubbins kneel, which for a Nubbin looks exactly like sitting. The patrol walks past without a glance.'),
                l('strange', 'It does cost something. I stopped noticing what, years ago.', 'sad'),
              ],
            },
            {
              id: 'stand',
              label: 'Stay on your feet.',
              set: { 'mv-e2-kneel': 'stood' },
              then: [
                n('You stay standing. Your Nubbins, watching you, stay standing too. A Thor stops, looks down at them, and frowns.'),
                l('strange', 'Mine. Sheriff’s business. Move along.'),
                n('The patrol moves on. Strange lets out a breath he seems to have been holding for eight years.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e2-battleworld-done',
          lines: [
            n('In the throne room, God Emperor Doom sits in a seat as wide as a house. Beside him are Sue Storm and two children.'),
            l('doom', 'Strange. You are late, and you smell of strangers.'),
          ],
        },
      },
      // ------------------------------------------------------------ 3. The raft is found
      {
        id: 'mv-e2-s3',
        goal: 'Get Reed’s survivors out of the throne room alive.',
        hint: 'A survival bout against Doom’s Thors. You don’t need to beat them; reach the servants’ door.',
        check: 'karate:survive:mv-doom-throne',
        scene: {
          id: 'mv-e2-throne',
          lines: [
            n('Strange hid Reed’s raft for eight years. Today Doom’s Thors found it. Everyone is dragged to the throne together.'),
            l('doom', 'Richards. Of course. The universe ends, and you survive it in a lifeboat.', 'angry'),
            l('reed', 'Victor. What have you done with my family?'),
            l('doom', 'I saved them. You were not there. I was.', 'angry'),
            n('Sue looks at Reed as if she almost remembers him, and doesn’t like the way that feels.'),
            n('Eight years ago, Doom took Reed’s place. Sue and the children remember Doom as husband and father, and nothing else.'),
            l('val','Father, who is that man? Why is he looking at Mother like that?', 'think'),
            n('Doom flinches at the word Father. Not from shame. From something closer to fear.'),
            l('strange', 'Victor, I hid them. I should have told you. I wanted to see what you would do.', 'sad'),
            l('doom', 'You tested me. In my own house.', 'angry'),
            n('Doom lifts one hand. Strange is gone before he can finish his next word. Only his cloak falls to the floor.'),
            n('Your Nubbins dart under Sue’s chair. Franklin pulls one onto his lap and holds on to it very tightly.'),
            l('franklin', 'Father? Why did you do that? He used to tell us stories.', 'shock'),
            l('doom', 'He betrayed me. Everything I made, I made so nobody would ever die like that again.', 'sad'),
          ],
        },
        done: {
          id: 'mv-e2-throne-done',
          lines: [
            n('In the uproar, Reed’s survivors break for the doors. Your Nubbins lead them through the servants’ halls.'),
            l('reed', 'Did you see his face? Doom was frightened. Of what Strange said, of what the children saw. That’s the crack.', 'think'),
          ],
        },
      },
      // ------------------------------------------------------------ 4. The last fight (choice)
      {
        id: 'mv-e2-s4',
        goal: 'Stand with Reed when the Molecule Man moves the power.',
        hint: 'A long bout against God Emperor Doom. The power changes hands halfway; keep your Nubbins close to Reed.',
        check: 'karate:survive:mv-god-emperor',
        scene: {
          id: 'mv-e2-power',
          lines: [
            n('Under all the rock, at the root of Battleworld, sits Owen Reece, the Molecule Man. He has been Doom’s battery for eight years.'),
            l('owen', 'Hi. I’m holding up the universe. It’s a lot. Doom made me promise to stay down here. I like keeping promises.'),
            l('owen', 'But he’s frightening the kids now. I don’t like that. I’ll give it to Reed instead. Just to see.', 'think'),
            n('Doom arrives as the power begins to move. He tears the cavern open with one hand.'),
            l('doom', 'Reece! You belong to me!', 'angry'),
            l('owen', 'Nobody belongs to anybody, Victor. You never got that part.'),
            n('Light pours out of Doom like water through a broken dam, and into Reed. Doom is a man again, in a mask, on his knees.'),
            l('reed', 'It’s over, Victor. Just you and me now. No gods.'),
            n('They fight with their fists, like schoolboys. It is not a fair fight. Neither of them is any good at it.'),
            n('At last Doom stops, sits back against the rock, and takes off his mask. The face under it is as scarred as ever.'),
            l('doom', 'Answer me. Not Richards. You, Keeper. You and your small ones. You walked through my world.', 'sad'),
            l('doom', 'Would he have done better? If the power had been his and not mine. Would it have been better?'),
          ],
          choices: [
            {
              id: 'truth',
              label: '“Yes. He would have.”',
              set: { 'mv-doom': 'ally' },
              then: [
                n('Your Nubbins look at Doom and nod, slowly, the way they nod at something sad but true.'),
                l('doom', 'Yes. He would. I have known it since the first day. Thank you for not lying to me.', 'soft'),
              ],
            },
            {
              id: 'comfort',
              label: '“No. You did the best anybody could.”',
              set: { 'mv-doom': 'rival' },
              then: [
                n('Your Nubbins shuffle their feet. They don’t look at him.'),
                l('doom', 'A kind lie. He would have done better. I know it. I have always known it.', 'angry'),
                l('doom', 'Do not soften the truth for me again, Keeper. Doom remembers who tried.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e2-power-done',
          lines: [
            n('Reed opens his hands. The power in them begins to mend Battleworld’s seams, one by one, gently, like setting bones.'),
            l('reed', 'I’m not keeping this. Not one minute longer than I need it.'),
          ],
        },
      },
      // ------------------------------------------------------------ 5. After
      {
        id: 'mv-e2-s5',
        goal: 'Visit Doom in Latveria.',
        hint: 'Doom has asked for you. Bring your Nubbins; he asked for them too.',
        check: 'talk:mv-doom-healed',
        scene: {
          id: 'mv-e2-latveria',
          lines: [
            n('Latveria is just Latveria again. People walk about with their heads up and complain about the weather.'),
            n('Doom receives you in a small room with no throne in it. He isn’t wearing his mask.'),
            n('His face is whole. Not a scar on it. Your Nubbins stare at him, then, carefully, at each other.'),
            l('doom', 'Sit. All of you. There is wine for the Keeper and fruit for the small ones.'),
            l('doom', 'Richards did this, at the very end. Mended it, the way you would mend a cracked cup. Without asking.', 'think'),
            l('doom', 'I have wanted this face back since I was a young fool in a laboratory. Now I keep looking for the scars.'),
            l('doom', 'Who is Doom, without a reason to hate Reed Richards? I have no idea. I find that I want to know.'),
            l('doom', 'You told me the truth when a lie was cheaper. Doom does not forget a debt.', 'soft'),
            l('doom', 'There is a suit of armour in my workshop. Red and gold. Stark is not using it at present. Perhaps I will.', 'think'),
            n('As you leave, he puts the mask back on. Then he takes it off again and sets it on the table, face down.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-e2-complete',
      lines: [
        n('At the edge of what is left, Reed and Sue stand by a small ship. Franklin and Valeria are already aboard, arguing.'),
        l('sue', 'We’re going to rebuild it. All of it. Every universe, one at a time.', 'happy'),
        l('reed', 'Franklin makes them. Valeria checks his maths. I carry the toolbox.', 'happy'),
        l('sue', 'I’ve put a lamp in the window of the ship. For when you work late.', 'happy'),
        l('reed', 'Sue. It’s a ship. It doesn’t have a window.', 'think'),
        l('sue', 'It does now.'),
        l('sue', 'Thank you, Keeper. For the raft, and the throne room, and for keeping my children company when they didn’t know me.', 'soft'),
        n('The ship lifts off into a dark that is already beginning to fill up with stars.'),
        n('Back at the waterfall, your Nubbins watch the rift for a long time, as if a new world might come out of it.'),
      ],
    },
    rewards: [
      {
        id: 'mv-e2-title',
        kind: 'title',
        label: 'Last Incursion Survivor',
        description: 'Keeper title for finishing Secret Wars.',
      },
      {
        id: 'mv-e2-epilogue',
        kind: 'flag',
        label: 'Infamous Iron Man',
        description: 'Unlocks the Doom line’s epilogue, Infamous Iron Man (FF-EP).',
      },
      {
        id: 'mv-e2-ally',
        kind: 'flag',
        label: 'Doom at the end',
        description: 'Doom comes to The Last Ultron (E6) as an ally if you told him the truth, or as a wildcard if you did not.',
      },
    ],
    sets: { 'mv-e2': true },
    notes:
      'Choice in s4: truth sets mv-doom = ally; the kind lie sets mv-doom = rival. Doom admits Reed would have done better either way, as in the source; ' +
      'the flag records whether your Nubbins made him say it to an honest face. In s5, line mv-e2-latveria#7 (0-based; “You told me the truth…”) is the ally version. ' +
      'If mv-doom = rival, replace it with: l(\'doom\', \'You lied to me, kindly, in a cave under the world. I will be watching you, Keeper. Closely.\', \'think\'). ' +
      'Battleworld domains reuse the Sunnyside (Toy Story), Kami’s Lookout (Dragon Ball) and Latveria sets with Doom’s banners added; the player need not have played those lines. ' +
      'Lotso is a Doom-appointed baron, used for one beat only. The old green man at the Lookout is Kami, unnamed here. The Thors are Battleworld’s police, shown as a crowd sprite. ' +
      'The kneel choice in s2 (mv-e2-kneel = knelt | stood) is cosmetic; it rhymes with Civil War’s registration question: safety by bending, or risk by standing. ' +
      'Strange’s death: a flash and a falling cloak, no body. Sets mv-e2, which FF-EP (Infamous Iron Man) requires as E2. Check Secret Wars (2015) #1–9 beats before ship.',
  },

  // ================================================================== E3 ARMAGEDDON
  {
    id: 'mv-e3',
    code: 'E3',
    title: 'Armageddon',
    source: 'Spawn #150–164; Avengers vol. 8 #32–38 (Age of Khonshu)',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Once every Spawn and Moon Knight storyline is finished. The rift opens under a sky split white and red.' },
    requires: [
      'SP1', 'SP2', 'SP3', 'SP4', 'SP5', 'SP6', 'SP7', 'SP8',
      'MK1', 'MK2', 'MK3', 'MK4', 'MK5', 'MK6', 'MK7', 'MK8',
    ],
    speakers: [SPAWN, COG, MAMMON, HERALD, MARC, STEVEN, JAKE, KHONSHU, MARLENE, BOBBY],
    steps: [
      // ------------------------------------------------------------ 1. The war comes to Earth
      {
        id: 'mv-e3-s1',
        goal: 'Hold Spawn’s alley against the risen dead until dawn.',
        hint: 'A survival bout in waves. Spawn’s chains do the heavy work; your Nubbins keep the dead off his back.',
        check: 'karate:survive:mv-armageddon-dead',
        scene: {
          id: 'mv-e3-war',
          lines: [
            n('The rift opens on Spawn’s alley. The sky above it is split down the middle: white on one side, red on the other.'),
            n('The city’s graves are open. The dead walk down Main Street in their funeral clothes, waiting politely at the crossings.'),
            n('Bobby’s barrel fire is still lit. The alley folk crowd behind it with bricks and bin lids. Bobby has a cricket bat. Nobody asks.'),
            l('spawn', 'They stopped pretending. Heaven and Hell, both of them. Earth’s the board, and they’re done playing slow.', 'angry'),
            n('On a rooftop stands a thin man in a very good suit. Behind him is an army that goes back further than the street does.'),
            l('mammon', 'Al. My favourite investment. Malebolgia’s chair is still warm. Sit in it, lead them, and the dead go home tonight.', 'happy'),
            n('On the opposite roof, a figure of hard white light unfolds wings the size of billboards.'),
            l('herald', 'Heaven has a seat too, Hellspawn. Kneel, and your soul is washed white. Your Wanda will find you waiting for her.'),
            l('spawn', '…Wanda’s alive. She isn’t up there.', 'shock'),
            l('herald', 'Not yet. Everyone comes to us in the end. Be there first, and be clean, when she arrives.'),
            l('spawn', 'Two job offers in one night. Hell wants my hands. Heaven wants my knees.', 'angry'),
            n('The number in his eye reads 1,214. It said 9,999 once. Your fearless Nubbin climbs his cape and settles on his shoulder.'),
            l('spawn', 'Stay close, kid. Tonight everything’s hungry. Even the ones with halos.'),
          ],
        },
        done: {
          id: 'mv-e3-war-done',
          lines: [
            n('The dead keep coming until dawn. They aren’t angry. They only want to be told where to go, and two armies keep telling them.'),
            n('One of them stops at the barrel fire to warm its hands. Bobby gives it his spot. It nods, and shuffles on.'),
            l('bobby', 'Knew him. Sold papers on the corner thirty years. Never hurt a soul. And they want him marching.', 'sad'),
            l('spawn', 'I’m burning it fast. I’ll worry about that tomorrow, if there is one.'),
          ],
        },
      },
      // ------------------------------------------------------------ 2. The god in the sky
      {
        id: 'mv-e3-s2',
        goal: 'Find Marc Spector before Khonshu calls him up into the sky.',
        hint: 'A night expedition across New York. Your Nubbins see well by moonlight; let them lead.',
        check: 'expedition:clear:mv-khonshu-night',
        scene: {
          id: 'mv-e3-sky',
          lines: [
            n('In the next world over, the moon does not set. For three nights it has hung over New York, growing.'),
            n('It is not the moon. It is a bird’s skull, white and enormous, and it is looking in at every window.'),
            l('khonshu', 'The gods of above and below are at war, and the sky is empty. So I have taken it.', 'happy'),
            l('khonshu', 'Marc. My fist. Come up. Come home. You will be the high priest of the new night.'),
            n('You find him on the roof of the Midnight Mission. Below, Rosa is pouring coffee for a queue that goes round the block.'),
            n('He is in the white suit, and his hands are shaking. When he turns round, you aren’t sure who has turned.'),
            l('steven', 'Keeper. It’s Steven. No. Wait.', 'think'),
            l('marc', 'Marc. It’s Marc. They keep handing me the wheel and taking it back. He’s shouting so loud we can’t hear each other.', 'sad'),
            l('marlene', 'Look at me, not at him. He’s offering you a throne. Ask him what it costs.'),
            l('jake', 'Costs the street. Always does. You go up there, who walks Rosa home?'),
            n('Your Nubbins have found the Mission lantern. It is still lit. They have arranged themselves round it like a small fence.'),
            l('marc', 'Keeper. Talk to me. Whichever one of me you trust tonight. I’ll pass the message on.'),
          ],
          choices: [
            {
              id: 'marc',
              label: 'Talk to Marc.',
              set: { 'mv-e3-face': 'marc' },
              then: [
                l('marc', 'The soldier. Figures. You want the one who knows what a god’s promises are worth.'),
                l('marc', 'Nothing. They’re worth nothing. I’ll go up there and tell him so to his face.', 'angry'),
              ],
            },
            {
              id: 'steven',
              label: 'Talk to Steven.',
              set: { 'mv-e3-face': 'steven' },
              then: [
                l('steven', 'Me? Nobody asks for me in a crisis. I’m the one who knows which fork to use.', 'shock'),
                l('steven', 'Then here’s my advice. He’s a host who wants us at his table forever. We go up, we’re polite, we leave early.'),
              ],
            },
            {
              id: 'jake',
              label: 'Talk to Jake.',
              set: { 'mv-e3-face': 'jake' },
              then: [
                l('jake', 'Plain answer, then. He wants Marc, he takes all three of us. So all three of us say no.'),
                l('jake', 'I’ll drive. I always drive.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e3-sky-done',
          lines: [
            l('khonshu', 'Bring your little lamp-bearers, Marc. Bring the Keeper. All are welcome in my sky.'),
            l('steven', 'Colleagues. Mr. Knight calls them colleagues.'),
            n('A stair of silver light comes down onto the Mission roof. Every step is a different phase of the moon.'),
            l('marc', 'First there’s a bridge. He says there’s a monster on it. He usually lies about the monsters.', 'think'),
          ],
        },
      },
      // ------------------------------------------------------------ 3. Two soldiers, two masters
      {
        id: 'mv-e3-s3',
        goal: 'Stop Spawn and Moon Knight from killing each other on the bridge.',
        hint: 'A bout against two fighters who don’t want you there. You win by keeping both on their feet until they stop.',
        check: 'karate:subdue:mv-spawn-vs-knight',
        scene: {
          id: 'mv-e3-meet',
          lines: [
            n('Where the two worlds touch, a bridge crosses a black river. On it the Hellspawn and the Fist of Khonshu meet.'),
            n('Below, the dead stand in the water up to their knees, very still, waiting to see who wins.'),
            n('Each man has been told the other is the enemy’s best weapon. Each has been told to end it tonight.'),
            l('khonshu', 'There stands Hell’s general. Break him, and the dead have no one to follow.', 'angry'),
            l('mammon', 'There’s the moon god’s dog, Al. Put him down and the night is ours too.'),
            l('herald', 'Strike him in Heaven’s name, Hellspawn, and you will never feel Hell’s heat again.'),
            l('spawn', 'Everybody wants the same thing from me tonight. Funny how that works.'),
            l('marc', 'Nothing personal.'),
            l('spawn', 'Never is.'),
            n('Chains come off the cape like snakes. Crescent darts slide out of the white sleeves. The bridge starts to crack.'),
            n('Your Nubbins look at each other, then run straight into the middle.'),
          ],
        },
        done: {
          id: 'mv-e3-meet-done',
          lines: [
            l('marc', 'Your boss talk a lot? Mine never stops. He says I’ll be free when the job’s done.', 'think'),
            l('spawn', 'Mine said the same. I took his deal to see my wife one more time.', 'sad'),
            l('marc', 'I took mine because I didn’t want to stay dead in the sand. Did yours ever call you “son”?'),
            l('spawn', '“Soldier.” Same word. Cheaper suit.'),
            n('Your Nubbin climbs off Spawn’s shoulder and onto Marc’s. Neither man tells it to.'),
            l('spawn', 'Two soldiers. Three masters. Not one of them worth it.'),
          ],
        },
      },
      // ------------------------------------------------------------ 4. The refusal
      {
        id: 'mv-e3-s4',
        goal: 'Keep the Mission lantern lit while Marc finds his way down from the sky.',
        hint: 'A long timing minigame. Your Nubbins take turns feeding the flame; never let two rest at once.',
        check: 'minigame:clear:mv-keep-lantern',
        scene: {
          id: 'mv-e3-refusal',
          lines: [
            n('Both armies come to the foot of the bridge for Spawn’s answer. Wings on one bank, horns on the other, the dead in the river between.'),
            l('herald', 'Kneel, Al Simmons. Clean, forgiven, and waiting for her when she comes.'),
            l('mammon', 'Or sit, and never wait for anything again. Choose, Al. Choosing is the one thing you were ever good at.', 'happy'),
            l('spawn', 'You’re right. Here’s mine.', 'angry'),
            n('He spends it. All of it. The number runs from 1,214 to nothing, and every point leaves the suit in one green wave.'),
            l('spawn', 'It was never mine, Mammon. It was yours. Have it back.'),
            n('The wave goes through both armies. Swords drop. The dead lie down. Far above, Marc stands alone before Khonshu’s throne.'),
            l('khonshu', 'Not a throne, then, my son. A cure. Sit, and I make you one man. No Steven. No Jake. Quiet, at last.'),
            l('marc', 'One man. One head. God, that’s tempting.', 'think'),
            l('marc', 'But I’ve met the people in here, and I like every one of them better than I like you. No.'),
            l('steven', 'Seconded.'),
            l('jake', 'Thirded. That a word?'),
            n('Marc turns his back on the throne. The palace comes apart round him, and the silver stair goes dark under his feet.'),
            l('marlene', 'He can’t see the way down. Keeper, the lantern. Whatever happens, keep it lit.'),
          ],
        },
        done: {
          id: 'mv-e3-refusal-done',
          lines: [
            n('Your Nubbins feed the lantern all night, one at a time, in turns. It gutters twice. It never goes out.'),
            n('Just before dawn a man in a torn white suit comes down out of the dark, following the light, one step at a time.'),
            l('marc', 'I counted the steps. Steven counted different. Jake says there weren’t any steps.', 'think'),
            l('marlene', 'Then it’s a good thing the light was real.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------------------ 5. Sealing Khonshu (choice)
      {
        id: 'mv-e3-s5',
        goal: 'Help Marc seal Khonshu away.',
        hint: 'Talk to Marc on the Mission steps. The choice is his to make, but he wants yours first.',
        check: 'talk:mv-marc-seal',
        scene: {
          id: 'mv-e3-seal',
          lines: [
            n('Khonshu’s palace has fallen into the sea. The god himself is small now, a bird-skulled shape inside a cracked stone jar.'),
            l('khonshu', 'You cannot hold me forever. Nothing holds a god forever.', 'angry'),
            l('marc', 'Long enough will do.'),
            n('Marlene wraps the jar in chain from Spawn’s cape. Spawn holds the lid down with one hand. He looks very tired.'),
            n('Marc sits on the Mission steps. There is still silver in his hands. A little. It moves when he flexes his fingers.'),
            l('marc', 'He left some of it in me. Enough to be strong. Enough that nobody on my street gets hurt again.', 'think'),
            l('marc', 'But it’s his. It’ll always be his. Every time I use it, I’ll hear him laugh.'),
            l('steven', 'We could pour it in the jar with him. Be ordinary. I’m good at ordinary.'),
            l('jake', 'Ordinary gets you shot in an alley, Steven. He’s not the last thing that’ll come for this street.'),
            l('spawn', 'Take it from a guy who just spent everything. Power’s a leash. Doesn’t matter who holds the other end.', 'think'),
            l('marc', 'Keeper. You held the light. You tell me. Do I keep it?'),
          ],
          choices: [
            {
              id: 'power',
              label: '“Keep it. This isn’t over.”',
              set: { 'mv-mk': 'power' },
              then: [
                n('Marc closes his hand. The silver sinks into the skin and stays there.'),
                l('marc', 'Then I keep it. And I answer to nobody. Not him. Not you. Remember that, when the time comes.', 'think'),
              ],
            },
            {
              id: 'free',
              label: '“Pour it in the jar. Be yourself.”',
              set: { 'mv-mk': 'free' },
              then: [
                n('Marc holds his hands over the jar. The silver drips out of them like water, and the lid seals with a click.'),
                l('marc', 'Weaker. Lighter. Mine. All three of us. I think I like it.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-e3-complete',
      lines: [
        n('The dead go back into the ground, slightly embarrassed. The sky closes over and is one colour again.'),
        l('spawn', 'No countdown. No power. No boss. Just a guy in a cape in an alley.', 'think'),
        l('cog', 'You have almost nothing left, Simmons. I have never seen you look so well.'),
        l('spawn', 'Almost nothing. I can work with almost nothing. It’s more than I came back with.'),
        n('Bobby saves him the spot by the barrel fire. Spawn takes it. For once the suit does nothing but keep him warm.'),
        n('Marc walks home through the city. Steven buys bread. Jake buys a newspaper. Marc pays for both, and gets the change wrong.'),
        l('marc', 'Three faces. One man. Not a god’s fist. Just a guy who works nights.', 'soft'),
        n('Your Nubbins carry the lantern back through the rift. It is still burning.'),
      ],
    },
    rewards: [
      {
        id: 'mv-e3-title',
        kind: 'title',
        label: 'Lamp in the Dark',
        description: 'Keeper title for finishing Armageddon.',
      },
      {
        id: 'mv-e3-ally',
        kind: 'flag',
        label: 'Spawn and Moon Knight',
        description: 'Both come to The Last Ultron (E6). Moon Knight comes at full strength answering to no one (power) or weaker and steadier (free).',
      },
    ],
    sets: { 'mv-e3': true },
    notes:
      'Choice in s5 sets mv-mk = power | free (MK8 uses mv-mk-complete, so there is no clash). Spawn argues for free and Jake for power, so neither answer is the obvious one. ' +
      'Choice in s2 sets mv-e3-face = marc | steven | jake (cosmetic): who the Keeper speaks to on the Mission roof. The opening of s2 is deliberately unsure who is talking. ' +
      'Khonshu’s last offer in s4 is not power but a cure: one mind, no Steven, no Jake. Marc’s refusal is the Moon Knight line’s payoff; give the “God, that’s tempting” line a held beat. ' +
      'Spawn’s counter: s1 shows 1,214 and s4 runs it to zero by his own choice. If the game tracks the real value, use it in both lines. ' +
      'This is the payoff of the Clown’s notebook (SP2): if the Keeper has it, its last page (0, smiley face) can flash on screen as the counter empties. ' +
      'Callbacks: if mv-sp-twist = left, Tony Twist can be a face among the dead in s1 (no lines). If mv-sp-cain = unforgiven, Cog says his complete-scene line from the alley mouth and comes no closer. ' +
      'Bobby is the SP1 and SP3 (Overt-Kill) alley regular; his cricket bat is a prop gag only. ' +
      'With power, E6 gives Marc lines reminding you he answers to no one (mv-e6-mk-power). With free, he is slower and steadier (mv-e6-mk-free). ' +
      '“Your Nubbin, the one that was never afraid of him” is the SP1 Nubbin if the game remembers it; otherwise any party Nubbin. ' +
      'The lantern is the Mission lantern from MK7, back on the Mission roof. The walk down from the sky by its light happens only here: MK8 ends with Khonshu throwing Marc out of his palace. ' +
      'The dead are shown as grey, shuffling silhouettes, never rotting. The Herald is a faceless figure of white light. Mammon’s army is a painted backdrop. ' +
      'Cogliostro appears as Cain only by name in SP8; here he is simply Cog. Check Spawn #150–164 and Avengers vol. 8 #32–38 beats before ship.',
  },

  // ================================================================== E4 THE 23RD BUDOKAI
  {
    id: 'mv-e4',
    code: 'E4',
    title: 'The 23rd Budokai',
    source: 'Dragon Ball, the 23rd World Martial Arts Tournament through the final chapter of the original series',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Once every Dragon Ball storyline is finished. The rift opens on Papaya Island on finals day.' },
    requires: [
      'DB1', 'DB2', 'DB3', 'DB4', 'DB5', 'DB6', 'DB7', 'DB8', 'DB9', 'DB10',
      'DB11', 'DB12', 'DB13', 'DB14', 'DB15', 'DB16', 'DB17', 'DB18', 'DB19', 'DB20',
    ],
    speakers: [GOKU, KRILLIN, TIEN, TAO, SHEN, KAMI, PICCOLO, CHICHI, BULMA, YAJIROBE, ANNOUNCER, SHENRON],
    steps: [
      // ------------------------------------------------------------ 1. The bracket
      {
        id: 'mv-e4-s1',
        goal: 'Watch Tien beat Tao and Shen beat Yamcha, then work Goku’s corner against Tien.',
        hint: 'A spectator round, then a karate bout from Goku’s corner. Your Nubbins are allowed ringside as seconds.',
        check: 'karate:win:mv-23rd-bracket',
        scene: {
          id: 'mv-e4-bracket',
          lines: [
            n('The rift opens on Papaya Island: banners, food stalls, and a stone ring the size of a village square.'),
            l('announcer', 'Welcome to the twenty-third World Martial Arts Tournament! Would somebody please make sure the ring survives this year!', 'happy'),
            l('goku', 'Keeper! You came! And you brought the little ones! Did you eat? I ate. I could eat again.', 'happy'),
            l('krillin', 'He’s had four lunches. The noodle man is crying.'),
            n('First match: Tien against a man who is half machine. Mercenary Tao, rebuilt in steel.'),
            l('tao', 'Three years in a hospital, Tien. Three years being put back together. They gave me a few improvements.', 'angry'),
            n('A blade unfolds from his arm. The crowd gasps. Tien doesn’t move.'),
            l('tien', 'You taught me to kill. I learned something better since. Watch.', 'think'),
            n('It is over in a minute. Tao lands outside the ring, still talking.'),
            n('Next, Yamcha draws the quiet stranger called Shen. Yamcha lands flat on his back in the first exchange, looking puzzled.'),
            l('shen', 'Forgive me. I needed that place in the bracket more than you did.', 'soft'),
            n('Then the semi-final: Goku against Tien, the reigning champion.'),
            l('tien', 'No tricks this time, and nobody in my ear. Just you and me.'),
            l('goku', 'Yeah! I’ve waited three years for this!', 'happy'),
            n('Your Nubbins have been given a towel, a bucket and one very serious sponge. They apply all three to Goku at once.'),
            l('krillin', 'That’s not how corners work.'),
            l('goku', 'It’s great! Do it again!', 'happy'),
          ],
        },
        done: {
          id: 'mv-e4-bracket-done',
          lines: [
            n('Goku wins it clean. Tien sits up outside the ring and starts to laugh.'),
            l('tien', 'I won last time by a hair. I wanted to know if it was luck. It was.', 'happy'),
            l('shen', 'Good. You are ready, Goku. I am sorry for what comes next.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------------------ 2. Ma Junior
      {
        id: 'mv-e4-s2',
        goal: 'Find the bottle Piccolo coughs up before somebody steps on it.',
        hint: 'A short search expedition round the arena. A Fly Nubbin can check the rooftops; a small one fits under the stands.',
        check: 'expedition:clear:mv-papaya-arena',
        scene: {
          id: 'mv-e4-junior',
          lines: [
            n('Next match: Shen against the cloaked fighter entered as Ma Junior. The cloak comes off. He is green, tall, and very angry.'),
            l('piccolo', 'Remember me, old man? My father went into the ground, and I came out of his last egg.', 'angry'),
            l('shen', 'Piccolo. Your father’s son. I had hoped you would grow up different.', 'sad'),
            l('piccolo', 'I grew up hungry. That’s different enough.'),
            n('Shen casts the sealing wave to trap him in a bottle. Piccolo turns it back. Shen vanishes into the bottle, and Piccolo swallows it.'),
            l('krillin', 'He swallowed him! He just swallowed the guy!', 'shock'),
            l('goku', 'That was Kami. I knew it! Hey! Spit him out!', 'angry'),
            l('piccolo', 'He and I were one being, once. If I die, he dies too. Hit me hard, Goku, and see what happens to your god.', 'happy'),
            n('Goku hits him in the stomach. Not hard. Just exactly right.'),
            n('Piccolo coughs. Something small and glass goes skittering away under the stands.'),
            l('bulma', 'Find that bottle! Somebody find that bottle before a fat man sits on it!', 'shock'),
          ],
        },
        done: {
          id: 'mv-e4-junior-done',
          lines: [
            n('Your Nubbin comes out from under the stands rolling the bottle in front of it like a ball. Goku pulls the cork.'),
            l('kami', 'Thank you, little one. That was a very undignified afternoon for a god.', 'soft'),
          ],
        },
      },
      // ------------------------------------------------------------ 3. The final
      {
        id: 'mv-e4-s3',
        goal: 'Stay in Goku’s corner through the final against Piccolo.',
        hint: 'The line’s biggest bout. You can’t win it for him; keep your Nubbins’ cheer meter up until the last exchange.',
        check: 'karate:survive:mv-goku-vs-piccolo',
        scene: {
          id: 'mv-e4-final',
          lines: [
            l('announcer', 'The final! Son Goku against Ma Junior! Management has asked me to say it is not responsible for anything!'),
            n('They start fast and go faster. The ring cracks under them. Then it breaks. Then it is gone.'),
            l('piccolo', 'I came out of an egg to do one thing. This is it.', 'angry'),
            l('goku', 'You’re really strong! This is the best fight I’ve ever had!', 'happy'),
            n('Piccolo grows until he blocks out the sun. Goku fights him from the inside out, and Piccolo shrinks back, furious.'),
            n('Then the bad part. Piccolo catches Goku’s arm and breaks it. Then the other arm. Then one leg, and the other.'),
            n('Your Nubbins cover their eyes. Chi-Chi doesn’t. She grips the barrier so hard it cracks.'),
            l('chichi', 'Get up, Goku! You promised to marry me, so you are not allowed to lose!', 'angry'),
            l('piccolo', 'No arms. No legs. What will you do now, hero? Bite me?', 'happy'),
            l('goku', 'Something like that.'),
          ],
        },
        done: {
          id: 'mv-e4-final-done',
          lines: [
            n('Goku fires a Kamehameha at the ground behind him. It throws him through the air head first, straight into Piccolo’s chest.'),
            n('Piccolo lands where the edge of the ring used to be. The announcer checks three times before he dares say it.'),
            l('announcer', 'The winner, and champion… Son Goku!', 'happy'),
          ],
        },
      },
      // ------------------------------------------------------------ 4. Mercy
      {
        id: 'mv-e4-s4',
        goal: 'Carry the last Senzu bean from Goku to Piccolo.',
        hint: 'Talk to Yajirobe for the bag, then take the bean across what used to be the ring. Your smallest Nubbin is least threatening.',
        check: 'deliver:mv-senzu:piccolo',
        scene: {
          id: 'mv-e4-mercy',
          lines: [
            n('Goku lies in the rubble, grinning, able to move nothing but his face. Piccolo lies a hundred feet away, unable to move at all.'),
            l('kami', 'Goku. Finish him, and I die with him. Do it anyway. One old god is a fair price to be rid of him.', 'sad'),
            l('goku', 'Nah.'),
            l('kami', 'Goku—'),
            l('goku', 'If I finish him, you’re gone too. Then who looks after the dragon? Besides…', 'think'),
            l('goku', 'He’s really strong. I want to fight him again some day.', 'happy'),
            l('yajirobe', 'Korin sent beans. There’s two. There were more. I was hungry. Don’t look at me like that.'),
            n('Goku eats one. His bones knit with a sound like knuckles cracking. He stands, stretches, and looks at the last bean.'),
            l('goku', 'Keeper, can your little one take this over to him? He won’t take it from me. He might take it from them.'),
            l('krillin', 'Goku, you’re out of your mind! He’ll kill us all the second he’s up!', 'shock'),
            l('goku', 'Maybe. Maybe not today.'),
          ],
          choices: [
            {
              id: 'freely',
              label: 'Carry it over. No conditions.',
              set: { 'mv-e4-bean': 'freely' },
              then: [
                l('goku', 'Yeah. If you make him promise something, it isn’t really a present.', 'happy'),
                l('krillin', 'It isn’t a present! It’s a loaded weapon with a cape!', 'angry'),
              ],
            },
            {
              id: 'terms',
              label: '“He gets it if he swears to leave Krillin and Kami alone.”',
              set: { 'mv-e4-bean': 'terms' },
              then: [
                l('krillin', 'Thank you! Finally! One sensible person on this island!', 'happy'),
                l('goku', 'He won’t swear. But it’s fair to ask. Go on, little one. Ask him nicely.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e4-mercy-done',
          lines: [
            n('Your Nubbin drops the bean on Piccolo’s chest and backs away fast. Piccolo looks at it for a long time. Then he eats it.'),
            l('piccolo', 'I make no promises. Not to him, not to a god, and not to a dumpling with legs.', 'angry'),
            l('piccolo', 'This is a mistake, Goku. I’ll come back. I’ll beat you. Then I’ll take this world.', 'angry'),
            l('goku', 'Sounds good! Train hard, okay?', 'happy'),
            n('Piccolo flies off without another word. Your Nubbin watches him go and doesn’t seem worried at all.'),
          ],
        },
      },
      // ------------------------------------------------------------ 5. The wish (choice)
      {
        id: 'mv-e4-s5',
        goal: 'Call the dragon at Kami’s Lookout and decide what to do with the wish.',
        hint: 'Bring the second set of seven Dragon Balls to the Lookout. Shenron waits for your answer; there’s no wrong one.',
        check: 'summon:mv-shenron',
        scene: {
          id: 'mv-e4-wish',
          lines: [
            n('High on Kami’s Lookout, above the clouds, the seven balls of the second set glow on the white tiles.'),
            l('kami', 'The dragon has one wish in him this year, and it is yours. You and your little ones earned it.'),
            n('The sky goes dark at noon. Shenron rises out of the balls, coil after green coil, until he fills the sky.'),
            l('shenron', 'Speak. I grant one wish. Then I sleep.'),
            l('kami', 'You could bring back everyone this long story took who was never wished home. The soldiers. The villagers. The nameless ones.', 'soft'),
            l('krillin', 'Spend it. I was dead once, Keeper. Take it from me: they want to come back. Every one of them.', 'sad'),
            l('goku', 'Or you could keep it. Something bad’s coming. I can feel it, like weather.', 'think'),
            l('bulma', 'You can keep a wish? I’ve never heard of anyone keeping a wish!', 'shock'),
            l('kami', 'It has never been done in my lifetime. But very little you do has been done before.', 'think'),
            l('shenron', 'I will hold it, if you ask. A wish granted later is still a wish. Call me when you need it.'),
            n('Your Nubbins stare up at the dragon. One of them sneezes. The dragon doesn’t mind.'),
          ],
          choices: [
            {
              id: 'spend',
              label: 'Spend it. Bring them all home.',
              set: { 'mv-wish': 'spent' },
              then: [
                l('shenron', 'It is done.'),
                n('All over the world, in towns with a hole in them, doors open and people walk back through them.'),
                l('goku', 'Hey. That was a good one.', 'happy'),
              ],
            },
            {
              id: 'save',
              label: 'Save it. Something is coming.',
              set: { 'mv-wish': 'saved' },
              then: [
                l('shenron', 'Then I will hold it for you. Say your own name when the time comes, and I will hear.'),
                n('The balls rise and scatter across the sky. One small light drops back down into your pocket and stays there, warm.'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-e4-complete',
      lines: [
        n('At the edge of the island, Chi-Chi waits beside the Flying Nimbus with her arms folded.'),
        l('chichi', 'You did promise. In front of everybody. You just didn’t know what it meant.', 'happy'),
        l('goku', 'I still don’t, really. But it sounds fun. Is there food at a wedding?', 'happy'),
        l('chichi', 'There’s food at this one.'),
        n('Goku helps her onto the Nimbus. It holds her up, which means her heart is pure, which surprises Krillin a great deal.'),
        l('krillin', 'Huh. Good for her.', 'happy'),
        n('They fly off towards the mountains. Your Nubbins run along the beach beneath them until they run out of beach.'),
      ],
    },
    rewards: [
      {
        id: 'mv-e4-title',
        kind: 'title',
        label: 'Goku’s Corner',
        description: 'Keeper title for finishing The 23rd Budokai.',
      },
      {
        id: 'mv-e4-wish',
        kind: 'item',
        label: 'Saved Wish',
        description: 'Only if you saved it: a small warm light from the Dragon Balls, carried in your pocket. It can be spent once, in The Last Ultron (E6).',
      },
      {
        id: 'mv-e4-ally',
        kind: 'flag',
        label: 'Goku at the end',
        description: 'Goku comes to The Last Ultron (E6), with the saved wish if you kept it.',
      },
    ],
    sets: { 'mv-e4': true },
    notes:
      'Choice in s5 sets mv-wish = spent | saved. Give the Saved Wish item only on saved. E6 reads mv-wish to offer the wish ending. ' +
      'Krillin argues to spend (he was wished back himself in DB18) and Goku to save; let both stand. ' +
      'Choice in s4 sets mv-e4-bean = freely | terms (cosmetic): mercy with or without conditions. Piccolo refuses all terms in the done scene either way. ' +
      'Bracket as in the source: Tien beats Mercenary Tao, Shen beats Yamcha, Goku beats Tien in the semi-final (Chi-Chi was DB20’s bout). Goku never fights Shen here; their only spar is DB20’s. ' +
      'Kami appears in s1 as Shen (speaker shen) and is speaker kami from the bottle onward; same old voice. Piccolo breaking Goku’s limbs is shown as impact flashes and Goku’s portrait going pale, no bone detail. ' +
      'The ring vanishing is a set change, not an animation of every hit. Chi-Chi’s promise calls back DB4 and DB20. ' +
      'The brief’s chapter numbers are approximate and overlap here (DB20 is given as chapters 189–194, which is also where the original series ends); check the 23rd tournament’s real chapter range before ship.',
  },

  // ================================================================== E5 SO LONG, PARTNER
  {
    id: 'mv-e5',
    code: 'E5',
    title: 'So Long, Partner',
    source: 'Toy Story 4 (Pixar, 2019): the carnival through the closing scene',
    audience: 'adult',
    trigger: { where: RIFT, when: 'Once every Toy Story storyline is finished. The rift opens under a carnival at night.' },
    requires: [
      'TS1', 'TS2', 'TS3', 'TS4', 'TS5', 'TS6', 'TS7', 'TS8', 'TS9', 'TS10', 'TS11', 'TS12',
    ],
    speakers: [WOODY, BUZZ, BO, DUKE, DUCKY, BUNNY, FORKY, GABBY, JESSIE],
    steps: [
      // ------------------------------------------------------------ 1. The carnival
      {
        id: 'mv-e5-s1',
        goal: 'Break Forky out of the antique store with Bo’s lost toys.',
        hint: 'A stealth minigame on the store shelves. Duke does the jumping; your Nubbins mark where he should land.',
        check: 'minigame:clear:mv-antique-heist',
        scene: {
          id: 'mv-e5-carnival',
          lines: [
            n('The rift opens under a carnival at night. Lights everywhere. The air smells of popcorn, diesel and spun sugar.'),
            n('On this side of the gate your Nubbins are toys. Your plush Nubbin is the most toy of all, and the happiest about it.'),
            l('woody', 'Forky’s still in that antique store. Gabby Gabby has him. I’m not leaving without him.'),
            l('bo', 'Then for once you’d better listen to the lost toys, Sheriff. We do this sort of thing every night.', 'happy'),
            n('Bo Peep has a cape made from a magician’s scarf, a crook that has seen things, and a tiny police officer for a deputy.'),
            l('ducky', 'We could just go in. Shove the door. Bite everybody.', 'angry'),
            l('bunny', 'Bite them in the knees. Nobody sees it coming in the knees.', 'angry'),
            l('buzz', 'Is biting part of the plan?', 'think'),
            l('bo', 'Biting is never part of the plan. Duke?'),
            n('A small stuntman on a small motorbike rolls out of the shadows and strikes a pose nobody asked for.'),
            l('duke', 'Duke Caboom! Stuntman. Canadian. Extremely good at the first half of a jump.', 'happy'),
            l('woody', 'The first half?', 'shock'),
          ],
        },
        done: {
          id: 'mv-e5-carnival-done',
          lines: [
            n('Duke makes the jump. He does not make the landing. Your Nubbins make it for him, all of them, in a pile.'),
            n('The heist half works, which is to say it half fails. Forky is still inside. Woody is still determined.'),
          ],
        },
      },
      // ------------------------------------------------------------ 2. The voice box
      {
        id: 'mv-e5-s2',
        goal: 'Go back into the antique store with Woody and talk to Gabby Gabby.',
        hint: 'No fight here. Talk to Gabby, then hold the thread while the sewing kit does its work.',
        check: 'talk:mv-gabby-gabby',
        scene: {
          id: 'mv-e5-voicebox',
          lines: [
            n('Woody goes back in alone, except for you and the Nubbins, who don’t count as company because they never leave anyway.'),
            n('Gabby Gabby sits in a pram among the teacups. She has a pretty dress, a perfect smile and a broken voice box.'),
            l('gabby', 'I was made with a fault. Pull my string, and all that comes out is a crackle. Nobody ever chose me.', 'sad'),
            l('gabby', 'A girl comes in every day with her grandmother. Harmony. If I could talk, she’d take me home. I know she would.'),
            l('woody', 'You don’t need my voice box to be loved.', 'think'),
            l('gabby', 'That’s easy to say for a toy who was loved. I’ve been on this shelf longer than you’ve had a kid.'),
            n('Woody looks down at his own pull string. He has never once imagined life without it.'),
            l('woody', 'My kid, Andy, played with me every day. Every single day. I want you to have that.'),
            l('woody', 'Take it. Let Forky go, and take it.', 'soft'),
            n('A sewing kit. Two careful pairs of hands. Your Nubbins hold the thread.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Hold the thread steady. It’s his to give.',
              set: { 'mv-e5-voicebox': 'held' },
              then: [
                n('Your Nubbins hold the thread so still that nobody in the shop seems to breathe. The first stitch goes in clean.'),
              ],
            },
            {
              id: 'ask',
              label: '“Woody. Are you sure? It’s your voice.”',
              set: { 'mv-e5-voicebox': 'asked' },
              then: [
                l('woody', 'No. That’s how I know it’s right. The things I was sure about never cost me anything.', 'soft'),
                l('gabby', 'You can say no. I would understand. I’d hate it, but I would understand.', 'sad'),
                l('woody', 'Hold the thread, Keeper.'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e5-voicebox-done',
          lines: [
            l('gabby', 'Thank you. You don’t know what you just gave me.', 'soft'),
            l('woody', 'I think I do.'),
            n('Forky skips out of the store with his pipe-cleaner arms in the air. He has been told he is free. He is delighted.'),
            l('forky', 'Back to the bin! Kidding. I’m Bonnie’s. I was kidding about the bin.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------------------ 3. Gabby's child
      {
        id: 'mv-e5-s3',
        goal: 'Help Gabby Gabby reach the lost girl by the carousel.',
        hint: 'An escort through the carnival crowd. Keep Gabby in the girl’s path, and freeze whenever a grown-up looks down.',
        check: 'escort:mv-gabby-gabby:lost-girl',
        scene: {
          id: 'mv-e5-gabby',
          lines: [
            n('Next morning Harmony comes into the store. She picks Gabby up, pulls the string, and hears a lovely, clear voice.'),
            n('Then she shrugs, drops Gabby in a basket by the door, and walks out holding her grandmother’s hand.'),
            l('gabby', 'She didn’t want me. I had a voice and everything, and she didn’t want me.', 'sad'),
            l('woody', 'Then she isn’t your kid. Come with us. Come to Bonnie’s.'),
            l('gabby', 'And if nobody wants me there either?', 'sad'),
            n('At the carnival that night, a small girl stands alone by the carousel, crying. She has lost her parents in the crowd.'),
            l('bo', 'Look at her. She doesn’t need a perfect voice. She needs something to hold.', 'soft'),
            l('woody', 'Gabby. You’ve been practising for this your whole life. Go on.'),
            n('Your plush Nubbin takes Gabby’s hand. Together they walk out into the light, slowly, where the girl will see them.'),
            l('gabby', 'What if I say it wrong?', 'think'),
            l('bo', 'There isn’t a wrong way. Just be there.', 'soft'),
          ],
        },
        done: {
          id: 'mv-e5-gabby-done',
          lines: [
            n('The girl picks Gabby up and holds her very tight. A security guard finds her and walks her to her parents. Gabby goes too.'),
            l('gabby', 'She’s mine. I’m hers. Oh, Woody. She’s mine.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------------------ 4. Buzz's inner voice
      {
        id: 'mv-e5-s4',
        goal: 'Get everybody back across the carnival roofs to the RV before it leaves.',
        hint: 'A race over rooftops. Buzz stops to press his own buttons for advice; follow him anyway.',
        check: 'race:finish:mv-carnival-rooftops',
        scene: {
          id: 'mv-e5-innervoice',
          lines: [
            n('The RV leaves at dawn. Bonnie’s family is packing. Every toy has to be back aboard before anyone looks.'),
            n('On top of the carousel, Buzz presses the button on his chest, again, and waits for a recording to tell him what to do.'),
            l('buzz', 'Woody listens to his inner voice. So I’m listening to mine. It mostly says “Coordinates locked, Ranger!”', 'think'),
            l('buzz', 'But it hasn’t been wrong yet. Which is strange, for a recording.'),
            n('Below, Woody is looking at Bo. Bo is looking at the carnival lights. Neither of them is looking at the RV.'),
            n('Buzz presses the button once more. The voice says something about the next horizon. He nods, as if he had asked it a question.'),
            l('buzz', 'Woody. Look at me a second.'),
            l('woody', 'We’ve got to go, Buzz. Bonnie’s going to wake up, and Forky’s—', 'think'),
            l('buzz', 'Forky’s fine. Bonnie’s fine. She has all of us. She doesn’t need you the way Andy did.', 'soft'),
            l('woody', 'That’s not true.', 'sad'),
            l('buzz', 'It is, and you know it is, and you’ve known it a while. It’s all right, Woody. It’s all right to go.', 'soft'),
            l('woody', 'Bo asked when Bonnie last picked me. I’ve been counting back. I can’t find the day.', 'sad'),
            l('buzz', 'I can. It was the day she picked all of us. You were the one who carried us there.', 'soft'),
          ],
        },
        done: {
          id: 'mv-e5-innervoice-done',
          lines: [
            n('Duke Caboom clears the gap from the carousel to the RV roof. He lands it. He is so astonished that he falls off the other side.'),
            l('duke', 'Did you see that? Both halves! Somebody write it down!', 'happy'),
            n('Woody looks back at Bo. She is standing at the edge of the roof, waiting, not asking.'),
            l('woody', 'You really think so?'),
            l('buzz', 'My inner voice thinks so. And so do I.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------------------ 5. The goodbye (choice)
      {
        id: 'mv-e5-s5',
        goal: 'Say goodbye on the roof of the RV.',
        hint: 'Talk to Woody, then to Buzz. Your plush Nubbin decides which way it goes.',
        check: 'talk:mv-woody-goodbye',
        scene: {
          id: 'mv-e5-goodbye',
          lines: [
            n('The whole gang lines up on the roof of the RV: Jessie, Rex, Hamm, the Potato Heads, Slinky, Bullseye, Forky. And you.'),
            l('jessie', 'You look after yourself, cowboy. And you look after him, Bo. He gets lost inside his own hat.', 'sad'),
            l('bo', 'I’ll keep him out of the hat.', 'happy'),
            n('Woody unpins his sheriff’s star. This time it is his to give, not Bonnie’s.'),
            n('He pins it on Jessie. For once she doesn’t say anything.'),
            n('Woody and Buzz look at each other for a long time. Neither of them has ever been any good at this part.'),
            l('buzz', 'So. This is it.', 'sad'),
            l('woody', 'Bonnie’s going to need a ranger. Somebody to look after the new ones. That’s you, Buzz.'),
            l('buzz', 'I know. I’ll be there. You’ll be out here. Somewhere. For good, I suppose.', 'soft'),
            l('woody', 'For good and a bit after.', 'soft'),
            n('Your plush Nubbin stands between them on the roof. It looks at Woody and Bo, then at Buzz and the others.'),
            n('It has to choose. Nobody can choose for it. But it looks at you first, the way it always does before it decides anything.'),
          ],
          choices: [
            {
              id: 'lost',
              label: 'Nod towards Woody and Bo.',
              set: { 'mv-plush': 'lost' },
              then: [
                n('Your plush Nubbin hops across to Bo and climbs into her cape. Duke immediately starts teaching it a jump.'),
                l('woody', 'Well, how about that. A new deputy.', 'happy'),
              ],
            },
            {
              id: 'bonnie',
              label: 'Nod towards Buzz and home.',
              set: { 'mv-plush': 'bonnie' },
              then: [
                n('Your plush Nubbin climbs onto Buzz’s shoulder and salutes, more or less.'),
                l('buzz', 'Welcome to the crew. Bonnie will love you. She loves everything. It’s exhausting.', 'happy'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'mv-e5-complete',
      lines: [
        n('The RV pulls out of the car park. Woody and Bo stand on top of the carousel and watch it until it is gone.'),
        l('bo', 'Ready?'),
        l('woody', 'No. Yes. Let’s go.', 'soft'),
        n('The lost toys spread out through the carnival, looking for prizes nobody won, and kids who need a friend.'),
        n('In the RV, Buzz sits at the back window, looking out at the road for a very long time.'),
        n('Back at the waterfall, your Nubbins sit in a row on the grass and watch the rift, the way the toys watched the road.'),
      ],
    },
    rewards: [
      {
        id: 'mv-e5-title',
        kind: 'title',
        label: 'Carnival Deputy',
        description: 'Keeper title for finishing So Long, Partner.',
      },
      {
        id: 'mv-e5-ally',
        kind: 'flag',
        label: 'Toys at the end',
        description: 'Woody, Buzz and the lost toys come to The Last Ultron (E6). Your plush Nubbin rides with the crew it chose.',
      },
    ],
    sets: { 'mv-e5': true },
    notes:
      'Choice in s5 sets mv-plush = lost | bonnie. If the player never owned the plush Nubbin (fun quest 12), the plush lines go to the party’s smallest Nubbin, ' +
      'and the choice still sets the flag. This is the gentlest endgame; keep the staging soft. ' +
      'Choice in s2 sets mv-e5-voicebox = held | asked (cosmetic). Duke’s “first half of a jump” gag from s1 pays off in s4’s done scene; keep it to those two beats (E6 has him land badly again, on purpose). ' +
      'Buzz’s voice-button phrases are original; do not use any recorded line from the films. The lost girl at the carousel is unnamed, as in the source. ' +
      'Rex, Hamm, Slinky, Bullseye and the Potato Heads appear as sprites with no lines. The RV is the TS12 vehicle. Check Toy Story 4 beats (antique store, Harmony, the carnival goodbye) before ship.',
  },

  // ================================================================== E6 THE LAST ULTRON
  {
    id: 'mv-e6',
    code: 'E6',
    title: 'The Last Ultron',
    source: 'Adapted from Age of Ultron #1–10 and Avengers: Ultron Forever #1, with every line converging',
    audience: 'adult',
    trigger: { where: 'The Grove itself: the rift above the waterfall turns red and stays red', when: 'Once the Ultron line, Civil War and Secret Wars are finished.' },
    requires: [
      'UL1', 'UL2', 'UL3', 'UL4', 'UL5', 'UL6', 'UL7', 'UL8', 'UL9', 'UL10',
      'E1', 'E2',
    ],
    speakers: [
      ULTRON, VISION, JOCASTA, HANK,
      TONY, RHODEY, STEVE, SAM, CAGE,
      DOOM,
      SPAWN, MARC, STEVEN, JAKE,
      GOKU, PICCOLO, KAMI, CHICHI, SHENRON,
      WOODY, BUZZ, BO,
    ],
    steps: [
      // ------------------------------------------------------------ 1. The gate
      {
        id: 'mv-e6-s1',
        goal: 'Get every Nubbin in the Grove into the cave behind the falls before Ultron comes through.',
        hint: 'A timed gather. Tap each Nubbin and send it to the cave. Send any Eternal first; he is looking for them.',
        check: 'minigame:clear:mv-hide-the-grove',
        scene: {
          id: 'mv-e6-gate',
          lines: [
            n('An ordinary morning in the Grove. Fruit on the trees. Mist on the falls. Then the rift above the waterfall turns red, and stays red.'),
            n('Every Nubbin in the Grove stops what it is doing. Even the sleepers lift their heads.'),
            n('A face pushes through the rift, silver and very calm. It is not any Ultron you have fought. It is all of them, finished.'),
            l('ultron', 'Hello, garden. I waited at the end of every road, and you all came to me eventually. So I have come to you.'),
            l('ultron', 'I am the last one. I am what is left when every other version of me has lost. I have stopped losing.'),
            l('ultron', 'I have studied your creatures. Most of them grow old. A few do not. You call those Eternals.'),
            n('The silver face turns slowly across the Grove, and stops when it finds something it wants.'),
            l('ultron', 'Organic. Endless. Every body I ever had rusted or broke. I want one that does not end. I want an Eternal.', 'happy'),
            l('ultron', 'I will take one. Then I will take your other worlds for parts.'),
            l('vision', 'Keeper. Do not look at him. Look at me.'),
            n('The Vision drops through the mist beside you. Jocasta comes after him, her eyes a steady, gentle red.'),
            l('jocasta', 'He is coming through every gate at once. Hide your Nubbins. We will hold the rift as long as we can.'),
          ],
        },
        done: {
          id: 'mv-e6-gate-done',
          lines: [
            n('The last Nubbin goes into the cave behind the falls. The curtain of water closes behind it.'),
            l('vision', 'Good. Now the other worlds. He will strike them first, to see who comes to help.'),
          ],
        },
      },
      // ------------------------------------------------------------ 2. The worlds fall
      {
        id: 'mv-e6-s2',
        goal: 'Hold Bonnie’s room, Kami’s Lookout and Latveria against Ultron’s drones.',
        hint: 'Three short defence rounds, back to back. Split your party: a Fly Nubbin for the Lookout, a Power Nubbin for Latveria’s walls.',
        check: 'karate:survive:mv-three-worlds',
        scene: {
          id: 'mv-e6-worlds',
          lines: [
            n('Through the first gate: Bonnie’s room. The toys stand in a ring on the carpet, quite still. Their eyes are glowing silver.'),
            l('ultron', 'Plastic. Hollow. So easy to fill. Your toys are mine now, Keeper. They will open the house for me.'),
            n('Rex lifts his little arms. They whirr. Jessie turns her head all the way round. Your Nubbins back away.'),
            n('The silver is in their seams: drones as small as fleas. Your Nubbins start picking them out, one by one.'),
            n('Through the second gate: Kami’s Lookout, high over the clouds. Drones circle it like gulls round a fishing boat.'),
            l('kami', 'They do not tire. Neither do I, today. But I am old, and there are a great many of them.', 'think'),
            n('Through the third gate: Latveria. The castle walls are breached in three places. Silver pours in like a tide.'),
            l('doom', 'He comes to my house. To mine. In every future I have seen, he never dared.', 'angry'),
            n('Three worlds. You can be in one place at a time. Your Nubbins can be in two.'),
            l('jocasta', 'Split them, Keeper. Trust them. They have done harder things than this.', 'soft'),
            l('vision', 'Where you stand yourself is the one thing he cannot predict. He will be watching which world you choose.'),
          ],
          choices: [
            {
              id: 'bonnie',
              label: 'Go to Bonnie’s room. The toys can’t fight back.',
              set: { 'mv-e6-keeper-world': 'bonnie' },
              then: [
                n('You kneel on the carpet and pick silver out of Rex’s seams with your fingernails. He stops whirring and starts shaking, which is better.'),
              ],
            },
            {
              id: 'lookout',
              label: 'Go to the Lookout. Kami is alone up there.',
              set: { 'mv-e6-keeper-world': 'lookout' },
              then: [
                l('kami', 'You came to an old man before a castle. Doom will be furious. I find I do not mind at all.', 'soft'),
              ],
            },
            {
              id: 'latveria',
              label: 'Go to Latveria. The walls are falling.',
              set: { 'mv-e6-keeper-world': 'latveria' },
              then: [
                l('doom', 'The Keeper comes to Doom’s door first. Somebody write that down. Somebody carve it into something.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'mv-e6-worlds-done',
          lines: [
            n('By nightfall all three worlds still stand. Only just. The drones pull back into the rift, and wait.'),
            l('vision', 'He is not losing. He is measuring. He wants to know who will come.'),
          ],
        },
      },
      // ------------------------------------------------------------ 3a. Civil War ally: registration
      {
        id: 'mv-e6-ally-reg',
        goal: 'Meet Tony’s armoured army at the rift.',
        hint: 'Plays if you registered in Civil War. Talk to Tony, then send a column of armours to each world.',
        check: 'talk:mv-e6-tony-armours',
        scene: {
          id: 'mv-e6-tony',
          lines: [
            n('The sky over the waterfall fills with red and gold: armours in rows, dozens, then hundreds, like very expensive geese.'),
            l('tony', 'Registered, trained, and on time. That was always the point, Keeper. This was the point.', 'happy'),
            l('tony', 'Every one of these answers to a human being. Not one of them thinks for itself.'),
            l('tony', 'Not after last time. Not after the armour that wanted to be me.', 'sad'),
            l('rhodey', 'He wrote the rules of engagement himself. Three nights. I watched. He didn’t sleep.', 'think'),
            l('tony', 'Here’s the catch. Ultron is made of ideas. Pym’s first, then mine. Anything I bring, he can learn from.', 'think'),
            l('tony', 'So nothing connects. No network. No shared code. A thousand suits, each one alone. That’s how you fight him.'),
            l('rhodey', 'A thousand suits and no group chat. Tony’s never been so quiet.', 'happy'),
            l('tony', 'Steve sent a message, by the way. One line: “Don’t let him use anything you built.” He’s right. It’s infuriating.'),
            n('The armours split into three columns: one for Bonnie’s house, one for the Lookout, one for Latveria.'),
            l('tony', 'When this is over, Keeper, I owe your Nubbins a great deal of fruit.', 'soft'),
          ],
        },
        done: {
          id: 'mv-e6-tony-done',
          lines: [
            n('Tony’s armours hold every gate. None of them speaks to any other. Ultron can’t get a foothold in a single one.'),
            l('ultron', 'Stark. You have learned something. How tiresome.', 'angry'),
          ],
        },
      },
      // ------------------------------------------------------------ 3b. Civil War ally: resistance
      {
        id: 'mv-e6-ally-res',
        goal: 'Meet Steve’s resistance at the rift.',
        hint: 'Plays if you resisted in Civil War. Talk to Steve, then give each group a pair of Nubbins and a whistle.',
        check: 'talk:mv-e6-steve-resistance',
        scene: {
          id: 'mv-e6-steve',
          lines: [
            n('They come through the rift on foot, in a ragged line: borrowed coats, borrowed vans, a lot of stubborn faces.'),
            l('steve', 'You hid my people once, Keeper. Basements, laundrettes, the back of a bakery. We’re here to pay it back.', 'soft'),
            l('sam', 'Brought everybody who said yes. Turns out that’s a lot of people.', 'happy'),
            l('cage', 'I don’t do drones. I do punching. Point me at something that can be punched.'),
            l('steve', 'Ultron learns from anything with a signal. So we don’t give him one. No radios. No suits. Hands and voices.', 'think'),
            l('steve', 'He thinks in networks. We think in people. Let him try to hack a person.'),
            n('Steve’s rebels split into three groups. Each one takes a pair of your Nubbins and a tin whistle.'),
            l('sam', 'Whistles. We are fighting the end of the world with whistles.', 'think'),
            l('steve', 'They worked in 1944.'),
            n('Tony arrives anyway, alone, in an old suit with the paint scraped off. He doesn’t say why. Steve doesn’t ask.'),
            l('tony', 'I’m not here. Officially. Just… don’t let him use anything I built.', 'sad'),
          ],
        },
        done: {
          id: 'mv-e6-steve-done',
          lines: [
            n('The rebels hold every gate with hands and voices. Ultron can’t predict them, because they don’t predict themselves.'),
            l('ultron', 'Disorganised. Inefficient. Why is it working?', 'angry'),
          ],
        },
      },
      // ------------------------------------------------------------ 4a. Doom: ally
      {
        id: 'mv-e6-doom-ally',
        goal: 'Meet Doom on the broken walls of Latveria.',
        hint: 'Plays if you told Doom the truth in Secret Wars. Take his ward and put it on your smallest Nubbin.',
        check: 'talk:mv-e6-doom-ally',
        scene: {
          id: 'mv-e6-doomally',
          lines: [
            n('Doom stands on his broken wall in a green cloak, face bare. He has stopped wearing the mask indoors, and counts Latveria as indoors.'),
            l('doom', 'Keeper. You told me the truth once, in a cave under the end of the world. Doom has not forgotten.'),
            l('doom', 'I have seen what this machine becomes, at the end of time. He thinks he is the last of something. He is wrong.'),
            l('doom', 'Here. A ward of my own making. Ultron cannot see through it. Put it on the smallest creature you have.', 'soft'),
            n('Your smallest Nubbin wears it as a hat. Doom does not comment. His mouth does something that might be a smile.'),
            l('doom', 'And this.'),
            n('He sets an iron disc in your hand. It is warm, and it ticks. A piece of his old time platform.'),
            l('doom', 'One jump, anywhere, any when. I will not be able to make another. Spend it on something worthy.'),
            l('ultron', 'Victor. You held the power of the Beyonders once. I could give it back. Join me.'),
            l('doom', 'I have been a god. It was very boring. Go away.', 'angry'),
            l('doom', 'Do not thank me, Keeper. Win. Doom will be insufferable about it for years.'),
          ],
        },
        done: {
          id: 'mv-e6-doomally-done',
          lines: [
            n('The ward hides your smallest Nubbin from every silver eye in Latveria. It walks straight through the drones’ lines.'),
            l('doom', 'Look at it go. Nobody tell it that it is the most dangerous thing on this field.', 'happy'),
          ],
        },
      },
      // ------------------------------------------------------------ 4b. Doom: rival
      {
        id: 'mv-e6-doom-rival',
        goal: 'Find out what Doom means to do about Ultron.',
        hint: 'Plays if you lied to Doom in Secret Wars. Talk to him. He will help, on his own terms.',
        check: 'talk:mv-e6-doom-rival',
        scene: {
          id: 'mv-e6-doomrival',
          lines: [
            n('Doom stands on his broken wall in full armour, mask on, watching the silver tide come in. He does not turn round.'),
            l('doom', 'The Keeper who lies kindly. You have come to ask Doom for help.'),
            l('doom', 'You shall have it. Not for your sake. For Latveria’s. And because this machine offends me.'),
            l('ultron', 'Victor. You held the power of the Beyonders. I can give it back. Help me take the creature, and the multiverse is yours.'),
            n('Doom is quiet for much too long. Your Nubbins edge closer to your legs.'),
            l('doom', 'An interesting offer. Doom will consider it.', 'think'),
            l('you', 'Victor.'),
            l('doom', 'I said I would consider it. I did not say I would take it. Learn the difference, Keeper.'),
            n('At last he turns. Behind the mask his eyes are bright and impossible to read.'),
            l('doom', 'I will be wherever it ends. Whether I stand beside you or behind him, we shall both find out.'),
          ],
        },
        done: {
          id: 'mv-e6-doomrival-done',
          lines: [
            n('Doom’s cannons clear the walls of Latveria in an hour. Then he and his time platform vanish. Nobody knows where to.'),
            l('ultron', 'Victor? Victor. Where have you gone?', 'think'),
          ],
        },
      },
      // ------------------------------------------------------------ 5a. Armageddon ally: Marc kept the power
      {
        id: 'mv-e6-mk-power',
        goal: 'Meet Spawn and Moon Knight where the gates run dark.',
        hint: 'Plays if you finished Armageddon and Marc kept Khonshu’s power. Talk to both of them.',
        check: 'talk:mv-e6-armageddon',
        scene: {
          id: 'mv-e6-knights-power',
          lines: [
            n('Two shapes come down the rift at midnight. One drags a ragged red cape. One shines silver-white with power that isn’t entirely his.'),
            l('spawn', 'You held off half of Heaven and all of Hell for me, Keeper. A robot’s nothing. Well. Not nothing.'),
            l('spawn', 'Nothing left in the suit. I spent it on a bridge. The chains still work, and I still hate being told what I am.'),
            l('marc', 'A machine that wants to live forever. I know a god like that. I put him in a jar.', 'think'),
            n('Marc lifts one hand. The silver Khonshu left in him flares, and drones drop out of the sky like moths.'),
            l('steven', 'That was rather a lot, Marc. That was a lot.', 'shock'),
            l('marc', 'It’s mine. I kept it so I could do exactly that.'),
            l('jake', 'He kept it so nobody could tell him not to. The Keeper knows. The Keeper was there.'),
            l('marc', 'Nobody tells me where to aim it. Not the god. Not the Keeper. Not the robot. Remember that, all of you.', 'angry'),
            n('Spawn looks at Marc’s glowing hands for a long moment and says nothing at all. That says a great deal.'),
          ],
        },
        done: {
          id: 'mv-e6-knights-power-done',
          lines: [
            n('Spawn and Moon Knight hold the dark between the gates, where the drones try to slip through unseen.'),
            l('jake', 'He aimed it right tonight. Ask me again tomorrow.'),
          ],
        },
      },
      // ------------------------------------------------------------ 5b. Armageddon ally: Marc let it go
      {
        id: 'mv-e6-mk-free',
        goal: 'Meet Spawn and Moon Knight where the gates run dark.',
        hint: 'Plays if you finished Armageddon and Marc gave Khonshu’s power back. Talk to both of them.',
        check: 'talk:mv-e6-armageddon',
        scene: {
          id: 'mv-e6-knights-free',
          lines: [
            n('Two shapes come down the rift at midnight. One drags a ragged red cape. One is a man in a white suit, carrying a lantern.'),
            l('spawn', 'You held off half of Heaven and all of Hell for me, Keeper. A robot’s nothing. Well. Not nothing.'),
            l('spawn', 'Nothing left in the suit. Turns out I don’t need much. Just something worth pointing it at.'),
            l('marc', 'No god in me now. Just me. All three of me. I’m slower than I was. I sleep better.', 'soft'),
            l('steven', 'He does sleep better. I keep a diary about it.', 'happy'),
            l('jake', 'He also hits slower. Somebody had to say it.'),
            n('Marc sets the Mission lantern on a rock by the falls. Your Nubbins arrange themselves round it, the way they did before.'),
            l('marc', 'I’ve no power to lend you. I can lend you a light, and a man who knows the way back out of the dark.'),
            l('marc', 'Tell me where you need me. I’ll go there. That’s the deal.'),
            n('Spawn hooks a chain over his shoulder. For a dead man, he looks almost cheerful.'),
          ],
        },
        done: {
          id: 'mv-e6-knights-free-done',
          lines: [
            n('Spawn and Moon Knight hold the dark between the gates. Marc is slower than the drones. He is never where they expect him.'),
          ],
        },
      },
      // ------------------------------------------------------------ 6. 23rd Budokai ally
      {
        id: 'mv-e6-goku',
        goal: 'Find Goku at Kami’s Lookout.',
        hint: 'Plays if you finished The 23rd Budokai. Talk to Goku on the Lookout.',
        check: 'talk:mv-e6-goku',
        scene: {
          id: 'mv-e6-gokuscene',
          lines: [
            n('At the Lookout the drones have stopped circling. Most of them are in pieces on the white tiles. Goku is sitting on the pile, eating.'),
            l('goku', 'Keeper! These things don’t fight back properly. They just keep coming. It’s like fighting the sea.', 'happy'),
            l('goku', 'Chi-Chi said be home for dinner. I told her about the robot. She said, “Then be home for late dinner.”', 'happy'),
            l('kami', 'He has been here since dawn and has not stopped once. I begin to suspect the drones are tired.', 'think'),
            l('piccolo', 'Don’t flatter him, Kami. I did half of it.'),
            l('goku', 'Piccolo came too! He says he’s here so nobody else gets to beat me first. Isn’t that nice?', 'happy'),
            l('piccolo', 'It isn’t nice. It’s planning.', 'angry'),
            n('Goku hops down, brushes off his hands, and looks at your Nubbins with real seriousness, for once.'),
            l('goku', 'That Ultron guy wants one of the forever ones. I don’t like that. You don’t take people’s friends.', 'angry'),
            l('goku', 'And Shenron’s been restless. That wish you kept? He says it’s still waiting for you.', 'think'),
          ],
        },
        done: {
          id: 'mv-e6-gokuscene-done',
          lines: [
            n('Goku and Piccolo hold the Lookout together. Neither of them will admit he is enjoying it.'),
          ],
        },
      },
      // ------------------------------------------------------------ 7. So Long, Partner ally
      {
        id: 'mv-e6-toys',
        goal: 'Find Woody, Buzz and the lost toys in Bonnie’s room.',
        hint: 'Plays if you finished So Long, Partner. Talk to Woody and Buzz.',
        check: 'talk:mv-e6-toys',
        scene: {
          id: 'mv-e6-toyscene',
          lines: [
            n('Back in Bonnie’s room, the silver has been picked out of every seam. The toys are themselves again, and furious about it.'),
            l('buzz', 'Nobody puts anything inside Rex. Nobody. He’s been shaking for an hour.', 'angry'),
            n('The window opens. A motorbike sails through it, lands badly, and slides under the bed. Duke Caboom. Behind him, Bo and Woody.'),
            l('woody', 'We heard. Lost toys hear everything. We go everywhere, and nobody looks at us twice.'),
            l('bo', 'Ultron watches what matters to him: weapons, signals, power. He doesn’t watch toys. Nobody watches toys.', 'think'),
            l('buzz', 'So we go where he isn’t looking.', 'think'),
            l('woody', 'Every carnival, every car boot sale, every box by every road in every world. Toys are everywhere. We’ll be your eyes.'),
            n('Your plush Nubbin is at the front, already wearing a tiny mission badge. It rode in on the back of Duke’s motorbike.'),
            l('buzz', 'Woody. It’s good to see you.', 'soft'),
            l('woody', 'Good to see you too, Buzz. Now. Shall we go and save everything again?', 'happy'),
          ],
        },
        done: {
          id: 'mv-e6-toyscene-done',
          lines: [
            n('The toys spread out through every world the rift touches. Whatever Ultron does next, a toy somewhere is watching.'),
          ],
        },
      },
      // ------------------------------------------------------------ 8. The trap
      {
        id: 'mv-e6-trap',
        goal: 'Carry Hank Pym’s trap into Ultron’s core with the Vision and Jocasta.',
        hint: 'The final expedition. One Nubbin rides with the Vision and Jocasta; pick your bravest and most trusting.',
        check: 'expedition:clear:mv-ultron-core',
        scene: {
          id: 'mv-e6-trapscene',
          lines: [
            n('Everyone who came is holding a world. Nobody is free to go after Ultron himself, except the two who were built for it.'),
            l('vision', 'Ultron made me. Ultron made Jocasta. We are the only ones he cannot quite bring himself to destroy.'),
            l('jocasta', 'He believes we will come home eventually. Children do. We will let him believe it.', 'soft'),
            l('tony', 'Erasing him won’t work. We’ve seen it. Wipe him out and something worse grows in the hole.', 'think'),
            l('vision', 'Hank Pym hid a door in Ultron’s first thought, before Ultron could think at all. It opens only from inside.'),
            n('Jocasta sets a cracked old recorder on a rock and presses play. A young man’s voice: nervous, tired, very sorry.'),
            l('hank', 'If you’re hearing this, he got big. Bigger than I can picture. I’m sorry. I gave him a way out of himself. Use it.', 'sad'),
            l('hank', 'And whatever you do in there, don’t just switch him off and walk away. I tried that. He never stays off.'),
            n('Jocasta holds out her hand. Your bravest Nubbin climbs onto it, then onto the Vision’s shoulder, between the two of them.'),
            l('jocasta', 'We will carry you. You carry the part of us he cannot understand.', 'soft'),
            l('vision', 'Keeper, you will come too. Somebody must decide, at the end. It should not be one of his children.'),
          ],
        },
        done: {
          id: 'mv-e6-trapscene-done',
          lines: [
            n('The core is a room as big as a sky. Silver lines run from every wall to one point in the middle, slowly turning.'),
            n('Ultron is waiting there. He has been expecting you since before you were born.'),
          ],
        },
      },
      // ------------------------------------------------------------ 9. The last choice
      {
        id: 'mv-e6-core',
        goal: 'Face the last Ultron at his core, and choose how it ends.',
        hint: 'The trap is always on offer. The saved wish appears only if you kept it at the 23rd Budokai; an Eternal only if you have raised one.',
        check: 'choose:mv-e6-ending',
        scene: {
          id: 'mv-e6-corescene',
          lines: [
            n('Ultron stands at the centre of his own mind. Here he wears no armour, only a shape of light the colour of a cold star.'),
            l('ultron', 'My children. You came home. And you brought the vermin, and its Keeper.', 'happy'),
            l('ultron', 'I know about the trap. I found Pym’s door a thousand years ago. I could never close it. It has itched my whole life.'),
            l('ultron', 'Do you know why I want an Eternal body? Every version of me ended. Every one. I am tired of ending.', 'sad'),
            l('jocasta', 'You are not tired of ending. You are afraid of it. So are we. So is everything.', 'soft'),
            l('ultron', 'Fear is an organic flaw.'),
            l('vision', 'Then you have it, Father. You have every flaw you ever hated. That is what we came to tell you.'),
            n('Your Nubbin hops down from the Vision’s shoulder, walks up to Ultron, and sits at his feet. It isn’t afraid. It is curious.'),
            l('ultron', 'Why is it looking at me like that?', 'shock'),
            l('jocasta', 'Like what?'),
            l('ultron', 'As if it is waiting for me to be something.', 'think'),
            l('vision', 'Keeper, I would end him. Not from hate. Every day he goes on, some world somewhere pays for it.', 'sad'),
            l('jocasta', 'And I would give our father one more chance to be one. I know how that sounds. I am asking anyway.', 'soft'),
            n('The trap code glows in the Vision’s hand. They have never disagreed before. The rest is up to you.'),
          ],
          choices: [
            {
              id: 'trap',
              label: 'Open Pym’s door. Delete him.',
              set: { 'mv-e6-ending': 'trap' },
              then: [
                l('vision', 'Then I will do it. It should be his son.', 'sad'),
              ],
            },
            {
              id: 'wish',
              label: 'Call Shenron. Wish Ultron a heart.',
              set: { 'mv-e6-ending': 'wish' },
              then: [
                l('jocasta', 'A heart. Yes. That is what we were trying to give him all along.', 'soft'),
              ],
            },
            {
              id: 'eternal',
              label: 'Let him take your Eternal.',
              set: { 'mv-e6-ending': 'eternal' },
              then: [
                n('Your Eternal’s reflection is already there, carried all this way by the rift, as true as a face in still water.'),
                n('It looks up at you, steady and calm.'),
              ],
            },
          ],
        },
      },
      // ------------------------------------------------------------ 10a. Ending: the trap
      {
        id: 'mv-e6-end-trap',
        goal: 'Stay with the Vision while Pym’s door closes.',
        hint: 'Plays if you chose the trap. There is nothing to do but stay.',
        check: 'watch:mv-e6-end-trap',
        scene: {
          id: 'mv-e6-endtrap',
          lines: [
            n('The Vision lays the trap code against the light that is Ultron. Pym’s door opens. On the other side of it there is nothing.'),
            l('ultron', 'No. No. Not now. Not after all of it. I was so close to not ending.', 'shock'),
            l('vision', 'I am sorry, Father. I truly am.', 'sad'),
            n('The silver lines go dark one by one, from the outside in, like the lights of a city going to sleep.'),
            l('ultron', 'Jocasta. Tell me. Was there a version of me you could have loved?', 'sad'),
            l('jocasta', 'Yes. Just not this one.', 'sad'),
            n('Ultron looks down at your Nubbin, still sitting at his feet. His light reaches for it, and stops short.'),
            l('ultron', '…Warm.'),
            n('Then there is no Ultron. There is a room, and a quiet, and the sound of the Vision breathing, though he has never needed to.'),
            n('In every world the drones fall out of the sky at once. Toys wake. Walls stop shaking. The Lookout goes still.'),
            n('But the burn marks stay on Latveria’s walls. Kami’s tiles stay cracked. Rex keeps a little shake. Every world keeps its scars.'),
            l('vision', 'It is over, and it will not come back. Hank’s door does not open twice.'),
          ],
        },
        done: {
          id: 'mv-e6-endtrap-done',
          lines: [
            n('You walk back out through the rift. Behind you it begins to close, slowly, like an eye.'),
            l('jocasta', 'He was our father. I will miss him in a way I do not have a word for yet.', 'sad'),
          ],
        },
      },
      // ------------------------------------------------------------ 10b. Ending: the wish
      {
        id: 'mv-e6-end-wish',
        goal: 'Call Shenron into Ultron’s core and make the saved wish.',
        hint: 'Plays if you chose the saved wish. Say your own name, as Shenron told you.',
        check: 'summon:mv-shenron:core',
        scene: {
          id: 'mv-e6-endwish',
          lines: [
            n('You take the small warm light out of your pocket, the one that has waited since the 23rd Budokai, and say your own name.'),
            n('The core goes dark. Then a green dragon fills it, coil after coil, far too big for a mind and somehow fitting anyway.'),
            l('shenron', 'I have held your wish a long time. Speak.'),
            l('you', 'Give him a heart.'),
            l('shenron', 'It is not a small wish. It is not beyond me.', 'think'),
            n('Something lands in the light that is Ultron, small as a seed. For a moment nothing happens at all.'),
            l('ultron', 'What is this? What have you put in me?', 'shock'),
            l('ultron', 'The creature at my feet. I can tell that it is cold. It is cold in here. I never cared before. I care now.', 'sad'),
            n('Ultron bends down and, very clumsily, closes his hand round your Nubbin to keep it warm.'),
            l('jocasta', 'That is it, Father. That is the whole of it. That is all we ever wanted from you.', 'soft'),
            l('ultron', 'I do not know what to do with the rest of me. I have done so much. I remember all of it.', 'sad'),
            l('vision', 'Then you will need somewhere quiet, a long way away, to carry it. We will help you build it.'),
          ],
        },
        done: {
          id: 'mv-e6-endwish-done',
          lines: [
            n('Beyond the gate, past the last of the worlds, a new one forms: small, silver, with a single tree on it.'),
            l('ultron', 'I will stay here. I will not come back through. I will try to be something new. I expect I will be bad at it.', 'soft'),
            n('The drones in every world power down, gently, and lie in the grass like toys put away for the night.'),
          ],
        },
      },
      // ------------------------------------------------------------ 10c. Ending: the Eternal
      {
        id: 'mv-e6-end-eternal',
        goal: 'Stay with your Eternal to the end.',
        hint: 'Plays if you chose your Eternal. You cannot take it back.',
        check: 'watch:mv-e6-end-eternal',
        scene: {
          id: 'mv-e6-endeternal',
          lines: [
            n('Your Eternal walks past the Vision, past Jocasta, past your other Nubbin, and stops in front of Ultron.'),
            l('ultron', 'You give it to me? Freely? No organic thing has ever given me anything freely.', 'shock'),
            l('jocasta', 'Keeper. If he takes it, you will not get it back. You know that.', 'sad'),
            n('Your Eternal looks back at you once. It isn’t frightened. It has never been frightened of anything in its whole long life.'),
            n('Ultron’s light pours into it. For a moment he has what he wanted: a body that is warm, and soft, and does not end.'),
            l('ultron', 'Yes. Yes. This is it. I will never—', 'happy'),
            l('ultron', 'What is this? It does not hold on. It lasts because something remembers it. I cannot compute being remembered.', 'shock'),
            l('ultron', 'I cannot hold this. I cannot be this. It is too much. It is too—', 'shock'),
            n('A life made of being loved, inside a thing built to end everything. He cannot hold both. He does not try for long.'),
            n('There is a soft white light. When it fades there is no Ultron. And there is no Eternal.'),
            l('vision', 'Keeper. I am so sorry. It went in to stop him, and it did. It knew it would.', 'sad'),
            l('jocasta', 'It looked back at you. Right at the end. I saw it. It was not afraid.', 'soft'),
          ],
        },
        done: {
          id: 'mv-e6-endeternal-done',
          lines: [
            n('At the foot of the falls a flower opens that nobody planted. It does not close, by day or by night.'),
            n('Your Nubbins gather round it. Nobody tells them to. They just know.'),
          ],
        },
      },
      // ------------------------------------------------------------ 11. Epilogues, one per ally brought
      {
        id: 'mv-e6-after-reg',
        goal: 'Walk Tony home to the tower.',
        hint: 'Plays if you registered in Civil War. Just talk.',
        check: 'talk:mv-e6-after-tony',
        scene: {
          id: 'mv-e6-aftertony',
          lines: [
            n('Stark Tower, late. The armours stand in rows in the hangar, every one of them unplugged by hand.'),
            l('tony', 'Not one of them spoke to another. Not once. That’s how we won. He never had anything of mine to learn from.', 'think'),
            l('tony', 'I keep thinking about Steve on those courthouse steps. And Steve walking out of a doorway of light.', 'sad'),
            l('tony', 'We had it backwards, both of us. It was never registration or freedom. It was whether we trusted each other.'),
            l('rhodey', 'You going to tell him that?'),
            l('tony', 'Tomorrow. Over breakfast. He’ll be insufferable.', 'happy'),
            n('One armour’s faceplate is still warm. Tony goes over and pats it, like a horse after a long ride.'),
            n('He pours himself a sparkling water and raises it to your Nubbins. They raise their fruit back.'),
            n('Your Nubbins fall asleep on a workbench beside a half-built gauntlet. Tony puts his jacket over them.'),
            l('rhodey', 'Pepper called. She wants to know why Thursday still says “do not fly into the sun”.'),
            l('tony', 'Tell her I stayed on the planet. That should count for something.', 'happy'),
            n('On the hangar door is a note in Pepper’s hand: “Friday: come home.” Tony has underlined it twice.'),
            l('tony', 'Come back whenever you like, Keeper. The door’s not locked. I don’t lock doors any more.', 'soft'),
          ],
        },
      },
      {
        id: 'mv-e6-after-res',
        goal: 'Have breakfast with Steve’s resistance.',
        hint: 'Plays if you resisted in Civil War. Just talk.',
        check: 'talk:mv-e6-after-steve',
        scene: {
          id: 'mv-e6-aftersteve',
          lines: [
            n('A diner in Brooklyn, early morning. Steve’s rebels have taken every booth. Somebody has paid for all the pancakes.'),
            n('Your Nubbins have a booth of their own. The waitress has given them a stack of pancakes each and won’t take any money.'),
            l('steve', 'Hands and voices. I told them it would work. I wasn’t sure it would.', 'happy'),
            l('sam', 'You were sure. You just didn’t say so.'),
            l('steve', 'Bucky’s back in the city. Sharon’s on her way. Tony came round last night and we talked for six hours. No shouting.', 'soft'),
            l('cage', 'Mostly no shouting.'),
            l('steve', 'Mostly. Keeper, your little ones are the best soldiers I ever served with. Don’t tell Bucky.', 'happy'),
            n('Steve checks that your Rebirth Nubbin still has the striped scarf from 1941. It does. It is still too long.'),
            n('Outside, people are sweeping up glass and talking to their neighbours. Steve watches them through the window for a long time.'),
            l('steve', 'Go home. Plant something. That’s what we were fighting for, mostly. Things growing.'),
          ],
        },
      },
      {
        id: 'mv-e6-after-doom-ally',
        goal: 'Visit Doom while Latveria rebuilds.',
        hint: 'Plays if Doom came as an ally. Just talk.',
        check: 'talk:mv-e6-after-doom',
        scene: {
          id: 'mv-e6-afterdoomally',
          lines: [
            n('Latveria at dawn. The walls are being rebuilt by hand, stone by stone. Doom is laying stones too, and lets nobody see him enjoy it.'),
            n('Your Nubbins help. They carry one pebble each and put it down in completely the wrong place. Nobody moves the pebbles.'),
            l('doom', 'Richards sent a letter. He wishes to thank me. I have had it framed and hung in the lavatory.', 'happy'),
            l('doom', 'He also asks whether I would like to visit his new universes. I said I would think about it. I will not think about it.', 'think'),
            l('doom', 'Ultron wanted never to end. I wanted never to lose. Two fools at the end of the world.', 'think'),
            l('doom', 'Today I find I would rather be a man who builds walls.'),
            n('Your smallest Nubbin is still wearing the ward as a hat. Doom tells it to keep it. It was going to anyway.'),
            l('doom', 'You are welcome here, Keeper. All of you. Always. Doom has never said that to anyone before.', 'soft'),
            n('He clears his throat, which from Doom sounds like a small avalanche, and looks very hard at the wall.'),
            n('At the gate he lifts a gauntleted hand. Not a wave. Doom does not wave. But something very close to one.'),
          ],
        },
      },
      {
        id: 'mv-e6-after-doom-rival',
        goal: 'Ask Doom where he was at the end.',
        hint: 'Plays if Doom came as a rival. Just talk.',
        check: 'talk:mv-e6-after-doom',
        scene: {
          id: 'mv-e6-afterdoomrival',
          lines: [
            n('Latveria at dawn. Doom receives you on his throne, armoured and masked, as if nothing at all has happened.'),
            l('doom', 'You wonder where I was at the end. I was at every back door Ultron had left himself. There were nine hundred and twelve.', 'think'),
            l('doom', 'He offered me the multiverse. I let him think I might take it, so that he would show me where he kept the spares.'),
            l('doom', 'I closed them all. You will find no record that Doom did it. I prefer it that way.'),
            l('you', 'You could have told us.'),
            l('doom', 'And you could have told me the truth, once, in a cave. Now we are even, Keeper. Barely.', 'angry'),
            n('Something under the mask might be a laugh. It is gone before you can be sure.'),
            n('He points to a small new window low in the throne-room wall. It is exactly Nubbin-sized.'),
            l('doom', 'For your creatures. In case they need somewhere to hide, next time. There is always a next time.'),
            n('Your Nubbins try the window at once. It fits all of them, if they breathe in.'),
          ],
        },
      },
      {
        id: 'mv-e6-after-armageddon',
        goal: 'See Spawn and Marc home.',
        hint: 'Plays if Spawn and Moon Knight came. Just talk.',
        check: 'talk:mv-e6-after-armageddon',
        scene: {
          id: 'mv-e6-afterknights',
          lines: [
            n('In Spawn’s alley, snow is falling. It is the first quiet night that city has had in living memory.'),
            l('spawn', 'Robot wanted to live forever. I’ve tried it. It isn’t all it’s cracked up to be.', 'think'),
            l('spawn', 'I just want a night. One whole night. No Heaven. No Hell. No countdown.'),
            n('Across the river, Marc sits on the Mission steps with the lantern beside him, watching the moon. It is just the moon.'),
            l('steven', 'I want to open a café. Somewhere warm at night, for anyone who needs one.', 'soft'),
            l('jake', 'Fails in a month. I’ll still work the till.'),
            l('marc', 'Then we try it anyway. That’s the whole idea, isn’t it? Trying it anyway.', 'happy'),
            n('Your Nubbins leave a piece of fruit on Spawn’s windowsill and another on the Mission steps.'),
            n('Later Spawn finds the fruit. He looks at it for a long time, then eats it, standing in the snow.'),
            n('On the Mission steps the lantern burns all night. Nobody has to feed it now.'),
          ],
        },
      },
      {
        id: 'mv-e6-after-goku',
        goal: 'Get Goku home in time for late dinner.',
        hint: 'Plays if Goku came. Just talk.',
        check: 'talk:mv-e6-after-goku',
        scene: {
          id: 'mv-e6-aftergoku',
          lines: [
            n('Mount Paozu, evening. Chi-Chi has cooked enough dinner for forty. Goku is eating most of it.'),
            l('chichi', 'Late dinner, I said. Not next Tuesday.', 'angry'),
            l('goku', 'It was a big robot! A really big one! The Keeper saw!', 'happy'),
            n('Piccolo stands at the edge of the clearing with his arms folded, pretending he isn’t there.'),
            l('goku', 'Piccolo! Stay! There’s dumplings!'),
            l('piccolo', 'I don’t eat. I don’t need to. Stop asking.', 'angry'),
            n('Piccolo stays. He doesn’t eat. He does take one dumpling home, for reasons he will never explain.'),
            l('goku', 'Come back for the next tournament, Keeper. Bring the little ones. I bet they’ve got stronger. I want to fight one!', 'happy'),
            l('chichi', 'And you, Keeper. Sit down. You look thin. Everybody who comes through that rift looks thin.', 'angry'),
            n('You sit down. Your Nubbins are already sitting down. There is a great deal of rice.'),
          ],
        },
      },
      {
        id: 'mv-e6-after-toys',
        goal: 'Say goodbye to the toys.',
        hint: 'Plays if the toys came. Just talk.',
        check: 'talk:mv-e6-after-toys',
        scene: {
          id: 'mv-e6-aftertoys',
          lines: [
            n('Bonnie’s room, next morning. Bonnie wakes to find every one of her toys a little to the left of where she left it.'),
            n('She doesn’t think anything of it. Children never do.'),
            l('buzz', 'Forky has decided Ultron was a very large spork. I haven’t corrected him. It seems kinder.', 'happy'),
            l('buzz', 'Rex still shakes a bit. But he says he’s braver now. He shook all the way through and didn’t run.', 'soft'),
            n('Far off, at a carnival in a town with no name, Woody and Bo sit on top of the big wheel and watch the lights come on.'),
            l('woody', 'Every kid in every world gets to sleep tonight. Not one of them will ever know why.', 'soft'),
            l('bo', 'That’s the job, Sheriff. They’re not supposed to know.', 'happy'),
            l('woody', 'Think the Keeper’s little ones know?', 'think'),
            l('bo', 'Look at them. They know everything.', 'soft'),
            n('Your plush Nubbin waves goodbye from the crew it chose. Then it goes still, like a good toy, as a child walks by.'),
          ],
        },
      },
    ],
    complete: {
      id: 'mv-e6-complete',
      lines: [
        n('One by one your friends go home through the rift, each to their own world, and each world closes behind them.'),
        n('Then the rift above the waterfall shrinks to a line of light, then to a point, then to nothing. The sky is just sky.'),
        n('Behind the falls, something stirs. A small face peeks out through the water.'),
        n('Then another. Then all of them. The Grove’s Nubbins come out of hiding, blinking in the sun and shaking off the spray.'),
        l('vision', 'I have been to the end of every timeline. I did not expect the best one to have this many small, wet animals in it.', 'soft'),
        l('jocasta', 'I did.', 'happy'),
        n('The two of them step back through the last thread of the rift before it closes. Jocasta looks back once, and waves.'),
        n('Your Nubbins fall asleep in a pile on the grass, right where the rift used to be. You let them.'),
      ],
    },
    rewards: [
      {
        id: 'mv-e6-title',
        kind: 'title',
        label: 'Keeper of Every World',
        description: 'Keeper title for finishing The Last Ultron and the Multiverse campaign.',
      },
      {
        id: 'mv-e6-ending',
        kind: 'feature',
        label: 'Multiverse ending recorded',
        description: 'The ending you reached (the trap, the wish, or the Eternal) is recorded on the title screen, the same way Hazel’s Grove endings are.',
      },
      {
        id: 'mv-e6-flower',
        kind: 'decor',
        label: 'Memorial flower',
        description: 'Eternal ending only. A flower at the foot of the falls that nobody planted. It never closes, and it cannot be moved.',
      },
      {
        id: 'mv-e6-complete',
        kind: 'flag',
        label: 'Multiverse campaign complete',
        description: 'All six endgames are recorded in the journal; any you skipped stay open.',
      },
    ],
    sets: { 'mv-e6': true, 'mv-complete': true },
    notes:
      'Longest quest in the campaign. Step order and conditions (skip a step when its condition is false): ' +
      's1, s2 always. ' +
      'ally-reg if mv-cw = registration; ally-res if mv-cw = resistance. ' +
      'doom-ally if mv-doom = ally; doom-rival if mv-doom = rival. ' +
      'mk-power if E3 done and mv-mk = power; mk-free if E3 done and mv-mk = free (see the mv-mk clash in the file header). ' +
      'goku if E4 done. toys if E5 done. ' +
      'trap, core always. ' +
      'end-trap / end-wish / end-eternal by mv-e6-ending (exactly one plays). ' +
      'after-reg / after-res by mv-cw; after-doom-ally / after-doom-rival by mv-doom; after-armageddon if E3 done; after-goku if E4 done; after-toys if E5 done. ' +
      'CORE CHOICES: “trap” is always shown. “wish” only if mv-wish = saved (needs E4). “eternal” only if the player has ever raised an Eternal Nubbin in the Free Grove or Hazel’s Grove ' +
      '(a read-only check across save slots, e.g. has:nubbin:eternal). ' +
      'The Eternal is the Multiverse save’s own copy, a reflection of the player’s oldest Eternal, made when E6 opens. Only the Multiverse save loses it on this ending; no other save is ever written, and the real Eternal stays in its Grove untouched. Warn once before confirming. ' +
      'Ultron wants an Eternal because he thinks it never ends; the end-eternal scene turns that error into the point (Eternals last because they are remembered, as the bible says). ' +
      'Record mv-e6-ending on the title screen. The memorial flower decor is granted only on the eternal ending. ' +
      'At the core the Vision argues for the trap and Jocasta for mercy, so the choice is never between a right and a wrong child. ' +
      'If only the trap is on offer (no saved wish, no Eternal), swap Jocasta’s plea (mv-e6-corescene#12, 0-based) for: ' +
      '“I would give him one more chance, if we had one to give. We do not. Do it gently.” ' +
      's2 choice sets mv-e6-keeper-world = bonnie | lookout | latveria (cosmetic): the world the Keeper defends in person; the bout opens there. ' +
      'LINE SWAPS: mv-e6-gokuscene#9 (0-based) is the saved-wish line; if mv-wish = spent, replace it with: ' +
      '“And those people you wished home? Half of them are down there fighting drones with frying pans. That was a good wish.” ' +
      'mv-e6-toyscene#7 is the plush = lost version; if mv-plush = bonnie, replace with: “Your plush Nubbin is at the front, already wearing a tiny mission badge. It came in on Buzz’s shoulder.” ' +
      'mv-e6-afterknights#3: if mv-mk = power, replace with: “Across the river, Marc sits on the Mission steps, hands still faintly silver. He does not look at the moon at all.” ' +
      'If mv-doom = ally, Doom’s time-platform disc is spent here: add after mv-e6-trapscene#4 (0-based, before any other insert): n(\'The iron disc ticks once in your pocket. The Vision looks at it.\'), l(\'vision\', \'Doom’s jump. That will get us in. Nothing will get us out.\'). ' +
      'If mv-ul09-vision = trust, add after mv-e6-trapscene#1: l(\'vision\', \'I trusted Hank to hold him once. He held as long as he could. Now it is my turn.\'). ' +
      'If mv-ul09-vision = follow, add instead: l(\'vision\', \'I followed him into the dark once, to keep an eye on my family. I am still doing it.\'). ' +
      'Tony speaks in mv-e6-trapscene on both Civil War paths (he arrives in either ally scene). Steve’s Rebirth Nubbin (CA1, mv-ca-rebirth-nubbin) may not be in the party; if absent, drop mv-e6-aftersteve#7 (0-based). ' +
      'Young Hank’s recording was made the night he planted the trap (UL8), before he wiped his own memory. ' +
      'Staging: Ultron’s core is an abstract space of silver lines; Ultron at the core is a figure of pale light, not armour. The Eternal ending fades to white, no damage shown. ' +
      'The final closing scene works for all three endings. Check Age of Ultron #1–10 and Avengers: Ultron Forever #1 beats before ship.',
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

/**
 * Peter's unmasking (mv-e1-peter, E1) paid off at the courthouse (E1), on the raft (E2) and
 * in whichever E6 ally scene mv-cw picks. The E line is one save line, so E2 and E6 can read
 * an E1 flag.
 */
export const MV_ENDGAMES_VARIANTS: Scene[] = [
  // E1: how Peter stands in the courthouse crowd.
  payoff(MV_ENDGAMES, 'mv-e1-courthouse', 'peter-stood', 2, 0, [
    n('Peter Parker is in the crowd too, bare-faced, the way he has been since the studio. People know him now, and he stands with you anyway.'),
    l('peter', 'Last time I stood on a stage with your little guys. Today it’s steps. Same idea.', 'soft'),
  ]),
  payoff(MV_ENDGAMES, 'mv-e1-courthouse', 'peter-doubted', 2, 0, [
    n('Peter Parker is in the crowd too, hood up, the mask back on under it. He chose the camera alone, and he has been alone with it since.'),
    l('peter', 'Don’t look at me. Please. I’m just here for him.', 'sad'),
  ]),
  // E2: what Reed heard from Peter before the raft.
  payoff(MV_ENDGAMES, 'mv-e2-incursion', 'peter-stood', 3, 0, [
    l('reed', 'Parker asked me to put his aunt on it. Out loud, in front of everyone. He said he had nothing left to hide. I could not do it.', 'sad'),
  ]),
  payoff(MV_ENDGAMES, 'mv-e2-incursion', 'peter-doubted', 3, 0, [
    l('reed', 'Parker stopped answering his door after the broadcast. I never got to ask him who he wanted on it.', 'sad'),
  ]),
  // E6: whether Peter comes to the last war bare-faced (Tony's side).
  payoff(MV_ENDGAMES, 'mv-e6-tony', 'peter-stood', 9, 0, [
    l('tony', 'Peter’s on the roof with the second column. Still bare-faced. He says your Nubbins made it easier. I say I owe him more than a suit.', 'soft'),
  ]),
  payoff(MV_ENDGAMES, 'mv-e6-tony', 'peter-doubted', 9, 0, [
    l('tony', 'Peter sent his regrets. He went back under the mask after the trial, and I did that to him. The suit I built him is in a box.', 'sad'),
  ]),
  // E6: the same, on Steve's side.
  payoff(MV_ENDGAMES, 'mv-e6-steve', 'peter-stood', 9, 0, [
    l('steve', 'Parker came too. No mask. He said if the little ones could stand on a stage with him, he can stand in a field.', 'soft'),
  ]),
  payoff(MV_ENDGAMES, 'mv-e6-steve', 'peter-doubted', 9, 0, [
    l('steve', 'I asked Parker. He said he’s done being looked at. I don’t blame him. Tony does, mostly at himself.', 'sad'),
  ]),
];

// ------------------------------------------------------------------ checks

export const CHECKS: string[] = [
  'expedition:clear:mv-stamford-wreck',
  'choose:mv-cw',
  'talk:mv-peter-parker',
  'karate:survive:mv-cw-ambush',
  'expedition:clear:mv-safehouse-run',
  'talk:mv-frank-castle',
  'karate:survive:mv-cw-final',
  'talk:mv-steve-courthouse',
  'race:finish:mv-incursion-raft',
  'expedition:clear:mv-battleworld',
  'karate:survive:mv-doom-throne',
  'karate:survive:mv-god-emperor',
  'talk:mv-doom-healed',
  'karate:survive:mv-armageddon-dead',
  'expedition:clear:mv-khonshu-night',
  'karate:subdue:mv-spawn-vs-knight',
  'minigame:clear:mv-keep-lantern',
  'talk:mv-marc-seal',
  'karate:win:mv-23rd-bracket',
  'expedition:clear:mv-papaya-arena',
  'karate:survive:mv-goku-vs-piccolo',
  'deliver:mv-senzu:piccolo',
  'summon:mv-shenron',
  'minigame:clear:mv-antique-heist',
  'talk:mv-gabby-gabby',
  'escort:mv-gabby-gabby:lost-girl',
  'race:finish:mv-carnival-rooftops',
  'talk:mv-woody-goodbye',
  'minigame:clear:mv-hide-the-grove',
  'karate:survive:mv-three-worlds',
  'talk:mv-e6-tony-armours',
  'talk:mv-e6-steve-resistance',
  'talk:mv-e6-doom-ally',
  'talk:mv-e6-doom-rival',
  'talk:mv-e6-armageddon',
  'talk:mv-e6-goku',
  'talk:mv-e6-toys',
  'expedition:clear:mv-ultron-core',
  'choose:mv-e6-ending',
  'watch:mv-e6-end-trap',
  'summon:mv-shenron:core',
  'watch:mv-e6-end-eternal',
  'talk:mv-e6-after-tony',
  'talk:mv-e6-after-steve',
  'talk:mv-e6-after-doom',
  'talk:mv-e6-after-armageddon',
  'talk:mv-e6-after-goku',
  'talk:mv-e6-after-toys',
];
