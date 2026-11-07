/**
 * Command handlers: decorating the Grove (TECH-35, moved out of world.ts).
 */
import { buyToy, placeToy } from '../craft';
import { buyDecor, placeDecor, removeDecor } from '../decorate';
import { paintTile } from '../tiles';
import { placeOnPlot, removeFromPlot } from '../region-plots';
import type { Handlers } from './types';

export const handlers = {
  buyDecor(world, cmd, events) {
    buyDecor(world, cmd.decor, events);
    return;
  },
  placeDecor(world, cmd, events) {
    // R0136: in a drawn region the piece goes on its build plot.
    if (world.location.startsWith('region:'))
      placeOnPlot(world, cmd.decor, cmd.pos, events, cmd.yaw ?? 0);
    else placeDecor(world, cmd.decor, cmd.pos, events, cmd.yaw ?? 0);
    return;
  },
  removeDecor(world, cmd) {
    if (!removeFromPlot(world, cmd.id)) removeDecor(world, cmd.id);
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
} satisfies Handlers;
