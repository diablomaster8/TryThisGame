/**
 * Command handlers: decorating the Grove (TECH-35, moved out of world.ts).
 */
import { buyToy, placeToy } from '../craft';
import { buyDecor, placeDecor, removeDecor } from '../decorate';
import { paintTile } from '../tiles';
import type { Handlers } from './types';

export const handlers: Handlers = {
  buyDecor(world, cmd, events) {
    buyDecor(world, cmd.decor, events);
    return;
  },
  placeDecor(world, cmd, events) {
    placeDecor(world, cmd.decor, cmd.pos, events, cmd.yaw ?? 0);
    return;
  },
  removeDecor(world, cmd) {
    removeDecor(world, cmd.id);
    return;
  },
  buyToy(world, cmd, events) {
    buyToy(world, cmd.toy, events);
    return;
  },
  placeToy(world, cmd, events) {
    placeToy(world, cmd.toy, cmd.pos, events);
    return;
  },
  paintTile(world, cmd, events) {
    paintTile(world, cmd.pos, cmd.tile, events);
    return;
  },
};
