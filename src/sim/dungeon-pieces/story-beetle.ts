import { piece, type Piece } from './piece';

/**
 * The Beetle Road's authored story pieces (R0197, DUNG-54): the guard's stairs, the two
 * doors, the slope above the weather and the machine's room. They are not part of any
 * tileset's pool; a story floor names them (`dungeon-story-floors.ts`) and the generator
 * puts each one in its slot, so the rest of the floor stays generic Rootways.
 */
const T = 'story';

export const STORY_BEETLE: Piece[] = [
  // Chapter 3: the guardhouse round the stairs up, benches along the walls.
  piece(
    'story-guard-stairs',
    T,
    ['entry'],
    1,
    `
    ####DD####
    #........#
    #.##..##.#
    #........#
    D...^^...D
    D...^^...D
    #........#
    #.##..##.#
    #........#
    ####DD####`,
  ),
  // Chapters 4 and 8: a deep doorway, pillars either side, the stairs down behind.
  piece(
    'story-door',
    T,
    ['exit', 'deadEnd'],
    1,
    `
    ###DD###
    #......#
    #.#..#.#
    #.#..#.#
    #......#
    ##.##.##
    #......#
    #......#
    ########`,
  ),
  piece(
    'story-last-door',
    T,
    ['exit', 'deadEnd'],
    1,
    `
    ####DD####
    #........#
    #.#....#.#
    #.#.~~.#.#
    #.#....#.#
    #........#
    ###....###
    #........#
    ##########`,
  ),
  // Chapter 6: the slope above the weather, shelves climbing to one side.
  piece(
    'story-slope',
    T,
    ['hub'],
    1,
    `
    ####DD####
    #........#
    #.^^^....#
    #.^^^^...#
    D..^^^^..D
    D...^^^..D
    #....^^..#
    #........#
    #........#
    ####DD####`,
  ),
  // Chapter 7: the machine's floor, its great block in the middle with a sluice round it.
  piece(
    'story-machine',
    T,
    ['hub'],
    1,
    `
    ####DD####
    #........#
    #.~~~~~~.#
    #.~####~.#
    D..#..#..D
    D..#..#..D
    #.~##.#~.#
    #.~~..~~.#
    #........#
    ####DD####`,
  ),
];
