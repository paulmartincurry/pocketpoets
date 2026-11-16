// tslint:disable
/* eslint-disable */
export { default } from '../App';
export * from '../App';

import {
  drawSummitCelestialSkyAndClouds,
  drawSummitCloudOcean,
  drawSummitHellenicArchitecture,
  drawCastalianSpring,
  drawBoathouseExterior,
  drawBoathouseCrates,
  drawLighthouseBeacon,
  drawCanto1Decorations,
  drawBoathouseInterior,
  drawBoathouseWaterSlip,
  drawBoathouseFish,
  drawBoathouseProps,
  drawGivingTreeStump,
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
  ROOM_BOATHOUSE,
  buildBoathouseScreen,
  BOATHOUSE_COLS,
  BOATHOUSE_ROWS,
  CANTO1_PROPS,
  CANTO_I,
  ROOM_HARBOR,
  MaryOliverRoutineState,
  PondCrumbParticle,
  MaryOliverPhase,
  WalcottRoutineState,
  WalcottPhase,
  TILE_SIZE,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
} from './overworldData';

export {
  drawSummitCelestialSkyAndClouds,
  drawSummitCloudOcean,
  drawSummitHellenicArchitecture,
  drawCastalianSpring,
  drawBoathouseExterior,
  drawBoathouseCrates,
  drawLighthouseBeacon,
  drawCanto1Decorations,
  drawBoathouseInterior,
  drawBoathouseWaterSlip,
  drawBoathouseFish,
  drawBoathouseProps,
  drawGivingTreeStump,
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
  ROOM_BOATHOUSE,
  buildBoathouseScreen,
  BOATHOUSE_COLS,
  BOATHOUSE_ROWS,
  CANTO1_PROPS,
  CANTO_I,
  ROOM_HARBOR,
};

export type { MaryOliverRoutineState, PondCrumbParticle, MaryOliverPhase, WalcottRoutineState, WalcottPhase };

export const CANTO_VI_TITLE = 'THE SUMMIT';

export function renderCantoVIOverworld(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  screenData: any,
  animTime: number,
) {
  drawSummitCelestialSkyAndClouds(ctx, camX, camY, animTime);
  drawSummitCloudOcean(ctx, camX, camY, animTime);
  drawSummitHellenicArchitecture(ctx, camX, camY, screenData, animTime);
}
