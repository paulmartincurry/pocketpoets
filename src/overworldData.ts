// tslint:disable
/* eslint-disable */
export * from '../overworldData';

import {
  drawCafeDeFloreInterior,
  drawShakespeareCoInterior,
  ROOM_CAFE_DE_FLORE,
  ROOM_SHAKESPEARE_CO,
  buildCafeDeFloreScreen,
  buildShakespeareCoScreen,
  CAFE_DE_FLORE_COLS,
  CAFE_DE_FLORE_ROWS,
  SHAKESPEARE_CO_COLS,
  SHAKESPEARE_CO_ROWS,
  TILE_SIZE,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  HARBOR_TILES,
  drawWordsworthDaffodils,
  drawCanto1AmbientNature,
  drawCanto1Butterflies,
  WORDSWORTH_DAFFODILS,
  MaryOliverPhase,
  PondCrumbParticle,
  MaryOliverRoutineState,
  WalcottPhase,
  WalcottRoutineState,
  drawParisianBouquinisteStall,
  drawTownGatewayAndArch,
  drawTownEntranceCurbsAndPlanters,
  drawTownLushTree,
  drawTownShopfrontBackdrop,
  drawGrandTownFountain,
  drawTownPlazaFountain,
  drawTownFountain,
  drawDarwish,
  drawSeatedNpc,
  buildTownScreen2,
} from '../overworldData';

// Town north buildings separation & clean wooden bridge thoroughfare specs:
// - Bridge: Columns 17..18 (X = 272..304 px)
// - Left Building (Café de Flore): Columns 10..15 (ends at x = 256 <= bridgeX - 1)
// - Right Building (Shakespeare and Company): Columns 20..26 (starts at x = 320 >= bridgeX + bridgeW + 1)
// - Open Walkable Avenue Corridor: Columns 16..19 (X = 256..320 px, 64px width)
// - Front Facade Entrance Doors: Left Door at Col 13 (208px), Right Door at Col 23 (368px)
export const TOWN_BRIDGE_COL_START = 17;
export const TOWN_BRIDGE_COL_END = 18;
export const TOWN_LEFT_BUILDING_COLS = [10, 15] as const;
export const TOWN_RIGHT_BUILDING_COLS = [20, 26] as const;
export const TOWN_OPEN_AVENUE_COLS = [16, 19] as const;
export const TOWN_LEFT_BUILDING_DOOR_COL = 13;
export const TOWN_RIGHT_BUILDING_DOOR_COL = 23;

export {
  drawCafeDeFloreInterior,
  drawShakespeareCoInterior,
  ROOM_CAFE_DE_FLORE,
  ROOM_SHAKESPEARE_CO,
  buildCafeDeFloreScreen,
  buildShakespeareCoScreen,
  CAFE_DE_FLORE_COLS,
  CAFE_DE_FLORE_ROWS,
  SHAKESPEARE_CO_COLS,
  SHAKESPEARE_CO_ROWS,
  TILE_SIZE,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  HARBOR_TILES,
  drawWordsworthDaffodils,
  drawCanto1AmbientNature,
  drawCanto1Butterflies,
  WORDSWORTH_DAFFODILS,
  drawDarwish,
  drawSeatedNpc,
  drawParisianBouquinisteStall,
  drawTownGatewayAndArch,
  drawTownEntranceCurbsAndPlanters,
  drawTownLushTree,
  drawTownShopfrontBackdrop,
  drawGrandTownFountain,
  drawTownPlazaFountain,
  drawTownFountain,
  buildTownScreen2,
};

export type { MaryOliverPhase, PondCrumbParticle, MaryOliverRoutineState, WalcottPhase, WalcottRoutineState };
