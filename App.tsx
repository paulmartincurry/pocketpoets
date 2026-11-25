// Pocket Poets: 2D Literary Verse-Battler & RPG Exploration
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Trophy,
  ArrowLeft,
  Swords,
} from 'lucide-react';
import {BATTLE_CONFIG, getConfig, THEME} from './constants';
import BackgroundMusic from './utils/BackgroundMusic';
import {soundtrackEngine, TrackId} from './src/audio';
import {
  createFixedStepper,
  drawAsset,
  gameAudio,
  GameState,
  MenuOverlay,
  Overlay,
  prepareCanvas,
  useAssets,
  useAutoFocus,
  useInput,
  useIsMobile,
} from './utils/helper';
import {
  usePlayground,
  usePlaygroundGameLifecycle,
} from './utils/usePlayground';
import {
  ALL_POETS,
  getPoetById,
  getPoetShortName,
  drawPoetPortrait,
  AFFINITY_CONFIG,
  calculateAffinityMultiplier,
  SEASON_CONFIG,
  calculateSeasonMultiplier,
  SeasonType,
  PoetData,
  PoemMove,
  MoveEffectType,
  LiteraryAffinity,
  StatusEffectType,
  POET_ARENAS,
  PoetArenaStage,
  getArenaById,
  getArenaForPoet,
  drawPoetArenaBackdrop,
  drawPoetArenaAtmosphere,
  CHAPTER_GATES,
  ChapterGateSpec,
  getPoetCrossPairingDialogue,
  getMoveCurrentStanza,
  getMoveStanzaIndex,
} from './poetsData';
import {
  canEnemyAiSelectStatus,
  checkCaptureWindow,
} from './src/battleEngine';
import {
  EXTERIOR_COLS,
  EXTERIOR_ROWS,
  HARBOR_COLS,
  HARBOR_ROWS,
  TILE_SIZE,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  findNearestWalkableTile,
  FacingDirection,
  OverworldScreenId,
  HarborNPC,
  INITIAL_HARBOR_NPCS,
  INITIAL_TOWN_NPCS,
  INITIAL_NIGHTINGALE_NPCS,
  INITIAL_LUNCH_NPCS,
  INITIAL_CLIFFS_NPCS,
  INITIAL_FORGE_NPCS,
  INITIAL_BLUEHOUSE_NPCS,
  INITIAL_RUINS_NPCS,
  INITIAL_MOUNTAIN_GOAT_NPCS,
  INITIAL_LIBRARY_NPCS,
  INITIAL_TREELINE_NPCS,
  INITIAL_GRAVEYARD_NPCS,
  INITIAL_WHITEHOUSE_NPCS,
  INITIAL_HERMITAGE_NPCS,
  INITIAL_SUMMIT_NPCS,
  INITIAL_RENTED_ROOM_NPCS,
  createFreshHarborNpcs,
  createFreshTownNpcs,
  arrangeSoapbox,
  createFreshNightingaleNpcs,
  createFreshLunchNpcs,
  createFreshCliffsNpcs,
  createFreshForgeNpcs,
  createFreshBlueHouseNpcs,
  createFreshRuinsNpcs,
  createFreshMountainGoatNpcs,
  createFreshLibraryNpcs,
  createFreshTreelineNpcs,
  createFreshKitchenNpcs,
  createFreshGraveyardNpcs,
  createFreshWhiteHouseNpcs,
  createFreshHermitageNpcs,
  createFreshSummitNpcs,
  createFreshRentedRoomNpcs,
  createFreshLyricSanctuaryNpcs,
  createFreshCafeNpcs,
  createFreshShakespeareCoNpcs,
  buildHarborScreen1,
  buildTownScreen2,
  buildCliffsScreen3,
  buildRuinsScreen4,
  buildTreelineScreen5,
  buildSummitScreen6,
  buildNightingaleScreen,
  buildLunchCounterScreen,
  buildForgeScreen,
  buildBlueHouseScreen,
  buildMountainGoatScreen,
  buildLibraryScreen,
  buildKitchenScreen,
  buildGraveyardScreen,
  buildWhiteHouseScreen,
  buildHermitageScreen,
  buildRentedRoomScreen,
  buildLyricSanctuaryScreen,
  buildCafeDeFloreScreen,
  buildShakespeareCoScreen,
  CAFE_DE_FLORE_COLS,
  CAFE_DE_FLORE_ROWS,
  SHAKESPEARE_CO_COLS,
  SHAKESPEARE_CO_ROWS,
  ROOM_CAFE_DE_FLORE,
  ROOM_SHAKESPEARE_CO,
  drawCafeDeFloreInterior,
  drawShakespeareCoInterior,
  drawHarborOverworldScreen,
  drawSummitCelestialSkyAndClouds,
  drawSummitCloudOcean,
  drawSummitHellenicArchitecture,
  drawCastalianSpring,
  HARBOR_TILES,
  PlayerStyle,
  PlayerSkinTone,
  PlayerCustomization,
  SKIN_TONE_CONFIG,
  DEFAULT_PLAYER_CUSTOMIZATION,
  setHarborPlayerCustomization,
  getHarborPlayerCustomization,
  setHarborPlayerHasLaurel,
  getHarborPlayerHasLaurel,
  drawPlayerPreview,
  LandGooseState,
  WaterGooseState,
  MaryOliverRoutineState,
  PondCrumbParticle,
  MaryOliverPhase,
  WalcottRoutineState,
  WalcottPhase,
  WATER_GOOSE_WAYPOINTS,
  CoastalDogState,
  CLIFFS_DOG_SPOTS,
  drawClassicalMuseStatue,
  drawAnimatedWaterGoose,
  isTreelineIceTile,
  IceSkateTrail,
  IceShimmerParticle,
  ROOM_CLIFFS,
  ROOM_FORGE,
  ROOM_BLUE_HOUSE,
  ROOM_RUINS,
  ROOM_MOUNTAIN_GOAT,
  ROOM_LIBRARY,
  ROOM_TREELINE,
  ROOM_KITCHEN,
  ROOM_HERMITAGE,
  ROOM_GRAVEYARD,
  ROOM_WHITE_HOUSE,
  ROOM_SUMMIT,
  ROOM_LYRIC_SANCTUARY,
  ROOM_RENTED_ROOM,
  ROOM_BOATHOUSE,
  buildBoathouseScreen,
  BOATHOUSE_COLS,
  BOATHOUSE_ROWS,
  drawBoathouseExterior,
  drawBoathouseCrates,
  drawLighthouseBeacon,
  drawCanto1Decorations,
  drawBoathouseInterior,
  drawBoathouseWaterSlip,
  drawBoathouseFish,
  drawBoathouseProps,
  drawTimberSillAndSteppingStones,
  drawLushCoastalTree,
  drawOverturnedRowboat,
  drawDriftwoodSignpost,
  drawGivingTreeStump,
  drawDarwish,
  drawSeatedNpc,
  DUELIST_BATTLE_BARKS,
  drawParisianBouquinisteStall,
  drawTownGatewayAndArch,
  drawTownEntranceCurbsAndPlanters,
  drawTownLushTree,
  drawTownShopfrontBackdrop,
  drawGrandTownFountain,
  drawTownPlazaFountain,
  drawTownFountain,
} from './overworldData';

export {
  CLIFFS_DOG_SPOTS,
  WATER_GOOSE_WAYPOINTS,
  DUELIST_BATTLE_BARKS,
  drawDarwish,
  drawSeatedNpc,
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
  drawTimberSillAndSteppingStones,
  drawLushCoastalTree,
  drawOverturnedRowboat,
  drawDriftwoodSignpost,
  drawGivingTreeStump,
  drawParisianBouquinisteStall,
  drawTownGatewayAndArch,
  drawTownEntranceCurbsAndPlanters,
  drawTownLushTree,
  drawTownShopfrontBackdrop,
  drawGrandTownFountain,
  drawTownPlazaFountain,
  drawTownFountain,
  ROOM_BOATHOUSE,
};
export type { CoastalDogState, WaterGooseState, MaryOliverRoutineState, PondCrumbParticle, MaryOliverPhase, WalcottRoutineState, WalcottPhase };

// Retro Layered Pixel Backdrop (GBA / SNES style mountain approach)
// 4-layer procedural canvas rendering Mount Parnassus rising from the rolling ocean,
// with twilight sky, crescent moon, lantern lights, and an approaching wooden rowboat.
function TitleRetroVistaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Virtual 16:9 pixel buffer (384x216) for true chunky GBA/SNES hardware aesthetics
    const V_W = 384;
    const V_H = 216;
    const HORIZON_Y = 126;

    const offscreen = document.createElement('canvas');
    offscreen.width = V_W;
    offscreen.height = V_H;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    let animId = 0;

    const updateSize = () => {
      if (!canvas) return;
      canvas.width = Math.max(1, window.innerWidth || 640);
      canvas.height = Math.max(1, window.innerHeight || 360);
    };
    updateSize();

    // Layer 1: Pixel Stars (dispersed in upper twilight sky)
    const stars = Array.from({ length: 48 }, () => ({
      x: Math.floor(Math.random() * V_W),
      y: Math.floor(Math.random() * (HORIZON_Y - 32)),
      size: Math.random() < 0.22 ? 2 : 1,
      isDiamond: Math.random() < 0.18,
      speed: 0.4 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      baseAlpha: 0.35 + Math.random() * 0.65,
    }));

    // Layer 1: Drifting low-altitude pixel mist/clouds slowly floating across horizon
    const clouds = [
      { x: 30, y: HORIZON_Y - 22, w: 72, h: 10, speed: 0.7, alpha: 0.25, color: '#f472b6' },
      { x: 160, y: HORIZON_Y - 16, w: 90, h: 12, speed: 0.5, alpha: 0.28, color: '#fb923c' },
      { x: 275, y: HORIZON_Y - 26, w: 68, h: 9, speed: 0.8, alpha: 0.20, color: '#f59e0b' },
      { x: 90, y: HORIZON_Y - 34, w: 84, h: 8, speed: 0.4, alpha: 0.16, color: '#c084fc' },
      { x: 330, y: HORIZON_Y - 12, w: 104, h: 13, speed: 0.6, alpha: 0.30, color: '#fbbf24' },
    ];

    // Layer 2: Mountain Terraces Lantern Lights (Harbor, Town, Cliffs, Ruins, Summit)
    const mountainLanterns = [
      // Harbor & Town lower terrace (X: 75..135, Y: 110..124)
      { x: 80, y: 124, phase: 0.2, speed: 0.8, color: '#fde047' },
      { x: 92, y: 121, phase: 1.6, speed: 1.1, color: '#f59e0b' },
      { x: 108, y: 118, phase: 2.4, speed: 0.9, color: '#fde047' },
      { x: 120, y: 114, phase: 0.9, speed: 1.2, color: '#fbbf24' },
      { x: 132, y: 112, phase: 3.2, speed: 0.7, color: '#f59e0b' },
      { x: 142, y: 107, phase: 1.8, speed: 1.0, color: '#fde047' },
      // Middle Rocky Cliff Ridges & Ancient Ruins (X: 155..215, Y: 78..98)
      { x: 162, y: 96, phase: 4.1, speed: 1.1, color: '#fbbf24' },
      { x: 174, y: 92, phase: 0.5, speed: 0.9, color: '#fde047' },
      { x: 188, y: 86, phase: 2.7, speed: 1.3, color: '#f59e0b' },
      { x: 198, y: 81, phase: 1.3, speed: 0.8, color: '#fde047' },
      { x: 212, y: 76, phase: 3.9, speed: 1.2, color: '#fbbf24' },
      // Upper Alpine Approach & Summit Terrace (X: 228..265, Y: 52..68)
      { x: 232, y: 66, phase: 1.1, speed: 0.9, color: '#fde047' },
      { x: 248, y: 55, phase: 2.9, speed: 1.0, color: '#fef08a' },
      { x: 260, y: 48, phase: 0.7, speed: 0.9, color: '#fde047' },
    ];

    let lastSec = performance.now() / 1000;

    const render = (timeMs: number) => {
      const nowSec = timeMs / 1000;
      const dt = Math.min(0.1, nowSec - lastSec);
      lastSec = nowSec;

      offCtx.clearRect(0, 0, V_W, V_H);

      // =========================================================================
      // LAYER 1: SKY, TWILIGHT GRADIENT, STARS, MOON & MIST
      // =========================================================================
      // Twilight to warm amber/gold horizon gradient
      const skyGrad = offCtx.createLinearGradient(0, 0, 0, HORIZON_Y);
      skyGrad.addColorStop(0.0, '#060919'); // Deep midnight indigo
      skyGrad.addColorStop(0.24, '#0d1332'); // Dark indigo navy
      skyGrad.addColorStop(0.48, '#1e1445'); // Twilight royal plum
      skyGrad.addColorStop(0.68, '#431448'); // Deep dusk magenta
      skyGrad.addColorStop(0.82, '#701e29'); // Warm burgundy rose
      skyGrad.addColorStop(0.92, '#b44414'); // Rich sunset terracotta
      skyGrad.addColorStop(0.97, '#ea580c'); // Luminous amber
      skyGrad.addColorStop(1.0, '#fbbf24'); // Golden sea horizon
      offCtx.fillStyle = skyGrad;
      offCtx.fillRect(0, 0, V_W, HORIZON_Y + 1);

      // Gentle twinkling pixel stars
      for (const s of stars) {
        const pulse = 0.45 + 0.55 * Math.sin(nowSec * s.speed + s.phase);
        const alpha = Math.max(0.1, s.baseAlpha * pulse);
        offCtx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
        if (s.isDiamond && pulse > 0.65) {
          // 3x3 diamond cross pixel star
          offCtx.fillRect(s.x, s.y - 1, 1, 3);
          offCtx.fillRect(s.x - 1, s.y, 3, 1);
          offCtx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.2})`;
          offCtx.fillRect(s.x, s.y, 1, 1);
        } else {
          offCtx.fillRect(s.x, s.y, s.size, s.size);
        }
      }

      // Striking large crescent moon with luminous halo and crater detailing (~1.7x radius)
      const moonX = 58;
      const moonY = 34;
      const moonR = 13.0; // Enriched scale (1.73x original 7.5)

      // Layered luminous lunar atmospheric halo
      const moonHaloOuter = offCtx.createRadialGradient(moonX, moonY, 4, moonX, moonY, 38);
      moonHaloOuter.addColorStop(0.0, 'rgba(254, 249, 195, 0.48)');
      moonHaloOuter.addColorStop(0.28, 'rgba(253, 224, 71, 0.22)');
      moonHaloOuter.addColorStop(0.65, 'rgba(251, 191, 36, 0.08)');
      moonHaloOuter.addColorStop(1.0, 'rgba(254, 240, 138, 0)');
      offCtx.fillStyle = moonHaloOuter;
      offCtx.beginPath();
      offCtx.arc(moonX, moonY, 38, 0, Math.PI * 2);
      offCtx.fill();

      // Subtle celestial earthshine (the dimmed lunar disk with faint mare/crater shading)
      offCtx.save();
      offCtx.fillStyle = 'rgba(15, 23, 56, 0.55)';
      offCtx.beginPath();
      offCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      offCtx.fill();
      // Faint lunar maria / crater basins in the shadowed sphere
      offCtx.fillStyle = 'rgba(10, 15, 38, 0.4)';
      offCtx.beginPath();
      offCtx.arc(moonX + 3, moonY - 3, 3.2, 0, Math.PI * 2); // Mare Crisium
      offCtx.arc(moonX + 5, moonY + 2, 4.0, 0, Math.PI * 2); // Mare Serenitatis
      offCtx.arc(moonX + 2, moonY + 6, 3.5, 0, Math.PI * 2); // Mare Tranquillitatis
      offCtx.fill();

      // Brilliant golden crescent body
      offCtx.fillStyle = '#fef9c3';
      offCtx.beginPath();
      offCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      offCtx.fill();

      // Inner shadow sphere cutter for slender, sculpted crescent curve
      offCtx.fillStyle = '#0a102c';
      offCtx.beginPath();
      offCtx.arc(moonX + 6.2, moonY - 2.0, moonR * 0.88, 0, Math.PI * 2);
      offCtx.fill();

      // Subtle crater textures along the inner terminator edge
      offCtx.fillStyle = '#fde047';
      offCtx.fillRect(moonX - 8, moonY - 3, 2, 2);
      offCtx.fillRect(moonX - 6, moonY + 4, 2, 2);
      offCtx.fillRect(moonX - 2, moonY + 9, 2, 2);
      offCtx.fillStyle = '#ca8a04';
      offCtx.fillRect(moonX - 7, moonY - 2, 1, 1);
      offCtx.fillRect(moonX - 5, moonY + 5, 1, 1);

      // Radiant white cusp gleams at the horn tips
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(moonX - 11, moonY - 4, 1, 2);
      offCtx.fillRect(moonX - 12, moonY - 3, 2, 1);
      offCtx.fillRect(moonX + 2, moonY + 11, 2, 1);
      offCtx.fillRect(moonX + 3, moonY + 10, 1, 2);
      offCtx.restore();

      // Drifting low-altitude pixel mist/clouds along horizon
      for (const c of clouds) {
        c.x = (c.x + c.speed * dt) % (V_W + c.w + 40);
        const drawX = c.x - 30;
        offCtx.save();
        offCtx.fillStyle = c.color;
        offCtx.globalAlpha = c.alpha * (0.8 + 0.2 * Math.sin(nowSec + c.y));
        // Pixel pill / tiered mist shape
        offCtx.fillRect(Math.floor(drawX), c.y, c.w, c.h);
        offCtx.fillRect(Math.floor(drawX + 8), c.y - 2, c.w - 16, c.h + 4);
        offCtx.fillRect(Math.floor(drawX + 18), c.y - 4, c.w - 36, c.h + 8);
        offCtx.restore();
      }

      // =========================================================================
      // LAYER 2: MOUNT PARNASSUS IN THE DISTANCE (ENRICHED DEPTH & DETAIL)
      // =========================================================================
      // 2A: Far distant back ridge silhouette (atmospheric slate plum)
      offCtx.fillStyle = '#141029';
      offCtx.beginPath();
      offCtx.moveTo(0, HORIZON_Y);
      offCtx.lineTo(35, HORIZON_Y - 20);
      offCtx.lineTo(85, HORIZON_Y - 36);
      offCtx.lineTo(140, HORIZON_Y - 26);
      offCtx.lineTo(205, HORIZON_Y - 52);
      offCtx.lineTo(270, HORIZON_Y - 68);
      offCtx.lineTo(325, HORIZON_Y - 40);
      offCtx.lineTo(384, HORIZON_Y - 18);
      offCtx.lineTo(384, HORIZON_Y);
      offCtx.closePath();
      offCtx.fill();

      // 2B: Middle crags & escarpment tier (rich midnight indigo)
      offCtx.fillStyle = '#0e122b';
      offCtx.beginPath();
      offCtx.moveTo(25, HORIZON_Y);
      offCtx.lineTo(60, HORIZON_Y - 14);
      offCtx.lineTo(100, HORIZON_Y - 24);
      offCtx.lineTo(135, HORIZON_Y - 30);
      offCtx.lineTo(165, HORIZON_Y - 46);
      offCtx.lineTo(195, HORIZON_Y - 58);
      offCtx.lineTo(220, HORIZON_Y - 72);
      offCtx.lineTo(245, HORIZON_Y - 82);
      offCtx.lineTo(275, HORIZON_Y - 64);
      offCtx.lineTo(305, HORIZON_Y - 44);
      offCtx.lineTo(345, HORIZON_Y - 22);
      offCtx.lineTo(370, HORIZON_Y);
      offCtx.closePath();
      offCtx.fill();

      // 2C: Mount Parnassus Main Massif (Multi-tiered stepped elevation)
      // Stepped profile: Lower Harbor & Town -> Middle Cliffside Ruins -> Towering Summit Peaks
      offCtx.fillStyle = '#060a18'; // Deep ink mountain silhouette
      offCtx.beginPath();
      offCtx.moveTo(45, HORIZON_Y);
      // Lower Slopes (Harbor & Town)
      offCtx.lineTo(68, HORIZON_Y - 10);
      offCtx.lineTo(88, HORIZON_Y - 16);
      offCtx.lineTo(108, HORIZON_Y - 20);
      offCtx.lineTo(126, HORIZON_Y - 23);
      offCtx.lineTo(142, HORIZON_Y - 28);
      // Rocky Cliffside Ridge & Ruins Terrace
      offCtx.lineTo(152, HORIZON_Y - 40);
      offCtx.lineTo(164, HORIZON_Y - 45);
      offCtx.lineTo(176, HORIZON_Y - 52);
      offCtx.lineTo(190, HORIZON_Y - 57);
      offCtx.lineTo(202, HORIZON_Y - 65);
      offCtx.lineTo(214, HORIZON_Y - 69);
      // Towering Summit Peaks
      offCtx.lineTo(228, HORIZON_Y - 81);
      offCtx.lineTo(240, HORIZON_Y - 98); // Western Peak (Y ~ 28)
      offCtx.lineTo(248, HORIZON_Y - 90);
      offCtx.lineTo(256, HORIZON_Y - 95); // Dual Apex Horn (Y ~ 31)
      offCtx.lineTo(266, HORIZON_Y - 78);
      offCtx.lineTo(282, HORIZON_Y - 60);
      offCtx.lineTo(300, HORIZON_Y - 44);
      offCtx.lineTo(320, HORIZON_Y - 26);
      offCtx.lineTo(342, HORIZON_Y - 12);
      offCtx.lineTo(360, HORIZON_Y);
      offCtx.closePath();
      offCtx.fill();

      // Subtle warm amber rim highlight on western edge facing the dusk horizon
      offCtx.strokeStyle = 'rgba(251, 146, 60, 0.5)';
      offCtx.lineWidth = 1;
      offCtx.beginPath();
      offCtx.moveTo(68, HORIZON_Y - 10);
      offCtx.lineTo(108, HORIZON_Y - 20);
      offCtx.lineTo(142, HORIZON_Y - 28);
      offCtx.lineTo(176, HORIZON_Y - 52);
      offCtx.lineTo(214, HORIZON_Y - 69);
      offCtx.lineTo(240, HORIZON_Y - 98);
      offCtx.stroke();

      // Intermediate mountain ridgeline shading & faceted rock crag textures
      offCtx.strokeStyle = 'rgba(30, 41, 75, 0.8)';
      offCtx.lineWidth = 1;
      // Summit to mid-ridge spine
      offCtx.beginPath();
      offCtx.moveTo(240, HORIZON_Y - 96);
      offCtx.lineTo(236, HORIZON_Y - 76);
      offCtx.lineTo(222, HORIZON_Y - 62);
      offCtx.lineTo(206, HORIZON_Y - 48);
      offCtx.stroke();
      // East ridge spine
      offCtx.beginPath();
      offCtx.moveTo(256, HORIZON_Y - 93);
      offCtx.lineTo(262, HORIZON_Y - 75);
      offCtx.lineTo(276, HORIZON_Y - 54);
      offCtx.stroke();

      // Natural pine and cypress tree silhouettes along the lower harbor foothill ridges
      const drawPine = (px: number, py: number, h: number) => {
        offCtx.fillStyle = '#040711';
        offCtx.fillRect(px, py - h, 1, h);
        offCtx.fillRect(px - 1, py - Math.floor(h * 0.75), 3, Math.floor(h * 0.45));
        offCtx.fillRect(px - 2, py - Math.floor(h * 0.45), 5, Math.floor(h * 0.35));
      };
      const drawCypress = (cx: number, cy: number, ch: number) => {
        offCtx.fillStyle = '#040711';
        offCtx.fillRect(cx, cy - ch, 1, ch);
        offCtx.fillRect(cx - 1, cy - ch + 2, 3, ch - 3);
      };
      // Lower harbor & coastal foothill groves
      drawCypress(72, HORIZON_Y - 10, 5);
      drawCypress(75, HORIZON_Y - 11, 6);
      drawPine(82, HORIZON_Y - 13, 7);
      drawPine(86, HORIZON_Y - 14, 6);
      drawCypress(96, HORIZON_Y - 17, 7);
      drawPine(102, HORIZON_Y - 18, 8);
      drawPine(114, HORIZON_Y - 21, 6);
      drawCypress(122, HORIZON_Y - 22, 7);
      drawPine(130, HORIZON_Y - 24, 7);
      drawPine(136, HORIZON_Y - 26, 8);
      drawCypress(144, HORIZON_Y - 29, 6);

      // Richer alpine snowcaps on the twin peaks with crevasses and snowfields
      // West Peak (Crisp white snowfield with shadowed crevasse cuts)
      offCtx.fillStyle = '#ffffff';
      offCtx.beginPath();
      offCtx.moveTo(240, HORIZON_Y - 98);
      offCtx.lineTo(232, HORIZON_Y - 86);
      offCtx.lineTo(235, HORIZON_Y - 82);
      offCtx.lineTo(238, HORIZON_Y - 85);
      offCtx.lineTo(242, HORIZON_Y - 80);
      offCtx.lineTo(246, HORIZON_Y - 87);
      offCtx.lineTo(248, HORIZON_Y - 90);
      offCtx.closePath();
      offCtx.fill();
      // West peak crevasse shade
      offCtx.fillStyle = '#94a3b8';
      offCtx.beginPath();
      offCtx.moveTo(240, HORIZON_Y - 94);
      offCtx.lineTo(238, HORIZON_Y - 86);
      offCtx.lineTo(242, HORIZON_Y - 82);
      offCtx.lineTo(241, HORIZON_Y - 88);
      offCtx.closePath();
      offCtx.fill();

      // East Peak Snowcap
      offCtx.fillStyle = '#f1f5f9';
      offCtx.beginPath();
      offCtx.moveTo(256, HORIZON_Y - 95);
      offCtx.lineTo(249, HORIZON_Y - 86);
      offCtx.lineTo(253, HORIZON_Y - 82);
      offCtx.lineTo(258, HORIZON_Y - 84);
      offCtx.lineTo(262, HORIZON_Y - 79);
      offCtx.lineTo(265, HORIZON_Y - 86);
      offCtx.closePath();
      offCtx.fill();
      // East peak crevasse shade
      offCtx.fillStyle = '#cbd5e1';
      offCtx.beginPath();
      offCtx.moveTo(256, HORIZON_Y - 91);
      offCtx.lineTo(254, HORIZON_Y - 84);
      offCtx.lineTo(258, HORIZON_Y - 82);
      offCtx.closePath();
      offCtx.fill();

      // Distinct terrace architectural silhouettes & glowing trail windows:
      // Harbor pier post silhouettes at water edge (X: 72..86)
      offCtx.fillStyle = '#040711';
      offCtx.fillRect(74, HORIZON_Y - 4, 3, 5);
      offCtx.fillRect(84, HORIZON_Y - 5, 3, 6);
      offCtx.fillRect(72, HORIZON_Y - 2, 16, 2);

      // Mid-cliffside ancient ruins colonnade on terrace (X: 186..198)
      offCtx.fillRect(187, HORIZON_Y - 58, 2, 6);
      offCtx.fillRect(191, HORIZON_Y - 58, 2, 6);
      offCtx.fillRect(195, HORIZON_Y - 58, 2, 6);
      offCtx.fillRect(186, HORIZON_Y - 59, 12, 2);

      // Faint illuminated cliffside temple / shrine windows on the ascent trail
      // Cliffside monastery at X: 168, Y: HORIZON_Y - 46
      offCtx.fillRect(166, HORIZON_Y - 47, 9, 5);
      offCtx.fillRect(168, HORIZON_Y - 49, 5, 2);
      // Faint warm illuminated temple windows
      const shrineGlowPulse = 0.8 + 0.2 * Math.sin(nowSec * 1.8);
      offCtx.fillStyle = `rgba(251, 191, 36, ${0.85 * shrineGlowPulse})`;
      offCtx.fillRect(168, HORIZON_Y - 45, 2, 2);
      offCtx.fillRect(172, HORIZON_Y - 45, 2, 2);

      // Alpine Summit Sanctuary / Temple Spire silhouette at (X: 251, Y: HORIZON_Y - 92)
      offCtx.fillStyle = '#040711';
      offCtx.fillRect(251, HORIZON_Y - 95, 2, 7);
      offCtx.fillRect(249, HORIZON_Y - 91, 6, 3);
      // High alpine sanctuary beacon window
      offCtx.fillStyle = `rgba(254, 240, 138, ${0.9 * shrineGlowPulse})`;
      offCtx.fillRect(251, HORIZON_Y - 90, 2, 2);

      // Warm tiny golden lantern lights dotting distant terraces & ascent switchbacks
      for (const l of mountainLanterns) {
        const pulse = 0.5 + 0.5 * Math.sin(nowSec * l.speed + l.phase);
        // Soft lantern glow
        offCtx.fillStyle = 'rgba(245, 158, 11, 0.4)';
        offCtx.fillRect(l.x - 1, l.y - 1, 3, 3);
        // Sharp incandescent core
        offCtx.fillStyle = pulse > 0.4 ? l.color : '#ffffff';
        offCtx.fillRect(l.x, l.y, 1, 1);
      }

      // =========================================================================
      // LAYER 3: THE ROLLING OCEAN & REFLECTIONS
      // =========================================================================
      // Multi-tone pixel ocean base gradient (Deep navy/slate to maritime blue)
      const seaGrad = offCtx.createLinearGradient(0, HORIZON_Y, 0, V_H);
      seaGrad.addColorStop(0.0, '#081329'); // Deep slate horizon edge
      seaGrad.addColorStop(0.2, '#0c2242'); // Deep maritime navy
      seaGrad.addColorStop(0.5, '#073359'); // Aegean slate blue
      seaGrad.addColorStop(0.8, '#034475'); // Rich maritime ocean blue
      seaGrad.addColorStop(1.0, '#042749'); // Forefront deep ocean swell
      offCtx.fillStyle = seaGrad;
      offCtx.fillRect(0, HORIZON_Y, V_W, V_H - HORIZON_Y);

      const drawWaveDash = (startX: number, y: number, length: number, color: string) => {
        const x1 = Math.floor(startX);
        if (length <= 0) return;
        offCtx.fillStyle = color;
        offCtx.fillRect(x1, y, length, 1);
      };

      // Horizontal wave animation rows & white-foam crests - seamless across full width
      const waveRowCount = 18;
      for (let r = 0; r < waveRowCount; r++) {
        const waveY = HORIZON_Y + 3 + r * 5;
        const progress = r / waveRowCount;
        // Slow, poetic rhythmic swell
        const speed = 0.32 + progress * 0.38;
        const wavePhase = nowSec * speed + r * 0.75;
        const waveSwell = Math.sin(wavePhase);

        // Water band color (lighter on surface crests) across entire width
        const bandColor = r % 2 === 0 ? '#0b3964' : '#072b4c';
        offCtx.fillStyle = bandColor;
        offCtx.fillRect(0, waveY, V_W, 2);

        // Smooth moving swell peaks and gentle foam lines flowing seamlessly across the ocean
        const crestOffset = (nowSec * 4.2 * (1 + progress * 0.45) + r * 37) % (V_W + 40) - 20;
        const crestLength = 10 + Math.floor(progress * 16);
        const crestColor = waveSwell > 0.25 ? '#bae6fd' : '#0284c7';
        drawWaveDash(crestOffset, waveY, crestLength, crestColor);

        if (waveSwell > 0.7) {
          drawWaveDash(crestOffset + 3, waveY, Math.max(3, crestLength - 6), '#f0f9ff');
        }

        // Secondary subtle crest on opposite side
        const crest2 = (crestOffset + V_W * 0.52) % (V_W + 40) - 20;
        if (waveSwell < -0.3) {
          drawWaveDash(crest2, waveY, Math.floor(crestLength * 0.75), '#7dd3fc');
        }

        // Shimmering water reflection lines trailing beneath mountain
        const shimmerX = 220 + Math.sin(nowSec * 0.85 + r * 0.45) * 8;
        const shimmerWidth = Math.max(4, 22 - r * 0.7);
        const shimmerPulse = 0.5 + 0.5 * Math.sin(nowSec * 1.05 + r * 0.75);
        if (shimmerPulse > 0.32) {
          const shimmerColor = r < 6 ? '#f59e0b' : r < 12 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(254, 240, 138, 0.2)';
          drawWaveDash(shimmerX - shimmerWidth / 2, waveY, shimmerWidth, shimmerColor);
        }

        // Expanded luminous moon reflection in water beneath the enlarged moon
        const moonReflectPulse = 0.45 + 0.55 * Math.sin(nowSec * 0.95 + r * 0.55);
        if (moonReflectPulse > 0.35) {
          const moonReflectX = moonX + Math.sin(nowSec * 0.65 + r * 0.45) * 3.5;
          const moonReflectW = Math.max(3, 15 - r * 0.5);
          drawWaveDash(moonReflectX - moonReflectW / 2, waveY, moonReflectW, `rgba(254, 249, 195, ${0.45 * moonReflectPulse})`);
        }
      }

      // =========================================================================
      // LAYER 4: ENLARGED WOODEN BOAT (~1.8X) WITH BILLOWING SAIL & LANTERN
      // =========================================================================
      // Gracefully bobbing on the left water expanse (~20% screen width)
      const boatBaseX = 78;
      const boatBaseY = 175;
      const bobPeriod = 4.8;
      const bobY = Math.sin(nowSec * (Math.PI * 2 / bobPeriod)) * 2.2;
      const boatRoll = Math.sin(nowSec * (Math.PI * 2 / bobPeriod) + 0.35) * 0.04;

      offCtx.save();
      offCtx.translate(boatBaseX, boatBaseY + bobY);
      offCtx.rotate(boatRoll);

      // Dynamic water ripple and displacement wake beneath boat hull
      const ripplePulse = 0.3 + 0.15 * Math.sin(nowSec * 1.4);
      offCtx.fillStyle = `rgba(125, 211, 252, ${ripplePulse})`;
      offCtx.fillRect(-24, 8, 48, 2);
      offCtx.fillStyle = 'rgba(7, 43, 76, 0.7)';
      offCtx.fillRect(-20, 10, 40, 2);

      // Wooden Boat Hull (~1.8x original scale, width ~46px, height ~8px)
      // Dark keel & timber outline
      offCtx.fillStyle = '#1c0d02';
      offCtx.fillRect(-21, 2, 42, 6);
      offCtx.fillRect(-17, 8, 34, 2);
      // Bow upsweep (pointed right, approaching Mount Parnassus)
      offCtx.fillRect(21, 0, 4, 4);
      offCtx.fillRect(24, -3, 3, 4);
      offCtx.fillRect(26, -5, 2, 3);
      // Stern upsweep (left)
      offCtx.fillRect(-23, 0, 4, 4);
      offCtx.fillRect(-24, -2, 3, 3);

      // Main oak wood plank body
      offCtx.fillStyle = '#78350f';
      offCtx.fillRect(-19, 3, 39, 5);
      offCtx.fillStyle = '#92400e';
      offCtx.fillRect(-18, 4, 38, 2);

      // Warm timber upper gunwale highlight
      offCtx.fillStyle = '#b45309';
      offCtx.fillRect(-22, 1, 44, 2);
      offCtx.fillStyle = '#d97706';
      offCtx.fillRect(19, -1, 5, 2);

      // Seated Traveler / Poet Silhouette inside the boat
      offCtx.fillStyle = '#080c1d'; // dark midnight traveler silhouette
      // Cloak body
      offCtx.fillRect(-8, -6, 12, 9);
      // Head & traveler hat
      offCtx.fillRect(-6, -13, 8, 7);
      offCtx.fillRect(-10, -9, 16, 2); // hat brim
      // Open book / manuscript draft in traveler's hands
      offCtx.fillStyle = '#fef08a';
      offCtx.fillRect(-1, -4, 5, 4);
      offCtx.fillStyle = '#b45309';
      offCtx.fillRect(0, -3, 3, 1); // line of verse on draft

      // Wooden Oar resting at rowlock dipping into the water
      offCtx.fillStyle = '#451a03';
      offCtx.fillRect(-11, 2, 2, 5);
      offCtx.fillRect(-14, 7, 2, 6);
      offCtx.fillStyle = '#b45309';
      offCtx.fillRect(-16, 11, 4, 4); // carved oar blade dipping into water

      // =========================================================================
      // RETRO WOODEN MAST, RIGGING & BILLOWING CANVAS SAIL
      // =========================================================================
      const mastX = 1;
      const mastTopY = -42;
      const mastBottomY = 2;

      // Wooden Mast (vertical timber spar)
      offCtx.fillStyle = '#3b1602';
      offCtx.fillRect(mastX - 1, mastTopY, 3, mastBottomY - mastTopY);
      offCtx.fillStyle = '#78350f';
      offCtx.fillRect(mastX, mastTopY, 1, mastBottomY - mastTopY);
      // Masthead cap / truck
      offCtx.fillStyle = '#d97706';
      offCtx.fillRect(mastX - 1, mastTopY - 2, 3, 2);

      // Billow animation with gentle breathing evening breeze
      const sailBillow = Math.sin(nowSec * 2.2 + 0.4) * 2.2;
      const sailWave = Math.sin(nowSec * 3.1) * 1.2;

      // Classic retro cloth sail (canvas/linen lateen/caravel triangular sail gently billowing)
      // Sail shadow & edge crease
      offCtx.fillStyle = '#b45309';
      offCtx.beginPath();
      offCtx.moveTo(mastX, mastTopY + 3);
      offCtx.quadraticCurveTo(14 + sailBillow, (mastTopY + 3 + -4) / 2, 22 + sailWave, -4);
      offCtx.lineTo(mastX - 2, -2);
      offCtx.closePath();
      offCtx.fill();

      // Main warm canvas/linen sail body
      offCtx.fillStyle = '#fef3c7';
      offCtx.beginPath();
      offCtx.moveTo(mastX, mastTopY + 4);
      offCtx.quadraticCurveTo(13 + sailBillow, (mastTopY + 4 + -5) / 2, 21 + sailWave, -5);
      offCtx.quadraticCurveTo(7 + sailBillow * 0.5, -4, mastX, -2);
      offCtx.closePath();
      offCtx.fill();

      // Soft sunset amber light passing through billowing cloth
      offCtx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      offCtx.beginPath();
      offCtx.moveTo(mastX + 1, mastTopY + 8);
      offCtx.quadraticCurveTo(10 + sailBillow, (mastTopY + 8 + -6) / 2, 18 + sailWave, -6);
      offCtx.quadraticCurveTo(6, -4, mastX + 1, -2);
      offCtx.closePath();
      offCtx.fill();

      // Linen cloth seam lines (retro pixel texture)
      offCtx.strokeStyle = 'rgba(180, 83, 9, 0.45)';
      offCtx.lineWidth = 1;
      offCtx.beginPath();
      offCtx.moveTo(mastX, mastTopY + 16);
      offCtx.lineTo(15 + sailBillow * 0.7, -4);
      offCtx.moveTo(mastX, mastTopY + 28);
      offCtx.lineTo(8 + sailBillow * 0.4, -3);
      offCtx.stroke();

      // Wooden Yard Spar & Rigging Ropes
      offCtx.fillStyle = '#451a03';
      offCtx.fillRect(mastX - 1, mastTopY + 2, 2, 2);
      // Rigging stays (ropes to bow and stern)
      offCtx.strokeStyle = '#271004';
      offCtx.lineWidth = 1;
      offCtx.beginPath();
      // Forestay from masthead to bow
      offCtx.moveTo(mastX, mastTopY + 2);
      offCtx.lineTo(26, -5);
      // Backstay from masthead to stern
      offCtx.moveTo(mastX, mastTopY + 2);
      offCtx.lineTo(-21, 0);
      // Sail sheet to cleat
      offCtx.moveTo(21 + sailWave, -5);
      offCtx.lineTo(12, 1);
      offCtx.stroke();

      // Wooden Bow Post & Warm Cozy Lantern
      const lanternPostX = 27;
      const lanternPostY = -7;

      // Bow post
      offCtx.fillStyle = '#451a03';
      offCtx.fillRect(lanternPostX - 2, lanternPostY, 2, 7);
      // Lantern hanging bracket
      offCtx.fillRect(lanternPostX, lanternPostY + 1, 3, 1);

      // Bow Lantern position
      const lanternX = lanternPostX + 3;
      const lanternY = lanternPostY + 3;

      // Soft, cozy, breathing warm lantern glow
      const lanternPulse = 0.88 + 0.12 * Math.sin(nowSec * 1.6);
      const lanternGlow = offCtx.createRadialGradient(lanternX, lanternY, 1, lanternX, lanternY, 26);
      lanternGlow.addColorStop(0.0, `rgba(254, 240, 138, ${0.58 * lanternPulse})`);
      lanternGlow.addColorStop(0.35, `rgba(251, 191, 36, ${0.28 * lanternPulse})`);
      lanternGlow.addColorStop(0.7, `rgba(245, 158, 11, ${0.1 * lanternPulse})`);
      lanternGlow.addColorStop(1.0, 'rgba(245, 158, 11, 0)');
      offCtx.fillStyle = lanternGlow;
      offCtx.beginPath();
      offCtx.arc(lanternX, lanternY, 26, 0, Math.PI * 2);
      offCtx.fill();

      // Lantern metal casing & glowing core
      offCtx.fillStyle = '#271004';
      offCtx.fillRect(lanternX - 2, lanternY - 3, 4, 6);
      offCtx.fillStyle = '#fef08a';
      offCtx.fillRect(lanternX - 1, lanternY - 2, 2, 4);
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(lanternX - 1, lanternY - 1, 2, 2); // incandescent flame core

      offCtx.restore();

      // Lantern reflection trailing on water directly beneath the boat
      const lanternReflectX = boatBaseX + 30;
      const lanternReflectY = boatBaseY + 11 + bobY * 0.5;
      offCtx.fillStyle = `rgba(251, 191, 36, ${0.46 * lanternPulse})`;
      offCtx.fillRect(Math.floor(lanternReflectX - 5), Math.floor(lanternReflectY), 10, 1);
      offCtx.fillStyle = `rgba(245, 158, 11, ${0.28 * lanternPulse})`;
      offCtx.fillRect(Math.floor(lanternReflectX - 8), Math.floor(lanternReflectY + 2), 16, 1);
      offCtx.fillStyle = `rgba(217, 119, 6, ${0.16 * lanternPulse})`;
      offCtx.fillRect(Math.floor(lanternReflectX - 11), Math.floor(lanternReflectY + 4), 22, 1);

      // =========================================================================
      // BLIT TO MAIN CANVAS (CRISP RETRO PIXEL SCALING)
      // =========================================================================
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    window.addEventListener('resize', updateSize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 select-none"
    />
  );
}

// ----------------------------------------------------------------------------
// EDITORIAL PROLOGUE TYPOGRAPHY & CADENCE TOKENIZER
// Pure "Text on Pitch Black" Editorial Presentation
// ----------------------------------------------------------------------------
export interface PrologueToken {
  word: string;
  isQuoted: boolean;
  delayMs: number;
}

export function parsePrologueTokens(rawText: string): { tokens: PrologueToken[]; totalDurationMs: number } {
  const tokens: PrologueToken[] = [];
  const words = rawText.split(/\s+/).filter(Boolean);
  let inQuotes = false;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const startsQuote = w.startsWith('"') || w.startsWith('“');
    const endsQuote =
      w.endsWith('"') ||
      w.endsWith('”') ||
      w.endsWith('".') ||
      w.endsWith('",') ||
      w.endsWith('"?') ||
      w.endsWith('”!') ||
      w.endsWith('”?');

    if (startsQuote) inQuotes = true;
    const isQuoted = inQuotes;
    if (endsQuote) inQuotes = false;

    tokens.push({
      word: w,
      isQuoted,
      delayMs: 0,
    });
  }

  return { tokens, totalDurationMs: 450 };
}

// ----------------------------------------------------------------------------
// GILDED IMAGERY & POETIC KEYWORD CADENCE TOKENIZER
// Warm Antique Gold (#FCE182 / #FBE8A6) with Subtle Letterpress Shadow
// Fine Cream Vellum (#EAE0D0) Base Text
// ----------------------------------------------------------------------------
export interface PoeticTextToken {
  text: string;
  isGilded: boolean;
}

const GILDED_PHRASES: string[] = [
  'barbaric yawp',
  'world goes on',
  'less traveled',
  'all the difference',
  'summer’s day',
  "summer's day",
  'mellow fruitfulness',
  'mon frère',
  'mon semblable',
  'dark wood',
  'journey of our life',
  'wild and precious',
  'wild geese',
  'soft animal',
  'leaves of grass',
  'sing the body',
  'open road',
  'kingdom by the sea',
  'annabel lee',
  'Annabel Lee',
  'telltale heart',
  'miles to go',
  'promises to keep',
  'stopping by woods',
  'fire and ice',
  'mending wall',
  'rough winds',
  'darling buds',
  'all the world',
  'beauty is truth',
  'truth beauty',
  'thing of beauty',
  'waking dream',
  'fleurs du mal',
  'spleen and ideal',
  'burning bright',
  'fearful symmetry',
  'grain of sand',
  'wild flower',
  'thing with feathers',
  'raisin in the sun',
  'dream deferred',
  'weary blues',
  'ancient pond',
  'sound of water',
  'narrow road',
  'drinking alone',
  'light enters you',
  'caged bird',
  'still I rise',
  'rage, rage',
  'dying of the light',
  'candle burns',
  'golden shovel',
  'peace of wild things',
  'live deliberately',
];

const GILDED_KEYWORDS: string[] = [
  'Nevermore',
  'nevermore',
  'despair',
  'darkness',
  'mists',
  'yawp',
  'multitudes',
  'camerado',
  'raven',
  'Raven',
  'bells',
  'sepulchre',
  'woods',
  'snow',
  'bud',
  'buds',
  'theatre',
  'stage',
  'nightingale',
  'beauty',
  'truth',
  'spleen',
  'hell',
  'inferno',
  'ice',
  'tyger',
  'Tyger',
  'lamb',
  'eternity',
  'heaven',
  'hope',
  'nobody',
  'carriage',
  'rivers',
  'dreams',
  'wound',
  'frog',
  'moon',
  'wine',
  'shadow',
  'duende',
  'guitar',
  'ocean',
  'solitude',
  'silence',
  'laurel',
  'parnassus',
  'Parnassus',
];

export function tokenizePoeticLine(rawText: string): PoeticTextToken[] {
  // 1. Support explicit Markdown bold **term**
  if (rawText.includes('**')) {
    const parts = rawText.split(/(\*\*[^*]+\*\*)/g);
    return parts
      .filter(Boolean)
      .map((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return { text: part.slice(2, -2), isGilded: true };
        }
        return { text: part, isGilded: false };
      });
  }

  // 2. Automated gilded matcher for literary imagery & keywords
  const allTerms = [...GILDED_PHRASES, ...GILDED_KEYWORDS].sort((a, b) => b.length - a.length);
  const escaped = allTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(\\b(?:${escaped.join('|')})\\b|mon frère|summer’s day)`, 'gi');

  const tokens: PoeticTextToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: rawText.slice(lastIndex, match.index), isGilded: false });
    }
    tokens.push({ text: match[0], isGilded: true });
    lastIndex = pattern.lastIndex;
    if (match[0].length === 0) {
      pattern.lastIndex++;
    }
  }
  if (lastIndex < rawText.length) {
    tokens.push({ text: rawText.slice(lastIndex), isGilded: false });
  }

  return tokens.length > 0 ? tokens : [{ text: rawText, isGilded: false }];
}

export function renderGildedPoeticTokens(rawText: string): React.ReactNode {
  const clean = rawText.replace(/^["“\s]+|["”\s]+$/g, '').trim();
  const tokens = tokenizePoeticLine(clean);

  return tokens.map((token, idx) => {
    if (token.isGilded) {
      return (
        <span
          key={idx}
          className="font-bold inline-block"
          style={{
            color: '#FCE182',
            textShadow: '0 1px 2px #06070E, 0 0 6px rgba(252, 225, 130, 0.28)',
          }}>
          {token.text}
        </span>
      );
    }
    return (
      <span
        key={idx}
        style={{
          color: '#EAE0D0',
          textShadow: '0 1px 2px #06070E',
        }}>
        {token.text}
      </span>
    );
  });
}

// ----------------------------------------------------------------------------
// POETIC SPEAKER AURA (DIGNIFIED, SUBTLE, ORGANIC LITERARY RESONANCE)
// Spring: quiet soft petal-pale / gentle sage breath (rgba(164, 214, 154, 0.28))
// Summer: warm amber-honey dusk glow (rgba(240, 192, 98, 0.25))
// Autumn: deep quiet russet / cider ember glow (rgba(217, 131, 76, 0.25))
// Winter: calm frosted starlight / quiet mist whisper (rgba(176, 206, 235, 0.25))
// ----------------------------------------------------------------------------
export const getPoetSeasonalAuraColor = (season: SeasonType) => {
  switch (season) {
    case 'SPRING':
      return { r: 164, g: 214, b: 154, baseAlpha: 0.28 };
    case 'SUMMER':
      return { r: 240, g: 192, b: 98, baseAlpha: 0.25 };
    case 'AUTUMN':
      return { r: 217, g: 131, b: 76, baseAlpha: 0.25 };
    case 'WINTER':
      return { r: 176, g: 206, b: 235, baseAlpha: 0.25 };
    default:
      return { r: 252, g: 225, b: 130, baseAlpha: 0.25 };
  }
};

export const drawPoeticSpeakerAura = (
  ctx: CanvasRenderingContext2D,
  platX: number,
  platY: number,
  bustX: number,
  bustY: number,
  season: SeasonType,
  alphaMultiplier: number,
  scaleMultiplier: number,
) => {
  const { r, g, b, baseAlpha } = getPoetSeasonalAuraColor(season);
  const alpha = baseAlpha * alphaMultiplier;
  if (alpha <= 0.005) return;

  ctx.save();
  if (typeof ctx.filter === 'string') {
    ctx.filter = 'blur(12px)';
  }

  // 1. Gentle, soft breathing bloom at the speaker's pedestal base
  ctx.save();
  ctx.translate(platX, platY);
  ctx.scale(1.0 * scaleMultiplier, 0.32 * scaleMultiplier);
  const platRadius = 114;
  const platGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, platRadius);
  platGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(1, alpha * 1.55)})`);
  platGrad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha})`);
  platGrad.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
  platGrad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = platGrad;
  ctx.beginPath();
  ctx.arc(0, 0, platRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Subtle soft radial breath bloom underneath their bust
  ctx.save();
  ctx.translate(bustX, bustY);
  ctx.scale(1.0 * scaleMultiplier, 0.85 * scaleMultiplier);
  const bustRadius = 88;
  const bustGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, bustRadius);
  bustGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.95})`);
  bustGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.38})`);
  bustGrad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = bustGrad;
  ctx.beginPath();
  ctx.arc(0, 0, bustRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
};

// Engine-Rendered Dynamic Retro Pixel Title Typography Component
function PocketPoetsTitleBanner() {
  return (
    <div
      className="flex flex-col items-center justify-center select-none py-0 px-2 relative w-full"
      style={{ transform: 'translateY(-8px)' }}>
      {/* Main Title: POCKET POETS in Press Start 2P with gold gradient & hard stepped pixel 3D extrusion */}
      <h1
        className="text-center font-black select-none text-2xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-[4px]"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          letterSpacing: '4px',
          color: '#FFE89E',
          textShadow:
            '0 4px 0 #B8860B, 0 8px 0 #14182E, 4px 0 0 #14182E, -4px 0 0 #14182E, 0 -4px 0 #14182E',
        }}>
        POCKET POETS
      </h1>

      {/* Literary Subtitle in VT323 with crisp pixel drop shadow */}
      <div
        className="relative mt-2.5 sm:mt-3 z-20 flex items-center justify-center text-xl sm:text-2xl md:text-[26px] text-[#FEF08A] select-none font-normal"
        style={{
          fontFamily: "'VT323', monospace",
          letterSpacing: '2px',
          textShadow:
            '0 2px 0 #0D0E17, 2px 2px 0 #0D0E17, -2px 2px 0 #0D0E17, 0 -2px 0 #0D0E17',
        }}>
        ✦ Climbing Mount Parnassus ✦
      </div>
    </div>
  );
}

function PlayerLivePreview({
  customization,
  direction = 'DOWN',
  walkFrame = 0,
  scale = 4,
  className = '',
}: {
  customization: PlayerCustomization;
  direction?: FacingDirection;
  walkFrame?: number;
  scale?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 16 * scale;
  const height = 24 * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    drawPlayerPreview(ctx, width, height, customization, direction, walkFrame);
  }, [customization, direction, walkFrame, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
}

function PoetPixelAvatar({
  poet,
  size = 48,
  isBack = false,
  className = '',
  imageAsset,
  facingLeft = false,
}: {
  poet: PoetData;
  size?: number;
  isBack?: boolean;
  className?: string;
  imageAsset?: HTMLImageElement | null;
  facingLeft?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    drawPoetPortrait(ctx, poet, 0, 0, size, isBack, imageAsset, facingLeft);
  }, [poet, size, isBack, imageAsset, facingLeft]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`block shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}

const ASSETS_MANIFEST: Record<string, string> = {
  poet_emily_dickinson: 'assets/images/poet_emily_dickinson.png',
  poet_edgar_allan_poe: 'assets/images/poet_edgar_allan_poe.png',
  poet_walt_whitman: 'assets/images/poet_walt_whitman.png',
  poet_william_blake: 'assets/images/poet_william_blake.png',
  poet_robert_frost: 'assets/images/poet_robert_frost.png',
  poet_langston_hughes: 'assets/images/poet_langston_hughes.png',
  poet_sylvia_plath: 'assets/images/poet_sylvia_plath.png',
  poet_william_shakespeare: 'assets/images/poet_william_shakespeare.png',
  poet_rumi: 'assets/images/poet_rumi.png',
  poet_matsuo_basho: 'assets/images/poet_matsuo_basho.png',
  poet_sappho: 'assets/images/poet_sappho.png',
  poet_dante_alighieri: 'assets/images/poet_dante_alighieri.png',
  poet_maya_angelou: 'assets/images/poet_maya_angelou.png',
  poet_pablo_neruda: 'assets/images/poet_pablo_neruda.png',
  poet_li_bai: 'assets/images/poet_li_bai.png',
  poet_sor_juana: 'assets/images/poet_sor_juana.png',
  poet_rabindranath_tagore: 'assets/images/poet_rabindranath_tagore.png',
  poet_mahmoud_darwish: 'assets/images/poet_mahmoud_darwish.png',
  poet_anna_akhmatova: 'assets/images/poet_anna_akhmatova.png',
  poet_charles_baudelaire: 'assets/images/poet_charles_baudelaire.png',
  poet_mary_oliver: 'assets/images/poet_mary_oliver.png',
  poet_charles_bukowski: 'assets/images/poet_charles_bukowski.png',
  poet_federico_garcia_lorca: 'assets/images/poet_federico_garcia_lorca.png',
  poet_john_keats: 'assets/images/poet_john_keats.png',
  muse_calliope: 'assets/images/muse_calliope.png',
  battle_background: 'assets/images/battle_background.png',
  battle_platform_player: 'assets/images/battle_platform_player.png',
  battle_platform_enemy: 'assets/images/battle_platform_enemy.png',
  item_capture_book: 'assets/images/item_capture_book.png',
  icon_quill: 'assets/images/icon_quill.png',
  spell_hope_feathers: 'assets/images/spell_hope_feathers.png',
  spell_death_carriage: 'assets/images/spell_death_carriage.png',
  spell_nobody_mask: 'assets/images/spell_nobody_mask.png',
  spell_wild_tempest: 'assets/images/spell_wild_tempest.png',
  spell_the_raven: 'assets/images/spell_the_raven.png',
  spell_telltale_heart: 'assets/images/spell_telltale_heart.png',
  spell_annabel_sea: 'assets/images/spell_annabel_sea.png',
  spell_the_bells: 'assets/images/spell_the_bells.png',
  bg_poe_study: 'assets/images/bg_poe_study.png',
  bg_basho_grove: 'assets/images/bg_basho_grove.png',
  bg_shakespeare_globe: 'assets/images/bg_shakespeare_globe.png',
  bg_dickinson_solarium: 'assets/images/bg_dickinson_solarium.png',
  bg_plath_study: 'assets/images/bg_plath_study.png',
  bg_frost_woods: 'assets/images/bg_frost_woods.png',
  bg_rumi_courtyard: 'assets/images/bg_rumi_courtyard.png',
  bg_angelou_sanctuary: 'assets/images/bg_angelou_sanctuary.png',
};

const triggerHaptics = (pattern: number | number[]) => {
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function' &&
    Boolean(navigator.userActivation?.hasBeenActive)
  ) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore
    }
  }
};

export interface FloatingCombatText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  vy: number;
}

export type BagItemId =
  | 'BLANK_BOOK'
  | 'MASTER_MANUSCRIPT'
  | 'BLACK_INK_ELIXIR'
  | 'INSPIRATION_TEA'
  | 'LAUREL_REVIVAL_SCROLL';

export interface BagItem {
  id: BagItemId;
  name: string;
  desc: string;
  category: 'CAPTURE' | 'SUPPORT';
  count: number;
  icon: string;
  spriteKey?: string;
}

export const INITIAL_BAG_INVENTORY: BagItem[] = [
  {
    id: 'BLANK_BOOK',
    name: 'BLANK ANTHOLOGY BOOK',
    desc: 'Capture Action: Captures a wild poet if health is <= 25% (or <= 35% when Lost for Words). Costs a turn.',
    category: 'CAPTURE',
    count: 10,
    icon: '📖',
    spriteKey: 'item_capture_book',
  },
  {
    id: 'BLACK_INK_ELIXIR',
    name: 'BLACK INK ELIXIR',
    desc: 'Support Item: Restores +40 HP to your active poet (costs a turn).',
    category: 'SUPPORT',
    count: 3,
    icon: '🧪',
    spriteKey: 'item_capture_book',
  },
  {
    id: 'INSPIRATION_TEA',
    name: 'INSPIRATION TEA',
    desc: 'Support Item: Restores +1 Reading to each of your moves (costs a turn).',
    category: 'SUPPORT',
    count: 2,
    icon: '🍵',
    spriteKey: 'item_capture_book',
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'sparkle' | 'gold_star';
  rotation?: number;
  vRot?: number;
}

interface VisualEffectState {
  active: boolean;
  type: string;
  spriteKey?: string;
  timer: number;
  duration: number;
  isPlayerAttacking: boolean;
  resolved: boolean;
  isMasterpiece?: boolean;
}

interface BookAnimation {
  active: boolean;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  progress: number;
  phase: 'FLYING' | 'WOBBLE_1' | 'WOBBLE_2' | 'WOBBLE_3' | 'CAPTURED' | 'FAILED';
  wobbleTimer: number;
  wobbleAngle: number;
  success: boolean;
  spriteKey: string;
  itemName: string;
}

type TurnStage =
  | 'INTRO_APPEAR'
  | 'INTRO_SEND_OUT'
  | 'ACTIONS'
  | 'FIGHT_MOVES'
  | 'BAG_MENU'
  | 'MASTERPIECE_CINEMATIC'
  | 'MOVE_ANIMATING'
  | 'MOVE_VERSE'
  | 'MOVE_OUTCOME'
  | 'ENEMY_ANIMATING'
  | 'ENEMY_VERSE'
  | 'ENEMY_OUTCOME'
  | 'TURN_STATUS_PROCESS'
  | 'POET_INFO'
  | 'RUN_ATTEMPT';

export type AppScreen =
  | 'TITLE'
  | 'OPENING_SCENE'
  | 'NAME_ENTRY'
  | 'GRAND_TOUR_MAP'
  | 'FREE_DUEL_SELECT'
  | 'ANTHOLOGY'
  | 'BATTLE'
  | 'OVERWORLD';

export type GameMode = 'GRAND_TOUR' | 'FREE_DUEL' | 'CLIMB';

export const OPENING_SCENE_DIALOGUE: { speaker: string | null; text: string }[] = [
  {
    speaker: null,
    text: 'THE STARRY EMPYREAN.',
  },
  {
    speaker: 'SAPPHO',
    text: "I'll say it again. The best season for a poem is spring. Everything starts. Nothing's been ruined yet.",
  },
  {
    speaker: 'SAPPHO',
    text: '"Spring\'s messenger, the sweet-voiced nightingale."',
  },
  {
    speaker: 'SHAKESPEARE',
    text: 'Spring doesn\'t last long enough to write about. "Rough winds do shake the darling buds of May, and summer\'s lease hath all too short a date."',
  },
  {
    speaker: 'SHAKESPEARE',
    text: "Summer's the one you compare people to.",
  },
  {
    speaker: 'SAPPHO',
    text: "And summer's over by August.",
  },
  {
    speaker: 'KEATS',
    text: 'You\'re both arguing about the beginning. The poem is what\'s left after. "Season of mists and mellow fruitfulness."',
  },
  {
    speaker: 'KEATS',
    text: '"Where are the songs of Spring? Ay, where are they? Think not of them, thou hast thy music too."',
  },
  {
    speaker: 'DANTE',
    text: 'Winter. The rest is weather.',
  },
  {
    speaker: 'DANTE',
    text: 'You want the truth of a thing, take everything off it. The bottom of Hell is ice.',
  },
  {
    speaker: 'SHAKESPEARE',
    text: "We've been at this a long time.",
  },
  {
    speaker: 'DANTE',
    text: "We'll be at it longer.",
  },
  {
    speaker: 'WHITMAN',
    text: 'Why not ask the reader?',
  },
];



export const SEASON_EPIGRAPHS: Record<SeasonType, string> = {
  SPRING: "Nothing's been ruined yet.",
  SUMMER: "It's the one you compare people to.",
  AUTUMN: "It's what's left after.",
  WINTER: "The rest is weather.",
};

export const CREDITS_LINES: string[] = [
  'POCKET POETS',
  '',
  'for the Reader',
  '',
  'THE HARBOR',
  'Whitman',
  'Mary Oliver',
  'Darwish',
  'Walcott',
  'Cavafy',
  'Senghor',
  '',
  'THE TOWN',
  'Rumi',
  'Langston Hughes',
  'Yeats',
  'Pessoa',
  'Dunbar',
  'Baudelaire',
  'Dylan Thomas',
  'Millay',
  'Chaucer',
  'Rimbaud',
  "O'Hara",
  'Williams',
  'Stevens',
  'Eliot',
  'Brooks',
  'Emily Dickinson',
  '',
  'THE CLIFFS',
  'Lorca',
  'Blake',
  'Neruda',
  'Angelou',
  'Hopkins',
  'Gibran',
  'Catherine Blake',
  'Cummings',
  'Bishop',
  '',
  'THE RUINS',
  'Li Bai',
  'Bashō',
  'Bukowski',
  'Sor Juana',
  'Akhmatova',
  'Khayyam',
  'Ginsberg',
  'Larkin',
  'Housman',
  'Rossetti',
  'Tagore',
  'Li Qingzhao',
  '',
  'THE TREELINE',
  'Frost',
  'Plath',
  'Poe',
  'Donne',
  'Coleridge',
  'Audre Lorde',
  '',
  'THE SUMMIT',
  'Sappho',
  'Shakespeare',
  'Keats',
  'Dante',
  'Milton',
  '',
  'and you',
  '',
];

export const CANTO_CARDS: Record<string, string> = {
  HARBOR: 'CANTO I: THE HARBOR — THE FOOT OF PARNASSUS',
  TOWN: 'CANTO II: THE TOWN',
  CLIFFS: 'CANTO III: THE CLIFFS',
  RUINS: 'CANTO IV: THE RUINS',
  TREELINE: 'CANTO V: THE TREELINE',
  SUMMIT: 'CANTO VI: THE SUMMIT',
};

export const GRAND_TOUR_ROSTER: string[] = [
  'MARY_OLIVER',
  'HUGHES',
  'WHITMAN',
  'RUMI',
  'NERUDA',
  'LORCA',
  'ANGELOU',
  'BLAKE',
  'BASHO',
  'LI_BAI',
  'SOR_JUANA',
  'BUKOWSKI',
  'FROST',
  'DICKINSON',
  'POE',
  'PLATH',
  'SAPPHO',
  'SHAKESPEARE',
  'KEATS',
  'DANTE',
];

// What is kept of a climb between visits.
interface ClimbSave {
  v: 1;
  name: string;
  custom: PlayerCustomization | null;
  captured: string[];
  lineup: string[];
  active: string;
  pos: { screen: string; x: number; y: number } | null;
  visited: string[];
}
const CLIMB_SAVE_KEY = 'poetmon_climb_save';
function readClimbSave(): ClimbSave | null {
  try {
    const raw = localStorage.getItem(CLIMB_SAVE_KEY);
    if (!raw) return null;
    const save = JSON.parse(raw) as ClimbSave;
    if (!save || save.v !== 1 || !Array.isArray(save.captured) || !Array.isArray(save.lineup)) return null;
    return save;
  } catch {
    return null;
  }
}
function clearClimbSave(): void {
  try {
    localStorage.removeItem(CLIMB_SAVE_KEY);
  } catch {
    // ignore
  }
}

export interface TitleMenuItem {
  id: string;
  label: string;
  description: string;
}

export const TITLE_MENU_ITEMS: TitleMenuItem[] = [
  {
    id: 'BEGIN',
    label: 'BEGIN',
    description: 'Ascend Mount Parnassus',
  },
  {
    id: 'BATTLE',
    label: 'BATTLE',
    description: '1v1 Poetic Duels',
  },
  {
    id: 'ANTHOLOGY',
    label: 'ANTHOLOGY',
    description: 'The Immortal Anthology',
  },
  {
    id: 'NEW_CLIMB',
    label: 'NEW CLIMB',
    description: 'Start over from the Harbor',
  },
];

const createInitialReadingsForPoet = (poet: PoetData): Record<string, number> => {
  const readings: Record<string, number> = {};
  for (const move of poet.moves) {
    readings[move.id] = move.maxReadings;
  }
  return readings;
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepperRef = useRef<ReturnType<typeof createFixedStepper>>();
  const lastCancelRef = useRef(false);
  const lastConfirmRef = useRef(false);
  const lastUpRef = useRef(false);
  const lastDownRef = useRef(false);
  const lastLeftRef = useRef(false);
  const lastRightRef = useRef(false);
  const isMobile = useIsMobile();

  const {sdk, isReady} = usePlayground();
  const {assets, isReady: assetsReady} = useAssets(ASSETS_MANIFEST);
  void isReady;

  const canvasWidth = 640;
  const canvasHeight = 360;

  if (!stepperRef.current) {
    const stepMs = getConfig('stepMs');
    const maxSubSteps = getConfig('maxSubSteps');
    stepperRef.current = createFixedStepper(stepMs, maxSubSteps);
  }

  // --- SCREEN & MODE STATE ---
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('TITLE');
  const currentScreenRef = useRef<AppScreen>('TITLE');
  currentScreenRef.current = currentScreen;
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('GRAND_TOUR');
  const [playerName, setPlayerName] = useState<string>('');
  const trimmedReaderName = playerName?.trim() ?? '';
  const displayReaderName =
    !trimmedReaderName || trimmedReaderName.toLowerCase() === 'reader'
      ? 'THE READER'
      : trimmedReaderName.toUpperCase();
  const [hasStartedClimb, setHasStartedClimb] = useState<boolean>(false);

  // Title Menu State
  const [titleMenuIndex, setTitleMenuIndex] = useState<number>(0);
  const titleMenuIndexRef = useRef<number>(0);
  titleMenuIndexRef.current = titleMenuIndex;

  // THE SAVED CLIMB. The anthology, lineup and the last door walked through are kept
  // in the browser, so closing the tab does not lose the climb. CONTINUE on the title
  // picks it up; NEW CLIMB throws it away and starts again.
  const [hasSavedClimb, setHasSavedClimb] = useState<boolean>(() => readClimbSave() !== null);
  const resumeSavedClimbRef = useRef<(save: ClimbSave) => void>(() => {});

  const activateTitleOption = useCallback(
    (index: number) => {
      gameAudio.playConfirmSelect();
      triggerHaptics(40);
      if (index === 3) {
        // NEW CLIMB: forget the saved climb and play the opening
        clearClimbSave();
        setHasSavedClimb(false);
        setHasStartedClimb(false);
        setOpeningSceneIndex(0);
        setIsSlideDissolving(false);
        setIsInBlackWait(false);
        setSlideRevealKey((k) => k + 1);
        soundtrackEngine.setPrologueSlide(0);
        setCurrentScreen('OPENING_SCENE');
        return;
      }
      const savedClimb = !hasStartedClimb ? readClimbSave() : null;
      if (index === 0 && savedClimb) {
        resumeSavedClimbRef.current(savedClimb);
        return;
      }
      if (index === 0) {
        if (hasStartedClimb) {
          soundtrackEngine.setDucking(false);
          void soundtrackEngine.switchRoom(activeOverworldScreenRef.current, false);
          setCurrentScreen('OVERWORLD');
        } else {
          setOpeningSceneIndex(0);
          setIsSlideDissolving(false);
          setIsInBlackWait(false);
          setSlideRevealKey((k) => k + 1);
          soundtrackEngine.setPrologueSlide(0);
          setCurrentScreen('OPENING_SCENE');
        }
      } else if (index === 1) {
        setSelectedGameMode('FREE_DUEL');
        setCurrentScreen('FREE_DUEL_SELECT');
      } else if (index === 2) {
        setCurrentScreen('ANTHOLOGY');
      }
    },
    [hasStartedClimb],
  );

  // Opening Scene & Name Entry State
  const [openingSceneIndex, setOpeningSceneIndex] = useState<number>(0);
  const [isOpeningBlackout, setIsOpeningBlackout] = useState<boolean>(false);
  const [isSlideDissolving, setIsSlideDissolving] = useState<boolean>(false);
  const [isInBlackWait, setIsInBlackWait] = useState<boolean>(false);
  const [slideRevealKey, setSlideRevealKey] = useState<number>(0);
  const isAdvancingPrologueRef = useRef<boolean>(false);

  const [skipHoldProgress, setSkipHoldProgress] = useState<number>(0);
  const isHoldingSkipRef = useRef<boolean>(false);
  const isButtonHoldingSkipRef = useRef<boolean>(false);
  const skipHoldStartRef = useRef<number | null>(null);

  const [nameInput, setNameInput] = useState<string>('');
  const [playerCustom, setPlayerCustom] = useState<PlayerCustomization>(DEFAULT_PLAYER_CUSTOMIZATION);
  const [previewDir, setPreviewDir] = useState<FacingDirection>('DOWN');
  const [previewWalkFrame, setPreviewWalkFrame] = useState<number>(0);
  const [isPreviewWalking, setIsPreviewWalking] = useState<boolean>(false);
  const [isSpriteHopping, setIsSpriteHopping] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Cinematic Arrival State (Screen 1: The Harbor sequence)
  const [isCinematicLocked, setIsCinematicLocked] = useState<boolean>(false);
  const [isCinematicHudVisible, setIsCinematicHudVisible] = useState<boolean>(true);
  const [cinematicCurtainAlpha, setCinematicCurtainAlpha] = useState<number>(0);

  // 6-Canto Chapter Card System State
  const [visitedCantos, setVisitedCantos] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('poetmon_visited_cantos');
        if (saved) {
          return new Set(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }
    return new Set<string>();
  });
  const visitedCantosRef = useRef<Set<string>>(visitedCantos);
  visitedCantosRef.current = visitedCantos;

  // Screens reached during the current climb. Unlike visitedCantos (which is saved
  // forever and only decides when chapter cards show), this starts over with each new game.
  const climbVisitedScreensRef = useRef<Set<string>>(new Set(['HARBOR']));
  const climbSavePosRef = useRef<{ screen: string; x: number; y: number } | null>(null);
  const [climbSaveTick, setClimbSaveTick] = useState(0);
  const climbSaveReadyRef = useRef(false);

  const [cantoCardText, setCantoCardText] = useState<string>('CANTO I: THE HARBOR — THE FOOT OF PARNASSUS');
  const [isCantoCardVisible, setIsCantoCardVisible] = useState<boolean>(false);
  const cantoTimerRef = useRef<number | null>(null);

  const triggerCantoCard = useCallback((cantoKey: string, isArrival = false) => {
    const cardTitle = CANTO_CARDS[cantoKey] || cantoKey;
    setCantoCardText(cardTitle);
    setIsCantoCardVisible(true);

    setVisitedCantos((prev) => {
      const next = new Set(prev);
      next.add(cantoKey);
      try {
        localStorage.setItem('poetmon_visited_cantos', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });

    // Replenish Blank Books on entering new Canto so player has at least 3 books
    setBagInventory((prev) =>
      prev.map((item) =>
        item.id === 'BLANK_BOOK' ? { ...item, count: Math.max(3, item.count) } : item,
      ),
    );

    // Gentle, unpiercing audio cue for chapter cards
    gameAudio.playCantoCardChime();

    if (cantoTimerRef.current) {
      clearTimeout(cantoTimerRef.current);
    }

    cantoTimerRef.current = window.setTimeout(() => {
      setIsCantoCardVisible(false);
      setIsCinematicHudVisible(true);
      setIsCinematicLocked(false);
    }, 2800);
  }, []);

  // Transition Curtain State (Zero-Flicker Handshake)
  const [isHandshakeCurtainActive, setIsHandshakeCurtainActive] = useState<boolean>(false);
  const [handshakeCurtainStyle, setHandshakeCurtainStyle] = useState<React.CSSProperties>({
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 300ms ease-out',
  });

  useEffect(() => {
    if (currentScreen !== 'NAME_ENTRY' || !isPreviewWalking) {
      setPreviewWalkFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setPreviewWalkFrame((prev) => (prev + 1) % 4);
    }, 280);
    return () => clearInterval(interval);
  }, [currentScreen, isPreviewWalking]);

  // Smooth Screen & Battle Curtain Transitions
  const [screenCurtainAlpha, setScreenCurtainAlpha] = useState<number>(1);
  const [curtainTransitionDuration, setCurtainTransitionDuration] = useState<string>('300ms ease-out');
  const [isTransitioningScreen, setIsTransitioningScreen] = useState<boolean>(false);
  const isTransitioningScreenRef = useRef<boolean>(false);

  // Anthology & Progress State
  const [capturedPoetIds, setCapturedPoetIds] = useState<string[]>([
    'MARY_OLIVER',
    'DICKINSON',
  ]);
  const [playerLineup, setPlayerLineup] = useState<string[]>([
    'MARY_OLIVER',
    'DICKINSON',
  ]);
  const [activePlayerPoetId, setActivePlayerPoetId] = useState<string>('MARY_OLIVER');
  const [activeEnemyPoetId, setActiveEnemyPoetId] = useState<string>('HUGHES');
  const [activeArenaId, setActiveArenaId] = useState<string>('MISTY_BAMBOO_GROVE');
  const activeArenaRef = useRef<PoetArenaStage>(POET_ARENAS[0]);

  // Grand Tour Progress
  const [grandTourCurrentIndex, setGrandTourCurrentIndex] = useState<number>(0);
  const [grandTourMaxUnlocked, setGrandTourMaxUnlocked] = useState<number>(0);

  // --- THE ENDING & POST-GAME STATE ---
  const [hasLaurel, setHasLaurel] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('poetmon_has_laurel');
        if (saved !== null) {
          const val = saved === 'true';
          setHarborPlayerHasLaurel(val);
          return val;
        }
      } catch {
        // ignore
      }
    }
    return false;
  });

  const [postGameSeason, setPostGameSeason] = useState<SeasonType | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('poetmon_postgame_season');
        if (saved) return saved as SeasonType;
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [isSpringMenuOpen, setIsSpringMenuOpen] = useState<boolean>(false);
  const [selectedSpringPoetIndex, setSelectedSpringPoetIndex] = useState<number>(0);
  const selectedSpringPoetIndexRef = useRef<number>(0);
  selectedSpringPoetIndexRef.current = selectedSpringPoetIndex;

  const [springPoetStanding, setSpringPoetStanding] = useState<{ poetId: string; facing: FacingDirection } | null>(null);
  const [chosenEndingPoetId, setChosenEndingPoetId] = useState<string | null>(null);

  type EndingStage =
    | 'IDLE'
    | 'READING_TRANSITION'
    | 'POEM_TITLE'
    | 'SEASON_EPIGRAPH'
    | 'WHITMAN_LINE'
    | 'BLACKOUT_WAIT'
    | 'LAUREL_REVEAL'
    | 'CREDITS';

  const [endingStage, setEndingStage] = useState<EndingStage>('IDLE');
  const endingStageRef = useRef<EndingStage>('IDLE');
  endingStageRef.current = endingStage;

  const [endingTransitionProgress, setEndingTransitionProgress] = useState<number>(0);
  const [creditsScrollY, setCreditsScrollY] = useState<number>(0);

  // Free Duel Setup State
  const [freeDuelPlayerId, setFreeDuelPlayerId] = useState<string>('MARY_OLIVER');
  const [freeDuelEnemyId, setFreeDuelEnemyId] = useState<string>('HUGHES');
  const [freeDuelDifficulty, setFreeDuelDifficulty] = useState<'NOVICE' | 'SCHOLAR' | 'MASTER'>('SCHOLAR');
  const [freeDuelArenaId, setFreeDuelArenaId] = useState<string>('GLOBE_THEATRE_STAGE');

  // Anthology Inspection State
  const [inspectedAnthologyPoetId, setInspectedAnthologyPoetId] = useState<string>('MARY_OLIVER');
  const [anthologyFilterSeason, setAnthologyFilterSeason] = useState<SeasonType | 'ALL'>('ALL');

  // Audio & Settings State
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const isOptionsMenuOpenRef = useRef(false);
  isOptionsMenuOpenRef.current = isOptionsMenuOpen;
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('poetmon_music_muted');
        if (saved !== null) return saved === 'true';
      } catch {
        // ignore
      }
    }
    return false;
  });
  const [isSfxMuted, setIsSfxMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('poetmon_sfx_muted');
        if (saved !== null) return saved === 'true';
      } catch {
        // ignore
      }
    }
    return false;
  });

  // One mute for the whole game. The mute button and the M key silence the music
  // AND every sound effect; sound effects follow the same switch as the music.
  useEffect(() => {
    gameAudio.setMuted(isMusicMuted);
  }, [isMusicMuted]);

  const toggleMusicMute = useCallback(() => {
    setIsMusicMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('poetmon_music_muted', String(next));
        localStorage.setItem('poetmon_sfx_muted', String(next));
      } catch {
        // ignore
      }
      soundtrackEngine.setMuted(next);
      gameAudio.setMuted(next);
      return next;
    });
  }, []);

  const toggleSfxMute = useCallback(() => {
    setIsSfxMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('poetmon_sfx_muted', String(next));
      } catch {
        // ignore
      }
      gameAudio.setMuted(next);
      return next;
    });
  }, []);

  // --- GAME LIFECYCLE ---
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    score: 0,
    level: 1,
  });

  const playerPoet = getPoetById(activePlayerPoetId || 'MARY_OLIVER');
  const enemyPoet = getPoetById(activeEnemyPoetId || 'HUGHES');
  const playerPoetRef = useRef<PoetData>(playerPoet);
  playerPoetRef.current = playerPoet;
  const enemyPoetRef = useRef<PoetData>(enemyPoet);
  enemyPoetRef.current = enemyPoet;

  // Turn Progression & Pacing
  const [turnStage, setTurnStage] = useState<TurnStage>('INTRO_APPEAR');
  const turnStageRef = useRef<TurnStage>('INTRO_APPEAR');
  turnStageRef.current = turnStage;

  const [preBattleDialogueIndex, setPreBattleDialogueIndex] = useState<number>(0);
  const preBattleDialogueIndexRef = useRef<number>(0);
  preBattleDialogueIndexRef.current = preBattleDialogueIndex;

  // Battle Menu Cursor Positions
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number>(0);
  const [selectedBagIndex, setSelectedBagIndex] = useState<number>(0);
  const selectedActionIndexRef = useRef(0);
  selectedActionIndexRef.current = selectedActionIndex;
  const selectedMoveIndexRef = useRef(0);
  selectedMoveIndexRef.current = selectedMoveIndex;
  const selectedBagIndexRef = useRef(0);
  selectedBagIndexRef.current = selectedBagIndex;

  // Bag Inventory
  const [bagInventory, setBagInventory] = useState<BagItem[]>(INITIAL_BAG_INVENTORY);
  const [activeMove, setActiveMove] = useState<PoemMove | null>(null);
  const activeMoveRef = useRef<PoemMove | null>(null);
  activeMoveRef.current = activeMove;

  // Progressive Poem Recitation State
  const [moveUsageMap, setMoveUsageMap] = useState<Record<string, number>>({});
  const moveUsageMapRef = useRef<Record<string, number>>({});
  moveUsageMapRef.current = moveUsageMap;
  const [activeVerseStanza, setActiveVerseStanza] = useState<string[]>([]);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState<number>(0);
  const verseStartTimeRef = useRef<number>(0);
  const verseAnimTimerRef = useRef<number>(0);
  const verseBypassedRef = useRef<boolean>(false);
  const [isVerseBypassed, setIsVerseBypassed] = useState<boolean>(false);

  // Dialogue lines & typewriter
  const [dialogueLines, setDialogueLines] = useState<string[]>([
    `${enemyPoet.name.toUpperCase()} steps`,
    'forth to duel!',
  ]);
  const [displayedChars, setDisplayedChars] = useState<number>(999);
  const [outcomeNarration, setOutcomeNarration] = useState<string>('');

  // HP, Fixed Max HP
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(100);
  const [enemyMaxHp, setEnemyMaxHp] = useState<number>(100);

  // Per-Poet Move Readings State
  const [poetReadingsMap, setPoetReadingsMap] = useState<Record<string, Record<string, number>>>({});
  const poetReadingsMapRef = useRef<Record<string, Record<string, number>>>({});
  poetReadingsMapRef.current = poetReadingsMap;

  // Per-Poet Lineup HP State for Gauntlet Consecutive Health
  const [lineupHpMap, setLineupHpMap] = useState<Record<string, number>>({});
  const lineupHpMapRef = useRef<Record<string, number>>({});
  lineupHpMapRef.current = lineupHpMap;

  const [enemyReadings, setEnemyReadings] = useState<Record<string, number>>({});
  const enemyReadingsRef = useRef<Record<string, number>>({});
  enemyReadingsRef.current = enemyReadings;

  // Battle Combat Modifiers
  const [playerBuffActive, setPlayerBuffActive] = useState<boolean>(false);
  const playerBuffActiveRef = useRef<boolean>(false);
  playerBuffActiveRef.current = playerBuffActive;

  const [enemyBuffActive, setEnemyBuffActive] = useState<boolean>(false);
  const enemyBuffActiveRef = useRef<boolean>(false);
  enemyBuffActiveRef.current = enemyBuffActive;

  const [playerDebuffActive, setPlayerDebuffActive] = useState<boolean>(false);
  const playerDebuffActiveRef = useRef<boolean>(false);
  playerDebuffActiveRef.current = playerDebuffActive;

  const [enemyDebuffActive, setEnemyDebuffActive] = useState<boolean>(false);
  const enemyDebuffActiveRef = useRef<boolean>(false);
  enemyDebuffActiveRef.current = enemyDebuffActive;

  const [playerLostForWords, setPlayerLostForWords] = useState<boolean>(false);
  const playerLostForWordsRef = useRef<boolean>(false);
  playerLostForWordsRef.current = playerLostForWords;

  const [enemyLostForWords, setEnemyLostForWords] = useState<boolean>(false);
  const enemyLostForWordsRef = useRef<boolean>(false);
  enemyLostForWordsRef.current = enemyLostForWords;

  const [playerBuffTurns, setPlayerBuffTurns] = useState<number>(0);
  const playerBuffTurnsRef = useRef<number>(0);
  playerBuffTurnsRef.current = playerBuffTurns;

  const [enemyBuffTurns, setEnemyBuffTurns] = useState<number>(0);
  const enemyBuffTurnsRef = useRef<number>(0);
  enemyBuffTurnsRef.current = enemyBuffTurns;

  const [playerDebuffTurns, setPlayerDebuffTurns] = useState<number>(0);
  const playerDebuffTurnsRef = useRef<number>(0);
  playerDebuffTurnsRef.current = playerDebuffTurns;

  const [enemyDebuffTurns, setEnemyDebuffTurns] = useState<number>(0);
  const enemyDebuffTurnsRef = useRef<number>(0);
  enemyDebuffTurnsRef.current = enemyDebuffTurns;

  const [playerStatusImmune, setPlayerStatusImmune] = useState<boolean>(false);
  const playerStatusImmuneRef = useRef<boolean>(false);
  playerStatusImmuneRef.current = playerStatusImmune;

  const [enemyStatusImmune, setEnemyStatusImmune] = useState<boolean>(false);
  const enemyStatusImmuneRef = useRef<boolean>(false);
  enemyStatusImmuneRef.current = enemyStatusImmune;

  // Token-based "Exactly 1 Skipped Action" Stun State
  const [playerStunTokens, setPlayerStunTokens] = useState<number>(0);
  const playerStunTokensRef = useRef<number>(0);
  playerStunTokensRef.current = playerStunTokens;

  const [playerStunImmuneTurns, setPlayerStunImmuneTurns] = useState<number>(0);
  const playerStunImmuneTurnsRef = useRef<number>(0);
  playerStunImmuneTurnsRef.current = playerStunImmuneTurns;

  const playerJustGainedImmunityThisRoundRef = useRef<boolean>(false);

  const [enemyStunTokens, setEnemyStunTokens] = useState<number>(0);
  const enemyStunTokensRef = useRef<number>(0);
  enemyStunTokensRef.current = enemyStunTokens;

  const [enemyStunImmuneTurns, setEnemyStunImmuneTurns] = useState<number>(0);
  const enemyStunImmuneTurnsRef = useRef<number>(0);
  enemyStunImmuneTurnsRef.current = enemyStunImmuneTurns;

  const enemyJustGainedImmunityThisRoundRef = useRef<boolean>(false);

  // Capture Window & Anti-Spam Guardrail refs
  const [enemySkippedByStunThisRound, setEnemySkippedByStunThisRound] = useState<boolean>(false);
  const enemySkippedByStunThisRoundRef = useRef<boolean>(false);
  enemySkippedByStunThisRoundRef.current = enemySkippedByStunThisRound;

  const enemyUsedStatusLastRoundRef = useRef<boolean>(false);
  const enemyUsedStatusThisRoundRef = useRef<boolean>(false);

  // Pre-turn Enemy Intent Telegraph state & refs
  const [enemyIntentMove, setEnemyIntentMove] = useState<PoemMove | null>(null);
  const enemyIntentMoveRef = useRef<PoemMove | null>(null);
  enemyIntentMoveRef.current = enemyIntentMove;

  const battleTurnCountRef = useRef<number>(1);
  const queuedPlayerMoveRef = useRef<PoemMove | null>(null);
  const isEnemyLeadingTurnRef = useRef<boolean>(false);

  // Lineup tracking
  const playerLineupRef = useRef<string[]>(playerLineup);
  playerLineupRef.current = playerLineup;
  const activeLineupIndexRef = useRef<number>(0);

  const [captureMethod, setCaptureMethod] = useState<'NONE' | 'CAPTURED' | 'DEFEATED'>('NONE');

  // Masterpiece Cinematic state
  const [cinematicBanner, setCinematicBanner] = useState<string>('THE MUSE STRIKES!');
  const [cinematicPoetName, setCinematicPoetName] = useState<string>('');
  const [cinematicTitle, setCinematicTitle] = useState<string>('');
  const [cinematicStanzas, setCinematicStanzas] = useState<string[]>([]);

  // Simulation Refs
  const playerHpRef = useRef<number>(100);
  const enemyHpRef = useRef<number>(100);
  const playerDisplayHpRef = useRef<number>(100);
  const enemyDisplayHpRef = useRef<number>(100);
  const lastHpTickAudioTimeRef = useRef<number>(0);
  const lastLowHpWarningTimeRef = useRef<number>(0);

  const animTimeRef = useRef<number>(0);
  const playerLungeXRef = useRef<number>(0);
  const playerLungeYRef = useRef<number>(0);
  const enemyLungeXRef = useRef<number>(0);
  const enemyLungeYRef = useRef<number>(0);

  const screenShakeRef = useRef<number>(0);
  const playerFlashRef = useRef<number>(0);
  const enemyFlashRef = useRef<number>(0);

  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingCombatText[]>([]);
  const vfxRef = useRef<VisualEffectState>({
    active: false,
    type: 'DEFAULT',
    timer: 0,
    duration: 1.6,
    isPlayerAttacking: true,
    resolved: false,
  });

  const bookAnimRef = useRef<BookAnimation>({
    active: false,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    progress: 0,
    phase: 'FLYING',
    wobbleTimer: 0,
    wobbleAngle: 0,
    success: false,
    spriteKey: 'item_capture_book',
    itemName: 'BLANK ANTHOLOGY BOOK',
  });

  const introEnemyOffsetXRef = useRef<number>(0);
  const introPlayerOffsetXRef = useRef<number>(0);
  const enemyFleeOffsetXRef = useRef<number>(0);
  const enemyFleeAlphaRef = useRef<number>(1.0);
  const isFleeingRef = useRef<boolean>(false);
  const battleExitGraceUntilRef = useRef<number>(0);
  const runTimeoutRef = useRef<number | null>(null);

  // Tracks whether the player has taken their very first step in the overworld
  const hasPlayerMovedRef = useRef<boolean>(false);

  // White House permanent unlock flag
  const [whiteHouseUnlocked, setWhiteHouseUnlocked] = useState<boolean>(false);
  const whiteHouseUnlockedRef = useRef<boolean>(false);
  whiteHouseUnlockedRef.current = whiteHouseUnlocked;

  // =========================================================================
  // MULTI-SCREEN OVERWORLD STATE (SCREENS 1-5, INTERIORS)
  // =========================================================================
  const [activeOverworldScreen, setActiveOverworldScreen] = useState<OverworldScreenId>('HARBOR');
  const activeOverworldScreenRef = useRef<OverworldScreenId>('HARBOR');
  activeOverworldScreenRef.current = activeOverworldScreen;

  const harborNpcsRef = useRef<HarborNPC[]>(createFreshHarborNpcs());
  const landGooseRef = useRef<LandGooseState>({
    x: 7.5,
    y: 11.0,
    pxX: 7.5 * TILE_SIZE,
    pxY: 11.0 * TILE_SIZE,
    facing: 'LEFT',
    state: 'IDLE',
    stateTimer: 2.2,
    targetX: 7.5,
    targetY: 11.0,
    startX: 7.5,
    startY: 11.0,
    waddleProgress: 0,
    peckProgress: 0,
  });
  const waterGooseRef = useRef<WaterGooseState>({
    x: 5.5,
    y: 5.0,
    pxX: 5.5 * TILE_SIZE,
    pxY: 5.0 * TILE_SIZE,
    facing: 'LEFT',
    state: 'DRIFT',
    stateTimer: 3.5,
    targetX: 5.5,
    targetY: 5.0,
    startX: 5.5,
    startY: 5.0,
    currentWaypointIndex: 0,
    swimProgress: 0,
    preenProgress: 0,
  });
  const coastalDogRef = useRef<CoastalDogState>({
    x: 5.5,
    y: 5.5,
    pxX: 5.5 * TILE_SIZE,
    pxY: 5.5 * TILE_SIZE,
    facing: 'RIGHT',
    state: 'IDLE',
    isMoving: false,
    trotProgress: 0,
    sniffProgress: 0,
    stateTimer: 2.0,
    targetX: 5.5,
    targetY: 5.5,
    startX: 5.5,
    startY: 5.5,
    targetSpotIndex: 0,
    pauseTimer: 2.0,
    isInteracting: false,
  });
  const townNpcsRef = useRef<HarborNPC[]>(createFreshTownNpcs());
  const cliffsNpcsRef = useRef<HarborNPC[]>(createFreshCliffsNpcs());
  const ruinsNpcsRef = useRef<HarborNPC[]>(createFreshRuinsNpcs());
  const treelineNpcsRef = useRef<HarborNPC[]>(createFreshTreelineNpcs());
  const mountainGoatNpcsRef = useRef<HarborNPC[]>(createFreshMountainGoatNpcs());
  const libraryNpcsRef = useRef<HarborNPC[]>(createFreshLibraryNpcs());
  const nightingaleNpcsRef = useRef<HarborNPC[]>(createFreshNightingaleNpcs());
  const lunchNpcsRef = useRef<HarborNPC[]>(createFreshLunchNpcs());
  const forgeNpcsRef = useRef<HarborNPC[]>(createFreshForgeNpcs());
  const blueHouseNpcsRef = useRef<HarborNPC[]>(createFreshBlueHouseNpcs());
  const kitchenNpcsRef = useRef<HarborNPC[]>(createFreshKitchenNpcs());
  const graveyardNpcsRef = useRef<HarborNPC[]>(createFreshGraveyardNpcs());

  const whiteHouseNpcsRef = useRef<HarborNPC[]>(createFreshWhiteHouseNpcs());


  const hermitageNpcsRef = useRef<HarborNPC[]>(createFreshHermitageNpcs());


  const summitNpcsRef = useRef<HarborNPC[]>(createFreshSummitNpcs());
  const rentedRoomNpcsRef = useRef<HarborNPC[]>(createFreshRentedRoomNpcs());
  const lyricSanctuaryNpcsRef = useRef<HarborNPC[]>(createFreshLyricSanctuaryNpcs());
  const cafeNpcsRef = useRef<HarborNPC[]>(createFreshCafeNpcs());
  const shakespeareCoNpcsRef = useRef<HarborNPC[]>(createFreshShakespeareCoNpcs());
  const [, setHarborNpcsState] = useState<HarborNPC[]>(harborNpcsRef.current);
  const [, setTownNpcsState] = useState<HarborNPC[]>(townNpcsRef.current);
  const [, setCliffsNpcsState] = useState<HarborNPC[]>(cliffsNpcsRef.current);
  const [, setRuinsNpcsState] = useState<HarborNPC[]>(ruinsNpcsRef.current);
  const [, setTreelineNpcsState] = useState<HarborNPC[]>(treelineNpcsRef.current);
  const [, setMountainGoatNpcsState] = useState<HarborNPC[]>(mountainGoatNpcsRef.current);
  const [, setLibraryNpcsState] = useState<HarborNPC[]>(libraryNpcsRef.current);
  const [, setNightingaleNpcsState] = useState<HarborNPC[]>(nightingaleNpcsRef.current);
  const [, setLunchNpcsState] = useState<HarborNPC[]>(lunchNpcsRef.current);
  const [, setForgeNpcsState] = useState<HarborNPC[]>(forgeNpcsRef.current);
  const [, setBlueHouseNpcsState] = useState<HarborNPC[]>(blueHouseNpcsRef.current);
  const [, setKitchenNpcsState] = useState<HarborNPC[]>(kitchenNpcsRef.current);
  const [, setGraveyardNpcsState] = useState<HarborNPC[]>(graveyardNpcsRef.current);
  const [, setWhiteHouseNpcsState] = useState<HarborNPC[]>(whiteHouseNpcsRef.current);
  const [, setHermitageNpcsState] = useState<HarborNPC[]>(hermitageNpcsRef.current);
  const [, setSummitNpcsState] = useState<HarborNPC[]>(summitNpcsRef.current);
  const [, setRentedRoomNpcsState] = useState<HarborNPC[]>(rentedRoomNpcsRef.current);
  const [, setLyricSanctuaryNpcsState] = useState<HarborNPC[]>(lyricSanctuaryNpcsRef.current);
  const [, setCafeNpcsState] = useState<HarborNPC[]>(cafeNpcsRef.current);
  const [, setShakespeareCoNpcsState] = useState<HarborNPC[]>(shakespeareCoNpcsRef.current);

  const setCafeNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      cafeNpcsRef.current = updater(cafeNpcsRef.current);
    } else {
      cafeNpcsRef.current = updater;
    }
    setCafeNpcsState(cafeNpcsRef.current);
  }, []);

  const setShakespeareCoNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      shakespeareCoNpcsRef.current = updater(shakespeareCoNpcsRef.current);
    } else {
      shakespeareCoNpcsRef.current = updater;
    }
    setShakespeareCoNpcsState(shakespeareCoNpcsRef.current);
  }, []);

  const setLyricSanctuaryNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      lyricSanctuaryNpcsRef.current = updater(lyricSanctuaryNpcsRef.current);
    } else {
      lyricSanctuaryNpcsRef.current = updater;
    }
    setLyricSanctuaryNpcsState(lyricSanctuaryNpcsRef.current);
  }, []);

  const setHarborNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      harborNpcsRef.current = updater(harborNpcsRef.current);
    } else {
      harborNpcsRef.current = updater;
    }
    setHarborNpcsState(harborNpcsRef.current);
  }, []);



  const setSummitNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      summitNpcsRef.current = updater(summitNpcsRef.current);
    } else {
      summitNpcsRef.current = updater;
    }
    setSummitNpcsState(summitNpcsRef.current);
  }, []);

  const setRentedRoomNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      rentedRoomNpcsRef.current = updater(rentedRoomNpcsRef.current);
    } else {
      rentedRoomNpcsRef.current = updater;
    }
    setRentedRoomNpcsState(rentedRoomNpcsRef.current);
  }, []);

  const setWhiteHouseNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      whiteHouseNpcsRef.current = updater(whiteHouseNpcsRef.current);
    } else {
      whiteHouseNpcsRef.current = updater;
    }
    setWhiteHouseNpcsState(whiteHouseNpcsRef.current);
  }, []);

  const setHermitageNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      hermitageNpcsRef.current = updater(hermitageNpcsRef.current);
    } else {
      hermitageNpcsRef.current = updater;
    }
    setHermitageNpcsState(hermitageNpcsRef.current);
  }, []);

  const setGraveyardNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      graveyardNpcsRef.current = updater(graveyardNpcsRef.current);
    } else {
      graveyardNpcsRef.current = updater;
    }
    setGraveyardNpcsState(graveyardNpcsRef.current);
  }, []);

  const setKitchenNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      kitchenNpcsRef.current = updater(kitchenNpcsRef.current);
    } else {
      kitchenNpcsRef.current = updater;
    }
    setKitchenNpcsState(kitchenNpcsRef.current);
  }, []);

  const setTownNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      townNpcsRef.current = updater(townNpcsRef.current);
    } else {
      townNpcsRef.current = updater;
    }
    setTownNpcsState(townNpcsRef.current);
  }, []);

  const setCliffsNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      cliffsNpcsRef.current = updater(cliffsNpcsRef.current);
    } else {
      cliffsNpcsRef.current = updater;
    }
    setCliffsNpcsState(cliffsNpcsRef.current);
  }, []);

  const setRuinsNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      ruinsNpcsRef.current = updater(ruinsNpcsRef.current);
    } else {
      ruinsNpcsRef.current = updater;
    }
    setRuinsNpcsState(ruinsNpcsRef.current);
  }, []);

  const setTreelineNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      treelineNpcsRef.current = updater(treelineNpcsRef.current);
    } else {
      treelineNpcsRef.current = updater;
    }
    setTreelineNpcsState(treelineNpcsRef.current);
  }, []);

  const setNightingaleNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      nightingaleNpcsRef.current = updater(nightingaleNpcsRef.current);
    } else {
      nightingaleNpcsRef.current = updater;
    }
    setNightingaleNpcsState(nightingaleNpcsRef.current);
  }, []);

  const setLunchNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      lunchNpcsRef.current = updater(lunchNpcsRef.current);
    } else {
      lunchNpcsRef.current = updater;
    }
    setLunchNpcsState(lunchNpcsRef.current);
  }, []);

  const setForgeNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      forgeNpcsRef.current = updater(forgeNpcsRef.current);
    } else {
      forgeNpcsRef.current = updater;
    }
    setForgeNpcsState(forgeNpcsRef.current);
  }, []);

  const setBlueHouseNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      blueHouseNpcsRef.current = updater(blueHouseNpcsRef.current);
    } else {
      blueHouseNpcsRef.current = updater;
    }
    setBlueHouseNpcsState(blueHouseNpcsRef.current);
  }, []);

  const setMountainGoatNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      mountainGoatNpcsRef.current = updater(mountainGoatNpcsRef.current);
    } else {
      mountainGoatNpcsRef.current = updater;
    }
    setMountainGoatNpcsState(mountainGoatNpcsRef.current);
  }, []);

  const setLibraryNpcs = useCallback((updater: HarborNPC[] | ((prev: HarborNPC[]) => HarborNPC[])) => {
    if (typeof updater === 'function') {
      libraryNpcsRef.current = updater(libraryNpcsRef.current);
    } else {
      libraryNpcsRef.current = updater;
    }
    setLibraryNpcsState(libraryNpcsRef.current);
  }, []);

  const triggerPoetRecruitmentDissolve = useCallback((targetNpcId: string, poetId: string) => {
    gameAudio.playFarewellChime();
    triggerHaptics([40, 70, 110]);

    setCapturedPoetIds((prev) => (prev.includes(poetId) ? prev : [...prev, poetId]));
    setPlayerLineup((prev) => (prev.includes(poetId) ? prev : [...prev, poetId]));
    setActivePlayerPoetId(poetId);

    const startDissolve = (npcsList: HarborNPC[]): HarborNPC[] =>
      npcsList.map((n) => {
        if (n.id === targetNpcId || n.poetId === poetId) {
          return {
            ...n,
            isRecruited: true,
            isDissolving: true,
            dissolveTimer: 0,
            dissolveDuration: 0.45,
            isInteracting: false,
            isMoving: false,
            walkStep: 0,
            patrol: undefined,
            movement: undefined,
          };
        }
        return n;
      });

    harborNpcsRef.current = startDissolve(harborNpcsRef.current);
    setHarborNpcsState([...harborNpcsRef.current]);
    townNpcsRef.current = startDissolve(townNpcsRef.current);
    setTownNpcsState([...townNpcsRef.current]);
    cliffsNpcsRef.current = startDissolve(cliffsNpcsRef.current);
    setCliffsNpcsState([...cliffsNpcsRef.current]);
    ruinsNpcsRef.current = startDissolve(ruinsNpcsRef.current);
    setRuinsNpcsState([...ruinsNpcsRef.current]);
    treelineNpcsRef.current = startDissolve(treelineNpcsRef.current);
    setTreelineNpcsState([...treelineNpcsRef.current]);
    nightingaleNpcsRef.current = startDissolve(nightingaleNpcsRef.current);
    setNightingaleNpcsState([...nightingaleNpcsRef.current]);
    lunchNpcsRef.current = startDissolve(lunchNpcsRef.current);
    setLunchNpcsState([...lunchNpcsRef.current]);
    forgeNpcsRef.current = startDissolve(forgeNpcsRef.current);
    setForgeNpcsState([...forgeNpcsRef.current]);
    blueHouseNpcsRef.current = startDissolve(blueHouseNpcsRef.current);
    setBlueHouseNpcsState([...blueHouseNpcsRef.current]);
    mountainGoatNpcsRef.current = startDissolve(mountainGoatNpcsRef.current);
    setMountainGoatNpcsState([...mountainGoatNpcsRef.current]);
    libraryNpcsRef.current = startDissolve(libraryNpcsRef.current);
    setLibraryNpcsState([...libraryNpcsRef.current]);
    kitchenNpcsRef.current = startDissolve(kitchenNpcsRef.current);
    setKitchenNpcsState([...kitchenNpcsRef.current]);
    graveyardNpcsRef.current = startDissolve(graveyardNpcsRef.current);
    setGraveyardNpcsState([...graveyardNpcsRef.current]);
    whiteHouseNpcsRef.current = startDissolve(whiteHouseNpcsRef.current);
    setWhiteHouseNpcsState([...whiteHouseNpcsRef.current]);
    hermitageNpcsRef.current = startDissolve(hermitageNpcsRef.current);
    setHermitageNpcsState([...hermitageNpcsRef.current]);
    summitNpcsRef.current = startDissolve(summitNpcsRef.current);
    setSummitNpcsState([...summitNpcsRef.current]);
    rentedRoomNpcsRef.current = startDissolve(rentedRoomNpcsRef.current);
    setRentedRoomNpcsState([...rentedRoomNpcsRef.current]);
    lyricSanctuaryNpcsRef.current = startDissolve(lyricSanctuaryNpcsRef.current);
    setLyricSanctuaryNpcsState([...lyricSanctuaryNpcsRef.current]);
  }, []);

  // Player position in Overworld
  const overworldPlayerRef = useRef({
    gridX: 4,
    gridY: 22,
    pxX: 4 * TILE_SIZE,
    pxY: 22 * TILE_SIZE,
    dir: 'RIGHT' as FacingDirection,
    isMoving: false,
    moveProgress: 0,
    fromX: 4,
    fromY: 22,
    targetX: 4,
    targetY: 22,
    walkStep: 0,
    isGliding: false,
    glideVx: 0,
    glideVy: 0,
  });

  // Ice Gliding Trails, Particles & Mobile Input Refs
  const iceSkateTrailsRef = useRef<IceSkateTrail[]>([]);
  const iceShimmerParticlesRef = useRef<IceShimmerParticle[]>([]);
  const lastIceFootPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSkateAudioTimeRef = useRef<number>(0);

  // Overworld Dialogue & Choice Menu State
  const [overworldDialogue, _setOverworldDialogue] = useState<{
    active: boolean;
    speakerName: string;
    text: string;
    onComplete?: () => void;
    showChoiceMenu?: boolean;
    choiceOptions?: Array<{ label: 'TALK' | 'DUEL' | 'LEAVE' | 'JOIN'; action: () => void }>;
  } | null>(null);
  const overworldDialogueRef = useRef(overworldDialogue);
  overworldDialogueRef.current = overworldDialogue;

  const setOverworldDialogue = useCallback((val: React.SetStateAction<typeof overworldDialogue>) => {
    _setOverworldDialogue((prev) => {
      const next = typeof val === 'function' ? (val as (p: typeof overworldDialogue) => typeof overworldDialogue)(prev) : val;
      overworldDialogueRef.current = next;
      return next;
    });
  }, []);

  // Cleanly dismiss overworld dialogue or awakening message and restore all movement
  const dismissAwakeningOrDialogue = useCallback(() => {
    setIsCinematicLocked(false);
    setIsTransitioningScreen(false);
    isTransitioningScreenRef.current = false;
    battleExitGraceUntilRef.current = 0;
    if (typeof window !== 'undefined') {
      window.focus();
    }

    if (!overworldDialogueRef.current?.active) return;

    if (overworldDialogueRef.current.showChoiceMenu) {
      return;
    }

    const cb = overworldDialogueRef.current.onComplete;
    overworldDialogueRef.current = null;
    setOverworldDialogue(null);

    const resetNpc = (n: HarborNPC) => ({
      ...n,
      isInteracting: false,
      movement: n.movement ? { ...n.movement, pauseTimer: 2.0 } : undefined,
    });

    harborNpcsRef.current = harborNpcsRef.current.map((n) => ({
      ...resetNpc(n),
      facing:
        n.id === 'npc_darwish' || n.poetId === 'DARWISH'
          ? 'DOWN'
          : n.id === 'npc_mary_oliver' || n.poetId === 'MARY_OLIVER'
          ? n.maryOliverRoutine?.phase === 'STROLL_WEST'
            ? 'LEFT'
            : n.maryOliverRoutine?.phase === 'STROLL_EAST'
            ? 'RIGHT'
            : 'UP'
          : n.id === 'npc_cavafy' || n.poetId === 'CAVAFY'
          ? 'DOWN'
          : n.id === 'npc_walcott' || n.poetId === 'WALCOTT'
          ? n.walcottRoutine?.phase === 'STROLL_WEST'
            ? 'LEFT'
            : n.walcottRoutine?.phase === 'STROLL_EAST'
            ? 'RIGHT'
            : 'DOWN'
          : n.facing,
    }));
    setHarborNpcsState([...harborNpcsRef.current]);
    townNpcsRef.current = townNpcsRef.current.map((n) => ({
      ...resetNpc(n),
      facing: n.id === 'npc_town_rumi' || n.poetId === 'RUMI' ? 'RIGHT' : n.facing,
    }));
    setTownNpcsState([...townNpcsRef.current]);
    cliffsNpcsRef.current = cliffsNpcsRef.current.map(resetNpc);
    setCliffsNpcsState([...cliffsNpcsRef.current]);
    ruinsNpcsRef.current = ruinsNpcsRef.current.map(resetNpc);
    setRuinsNpcsState([...ruinsNpcsRef.current]);
    treelineNpcsRef.current = treelineNpcsRef.current.map(resetNpc);
    setTreelineNpcsState([...treelineNpcsRef.current]);
    summitNpcsRef.current = summitNpcsRef.current.map(resetNpc);
    setSummitNpcsState([...summitNpcsRef.current]);
    rentedRoomNpcsRef.current = rentedRoomNpcsRef.current.map((n) => ({
      ...resetNpc(n),
      facing:
        n.id === 'baudelaire' || n.poetId === 'baudelaire' || n.poetId === 'BAUDELAIRE'
          ? 'RIGHT'
          : n.facing,
    }));
    setRentedRoomNpcsState([...rentedRoomNpcsRef.current]);
    whiteHouseNpcsRef.current = whiteHouseNpcsRef.current.map(resetNpc);
    setWhiteHouseNpcsState([...whiteHouseNpcsRef.current]);
    kitchenNpcsRef.current = kitchenNpcsRef.current.map(resetNpc);
    setKitchenNpcsState([...kitchenNpcsRef.current]);
    graveyardNpcsRef.current = graveyardNpcsRef.current.map(resetNpc);
    setGraveyardNpcsState([...graveyardNpcsRef.current]);
    hermitageNpcsRef.current = hermitageNpcsRef.current.map(resetNpc);
    setHermitageNpcsState([...hermitageNpcsRef.current]);
    lyricSanctuaryNpcsRef.current = lyricSanctuaryNpcsRef.current.map(resetNpc);
    setLyricSanctuaryNpcsState([...lyricSanctuaryNpcsRef.current]);
    cafeNpcsRef.current = cafeNpcsRef.current.map(resetNpc);
    setCafeNpcsState([...cafeNpcsRef.current]);
    shakespeareCoNpcsRef.current = shakespeareCoNpcsRef.current.map(resetNpc);
    setShakespeareCoNpcsState([...shakespeareCoNpcsRef.current]);
    nightingaleNpcsRef.current = nightingaleNpcsRef.current.map(resetNpc);
    setNightingaleNpcsState([...nightingaleNpcsRef.current]);
    lunchNpcsRef.current = lunchNpcsRef.current.map(resetNpc);
    setLunchNpcsState([...lunchNpcsRef.current]);
    forgeNpcsRef.current = forgeNpcsRef.current.map(resetNpc);
    setForgeNpcsState([...forgeNpcsRef.current]);
    blueHouseNpcsRef.current = blueHouseNpcsRef.current.map(resetNpc);
    setBlueHouseNpcsState([...blueHouseNpcsRef.current]);
    mountainGoatNpcsRef.current = mountainGoatNpcsRef.current.map(resetNpc);
    setMountainGoatNpcsState([...mountainGoatNpcsRef.current]);
    libraryNpcsRef.current = libraryNpcsRef.current.map(resetNpc);
    setLibraryNpcsState([...libraryNpcsRef.current]);

    if (coastalDogRef.current) {
      coastalDogRef.current.isInteracting = false;
      coastalDogRef.current.state = 'IDLE';
      coastalDogRef.current.stateTimer = 2.0;
      coastalDogRef.current.pauseTimer = 2.0;
    }

    gameAudio.playCrispClick();
    if (cb) cb();
  }, [setOverworldDialogue]);

  // Props & Wildlife inspect cycle indexes
  const propInspectIndexRef = useRef<Record<string, number>>({
    GEESE: 0,
    SKIFF: 0,
    CANTO1_BENCH: 0,
    CRATES: 0,
    MILESTONE: 0,
    SIGNPOST: 0,
    TOWN_PIGEONS: 0,
    GINGER_CAT: 0,
    TOWN_FOUNTAIN: 0,
    TOWN_BULLETIN: 0,
    TOWN_BOOKSTALLS: 0,
    TOWN_BISTRO_TABLES: 0,
    TOWN_BENCHES: 0,
    TOWN_BENCH_PANTHER: 0,
    TOWN_STREETLAMPS: 0,
    NIGHTINGALE_PIANO: 0,
    NIGHTINGALE_MIC: 0,
    NIGHTINGALE_ALE: 0,
    NIGHTINGALE_CANDLESTICK: 0,
    NIGHTINGALE_SONGBOOK: 0,
    NIGHTINGALE_CABARET_TABLE: 0,
    NIGHTINGALE_SLATE: 0,
    NIGHTINGALE_SHELVES: 0,
    NIGHTINGALE_POSTER: 0,
    NIGHTINGALE_SCONCE: 0,
    LUNCH_COKE: 0,
    LUNCH_PLUMS: 0,
    LUNCH_SUNDAE: 0,
    LUNCH_PHOTO: 0,
    LUNCH_JUKEBOX: 0,
    LUNCH_MENU: 0,
    LUNCH_PIE: 0,
    LUNCH_COFFEE: 0,
    LUNCH_SODA: 0,
    LUNCH_ELIOT_CUP: 0,
    LUNCH_BOOTH: 0,
    RENTED_URN: 0,
    RENTED_EASEL: 0,
    RENTED_DESK: 0,
    RENTED_BED: 0,
    RENTED_MANTEL: 0,
    RENTED_WINDOW: 0,
    RENTED_TABLE: 0,
    RENTED_TRUNK: 0,
    RENTED_WASHSTAND: 0,
    RENTED_RUG: 0,
    CLIFFS_DOG: 0,
    LORCA_GUITAR: 0,
    BRASS_TELESCOPE: 0,
    LIMESTONE_BENCH: 0,
    STONE_CAIRN: 0,
    SEA_BOULDER: 0,
    CYPRESS_GROVE: 0,
    LEMON_TREE: 0,
    VINEYARD_PERGOLA: 0,
    NERUDA_TABLE: 0,
    RELICS_CABINET: 0,
    DECK_LANTERN: 0,
    OCEAN_OVERLOOK: 0,
    RUINS_GOAT: 0,
    RUINS_FROG: 0,
    CALLIOPE_STATUE: 0,
    MUSE_STATUE: 0,
    COLUMN_DRUMS: 0,
    LIBRARY_PORTICO: 0,
    RUINS_BRIDGE: 0,
    KOI_POND: 0,
    RED_OAK: 0,
    TEA_PAVILION: 0,
    KHAYYAM_TABLE: 0,
    LI_BAI_SETTING: 0,
    BASHO_RELICS: 0,
    HEARTH_KETTLE: 0,
    GOAT_SIGN: 0,
    CEDAR_BAR: 0,
    ELIOT_DESK: 0,
    YEATS_TABLE: 0,
    POUND_LECTERN: 0,
    MOORE_LECTERN: 0,
    SOR_JUANA_DESK: 0,
    CENTRAL_TABLE: 0,
    CARD_CATALOG: 0,
    CELESTIAL_GLOBE: 0,
    ROLLING_LADDER: 0,
    BOOKSTACKS: 0,
    CASTALIAN_SPRING: 0,
    FIRST_FOLIO_PLINTH: 0,
    STAGE_STEPS: 0,
    SUMMIT_LYRE: 0,
    LAUREL_LEAVES: 0,
    JUNIPER_BRAZIER: 0,
    TORTOISESHELL_LYRE: 0,
    ARMILLARY_SPHERE: 0,
    AEOLIC_SCROLLS: 0,
    GLACIER_WINDOW: 0,
    HOOK_JAWED_FISH: 0,
    CRIMSON_CRAB: 0,
    SALVAGE_WORKTABLE: 0,
    ARRIVAL_LEDGER: 0,
    OILSKIN_CHEST: 0,
    CORKED_BOTTLE: 0,
    LIGHTHOUSE_BEACON: 0,
    SHIPWRECK_RIBS: 0,
    BOATHOUSE_EXTERIOR: 0,
    BOATHOUSE_PRESS: 0,
    DAFFODIL_GLADE: 0,
  });

  // Environmental Easter Egg & Gag Interaction State Tracking
  const [interactionState, setInteractionState] = useState<Record<string, number>>({});
  const interactionCountsRef = useRef<Record<string, number>>({});

  // Shel Silverstein's "The Giving Tree" stump interaction tracking
  const [givingTreeClicks, setGivingTreeClicks] = useState<number>(0);
  const givingTreeClicksRef = useRef<number>(0);

  // Wordsworth's Golden Daffodil Glade interaction tracking
  const [daffodilClicks, setDaffodilClicks] = useState<number>(0);
  const daffodilClicksRef = useRef<number>(0);

  // Treeline Idle Reaction (Waiting by the Bare Tree)
  const lastInputTimeRef = useRef<number>(Date.now());
  const treelineIdleTriggeredRef = useRef<boolean>(false);
  const treelineTriggerPosRef = useRef<{ x: number; y: number } | null>(null);

  // 2-Second Extra Snow Burst (Ways of Looking at the Blackbird)
  const [snowBurstTimer, setSnowBurstTimer] = useState<number>(0);
  const snowBurstTimerRef = useRef<number>(0);

  const inputRef = useInput(canvasRef, true, {
    width: canvasWidth,
    height: canvasHeight,
  });

  useEffect(() => {
    playerHpRef.current = playerHp;
  }, [playerHp]);
  useEffect(() => {
    enemyHpRef.current = enemyHp;
  }, [enemyHp]);

  // Smooth initial app mount fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreenCurtainAlpha(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Win/Loss audio
  useEffect(() => {
    if (gameState.status === 'VICTORY') {
      gameAudio.playVictoryFanfare();
      soundtrackEngine.playVictoryFanfare();
      triggerHaptics([100, 50, 150, 50, 300]);
    } else if (gameState.status === 'GAME_OVER') {
      gameAudio.playDefeatMotif();
      triggerHaptics([250, 100, 250]);
    }
  }, [gameState.status]);

  // Dialogue typewriter (strictly active only when on BATTLE screen to avoid 20ms re-render loops on startup/title)
  useEffect(() => {
    if (currentScreen !== 'BATTLE') return;
    const totalChars = dialogueLines.join(' ').length;
    setDisplayedChars(0);
    const intervalMs = 20;

    const interval = setInterval(() => {
      setDisplayedChars((prev) => {
        if (prev < totalChars) {
          if (prev % 5 === 0) {
            gameAudio.playTypewriterBeep();
          }
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [dialogueLines, currentScreen]);

  const addFloatingText = (
    x: number,
    y: number,
    text: string,
    color = '#000000',
    size = 14,
  ) => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 10,
      text,
      color,
      size,
      life: 0,
      maxLife: 1.4,
      vy: -25 - Math.random() * 15,
    });
  };

  const spawnParticles = (x: number, y: number, color: string, count = 18) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 85;
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 25,
        y: Math.min(370, Math.max(30, y + (Math.random() - 0.5) * 25)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 10,
        size: 3.5 + Math.random() * 3.5,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.4,
        type: 'sparkle',
      });
    }
  };

  // Damage formula with Base Stats and Modifiers
  const calculateDamage = (
    baseDamage: number,
    isAttackerBuffed: boolean = false,
    isAttackerDebuffed: boolean = false,
    seasonMultiplier: number = 1
  ): number => {
    const buffMult = isAttackerBuffed ? (BATTLE_CONFIG.buffMultiplier ?? 1.35) : 1;
    const debuffMult = isAttackerDebuffed ? (BATTLE_CONFIG.debuffMultiplier ?? 0.70) : 1;
    return Math.max(
      1,
      Math.round(baseDamage * buffMult * debuffMult * seasonMultiplier)
    );
  };

  // Pre-Turn Enemy Intent AI Calculation
  const calculateEnemyIntent = useCallback(() => {
    const ePoet = enemyPoetRef.current;
    if (!ePoet || !ePoet.moves || ePoet.moves.length === 0) return;

    if (enemyStunTokensRef.current > 0) {
      setEnemyIntentMove(null);
      enemyIntentMoveRef.current = null;
      return;
    }

    const curReadings = enemyReadingsRef.current;
    const availableMoves = ePoet.moves.filter(
      (m) => (curReadings[m.id] ?? m.maxReadings) > 0
    );
    let validMoves = availableMoves.length > 0 ? availableMoves : ePoet.moves;

    // AI Intent Filter: Enemy AI CANNOT choose its STATUS move if:
    // 1) player.stunTokens > 0
    // 2) player.stunImmuneTurns > 0
    // 3) Enemy used STATUS on the immediately preceding round
    const canUseStatus = canEnemyAiSelectStatus(
      playerStunTokensRef.current,
      playerStunImmuneTurnsRef.current,
      enemyUsedStatusLastRoundRef.current
    );

    if (!canUseStatus) {
      const nonStatus = validMoves.filter((m) => m.effectType !== 'STATUS');
      if (nonStatus.length > 0) {
        validMoves = nonStatus;
      }
    }

    // Strategic move selection:
    // 1. If HP low (<= 40% maxHp) and HEAL move available, 65% chance
    const healMove = validMoves.find((m) => m.effectType === 'HEAL');
    if (healMove && enemyHpRef.current <= enemyPoetRef.current.hp * 0.4 && Math.random() < 0.65) {
      setEnemyIntentMove(healMove);
      enemyIntentMoveRef.current = healMove;
      return;
    }

    // 2. If not buffed and BUFF move available, 50% chance
    const buffMove = validMoves.find((m) => m.effectType === 'BUFF');
    if (buffMove && !enemyBuffActiveRef.current && Math.random() < 0.5) {
      setEnemyIntentMove(buffMove);
      enemyIntentMoveRef.current = buffMove;
      return;
    }

    // 3. If player not debuffed and DEBUFF move available, 40% chance
    const debuffMove = validMoves.find((m) => m.effectType === 'DEBUFF');
    if (debuffMove && !playerDebuffActiveRef.current && Math.random() < 0.4) {
      setEnemyIntentMove(debuffMove);
      enemyIntentMoveRef.current = debuffMove;
      return;
    }

    // 4. If canUseStatus and STATUS move available, 40% chance
    const statusMove = validMoves.find((m) => m.effectType === 'STATUS');
    if (statusMove && canUseStatus && Math.random() < 0.4) {
      setEnemyIntentMove(statusMove);
      enemyIntentMoveRef.current = statusMove;
      return;
    }

    // 5. Prefer HEAVY if available, else LIGHT, else valid move
    const heavyMove = validMoves.find((m) => m.effectType === 'HEAVY');
    const lightMove = validMoves.find((m) => m.effectType === 'LIGHT');

    let chosen: PoemMove;
    if (heavyMove && Math.random() < 0.6) {
      chosen = heavyMove;
    } else if (lightMove && Math.random() < 0.75) {
      chosen = lightMove;
    } else {
      chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    setEnemyIntentMove(chosen);
    enemyIntentMoveRef.current = chosen;
  }, []);

  // Atmospheric 1-line Intent Telegraph Banner Formatter
  const getTelegraphBannerInfo = useCallback(() => {
    const ePoet = enemyPoetRef.current;
    const poetName = ePoet.name;

    if (enemyStunTokensRef.current > 0) {
      return {
        text: `${poetName} is Lost for Words and cannot recite this turn.`,
        glowClass: 'border-[#8B5CF6] text-[#C4B5FD]',
        accent: '#8B5CF6',
        tag: 'LOST FOR WORDS',
        isHeavy: false,
      };
    }

    const move = enemyIntentMoveRef.current;
    if (!move) {
      return {
        text: `${poetName} contemplates their next verse...`,
        glowClass: 'border-[#333C57] text-[#FFE89E]',
        accent: '#F4B41B',
        tag: 'INTENT',
        isHeavy: false,
      };
    }

    switch (move.effectType) {
      case 'HEAVY':
        return {
          text: `${poetName} draws a deep breath for a devastating stanza...`,
          glowClass: 'border-[#F4B41B] shadow-[0_0_12px_rgba(244,180,27,0.35)] text-[#FFE89E]',
          accent: '#F4B41B',
          tag: 'HEAVY VERSE',
          isHeavy: true,
        };
      case 'LIGHT':
        return {
          text: `${poetName} prepares a swift, measured verse...`,
          glowClass: 'border-[#333C57] text-[#E2E8F0]',
          accent: '#93C5FD',
          tag: 'LIGHT VERSE',
          isHeavy: false,
        };
      case 'BUFF':
        return {
          text: `${poetName} gathers their poetic conviction...`,
          glowClass: 'border-[#3B82F6] text-[#93C5FD]',
          accent: '#3B82F6',
          tag: 'INSPIRATION',
          isHeavy: false,
        };
      case 'DEBUFF':
        return {
          text: `${poetName} fixes you with a withering critical gaze...`,
          glowClass: 'border-[#EF4444] text-[#FCA5A5]',
          accent: '#EF4444',
          tag: 'CRITIQUE',
          isHeavy: false,
        };
      case 'HEAL':
        return {
          text: `${poetName} turns inward to restore their spirit...`,
          glowClass: 'border-[#10B981] text-[#6EE7B7]',
          accent: '#10B981',
          tag: 'RESTORATION',
          isHeavy: false,
        };
      case 'STATUS':
        return {
          text: `${poetName} weaves a disorienting cadence...`,
          glowClass: 'border-[#A855F7] text-[#D8B4FE]',
          accent: '#A855F7',
          tag: 'CADENCE',
          isHeavy: false,
        };
      default:
        return {
          text: `${poetName} contemplates their next reading...`,
          glowClass: 'border-[#333C57] text-[#FFE89E]',
          accent: '#F4B41B',
          tag: 'INTENT',
          isHeavy: false,
        };
    }
  }, []);

  // Start Battle Session
  const initBattle = useCallback(
    (customPlayerId?: string, customEnemyId?: string, customArenaId?: string) => {
      setOverworldDialogue(null);
      overworldDialogueRef.current = null;
      setScreenCurtainAlpha(1);
      setIsTransitioningScreen(true);
      isTransitioningScreenRef.current = true;

      setTimeout(() => {
        const targetEnemy = customEnemyId ? getPoetById(customEnemyId) : getPoetById('HUGHES');
        const isSummitFight = selectedGameMode === 'CLIMB' && ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'].includes(targetEnemy.id);

        let pPoet: PoetData;

        if (isSummitFight) {
          // Gauntlet Battle System: Find first poet in lineup with HP > 0
          const currentLineup = playerLineupRef.current;
          const alivePoetId = currentLineup.find(
            (id) => (lineupHpMapRef.current[id] ?? getPoetById(id).hp) > 0,
          ) || currentLineup[0] || customPlayerId || 'WHITMAN';

          pPoet = getPoetById(alivePoetId);
        } else {
          pPoet = customPlayerId ? getPoetById(customPlayerId) : playerPoetRef.current;
        }

        setActivePlayerPoetId(pPoet.id);
        playerPoetRef.current = pPoet;

        setActiveEnemyPoetId(targetEnemy.id);
        enemyPoetRef.current = targetEnemy;

        const chosenArena = customArenaId
          ? getArenaById(customArenaId)
          : targetEnemy.defaultArenaId
          ? getArenaById(targetEnemy.defaultArenaId)
          : getArenaForPoet(targetEnemy.id);

        setActiveArenaId(chosenArena.id);
        activeArenaRef.current = chosenArena;

        const pMax = pPoet.hp;
        const eMax = targetEnemy.hp;

        setPlayerMaxHp(pMax);
        setEnemyMaxHp(eMax);

        let pCurrentHp = pMax;
        if (isSummitFight) {
          pCurrentHp = lineupHpMapRef.current[pPoet.id] ?? pMax;
        } else {
          // Reset all lineup HP for non-summit fights
          const freshLineupHp: Record<string, number> = {};
          for (const poetId of playerLineupRef.current) {
            freshLineupHp[poetId] = getPoetById(poetId).hp;
          }
          if (!freshLineupHp[pPoet.id]) freshLineupHp[pPoet.id] = pMax;
          setLineupHpMap(freshLineupHp);
          lineupHpMapRef.current = freshLineupHp;
          pCurrentHp = pMax;
        }

        setPlayerHp(pCurrentHp);
        setEnemyHp(eMax);
        playerHpRef.current = pCurrentHp;
        enemyHpRef.current = eMax;
        playerDisplayHpRef.current = pCurrentHp;
        enemyDisplayHpRef.current = eMax;

        const pIdx = playerLineupRef.current.indexOf(pPoet.id);
        activeLineupIndexRef.current = pIdx >= 0 ? pIdx : 0;

        if (!isSummitFight || Object.keys(poetReadingsMapRef.current).length === 0) {
          const initialReadings: Record<string, Record<string, number>> = {};
          for (const p of ALL_POETS) {
            initialReadings[p.id] = createInitialReadingsForPoet(p);
          }
          setPoetReadingsMap(initialReadings);
          poetReadingsMapRef.current = initialReadings;
        }

        const eReadings = createInitialReadingsForPoet(targetEnemy);
        setEnemyReadings(eReadings);
        enemyReadingsRef.current = eReadings;
        calculateEnemyIntent();

        setPlayerBuffActive(false);
        playerBuffActiveRef.current = false;
        setPlayerBuffTurns(0);
        playerBuffTurnsRef.current = 0;
        setEnemyBuffActive(false);
        enemyBuffActiveRef.current = false;
        setEnemyBuffTurns(0);
        enemyBuffTurnsRef.current = 0;
        setPlayerDebuffActive(false);
        playerDebuffActiveRef.current = false;
        setPlayerDebuffTurns(0);
        playerDebuffTurnsRef.current = 0;
        setEnemyDebuffActive(false);
        enemyDebuffActiveRef.current = false;
        setEnemyDebuffTurns(0);
        enemyDebuffTurnsRef.current = 0;
        setPlayerLostForWords(false);
        playerLostForWordsRef.current = false;
        setEnemyLostForWords(false);
        enemyLostForWordsRef.current = false;
        setPlayerStatusImmune(false);
        playerStatusImmuneRef.current = false;
        setEnemyStatusImmune(false);
        enemyStatusImmuneRef.current = false;

        // Reset Stun State & Token Lifecycle
        setPlayerStunTokens(0);
        playerStunTokensRef.current = 0;
        setPlayerStunImmuneTurns(0);
        playerStunImmuneTurnsRef.current = 0;
        playerJustGainedImmunityThisRoundRef.current = false;

        setEnemyStunTokens(0);
        enemyStunTokensRef.current = 0;
        setEnemyStunImmuneTurns(0);
        enemyStunImmuneTurnsRef.current = 0;
        enemyJustGainedImmunityThisRoundRef.current = false;

        setEnemySkippedByStunThisRound(false);
        enemySkippedByStunThisRoundRef.current = false;

        enemyUsedStatusLastRoundRef.current = false;
        enemyUsedStatusThisRoundRef.current = false;

        battleTurnCountRef.current = 1;
        queuedPlayerMoveRef.current = null;
        isEnemyLeadingTurnRef.current = false;
        enemyIntentMoveRef.current = null;
        setEnemyIntentMove(null);

        setCaptureMethod('NONE');

        particlesRef.current = [];
        floatingTextsRef.current = [];
        vfxRef.current.active = false;
        bookAnimRef.current.active = false;
        screenShakeRef.current = 0;
        playerFlashRef.current = 0;
        enemyFlashRef.current = 0;

        introEnemyOffsetXRef.current = 240;
        introPlayerOffsetXRef.current = -240;
        enemyFleeOffsetXRef.current = 0;
        enemyFleeAlphaRef.current = 1.0;

        setActiveMove(null);
        activeMoveRef.current = null;
        setMoveUsageMap({});
        moveUsageMapRef.current = {};
        setActiveVerseStanza([]);
        setActiveStanzaIndex(0);
        verseStartTimeRef.current = 0;
        verseAnimTimerRef.current = 0;
        verseBypassedRef.current = false;
        setIsVerseBypassed(false);
        setOutcomeNarration('');
        setSelectedActionIndex(0);
        setSelectedMoveIndex(0);
        setSelectedBagIndex(0);

        setPreBattleDialogueIndex(0);
        preBattleDialogueIndexRef.current = 0;
        const enemyPreLine = targetEnemy.dialogue.preFight;
        const formattedEnemyPre = (enemyPreLine.startsWith('"') || enemyPreLine.startsWith('“'))
          ? enemyPreLine
          : `“${enemyPreLine}”`;
        setDialogueLines([formattedEnemyPre]);
        setTurnStage('INTRO_APPEAR');
        setIsOptionsMenuOpen(false);

        setCurrentScreen('BATTLE');
        void soundtrackEngine.switchRoom('BATTLE', true, targetEnemy.id);

        setGameState({
          status: 'PLAYING',
          score: selectedGameMode === 'GRAND_TOUR' ? grandTourCurrentIndex * 2000 : 1000,
          level: selectedGameMode === 'GRAND_TOUR' ? grandTourCurrentIndex + 1 : 1,
        });

        gameAudio.playArcadeLaser();
        triggerHaptics([40, 60, 40]);

        if (sdk) sdk.startGame();

        setTimeout(() => {
          setScreenCurtainAlpha(0);
          setIsTransitioningScreen(false);
          isTransitioningScreenRef.current = false;
        }, 60);
      }, 200);
    },
    [grandTourCurrentIndex, sdk, selectedGameMode],
  );

  // Overworld Start: CLIMB mode initialization on Screen 1 (The Harbor)
  const startClimbOverworld = useCallback((customName?: string, customStyle?: PlayerCustomization) => {
    setSelectedGameMode('CLIMB');
    setHasStartedClimb(true);
    climbVisitedScreensRef.current = new Set(['HARBOR']);
    climbSavePosRef.current = null;
    climbSaveReadyRef.current = true;
    animTimeRef.current = 0;
    if (customName) setPlayerName(customName);
    if (customStyle) {
      setPlayerCustom(customStyle);
      setHarborPlayerCustomization(customStyle);
    }
    setCapturedPoetIds([]);
    setPlayerLineup([]);
    setActivePlayerPoetId('');

    harborNpcsRef.current = createFreshHarborNpcs();
    setHarborNpcsState(harborNpcsRef.current);
    landGooseRef.current = {
      x: 7.5,
      y: 11.0,
      pxX: 7.5 * TILE_SIZE,
      pxY: 11.0 * TILE_SIZE,
      facing: 'LEFT',
      state: 'IDLE',
      stateTimer: 2.2,
      targetX: 7.5,
      targetY: 11.0,
      startX: 7.5,
      startY: 11.0,
      waddleProgress: 0,
      peckProgress: 0,
    };
    waterGooseRef.current = {
      x: 5.5,
      y: 5.0,
      pxX: 5.5 * TILE_SIZE,
      pxY: 5.0 * TILE_SIZE,
      facing: 'LEFT',
      state: 'DRIFT',
      stateTimer: 3.5,
      targetX: 5.5,
      targetY: 5.0,
      startX: 5.5,
      startY: 5.0,
      currentWaypointIndex: 0,
      swimProgress: 0,
      preenProgress: 0,
    };
    coastalDogRef.current = {
      x: 5.5,
      y: 5.5,
      pxX: 5.5 * TILE_SIZE,
      pxY: 5.5 * TILE_SIZE,
      facing: 'RIGHT',
      state: 'IDLE',
      isMoving: false,
      trotProgress: 0,
      sniffProgress: 0,
      stateTimer: 2.0,
      targetX: 5.5,
      targetY: 5.5,
      startX: 5.5,
      startY: 5.5,
      targetSpotIndex: 0,
      pauseTimer: 2.0,
      isInteracting: false,
    };
    townNpcsRef.current = createFreshTownNpcs();
    setTownNpcsState(townNpcsRef.current);
    cliffsNpcsRef.current = createFreshCliffsNpcs();
    setCliffsNpcsState(cliffsNpcsRef.current);
    ruinsNpcsRef.current = createFreshRuinsNpcs();
    setRuinsNpcsState(ruinsNpcsRef.current);
    treelineNpcsRef.current = createFreshTreelineNpcs();
    setTreelineNpcsState(treelineNpcsRef.current);
    mountainGoatNpcsRef.current = createFreshMountainGoatNpcs();
    setMountainGoatNpcsState(mountainGoatNpcsRef.current);
    libraryNpcsRef.current = createFreshLibraryNpcs();
    setLibraryNpcsState(libraryNpcsRef.current);
    nightingaleNpcsRef.current = createFreshNightingaleNpcs();
    setNightingaleNpcsState(nightingaleNpcsRef.current);
    lunchNpcsRef.current = createFreshLunchNpcs();
    setLunchNpcsState(lunchNpcsRef.current);
    forgeNpcsRef.current = createFreshForgeNpcs();
    setForgeNpcsState(forgeNpcsRef.current);
    blueHouseNpcsRef.current = createFreshBlueHouseNpcs();
    setBlueHouseNpcsState(blueHouseNpcsRef.current);
    kitchenNpcsRef.current = createFreshKitchenNpcs();
    setKitchenNpcsState(kitchenNpcsRef.current);
    graveyardNpcsRef.current = createFreshGraveyardNpcs();
    setGraveyardNpcsState(graveyardNpcsRef.current);
    whiteHouseNpcsRef.current = createFreshWhiteHouseNpcs();
    setWhiteHouseNpcsState(whiteHouseNpcsRef.current);
    hermitageNpcsRef.current = createFreshHermitageNpcs();
    setHermitageNpcsState(hermitageNpcsRef.current);
    summitNpcsRef.current = createFreshSummitNpcs();
    setSummitNpcsState(summitNpcsRef.current);
    rentedRoomNpcsRef.current = createFreshRentedRoomNpcs();
    setRentedRoomNpcsState(rentedRoomNpcsRef.current);
    lyricSanctuaryNpcsRef.current = createFreshLyricSanctuaryNpcs();
    setLyricSanctuaryNpcsState(lyricSanctuaryNpcsRef.current);
    cafeNpcsRef.current = createFreshCafeNpcs();
    setCafeNpcsState(cafeNpcsRef.current);
    shakespeareCoNpcsRef.current = createFreshShakespeareCoNpcs();
    setShakespeareCoNpcsState(shakespeareCoNpcsRef.current);

    setActiveOverworldScreen('HARBOR');
    activeOverworldScreenRef.current = 'HARBOR';

    setIsCinematicLocked(false);
    setIsCinematicHudVisible(true);

    overworldPlayerRef.current = {
      gridX: 4,
      gridY: 22,
      pxX: 4 * TILE_SIZE,
      pxY: 22 * TILE_SIZE,
      dir: 'RIGHT',
      isMoving: false,
      moveProgress: 0,
      fromX: 4,
      fromY: 22,
      targetX: 4,
      targetY: 22,
      walkStep: 0,
      isGliding: false,
      glideVx: 0,
      glideVy: 0,
    };
    iceSkateTrailsRef.current = [];
    iceShimmerParticlesRef.current = [];
    lastIceFootPosRef.current = null;
    hasPlayerMovedRef.current = false;
    givingTreeClicksRef.current = 0;
    setGivingTreeClicks(0);
    daffodilClicksRef.current = 0;
    setDaffodilClicks(0);
    propInspectIndexRef.current = {
      GEESE: 0,
      SKIFF: 0,
      CANTO1_BENCH: 0,
      CRATES: 0,
      MILESTONE: 0,
      SIGNPOST: 0,
      TOWN_PIGEONS: 0,
      GINGER_CAT: 0,
      TOWN_FOUNTAIN: 0,
      TOWN_BULLETIN: 0,
      TOWN_BOOKSTALLS: 0,
      TOWN_BISTRO_TABLES: 0,
      TOWN_BENCHES: 0,
      TOWN_BENCH_PANTHER: 0,
      TOWN_STREETLAMPS: 0,
      NIGHTINGALE_PIANO: 0,
      NIGHTINGALE_MIC: 0,
      NIGHTINGALE_ALE: 0,
      NIGHTINGALE_CANDLESTICK: 0,
      NIGHTINGALE_SONGBOOK: 0,
      NIGHTINGALE_CABARET_TABLE: 0,
      NIGHTINGALE_SLATE: 0,
      NIGHTINGALE_SHELVES: 0,
      NIGHTINGALE_POSTER: 0,
      NIGHTINGALE_SCONCE: 0,
      LUNCH_COKE: 0,
      LUNCH_PLUMS: 0,
      LUNCH_SUNDAE: 0,
      LUNCH_PHOTO: 0,
      LUNCH_JUKEBOX: 0,
      LUNCH_MENU: 0,
      LUNCH_PIE: 0,
      LUNCH_COFFEE: 0,
      LUNCH_SODA: 0,
      LUNCH_ELIOT_CUP: 0,
      LUNCH_BOOTH: 0,
      RENTED_URN: 0,
      RENTED_EASEL: 0,
      RENTED_DESK: 0,
      RENTED_BED: 0,
      RENTED_MANTEL: 0,
      RENTED_WINDOW: 0,
      RENTED_TABLE: 0,
      RENTED_TRUNK: 0,
      RENTED_WASHSTAND: 0,
      RENTED_RUG: 0,
      CLIFFS_DOG: 0,
      LORCA_GUITAR: 0,
      BRASS_TELESCOPE: 0,
      LIMESTONE_BENCH: 0,
      STONE_CAIRN: 0,
      SEA_BOULDER: 0,
      CYPRESS_GROVE: 0,
      LEMON_TREE: 0,
      VINEYARD_PERGOLA: 0,
      NERUDA_TABLE: 0,
      RELICS_CABINET: 0,
      DECK_LANTERN: 0,
      OCEAN_OVERLOOK: 0,
      RUINS_GOAT: 0,
      RUINS_FROG: 0,
      CALLIOPE_STATUE: 0,
      MUSE_STATUE: 0,
      COLUMN_DRUMS: 0,
      LIBRARY_PORTICO: 0,
      RUINS_BRIDGE: 0,
      KOI_POND: 0,
      RED_OAK: 0,
      TEA_PAVILION: 0,
      KHAYYAM_TABLE: 0,
      LI_BAI_SETTING: 0,
      BASHO_RELICS: 0,
      HEARTH_KETTLE: 0,
      GOAT_SIGN: 0,
      CEDAR_BAR: 0,
      ELIOT_DESK: 0,
      YEATS_TABLE: 0,
      POUND_LECTERN: 0,
      MOORE_LECTERN: 0,
      SOR_JUANA_DESK: 0,
      CENTRAL_TABLE: 0,
      CARD_CATALOG: 0,
      CELESTIAL_GLOBE: 0,
      ROLLING_LADDER: 0,
      BOOKSTACKS: 0,
      HOOK_JAWED_FISH: 0,
      CRIMSON_CRAB: 0,
      SALVAGE_WORKTABLE: 0,
      ARRIVAL_LEDGER: 0,
      OILSKIN_CHEST: 0,
      CORKED_BOTTLE: 0,
      LIGHTHOUSE_BEACON: 0,
      SHIPWRECK_RIBS: 0,
      BOATHOUSE_EXTERIOR: 0,
      BOATHOUSE_PRESS: 0,
      DAFFODIL_GLADE: 0,
    };
    setOverworldDialogue(null);

    setCurrentScreen('OVERWORLD');
    setGameState({
      status: 'PLAYING',
      score: 500,
      level: 1,
    });

    gameAudio.playConfirmSelect();
    triggerHaptics([40, 70]);
    if (sdk) sdk.startGame();
  }, [sdk]);

  // Advance opening scene with smooth, immediately responsive slide dissolve (200ms ease-out) without stuttering
  const advanceOpeningScene = useCallback(() => {
    if (isOpeningBlackout || isSlideDissolving || isInBlackWait || isAdvancingPrologueRef.current) return;

    // Immediately responsive advance with gentle 200ms dissolve between slides
    isAdvancingPrologueRef.current = true;
    setIsSlideDissolving(true);

    setTimeout(() => {
      // 200ms: slide has dissolved. Brief pure black pause.
      setIsInBlackWait(true);

      if (openingSceneIndex < OPENING_SCENE_DIALOGUE.length - 1) {
        const nextIndex = openingSceneIndex + 1;
        setOpeningSceneIndex(nextIndex);
        setSlideRevealKey((k) => k + 1);

        soundtrackEngine.setPrologueSlide(nextIndex);
        gameAudio.playPrologueAdvance(nextIndex);
        triggerHaptics(30);

        setTimeout(() => {
          // Brief 50ms pause in black completed: reveal new slide smoothly
          setIsSlideDissolving(false);
          setIsInBlackWait(false);
          isAdvancingPrologueRef.current = false;
        }, 50);
      } else {
        // Advancing past Slide 13 (Whitman):
        // Fade out text (300ms) and sub-bass into 1000ms of complete silence and darkness before opening CREATE YOUR READER
        soundtrackEngine.fadePrologueToSilence(300);
        setIsOpeningBlackout(true);

        setTimeout(() => {
          setIsOpeningBlackout(false);
          setIsSlideDissolving(false);
          setIsInBlackWait(false);
          isAdvancingPrologueRef.current = false;
          setCurrentScreen('NAME_ENTRY');
        }, 1000);
      }
    }, 200);
  }, [
    isInBlackWait,
    isOpeningBlackout,
    isSlideDissolving,
    openingSceneIndex,
  ]);

  const skipOpeningScene = useCallback(() => {
    isHoldingSkipRef.current = false;
    isButtonHoldingSkipRef.current = false;
    setSkipHoldProgress(0);
    skipHoldStartRef.current = null;
    setIsOpeningBlackout(false);
    setIsSlideDissolving(false);
    setIsInBlackWait(false);
    isAdvancingPrologueRef.current = false;
    gameAudio.playCrispClick();
    soundtrackEngine.fadePrologueToSilence(200);
    setCurrentScreen('NAME_ENTRY');
  }, []);

  const startSkipHold = useCallback(() => {
    if (isHoldingSkipRef.current) return;
    isHoldingSkipRef.current = true;
    skipHoldStartRef.current = performance.now();

    const updateHold = (now: number) => {
      if (!isHoldingSkipRef.current) {
        setSkipHoldProgress(0);
        skipHoldStartRef.current = null;
        return;
      }
      const elapsed = now - (skipHoldStartRef.current ?? now);
      const progress = Math.min(1, elapsed / 800);
      setSkipHoldProgress(progress);

      if (progress >= 1) {
        isHoldingSkipRef.current = false;
        isButtonHoldingSkipRef.current = false;
        setSkipHoldProgress(0);
        skipHoldStartRef.current = null;
        skipOpeningScene();
      } else {
        requestAnimationFrame(updateHold);
      }
    };
    requestAnimationFrame(updateHold);
  }, [skipOpeningScene]);

  const stopSkipHold = useCallback(() => {
    isHoldingSkipRef.current = false;
    isButtonHoldingSkipRef.current = false;
    setSkipHoldProgress(0);
    skipHoldStartRef.current = null;
  }, []);

  // Synchronize 4-Movement conceptual audio score across prologue slides
  useEffect(() => {
    if (currentScreen !== 'OPENING_SCENE') return;
    soundtrackEngine.setPrologueSlide(openingSceneIndex);
  }, [currentScreen, openingSceneIndex]);

  // Sprite rotation with wooden tick and micro-hop
  const rotatePreviewSprite = useCallback(() => {
    gameAudio.playSpriteRotateTick();
    setIsSpriteHopping(true);
    setTimeout(() => setIsSpriteHopping(false), 65);
    const dirs: FacingDirection[] = ['DOWN', 'LEFT', 'UP', 'RIGHT'];
    setPreviewDir((prev) => dirs[(dirs.indexOf(prev) + 1) % dirs.length]);
  }, []);

  const submitPlayerName = useCallback(() => {
    const trimmed = nameInput.trim();
    const finalName = trimmed.length > 0 ? trimmed : 'Reader';
    setPlayerName(finalName);
    setHarborPlayerCustomization(playerCustom, hasLaurel);
    gameAudio.playConfirmSelect();
    triggerHaptics([40, 70]);

    // 1. Immediately lock inputs & hide HUD while still on NAME_ENTRY screen
    setIsCinematicLocked(true);
    setIsCinematicHudVisible(false);
    setIsCantoCardVisible(false);

    // 2. Start Harbor music immediately at user action with zero startup silence
    soundtrackEngine.setDucking(false);
    void soundtrackEngine.switchRoom('HARBOR', false);

    // 3. Smoothly fade the Name Entry screen into black over 300ms
    setCurtainTransitionDuration('300ms ease-out');
    setScreenCurtainAlpha(1.0);
    setCinematicCurtainAlpha(1.0);

    // 4. T+300ms: Mount Harbor overworld with music already playing and audible
    setTimeout(() => {
      startClimbOverworld(finalName, playerCustom);

      // 5. T+400ms: Smoothly fade up from black over 400ms revealing the harbor
      setTimeout(() => {
        setCurtainTransitionDuration('400ms ease-out');
        setScreenCurtainAlpha(0.0);
        setCinematicCurtainAlpha(0.0);
        setIsCinematicHudVisible(true);
        setIsCinematicLocked(false);

        // 6. Trigger Canto I chapter card naturally with music already blooming
        setTimeout(() => {
          triggerCantoCard('HARBOR', true);
        }, 200);
      }, 100);
    }, 300);
  }, [hasLaurel, nameInput, playerCustom, startClimbOverworld, triggerCantoCard]);

  // Choose a poet from the Spring Choice Menu
  const chooseSpringPoet = useCallback((poetId: string) => {
    setIsSpringMenuOpen(false);
    const poet = getPoetById(poetId);
    setChosenEndingPoetId(poet.id);
    setSpringPoetStanding({ poetId: poet.id, facing: 'UP' });
    setPostGameSeason(poet.season);
    try {
      localStorage.setItem('poetmon_postgame_season', poet.season);
    } catch {
      // ignore
    }
    setEndingStage('READING_TRANSITION');
    setEndingTransitionProgress(0);
    gameAudio.playPowerupChime();
    triggerHaptics([60, 100, 150]);
  }, []);

  // Advance through the stages of THE ENDING sequence
  const advanceEndingSequence = useCallback(() => {
    const currentStage = endingStageRef.current;
    if (currentStage === 'POEM_TITLE') {
      gameAudio.playCrispClick();
      triggerHaptics(30);
      setEndingStage('SEASON_EPIGRAPH');
    } else if (currentStage === 'SEASON_EPIGRAPH') {
      gameAudio.playCrispClick();
      triggerHaptics(30);
      setEndingStage('WHITMAN_LINE');
    } else if (currentStage === 'WHITMAN_LINE') {
      gameAudio.playCrispClick();
      triggerHaptics(35);
      setEndingStage('BLACKOUT_WAIT');
      setTimeout(() => {
        if (!hasLaurel) {
          setHasLaurel(true);
          setHarborPlayerHasLaurel(true);
          try {
            localStorage.setItem('poetmon_has_laurel', 'true');
          } catch {
            // ignore
          }
          setEndingStage('LAUREL_REVEAL');
          gameAudio.playLevelUpStinger();
          triggerHaptics([80, 50, 120]);
        } else {
          setEndingStage('CREDITS');
          setCreditsScrollY(0);
        }
      }, 2000);
    } else if (currentStage === 'LAUREL_REVEAL') {
      gameAudio.playConfirmSelect();
      triggerHaptics(40);
      setEndingStage('CREDITS');
      setCreditsScrollY(0);
    } else if (currentStage === 'CREDITS') {
      gameAudio.playConfirmSelect();
      triggerHaptics(40);
      setEndingStage('IDLE');
    }
  }, [hasLaurel]);

  // Overworld Screen Transition Handler (silent, zero-glitch transition)
  const transitionOverworldScreen = useCallback((targetScreen: OverworldScreenId, targetX: number, targetY: number, facing: FacingDirection) => {
    setScreenCurtainAlpha(1);
    setIsTransitioningScreen(true);
    isTransitioningScreenRef.current = true;

    if (targetScreen === 'TREELINE') {
      if (!whiteHouseUnlockedRef.current) {
        setWhiteHouseUnlocked(true);
        whiteHouseUnlockedRef.current = true;
      }
    }

    setTimeout(() => {
      if (targetScreen === 'LUNCH_COUNTER') {
        lunchNpcsRef.current = createFreshLunchNpcs();
        setLunchNpcsState(lunchNpcsRef.current);
      }
      climbVisitedScreensRef.current.add(targetScreen);
      climbSavePosRef.current = { screen: targetScreen, x: targetX, y: targetY };
      setClimbSaveTick((t) => t + 1);
      if (targetScreen === 'TOWN') {
        // Whoever's turn it is takes the soapbox, based on how far the Reader has climbed this game
        townNpcsRef.current = arrangeSoapbox(townNpcsRef.current, climbVisitedScreensRef.current);
        setTownNpcsState(townNpcsRef.current);
      }
      setActiveOverworldScreen(targetScreen);
      activeOverworldScreenRef.current = targetScreen;

      const isInterior =
        targetScreen === 'CAFE_DE_FLORE' ||
        targetScreen === 'ROOM_CAFE_DE_FLORE' ||
        targetScreen === 'SHAKESPEARE_CO' ||
        targetScreen === 'ROOM_SHAKESPEARE_CO' ||
        targetScreen === 'ROOM_BOATHOUSE' ||
        targetScreen === 'BOATHOUSE' ||
        targetScreen === 'LYRIC_SANCTUARY' ||
        targetScreen === 'RENTED_ROOM' ||
        targetScreen === 'HERMITAGE' ||
        targetScreen === 'WHITE_HOUSE' ||
        targetScreen === 'GRAVEYARD' ||
        targetScreen === 'KITCHEN' ||
        targetScreen === 'LIBRARY' ||
        targetScreen === 'NIGHTINGALE' ||
        targetScreen === 'LUNCH_COUNTER' ||
        targetScreen === 'FORGE' ||
        targetScreen === 'BLUE_HOUSE' ||
        targetScreen === 'MOUNTAIN_GOAT';

      const mapCols = isInterior ? 16 : EXTERIOR_COLS;
      const mapRows = isInterior ? 12 : EXTERIOR_ROWS;

      const targetScreenData =
        targetScreen === 'CAFE_DE_FLORE' || targetScreen === 'ROOM_CAFE_DE_FLORE' ? buildCafeDeFloreScreen() :
        targetScreen === 'SHAKESPEARE_CO' || targetScreen === 'ROOM_SHAKESPEARE_CO' ? buildShakespeareCoScreen() :
        targetScreen === 'ROOM_BOATHOUSE' || targetScreen === 'BOATHOUSE' ? buildBoathouseScreen() :
        targetScreen === 'LYRIC_SANCTUARY' ? buildLyricSanctuaryScreen() :
        targetScreen === 'RENTED_ROOM' ? buildRentedRoomScreen() :
        targetScreen === 'SUMMIT' ? buildSummitScreen6(hasLaurel) :
        targetScreen === 'HERMITAGE' ? buildHermitageScreen() :
        targetScreen === 'WHITE_HOUSE' ? buildWhiteHouseScreen() :
        targetScreen === 'GRAVEYARD' ? buildGraveyardScreen() :
        targetScreen === 'KITCHEN' ? buildKitchenScreen() :
        targetScreen === 'LIBRARY' ? buildLibraryScreen() :
        targetScreen === 'MOUNTAIN_GOAT' ? buildMountainGoatScreen() :
        targetScreen === 'BLUE_HOUSE' ? buildBlueHouseScreen() :
        targetScreen === 'FORGE' ? buildForgeScreen() :
        targetScreen === 'LUNCH_COUNTER' ? buildLunchCounterScreen() :
        targetScreen === 'NIGHTINGALE' ? buildNightingaleScreen() :
        targetScreen === 'TREELINE' ? buildTreelineScreen5() :
        targetScreen === 'RUINS' ? buildRuinsScreen4() :
        targetScreen === 'CLIFFS' ? buildCliffsScreen3() :
        targetScreen === 'TOWN' ? buildTownScreen2() :
        buildHarborScreen1();

      const safePos = findNearestWalkableTile(targetScreenData, targetX, targetY, mapCols, mapRows);
      const finalX = safePos.x;
      const finalY = safePos.y;

      overworldPlayerRef.current = {
        gridX: finalX,
        gridY: finalY,
        pxX: finalX * TILE_SIZE,
        pxY: finalY * TILE_SIZE,
        dir: facing,
        isMoving: false,
        moveProgress: 0,
        fromX: finalX,
        fromY: finalY,
        targetX: finalX,
        targetY: finalY,
        walkStep: 0,
        isGliding: false,
        glideVx: 0,
        glideVy: 0,
      };
      iceSkateTrailsRef.current = [];
      iceShimmerParticlesRef.current = [];
      lastIceFootPosRef.current = null;
      setOverworldDialogue(null);

      setTimeout(() => {
        setScreenCurtainAlpha(0);
        setIsTransitioningScreen(false);
        isTransitioningScreenRef.current = false;

        // 6-Canto Card: Check first-time entry to exterior biome (Cantos II–VI)
        if (CANTO_CARDS[targetScreen] && !visitedCantosRef.current.has(targetScreen)) {
          setTimeout(() => {
            triggerCantoCard(targetScreen, false);
          }, 150);
        } else if (CANTO_CARDS[targetScreen]) {
          // Returning to exterior biome: ensure player has at least 3 Blank Books
          setBagInventory((prev) =>
            prev.map((item) =>
              item.id === 'BLANK_BOOK' ? { ...item, count: Math.max(3, item.count) } : item,
            ),
          );
        }
      }, 150);
    }, 200);
  }, [hasLaurel, triggerCantoCard]);

  // Write the saved climb whenever the anthology changes or a door is walked through.
  useEffect(() => {
    if (!hasStartedClimb || selectedGameMode !== 'CLIMB' || !climbSaveReadyRef.current) return;
    try {
      const save: ClimbSave = {
        v: 1,
        name: playerName,
        custom: playerCustom,
        captured: capturedPoetIds,
        lineup: playerLineup,
        active: activePlayerPoetId,
        pos: climbSavePosRef.current,
        visited: [...climbVisitedScreensRef.current],
      };
      localStorage.setItem(CLIMB_SAVE_KEY, JSON.stringify(save));
      setHasSavedClimb(true);
    } catch {
      // ignore: the game still plays, it just will not be remembered
    }
  }, [hasStartedClimb, selectedGameMode, playerName, playerCustom, capturedPoetIds, playerLineup, activePlayerPoetId, climbSaveTick]);

  // Pick a saved climb back up from the title screen.
  resumeSavedClimbRef.current = (save: ClimbSave) => {
    startClimbOverworld(save.name || 'READER', save.custom ?? undefined);
    setCapturedPoetIds(save.captured);
    setPlayerLineup(save.lineup);
    setActivePlayerPoetId(save.active || save.lineup[0] || '');
    setScreenCurtainAlpha(0);
    setCinematicCurtainAlpha(0);
    setIsCinematicHudVisible(true);
    setIsCinematicLocked(false);
    climbVisitedScreensRef.current = new Set(save.visited?.length ? save.visited : ['HARBOR']);
    const pos = save.pos;
    if (pos) {
      climbSavePosRef.current = pos;
      window.setTimeout(() => {
        transitionOverworldScreen(pos.screen as OverworldScreenId, pos.x, pos.y, 'DOWN');
      }, 300);
    }
  };

  // STUDIO TOOL: jump straight to a spot for testing. Does nothing unless the address
  // has ?warp= in it, e.g.  ?warp=TOWN,30,25  or  ?warp=TOWN,30,25&seen=CLIFFS,RUINS
  // ("seen" pretends the Reader has already reached those screens this climb).
  const warpDoneRef = useRef(false);
  useEffect(() => {
    if (warpDoneRef.current) return;
    let warp: string | null = null;
    let seen: string | null = null;
    try {
      const params = new URLSearchParams(window.location.search);
      warp = params.get('warp');
      seen = params.get('seen');
    } catch {
      return;
    }
    if (!warp) return;
    const [screen, wx, wy] = warp.split(',');
    const x = Number(wx);
    const y = Number(wy);
    if (!screen || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const timer = window.setTimeout(() => {
      if (warpDoneRef.current) return;
      warpDoneRef.current = true;
      startClimbOverworld('READER');
      climbSaveReadyRef.current = false; // A test warp never overwrites the real saved climb
      setScreenCurtainAlpha(0);
      setCinematicCurtainAlpha(0);
      setIsCinematicHudVisible(true);
      setIsCinematicLocked(false);
      if (seen) seen.split(',').forEach((id) => climbVisitedScreensRef.current.add(id.trim()));
      try {
        if (new URLSearchParams(window.location.search).get('ungated')) duelGateOffRef.current = true;
      } catch {
        // ignore
      }
      window.setTimeout(() => {
        transitionOverworldScreen(screen as OverworldScreenId, x, y, 'DOWN');
      }, 300);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [startClimbOverworld, transitionOverworldScreen]);

  // Present Pokemon-style TALK / DUEL / LEAVE choice prompt for overworld poets
  // Supports cycling lines in-place, seamless DUEL transition, and LEAVE dismissal.
  // SOFT GATE. The mountain is open to walk, but a chapter poet will not duel you
  // until every chapter below theirs is finished. Returns the line they say instead,
  // or null when the duel can go ahead. Poets outside the chapters (the bonus duels:
  // Darwish, Baudelaire, Thoreau) are never gated. Adding &ungated=1 to a ?warp=
  // address switches the gate off for testing.
  const duelGateOffRef = useRef(false);
  const duelGateRef = useRef<(poetId: string) => string | null>(() => null);
  duelGateRef.current = (poetId: string) => {
    if (duelGateOffRef.current) return null;
    const chapterIndex = CHAPTER_GATES.findIndex((gate) => gate.poetIds.includes(poetId));
    if (chapterIndex <= 0) return null;
    const unfinished = CHAPTER_GATES.slice(0, chapterIndex).find((gate) =>
      gate.poetIds.some((id) => !capturedPoetIds.includes(id)),
    );
    if (!unfinished) return null;
    const season = unfinished.season.charAt(0) + unfinished.season.slice(1).toLowerCase();
    return `Not yet, Reader. You haven't finished ${season}.`;
  };

  const promptPoetChoiceMenu = useCallback(
    (
      speakerName: string,
      promptText: string,
      talkLines: string | string[],
      duelText: string,
      enemyPoetId?: string,
      onAfterTalk?: () => void,
    ) => {
      gameAudio.playConfirmSelect();
      triggerHaptics(35);
      soundtrackEngine.triggerSfxDucking(450, 0.82);
      const linesArray = Array.isArray(talkLines) ? talkLines : [talkLines];
      let currentTalkIdx = 0;

      const choiceOptions: Array<{ label: 'TALK' | 'DUEL' | 'LEAVE' | 'JOIN'; action: () => void }> = [
        {
          label: 'TALK',
          action: () => {
            gameAudio.playCrispClick();
            triggerHaptics(30);
            const line = linesArray[currentTalkIdx % linesArray.length] || promptText;
            currentTalkIdx = (currentTalkIdx + 1) % linesArray.length;
            setOverworldDialogue((prev) => ({
              active: true,
              speakerName,
              text: line,
              showChoiceMenu: true,
              choiceOptions: prev?.choiceOptions || choiceOptions,
              onComplete: onAfterTalk,
            }));
          },
        },
      ];

      if (enemyPoetId) {
        choiceOptions.push({
          label: 'DUEL',
          action: () => {
            const gateLine = duelGateRef.current(enemyPoetId);
            if (gateLine) {
              // Not their turn yet: they say so, and the menu stays open
              gameAudio.playMenuCancel();
              triggerHaptics(25);
              setOverworldDialogue((prev) => ({
                active: true,
                speakerName,
                text: gateLine,
                showChoiceMenu: true,
                choiceOptions: prev?.choiceOptions || choiceOptions,
                onComplete: onAfterTalk,
              }));
              return;
            }
            gameAudio.playArcadeLaser();
            triggerHaptics([40, 60]);
            setOverworldDialogue({
              active: true,
              speakerName,
              text: duelText,
              onComplete: () => {
                const heroId = activePlayerPoetId || (capturedPoetIds[0] ?? 'WHITMAN');
                initBattle(heroId, enemyPoetId);
              },
            });
          },
        });
      }

      choiceOptions.push({
        label: 'LEAVE',
        action: () => {
          gameAudio.playMenuCancel();
          triggerHaptics(25);
          setOverworldDialogue(null);
          if (onAfterTalk) onAfterTalk();
        },
      });

      setOverworldDialogue({
        active: true,
        speakerName,
        text: promptText,
        showChoiceMenu: true,
        choiceOptions,
      });
    },
    [activePlayerPoetId, capturedPoetIds, initBattle],
  );

  const lastInteractTimeRef = useRef<number>(0);

  // Overworld Interaction Trigger
  const interactFacingTile = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractTimeRef.current < 90) return;
    lastInteractTimeRef.current = now;

    if (isTransitioningScreen) return;
    if (battleExitGraceUntilRef.current > Date.now()) return;
    if (overworldDialogueRef.current?.active) {
      if (overworldDialogueRef.current.showChoiceMenu) {
        // Player pressed confirm / action key while choice menu is open: trigger TALK
        const talkOpt = overworldDialogueRef.current.choiceOptions?.find((o) => o.label === 'TALK');
        if (talkOpt) {
          talkOpt.action();
        }
        return;
      }
      if (overworldDialogueRef.current.onComplete) {
        const cb = overworldDialogueRef.current.onComplete;
        overworldDialogueRef.current = null;
        setOverworldDialogue(null);
        setHarborNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            facing:
              n.id === 'npc_darwish' || n.poetId === 'DARWISH'
                ? 'DOWN'
                : n.id === 'npc_mary_oliver' || n.poetId === 'MARY_OLIVER'
                ? 'UP'
                : n.id === 'npc_cavafy' || n.poetId === 'CAVAFY'
                ? 'DOWN'
                : n.id === 'npc_walcott' || n.poetId === 'WALCOTT'
                ? n.walcottRoutine?.phase === 'STROLL_WEST'
                  ? 'LEFT'
                  : n.walcottRoutine?.phase === 'STROLL_EAST'
                  ? 'RIGHT'
                  : 'DOWN'
                : n.facing,
            movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
          })),
        );
        setTownNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            facing: n.id === 'npc_town_rumi' || n.poetId === 'RUMI' ? 'RIGHT' : n.facing,
          })),
        );
        setCliffsNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        if (coastalDogRef.current) {
          coastalDogRef.current.isInteracting = false;
          coastalDogRef.current.state = 'IDLE';
          coastalDogRef.current.stateTimer = 2.0;
          coastalDogRef.current.pauseTimer = 2.0;
        }
        setRuinsNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setTreelineNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setMountainGoatNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setLibraryNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setNightingaleNpcs((prev) =>
          prev.map((n) => {
            let restoreFacing = n.facing;
            if (n.id === 'npc_nightingale_hughes' || n.poetId === 'HUGHES') {
              restoreFacing = 'DOWN';
            } else if (n.id === 'npc_nightingale_dylan' || n.poetId === 'DYLAN_THOMAS') {
              restoreFacing = 'UP';
            }
            return {
              ...n,
              isInteracting: false,
              facing: restoreFacing,
              movement: n.movement
                ? (n.movement.type === 'PATH'
                    ? { ...n.movement, pauseTimer: 2.5 }
                    : n.movement.type === 'TURN'
                    ? { ...n.movement, timer: 0 }
                    : n.movement)
                : undefined,
            };
          }),
        );
        setLunchNpcs((prev) =>
          prev.map((n) => {
            if (!n.isInteracting) return n;
            let restoreFacing = n.facing;
            if (n.id === 'npc_lunch_brooks') {
              restoreFacing = 'UP';
            } else if ((n.id === 'npc_lunch_wcw' || n.poetId === 'WCW') && n.x === 11 && n.y === 4) {
              restoreFacing = 'UP';
            } else if ((n.id === 'npc_lunch_ohara' || n.poetId === 'OHARA') && n.x === 5 && n.y === 4) {
              restoreFacing = 'UP';
            } else if ((n.id === 'npc_lunch_stevens' || n.poetId === 'STEVENS') && n.x === 8 && n.y === 4) {
              restoreFacing = 'UP';
            }
            return {
              ...n,
              isInteracting: false,
              facing: restoreFacing,
              movement: n.movement
                ? (n.movement.type === 'PATH'
                    ? {
                        ...n.movement,
                        pauseTimer:
                          n.id === 'npc_lunch_stevens'
                            ? 3.5 + Math.random() * 1.5
                            : n.id === 'npc_lunch_ohara'
                            ? 3.0 + Math.random() * 1.5
                            : n.id === 'npc_lunch_wcw'
                            ? 3.5 + Math.random() * 1.5
                            : 3.0,
                      }
                    : n.movement.type === 'TURN'
                    ? { ...n.movement, timer: 0 }
                    : n.movement)
                : undefined,
            };
          }),
        );
        setForgeNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setBlueHouseNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setKitchenNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setGraveyardNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setWhiteHouseNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setHermitageNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setSummitNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setRentedRoomNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            facing:
              n.id === 'baudelaire' || n.poetId === 'baudelaire' || n.poetId === 'BAUDELAIRE'
                ? 'RIGHT'
                : n.facing,
          })),
        );
        cb();
      } else {
        setOverworldDialogue(null);
        setHarborNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            facing:
              n.id === 'npc_darwish' || n.poetId === 'DARWISH'
                ? 'DOWN'
                : n.id === 'npc_mary_oliver' || n.poetId === 'MARY_OLIVER'
                ? 'UP'
                : n.id === 'npc_cavafy' || n.poetId === 'CAVAFY'
                ? 'DOWN'
                : n.id === 'npc_walcott' || n.poetId === 'WALCOTT'
                ? n.walcottRoutine?.phase === 'STROLL_WEST'
                  ? 'LEFT'
                  : n.walcottRoutine?.phase === 'STROLL_EAST'
                  ? 'RIGHT'
                  : 'DOWN'
                : n.facing,
            movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
          })),
        );
        setTownNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            facing: n.id === 'npc_town_rumi' || n.poetId === 'RUMI' ? 'RIGHT' : n.facing,
          })),
        );
        setCliffsNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        if (coastalDogRef.current) {
          coastalDogRef.current.isInteracting = false;
          coastalDogRef.current.state = 'IDLE';
          coastalDogRef.current.stateTimer = 2.0;
          coastalDogRef.current.pauseTimer = 2.0;
        }
        setRuinsNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setTreelineNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setMountainGoatNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setLibraryNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setNightingaleNpcs((prev) =>
          prev.map((n) => {
            let restoreFacing = n.facing;
            if (n.id === 'npc_nightingale_hughes' || n.poetId === 'HUGHES') {
              restoreFacing = 'DOWN';
            } else if (n.id === 'npc_nightingale_dylan' || n.poetId === 'DYLAN_THOMAS') {
              restoreFacing = 'UP';
            }
            return {
              ...n,
              isInteracting: false,
              facing: restoreFacing,
              movement: n.movement
                ? (n.movement.type === 'PATH'
                    ? { ...n.movement, pauseTimer: 2.5 }
                    : n.movement.type === 'TURN'
                    ? { ...n.movement, timer: 0 }
                    : n.movement)
                : undefined,
            };
          }),
        );
        setLunchNpcs((prev) =>
          prev.map((n) => {
            if (!n.isInteracting) return n;
            let restoreFacing = n.facing;
            if (n.id === 'npc_lunch_brooks') {
              restoreFacing = 'UP';
            } else if ((n.id === 'npc_lunch_wcw' || n.poetId === 'WCW') && n.x === 11 && n.y === 4) {
              restoreFacing = 'UP';
            } else if ((n.id === 'npc_lunch_ohara' || n.poetId === 'OHARA') && n.x === 5 && n.y === 4) {
              restoreFacing = 'UP';
            } else if ((n.id === 'npc_lunch_stevens' || n.poetId === 'STEVENS') && n.x === 8 && n.y === 4) {
              restoreFacing = 'UP';
            }
            return {
              ...n,
              isInteracting: false,
              facing: restoreFacing,
              movement: n.movement
                ? (n.movement.type === 'PATH'
                    ? {
                        ...n.movement,
                        pauseTimer:
                          n.id === 'npc_lunch_stevens'
                            ? 3.5 + Math.random() * 1.5
                            : n.id === 'npc_lunch_ohara'
                            ? 3.0 + Math.random() * 1.5
                            : n.id === 'npc_lunch_wcw'
                            ? 3.5 + Math.random() * 1.5
                            : 3.0,
                      }
                    : n.movement.type === 'TURN'
                    ? { ...n.movement, timer: 0 }
                    : n.movement)
                : undefined,
            };
          }),
        );
        setForgeNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setBlueHouseNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setKitchenNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setGraveyardNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setWhiteHouseNpcs((prev) => prev.map((n) => ({ ...n, isInteracting: false })));
        setHermitageNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setSummitNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            movement: n.movement
              ? (n.movement.type === 'PATH'
                  ? { ...n.movement, pauseTimer: 2.5 }
                  : n.movement.type === 'TURN'
                  ? { ...n.movement, timer: 0 }
                  : n.movement)
              : undefined,
          })),
        );
        setRentedRoomNpcs((prev) =>
          prev.map((n) => ({
            ...n,
            isInteracting: false,
            facing:
              n.id === 'baudelaire' || n.poetId === 'baudelaire' || n.poetId === 'BAUDELAIRE'
                ? 'RIGHT'
                : n.facing,
          })),
        );
      }
      gameAudio.playCrispClick();
      return;
    }

    const p = overworldPlayerRef.current;
    if (p.isMoving) return;

    let facingX = p.gridX;
    let facingY = p.gridY;
    if (p.dir === 'UP') facingY -= 1;
    else if (p.dir === 'DOWN') facingY += 1;
    else if (p.dir === 'LEFT') facingX -= 1;
    else if (p.dir === 'RIGHT') facingX += 1;

    const currentScreenId = activeOverworldScreenRef.current;
    const leadPoetId = (activePlayerPoetId || playerLineupRef.current[0] || 'WHITMAN').toUpperCase();

    // =========================================================================
    // INTERIOR 14: CAFÉ DE FLORE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'CAFE_DE_FLORE' || currentScreenId === 'ROOM_CAFE_DE_FLORE') {
      // 1. South Exit Door to Town Square at X: 7..8, Y: 11
      const isExitDoor =
        (facingX === 7 || facingX === 8) && (facingY === 11 || facingY === 10) ||
        ((p.gridX === 7 || p.gridX === 8) && (p.gridY === 10 || p.gridY === 11) && p.dir === 'DOWN');
      if (isExitDoor && (p.dir === 'DOWN' || facingY === 11)) {
        transitionOverworldScreen('TOWN', 13, 7, 'DOWN');
        return;
      }

      // 2. Barista behind the Mahogany Bar Counter at X: 5, Y: 2
      // Approachable facing the counter at Y: 3 (X: 4..6) facing UP
      const isFacingBarista =
        (facingX === 5 && facingY === 2) ||
        ((facingX >= 4 && facingX <= 6) && facingY === 3 && p.dir === 'UP') ||
        ((p.gridX >= 4 && p.gridX <= 6) && p.gridY === 4 && p.dir === 'UP');

      if (isFacingBarista) {
        gameAudio.playEspressoMachine();
        gameAudio.playPotionGulp();
        triggerHaptics([40, 80, 120]);

        // Restores spirit: heal active poet by +15 HP up to max HP and grant +15 IP
        const leadId = activePlayerPoetId || playerLineup[0] || 'MARY_OLIVER';
        const leadPoetObj = getPoetById(leadId);
        const maxHp = leadPoetObj.hp;

        if (leadId === activePlayerPoetId) {
          const nextHp = Math.min(maxHp, playerHpRef.current + 15);
          setPlayerHp(nextHp);
          playerHpRef.current = nextHp;
          playerDisplayHpRef.current = nextHp;
        }
        setLineupHpMap((prev) => ({ ...prev, [leadId]: Math.min(maxHp, (prev[leadId] ?? maxHp) + 15) }));
        lineupHpMapRef.current[leadId] = Math.min(maxHp, (lineupHpMapRef.current[leadId] ?? maxHp) + 15);
        setGameState((prev) => ({ ...prev, score: prev.score + 150 }));
        addFloatingText(p.pxX + 8, p.pxY - 10, '+15 INSPIRATION!', '#fbbf24', 16);

        // Jacques Prévert, who used to be a nameless Barista
        const baristaLines = [
          "Bonjour. Jacques Prévert. I don't work here. Nobody else was making the coffee. Drink this. (+15 Inspiration Points / +15 HP)",
          "Apollinaire's in the corner drawing his poems again. Nobody tell him the words go in lines. (+15 Inspiration Points / +15 HP)",
          'Sartre and de Beauvoir take the table by the heater at ten. I leave before that. (+15 Inspiration Points / +15 HP)',
        ];
        const count = (interactionCountsRef.current.cafe_barista || 0) + 1;
        interactionCountsRef.current.cafe_barista = count;
        setInteractionState((prev) => ({ ...prev, cafe_barista: count }));
        const curIdx = (count - 1) % baristaLines.length;

        setOverworldDialogue({
          active: true,
          speakerName: 'JACQUES PRÉVERT',
          text: baristaLines[curIdx],
        });
        return;
      }

      // 3. Steaming Vintage Brass Espresso Machine at X: 3..4, Y: 3
      if ((facingX === 3 || facingX === 4) && (facingY === 3 || facingY === 2)) {
        gameAudio.playEspressoMachine();
        triggerHaptics(35);
        const lines = ROOM_CAFE_DE_FLORE.props.espresso_machine;
        const count = (interactionCountsRef.current.espresso_machine || 0) + 1;
        interactionCountsRef.current.espresso_machine = count;
        setInteractionState((prev) => ({ ...prev, espresso_machine: count }));
        const curIdx = (count - 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'LA MARZOCCO ESPRESSO MACHINE',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Guillaume Apollinaire at Corner Table (X: 10, Y: 4 or table at 10, 5)
      const isFacingApollinaire =
        (facingX === 10 && facingY === 4) ||
        (facingX === 10 && facingY === 5 && p.dir === 'UP') ||
        (p.gridX === 10 && p.gridY === 6 && p.dir === 'UP') ||
        (p.gridX === 9 && p.gridY === 4 && p.dir === 'RIGHT') ||
        (p.gridX === 11 && p.gridY === 4 && p.dir === 'LEFT');

      if (isFacingApollinaire) {
        promptPoetChoiceMenu(
          ROOM_CAFE_DE_FLORE.entities.apollinaire.name,
          ROOM_CAFE_DE_FLORE.entities.apollinaire.greeting,
          ROOM_CAFE_DE_FLORE.entities.apollinaire.talkLines,
          '',
          undefined,
          () => {
            setCafeNpcs((prev) =>
              prev.map((n) => (n.id === 'npc_cafe_apollinaire' ? { ...n, isInteracting: false, facing: 'LEFT' } : n)),
            );
          },
        );
        return;
      }

      // 5. Apollinaire's Notebook with Calligramme at X: 10, Y: 5
      if (facingX === 10 && facingY === 5) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_CAFE_DE_FLORE.props.apollinaire_table;
        setOverworldDialogue({
          active: true,
          speakerName: "APOLLINAIRE'S NOTEBOOK",
          text: lines[0],
        });
        return;
      }

      // 6. Mahogany Bar Counter (X: 5..7, Y: 3)
      if (facingX >= 3 && facingX <= 7 && facingY === 3) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_CAFE_DE_FLORE.props.mahogany_bar;
        setOverworldDialogue({
          active: true,
          speakerName: 'MAHOGANY BAR COUNTER',
          text: lines[0],
        });
        return;
      }

      // 7. Bistro Table 2 (X: 3, Y: 7) and Table 3 (X: 12, Y: 8)
      if ((facingX === 3 && facingY === 7) || (facingX === 12 && facingY === 8)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_CAFE_DE_FLORE.props.bistro_table;
        setOverworldDialogue({
          active: true,
          speakerName: 'MARBLE BISTRO TABLE',
          text: lines[1] || lines[0],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 15: SHAKESPEARE AND COMPANY INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'SHAKESPEARE_CO' || currentScreenId === 'ROOM_SHAKESPEARE_CO') {
      // 1. South Exit Door to Town Square at X: 7..8, Y: 11
      const isExitDoor =
        (facingX === 7 || facingX === 8) && (facingY === 11 || facingY === 10) ||
        ((p.gridX === 7 || p.gridX === 8) && (p.gridY === 10 || p.gridY === 11) && p.dir === 'DOWN');
      if (isExitDoor && (p.dir === 'DOWN' || facingY === 11)) {
        transitionOverworldScreen('TOWN', 23, 7, 'DOWN');
        return;
      }

      // 2. Sylvia Beach behind the Oak Reading Desk at X: 8, Y: 2
      // Approachable facing desk at Y: 3 (X: 7..8) facing UP
      const isFacingSylvia =
        (facingX === 8 && facingY === 2) ||
        ((facingX === 7 || facingX === 8) && facingY === 3 && p.dir === 'UP') ||
        ((p.gridX === 7 || p.gridX === 8) && p.gridY === 4 && p.dir === 'UP');

      if (isFacingSylvia) {
        promptPoetChoiceMenu(
          ROOM_SHAKESPEARE_CO.entities.sylvia_beach.name,
          ROOM_SHAKESPEARE_CO.entities.sylvia_beach.greeting,
          ROOM_SHAKESPEARE_CO.entities.sylvia_beach.talkLines,
          '',
          undefined,
          () => {
            setShakespeareCoNpcs((prev) =>
              prev.map((n) => (n.id === 'npc_sylvia_beach' ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
            );
          },
        );
        return;
      }

      // 3. Snoozing Bookstore Cat on folios stack at X: 4, Y: 6
      const isFacingCat =
        (facingX === 4 && (facingY === 6 || facingY === 5 || facingY === 7)) ||
        ((facingX === 3 || facingX === 5) && facingY === 6);

      if (isFacingCat) {
        gameAudio.playCatMeow();
        triggerHaptics([40, 70]);
        const lines = ROOM_SHAKESPEARE_CO.props.bookstore_cat;
        const count = (interactionCountsRef.current.bookstore_cat || 0) + 1;
        interactionCountsRef.current.bookstore_cat = count;
        setInteractionState((prev) => ({ ...prev, bookstore_cat: count }));
        const curIdx = (count - 1) % lines.length;

        setOverworldDialogue({
          active: true,
          speakerName: 'BOOKSTORE CAT',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Rolling Brass Library Ladder at X: 3, Y: 2
      if (facingX === 3 && (facingY === 2 || facingY === 1)) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_SHAKESPEARE_CO.props.rolling_ladder;
        setOverworldDialogue({
          active: true,
          speakerName: 'ROLLING LIBRARY LADDER',
          text: lines[1] || lines[0],
        });
        return;
      }

      // 5. Floor-to-Ceiling Oak Bookshelves
      const isFacingShelves =
        ((facingX === 1 || facingX === 2) && (facingY === 3 || facingY === 4 || facingY === 7 || facingY === 8)) ||
        ((facingX === 13 || facingX === 14) && (facingY === 3 || facingY === 4)) ||
        (facingY === 1 && facingX >= 1 && facingX <= 14);

      if (isFacingShelves) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_SHAKESPEARE_CO.props.oak_bookshelves;
        const count = (interactionCountsRef.current.shakespeare_shelves || 0) + 1;
        interactionCountsRef.current.shakespeare_shelves = count;
        setInteractionState((prev) => ({ ...prev, shakespeare_shelves: count }));
        const curIdx = (count - 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'SOLID OAK BOOKSHELVES',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Velvet Reading Armchair & Brass Floor Lamp at X: 12..13, Y: 6..7
      if ((facingX === 12 || facingX === 13) && (facingY === 6 || facingY === 7)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_SHAKESPEARE_CO.props.reading_armchair;
        setOverworldDialogue({
          active: true,
          speakerName: 'VELVET READING ARMCHAIR',
          text: lines[0],
        });
        return;
      }

      // 7. Sylvia Beach's Oak Reading Desk (X: 7..8, Y: 3)
      if ((facingX === 7 || facingX === 8) && facingY === 3) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_SHAKESPEARE_CO.props.sylvia_desk;
        setOverworldDialogue({
          active: true,
          speakerName: "SYLVIA BEACH'S READING DESK",
          text: lines[0],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 13: THE BIGHT BOATHOUSE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'ROOM_BOATHOUSE' || currentScreenId === 'BOATHOUSE') {
      // 1. The Venerable Hook-Jawed Fish at X: 7..8, Y: 4 (repeatable 2-step cycle click % 2)
      if ((facingX === 7 || facingX === 8) && (facingY === 4 || facingY === 3 || facingY === 5)) {
        const count = (interactionCountsRef.current.hook_jawed_fish || 0) + 1;
        interactionCountsRef.current.hook_jawed_fish = count;
        setInteractionState((prev) => ({ ...prev, hook_jawed_fish: count }));
        const lines = ROOM_BOATHOUSE.props.hook_jawed_fish;
        const curIdx = (count - 1) % lines.length;
        gameAudio.playShoreWaveChime();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "HOOK-JAWED FISH",
          text: lines[curIdx],
        });
        return;
      }

      // 2. Sideways Crimson Crab at X: 4, Y: 6
      if (facingX === 4 && (facingY === 6 || facingY === 5 || facingY === 7)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_BOATHOUSE.props.crimson_crab;
        setOverworldDialogue({
          active: true,
          speakerName: "CRIMSON CRAB",
          text: lines[0],
        });
        return;
      }

      // 3. Salvage Worktable & Ship's Bell at X: 2..3, Y: 2
      if ((facingX === 2 || facingX === 3) && facingY === 2) {
        gameAudio.playAnvilRing();
        triggerHaptics(35);
        const lines = ROOM_BOATHOUSE.props.salvage_worktable;
        setOverworldDialogue({
          active: true,
          speakerName: "SALVAGE WORKTABLE & BELL",
          text: lines[0],
        });
        return;
      }

      // 4. Harbor Master's Arrival Ledger at X: 12..13, Y: 2
      if ((facingX === 12 || facingX === 13) && facingY === 2) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_BOATHOUSE.props.arrival_ledger;
        setOverworldDialogue({
          active: true,
          speakerName: "ARRIVAL LEDGER",
          text: lines[0],
        });
        return;
      }

      // 5. Oilskin Explorer's Sea-Chest at X: 2, Y: 9 (grants +1 Blank Book on first inspection)
      if (facingX === 2 && facingY === 9) {
        const granted = interactionCountsRef.current.boathouse_chest_granted;
        if (!granted) {
          interactionCountsRef.current.boathouse_chest_granted = 1;
          setInteractionState((prev) => ({ ...prev, boathouse_chest_granted: 1 }));
          setBagInventory((prev) =>
            prev.map((item) =>
              item.id === 'BLANK_BOOK' ? { ...item, count: item.count + 1 } : item,
            ),
          );
          gameAudio.playPowerupChime();
          triggerHaptics([60, 100, 150]);
          setOverworldDialogue({
            active: true,
            speakerName: "OILSKIN SEA-CHEST",
            text: "You open the salt-stained oilskin explorer's sea-chest. Tucked under the heavy brass lid among dry charts and cedar shavings: an extra BLANK ANTHOLOGY BOOK! (+1 Blank Book added to satchel).",
          });
        } else {
          gameAudio.playCrispClick();
          triggerHaptics(30);
          setOverworldDialogue({
            active: true,
            speakerName: "OILSKIN SEA-CHEST",
            text: ROOM_BOATHOUSE.props.oilskin_sea_chest[1] || ROOM_BOATHOUSE.props.oilskin_sea_chest[0],
          });
        }
        return;
      }

      // 6. Central indoor water slip at X: 5..10, Y: 4..8
      if (facingX >= 5 && facingX <= 10 && facingY >= 4 && facingY <= 8) {
        gameAudio.playShoreWaveChime();
        triggerHaptics(25);
        setOverworldDialogue({
          active: true,
          speakerName: "WATER SLIP",
          text: "The dark water of the indoor boat slip lapping softly against the creosote cedar pilings.",
        });
        return;
      }

      // 7. Bookbinder's Bench at X: 13, Y: 9 (accessible from left at 12, right at 14, or below at 10)
      if (
        (facingX === 13 && (facingY === 9 || facingY === 8 || facingY === 10)) ||
        ((facingX === 12 || facingX === 14) && facingY === 9)
      ) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const propData = (ROOM_BOATHOUSE.props as any).boathouse_press;
        const lines: string[] = Array.isArray(propData)
          ? propData
          : propData?.lines || [
              "A screw press clamping wet folio sheets.",
              "'The sea is as near to various colors as the stone is to grays.' Glass fishing floats in cobalt and emerald reflect the quiet water slip.",
            ];
        const count = (interactionCountsRef.current.boathouse_press || 0) + 1;
        interactionCountsRef.current.boathouse_press = count;
        setInteractionState((prev) => ({ ...prev, boathouse_press: count }));
        const curIdx = (count - 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "BOOKBINDER'S BENCH",
          text: lines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR: THE LYRIC SANCTUARY (SUMMIT OBSERVATORY) INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'LYRIC_SANCTUARY') {
      const targetNpc = lyricSanctuaryNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === facingX &&
              Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
        else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
        else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
        else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';

        setLyricSanctuaryNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                }
              : n,
          ),
        );

        // 1. SAPPHO: Inside the Lyric Sanctuary by the glowing hearth/brazier. FIGHTABLE (1st in Summit Gauntlet).
        if (targetNpc.poetId === 'SAPPHO' || targetNpc.id === 'npc_sanctuary_sappho' || targetNpc.id === 'npc_summit_sappho') {
          const sapphoGateLine = duelGateRef.current('SAPPHO');
          if (sapphoGateLine) {
            setOverworldDialogue({ active: true, speakerName: 'SAPPHO', text: sapphoGateLine });
            return;
          }
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_LYRIC_SANCTUARY.entities.sanctuary_sappho.name,
              text: ROOM_LYRIC_SANCTUARY.entities.sanctuary_sappho.greeting,
              onComplete: () => {
                setLyricSanctuaryNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false, facing: 'LEFT' } : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            ROOM_LYRIC_SANCTUARY.entities.sanctuary_sappho.name,
            ROOM_LYRIC_SANCTUARY.entities.sanctuary_sappho.greeting,
            ROOM_LYRIC_SANCTUARY.entities.sanctuary_sappho.talkLines,
            ROOM_LYRIC_SANCTUARY.entities.sanctuary_sappho.duelLine,
            'SAPPHO',
            () => {
              setLyricSanctuaryNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'LEFT' } : n)),
              );
            },
          );
          return;
        }
      }

      // 1. Stone Brazier with glowing juniper coals at X: 4, Y: 3
      if (facingX === 4 && facingY === 3) {
        gameAudio.playHearthCrackle();
        gameAudio.playAlembicBubble();
        triggerHaptics(30);
        const lines = ROOM_LYRIC_SANCTUARY.props.juniper_brazier;
        const curIdx = (propInspectIndexRef.current.JUNIPER_BRAZIER ?? 0) % lines.length;
        propInspectIndexRef.current.JUNIPER_BRAZIER = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'STONE BRAZIER',
          text: lines[curIdx],
        });
        return;
      }

      // 2. Polished wooden lyre stand at X: 4, Y: 6
      if (facingX === 4 && facingY === 6) {
        gameAudio.playWindChime();
        triggerHaptics(30);
        const lines = ROOM_LYRIC_SANCTUARY.props.tortoiseshell_lyre;
        const curIdx = (propInspectIndexRef.current.TORTOISESHELL_LYRE ?? 0) % lines.length;
        propInspectIndexRef.current.TORTOISESHELL_LYRE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'LYRIC LYRE STAND',
          text: lines[curIdx],
        });
        return;
      }

      // 3. Astronomical celestial brass armillary sphere at X: 11, Y: 3
      if (facingX === 11 && facingY === 3) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_LYRIC_SANCTUARY.props.armillary_sphere;
        const curIdx = (propInspectIndexRef.current.ARMILLARY_SPHERE ?? 0) % lines.length;
        propInspectIndexRef.current.ARMILLARY_SPHERE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CELESTIAL ARMILLARY',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Scrolls of Aeolic Greek verse fragments at X: 11, Y: 6
      if (facingX === 11 && facingY === 6) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LYRIC_SANCTUARY.props.aeolic_scrolls;
        const curIdx = (propInspectIndexRef.current.AEOLIC_SCROLLS ?? 0) % lines.length;
        propInspectIndexRef.current.AEOLIC_SCROLLS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'AEOLIC SCROLLS',
          text: lines[curIdx],
        });
        return;
      }

      // 5. Panoramic mountain window at X: 7..8, Y: 1..2
      if ((facingX === 7 || facingX === 8) && (facingY === 1 || facingY === 2)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_LYRIC_SANCTUARY.props.glacier_window;
        const curIdx = (propInspectIndexRef.current.GLACIER_WINDOW ?? 0) % lines.length;
        propInspectIndexRef.current.GLACIER_WINDOW = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'OBSERVATORY WINDOW',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Soft wool rugs
      if ((facingX >= 6 && facingX <= 9) && (facingY >= 4 && facingY <= 7)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        const rugLines = [
          "Thick white Parnassian fleeces bordered in Tyrian purple and saffron gold.",
          "'Creatures of a day! What is a man? A dream of a shadow.'",
        ];
        const curIdx = (propInspectIndexRef.current.SANCTUARY_WOOL_RUG ?? 0) % rugLines.length;
        propInspectIndexRef.current.SANCTUARY_WOOL_RUG = (curIdx + 1) % rugLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'WOOL RUG',
          text: rugLines[curIdx],
        });
        return;
      }
      return;
    }

    // =========================================================================
    // INTERIOR 4: THE RENTED ROOM INTERACTIONS (CHARLES BAUDELAIRE)
    // =========================================================================
    if (currentScreenId === 'RENTED_ROOM') {
      // 1. STRICT NPC PRIORITY: Always check for Charles Baudelaire FIRST before furniture/inspectables
      const targetNpc = rentedRoomNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              npc.movement.stepTo?.x === facingX &&
              npc.movement.stepTo?.y === facingY) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Baudelaire seated on chair turns to face player during dialogue
        let baudelaireFacing: FacingDirection = 'RIGHT';
        if (p.gridX < targetNpc.x) {
          baudelaireFacing = 'LEFT';
        } else if (p.gridX > targetNpc.x) {
          baudelaireFacing = 'RIGHT';
        } else if (p.gridY < targetNpc.y) {
          baudelaireFacing = 'UP';
        } else if (p.gridY > targetNpc.y) {
          baudelaireFacing = 'DOWN';
        }

        setRentedRoomNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  greeted: true,
                  hasSeenIntro: true,
                  facing: baudelaireFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                }
              : n,
          ),
        );

        // CHARLES BAUDELAIRE: Sole occupant & duelist in The Rented Room on chair at X: 11, Y: 6, facing East. FIGHTABLE!
        if (targetNpc.poetId === 'BAUDELAIRE' || targetNpc.poetId === 'baudelaire' || targetNpc.id === 'baudelaire' || targetNpc.id === 'npc_rented_baudelaire') {
          const isPostEncounter = targetNpc.hasFoughtBefore || capturedPoetIds.includes('BAUDELAIRE') || capturedPoetIds.includes('baudelaire');
          const baudelaireGreeting = isPostEncounter
            ? "You have extracted beauty from the dark. I am with you."
            : "Let us descend into the spleen and the ideal.";
          const baudelaireTalkLines = [
            "Let us descend into the spleen and the ideal.",
            "“Hypocrite lecteur, — mon semblable, — mon frère!”",
            "There are in every man, at every hour, two simultaneous postulations: one towards God, the other towards Satan.",
          ];
          const baudelaireDuelLine =
            "Let us descend into the spleen and the ideal.";

          promptPoetChoiceMenu(
            'Charles Baudelaire',
            baudelaireGreeting,
            baudelaireTalkLines,
            baudelaireDuelLine,
            'baudelaire',
            () => {
              setRentedRoomNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'RIGHT' } : n)),
              );
            },
          );
          return;
        }
      }

      // 2. FURNITURE & ROOM PROPS (Only checked when not interacting with Keats)
      // Classical Grecian Urn (X: 9, Y: 6)
      if (facingX === 9 && facingY === 6) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(35);
        const urnLines = [
          'A carved marble urn depicting piping shepherds and lovers beneath spring boughs that will never shed their leaves.',
          'Frozen in marble mid-step: forever warm, forever panting, and forever young.',
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_URN ?? 0) % urnLines.length;
        propInspectIndexRef.current.RENTED_URN = (curIdx + 1) % urnLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CLASSICAL GRECIAN URN',
          text: urnLines[curIdx],
        });
        return;
      }

      // Severn's Artist Easel & Palette (X: 8, Y: 3)
      if (facingX === 8 && facingY === 3) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const easelLines = [
          "Joseph Severn's wooden easel holding an unfinished portrait of Keats reading by the window, alongside a palette of oil paints.",
          "Penciled in the corner of the sketchpad: '28 January, 3 o'clock morning — drawn to keep me awake.'",
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_EASEL ?? 0) % easelLines.length;
        propInspectIndexRef.current.RENTED_EASEL = (curIdx + 1) % easelLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "SEVERN'S EASEL",
          text: easelLines[curIdx],
        });
        return;
      }

      // Writing Desk & Quill (X: 10, Y: 3)
      if (facingX === 10 && facingY === 3) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const deskLines = [
          'A goose-quill pen and heavily cross-hatched manuscript sheets from the spring of 1819.',
          'The margins are crowded with ink-stained verses to a nightingale in the Hampstead plum trees.',
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_DESK ?? 0) % deskLines.length;
        propInspectIndexRef.current.RENTED_DESK = (curIdx + 1) % deskLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'WRITING DESK & QUILL',
          text: deskLines[curIdx],
        });
        return;
      }

      // Carved Walnut Bed (X: 4–5, Y: 4–5)
      if ((facingX === 4 || facingX === 5) && (facingY === 4 || facingY === 5)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const bedLines = [
          "A narrow walnut bed smelling of Havana tobacco, rain-soaked wool, and Parisian musk.",
          "On the pillow rests a proof of 'Les Fleurs du Mal': 'La sottise, l'erreur, le péché, la lésine.'",
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_BED ?? 0) % bedLines.length;
        propInspectIndexRef.current.RENTED_BED = (curIdx + 1) % bedLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CARVED WALNUT BED',
          text: bedLines[curIdx],
        });
        return;
      }

      // Mantelpiece & Remedy (X: 6–7, Y: 1–2)
      if ((facingX === 6 || facingX === 7) && (facingY === 1 || facingY === 2)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const mantelLines = [
          "A glass vial of laudanum and a laurel branch beside a stopped brass mantel clock.",
          "The clock whispers: 'Remember! The metal throat speaks every language.'",
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_MANTEL ?? 0) % mantelLines.length;
        propInspectIndexRef.current.RENTED_MANTEL = (curIdx + 1) % mantelLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'MANTELPIECE & REMEDY',
          text: mantelLines[curIdx],
        });
        return;
      }

      // Grand Roman Arched Window (X: 12, Y: 4–5)
      if (facingX === 12 && (facingY === 4 || facingY === 5)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const windowLines = [
          "Below in the square, Bernini's boat-shaped fountain splashes at the foot of the Spanish Steps.",
          "'There is nothing more profound, more mysterious, more pregnant, more insidious, more dazzling than a window lighted by a single candle.'",
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_WINDOW ?? 0) % windowLines.length;
        propInspectIndexRef.current.RENTED_WINDOW = (curIdx + 1) % windowLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'GRAND ROMAN WINDOW',
          text: windowLines[curIdx],
        });
        return;
      }

      // Round Table & Letters (X: 7, Y: 6)
      if (facingX === 7 && facingY === 6) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const tableLines = [
          'A stack of unopened letters from Hampstead tied in faded red ribbon beside a yellow Roman daisy.',
          'The top envelope bears a London postmark and the neat, unmistakable hand of Fanny Brawne.',
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_TABLE ?? 0) % tableLines.length;
        propInspectIndexRef.current.RENTED_TABLE = (curIdx + 1) % tableLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ROUND TABLE & LETTERS',
          text: tableLines[curIdx],
        });
        return;
      }

      // Leather Travel Trunk (X: 4, Y: 6)
      if (facingX === 4 && facingY === 6) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const trunkLines = [
          'A battered leather sea chest from the quarantine voyage of the brig Maria Crowther from London to the Bay of Naples.',
          "Tucked inside the lid: a well-worn copy of Shakespeare's folios and a handful of dried English violets.",
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_TRUNK ?? 0) % trunkLines.length;
        propInspectIndexRef.current.RENTED_TRUNK = (curIdx + 1) % trunkLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'LEATHER TRAVEL TRUNK',
          text: trunkLines[curIdx],
        });
        return;
      }

      // Washstand & Basin (X: 4, Y: 8)
      if (facingX === 4 && facingY === 8) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const washstandLines = [
          'A white porcelain pitcher and wash basin filled with clear, cold water from the Roman aqueducts.',
          'If you trace your name across the surface of the water, the ripples vanish before you can lift your hand.',
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_WASHSTAND ?? 0) % washstandLines.length;
        propInspectIndexRef.current.RENTED_WASHSTAND = (curIdx + 1) % washstandLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'WASHSTAND & BASIN',
          text: washstandLines[curIdx],
        });
        return;
      }

      // Runner Rug (X: 6, Y: 4–8)
      if (facingX === 6 && (facingY >= 4 && facingY <= 8)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        const rugLines = [
          "A faded crimson runner worn thin between the armchair and the window.",
          "'Exiled on the ground amidst the jeering pack, / His giant wings prevent him from walking.'",
        ];
        const curIdx = (propInspectIndexRef.current.RENTED_RUG ?? 0) % rugLines.length;
        propInspectIndexRef.current.RENTED_RUG = (curIdx + 1) % rugLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'RUNNER RUG',
          text: rugLines[curIdx],
        });
        return;
      }
      return;
    }

    // =========================================================================
    // SCREEN 6: THE SUMMIT INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'SUMMIT') {
      // 1. STRICT NPC PRIORITY: Check Summit NPCs (Shakespeare, Dante, Milton, Sappho) FIRST
      const targetNpc = summitNpcsRef.current.find((npc) => {
        if (!npc.isActive || npc.isDissolving || npc.isRecruited || (npc.poetId && capturedPoetIds.includes(npc.poetId))) return false;
        // Direct facing tile match
        if (npc.x === facingX && npc.y === facingY) return true;
        // Pixel-rounded tile match
        const curTileX = Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE);
        const curTileY = Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE);
        if (curTileX === facingX && curTileY === facingY) return true;
        // Moving stepFrom or stepTo match
        if (npc.isMoving && npc.movement?.type === 'PATH') {
          if (npc.movement.stepTo && npc.movement.stepTo.x === facingX && npc.movement.stepTo.y === facingY) return true;
          if (npc.movement.stepFrom && npc.movement.stepFrom.x === facingX && npc.movement.stepFrom.y === facingY) return true;
        }
        if (npc.patrol && npc.patrol.stepTo.x === facingX && npc.patrol.stepTo.y === facingY) return true;

        // Interaction range check specifically for Shakespeare on the stage
        if (npc.poetId === 'SHAKESPEARE' || npc.id === 'npc_summit_shakespeare') {
          const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
          const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
          const pPxX = p.pxX + 8;
          const pPxY = p.pxY + 12;
          const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
          if (dist <= 26) {
            if (p.dir === 'UP' && npcPxY <= pPxY + 4) return true;
            if (p.dir === 'DOWN' && npcPxY >= pPxY - 4) return true;
            if (p.dir === 'LEFT' && npcPxX <= pPxX + 4) return true;
            if (p.dir === 'RIGHT' && npcPxX >= pPxX - 4) return true;
          }
        }
        return false;
      });

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for walking characters (Shakespeare, Milton)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (targetNpc.poetId === 'SHAKESPEARE' || targetNpc.poetId === 'DANTE' || targetNpc.poetId === 'MILTON' || targetNpc.poetId === 'KEATS') {
          // Immediately stops and faces the player when talked to!
          if (p.gridY < stopTileY) npcTurnFacing = 'UP';
          else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
          else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
          else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';
        }

        setSummitNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 3.0,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // 1. SAPPHO fallback (if present on summit)
        if (targetNpc.poetId === 'SAPPHO' || targetNpc.id === 'npc_summit_sappho') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: 'SAPPHO',
              text: "Chaire. Sappho. Most of what I wrote is gone. What's left is enough.",
              onComplete: () => {
                setSummitNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false, facing: 'LEFT' } : n,
                  ),
                );
              },
            });
            return;
          }

          if (targetNpc.hasFoughtBefore) {
            setOverworldDialogue({
              active: true,
              speakerName: 'SAPPHO',
              text: '"I don\'t know what to do. Two states of mind in me."',
              onComplete: () => {
                setSummitNpcs((prev) =>
                  prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'LEFT' } : n)),
                );
                const heroId = activePlayerPoetId || (capturedPoetIds[0] ?? 'WHITMAN');
                initBattle(heroId, 'SAPPHO');
              },
            });
            return;
          }

          // First fight
          setOverworldDialogue({
            active: true,
            speakerName: 'SAPPHO',
            text: '"Someone will remember us, I say, even in another time."',
            onComplete: () => {
              setSummitNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id ? { ...n, hasFoughtBefore: true, isInteracting: false, facing: 'LEFT' } : n,
                ),
              );
              const heroId = activePlayerPoetId || (capturedPoetIds[0] ?? 'WHITMAN');
              initBattle(heroId, 'SAPPHO');
            },
          });
          return;
        }

        // 2. SHAKESPEARE: On stage. Rehearsing soliloquy ("All the world's a stage..."). FIGHTABLE (2nd in Summit Gauntlet).
        if (targetNpc.poetId === 'SHAKESPEARE' || targetNpc.id === 'npc_summit_shakespeare') {
          const isSapphoCaptured = capturedPoetIds.includes('SAPPHO');

          if (!isSapphoCaptured) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_SUMMIT.entities.summit_shakespeare.name,
              text: 'Not yet. She was here first.',
              onComplete: () => {
                setSummitNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id
                      ? {
                          ...n,
                          isInteracting: false,
                          movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                        }
                      : n,
                  ),
                );
              },
            });
            return;
          }

          // Sappho IS captured
          promptPoetChoiceMenu(
            ROOM_SUMMIT.entities.summit_shakespeare.name,
            ROOM_SUMMIT.entities.summit_shakespeare.greeting,
            ROOM_SUMMIT.entities.summit_shakespeare.talkLines,
            ROOM_SUMMIT.entities.summit_shakespeare.duelLine,
            'SHAKESPEARE',
            () => {
              setSummitNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // 3. KEATS: Western Autumn Terrace at X: 4, Y: 8. FIGHTABLE (3rd in Summit Gauntlet).
        if (targetNpc.poetId === 'KEATS' || targetNpc.id === 'npc_summit_keats') {
          const isShakespeareCaptured = capturedPoetIds.includes('SHAKESPEARE');

          if (!isShakespeareCaptured) {
            setOverworldDialogue({
              active: true,
              speakerName: 'JOHN KEATS',
              text: 'Let Will have his summer first. The autumn comes after.',
              onComplete: () => {
                setSummitNpcs((prev) =>
                  prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
                );
              },
            });
            return;
          }

          // Shakespeare IS captured
          promptPoetChoiceMenu(
            'JOHN KEATS',
            targetNpc.greeting || "Hello. Keats. I'm twenty-five. I'll be twenty-five for a while.",
            targetNpc.talkLines || [
              "“Was it a vision, or a waking dream? Fled is that music:—Do I wake or sleep?”",
              "“A thing of beauty is a joy for ever: its loveliness increases; it will never pass into nothingness.”",
              "I trained as an apothecary in London before this. Believe me, the rhymes are better than the remedies.",
            ],
            targetNpc.duelLine || "“Beauty is truth, truth beauty,—that is all Ye know on earth, and all ye need to know.”",
            'KEATS',
            () => {
              setSummitNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
              );
            },
          );
          return;
        }

        // 4. DANTE: At (12, 4). FIGHTABLE (4th in Summit Gauntlet). Blocks trail until captured.
        if (targetNpc.poetId === 'DANTE' || targetNpc.id === 'npc_summit_dante') {
          const isKeatsCaptured = capturedPoetIds.includes('KEATS');

          if (!isKeatsCaptured) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_SUMMIT.entities.summit_dante.name,
              text: "Autumn hasn't fallen yet. Speak with Keats.",
              onComplete: () => {
                setSummitNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id
                      ? {
                          ...n,
                          isInteracting: false,
                          movement: n.movement ? { ...n.movement, timer: 0 } : undefined,
                        }
                      : n,
                  ),
                );
              },
            });
            return;
          }

          // Keats IS captured
          promptPoetChoiceMenu(
            ROOM_SUMMIT.entities.summit_dante.name,
            ROOM_SUMMIT.entities.summit_dante.greeting,
            ROOM_SUMMIT.entities.summit_dante.talkLines,
            ROOM_SUMMIT.entities.summit_dante.duelLine,
            'DANTE',
            () => {
              setSummitNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement ? { ...n.movement, timer: 0 } : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // 5. MILTON: Strolls around snowy summit plaza. Non-fighter, cycles 3 lines.
        if (targetNpc.poetId === 'MILTON' || targetNpc.id === 'npc_summit_milton') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_SUMMIT.entities.summit_milton.name,
              text: ROOM_SUMMIT.entities.summit_milton.greeting,
              onComplete: () => {
                setSummitNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id
                      ? {
                          ...n,
                          hasSeenIntro: true,
                          currentDialogueIndex: 0,
                          isInteracting: false,
                          movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                        }
                      : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            ROOM_SUMMIT.entities.summit_milton.name,
            ROOM_SUMMIT.entities.summit_milton.greeting,
            ROOM_SUMMIT.entities.summit_milton.talkLines,
            '',
            undefined,
            () => {
              setSummitNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }
        return;
      }

      // 2. SCENERY & FURNITURE INSPECT TRIGGERS (Evaluated ONLY when not interacting with an NPC)
      const isSpringBasin = (facingX === 17 || facingX === 18) && (facingY === 2 || facingY === 3);
      const isLaurelWreath = (facingX >= 15 && facingX <= 20) && (facingY === 4 || facingY === 5);

      if (isSpringBasin || isLaurelWreath) {
        // Only available after Dante has been captured
        const isDanteCaptured = capturedPoetIds.includes('DANTE');
        if (!isDanteCaptured) {
          gameAudio.playHoverMicroTone();
          triggerHaptics(30);
          const lines = ROOM_SUMMIT.props.castalian_spring;
          const curIdx = (propInspectIndexRef.current.CASTALIAN_SPRING ?? 0) % lines.length;
          propInspectIndexRef.current.CASTALIAN_SPRING = (curIdx + 1) % lines.length;
          setOverworldDialogue({
            active: true,
            speakerName: 'CASTALIAN SPRING',
            text: lines[curIdx],
          });
          return;
        }

        // Dante is captured! Open Spring choice menu
        gameAudio.playConfirmSelect();
        triggerHaptics(40);
        soundtrackEngine.triggerSfxDucking(450, 0.82);
        setSelectedSpringPoetIndex(0);
        setIsSpringMenuOpen(true);
        return;
      }

      // Check Summit Cabin Door: X: 7, Y: 13 -> Enters The Lyric Sanctuary
      const isSanctuaryDoor = (facingX === 7 && facingY === 13) || (p.gridX === 7 && p.gridY === 14 && p.dir === 'UP');
      if (isSanctuaryDoor && (p.dir === 'UP' || facingY === 13)) {
        transitionOverworldScreen('LYRIC_SANCTUARY', 7, 9, 'UP');
        return;
      }

      // Check Fallen Fluted Marble Column Drum (ARTIFACT 10: Odysseus's Bow) (Trail Edge • X: 14, Y: 10)
      if (facingX === 14 && facingY === 10) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const drumLines = [
          "Leaning against the worn marble drum is an unstrung palintonon horn bow beside twelve iron axe-helves.",
          "'So effortlessly Odysseus strung the great bow, and plucked the string to test its pitch—it sang like a swallow's note.'",
        ];
        const curIdx = (propInspectIndexRef.current.SUMMIT_COLUMN_DRUM ?? 0) % drumLines.length;
        propInspectIndexRef.current.SUMMIT_COLUMN_DRUM = (curIdx + 1) % drumLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'MARBLE DRUM',
          text: drumLines[curIdx],
        });
        return;
      }

      // 1. Elizabethan Front Stage Wooden Steps (X: 27..28, Y: 15)
      if ((facingX === 27 || facingX === 28) && facingY === 15) {
        gameAudio.playFootstepWood();
        triggerHaptics(30);
        const lines = ROOM_SUMMIT.props.stage_steps;
        const curIdx = (propInspectIndexRef.current.STAGE_STEPS ?? 0) % lines.length;
        propInspectIndexRef.current.STAGE_STEPS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'STAGE STEPS',
          text: lines[curIdx],
        });
        return;
      }

      // 2. The First Folio Plinth: Stone lectern with open illuminated folio draft at X: 23..24, Y: 15
      if ((facingX === 23 || facingX === 24) && facingY === 15) {
        gameAudio.playPageTurn();
        triggerHaptics(35);
        const lines = ROOM_SUMMIT.props.first_folio_plinth;
        const curIdx = (propInspectIndexRef.current.FIRST_FOLIO_PLINTH ?? 0) % lines.length;
        propInspectIndexRef.current.FIRST_FOLIO_PLINTH = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'THE FIRST FOLIO PLINTH',
          text: lines[curIdx],
        });
        return;
      }

      // 3. Alpine Stage Railing overlooking Glacier & Clouds (Y: 10, X: 24..31)
      if (facingX >= 24 && facingX <= 31 && facingY === 10) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const railingLines = [
          "A classical timber balustrade overlooking a sea of dissolving alpine clouds.",
          "'We are such stuff / As dreams are made on, and our little life / Is rounded with a sleep.'",
        ];
        const curIdx = (propInspectIndexRef.current.SUMMIT_RAILING ?? 0) % railingLines.length;
        propInspectIndexRef.current.SUMMIT_RAILING = (curIdx + 1) % railingLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'STAGE RAILING',
          text: railingLines[curIdx],
        });
        return;
      }

      // Check Classical Lyre at X: 4, Y: 15
      if (facingX === 4 && facingY === 15) {
        gameAudio.playWindChime();
        triggerHaptics(30);
        const lines = ROOM_SUMMIT.props.summit_lyre;
        const curIdx = (propInspectIndexRef.current.SUMMIT_LYRE ?? 0) % lines.length;
        propInspectIndexRef.current.SUMMIT_LYRE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CLASSICAL LYRE',
          text: lines[curIdx],
        });
        return;
      }

      // Check Scattered Laurel Leaves at X: 15..20, Y: 4..5
      if ((facingX >= 15 && facingX <= 20) && (facingY === 4 || facingY === 5)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_SUMMIT.props.laurel_leaves;
        const curIdx = (propInspectIndexRef.current.LAUREL_LEAVES ?? 0) % lines.length;
        propInspectIndexRef.current.LAUREL_LEAVES = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'LAUREL LEAVES',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Open Mountain Viewing Terrace in front of stage (Y: 16..22, X: 23..32)
      if (facingX >= 23 && facingX <= 32 && facingY >= 16 && facingY <= 22) {
        gameAudio.playFootstepStone();
        triggerHaptics(25);
        const terraceLines = [
          "A white marble terrace overlooking the ascent from the dark wood below.",
          "Inlaid in bronze across the threshold: 'E quindi uscimmo a riveder le stelle.'",
        ];
        const curIdx = (propInspectIndexRef.current.SUMMIT_TERRACE ?? 0) % terraceLines.length;
        propInspectIndexRef.current.SUMMIT_TERRACE = (curIdx + 1) % terraceLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'VIEWING TERRACE',
          text: terraceLines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 10: THE WHITE HOUSE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'WHITE_HOUSE') {
      const targetNpc = whiteHouseNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              npc.movement.stepTo?.x === facingX &&
              npc.movement.stepTo?.y === facingY) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Special rule for Emily Dickinson: Dickinson NEVER turns to face the player;
        // she remains facing North toward the window even while her text lines show.
        setWhiteHouseNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: 'UP',
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                }
              : n,
          ),
        );

        // EMILY DICKINSON: Seated at (10, 4) facing North. FIGHTABLE!
        if (targetNpc.poetId === 'DICKINSON' || targetNpc.id === 'npc_whitehouse_dickinson') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_WHITE_HOUSE.entities.white_house_dickinson.name,
              text: ROOM_WHITE_HOUSE.entities.white_house_dickinson.greeting,
              onComplete: () => {
                setWhiteHouseNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false } : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            ROOM_WHITE_HOUSE.entities.white_house_dickinson.name,
            ROOM_WHITE_HOUSE.entities.white_house_dickinson.greeting,
            ROOM_WHITE_HOUSE.entities.white_house_dickinson.talkLines,
            ROOM_WHITE_HOUSE.entities.white_house_dickinson.duelLine,
            'DICKINSON',
            () => {
              setWhiteHouseNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }
      }

      // 2. FURNITURE & ROOM PROPS INSPECTABLES
      // 1. Emily's signature tiny square writing desk at X: 10, Y: 3
      if (facingX === 10 && facingY === 3) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_WHITE_HOUSE.props.dickinson_desk;
        const curIdx = (propInspectIndexRef.current.DICKINSON_DESK ?? 0) % lines.length;
        propInspectIndexRef.current.DICKINSON_DESK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "EMILY'S DESK",
          text: lines[curIdx],
        });
        return;
      }

      // 2. Iconic White Cotton Dress at X: 8, Y: 2
      if (facingX === 8 && facingY === 2) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_WHITE_HOUSE.props.white_dress;
        const curIdx = (propInspectIndexRef.current.WHITE_DRESS ?? 0) % lines.length;
        propInspectIndexRef.current.WHITE_DRESS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "WHITE DRESS",
          text: lines[curIdx],
        });
        return;
      }

      // 3. Woven basket on a rope at X: 4, Y: 2
      if (facingX === 4 && facingY === 2) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_WHITE_HOUSE.props.wicker_basket;
        const curIdx = (propInspectIndexRef.current.WICKER_BASKET ?? 0) % lines.length;
        propInspectIndexRef.current.WICKER_BASKET = (curIdx + 1) % lines.length;
        let text = lines[curIdx];
        if (leadPoetId === 'DICKINSON') {
          text += "\n\nEmily quietly steps behind the white curtain and lowers a piece of gingerbread on twine instead of answering the door.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "BASKET ON ROPE",
          text,
        });
        return;
      }

      // 4. Narrow twin bed with white coverlet at X: 3, Y: 4..5
      if (facingX === 3 && (facingY === 4 || facingY === 5)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const bedLines = [
          "A narrow walnut bed in a spotless white quilt where a single bluebottle fly buzzes in the sunbeam.",
          "'The Stillness in the Room / Was like the Stillness in the Air — / Between the Heaves of Storm —'",
        ];
        const curIdx = (propInspectIndexRef.current.WHITEHOUSE_BED ?? 0) % bedLines.length;
        propInspectIndexRef.current.WHITEHOUSE_BED = (curIdx + 1) % bedLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "WALNUT BED",
          text: bedLines[curIdx],
        });
        return;
      }

      // 5. Cast-iron Franklin stove at X: 3, Y: 8
      if (facingX === 3 && facingY === 8) {
        gameAudio.playHearthCrackle();
        triggerHaptics(30);
        const lines = ROOM_WHITE_HOUSE.props.franklin_stove;
        const curIdx = (propInspectIndexRef.current.FRANKLIN_STOVE ?? 0) % lines.length;
        propInspectIndexRef.current.FRANKLIN_STOVE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "BEDROOM STOVE",
          text: lines[curIdx],
        });
        return;
      }

      // 6. Wooden dresser with hand-sewn fascicle booklets at X: 12, Y: 7..8
      if (facingX === 12 && (facingY === 7 || facingY === 8)) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_WHITE_HOUSE.props.fascicles_dresser;
        const curIdx = (propInspectIndexRef.current.FASCICLES_DRESSER ?? 0) % lines.length;
        propInspectIndexRef.current.FASCICLES_DRESSER = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "CHERRY DRESSER",
          text: lines[curIdx],
        });
        return;
      }

      // 7. West Window overlooking town at X: 5..6, Y: 2
      if ((facingX === 5 || facingX === 6) && facingY === 2) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const winLines = [
          "Looking west over Amherst toward the distant road.",
          "'The Carriage held but just Ourselves — / And Immortality.'",
        ];
        const curIdx = (propInspectIndexRef.current.WHITEHOUSE_WIN ?? 0) % winLines.length;
        propInspectIndexRef.current.WHITEHOUSE_WIN = (curIdx + 1) % winLines.length;
        let text = winLines[curIdx];
        if (leadPoetId === 'DICKINSON') {
          text += "\n\nEmily quietly steps behind the white curtain and lowers a piece of gingerbread on twine instead of answering the door.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "TOWN WINDOW",
          text,
        });
        return;
      }

      // 8. North Window overlooking garden and sky at X: 10..11, Y: 2
      if ((facingX === 10 || facingX === 11) && facingY === 2) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "GARDEN WINDOW",
          text: "Looking out toward the great oak tree and the open sky. 'I taste a liquor never brewed — From Tankards scooped in Pearl —'",
        });
        return;
      }
      return;
    }

    // =========================================================================
    // INTERIOR 9: THE GRAVEYARD INTERACTIONS (EDGAR ALLAN POE'S DOMAIN)
    // =========================================================================
    if (currentScreenId === 'GRAVEYARD') {
      // 1. STRICT NPC PRIORITY: Always check for Edgar Allan Poe FIRST
      const targetNpc = graveyardNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              npc.movement.stepTo?.x === facingX &&
              npc.movement.stepTo?.y === facingY) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
        else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
        else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
        else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';

        setGraveyardNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                }
              : n,
          ),
        );

        // EDGAR ALLAN POE: In front of crypt doorway at (8, 3) facing South. FIGHTABLE!
        if (targetNpc.poetId === 'POE' || targetNpc.id === 'npc_graveyard_poe') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_GRAVEYARD.entities.edgar_allan_poe.name,
              text: ROOM_GRAVEYARD.entities.edgar_allan_poe.greeting,
              onComplete: () => {
                setGraveyardNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false } : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            ROOM_GRAVEYARD.entities.edgar_allan_poe.name,
            ROOM_GRAVEYARD.entities.edgar_allan_poe.greeting,
            ROOM_GRAVEYARD.entities.edgar_allan_poe.talkLines,
            ROOM_GRAVEYARD.entities.edgar_allan_poe.duelLine,
            'POE',
            () => {
              setGraveyardNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }
      }

      // 2. TOMBSTONES & SCENERY INSPECTABLES
      // 1. Annabel Lee's Tombstone at X: 4, Y: 5
      if (facingX === 4 && facingY === 5) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_GRAVEYARD.props.annabel_lee_tomb;
        const curIdx = (propInspectIndexRef.current.ANNABEL_LEE_TOMB ?? 0) % lines.length;
        propInspectIndexRef.current.ANNABEL_LEE_TOMB = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "ANNABEL LEE'S TOMBSTONE",
          text: lines[curIdx],
        });
        return;
      }

      // 2. Lenore's Tomb at X: 11, Y: 6
      if (facingX === 11 && facingY === 6) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_GRAVEYARD.props.lenore_tomb;
        const curIdx = (propInspectIndexRef.current.LENORE_TOMB ?? 0) % lines.length;
        propInspectIndexRef.current.LENORE_TOMB = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "LENORE'S TOMB",
          text: lines[curIdx],
        });
        return;
      }

      // 3. A Single Red Rose on cold grey marble ledger tomb at X: 5, Y: 8
      if (facingX === 5 && facingY === 8) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_GRAVEYARD.props.rose_on_marble;
        const curIdx = (propInspectIndexRef.current.ROSE_ON_MARBLE ?? 0) % lines.length;
        propInspectIndexRef.current.ROSE_ON_MARBLE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'RED ROSE',
          text: lines[curIdx],
        });
        return;
      }

      // 4. The Raven perched atop headstone at X: 11, Y: 4 (The Raven's Refusal)
      if (facingX === 11 && facingY === 4) {
        gameAudio.playRavenCaw();
        triggerHaptics(35);
        const count = (interactionCountsRef.current.raven_refusal || 0) + 1;
        interactionCountsRef.current.raven_refusal = count;
        setInteractionState((prev) => ({ ...prev, raven_refusal: count }));

        const step = ((count - 1) % 4) + 1;
        let text = "";
        if (step === 1) {
          text = "A glossy black raven perched atop a pallid bust of Pallas. It answers every inquiry with a single word: 'Nevermore.'";
        } else if (step === 2) {
          text = "You ask if there is any relief to be found up on the snowfield. The bird croaks: 'Nevermore.'";
        } else if (step === 3) {
          text = "You ask for a tactical hint on the Summit gauntlet. It tilts its beak: 'Nevermore.'";
        } else {
          text = "You ask if it knows any other rhyme scheme. It refuses to budge from the sculpture: 'Nevermore.'";
        }
        setOverworldDialogue({
          active: true,
          speakerName: 'THE RAVEN',
          text,
        });
        return;
      }

      // 4.1 Dead Tree at X: 13, Y: 1..3
      if (facingX === 13 && (facingY >= 1 && facingY <= 3)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_GRAVEYARD.props.winter_tree;
        const curIdx = (propInspectIndexRef.current.WINTER_TREE ?? 0) % lines.length;
        propInspectIndexRef.current.WINTER_TREE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'GNARLED TREE',
          text: lines[curIdx],
        });
        return;
      }

      // 5. Shuttered Dark Lantern / Mausoleum Gates
      if ((facingX === 7 || facingX === 8 || facingX === 10) && (facingY === 2 || facingY === 4)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_GRAVEYARD.props.mausoleum_gates;
        const curIdx = (propInspectIndexRef.current.MAUSOLEUM_GATES ?? 0) % lines.length;
        propInspectIndexRef.current.MAUSOLEUM_GATES = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'MAUSOLEUM GATES',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Celtic Cross Gravestone at X: 3, Y: 3 or X: 2, Y: 7
      if ((facingX === 3 && facingY === 3) || (facingX === 2 && facingY === 7)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const crossLines = [
          "A leaning limestone Celtic cross cut deep against the mountain wind.",
          "'Cast a cold eye / On life, on death. / Horseman, pass by!'",
        ];
        const curIdx = (propInspectIndexRef.current.GRAVEYARD_CROSS ?? 0) % crossLines.length;
        propInspectIndexRef.current.GRAVEYARD_CROSS = (curIdx + 1) % crossLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CELTIC CROSS',
          text: crossLines[curIdx],
        });
        return;
      }

      // 7. Stone Gargoyle / Urn at Crypt entrance at X: 5, Y: 2 or X: 10, Y: 2
      if ((facingX === 5 || facingX === 10) && facingY === 2) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const urnLines = [
          "Twin stone funerary urns flanking the iron crypt gate.",
          "'The paths of glory lead but to the grave.'",
        ];
        const curIdx = (propInspectIndexRef.current.GRAVEYARD_URNS ?? 0) % urnLines.length;
        propInspectIndexRef.current.GRAVEYARD_URNS = (curIdx + 1) % urnLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'MAUSOLEUM GUARDIANS',
          text: urnLines[curIdx],
        });
        return;
      }

      // 7.5 Sealed Crypt Doors at X: 7..8, Y: 2 (behind Poe)
      if ((facingX === 7 || facingX === 8) && facingY === 2) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const vaultLines = [
          "A massive granite vault door with a jagged fissure running down the stone.",
          "'Tis the vault of thy lost Ulalume!'",
        ];
        const curIdx = (propInspectIndexRef.current.GRAVEYARD_VAULT ?? 0) % vaultLines.length;
        propInspectIndexRef.current.GRAVEYARD_VAULT = (curIdx + 1) % vaultLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'MAUSOLEUM PORTAL',
          text: vaultLines[curIdx],
        });
        return;
      }

      // 8. Other Headstones
      if (
        (facingX === 3 && facingY === 8) ||
        (facingX === 12 && facingY === 9) ||
        (facingX === 4 && facingY === 10) ||
        (facingX === 12 && facingY === 6) ||
        (facingX === 13 && facingY === 8) ||
        (facingX === 4 && facingY === 9) ||
        (facingX === 10 && facingY === 9) ||
        (facingX === 3 && facingY === 10)
      ) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const headstoneLines = [
          "Mossy marble headstones from Spoon River leaning in the snow.",
          "'Seeds in a dry pod, tick, tick, tick, / Tick, tick, tick, what little iambics, / While Homer and Whitman roared in the pines!'",
        ];
        const curIdx = (propInspectIndexRef.current.GRAVEYARD_HEADSTONES ?? 0) % headstoneLines.length;
        propInspectIndexRef.current.GRAVEYARD_HEADSTONES = (curIdx + 1) % headstoneLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'WEATHERED STONE',
          text: headstoneLines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 7: THE KITCHEN INTERACTIONS (SYLVIA PLATH'S RETREAT)
    // =========================================================================
    if (currentScreenId === 'KITCHEN') {
      // 1. STRICT NPC PRIORITY: Always check for Sylvia Plath FIRST
      const targetNpc = kitchenNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              npc.movement.stepTo?.x === facingX &&
              npc.movement.stepTo?.y === facingY) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
        else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
        else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
        else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';

        setKitchenNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                }
              : n,
          ),
        );

        // SYLVIA PLATH: On chair at (7, 6) facing North. FIGHTABLE!
        if (targetNpc.poetId === 'PLATH' || targetNpc.id === 'npc_kitchen_plath') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_KITCHEN.entities.sylvia_plath.name,
              text: ROOM_KITCHEN.entities.sylvia_plath.greeting,
              onComplete: () => {
                setKitchenNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false } : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            ROOM_KITCHEN.entities.sylvia_plath.name,
            ROOM_KITCHEN.entities.sylvia_plath.greeting,
            ROOM_KITCHEN.entities.sylvia_plath.talkLines,
            ROOM_KITCHEN.entities.sylvia_plath.duelLine,
            'PLATH',
            () => {
              setKitchenNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }
      }

      // 2. FURNITURE & PROPS INSPECTABLES
      // 1. Table & Typewriter / Manuscripts: Sylvia's central table at X: 7..8, Y: 5
      if ((facingX === 7 || facingX === 8) && facingY === 5) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.typewriter_manuscript;
        const curIdx = (propInspectIndexRef.current.TYPEWRITER_MANUSCRIPT ?? 0) % lines.length;
        propInspectIndexRef.current.TYPEWRITER_MANUSCRIPT = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'TYPEWRITER & MANUSCRIPT',
          text: lines[curIdx],
        });
        return;
      }

      // 2. Vase of Red Tulips on table corner or dresser/window
      if (facingX === 9 && facingY === 5) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.red_tulips;
        const curIdx = (propInspectIndexRef.current.RED_TULIPS ?? 0) % lines.length;
        propInspectIndexRef.current.RED_TULIPS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'RED TULIPS',
          text: lines[curIdx],
        });
        return;
      }

      // 3. Jars of Golden Comb Honey on shelf/counter at X: 11..12, Y: 1..2
      if ((facingX === 11 || facingX === 12) && (facingY === 1 || facingY === 2)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.comb_honey;
        const curIdx = (propInspectIndexRef.current.COMB_HONEY ?? 0) % lines.length;
        propInspectIndexRef.current.COMB_HONEY = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'COMB HONEY',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Vintage Cookstove / Country Aga stove with whistling copper kettle at X: 2..3, Y: 1..2
      if ((facingX >= 1 && facingX <= 3) && (facingY === 1 || facingY === 2)) {
        gameAudio.playHearthCrackle();
        gameAudio.playAlembicBubble();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.aga_stove;
        const curIdx = (propInspectIndexRef.current.AGA_STOVE ?? 0) % lines.length;
        propInspectIndexRef.current.AGA_STOVE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'AGA STOVE',
          text: lines[curIdx],
        });
        return;
      }

      // 5. Farmhouse Belfast Sink & Window at X: 5..6, Y: 1..2
      if ((facingX === 5 || facingX === 6) && (facingY === 1 || facingY === 2)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.belfast_sink;
        const curIdx = (propInspectIndexRef.current.BELFAST_SINK ?? 0) % lines.length;
        propInspectIndexRef.current.BELFAST_SINK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BELFAST SINK',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Baking Board with sliced apples at X: 4, Y: 2
      if (facingX === 4 && facingY === 2) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.baking_board;
        const curIdx = (propInspectIndexRef.current.BAKING_BOARD ?? 0) % lines.length;
        propInspectIndexRef.current.BAKING_BOARD = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BAKING BOARD',
          text: lines[curIdx],
        });
        return;
      }

      // 7. Kitchen counter with breadbox & fresh crusty bread at X: 13..14, Y: 1..2
      if ((facingX === 13 || facingX === 14) && (facingY === 1 || facingY === 2)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.baking_board;
        setOverworldDialogue({
          active: true,
          speakerName: 'BAKING BOARD',
          text: lines[0],
        });
        return;
      }

      // 8. Hanging Lavender & Copper pots overhead
      if (facingY === 0 && (facingX === 4 || facingX === 9 || facingX === 10)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const rafterLines = [
          "Blackened oak rafters hung with dried Devon lavender, copper pans, and a single rook feather.",
          "'The clock ticks, / The page is printed.'",
        ];
        const curIdx = (propInspectIndexRef.current.KITCHEN_RAFTERS ?? 0) % rafterLines.length;
        propInspectIndexRef.current.KITCHEN_RAFTERS = (curIdx + 1) % rafterLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'TIMBER RAFTERS',
          text: rafterLines[curIdx],
        });
        return;
      }

      // 9. Bee Box at X: 13, Y: 9
      if (facingX === 13 && facingY === 9) {
        gameAudio.playBeeHum();
        triggerHaptics(30);
        const lines = ROOM_KITCHEN.props.bee_box;
        const curIdx = (propInspectIndexRef.current.BEE_BOX ?? 0) % lines.length;
        propInspectIndexRef.current.BEE_BOX = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BEE BOX',
          text: lines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 8: THE HERMITAGE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'HERMITAGE') {
      // 1. Check Hermitage NPCs FIRST (Thoreau, Emily Dickinson, Wendell Berry, Coleridge)
      // Allow talking to Thoreau directly at (6, 8) or across his pine table from (6, 6) facing DOWN
      const isFacingThoreauAcrossTable = facingX === 6 && facingY === 7 && p.dir === 'DOWN';
      const isFacingEmilyAcrossDesk = facingX === 2 && facingY === 7 && p.dir === 'DOWN';
      const isFacingBerryAcrossDesk = facingX === 13 && facingY === 8 && p.dir === 'DOWN';

      const targetNpc = hermitageNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          (((npc.x === facingX && npc.y === facingY) ||
            (isFacingThoreauAcrossTable && (npc.poetId === 'THOREAU' || npc.id === 'npc_hermitage_thoreau')) ||
            (isFacingEmilyAcrossDesk && (npc.poetId === 'DICKINSON' || npc.id === 'npc_hermitage_dickinson')) ||
            (isFacingBerryAcrossDesk && (npc.poetId === 'BERRY' || npc.id === 'npc_hermitage_berry'))) ||
            (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === facingX &&
              Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              ((npc.movement.stepTo?.x === facingX && npc.movement.stepTo?.y === facingY) ||
               (npc.movement.stepFrom?.x === facingX && npc.movement.stepFrom?.y === facingY))) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for walking characters (Coleridge, Wendell Berry)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        // Immediately face the player when addressed
        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < stopTileY) npcTurnFacing = 'UP';
        else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
        else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
        else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';

        setHermitageNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 2.5,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // HENRY DAVID THOREAU: Winter Duelist in The Hermitage (160 HP)
        if (targetNpc.poetId === 'THOREAU' || targetNpc.id === 'npc_hermitage_thoreau') {
          promptPoetChoiceMenu(
            'HENRY DAVID THOREAU',
            targetNpc.greeting || "Good day. Thoreau. I went to the woods because I wished to live deliberately.",
            targetNpc.talkLines || [
              "“I had three chairs in my house; one for solitude, two for friendship, three for society.”",
              "“Simplify, simplify, simplify! Say, rather, one meal a day instead of three.”",
              "My mother brings a basket of laundry and warm pie on Sundays. A man can live deliberately and still appreciate pie.",
            ],
            targetNpc.duelLine || "“Simplify, simplify!”",
            'THOREAU',
            () => {
              setHermitageNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        if (targetNpc.poetId === 'BERRY' || targetNpc.id === 'npc_hermitage_berry') {
          promptPoetChoiceMenu(
            ROOM_HERMITAGE.entities.wendell_berry.name,
            ROOM_HERMITAGE.entities.wendell_berry.greeting,
            ROOM_HERMITAGE.entities.wendell_berry.talkLines,
            '',
            undefined,
            () => {
              setHermitageNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        if (targetNpc.poetId === 'COLERIDGE' || targetNpc.id === 'npc_hermitage_coleridge') {
          promptPoetChoiceMenu(
            ROOM_HERMITAGE.entities.coleridge.name,
            ROOM_HERMITAGE.entities.coleridge.greeting,
            ROOM_HERMITAGE.entities.coleridge.talkLines,
            '',
            undefined,
            () => {
              setHermitageNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        if (!targetNpc.hasSeenIntro) {
          const introText = targetNpc.introLine || targetNpc.greeting || `“${targetNpc.name}”`;
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text: introText,
            onComplete: () => {
              setHermitageNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        currentDialogueIndex: 0,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || targetNpc.normalLines?.[0] || 'The river-stone hearth is warm. Will you sit and converse, or walk on?',
          targetNpc.normalLines || targetNpc.talkLines || ['“I come into the peace of wild things.”'],
          '',
          undefined,
          () => {
            setHermitageNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      movement: n.movement
                        ? (n.movement.type === 'PATH'
                            ? { ...n.movement, pauseTimer: 2.5 }
                            : n.movement.type === 'TURN'
                            ? { ...n.movement, timer: 0 }
                            : n.movement)
                        : undefined,
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // 2. Room Props & Environmental Inspectables
      // Samuel Taylor Coleridge's Desk at X: 2, Y: 7 (The Knock from Porlock)
      if (facingX === 2 && facingY === 7) {
        const count = (interactionCountsRef.current.porlock || 0) + 1;
        interactionCountsRef.current.porlock = count;
        setInteractionState((prev) => ({ ...prev, porlock: count }));

        if (count % 2 === 1) {
          gameAudio.playPorlockKnock();
          triggerHaptics([40, 50, 40]);
          setOverworldDialogue({
            active: true,
            speakerName: "COLERIDGE'S DESK",
            text: "\"In Xanadu did Kubla Khan / A stately pleasu—\" [A PERSON FROM PORLOCK IS KNOCKING AT THE DOOR.]",
          });
        } else {
          gameAudio.playPageTurn();
          triggerHaptics(30);
          setOverworldDialogue({
            active: true,
            speakerName: "COLERIDGE'S DESK",
            text: "The visitor from Porlock stayed an hour on business. Coleridge dips his quill to start the vision over...",
          });
        }
        return;
      }

      // Henry David Thoreau's pine table at X: 6, Y: 7
      if (facingX === 6 && facingY === 7) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_HERMITAGE.props.thoreau_table;
        setOverworldDialogue({
          active: true,
          speakerName: "THOREAU'S TABLE",
          text: lines[0],
        });
        return;
      }

      // Wendell Berry's cedar desk at X: 13, Y: 8
      if (facingX === 13 && facingY === 8) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_HERMITAGE.props.berry_desk;
        setOverworldDialogue({
          active: true,
          speakerName: "WENDELL'S DESK",
          text: lines[0],
        });
        return;
      }

      // Split-rail chairs: "one for solitude, two for friendship, three for society"
      // Note: Chair 1 at (6, 8) is Thoreau's chair (talkable above). Chair 2 is at (8, 8) ("for friendship"), Chair 3 is at (10, 5) ("for society").
      if ((facingX === 8 && facingY === 8) || (facingX === 10 && facingY === 5)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_HERMITAGE.props.hermitage_bunk;
        setOverworldDialogue({
          active: true,
          speakerName: 'SPLIT-RAIL CHAIR',
          text: lines[0],
        });
        return;
      }

      // River-stone hearth with glowing birch logs & iron kettle at X: 6..9, Y: 1..2
      if ((facingX >= 6 && facingX <= 9) && (facingY === 1 || facingY === 2)) {
        gameAudio.playHearthCrackle();
        gameAudio.playAlembicBubble();
        triggerHaptics(35);
        const lines = [
          "A mortarless river-stone hearth where a thin film of soot flutters on the iron grate.",
          "'The Frost performs its secret ministry, / Unhelped by any wind.'",
        ];
        const curIdx = (propInspectIndexRef.current.HERMITAGE_HEARTH ?? 0) % lines.length;
        propInspectIndexRef.current.HERMITAGE_HEARTH = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'RIVER-STONE HEARTH',
          text: lines[curIdx],
        });
        return;
      }

      // Braided/woven wool hearth rug in front of hearth at X: 7..8, Y: 3..4
      if ((facingX === 7 || facingX === 8) && (facingY === 3 || facingY === 4)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_HERMITAGE.props.hermitage_hearth;
        setOverworldDialogue({
          active: true,
          speakerName: 'HEARTH RUG',
          text: lines[1],
        });
        return;
      }

      // Split birch firewood cradle at X: 10, Y: 2
      if (facingX === 10 && facingY === 2) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = [
          "Split white birch stacked neatly beside a borrowed axe.",
          "'Every man looks at his wood-pile with a kind of affection.'",
        ];
        const curIdx = (propInspectIndexRef.current.HERMITAGE_FIREWOOD ?? 0) % lines.length;
        propInspectIndexRef.current.HERMITAGE_FIREWOOD = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'FIREWOOD CRADLE',
          text: lines[curIdx],
        });
        return;
      }

      // Paired rustic log beds along left wall:
      // Upper bunk/bed at X: 1..2, Y: 2..3 and lower bed at X: 1..2, Y: 4..5
      if ((facingX === 1 || facingX === 2) && (facingY >= 2 && facingY <= 5)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_HERMITAGE.props.hermitage_bunk;
        setOverworldDialogue({
          active: true,
          speakerName: 'RUSTIC LOG BED',
          text: lines[0],
        });
        return;
      }

      // Pine multi-pane woodland cabin window on right wall at X: 15, Y: 5..6
      if (facingX === 15 && (facingY === 5 || facingY === 6)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: 'CABIN WINDOW',
          text: 'A pine multi-pane woodland cabin window framing quiet pines and dappled green forest light.',
        });
        return;
      }

      // Bookshelf at X: 14, Y: 3..4
      if (facingX === 14 && (facingY === 3 || facingY === 4)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = [
          "A rough pine shelf holding Homer's Iliad in Greek and a field journal.",
          "'I went to the woods because I wished to live deliberately.'",
        ];
        const curIdx = (propInspectIndexRef.current.HERMITAGE_BOOKSHELF ?? 0) % lines.length;
        propInspectIndexRef.current.HERMITAGE_BOOKSHELF = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'PINE BOOKSHELF',
          text: lines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // SCREEN 5: THE TREELINE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'TREELINE') {
      // 1. STRICT NPC PRIORITY: Always check for Treeline NPCs (Robert Frost, John Donne) FIRST
      const targetNpc = treelineNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              npc.movement.stepTo?.x === facingX &&
              npc.movement.stepTo?.y === facingY) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
        else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
        else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
        else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';

        setTreelineNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                }
              : n,
          ),
        );

        // ROBERT FROST: FIGHTABLE (X: 5, Y: 9)
        if (targetNpc.poetId === 'FROST' || targetNpc.id === 'npc_treeline_frost') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: ROOM_TREELINE.entities.robert_frost.name,
              text: ROOM_TREELINE.entities.robert_frost.greeting,
              onComplete: () => {
                setTreelineNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false } : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            ROOM_TREELINE.entities.robert_frost.name,
            ROOM_TREELINE.entities.robert_frost.greeting,
            ROOM_TREELINE.entities.robert_frost.talkLines,
            ROOM_TREELINE.entities.robert_frost.duelLine,
            'FROST',
            () => {
              setTreelineNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }

        // JOHN DONNE: Talker (X: 17, Y: 6)
        if (!targetNpc.hasSeenIntro) {
          const introText = targetNpc.introLine || targetNpc.greeting || ROOM_TREELINE.entities.john_donne.greeting;
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text: introText,
            onComplete: () => {
              setTreelineNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? { ...n, hasSeenIntro: true, currentDialogueIndex: 0, isInteracting: false }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          ROOM_TREELINE.entities.john_donne.name,
          ROOM_TREELINE.entities.john_donne.greeting,
          ROOM_TREELINE.entities.john_donne.talkLines,
          '',
          undefined,
          () => {
            setTreelineNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? { ...n, isInteracting: false }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // 2. DOORS & PROPS
      // 1. Check Kitchen Door: X: 5, Y: 8 -> Transitions inside The Kitchen!
      const isKitchenDoor = facingX === 5 && facingY === 8;
      if (isKitchenDoor) {
        if (p.dir === 'UP') {
          transitionOverworldScreen('KITCHEN', 7, 10, 'UP');
          return;
        } else {
          gameAudio.playCrispClick();
          triggerHaptics(30);
          const lines = ROOM_TREELINE.props.kitchen_exterior;
          setOverworldDialogue({
            active: true,
            speakerName: 'KITCHEN COTTAGE',
            text: lines[0],
          });
          return;
        }
      }

      // 1.1 Check Glowing Amber Window on Kitchen at X: 4, Y: 8
      if (facingX === 4 && facingY === 8) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_TREELINE.props.kitchen_exterior;
        setOverworldDialogue({
          active: true,
          speakerName: 'AMBER WINDOW',
          text: lines[1] || lines[0],
        });
        return;
      }

      // 1.2 Check Kitchen Fieldstone Chimney at X: 8, Y: 4..5
      if (facingX === 8 && (facingY === 4 || facingY === 5)) {
        gameAudio.playHearthCrackle();
        triggerHaptics(30);
        const lines = ROOM_TREELINE.props.kitchen_exterior;
        setOverworldDialogue({
          active: true,
          speakerName: 'FIELDSTONE CHIMNEY',
          text: lines[1] || lines[0],
        });
        return;
      }

      // 1.3 Check Wooden Trail Marker pointing north ("↑ The Summit") at X: 19, Y: 1..2
      if (facingX === 19 && (facingY === 1 || facingY === 2)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_TREELINE.props.trail_marker;
        setOverworldDialogue({
          active: true,
          speakerName: 'TRAIL MARKER',
          text: `${lines[0]} — ${lines[1]}`,
        });
        return;
      }

      // 1.4 Check Snow-Dusted Pines at X: 20, 33 at Y: 2..3
      if ((facingX === 20 || facingX === 33) && (facingY === 2 || facingY === 3)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const pineLines = [
          "Hardy alpine pines clinging to the rock face, their boughs heavy with winter snow.",
          "'The way a crow / Shook down on me / The dust of snow / From a hemlock tree.'",
        ];
        const curIdx = (propInspectIndexRef.current.TREELINE_PINES ?? 0) % pineLines.length;
        propInspectIndexRef.current.TREELINE_PINES = (curIdx + 1) % pineLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'SNOW-DUSTED PINE',
          text: pineLines[curIdx],
        });
        return;
      }

      // 2. Check Hermitage Door: X: 28, Y: 20 -> Transitions inside The Hermitage!
      const isHermitageDoor = facingX === 28 && facingY === 20;
      if (isHermitageDoor && p.dir === 'UP') {
        transitionOverworldScreen('HERMITAGE', 7, 10, 'UP');
        return;
      }

      // 3. Check Graveyard Gate: X: 28, Y: 8 -> Transitions inside The Graveyard!
      const isGraveyardGate = facingX === 28 && facingY === 8;
      if (isGraveyardGate && p.dir === 'UP') {
        transitionOverworldScreen('GRAVEYARD', 7, 10, 'UP');
        return;
      }

      // 3.0 Check Cardinal on fence post (Ways of Looking at the Blackbird • X: 24, Y: 5..6)
      if (facingX === 24 && (facingY === 5 || facingY === 6)) {
        gameAudio.playCardinalChirp();
        triggerHaptics(30);
        const count = (interactionCountsRef.current.blackbird_ways || 0) + 1;
        interactionCountsRef.current.blackbird_ways = count;
        setInteractionState((prev) => ({ ...prev, blackbird_ways: count }));

        const step = ((count - 1) % 3) + 1;
        let text = "";
        if (step === 1) {
          text = "[WAY I] Across twenty silent, snow-packed peaks, the only moving thing is the dark eye of the bird.";
        } else if (step === 2) {
          text = "[WAY V] You cannot decide which you prefer: the crisp inflection of the whistle, or the quiet innuendo that follows.";
        } else {
          text = "[WAY XIII] It was evening all afternoon, and the snow is still falling.";
          snowBurstTimerRef.current = 2.0;
          setSnowBurstTimer(2.0);
        }
        setOverworldDialogue({
          active: true,
          speakerName: 'IRON POST',
          text,
        });
        return;
      }

      // 3.1 Check Stone Wall (Row Y: 13, X: 0..12)
      if (facingX <= 12 && facingY === 13) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_TREELINE.props.stone_wall;
        setOverworldDialogue({
          active: true,
          speakerName: 'STONE WALL',
          text: lines[0],
        });
        return;
      }

      // 3.4 Check Frozen Pond / Tarn of Auber (X: 14..22, Y: 11..17)
      const isFacingFrozenLake = facingX >= 14 && facingX <= 22 && facingY >= 11 && facingY <= 17;
      if (isFacingFrozenLake) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_TREELINE.props.alpine_pond_prop;
        setOverworldDialogue({
          active: true,
          speakerName: 'FROZEN POND',
          text: lines[0],
        });
        return;
      }

      // 3.5 Check Snowshoe Hare on verge (X: 12..13, Y: 20..21)
      if ((facingX === 12 || facingX === 13) && (facingY === 20 || facingY === 21)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_TREELINE.props.treeline_hare;
        setOverworldDialogue({
          active: true,
          speakerName: 'SNOWSHOE HARE',
          text: lines[0],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 6: THE LIBRARY INTERACTIONS (MODERNIST ARCHIVE & STUDY)
    // =========================================================================
    if (currentScreenId === 'LIBRARY') {
      // 1. STRICT NPC PRIORITY: Always check for Library NPCs (T. S. Eliot, W. B. Yeats, Ezra Pound, Sor Juana) FIRST
      const targetNpc = libraryNpcsRef.current.find((npc) => {
        if (!npc.isActive || npc.isDissolving || npc.isRecruited || (npc.poetId && capturedPoetIds.includes(npc.poetId))) return false;
        if (npc.x === facingX && npc.y === facingY) return true;
        const curTileX = Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE);
        const curTileY = Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE);
        if (curTileX === facingX && curTileY === facingY) return true;
        if (npc.isMoving && npc.movement?.type === 'PATH') {
          if (npc.movement.stepTo && npc.movement.stepTo.x === facingX && npc.movement.stepTo.y === facingY) return true;
          if (npc.movement.stepFrom && npc.movement.stepFrom.x === facingX && npc.movement.stepFrom.y === facingY) return true;
        }
        if (npc.patrol && npc.patrol.stepTo.x === facingX && npc.patrol.stepTo.y === facingY) return true;
        // Proximity detection in direction player is facing
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 26) {
          if (p.dir === 'UP' && npcPxY <= pPxY + 4) return true;
          if (p.dir === 'DOWN' && npcPxY >= pPxY - 4) return true;
          if (p.dir === 'LEFT' && npcPxX <= pPxX + 4) return true;
          if (p.dir === 'RIGHT' && npcPxX >= pPxX - 4) return true;
        }
        return false;
      });

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for all Library characters (T. S. Eliot, Ezra Pound, Sor Juana, W. B. Yeats)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        // Immediately halts and turns to face the player when spoken to!
        const relX = p.gridX - stopTileX;
        const relY = p.gridY - stopTileY;
        let npcTurnFacing: FacingDirection;
        if (Math.abs(relX) > Math.abs(relY)) {
          npcTurnFacing = relX > 0 ? 'RIGHT' : 'LEFT';
        } else if (Math.abs(relY) > Math.abs(relX)) {
          npcTurnFacing = relY > 0 ? 'DOWN' : 'UP';
        } else {
          npcTurnFacing = p.dir === 'UP' ? 'DOWN' : p.dir === 'DOWN' ? 'UP' : p.dir === 'LEFT' ? 'RIGHT' : 'LEFT';
        }

        setLibraryNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 3.5,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // SOR JUANA INÉS DE LA CRUZ: FIGHTABLE!
        if (targetNpc.poetId === 'SOR_JUANA' || targetNpc.id === 'npc_library_sor_juana') {
          promptPoetChoiceMenu(
            ROOM_LIBRARY.entities.sor_juana.name,
            ROOM_LIBRARY.entities.sor_juana.greeting,
            ROOM_LIBRARY.entities.sor_juana.talkLines,
            ROOM_LIBRARY.entities.sor_juana.duelLine,
            'SOR_JUANA',
            () => {
              setLibraryNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement ? { ...n.movement, timer: 0 } : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // T. S. ELIOT
        if (targetNpc.poetId === 'ELIOT' || targetNpc.id === 'npc_library_eliot') {
          promptPoetChoiceMenu(
            ROOM_LIBRARY.entities.library_eliot.name,
            ROOM_LIBRARY.entities.library_eliot.greeting,
            ROOM_LIBRARY.entities.library_eliot.talkLines,
            '',
            undefined,
            () => {
              setLibraryNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // EZRA POUND
        if (targetNpc.poetId === 'POUND' || targetNpc.id === 'npc_library_pound') {
          promptPoetChoiceMenu(
            ROOM_LIBRARY.entities.ezra_pound.name,
            ROOM_LIBRARY.entities.ezra_pound.greeting,
            ROOM_LIBRARY.entities.ezra_pound.talkLines,
            '',
            undefined,
            () => {
              setLibraryNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }
        return;
      }

      // 2. STUDY EQUIPMENT & LIBRARY PROPS
      // 1. Eliot's Study Desk at X: 3, Y: 6
      if (facingX === 3 && facingY === 6) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.eliot_desk;
        const curIdx = (propInspectIndexRef.current.ELIOT_DESK ?? 0) % lines.length;
        propInspectIndexRef.current.ELIOT_DESK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "ELIOT'S STUDY DESK",
          text: lines[curIdx],
        });
        return;
      }

      // 2. Yeats's Reading Table with Astrological Chart & Byzantium Bird at X: 12, Y: 6
      if (facingX === 12 && facingY === 6) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.yeats_table;
        const curIdx = (propInspectIndexRef.current.YEATS_TABLE ?? 0) % lines.length;
        propInspectIndexRef.current.YEATS_TABLE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "YEATS'S READING TABLE",
          text: lines[curIdx],
        });
        return;
      }

      // 3. Pound's Reading Lectern with Chinese inkstones and Cantos drafts at X: 4, Y: 3
      if (facingX === 4 && facingY === 3) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.pound_lectern;
        const curIdx = (propInspectIndexRef.current.POUND_LECTERN ?? 0) % lines.length;
        propInspectIndexRef.current.POUND_LECTERN = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "POUND'S READING LECTERN",
          text: lines[curIdx],
        });
        return;
      }

      // 4. Central Mahogany Table with Green Banker's Lamps at X: 7..8, Y: 5 (The Infinite Hexagonal Catalog)
      if ((facingX === 7 || facingX === 8) && facingY === 5) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const count = (interactionCountsRef.current.hexagonal_catalog || 0) + 1;
        interactionCountsRef.current.hexagonal_catalog = count;
        setInteractionState((prev) => ({ ...prev, hexagonal_catalog: count }));

        const step = ((count - 1) % 3) + 1;
        let text = "";
        if (step === 1) {
          text = "You open Volume 14-B: four hundred and ten pages of repeating letters—'M C V M C V'—from top to bottom.";
        } else if (step === 2) {
          text = "You open Volume 88-Z: an index of every book that has ever been misplaced on the mountain.";
        } else {
          text = "You find a single lucid sentence in dialect, then the draft from the doorway flips the pages back to gibberish.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: 'CENTRAL MAHOGANY TABLE',
          text,
        });
        return;
      }

      // 5. Vintage Oak Card Catalog at X: 1, Y: 9
      if (facingX === 1 && facingY === 9) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.card_catalog;
        const curIdx = (propInspectIndexRef.current.CARD_CATALOG ?? 0) % lines.length;
        propInspectIndexRef.current.CARD_CATALOG = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'VINTAGE OAK CARD CATALOG',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Celestial Globe Stand at X: 14, Y: 9
      if (facingX === 14 && facingY === 9) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.celestial_globe;
        const curIdx = (propInspectIndexRef.current.CELESTIAL_GLOBE ?? 0) % lines.length;
        propInspectIndexRef.current.CELESTIAL_GLOBE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CELESTIAL GLOBE',
          text: lines[curIdx],
        });
        return;
      }

      // 6.5. Marianne Moore's East Lectern (ARTIFACT 8: Moore's Tricorne Hat) (East Bay • X: 14, Y: 10)
      if ((facingX === 14 && facingY === 10) || (p.gridX === 13 && p.gridY === 10 && p.dir === 'RIGHT')) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const mooreLines = [
          "A black three-cornered tricorne hat and a dark wool cape hang neatly from the corner of the lectern.",
          "Open on the stand: 'Imaginary gardens with real toads in them.'",
        ];
        const curIdx = (propInspectIndexRef.current.MOORE_LECTERN ?? 0) % mooreLines.length;
        propInspectIndexRef.current.MOORE_LECTERN = (curIdx + 1) % mooreLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "MOORE'S READING LECTERN",
          text: mooreLines[curIdx],
        });
        return;
      }

      // 7. Rolling Ladder at X: 2, Y: 2
      if (facingX === 2 && facingY === 2) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.rolling_ladder;
        const curIdx = (propInspectIndexRef.current.ROLLING_LADDER ?? 0) % lines.length;
        propInspectIndexRef.current.ROLLING_LADDER = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ROLLING LADDER',
          text: lines[curIdx],
        });
        return;
      }

      // 7.5. Sor Juana's Desk at X: 11, Y: 2
      if (facingX === 11 && facingY === 2) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.sor_juana_desk;
        const curIdx = (propInspectIndexRef.current.SOR_JUANA_DESK ?? 0) % lines.length;
        propInspectIndexRef.current.SOR_JUANA_DESK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "SOR JUANA'S DESK",
          text: lines[curIdx],
        });
        return;
      }

      // 8. Double-Sided Bookstacks
      const isWestRange = (facingX >= 1 && facingX <= 3) && (facingY === 2 || facingY === 5 || facingY === 8);
      const isEastRange = ((facingX >= 12 && facingX <= 14) && (facingY === 5 || facingY === 8)) ||
                          ((facingX === 13 || facingX === 14) && (facingY === 2 || facingY === 3));
      const isNorthShelf = facingY === 1 && facingX >= 1 && facingX <= 14 && facingX !== 7 && facingX !== 8;
      if (isWestRange || isEastRange || isNorthShelf) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_LIBRARY.props.bookstacks;
        const curIdx = (propInspectIndexRef.current.BOOKSTACKS ?? 0) % lines.length;
        propInspectIndexRef.current.BOOKSTACKS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'DOUBLE-SIDED BOOKSTACKS',
          text: lines[curIdx],
        });
        return;
      }

      // 9. High Ruined Clerestory Window at X: 7..8, Y: 1
      if ((facingX === 7 || facingX === 8) && facingY === 1) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const winLines = [
          "A high stone clerestory arch framing the deep blue autumn sky.",
          "'And immediately / Rather than words comes the thought of high windows: / The sun-comprehending glass.'",
        ];
        const curIdx = (propInspectIndexRef.current.LIBRARY_CLERESTORY ?? 0) % winLines.length;
        propInspectIndexRef.current.LIBRARY_CLERESTORY = (curIdx + 1) % winLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CLERESTORY WINDOW',
          text: winLines[curIdx],
        });
        return;
      }

      // 10. Russet Autumn Leaves Blown in on stones
      if (
        (facingX === 6 && (facingY === 9 || facingY === 10)) ||
        (facingX === 9 && (facingY === 9 || facingY === 10)) ||
        (facingX === 5 && facingY === 8) ||
        (facingX === 10 && facingY === 7)
      ) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const leafLines = [
          "Dry russet and golden autumn leaves drifted across the stone floor.",
          "'Thus in the wind on light leaves vanished the Sibyl's counsel.'",
        ];
        const curIdx = (propInspectIndexRef.current.LIBRARY_LEAVES ?? 0) % leafLines.length;
        propInspectIndexRef.current.LIBRARY_LEAVES = (curIdx + 1) % leafLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'AUTUMN LEAVES',
          text: leafLines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 5: THE MOUNTAIN GOAT INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'MOUNTAIN_GOAT') {
      // 1. STRICT NPC PRIORITY: Always check for Mountain Goat NPCs (Khayyam, Bukowski, Ginsberg, Baudelaire) FIRST
      const targetNpc = mountainGoatNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === facingX &&
              Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              ((npc.movement.stepTo?.x === facingX && npc.movement.stepTo?.y === facingY) ||
               (npc.movement.stepFrom?.x === facingX && npc.movement.stepFrom?.y === facingY))) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for strolling characters (Omar Khayyám, Allen Ginsberg)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < stopTileY) npcTurnFacing = 'UP';
        else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
        else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
        else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';

        setMountainGoatNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 2.5,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // OMAR KHAYYÁM: Seated at table (3, 8), walks to fireplace (2, 3) and back. Talker
        if (targetNpc.poetId === 'OMAR_KHAYYAM' || targetNpc.id === 'npc_goat_khayyam') {
          promptPoetChoiceMenu(
            ROOM_MOUNTAIN_GOAT.entities.tavern_khayyam.name,
            ROOM_MOUNTAIN_GOAT.entities.tavern_khayyam.greeting,
            ROOM_MOUNTAIN_GOAT.entities.tavern_khayyam.talkLines,
            '',
            undefined,
            () => {
              setMountainGoatNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // CHARLES BUKOWSKI: At stool (10, 4). FIGHTABLE!
        if (targetNpc.poetId === 'BUKOWSKI' || targetNpc.id === 'npc_goat_bukowski') {
          promptPoetChoiceMenu(
            ROOM_MOUNTAIN_GOAT.entities.bukowski.name,
            ROOM_MOUNTAIN_GOAT.entities.bukowski.greeting,
            ROOM_MOUNTAIN_GOAT.entities.bukowski.talkLines,
            ROOM_MOUNTAIN_GOAT.entities.bukowski.duelLine,
            'BUKOWSKI',
            () => {
              setMountainGoatNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }

        // ALLEN GINSBERG: Talker
        if (targetNpc.poetId === 'GINSBERG' || targetNpc.id === 'npc_goat_ginsberg') {
          promptPoetChoiceMenu(
            ROOM_MOUNTAIN_GOAT.entities.ginsberg.name,
            ROOM_MOUNTAIN_GOAT.entities.ginsberg.greeting,
            ROOM_MOUNTAIN_GOAT.entities.ginsberg.talkLines,
            '',
            undefined,
            () => {
              setMountainGoatNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }
        return;
      }

      // 2. TAVERN RELICS & FURNITURE
      // 1. Omar Khayyám's Table: Earthenware ruby wine flagon, crusty flatbread loaf, open verses scroll at X: 3, Y: 7
      if (facingX === 3 && facingY === 7) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_MOUNTAIN_GOAT.props.omar_khayyams_table;
        const curIdx = (propInspectIndexRef.current.KHAYYAM_TABLE ?? 0) % lines.length;
        propInspectIndexRef.current.KHAYYAM_TABLE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "OMAR KHAYYÁM'S TABLE",
          text: lines[curIdx],
        });
        return;
      }

      // 2. Li Bai's Setting: Celadon porcelain wine flask and cup reflecting the moon at X: 13, Y: 4
      if ((facingX === 13 || facingX === 14) && (facingY === 4 || facingY === 3)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_MOUNTAIN_GOAT.props.li_bais_setting;
        const curIdx = (propInspectIndexRef.current.LI_BAI_SETTING ?? 0) % lines.length;
        propInspectIndexRef.current.LI_BAI_SETTING = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "LI BAI'S SETTING",
          text: lines[curIdx],
        });
        return;
      }

      // 3. Matsuo Bashō's Relics: Bamboo traveling hat, walking staff & worn waraji sandals at X: 4, Y: 2
      if ((facingX === 4 && facingY === 2) || (facingX === 3 && facingY === 3)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_MOUNTAIN_GOAT.props.bashos_relics;
        const curIdx = (propInspectIndexRef.current.BASHO_RELICS ?? 0) % lines.length;
        propInspectIndexRef.current.BASHO_RELICS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "BASHŌ'S RELICS",
          text: lines[curIdx],
        });
        return;
      }

      // 4. The Great Hearth & Steaming Cast-Iron Kettle at X: 1..3, Y: 2
      if (facingX >= 1 && facingX <= 3 && facingY === 2) {
        gameAudio.playHearthCrackle();
        gameAudio.playAlembicBubble();
        triggerHaptics(35);
        const lines = ROOM_MOUNTAIN_GOAT.props.the_great_hearth_and_kettle;
        const curIdx = (propInspectIndexRef.current.HEARTH_KETTLE ?? 0) % lines.length;
        propInspectIndexRef.current.HEARTH_KETTLE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'THE GREAT HEARTH & KETTLE',
          text: lines[curIdx],
        });
        return;
      }

      // 5. Carved Wooden Mountain Goat Tavern Sign mounted above the bar (X: 8..9, Y: 1)
      if ((facingX === 8 || facingX === 9) && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_MOUNTAIN_GOAT.props.carved_mountain_goat_sign;
        const curIdx = (propInspectIndexRef.current.GOAT_SIGN ?? 0) % lines.length;
        propInspectIndexRef.current.GOAT_SIGN = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CARVED MOUNTAIN GOAT SIGN',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Live-Edge Cedar Bar Counter with Clay Flagons & Celadon Cups at X: 6..11, Y: 3
      if (facingX >= 6 && facingX <= 11 && facingY === 3) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_MOUNTAIN_GOAT.props.live_edge_cedar_bar;
        const curIdx = (propInspectIndexRef.current.CEDAR_BAR ?? 0) % lines.length;
        propInspectIndexRef.current.CEDAR_BAR = (curIdx + 1) % lines.length;
        let text = lines[curIdx];
        if (leadPoetId === 'BUKOWSKI') {
          text += "\n\nBukowski settles his elbow straight into the worn dent in the bar varnish like he never left.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: 'LIVE-EDGE CEDAR BAR',
          text,
        });
        return;
      }

      // 7. Open Stone Mountain Archway / Veranda Window at X: 15, Y: 3..5
      if (facingX === 15 && facingY >= 3 && facingY <= 5) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const archLines = [
          "An open stone archway framing misty peaks and drifting autumn clouds.",
          "'The birds have vanished into the sky, / and now the last cloud drains away.'",
        ];
        const curIdx = (propInspectIndexRef.current.GOAT_ARCHWAY ?? 0) % archLines.length;
        propInspectIndexRef.current.GOAT_ARCHWAY = (curIdx + 1) % archLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'MOUNTAIN ARCHWAY',
          text: archLines[curIdx],
        });
        return;
      }

      // 8. Low Timber Table with Tea Bowls & Flickering Brass Oil Lamp at X: 11, Y: 7
      if (facingX === 11 && facingY === 7) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const tableLines = [
          "A scarred cedar corner table holding a crumpled Hollywood Park Racing Form and two empty bottles.",
          "'There's a bluebird in my heart that / wants to get out / but I'm too tough for him.'",
        ];
        const curIdx = (propInspectIndexRef.current.GOAT_TIMBER_TABLE ?? 0) % tableLines.length;
        propInspectIndexRef.current.GOAT_TIMBER_TABLE = (curIdx + 1) % tableLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'TIMBER TABLE',
          text: tableLines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // SCREEN 4: THE RUINS (Canto IV: The Narrow Road • 36x28) INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'RUINS') {
      // 1. Check The Mermaid Tavern Door: X: 7, Y: 8 -> Transitions inside!
      const isGoatDoor = (facingX === 7 && facingY === 8) || (p.gridX === 7 && p.gridY === 9 && p.dir === 'UP');
      if (isGoatDoor && (p.dir === 'UP' || facingY === 8)) {
        transitionOverworldScreen('MOUNTAIN_GOAT', 7, 10, 'UP');
        return;
      }

      // 2. Check The Library Door: X: 28, Y: 9 -> Transitions inside!
      const isLibraryDoor = (facingX === 28 && facingY === 9) || (p.gridX === 28 && p.gridY === 10 && p.dir === 'UP');
      if (isLibraryDoor && (p.dir === 'UP' || facingY === 9)) {
        transitionOverworldScreen('LIBRARY', 7, 10, 'UP');
        return;
      }

      // 3. Check Weathered Marble Muse Statue: X: 30, Y: 13
      if (facingX === 30 && facingY === 13) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.weathered_marble_muse_statue;
        const curIdx = (propInspectIndexRef.current.MUSE_STATUE ?? 0) % lines.length;
        propInspectIndexRef.current.MUSE_STATUE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ARCHAIC TORSO',
          text: lines[curIdx],
        });
        return;
      }

      // 3.00. Check Ozymandias on the old road: X: 2, Y: 16
      if (facingX === 2 && facingY === 16) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.ozymandias;
        const curIdx = (propInspectIndexRef.current.OZYMANDIAS ?? 0) % lines.length;
        propInspectIndexRef.current.OZYMANDIAS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'TWO LEGS OF STONE',
          text: lines[curIdx],
        });
        return;
      }

      // 3.0. Check The Empty Plinth (was the Statue of Calliope): X: 4..5, Y: 21..22
      if ((facingX === 4 || facingX === 5) && (facingY === 21 || facingY === 22)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(35);
        const lines = ROOM_RUINS.props.monumental_statue_of_calliope;
        const curIdx = (propInspectIndexRef.current.CALLIOPE_STATUE ?? 0) % lines.length;
        propInspectIndexRef.current.CALLIOPE_STATUE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'EMPTY PLINTH',
          text: lines[curIdx],
        });
        return;
      }

      // 3.1. Check Fallen Column Drums: X: 23, 33 at Y: 10
      if ((facingX === 23 || facingX === 33) && facingY === 10) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.fallen_travertine_column_drums;
        const curIdx = (propInspectIndexRef.current.COLUMN_DRUMS ?? 0) % lines.length;
        propInspectIndexRef.current.COLUMN_DRUMS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'FALLEN TRAVERTINE COLUMN DRUMS',
          text: lines[curIdx],
        });
        return;
      }

      // 3.1c. Check Arched Roman Limestone Bridge: X: 18..22, Y: 12..13
      if ((facingX >= 18 && facingX <= 22) && (facingY === 12 || facingY === 13)) {
        gameAudio.playFootstepStone();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.arched_roman_limestone_bridge;
        const curIdx = (propInspectIndexRef.current.RUINS_BRIDGE ?? 0) % lines.length;
        propInspectIndexRef.current.RUINS_BRIDGE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ARCHED ROMAN LIMESTONE BRIDGE',
          text: lines[curIdx],
        });
        return;
      }

      // 3.2. Check White Mountain Goat: X: 12, Y: 8
      const isGoatAnimal = facingX === 12 && facingY === 8;
      if (isGoatAnimal) {
        gameAudio.playGoatBleat();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.white_mountain_goat;
        const curIdx = (propInspectIndexRef.current.RUINS_GOAT ?? 0) % lines.length;
        propInspectIndexRef.current.RUINS_GOAT = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'WHITE MOUNTAIN GOAT',
          text: lines[curIdx],
        });
        return;
      }

      // 3.4. Check Timber Footbridge at Y: 20 across X: 18..22
      if ((facingX >= 18 && facingX <= 22) && facingY === 20) {
        gameAudio.playFootstepWood();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: 'STREAM FOOTBRIDGE',
          text: 'A sturdy timber footbridge spanning the mountain stream.',
        });
        return;
      }

      // 3.5. Check Calligraphy Writing Desk: X: 31, Y: 21..22
      if (facingX === 31 && (facingY === 21 || facingY === 22)) {
        gameAudio.playPageTurn();
        triggerHaptics(35);
        setOverworldDialogue({
          active: true,
          speakerName: 'CALLIGRAPHY DESK',
          text: "A low wooden writing desk with a bamboo brush and sumi ink stone. 'An ancient pond / A frog jumps in / The sound of water.'",
        });
        return;
      }

      // 3.6. Check Ancient Pond Frog on Stone: X: 25, Y: 23..24
      if (facingX === 25 && (facingY === 23 || facingY === 24)) {
        gameAudio.playFrogPlop();
        triggerHaptics(35);
        let text = "An ancient pond... PLOP! The frog splashes and climbs right back onto its rock.";
        if (leadPoetId === 'BASHO') {
          text += " Bashō nods approvingly at the ripple.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: 'ANCIENT POND FROG',
          text,
        });
        return;
      }

      // 3.6b. Check Lotus & Koi Pond: X: 26..30, Y: 23..25
      if (facingX >= 26 && facingX <= 30 && facingY >= 23 && facingY <= 25) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.lotus_and_koi_pond;
        const curIdx = (propInspectIndexRef.current.KOI_POND ?? 0) % lines.length;
        propInspectIndexRef.current.KOI_POND = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'LOTUS & KOI POND',
          text: lines[curIdx],
        });
        return;
      }

      // 3.6c. Check Ancient Red Oak Tree: X: 11, Y: 20
      if (facingX === 11 && facingY === 20) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_RUINS.props.ancient_red_oak_tree;
        const curIdx = (propInspectIndexRef.current.RED_OAK ?? 0) % lines.length;
        propInspectIndexRef.current.RED_OAK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ANCIENT RED OAK TREE',
          text: lines[curIdx],
        });
        return;
      }

      // 3.7. Check Tea Pavilion Veranda: X: 27..31, Y: 18..20
      if (facingX >= 27 && facingX <= 31 && facingY >= 18 && facingY <= 20) {
        gameAudio.playFootstepWood();
        triggerHaptics(25);
        const lines = ROOM_RUINS.props.tea_pavilion_pillars_and_deck;
        const curIdx = (propInspectIndexRef.current.TEA_PAVILION ?? 0) % lines.length;
        propInspectIndexRef.current.TEA_PAVILION = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'TEA PAVILION PILLARS & DECK',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Check Ruins NPCs (Li Bai, Bashō, Anna Akhmatova, Omar Khayyam)
      const targetNpc = ruinsNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === facingX &&
              Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              ((npc.movement.stepTo?.x === facingX && npc.movement.stepTo?.y === facingY) ||
               (npc.movement.stepFrom?.x === facingX && npc.movement.stepFrom?.y === facingY))) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for walking characters (Li Bai)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < stopTileY) npcTurnFacing = 'UP';
        else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
        else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
        else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';

        // Keep Bashō facing forward (DOWN) on the pavilion deck in The Ruins
        if (targetNpc.poetId === 'BASHO' || targetNpc.id === 'npc_ruins_basho') {
          npcTurnFacing = 'DOWN';
        }

        // Keep Anna Akhmatova facing toward the Muse statue (LEFT)
        if (targetNpc.poetId === 'ANNA_AKHMATOVA' || targetNpc.id === 'npc_ruins_akhmatova') {
          npcTurnFacing = 'LEFT';
        }

        setRuinsNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 3.0,
                          }
                        : n.movement.type === 'TURN'
                        ? { ...n.movement, timer: 0 }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // LI BAI: FIGHTABLE (Courtyard stroll between riverbank and pavilion/plaza)
        if (targetNpc.poetId === 'LI_BAI' || targetNpc.id === 'npc_ruins_li_bai') {
          promptPoetChoiceMenu(
            ROOM_RUINS.entities.li_bai.name,
            ROOM_RUINS.entities.li_bai.greeting,
            ROOM_RUINS.entities.li_bai.talkLines,
            ROOM_RUINS.entities.li_bai.duelLine,
            'LI_BAI',
            () => {
              setRuinsNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // MATSUO BASHŌ: FIGHTABLE (At X: 20, Y: 13 on pavilion deck facing forward)
        if (targetNpc.poetId === 'BASHO' || targetNpc.id === 'npc_ruins_basho') {
          promptPoetChoiceMenu(
            ROOM_RUINS.entities.matsuo_basho.name,
            ROOM_RUINS.entities.matsuo_basho.greeting,
            ROOM_RUINS.entities.matsuo_basho.talkLines,
            ROOM_RUINS.entities.matsuo_basho.duelLine,
            'BASHO',
            () => {
              setRuinsNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
              );
            },
          );
          return;
        }

        // ANNA AKHMATOVA: Reflects poetically on monuments and memory beside the Muse
        if (targetNpc.poetId === 'ANNA_AKHMATOVA' || targetNpc.id === 'npc_ruins_akhmatova') {
          promptPoetChoiceMenu(
            ROOM_RUINS.entities.anna_akhmatova.name,
            ROOM_RUINS.entities.anna_akhmatova.greeting,
            ROOM_RUINS.entities.anna_akhmatova.talkLines,
            '',
            undefined,
            () => {
              setRuinsNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? { ...n, hasSeenIntro: true, isInteracting: false, facing: 'LEFT' }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // OMAR KHAYYÁM on Ruins
        if (targetNpc.poetId === 'OMAR_KHAYYAM' || targetNpc.id === 'npc_ruins_khayyam') {
          promptPoetChoiceMenu(
            ROOM_RUINS.entities.omar_khayyam.name,
            ROOM_RUINS.entities.omar_khayyam.greeting,
            ROOM_RUINS.entities.omar_khayyam.talkLines,
            '',
            undefined,
            () => {
              setRuinsNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? { ...n, isInteracting: false }
                    : n,
                ),
              );
            },
          );
          return;
        }
      }
      return;
    }

    // =========================================================================
    // INTERIOR 4: THE BLUE HOUSE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'BLUE_HOUSE') {
      // 1. STRICT NPC PRIORITY: Always check for Blue House NPCs (Maya Angelou at 11, 3; Pablo Neruda at 13, 8) FIRST
      const isFacingMayaAcrossDesk = facingX === 11 && facingY === 4 && p.dir === 'UP';
      const targetNpc = blueHouseNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          (((npc.x === facingX && npc.y === facingY) ||
            (isFacingMayaAcrossDesk && npc.poetId === 'ANGELOU' && npc.x === 11 && npc.y === 3)) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              npc.movement.stepTo?.x === facingX &&
              npc.movement.stepTo?.y === facingY) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
        else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
        else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
        else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';

        // Keep Maya Angelou facing South towards the front of the desk
        if (targetNpc.poetId === 'ANGELOU') {
          npcTurnFacing = 'DOWN';
        }

        setBlueHouseNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  pxX: n.x * TILE_SIZE,
                  pxY: n.y * TILE_SIZE,
                  movement: n.movement
                    ? (n.movement.type === 'TURN'
                        ? { ...n.movement, timer: 0 }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // MAYA ANGELOU: Seated / standing at writing desk. FIGHTABLE!
        if (targetNpc.poetId === 'ANGELOU' || targetNpc.id === 'npc_bluehouse_angelou') {
          promptPoetChoiceMenu(
            ROOM_BLUE_HOUSE.entities.blue_maya.name,
            ROOM_BLUE_HOUSE.entities.blue_maya.greeting,
            ROOM_BLUE_HOUSE.entities.blue_maya.talkLines,
            ROOM_BLUE_HOUSE.entities.blue_maya.duelLine,
            'ANGELOU',
            () => {
              setBlueHouseNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
              );
            },
          );
          return;
        }

        // PABLO NERUDA: FIGHTABLE
        if (targetNpc.poetId === 'NERUDA' || targetNpc.id === 'npc_bluehouse_neruda') {
          promptPoetChoiceMenu(
            ROOM_BLUE_HOUSE.entities.blue_neruda.name,
            ROOM_BLUE_HOUSE.entities.blue_neruda.greeting,
            ROOM_BLUE_HOUSE.entities.blue_neruda.talkLines,
            ROOM_BLUE_HOUSE.entities.blue_neruda.duelLine,
            'NERUDA',
            () => {
              setBlueHouseNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        return;
      }

      // 2. ROOM PROPS & ENVIRONMENTAL INSPECTABLES
      // 0. Thematic Coastal Collection Sea-Chest in Bottom-Left Corner at X: 2..3, Y: 9
      if ((facingX === 2 || facingX === 3 || facingX === 1) && facingY === 9) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.sea_chest;
        const curIdx = (propInspectIndexRef.current.BLUE_SEA_CHEST ?? 0) % lines.length;
        propInspectIndexRef.current.BLUE_SEA_CHEST = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CEDAR SEA-CHEST',
          text: lines[curIdx],
        });
        return;
      }

      // 1. Spanish Classical Guitar (Federico García Lorca tribute) at X: 2, Y: 3
      if (facingX === 2 && facingY === 3) {
        gameAudio.playGuitarStrum();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.lorca_guitar_tribute;
        const curIdx = (propInspectIndexRef.current.BLUE_GUITAR ?? 0) % lines.length;
        propInspectIndexRef.current.BLUE_GUITAR = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CLASSICAL GUITAR',
          text: lines[curIdx],
        });
        return;
      }

      // 2. Built-in Bookshelf at X: 4..5, Y: 1..2
      if ((facingX === 4 || facingX === 5) && (facingY === 1 || facingY === 2)) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.blue_bookshelf;
        const curIdx = (propInspectIndexRef.current.BLUE_BOOKSHELF ?? 0) % lines.length;
        propInspectIndexRef.current.BLUE_BOOKSHELF = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BOOKSHELF',
          text: lines[curIdx],
        });
        return;
      }

      // 3. Reading Nook: Cozy Upholstered Armchair at X: 3, Y: 5
      if (facingX === 3 && facingY === 5) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.reading_armchair;
        const curIdx = (propInspectIndexRef.current.BLUE_ARMCHAIR ?? 0) % lines.length;
        propInspectIndexRef.current.BLUE_ARMCHAIR = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ARMCHAIR',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Maya Angelou's Writing Desk (Yellow legal pad & pencil, dictionary & cards) at X: 10, Y: 4
      if (facingX === 10 && facingY === 4) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.maya_desk;
        const curIdx = (propInspectIndexRef.current.MAYA_DESK ?? 0) % lines.length;
        propInspectIndexRef.current.MAYA_DESK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'WRITING DESK',
          text: lines[curIdx],
        });
        return;
      }

      // 5. Potted Citrus Tree at X: 14, Y: 3
      if (facingX === 14 && facingY === 3) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.potted_lemon;
        const curIdx = (propInspectIndexRef.current.POTTED_LEMON ?? 0) % lines.length;
        propInspectIndexRef.current.POTTED_LEMON = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CITRUS TREE',
          text: lines[curIdx],
        });
        return;
      }

      // 6. Arched Coastal Casement Windows along right wall at X: 15
      if (facingX === 15 && facingY >= 2 && facingY <= 9) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.casement_windows;
        const curIdx = (propInspectIndexRef.current.CASEMENT_WINDOWS ?? 0) % lines.length;
        propInspectIndexRef.current.CASEMENT_WINDOWS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CASEMENT WINDOW',
          text: lines[curIdx],
        });
        return;
      }

      // 7. Andalusian / Kilim Area Rug in center
      if (facingX >= 5 && facingX <= 8 && facingY >= 5 && facingY <= 7) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_BLUE_HOUSE.props.kilim_rug;
        const curIdx = (propInspectIndexRef.current.KILIM_RUG ?? 0) % lines.length;
        propInspectIndexRef.current.KILIM_RUG = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'ANDALUSIAN RUG',
          text: lines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 3: THE FORGE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'FORGE') {
      // 1. STRICT NPC PRIORITY: Always check for Forge NPCs (Blake, Heaney, Burns, Catherine Blake) FIRST
      const targetNpc = forgeNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === facingX &&
              Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === facingY) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              ((npc.movement.stepTo?.x === facingX && npc.movement.stepTo?.y === facingY) ||
               (npc.movement.stepFrom?.x === facingX && npc.movement.stepFrom?.y === facingY))) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for strolling characters (Seamus Heaney, Catherine Blake)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < stopTileY) npcTurnFacing = 'UP';
        else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
        else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
        else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';

        // Keep Blake facing towards his press if spoken to from sides
        if (targetNpc.poetId === 'BLAKE') {
          npcTurnFacing = 'RIGHT';
        }

        setForgeNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 2.5,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // WILLIAM BLAKE: Inside The Forge by his printing press. FIGHTABLE!
        if (targetNpc.poetId === 'BLAKE' || targetNpc.id === 'npc_forge_blake') {
          promptPoetChoiceMenu(
            ROOM_FORGE.entities.forge_blake.name,
            ROOM_FORGE.entities.forge_blake.greeting,
            ROOM_FORGE.entities.forge_blake.talkLines,
            ROOM_FORGE.entities.forge_blake.duelLine,
            'BLAKE',
            () => {
              setForgeNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'RIGHT' } : n)),
              );
            },
          );
          return;
        }

        // Seamus Heaney
        if (targetNpc.poetId === 'HEANEY' || targetNpc.id === 'npc_forge_heaney') {
          promptPoetChoiceMenu(
            ROOM_FORGE.entities.forge_heaney.name,
            ROOM_FORGE.entities.forge_heaney.greeting,
            ROOM_FORGE.entities.forge_heaney.talkLines,
            '',
            undefined,
            () => {
              setForgeNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // Robert Burns
        if (targetNpc.poetId === 'BURNS' || targetNpc.id === 'npc_forge_burns') {
          promptPoetChoiceMenu(
            ROOM_FORGE.entities.forge_burns.name,
            ROOM_FORGE.entities.forge_burns.greeting,
            ROOM_FORGE.entities.forge_burns.talkLines,
            '',
            undefined,
            () => {
              setForgeNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // Catherine Blake
        if (targetNpc.poetId === 'CATHERINE_BLAKE' || targetNpc.id === 'npc_forge_catherine') {
          promptPoetChoiceMenu(
            ROOM_FORGE.entities.forge_catherine.name,
            ROOM_FORGE.entities.forge_catherine.greeting,
            ROOM_FORGE.entities.forge_catherine.talkLines,
            '',
            undefined,
            () => {
              setForgeNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // Talkers on Forge fallback
        if (!targetNpc.hasSeenIntro) {
          const introText = targetNpc.introLine || targetNpc.greeting || `“${targetNpc.name}”`;
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text: introText,
            onComplete: () => {
              setForgeNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        currentDialogueIndex: 0,
                        isInteracting: false,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || targetNpc.normalLines?.[0] || 'The iron glows. Care to converse by the anvil?',
          targetNpc.normalLines || targetNpc.talkLines || ['“The craft is forged in fire and ink.”'],
          '',
          undefined,
          () => {
            setForgeNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      movement: n.movement
                        ? (n.movement.type === 'PATH'
                            ? { ...n.movement, pauseTimer: 2.5 }
                            : n.movement.type === 'TURN'
                            ? { ...n.movement, timer: 0 }
                            : n.movement)
                        : undefined,
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // 2. WORKSHOP PROPS & ENVIRONMENTAL INSPECTABLES
      // 1. Blake's Illuminated Printing Press at X: 8..9, Y: 3..4
      if ((facingX === 8 || facingX === 9) && (facingY === 3 || facingY === 4)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.printing_press;
        const curIdx = (propInspectIndexRef.current.FORGE_PRESS ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_PRESS = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "BLAKE'S PRINTING PRESS",
          text: lines[curIdx],
        });
        return;
      }

      // 2. Overhead wire with illustrated poetic broadsides pinned up to dry at Y: 1, X: 5..14
      if (facingY === 1 && facingX >= 5 && facingX <= 14) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.illuminated_wire;
        const curIdx = (propInspectIndexRef.current.FORGE_WIRE ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_WIRE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "ILLUMINATED BROADSIDES",
          text: lines[curIdx],
        });
        return;
      }

      // 3. Seamus Heaney's Blacksmith Anvil on stout oak stump at X: 4, Y: 4
      if (facingX === 4 && facingY === 4) {
        gameAudio.playAnvilRing();
        triggerHaptics(35);
        const lines = ROOM_FORGE.props.blacksmith_anvil;
        const curIdx = (propInspectIndexRef.current.FORGE_ANVIL ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_ANVIL = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "HEANEY'S ANVIL",
          text: lines[curIdx],
        });
        return;
      }

      // 4. Peat Spade resting against wall at X: 1, Y: 5
      if (facingX === 1 && facingY === 5) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.peat_spade;
        const curIdx = (propInspectIndexRef.current.FORGE_SPADE ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_SPADE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "PEAT SPADE",
          text: lines[curIdx],
        });
        return;
      }

      // 5. Robert Burns's Iron Plowshare at X: 13, Y: 7
      if (facingX === 13 && facingY === 7) {
        gameAudio.playShieldBlock();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.burns_plow;
        const curIdx = (propInspectIndexRef.current.FORGE_PLOW ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_PLOW = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "IRON PLOWSHARE",
          text: lines[curIdx],
        });
        return;
      }

      // 6. Stoneware Crock of Scottish Heather at X: 14, Y: 8
      if (facingX === 14 && facingY === 8) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.scottish_heather;
        const curIdx = (propInspectIndexRef.current.FORGE_HEATHER ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_HEATHER = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "SCOTTISH HEATHER",
          text: lines[curIdx],
        });
        return;
      }

      // 7. Water Quenching Trough with faint steam at X: 1, Y: 3
      if (facingX === 1 && facingY === 3) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.quenching_trough;
        const curIdx = (propInspectIndexRef.current.FORGE_TROUGH ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_TROUGH = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "QUENCHING TROUGH",
          text: lines[curIdx],
        });
        return;
      }

      // 8. Stone Forge Hearth & Crackling Embers at X: 1..3, Y: 1
      if (facingY === 1 && facingX >= 1 && facingX <= 3) {
        gameAudio.playHearthCrackle();
        triggerHaptics(35);
        const lines = ROOM_FORGE.props.forge_hearth;
        const curIdx = (propInspectIndexRef.current.FORGE_HEARTH ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_HEARTH = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "STONE FORGE HEARTH",
          text: lines[curIdx],
        });
        return;
      }

      // 9. Copper Plates & Mineral Pigments at X: 6, Y: 4 or X: 11, Y: 4
      if (facingX === 6 && facingY === 4) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.copper_plates;
        const curIdx = (propInspectIndexRef.current.FORGE_PLATES ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_PLATES = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "COPPER PLATES",
          text: lines[curIdx],
        });
        return;
      }
      if (facingX === 11 && facingY === 4) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_FORGE.props.inking_table;
        const curIdx = (propInspectIndexRef.current.FORGE_INK_TABLE ?? 0) % lines.length;
        propInspectIndexRef.current.FORGE_INK_TABLE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "INKING TABLE",
          text: lines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // SCREEN 3: THE CLIFFS (Canto III: Dover Cliffs • 36x28) INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'CLIFFS') {
      // 1. Forge door check - Entering The Forge at (X: 11, Y: 11)
      const isForgeDoor = (facingX === 11 && facingY === 11) || (p.gridX === 11 && p.gridY === 12 && p.dir === 'UP');
      if (isForgeDoor && (p.dir === 'UP' || facingY === 11)) {
        transitionOverworldScreen('FORGE', 7, 10, 'UP');
        return;
      }

      // 2. Blue House door check - Entering The Blue House at (X: 25, Y: 20)
      const isBlueHouseDoor = (facingX === 25 && facingY === 20) || (p.gridX === 25 && p.gridY === 21 && p.dir === 'UP');
      if (isBlueHouseDoor && (p.dir === 'UP' || facingY === 20)) {
        transitionOverworldScreen('BLUE_HOUSE', 7, 10, 'UP');
        return;
      }

      // 3. Check Cliffs NPCs FIRST (Lorca at 7, 22; William Blake at 13, 13; Neruda at 22, 4; Maya at 23, 21; Hopkins at 11, 22; Gibran at 18, 14)
      const targetNpc = cliffsNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          ((npc.x === facingX && npc.y === facingY) ||
            (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === facingX &&
              Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
        else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
        else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
        else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';

        setCliffsNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                }
              : n,
          ),
        );

        // FEDERICO GARCÍA LORCA: FIGHTABLE (X: 7, Y: 22)
        if (targetNpc.poetId === 'LORCA' || targetNpc.id === 'npc_cliffs_lorca') {
          promptPoetChoiceMenu(
            ROOM_CLIFFS.entities.federico_lorca.name,
            targetNpc.greeting || ROOM_CLIFFS.entities.federico_lorca.greeting,
            targetNpc.talkLines || ROOM_CLIFFS.entities.federico_lorca.talkLines,
            targetNpc.duelLine || ROOM_CLIFFS.entities.federico_lorca.duelLine,
            'LORCA',
            () => {
              setCliffsNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }

        // WILLIAM BLAKE: FIGHTABLE (X: 13, Y: 13)
        if (targetNpc.poetId === 'BLAKE' || targetNpc.id === 'npc_cliffs_blake') {
          promptPoetChoiceMenu(
            ROOM_FORGE.entities.forge_blake.name,
            targetNpc.greeting || ROOM_FORGE.entities.forge_blake.greeting,
            targetNpc.talkLines || ROOM_FORGE.entities.forge_blake.talkLines,
            targetNpc.duelLine || ROOM_FORGE.entities.forge_blake.duelLine,
            'BLAKE',
            () => {
              setCliffsNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }

        // PABLO NERUDA: FIGHTABLE (X: 22, Y: 4)
        if (targetNpc.poetId === 'NERUDA' || targetNpc.id === 'npc_cliffs_neruda') {
          promptPoetChoiceMenu(
            ROOM_CLIFFS.entities.cliffs_neruda.name,
            targetNpc.greeting || ROOM_CLIFFS.entities.cliffs_neruda.greeting,
            targetNpc.talkLines || ROOM_CLIFFS.entities.cliffs_neruda.talkLines,
            targetNpc.duelLine || ROOM_CLIFFS.entities.cliffs_neruda.duelLine,
            'NERUDA',
            () => {
              setCliffsNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }

        // MAYA ANGELOU: FIGHTABLE (X: 23, Y: 21)
        if (targetNpc.poetId === 'ANGELOU' || targetNpc.id === 'npc_cliffs_angelou') {
          promptPoetChoiceMenu(
            ROOM_BLUE_HOUSE.entities.blue_maya.name,
            targetNpc.greeting || ROOM_BLUE_HOUSE.entities.blue_maya.greeting,
            targetNpc.talkLines || ROOM_BLUE_HOUSE.entities.blue_maya.talkLines,
            targetNpc.duelLine || ROOM_BLUE_HOUSE.entities.blue_maya.duelLine,
            'ANGELOU',
            () => {
              setCliffsNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
              );
            },
          );
          return;
        }

        // HOPKINS & GIBRAN: Talkers
        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || 'The sea stretches far below. Care to converse?',
          targetNpc.talkLines || ['“The grandeur of the cliffs speaks in silence.”'],
          '',
          undefined,
          () => {
            setCliffsNpcs((prev) =>
              prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false } : n)),
            );
          },
        );
        return;
      }

      // 3. Lorca's Classical Guitar: X: 5, Y: 22
      if (facingX === 5 && facingY === 22) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.lorca_guitar;
        const curIdx = (propInspectIndexRef.current.LORCA_GUITAR ?? 0) % lines.length;
        propInspectIndexRef.current.LORCA_GUITAR = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "LORCA'S GUITAR",
          text: lines[curIdx],
        });
        return;
      }

      // 3.5 Sunlit Lemon Tree: X: 9, Y: 20..21
      if (facingX === 9 && (facingY === 20 || facingY === 21)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.lemon_tree;
        const curIdx = (propInspectIndexRef.current.LEMON_TREE ?? 0) % lines.length;
        propInspectIndexRef.current.LEMON_TREE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CITRUS TREE',
          text: lines[curIdx],
        });
        return;
      }

      // 3.6 Coastal Cypress Grove: X: 2..18, Y: 19..20
      if ((facingX >= 2 && facingX <= 18) && (facingY === 19 || facingY === 20)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.cypress_1;
        const curIdx = (propInspectIndexRef.current.CYPRESS_GROVE ?? 0) % lines.length;
        propInspectIndexRef.current.CYPRESS_GROVE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'COASTAL CYPRESS',
          text: lines[curIdx],
        });
        return;
      }

      // 4. Mounted Brass Telescopes: X: 2, Y: 14 & X: 30, Y: 22
      if ((facingX === 2 && facingY === 14) || (facingX === 30 && facingY === 22)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.brass_telescope;
        const curIdx = (propInspectIndexRef.current.BRASS_TELESCOPE ?? 0) % lines.length;
        propInspectIndexRef.current.BRASS_TELESCOPE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BRASS TELESCOPE',
          text: lines[curIdx],
        });
        return;
      }

      // 5. Sun-Warmed Limestone Bench: X: 7..8, Y: 13
      if ((facingX === 7 || facingX === 8) && facingY === 13) {
        gameAudio.playFootstepStone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.limestone_bench;
        const curIdx = (propInspectIndexRef.current.LIMESTONE_BENCH ?? 0) % lines.length;
        propInspectIndexRef.current.LIMESTONE_BENCH = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'LIMESTONE BENCH',
          text: lines[curIdx],
        });
        return;
      }

      // 5.5 Coastal Dog (Old Argos): X: 16, Y: 14
      const cd = coastalDogRef.current;
      const isFacingDog =
        cd &&
        (Math.hypot(
          (cd.pxX + 8) - (facingX * TILE_SIZE + 8),
          (cd.pxY + 8) - (facingY * TILE_SIZE + 8),
        ) < 26 || (facingX === 16 && facingY === 14));

      if (isFacingDog) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        cd.isInteracting = true;
        cd.isMoving = false;
        cd.facing = p.pxX > cd.pxX ? 'RIGHT' : 'LEFT';
        const lines = ROOM_CLIFFS.props.cliffs_dog;
        const curIdx = (propInspectIndexRef.current.CLIFFS_DOG ?? 0) % lines.length;
        propInspectIndexRef.current.CLIFFS_DOG = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'COASTAL DOG',
          text: lines[curIdx],
          onComplete: () => {
            if (coastalDogRef.current) {
              coastalDogRef.current.isInteracting = false;
              coastalDogRef.current.state = 'IDLE';
              coastalDogRef.current.stateTimer = 2.0;
              coastalDogRef.current.pauseTimer = 2.0;
            }
          },
        });
        return;
      }

      // 6. Balanced Stone Cairn: X: 20, Y: 8
      if (facingX === 20 && facingY === 8) {
        gameAudio.playFootstepStone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.stone_cairn;
        const curIdx = (propInspectIndexRef.current.STONE_CAIRN ?? 0) % lines.length;
        propInspectIndexRef.current.STONE_CAIRN = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'COASTAL CAIRN',
          text: lines[curIdx],
        });
        return;
      }

      // 7. Sea Boulders: X: 2..4, Y: 3..9
      if (facingX >= 2 && facingX <= 4 && facingY >= 3 && facingY <= 9) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.sea_boulder;
        const curIdx = (propInspectIndexRef.current.SEA_BOULDER ?? 0) % lines.length;
        propInspectIndexRef.current.SEA_BOULDER = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'SEA BOULDER',
          text: lines[curIdx],
        });
        return;
      }

      // 9. Pergola / Trellis: X: 15..17, Y: 10
      if ((facingX >= 15 && facingX <= 17) && facingY === 10) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.vineyard_pergola;
        const curIdx = (propInspectIndexRef.current.VINEYARD_PERGOLA ?? 0) % lines.length;
        propInspectIndexRef.current.VINEYARD_PERGOLA = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'VINEYARD PERGOLA',
          text: lines[curIdx],
        });
        return;
      }

      // 10.1 Pablo Neruda's Writing Table: X: 24, Y: 2
      if (facingX === 24 && (facingY === 1 || facingY === 2)) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.neruda_table;
        const curIdx = (propInspectIndexRef.current.NERUDA_TABLE ?? 0) % lines.length;
        propInspectIndexRef.current.NERUDA_TABLE = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "WRITING TABLE",
          text: lines[curIdx],
        });
        return;
      }

      // 10.2 Maritime Relics Cabinet: X: 31, Y: 2
      if (facingX === 31 && (facingY === 1 || facingY === 2)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.relics_cabinet;
        const curIdx = (propInspectIndexRef.current.RELICS_CABINET ?? 0) % lines.length;
        propInspectIndexRef.current.RELICS_CABINET = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "MARITIME RELICS",
          text: lines[curIdx],
        });
        return;
      }

      // 10.3 Ship's Gimbal Lantern (Albatross): X: 27, Y: 1
      if (facingX === 27 && facingY === 1) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.deck_lantern;
        const curIdx = (propInspectIndexRef.current.DECK_LANTERN ?? 0) % lines.length;
        propInspectIndexRef.current.DECK_LANTERN = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "SHIP'S LANTERN",
          text: lines[curIdx],
        });
        return;
      }

      // 10.4 Ocean Overlook Balustrade: X: 20..33, Y: 0..2
      if ((facingX >= 20 && facingX <= 33) && (facingY >= 0 && facingY <= 2)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lines = ROOM_CLIFFS.props.ocean_overlook;
        const curIdx = (propInspectIndexRef.current.OCEAN_OVERLOOK ?? 0) % lines.length;
        propInspectIndexRef.current.OCEAN_OVERLOOK = (curIdx + 1) % lines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "DECK RAILING",
          text: lines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 2: THE LUNCH COUNTER INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'LUNCH_COUNTER') {
      // 1. STRICT NPC PRIORITY: Check Lunch Counter NPCs (O'Hara, Williams, Stevens, Brooks, Eliot) FIRST
      const targetNpc = lunchNpcsRef.current.find((npc) => {
        if (!npc.isActive || npc.isDissolving || npc.isRecruited || (npc.poetId && capturedPoetIds.includes(npc.poetId))) return false;
        if (npc.x === facingX && npc.y === facingY) return true;
        if ((npc.poetId === 'BROOKS' || npc.id === 'npc_lunch_brooks') && (facingX === 2 || facingX === 3) && facingY === 7) return true;
        const curTileX = Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE);
        const curTileY = Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE);
        if (curTileX === facingX && curTileY === facingY) return true;
        if (npc.isMoving && npc.movement?.type === 'PATH') {
          if (npc.movement.stepTo && npc.movement.stepTo.x === facingX && npc.movement.stepTo.y === facingY) return true;
          if (npc.movement.stepFrom && npc.movement.stepFrom.x === facingX && npc.movement.stepFrom.y === facingY) return true;
        }
        return false;
      });

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in his tracks for strolling character (Wallace Stevens / Frank O'Hara / WCW)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        const relX = p.gridX - stopTileX;
        const relY = p.gridY - stopTileY;
        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (Math.abs(relX) > Math.abs(relY)) {
          npcTurnFacing = relX > 0 ? 'RIGHT' : 'LEFT';
        } else if (Math.abs(relY) > Math.abs(relX)) {
          npcTurnFacing = relY > 0 ? 'DOWN' : 'UP';
        } else if (relY !== 0) {
          if (p.dir === 'DOWN') npcTurnFacing = 'UP';
          else if (p.dir === 'UP') npcTurnFacing = 'DOWN';
          else if (p.dir === 'RIGHT') npcTurnFacing = 'LEFT';
          else if (p.dir === 'LEFT') npcTurnFacing = 'RIGHT';
          else npcTurnFacing = relY > 0 ? 'DOWN' : 'UP';
        } else if (relX !== 0) {
          npcTurnFacing = relX > 0 ? 'RIGHT' : 'LEFT';
        }

        setLunchNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  greeted: true,
                  hasSeenIntro: true,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer:
                              n.id === 'npc_lunch_stevens'
                                ? 3.5
                                : n.id === 'npc_lunch_ohara'
                                ? 3.0
                                : n.id === 'npc_lunch_wcw'
                                ? 3.5
                                : 3.0,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        const greetingText = targetNpc.greeting || targetNpc.introLine || `“${targetNpc.name}”`;
        const poetTalkLines = targetNpc.talkLines || targetNpc.normalLines || ['“Coffee and verse on a Friday afternoon.”'];

        promptPoetChoiceMenu(
          targetNpc.name,
          greetingText,
          poetTalkLines,
          '',
          undefined,
          () => {
            setLunchNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      facing:
                        (n.x === 5 && n.y === 4) ||
                        (n.x === 8 && n.y === 4) ||
                        (n.x === 11 && n.y === 4) ||
                        n.id === 'npc_lunch_brooks' ||
                        n.id === 'npc_lunch_eliot' ||
                        n.id === 'npc_lunch_wcw' ||
                        n.poetId === 'WCW'
                          ? 'UP'
                          : n.facing,
                      movement: n.movement
                        ? (n.movement.type === 'PATH'
                            ? {
                                ...n.movement,
                                pauseTimer:
                                  n.id === 'npc_lunch_stevens'
                                    ? 3.5 + Math.random() * 1.5
                                    : n.id === 'npc_lunch_ohara'
                                    ? 3.0 + Math.random() * 1.5
                                    : n.id === 'npc_lunch_wcw'
                                    ? 3.5 + Math.random() * 1.5
                                    : 3.0,
                              }
                            : n.movement.type === 'TURN'
                            ? { ...n.movement, timer: 0 }
                            : n.movement)
                        : undefined,
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // 2. DINER EQUIPMENT & PROPS INSPECTABLES
      // 1. Frank O'Hara: Coke bottle & notebook at X: 5, Y: 3
      if (facingX === 5 && facingY === 3) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const cokeLines = [
          "A glass bottle of Coca-Cola and notes for 'Having a Coke With You'.",
          "“It is even more fun than going to San Sebastian, Irún, Hendaye, Bayonne...”",
          "A fountain pen rests across a damp paper napkin covered with fast, exuberant lines.",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_COKE ?? 0) % cokeLines.length;
        propInspectIndexRef.current.LUNCH_COKE = (curIdx + 1) % cokeLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "COKE & NOTES",
          text: cokeLines[curIdx],
        });
        return;
      }

      // 2. William Carlos Williams: Cold plums in ceramic bowl at X: 11, Y: 3 (Dr. Williams's Icebox Plums)
      if (facingX === 11 && facingY === 3) {
        const count = (interactionCountsRef.current.plums || 0) + 1;
        interactionCountsRef.current.plums = count;
        setInteractionState((prev) => ({ ...prev, plums: count }));

        if (count % 2 === 1) {
          gameAudio.playCrispClick();
          triggerHaptics(30);
          setOverworldDialogue({
            active: true,
            speakerName: "CERAMIC BOWL",
            text: "A white ceramic bowl of cold, dark-purple plums glistening with icebox condensation. A note underneath reads: 'SAVING THESE FOR BREAKFAST.'",
          });
        } else {
          // Heal the active party lead poet by +10 HP up to their max HP with a gentle sound effect
          const leadId = activePlayerPoetId || playerLineup[0] || 'MARY_OLIVER';
          const leadPoetObj = getPoetById(leadId);
          const maxHp = leadPoetObj.hp;

          if (leadId === activePlayerPoetId) {
            const nextHp = Math.min(maxHp, playerHpRef.current + 10);
            setPlayerHp(nextHp);
            playerHpRef.current = nextHp;
            playerDisplayHpRef.current = nextHp;
          }
          setLineupHpMap((prev) => ({ ...prev, [leadId]: Math.min(maxHp, (prev[leadId] ?? maxHp) + 10) }));
          lineupHpMapRef.current[leadId] = Math.min(maxHp, (lineupHpMapRef.current[leadId] ?? maxHp) + 10);

          gameAudio.playPotionGulp();
          triggerHaptics([40, 70]);
          setOverworldDialogue({
            active: true,
            speakerName: "COLD PLUM",
            text: "You eat a cold plum (+10 HP). Sweet, icy, and unapologetic—the counterman quietly refills the bowl before the doctor notices.",
          });
        }
        return;
      }

      // 3. Wallace Stevens: Ice cream sundae dish at X: 14, Y: 6
      if (facingX === 14 && (facingY === 6 || facingY === 7)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const sundaeLines = [
          "A glass dish of vanilla ice cream with a ruby cherry. 'Let be be finale of seem.'",
          "A chilled silver spoon rests neatly beside a folded copy of the Hartford Courant.",
          "A Connecticut surety-bond ledger sits by the dish, its margins filled with thirteen ways of looking at a blackbird.",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_SUNDAE ?? 0) % sundaeLines.length;
        propInspectIndexRef.current.LUNCH_SUNDAE = (curIdx + 1) % sundaeLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "ICE CREAM SUNDAE",
          text: sundaeLines[curIdx],
        });
        return;
      }

      // 4. Gwendolyn Brooks: Framed Bronzeville jazz photo at X: 2, Y: 1–2
      if (facingX === 2 && (facingY === 1 || facingY === 2)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const photoLines = [
          "A framed photograph of the Golden Shovel poolroom and jazz hall on Chicago's South Side.",
          "Seven pool players lean against green felt tables under a low hanging lamp.",
          "Gwendolyn Brooks's handwritten dedication on the mat: 'To the street corners that taught us rhythm.'",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_PHOTO ?? 0) % photoLines.length;
        propInspectIndexRef.current.LUNCH_PHOTO = (curIdx + 1) % photoLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "JAZZ PHOTOGRAPH",
          text: photoLines[curIdx],
        });
        return;
      }

      // 5. Corner Jukebox: Vintage neon jukebox with color-cycling lights at X: 13, Y: 1–2
      if (facingX === 13 && (facingY === 1 || facingY === 2)) {
        gameAudio.playPowerupChime();
        triggerHaptics(35);
        const jukeLines = [
          "A glowing Wurlitzer jukebox humming a low Lenox Avenue bassline.",
          "'Good morning, daddy! / Ain't you heard / The boogie-woogie rumble / Of a dream deferred?'",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_JUKEBOX ?? 0) % jukeLines.length;
        propInspectIndexRef.current.LUNCH_JUKEBOX = (curIdx + 1) % jukeLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "VINTAGE JUKEBOX",
          text: jukeLines[curIdx],
        });
        return;
      }

      // 6. Letterboard menu on back-bar wall at X: 5–6, Y: 1
      if ((facingX === 5 || facingX === 6) && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const menuLines = [
          "COFFEE 10¢ • PIE 25¢ • COLD PLUMS (FREE TO DOCTORS).",
          "TODAY'S SPECIAL: CORNED BEEF ON RYE & ONE UNFINISHED SONNET.",
          "A handwritten slip taped to the board: 'FREE REFILLS IF YOU RECITE IN METER.'",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_MENU ?? 0) % menuLines.length;
        propInspectIndexRef.current.LUNCH_MENU = (curIdx + 1) % menuLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "LETTERBOARD MENU",
          text: menuLines[curIdx],
        });
        return;
      }

      // 7. Glass pie dome (cherry/apple slices) at X: 7–8, Y: 1
      if ((facingX === 7 || facingX === 8) && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const pieLines = [
          "Fresh baked cherry pie slices and day-old crumb cake under a gleaming glass dome.",
          "'At six o'clock we were waiting for coffee, / waiting for coffee and the charitable crumb.'",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_PIE ?? 0) % pieLines.length;
        propInspectIndexRef.current.LUNCH_PIE = (curIdx + 1) % pieLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "PIE DISPLAY",
          text: pieLines[curIdx],
        });
        return;
      }

      // 8. Steaming coffee carafes / urn at X: 3–4, Y: 1
      if ((facingX === 3 || facingX === 4) && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const coffeeLines = [
          "Twin glass carafes of black coffee kept hot on the burner for the lunchtime regulars.",
          "Scribbled on a cardboard coaster beside the burner: 'Is there no one who cares about fresh air?'",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_COFFEE ?? 0) % coffeeLines.length;
        propInspectIndexRef.current.LUNCH_COFFEE = (curIdx + 1) % coffeeLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "COFFEE CARAFES",
          text: coffeeLines[curIdx],
        });
        return;
      }

      // 9. Chrome soda fountain taps (The Lost & Found Saucer • X: 10, Y: 1)
      if (facingX === 10 && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const count = (interactionCountsRef.current.lost_found_saucer || 0) + 1;
        interactionCountsRef.current.lost_found_saucer = count;
        setInteractionState((prev) => ({ ...prev, lost_found_saucer: count }));

        const step = ((count - 1) % 4) + 1;
        let text = "";
        if (step === 1) {
          text = "A small 'LOST & FOUND' saucer holding a brass door key and a mother's heirloom watch. Losing things is an easy art to practice.";
        } else if (step === 2) {
          text = "Look again: someone has left the deeds to three favorite houses in the saucer. Still, hardly a disaster.";
        } else if (step === 3) {
          text = "Somehow two whole cities, two rivers, and an entire continent are balanced inside the porcelain dish.";
        } else {
          text = "You blink away a familiar voice and gesture—now it's just the brass door key resting in the saucer again.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "SODA FOUNTAIN",
          text,
        });
        return;
      }

      // 10. T. S. Eliot's coffee cup table at X: 3, Y: 9 (Measuring Out Coffee Spoons)
      if (facingX === 3 && facingY === 9) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const count = (interactionCountsRef.current.coffee_spoons || 0) + 1;
        interactionCountsRef.current.coffee_spoons = count;
        setInteractionState((prev) => ({ ...prev, coffee_spoons: count }));

        let text = `A porcelain cup and silver spoons lined up by size. You have measured out your afternoon in ${count} coffee spoons.`;
        if (count % 5 === 0) {
          text += " Beside the saucer sits a single peach. Do you dare? Better not.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "COFFEE SPOONS",
          text,
        });
        return;
      }

      // 11. Condiment caddies & Formica tables in updated horizontal booths (X: 1–3, Y: 6 and Y: 9)
      if (
        ((facingX >= 1 && facingX <= 3) && facingY === 6) ||
        ((facingX === 1 || facingX === 2 || facingX === 3) && facingY === 9)
      ) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const boothLines = [
          "A chrome-edged Formica table with a ketchup bottle and a fountain Pepsi.",
          "Carved lightly into the wood edge: 'It is 12:15 in New York and I am wondering.'",
        ];
        const curIdx = (propInspectIndexRef.current.LUNCH_BOOTH ?? 0) % boothLines.length;
        propInspectIndexRef.current.LUNCH_BOOTH = (curIdx + 1) % boothLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "BOOTH TABLE",
          text: boothLines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // INTERIOR 1: THE NIGHTINGALE INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'NIGHTINGALE') {
      // 1. STRICT NPC PRIORITY: Check Nightingale NPCs (Hughes, Dylan, Millay, Dunbar, Chaucer, Rimbaud) FIRST
      const isFacingHughesAcrossMic =
        (facingX === 4 && (facingY === 2 || facingY === 3)) ||
        (p.gridX === 4 && (p.gridY === 4 || p.gridY === 5) && p.dir === 'UP');

      const isFacingDylanAcrossBar =
        (facingX === 14 && (facingY === 4 || facingY === 3)) ||
        (p.gridX === 14 && p.gridY === 2 && p.dir === 'DOWN');

      const targetNpc = nightingaleNpcsRef.current.find(
        (npc) =>
          npc.isActive &&
          !npc.isDissolving &&
          !npc.isRecruited &&
          !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
          (((npc.x === facingX && npc.y === facingY) ||
            (isFacingHughesAcrossMic && (npc.poetId === 'HUGHES' || npc.id === 'npc_nightingale_hughes')) ||
            (isFacingDylanAcrossBar && (npc.poetId === 'DYLAN_THOMAS' || npc.id === 'npc_nightingale_dylan'))) ||
            (npc.isMoving &&
              npc.movement?.type === 'PATH' &&
              ((npc.movement.stepTo?.x === facingX && npc.movement.stepTo?.y === facingY) ||
               (npc.movement.stepFrom?.x === facingX && npc.movement.stepFrom?.y === facingY))) ||
            (npc.patrol &&
              npc.patrol.stepTo.x === facingX &&
              npc.patrol.stepTo.y === facingY)),
      );

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for strolling character (Edna St. Vincent Millay / Paul Laurence Dunbar)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        // Calculate relative direction between player and NPC so NPC faces the player
        const relX = p.gridX - stopTileX;
        const relY = p.gridY - stopTileY;
        let npcTurnFacing: FacingDirection;

        if (Math.abs(relX) > Math.abs(relY)) {
          npcTurnFacing = relX > 0 ? 'RIGHT' : 'LEFT';
        } else if (Math.abs(relY) > Math.abs(relX)) {
          npcTurnFacing = relY > 0 ? 'DOWN' : 'UP';
        } else if (p.dir === 'UP') {
          npcTurnFacing = 'DOWN';
        } else if (p.dir === 'DOWN') {
          npcTurnFacing = 'UP';
        } else if (p.dir === 'LEFT') {
          npcTurnFacing = 'RIGHT';
        } else if (p.dir === 'RIGHT') {
          npcTurnFacing = 'LEFT';
        } else {
          npcTurnFacing = targetNpc.facing;
        }

        setNightingaleNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 2.5,
                          }
                        : n.movement.type === 'TURN'
                        ? {
                            ...n.movement,
                            timer: 0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // LANGSTON HUGHES: On stage behind mic. FIGHTABLE!
        if (targetNpc.poetId === 'HUGHES' || targetNpc.id === 'npc_nightingale_hughes') {
          if (!targetNpc.hasSeenIntro) {
            setOverworldDialogue({
              active: true,
              speakerName: 'LANGSTON HUGHES',
              text: "Hey now. Langston Hughes. I'm on in a minute, stick around.",
              onComplete: () => {
                setNightingaleNpcs((prev) =>
                  prev.map((n) =>
                    n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false, facing: 'DOWN' } : n,
                  ),
                );
              },
            });
            return;
          }

          promptPoetChoiceMenu(
            'LANGSTON HUGHES',
            "The spotlight's warm. Would you talk at the booth, duel on the mic, or step out?",
            [
              '“Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly.”',
              '“I’ve known rivers: I’ve known rivers ancient as the world. My soul has grown deep like the rivers.”',
              '“I, too, sing America. I am the darker brother.”',
            ],
            '“What happens to a dream deferred? Does it dry up like a raisin in the sun?”',
            'HUGHES',
            () => {
              setNightingaleNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
              );
            },
          );
          return;
        }

        // Other Nightingale Patrons: Dylan Thomas, Millay, Dunbar, Chaucer, Rimbaud
        if (!targetNpc.hasSeenIntro) {
          const introText = targetNpc.introLine || targetNpc.greeting || `“${targetNpc.name}”`;
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text: introText,
            onComplete: () => {
              setNightingaleNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        currentDialogueIndex: 0,
                        isInteracting: false,
                        facing: n.poetId === 'DYLAN_THOMAS' || n.id === 'npc_nightingale_dylan' ? 'UP' : n.facing,
                        movement: n.movement
                          ? (n.movement.type === 'PATH'
                              ? { ...n.movement, pauseTimer: 2.5 }
                              : n.movement.type === 'TURN'
                              ? { ...n.movement, timer: 0 }
                              : n.movement)
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || targetNpc.normalLines?.[0] || 'Care to share a toast in the Nightingale?',
          targetNpc.normalLines || targetNpc.talkLines || ['“The melody lingers in the smoky air.”'],
          '',
          undefined,
          () => {
            setNightingaleNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      facing: n.poetId === 'DYLAN_THOMAS' || n.id === 'npc_nightingale_dylan' ? 'UP' : n.facing,
                      movement: n.movement
                        ? (n.movement.type === 'PATH'
                            ? { ...n.movement, pauseTimer: 2.5 }
                            : n.movement.type === 'TURN'
                            ? { ...n.movement, timer: 0 }
                            : n.movement)
                        : undefined,
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // 2. SPEAKEASY EQUIPMENT & FURNITURE
      // 1. Upright Piano with "The Weary Blues" score & resting metronome/glass at X: 1..2, Y: 2
      if ((facingX === 1 || facingX === 2) && facingY === 2) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "UPRIGHT PIANO",
          text: "A dog-eared score of 'The Weary Blues' resting on the upright piano.",
        });
        return;
      }

      // 2. Vintage 1930s Chrome Art-Deco Ribbon Microphone at X: 4, Y: 3
      if (facingX === 4 && facingY === 3) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const micLines = [
          "A 1930s chrome ribbon microphone still warm from a midnight set.",
          "Taped to the stand: 'Droning a drowsy syncopated tune, / Rocking back and forth to a mellow croon.'",
        ];
        const curIdx = (propInspectIndexRef.current.NIGHTINGALE_MIC ?? 0) % micLines.length;
        propInspectIndexRef.current.NIGHTINGALE_MIC = (curIdx + 1) % micLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "RIBBON MICROPHONE",
          text: micLines[curIdx],
        });
        return;
      }

      // 3. Foaming pint of dark Welsh bitter ale on the bar counter at X: 14, Y: 3
      if (facingX === 14 && facingY === 3) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        let text = "A pint of dark Welsh bitter. 'Rage, rage against the dying of the light.'";
        if (leadPoetId === 'BUKOWSKI') {
          text += "\n\nBukowski settles his elbow straight into the worn dent in the bar varnish like he never left.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "WELSH BITTER",
          text,
        });
        return;
      }

      // 4. Edna St. Vincent Millay's Twin-Flame Brass Candlestick at table X: 4, Y: 7
      if (facingX === 4 && facingY === 7) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "BRASS CANDLESTICK",
          text: "A candle burning at both ends. It will not last the night.",
        });
        return;
      }

      // 5. Paul Laurence Dunbar's Antique Brass Birdcage Motif & Songbook at table X: 8, Y: 6
      if (facingX === 8 && facingY === 6) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "ANTIQUE SONGBOOK",
          text: "A handwritten songbook inscribed: 'I know why the caged bird sings.'",
        });
        return;
      }

      // 6. Chalkboard Drink Slate at X: 10, Y: 1 (Dorothy Parker's Martini Slate)
      if (facingX === 10 && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const count = (interactionCountsRef.current.martini_slate || 0) + 1;
        interactionCountsRef.current.martini_slate = count;
        setInteractionState((prev) => ({ ...prev, martini_slate: count }));

        const step = ((count - 1) % 3) + 1;
        let text = "";
        if (step === 1) {
          text = "HOUSE ALE • PORT • MARTINI. 'One martini is just right; two is the absolute limit.'";
        } else if (step === 2) {
          text = "After three, the chalkboard lettering begins to sway gently toward the floorboards.";
        } else {
          text = "After four, you blink hard, sip a glass of club soda, and the speakeasy steadies itself.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "DRINK SLATE",
          text,
        });
        return;
      }

      // 7. Polished Back-Bar Shelves at X: 11..14, Y: 1
      if (facingX >= 11 && facingX <= 14 && facingY === 1) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        let text = "Tiered bottles of ruby shiraz, dusty port, and amber spirits gleaming in the mirror. Etched into the back-bar glass: 'Not the wine gets drunk on us—we get drunk on the wine.'";
        if (leadPoetId === 'BUKOWSKI') {
          text += "\n\nBukowski settles his elbow straight into the worn dent in the bar varnish like he never left.";
        }
        setOverworldDialogue({
          active: true,
          speakerName: "BACK-BAR SHELVES",
          text,
        });
        return;
      }

      // 8. Framed Vintage Harlem Cabaret / Open-Mic Posters on side walls
      if ((facingX === 0 && facingY === 4) || (facingX === 15 && facingY === 4)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const posterLines = [
          "A diagonal-type letterpress poster from Zurich, 1916: 'CABARET VOLTAIRE — DADA TONIGHT.'",
          "Tristan Tzara's top hat and a pair of paper-cutting scissors are sketched in the margin.",
        ];
        const curIdx = (propInspectIndexRef.current.NIGHTINGALE_POSTER ?? 0) % posterLines.length;
        propInspectIndexRef.current.NIGHTINGALE_POSTER = (curIdx + 1) % posterLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "CABARET POSTER",
          text: posterLines[curIdx],
        });
        return;
      }

      // 9. Brass Wall Sconces (The Circular Rose • X: 0, 15, Y: 6..7)
      if ((facingX === 0 && (facingY === 6 || facingY === 7)) || (facingX === 15 && (facingY === 6 || facingY === 7))) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const count = (interactionCountsRef.current.circular_rose || 0) + 1;
        interactionCountsRef.current.circular_rose = count;
        setInteractionState((prev) => ({ ...prev, circular_rose: count }));

        const roseCount = ((count - 1) % 6) + 1;
        const phrase = "A rose " + "is a rose ".repeat(roseCount).trim() + ".";
        setOverworldDialogue({
          active: true,
          speakerName: "BRASS SCONCE",
          text: `A pressed crimson rose in a brass clip-vase, engraved in an endless loop: '${phrase}'`,
        });
        return;
      }

      // 10. Walnut Cabaret Table (ARTIFACT 3: Cohen's Blue Raincoat & Tea/Oranges) (Corner Setting • X: 12, Y: 7)
      if (facingX === 12 && facingY === 7) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const tableLines = [
          "A famous blue raincoat, torn at the shoulder, hangs over the walnut chair back.",
          "On the table sits a porcelain pot of tea and oranges that came all the way from China.",
          "An envelope beside the cup is signed: 'Sincerely, L. Cohen.'",
        ];
        const curIdx = (propInspectIndexRef.current.NIGHTINGALE_CABARET_TABLE ?? 0) % tableLines.length;
        propInspectIndexRef.current.NIGHTINGALE_CABARET_TABLE = (curIdx + 1) % tableLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "CABARET TABLE",
          text: tableLines[curIdx],
        });
        return;
      }

      return;
    }

    // =========================================================================
    // SCREEN 2: THE TOWN INTERACTIONS
    // =========================================================================
    if (currentScreenId === 'TOWN') {
      // 1. STRICT NPC / POET PRIORITY: Always check for NPC / Poet interactions FIRST before checking inspectables, furniture, bistro tables, or pigeons
      const targetNpc = townNpcsRef.current.find((npc) => {
        if (!npc.isActive || npc.isDissolving || npc.isRecruited || (npc.poetId && capturedPoetIds.includes(npc.poetId))) return false;

        // Check Baudelaire at bouquiniste stall: reachable facing across the counter from (21..23, 22) facing UP or from (20, 20..22) facing RIGHT
        if (npc.poetId === 'BAUDELAIRE' || npc.id === 'npc_town_baudelaire') {
          if (npc.x === facingX && npc.y === facingY) return true;
          if ((facingX >= 21 && facingX <= 23) && facingY === 22 && p.dir === 'UP') return true;
          if (facingX === 21 && (facingY >= 20 && facingY <= 22) && p.dir === 'RIGHT') return true;
          const bdist = Math.hypot((npc.pxX ?? npc.x * TILE_SIZE) + 8 - (p.pxX + 8), (npc.pxY ?? npc.y * TILE_SIZE) + 12 - (p.pxY + 12));
          if (bdist <= 28) return true;
        }

        // Special priority check for Jalal al-Din Muhammad Rumi at the upper cafe table (14, 7) / (15, 7)
        if (npc.poetId === 'RUMI' || npc.id === 'npc_town_rumi') {
          // Direct facing tile match (facing 14, 7 from 13, 7 or 14, 6 or 14, 8)
          if (facingX === npc.x && facingY === npc.y) return true;
          // Facing the upper cafe table at (15, 7) where Rumi sits (e.g. from 15, 6 or 15, 8 or 16, 7)
          if (facingX === 15 && facingY === 7) return true;
          // Standing across the table from Rumi at (16, 7) facing LEFT
          if (p.gridX === 16 && p.gridY === 7 && p.dir === 'LEFT') return true;
          // Standing at table (15, 6) facing DOWN or (15, 8) facing UP
          if (p.gridX === 15 && ((p.gridY === 6 && p.dir === 'DOWN') || (p.gridY === 8 && p.dir === 'UP'))) return true;
          // Proximity check near Rumi at the upper table
          const rumiPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
          const rumiPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
          const distToRumi = Math.hypot(rumiPxX - (p.pxX + 8), rumiPxY - (p.pxY + 12));
          if (distToRumi <= 28) return true;
          if ((p.gridX >= 13 && p.gridX <= 16) && (p.gridY >= 6 && p.gridY <= 8)) {
            if (p.dir === 'RIGHT' && p.gridX <= 14) return true;
            if (p.dir === 'LEFT' && p.gridX >= 15) return true;
            if (p.dir === 'DOWN' && p.gridY === 6) return true;
            if (p.dir === 'UP' && p.gridY === 8) return true;
          }
        }

        // Direct facing tile match
        if (npc.x === facingX && npc.y === facingY) return true;

        // Pixel-rounded tile match
        const curTileX = Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE);
        const curTileY = Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE);
        if (curTileX === facingX && curTileY === facingY) return true;

        // Moving stepTo / stepFrom match (W. B. Yeats pacing fountain, Paul Laurence Dunbar)
        if (npc.isMoving && npc.movement?.type === 'PATH') {
          if (npc.movement.stepTo && npc.movement.stepTo.x === facingX && npc.movement.stepTo.y === facingY) return true;
          if (npc.movement.stepFrom && npc.movement.stepFrom.x === facingX && npc.movement.stepFrom.y === facingY) return true;
        }
        if (npc.patrol && npc.patrol.stepTo.x === facingX && npc.patrol.stepTo.y === facingY) return true;

        // Proximity check for moving NPCs (specifically W. B. Yeats pacing around fountain, Dunbar, etc.)
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 26) {
          if (p.dir === 'UP' && npcPxY <= pPxY + 6) return true;
          if (p.dir === 'DOWN' && npcPxY >= pPxY - 6) return true;
          if (p.dir === 'LEFT' && npcPxX <= pPxX + 6) return true;
          if (p.dir === 'RIGHT' && npcPxX >= pPxX - 6) return true;
        }

        return false;
      });

      if (targetNpc) {
        gameAudio.playCrispClick();
        triggerHaptics(35);

        // Immediate stop in tracks for walking characters (W. B. Yeats, Paul Laurence Dunbar)
        const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
          : targetNpc.x;
        const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
          ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
          : targetNpc.y;

        let npcTurnFacing: FacingDirection = targetNpc.facing;
        if (targetNpc.poetId === 'RUMI') {
          // Rumi sits peacefully at the upper cafe table with gentle, calm presence
          if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
          else if (p.gridY < targetNpc.y) npcTurnFacing = 'UP';
          else if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
          else npcTurnFacing = 'RIGHT';
        } else if (targetNpc.poetId === 'BAUDELAIRE' || targetNpc.id === 'npc_town_baudelaire') {
          // Baudelaire at bouquiniste stall turns to face player across counter
          if (p.gridY > targetNpc.y) npcTurnFacing = 'DOWN';
          else if (p.gridX < targetNpc.x) npcTurnFacing = 'LEFT';
          else if (p.gridX > targetNpc.x) npcTurnFacing = 'RIGHT';
          else npcTurnFacing = 'DOWN';
        } else {
          // Walking NPCs stop and turn to face the player
          if (p.gridY < stopTileY) npcTurnFacing = 'UP';
          else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
          else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
          else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';
        }

        setTownNpcs((prev) =>
          prev.map((n) =>
            n.id === targetNpc.id
              ? {
                  ...n,
                  x: stopTileX,
                  y: stopTileY,
                  pxX: stopTileX * TILE_SIZE,
                  pxY: stopTileY * TILE_SIZE,
                  facing: npcTurnFacing,
                  walkStep: 0,
                  isMoving: false,
                  isInteracting: true,
                  movement: n.movement
                    ? (n.movement.type === 'PATH'
                        ? {
                            ...n.movement,
                            stepProgress: 0,
                            stepFrom: undefined,
                            stepTo: undefined,
                            pauseTimer: 3.0,
                          }
                        : n.movement)
                    : undefined,
                }
              : n,
          ),
        );

        // 1. JALAL AL-DIN MUHAMMAD RUMI: Seated peacefully at the upper cafe table (14, 7). FIGHTABLE!
        if (targetNpc.poetId === 'RUMI' || targetNpc.id === 'npc_town_rumi') {
          const isPostEncounter = targetNpc.hasFoughtBefore || capturedPoetIds.includes('RUMI');
          const rumiGreeting = isPostEncounter
            ? 'We have spoken in verse, friend. The reed flute still remembers the song.'
            : 'Khosh amadid. I am Jalal al-Din Muhammad Rumi. Sit with me in stillness; what you seek is seeking you.';
          const rumiTalkLines = [
            '“The wound is the place where the light enters you.”',
            '“When the soul lies down in that grass, the world is too full to talk about.”',
            '“Listen to the story told by the reed, of being separated.”',
            'The tea here is good, though I usually spin after the second cup.',
          ];
          const rumiDuelLine = '“Come, come, whoever you are.”';

          promptPoetChoiceMenu(
            'JALAL AL-DIN MUHAMMAD RUMI',
            rumiGreeting,
            rumiTalkLines,
            rumiDuelLine,
            'RUMI',
            () => {
              setTownNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'RIGHT' } : n)),
              );
            },
          );
          return;
        }

        // 2. CHARLES BAUDELAIRE: Top-hatted bookseller & vendor at the Parisian Bouquiniste Stall (X: 21, Y: 20). FIGHTABLE!
        if (targetNpc.poetId === 'BAUDELAIRE' || targetNpc.id === 'npc_town_baudelaire') {
          const isPostEncounter = targetNpc.hasFoughtBefore || capturedPoetIds.includes('BAUDELAIRE') || capturedPoetIds.includes('baudelaire');
          const baudelaireGreeting = isPostEncounter
            ? "“Hypocrite lecteur, — mon semblable, — mon frère!” You carry the true rhythm. Browse the folios anytime."
            : "“Hypocrite lecteur, — mon semblable, — mon frère!” Welcome to the quayside of Parnassus. The city has its spleen, but here among the books, one finds the ideal.";
          const baudelaireTalkLines = [
            "“One should always be drunk. That's the great thing; the only question. On wine, on poetry, or on virtue, as you wish. But be drunk.”",
            "“Hypocrite lecteur, — mon semblable, — mon frère!”",
            "“There are in every man, at every hour, two simultaneous postulations: one towards God, the other towards Satan.”",
            "These dark forest-green wooden boxes are forged from French pine and river water. Look closely: stanza cards from every age of Paris.",
          ];
          const baudelaireDuelLine = "“Hypocrite lecteur, — mon semblable, — mon frère!” Let us test our stanzas of spleen and ideal!";

          promptPoetChoiceMenu(
            'CHARLES BAUDELAIRE',
            baudelaireGreeting,
            baudelaireTalkLines,
            baudelaireDuelLine,
            'BAUDELAIRE',
            () => {
              setTownNpcs((prev) =>
                prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
              );
            },
          );
          return;
        }

        // SOAPBOX CORNER (east lawn): whoever is on or around the crate. Non-Duelists.
        // Their greeting and lines live with them in INITIAL_TOWN_NPCS.
        if (targetNpc.id.startsWith('npc_town_soapbox_') || targetNpc.id.startsWith('npc_town_local_')) {
          const restFacing: FacingDirection = targetNpc.facing;
          promptPoetChoiceMenu(
            targetNpc.name,
            targetNpc.greeting ?? '',
            targetNpc.talkLines ?? [],
            '',
            undefined,
            () => {
              setTownNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? { ...n, isInteracting: false, facing: restFacing }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // 3. W. B. YEATS: Pacing West of Fountain, X: 10–13, Y: 7–9. Non-Duelist!
        if (targetNpc.poetId === 'YEATS' || targetNpc.id === 'npc_town_yeats') {
          const yeatsGreeting = "Good evening to you. Yeats. Don't mind me, I pace.";
          const yeatsTalkLines = [
            '“Tread softly because you tread on my dreams.”',
            '“Things fall apart; the centre cannot hold.”',
            "I was a senator for a while. It didn't take.",
          ];

          promptPoetChoiceMenu(
            'W. B. YEATS',
            yeatsGreeting,
            yeatsTalkLines,
            '',
            undefined,
            () => {
              setTownNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        isInteracting: false,
                        movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                      }
                    : n,
                ),
              );
            },
          );
          return;
        }

        // 4. FERNANDO PESSOA: Central Plaza near Bulletin Board, X: 19, Y: 10. Non-Duelist!
        if (targetNpc.poetId === 'PESSOA' || targetNpc.id === 'npc_town_pessoa') {
          const pessoaGreeting = 'Boa tarde. Pessoa. Or one of us, anyway.';
          const pessoaTalkLines = [
            '“Apart from that, I have within me all the dreams of the world.”',
            '“Each of us is several, is many.”',
            "I'm checking the notices for any news of Alberto Caeiro or Ricardo Reis.",
          ];

          promptPoetChoiceMenu(
            'FERNANDO PESSOA',
            pessoaGreeting,
            pessoaTalkLines,
            '',
            undefined,
            () => {
              setTownNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? { ...n, isInteracting: false, facing: 'DOWN' }
                    : n,
                ),
              );
            },
          );
          return;
        }
      }

      // 2. DOORS & INSPECTABLES (Only checked when no NPC is targeted/nearby)
      // Check Parisian Bouquiniste Bookstall on the right side of the road
      if ((facingX >= 20 && facingX <= 24) && (facingY >= 20 && facingY <= 23)) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const bookstallLines = [
          "A dark forest-green Parisian bouquiniste stall with heavy wooden boxes hinged open with polished brass stays. Trays of leather-bound first editions, rare stanza cards, and ribbons of broadside verse flutter in the mountain air.",
          "You browse the velvet-lined trays: rare first editions of 'Les Fleurs du Mal' and 'Illuminations' alongside gilded stanza cards ready to be bound into your Anthology.",
          "Pinned under the striped canvas awning: broadside poetry ribbons printed on hand-pressed rag paper. The top-hatted vendor tips his brim: 'A stanza card costs nothing to read, mon semblable, but everything to write.'",
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_BOOKSTALLS ?? 0) % bookstallLines.length;
        propInspectIndexRef.current.TOWN_BOOKSTALLS = (curIdx + 1) % bookstallLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: "PARISIAN BOUQUINISTE",
          text: bookstallLines[curIdx],
        });
        return;
      }

      // Check the Soapbox on the east lawn at X: 31, Y: 24 (reached from below; the speaker answers from the sides)
      if (facingX === 31 && facingY === 24) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        setOverworldDialogue({
          active: true,
          speakerName: "SOAPBOX",
          text: "An upturned soap crate. The grass in front of it is worn flat.",
        });
        return;
      }

      // Check Town Entrance Pillars & Brass Lanterns at X: 15..20, Y: 24..26
      if ((facingX === 15 || facingX === 16 || facingX === 19 || facingX === 20) && (facingY >= 24 && facingY <= 26)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "TOWN GATEWAY",
          text: "Wrought-iron gate pillars with warm brass lanterns lighting the road into the city of poets.",
        });
        return;
      }

      // Check Low Flower Planters & Curbs along the entrance road
      if ((facingX === 15 || facingX === 20) && (facingY >= 21 && facingY <= 24)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        setOverworldDialogue({
          active: true,
          speakerName: "FLOWER PLANTER",
          text: "Carved stone curbs and low flower planters overflowing with golden marigolds, purple lavender, and velvet petunias framing the cobblestone road.",
        });
        return;
      }

      // Check Left Building: Café de Flore (Cols 10..15, Rows 3..6 | Enterable Door at Col 13, Row 6)
      if ((facingX === 13 && (facingY === 6 || facingY === 5)) || (p.gridX === 13 && p.gridY === 7 && p.dir === 'UP') || (p.gridX === 13 && p.gridY === 6)) {
        transitionOverworldScreen('CAFE_DE_FLORE', 7, 10, 'UP');
        return;
      }
      if (facingX >= 10 && facingX <= 15 && facingY >= 3 && facingY <= 6) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "CAFÉ DE FLORE",
          text: "A warm Parisian literary café with bottle-green paneling and flower boxes of red geraniums. The aroma of dark roasted espresso drifts through the open door (Col 13).",
        });
        return;
      }

      // Check Right Building: Shakespeare & Co. (Cols 20..26, Rows 3..6 | Enterable Door at Col 23, Row 6)
      if ((facingX === 23 && (facingY === 6 || facingY === 5)) || (p.gridX === 23 && p.gridY === 7 && p.dir === 'UP') || (p.gridX === 23 && p.gridY === 6)) {
        transitionOverworldScreen('SHAKESPEARE_CO', 7, 10, 'UP');
        return;
      }
      if (facingX >= 20 && facingX <= 26 && facingY >= 3 && facingY <= 6) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "SHAKESPEARE AND COMPANY",
          text: "Sylvia Beach's renowned English bookshop and lending library. Worn first editions and modernist pamphlets fill the window beneath the oak sign (Door at Col 23).",
        });
        return;
      }
      // Check The Nightingale Door Entry via Action button (if facing door directly)
      const isTheNightingaleDoor = (facingX === 3 || facingX === 4) && facingY === 10;
      if (isTheNightingaleDoor && p.dir === 'UP') {
        transitionOverworldScreen('NIGHTINGALE', 7, 10, 'UP');
        return;
      }

      // Check The Lunch Counter Door Entry via Action button
      const isTheLunchCounterDoor = (facingX === 19 || facingX === 20) && facingY === 10;
      if (isTheLunchCounterDoor && p.dir === 'UP') {
        transitionOverworldScreen('LUNCH_COUNTER', 7, 10, 'UP');
        return;
      }

      // Check Top-Left House Door (The Rented Room - Charles Baudelaire) at X: 3, Y: 3
      const isTheRentedRoomDoor = facingX === 3 && facingY === 3;
      if (isTheRentedRoomDoor) {
        transitionOverworldScreen('RENTED_ROOM', 7, 9, 'UP');
        return;
      }

      // Check Notice / Bulletin Board at (13, 4)
      if (facingX === 13 && facingY === 4) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const bulletinLines = [
          "A weathered wood bulletin board pinned with broadsides, literary gazettes, and poetry flyers for tonight's open mic at the Nightingale.",
          'A pinned notice at the corner reads: MISSING — ONE TRUNK OF UNPUBLISHED HETERONYMS. IF FOUND, RETURN TO F. PESSOA (OR ALBERTO CAEIRO).',
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_BULLETIN ?? 0) % bulletinLines.length;
        propInspectIndexRef.current.TOWN_BULLETIN = (curIdx + 1) % bulletinLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BULLETIN BOARD',
          text: bulletinLines[curIdx],
        });
        return;
      }

      // Check Bouquiniste Bookstalls at (14..16, 13)
      if ((facingX >= 14 && facingX <= 16) && facingY === 13) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        const bookstallLines = [
          'A bouquiniste open-air bookstall crammed with second-hand volumes of French verse and jazz ballads.',
          'Every book inside appears to have been written by a different Portuguese man who looks suspiciously like the vendor.',
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_BOOKSTALLS ?? 0) % bookstallLines.length;
        propInspectIndexRef.current.TOWN_BOOKSTALLS = (curIdx + 1) % bookstallLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'BOUQUINISTE STALL',
          text: bookstallLines[curIdx],
        });
        return;
      }

      // Check Sidewalk Café Bistro Tables & Chairs (Lower table at 15, 9, or upper table only if Rumi has been recruited)
      const isNearLowerTable = (facingX === 15 && facingY === 9) || ((facingX === 14 || facingX === 16) && facingY === 9);
      const isNearUpperTableUnoccupied = (facingX === 15 || facingX === 14 || facingX === 16) && facingY === 7 && capturedPoetIds.includes('RUMI');
      if (isNearLowerTable || isNearUpperTableUnoccupied) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        const bistroLines = [
          "A wrought-iron table holding two clouded glasses of green absinthe and a slotted pewter spoon.",
          "Scratched into the zinc tabletop with a penknife: 'A black, E white, I red, U green, O blue.'",
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_BISTRO_TABLES ?? 0) % bistroLines.length;
        propInspectIndexRef.current.TOWN_BISTRO_TABLES = (curIdx + 1) % bistroLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'CAFÉ BISTRO TABLE',
          text: bistroLines[curIdx],
        });
        return;
      }

      // Check East Wooden Park Bench (North Ridge • X: 14..15, Y: 5) (ARTIFACT 1: Rilke's Panther)
      if ((facingX === 14 || facingX === 15) && facingY === 5) {
        gameAudio.playFootstepWood();
        triggerHaptics(30);
        const pantherLines = [
          "A dark bronze statuette of a pacing Jardin des Plantes panther rests on the iron bench arm.",
          "'His gaze from staring through the bars has grown so weary that it can hold nothing more.'",
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_BENCH_PANTHER ?? 0) % pantherLines.length;
        propInspectIndexRef.current.TOWN_BENCH_PANTHER = (curIdx + 1) % pantherLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'PARK BENCH',
          text: pantherLines[curIdx],
        });
        return;
      }

      // Check West Wooden Park Bench (North Ridge • X: 8..9, Y: 5)
      if ((facingX === 8 || facingX === 9) && facingY === 5) {
        gameAudio.playFootstepWood();
        triggerHaptics(30);
        const benchLines = [
          "A wooden-slat park bench beneath the trees, holding a half-eaten cottage cheese lunch.",
          "Penciled on a folded pamphlet beside the armrest: 'A Cloud in Trousers.'",
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_BENCHES ?? 0) % benchLines.length;
        propInspectIndexRef.current.TOWN_BENCHES = (curIdx + 1) % benchLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'PARK BENCH',
          text: benchLines[curIdx],
        });
        return;
      }

      // Check Belle Époque Streetlamps at corners (7, 5), (16, 5), (7, 12), (16, 12)
      if ((facingX === 7 || facingX === 16) && (facingY === 5 || facingY === 12)) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        const lampLines = [
          "An ornate wrought-iron gas lamp sputtering as the winter evening settles down at four o'clock.",
          "'The yellow fog that rubs its back upon the window-panes' lingers around the glass.",
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_STREETLAMPS ?? 0) % lampLines.length;
        propInspectIndexRef.current.TOWN_STREETLAMPS = (curIdx + 1) % lampLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'GAS STREETLAMP',
          text: lampLines[curIdx],
        });
        return;
      }

      // Check Town Pigeons near fountain and benches (strictly checked AFTER NPCs so Yeats is never blocked)
      if (
        ((facingX === 9 || facingX === 10) && (facingY === 8 || facingY === 9)) ||
        (facingX === 14 && facingY === 6) ||
        ((facingX === 9 || facingX === 10 || facingX === 14 || facingX === 15) && (facingY === 6 || facingY === 7))
      ) {
        gameAudio.playPigeonCoo();
        triggerHaptics(25);
        const pigeonLines = [
          'A plump town pigeon coos softly, pecking at brioche crumbs on the cobblestones.',
          'COO. (It struts in strict iambic pentameter.)',
          'It eyes Yeats suspiciously every time he paces past.',
        ];
        const curIdx = (propInspectIndexRef.current.TOWN_PIGEONS ?? 0) % pigeonLines.length;
        propInspectIndexRef.current.TOWN_PIGEONS = (curIdx + 1) % pigeonLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'TOWN PIGEON',
          text: pigeonLines[curIdx],
        });
        return;
      }

      // Check Sleeping Alley Cat at (21, 11)
      if (facingX === 21 && facingY === 11) {
        gameAudio.playCatMeow();
        triggerHaptics(30);
        const catLines = [
          "Jeoffry the ginger cat purrs softly on the warm stone step.",
          "'For he counteracts the powers of darkness by his electrical skin and glaring eyes.'",
          "He cracks one amber eye open, judges your meter, and goes back to sleep.",
        ];
        const curIdx = (propInspectIndexRef.current.GINGER_CAT ?? 0) % catLines.length;
        propInspectIndexRef.current.GINGER_CAT = (curIdx + 1) % catLines.length;
        setOverworldDialogue({
          active: true,
          speakerName: 'GINGER CAT',
          text: catLines[curIdx],
        });
        return;
      }

      // Check Terracotta Planters with bay laurel & topiary flanking the north benches at X: 11, 14, 21, 24, Y: 9
      if ((facingX === 11 || facingX === 14 || facingX === 21 || facingX === 24) && facingY === 9) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        setOverworldDialogue({
          active: true,
          speakerName: 'PLAZA PLANTER',
          text: 'A neat terracotta planter with glossy bay laurel leaves and trimmed topiary shrubs, scenting the plaza air with sweet Mediterranean green.',
        });
        return;
      }

      // Check Grand Literary Plaza Fountain (The Fountain of the Muses) across footprint X: 16..19, Y: 13..16
      const isFacingFountain =
        (facingX >= 16 && facingX <= 19 && facingY >= 13 && facingY <= 16) ||
        ((p.gridX >= 15 && p.gridX <= 20) && (p.gridY >= 12 && p.gridY <= 17) && (facingX >= 16 && facingX <= 19 && facingY >= 13 && facingY <= 16));

      if (isFacingFountain) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);

        const fountainPrompt =
          "The Fountain of the Muses. Clear water cascades from a bronze winged quill into a pool lined with travelers' wishing coins. Tossing a coin grants a gentle spark of poetic Inspiration (+10 IP).";

        const choiceOptions: Array<{ label: 'TALK' | 'DUEL' | 'LEAVE' | 'JOIN'; action: () => void }> = [
          {
            label: 'TALK', // TOSS COIN
            action: () => {
              gameAudio.playCoinPickup();
              gameAudio.playPowerupChime();
              triggerHaptics([40, 80, 120]);

              // Grant inspiration: heal active poet by +10 HP up to max HP and award score bonus
              const leadId = activePlayerPoetId || playerLineup[0] || 'MARY_OLIVER';
              const leadPoetObj = getPoetById(leadId);
              const maxHp = leadPoetObj.hp;

              if (leadId === activePlayerPoetId) {
                const nextHp = Math.min(maxHp, playerHpRef.current + 10);
                setPlayerHp(nextHp);
                playerHpRef.current = nextHp;
                playerDisplayHpRef.current = nextHp;
              }
              setLineupHpMap((prev) => ({ ...prev, [leadId]: Math.min(maxHp, (prev[leadId] ?? maxHp) + 10) }));
              lineupHpMapRef.current[leadId] = Math.min(maxHp, (lineupHpMapRef.current[leadId] ?? maxHp) + 10);
              setGameState((prev) => ({ ...prev, score: prev.score + 100 }));
              addFloatingText(p.pxX + 8, p.pxY - 10, '+10 INSPIRATION!', '#fbbf24', 16);

              setOverworldDialogue({
                active: true,
                speakerName: 'FOUNTAIN OF THE MUSES',
                text: "A coin glints as it spins through crystal cascades and settles among travelers' wishes at the bottom. A spark of poetic Inspiration fills your thoughts (+10 IP / +10 HP)!",
              });
            },
          },
          {
            label: 'JOIN', // DRINK
            action: () => {
              gameAudio.playPotionGulp();
              gameAudio.playShoreWaveChime();
              triggerHaptics([40, 70]);

              const leadId = activePlayerPoetId || playerLineup[0] || 'MARY_OLIVER';
              const leadPoetObj = getPoetById(leadId);
              const maxHp = leadPoetObj.hp;

              if (leadId === activePlayerPoetId) {
                const nextHp = Math.min(maxHp, playerHpRef.current + 5);
                setPlayerHp(nextHp);
                playerHpRef.current = nextHp;
                playerDisplayHpRef.current = nextHp;
              }
              setLineupHpMap((prev) => ({ ...prev, [leadId]: Math.min(maxHp, (prev[leadId] ?? maxHp) + 5) }));
              lineupHpMapRef.current[leadId] = Math.min(maxHp, (lineupHpMapRef.current[leadId] ?? maxHp) + 5);
              addFloatingText(p.pxX + 8, p.pxY - 10, '+5 HP', '#10b981', 15);

              setOverworldDialogue({
                active: true,
                speakerName: 'FOUNTAIN OF THE MUSES',
                text: 'You cup your hands and drink the cool mountain spring water cascading from the bronze winged quill. Pure, sweet, and restorative (+5 HP).',
              });
            },
          },
          {
            label: 'LEAVE',
            action: () => {
              gameAudio.playMenuCancel();
              triggerHaptics(25);
              setOverworldDialogue(null);
            },
          },
        ];

        setOverworldDialogue({
          active: true,
          speakerName: 'FOUNTAIN OF THE MUSES',
          text: fountainPrompt,
          showChoiceMenu: true,
          choiceOptions: [
            {
              label: 'TALK',
              action: choiceOptions[0].action,
            },
            {
              label: 'JOIN',
              action: choiceOptions[1].action,
            },
            {
              label: 'LEAVE',
              action: choiceOptions[2].action,
            },
          ],
        });
        return;
      }


      return;
    }

    // =========================================================================
    // SCREEN 1: THE HARBOR INTERACTIONS
    // =========================================================================
    const targetNpc = harborNpcsRef.current.find((npc) => {
      if (!npc.isActive || npc.isDissolving || npc.isRecruited || (npc.poetId && capturedPoetIds.includes(npc.poetId))) return false;
      if (npc.x === facingX && npc.y === facingY) return true;
      const curTileX = Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE);
      const curTileY = Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE);
      if (curTileX === facingX && curTileY === facingY) return true;

      if (npc.isMoving && npc.movement?.type === 'PATH') {
        if (npc.movement.stepTo && npc.movement.stepTo.x === facingX && npc.movement.stepTo.y === facingY) return true;
        if (npc.movement.stepFrom && npc.movement.stepFrom.x === facingX && npc.movement.stepFrom.y === facingY) return true;
      }

      // Whitman on pier: easily approachable, stops when interacted with
      if (npc.id === 'npc_whitman' || npc.poetId === 'WHITMAN') {
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 26) {
          if (p.dir === 'UP' && npcPxY <= pPxY + 4) return true;
          if (p.dir === 'DOWN' && npcPxY >= pPxY - 4) return true;
          if (p.dir === 'LEFT' && npcPxX <= pPxX + 4) return true;
          if (p.dir === 'RIGHT' && npcPxX >= pPxX - 4) return true;
        }
      }

      // Darwish sitting on the reading bench at (20, 12): reachable facing either bench tile (20, 12) or (21, 12)
      if ((npc.id === 'npc_darwish' || npc.poetId === 'DARWISH') && (facingY === 12 && (facingX === 20 || facingX === 21))) {
        return true;
      }

      // Senghor in daffodil glade: approachable and stops when interacted with
      if (npc.id === 'npc_senghor' || npc.poetId === 'SENGHOR') {
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 28) {
          return true;
        }
      }

      // Mary Oliver patrolling along Goose Pond shore: easily approachable, stops when interacted with
      if (npc.id === 'npc_mary_oliver' || npc.poetId === 'MARY_OLIVER') {
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 28) {
          return true;
        }
      }

      // C. P. Cavafy autonomous shoreline stroll: approachable when outside
      if (npc.id === 'npc_cavafy' || npc.poetId === 'CAVAFY') {
        if (npc.cavafyRoutine?.phase === 'INSIDE' || (npc.opacity !== undefined && npc.opacity <= 0.05)) {
          return false;
        }
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 28) {
          return true;
        }
      }

      // Derek Walcott beach shoreline wander patrol: approachable along the sand
      if (npc.id === 'npc_walcott' || npc.poetId === 'WALCOTT') {
        const npcPxX = (npc.pxX ?? npc.x * TILE_SIZE) + 8;
        const npcPxY = (npc.pxY ?? npc.y * TILE_SIZE) + 12;
        const pPxX = p.pxX + 8;
        const pPxY = p.pxY + 12;
        const dist = Math.hypot(npcPxX - pPxX, npcPxY - pPxY);
        if (dist <= 28) {
          return true;
        }
      }

      return false;
    });

    if (targetNpc) {
      gameAudio.playCrispClick();
      triggerHaptics(35);

      const stopTileX = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
        ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.x : (targetNpc.movement.stepFrom?.x ?? targetNpc.x))
        : targetNpc.x;
      const stopTileY = targetNpc.isMoving && targetNpc.movement?.type === 'PATH' && targetNpc.movement.stepTo
        ? ((targetNpc.movement.stepProgress ?? 0) >= 0.5 ? targetNpc.movement.stepTo.y : (targetNpc.movement.stepFrom?.y ?? targetNpc.y))
        : targetNpc.y;

      let npcTurnFacing: FacingDirection = targetNpc.facing;
      if (targetNpc.id === 'npc_darwish' || targetNpc.poetId === 'DARWISH') {
        // Seated on bench: calculate relative position to face the player while seated
        if (p.gridX < targetNpc.x) {
          npcTurnFacing = 'LEFT';
        } else if (p.gridX > targetNpc.x) {
          npcTurnFacing = 'RIGHT';
        } else if (p.gridY < targetNpc.y) {
          npcTurnFacing = 'UP';
        } else if (p.gridY > targetNpc.y) {
          npcTurnFacing = 'DOWN';
        } else {
          npcTurnFacing = 'DOWN';
        }
      } else if (targetNpc.id === 'npc_cavafy' || targetNpc.poetId === 'CAVAFY' || targetNpc.id === 'npc_mary_oliver' || targetNpc.poetId === 'MARY_OLIVER' || targetNpc.id === 'npc_walcott' || targetNpc.poetId === 'WALCOTT') {
        const npcCenterX = (targetNpc.pxX ?? targetNpc.x * TILE_SIZE) + 8;
        const npcCenterY = (targetNpc.pxY ?? targetNpc.y * TILE_SIZE) + 12;
        const playerCenterX = p.pxX + 8;
        const playerCenterY = p.pxY + 12;
        const dx = playerCenterX - npcCenterX;
        const dy = playerCenterY - npcCenterY;
        if (Math.abs(dx) > Math.abs(dy)) {
          npcTurnFacing = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
          npcTurnFacing = dy > 0 ? 'DOWN' : 'UP';
        }
      } else if (p.gridY < stopTileY) npcTurnFacing = 'UP';
      else if (p.gridY > stopTileY) npcTurnFacing = 'DOWN';
      else if (p.gridX < stopTileX) npcTurnFacing = 'LEFT';
      else if (p.gridX > stopTileX) npcTurnFacing = 'RIGHT';

      setHarborNpcs((prev) =>
        prev.map((n) =>
          n.id === targetNpc.id
            ? {
                ...n,
                x: stopTileX,
                y: stopTileY,
                pxX: stopTileX * TILE_SIZE,
                pxY: stopTileY * TILE_SIZE,
                facing: npcTurnFacing,
                walkStep: 0,
                isMoving: false,
                isInteracting: true,
                movement: n.movement
                  ? {
                      ...n.movement,
                      stepProgress: 0,
                      stepFrom: undefined,
                      stepTo: undefined,
                      pauseTimer: 3.5,
                    }
                  : undefined,
              }
            : n,
        ),
      );

      // WHITMAN on Pier Boardwalk (X: 10, Y: 22)
      if (targetNpc.id === 'npc_whitman' || targetNpc.isStarterRecruit) {
        if (capturedPoetIds.includes('WHITMAN') || targetNpc.isRecruited || targetNpc.isDissolving) {
          return;
        }

        const whitmanGreeting =
          "Good day to you, Camerado! I'm Walt Whitman, from Brooklyn, and then everywhere. I've been waiting on this pier a good while.";
        const whitmanTalkLines = [
          "“I celebrate myself, and sing myself, and what I assume you shall assume!”",
          "“Listen to the meter of the waves, Camerado! Every poet you meet on Mount Parnassus can be befriended in verse or tested in a duel.”",
          "“Keep your satchel ready and your ear tuned to the rhythm. Whenever you're ready, take my hand and let's begin the climb!”",
        ];
        const choiceOptions: Array<{ label: 'TALK' | 'DUEL' | 'LEAVE' | 'JOIN'; action: () => void }> = [
          {
            label: 'TALK',
            action: () => {
              gameAudio.playCrispClick();
              triggerHaptics(30);
              const talkText = whitmanTalkLines[Math.floor(Math.random() * whitmanTalkLines.length)];
              setOverworldDialogue({
                active: true,
                speakerName: targetNpc.name,
                text: talkText,
                showChoiceMenu: true,
                choiceOptions,
              });
            },
          },
          // Whitman is not fought. He joins the Reader on the pier.
          {
            label: 'JOIN',
            action: () => {
              gameAudio.playConfirmSelect();
              triggerHaptics(40);
              setOverworldDialogue({
                active: true,
                speakerName: targetNpc.name,
                text: '“Camerado, I give you my hand! Shall we stick by each other as long as we live? Allons! The road is before us!”',
                onComplete: () => {
                  setOverworldDialogue(null);
                  triggerPoetRecruitmentDissolve('npc_whitman', 'WHITMAN');
                },
              });
            },
          },
        ];

        setOverworldDialogue({
          active: true,
          speakerName: targetNpc.name,
          text: whitmanGreeting,
          showChoiceMenu: true,
          choiceOptions,
        });
        return;
      }

      // MARY OLIVER
      if (targetNpc.id === 'npc_mary_oliver' || targetNpc.poetId === 'MARY_OLIVER') {
        if (!targetNpc.hasSeenIntro) {
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text:
              "Morning. Mary Oliver. You caught me out by the water's edge, watching the wild geese swim across the pond. I'm always out by the water. Or writing.",
            onComplete: () => {
              setHarborNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        isInteracting: false,
                        facing:
                          n.maryOliverRoutine?.phase === 'STROLL_WEST'
                            ? 'LEFT'
                            : n.maryOliverRoutine?.phase === 'STROLL_EAST'
                            ? 'RIGHT'
                            : 'UP',
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          "Shall we share words together, test our stanzas in a duel, or will you walk along?",
          [
            "“Pay attention. Be astonished. Tell about it.”",
            "“You do not have to be good. You only have to let the soft animal of your body love what it loves.”",
            "“The geese know what they're doing. I just take notes.”",
          ],
          "“Tell me, what is it you plan to do with your one wild and precious life?”",
          'MARY_OLIVER',
          () => {
            setHarborNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      facing:
                        n.maryOliverRoutine?.phase === 'STROLL_WEST'
                          ? 'LEFT'
                          : n.maryOliverRoutine?.phase === 'STROLL_EAST'
                          ? 'RIGHT'
                          : 'UP',
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // MAHMOUD DARWISH: Seated directly on the reading bench in the eastern meadow park (X: 20, Y: 12). FIGHTABLE DUELIST!
      if (targetNpc.id === 'npc_darwish' || targetNpc.poetId === 'DARWISH') {
        if (!targetNpc.hasSeenIntro) {
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text:
              targetNpc.introLine ||
              targetNpc.greeting ||
              "Salaam, traveler. Mahmoud Darwish. You find me in this quiet reading park beneath the green boughs. Sit beside me on the bench if your limbs grow weary.",
            onComplete: () => {
              setHarborNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id ? { ...n, hasSeenIntro: true, isInteracting: false, facing: 'DOWN' } : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || "The sea breeze brings the scent of wildflowers and poetry to this quiet park nook.",
          targetNpc.talkLines || [
            '“We have on this earth what makes life worth living: the scent of bread at dawn, a woman’s thoughts on men, the works of Aeschylus, the beginning of love...”',
            '“Where should the birds fly after the last sky? Where should the plants sleep after the last air?”',
            '“I have learned all the words and broken them to make a single word: Home.”',
            'Sit beside me on this weathered bench; the harbor road is loud, but here the verse takes root.',
          ],
          targetNpc.duelLine || "“We have on this earth what makes life worth living.” Let us test our stanzas under the park trees!",
          'DARWISH',
          () => {
            setHarborNpcs((prev) =>
              prev.map((n) => (n.id === targetNpc.id ? { ...n, isInteracting: false, facing: 'DOWN' } : n)),
            );
          },
        );
        return;
      }

      // LÉOPOLD SÉDAR SENGHOR: Strolling through the Golden Daffodil Glade (X: 25..30, Y: 4..8)
      if (targetNpc.id === 'npc_senghor' || targetNpc.poetId === 'SENGHOR') {
        // Ensure player turns to face Senghor directly
        if (Math.abs(p.pxX - (stopTileX * TILE_SIZE)) > Math.abs(p.pxY - (stopTileY * TILE_SIZE))) {
          p.dir = (stopTileX * TILE_SIZE) >= p.pxX ? 'RIGHT' : 'LEFT';
        } else {
          p.dir = (stopTileY * TILE_SIZE) >= p.pxY ? 'DOWN' : 'UP';
        }

        if (!targetNpc.hasSeenIntro) {
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text:
              targetNpc.introLine ||
              targetNpc.greeting ||
              "Nanga def. I'm Senghor. Think of me as a poet, or a president, or a poet again after. These golden flowers dance to an inner rhythm.",
            onComplete: () => {
              setHarborNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        isInteracting: false,
                        movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || "These golden flowers dance to an inner rhythm. Listen to the music of the earth.",
          targetNpc.talkLines || [
            '“Rhythm is the architecture of being.”',
            '“Night of Sine, let me breathe the smell of our Dead.”',
            '“Listen to the golden heads nodding in the breeze—every stanza has its pulse.”',
            "That's the road. There's only the one.",
          ],
          targetNpc.duelLine || "“Rhythm is the architecture of being.” Let our verses resonate together in the glade!",
          targetNpc.isFightable ? 'SENGHOR' : undefined,
          () => {
            setHarborNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // C. P. CAVAFY (Lighthouse keeper & seaside wanderer)
      if (targetNpc.id === 'npc_cavafy' || targetNpc.poetId === 'CAVAFY') {
        // Ensure player also turns to face Cavafy directly
        const npcCenterX = (targetNpc.pxX ?? targetNpc.x * TILE_SIZE) + 8;
        const npcCenterY = (targetNpc.pxY ?? targetNpc.y * TILE_SIZE) + 12;
        const pCenterX = p.pxX + 8;
        const pCenterY = p.pxY + 12;
        if (Math.abs(pCenterX - npcCenterX) > Math.abs(pCenterY - npcCenterY)) {
          p.dir = npcCenterX >= pCenterX ? 'RIGHT' : 'LEFT';
        } else {
          p.dir = npcCenterY >= pCenterY ? 'DOWN' : 'UP';
        }

        if (!targetNpc.hasSeenIntro) {
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text:
              targetNpc.introLine ||
              targetNpc.greeting ||
              "Kalispera. Cavafy. The beacon lamp burns clear over the Crossing-Bar shoals. Look out across the water—the sloop is sailing past.",
            onComplete: () => {
              setHarborNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        isInteracting: false,
                        facing: 'DOWN',
                        cavafyRoutine: n.cavafyRoutine
                          ? {
                              ...n.cavafyRoutine,
                              phase: n.cavafyRoutine.phase === 'STROLL_WEST' ? 'PAUSE_WEST' : 'PAUSE_EAST',
                              timer: 2.0,
                            }
                          : undefined,
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || "The beacon lamp burns clear over the Crossing-Bar shoals. Look out across the water—the sloop is sailing past.",
          targetNpc.talkLines || [
            '“Hope your road is a long one.”',
            '“Full of adventure, full of discovery.”',
            "I'll stay by the beacon lamp.",
          ],
          '',
          undefined,
          () => {
            setHarborNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      facing: 'DOWN',
                      cavafyRoutine: n.cavafyRoutine
                        ? {
                            ...n.cavafyRoutine,
                            phase: n.cavafyRoutine.phase === 'STROLL_WEST' ? 'PAUSE_WEST' : 'PAUSE_EAST',
                            timer: 2.0,
                          }
                        : undefined,
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // DEREK WALCOTT (Beach Shoreline Wander Patrol)
      if (targetNpc.id === 'npc_walcott' || targetNpc.poetId === 'WALCOTT') {
        const npcCenterX = (targetNpc.pxX ?? targetNpc.x * TILE_SIZE) + 8;
        const npcCenterY = (targetNpc.pxY ?? targetNpc.y * TILE_SIZE) + 12;
        const pCenterX = p.pxX + 8;
        const pCenterY = p.pxY + 12;
        if (Math.abs(pCenterX - npcCenterX) > Math.abs(pCenterY - npcCenterY)) {
          p.dir = npcCenterX >= pCenterX ? 'RIGHT' : 'LEFT';
        } else {
          p.dir = npcCenterY >= pCenterY ? 'DOWN' : 'UP';
        }

        if (!targetNpc.hasSeenIntro) {
          setOverworldDialogue({
            active: true,
            speakerName: targetNpc.name,
            text:
              targetNpc.introLine ||
              targetNpc.greeting ||
              "Bonjou. Walcott. Out here on the beach, watching the waves roll in toward the boathouse. The sea is history.",
            onComplete: () => {
              setHarborNpcs((prev) =>
                prev.map((n) =>
                  n.id === targetNpc.id
                    ? {
                        ...n,
                        hasSeenIntro: true,
                        isInteracting: false,
                        facing:
                          n.walcottRoutine?.phase === 'STROLL_WEST'
                            ? 'LEFT'
                            : n.walcottRoutine?.phase === 'STROLL_EAST'
                            ? 'RIGHT'
                            : 'DOWN',
                      }
                    : n,
                ),
              );
            },
          });
          return;
        }

        promptPoetChoiceMenu(
          targetNpc.name,
          targetNpc.greeting || "Bonjou. Walcott. Out here on the beach, watching the waves roll in toward the boathouse. The sea is history.",
          targetNpc.talkLines || [
            '“You will greet yourself arriving at your own door.”',
            '“The sea is history.”',
            'Look east along the surf—The Bight Boathouse has stood there through thirty hurricanes.',
          ],
          targetNpc.duelLine || "“The sea is history.” Let our verses meet upon the shore!",
          targetNpc.isFightable ? 'WALCOTT' : undefined,
          () => {
            setHarborNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      isInteracting: false,
                      facing:
                        n.walcottRoutine?.phase === 'STROLL_WEST'
                          ? 'LEFT'
                          : n.walcottRoutine?.phase === 'STROLL_EAST'
                          ? 'RIGHT'
                          : 'DOWN',
                    }
                  : n,
              ),
            );
          },
        );
        return;
      }

      // TALKERS Fallback
      if (!targetNpc.hasSeenIntro) {
        const introText = targetNpc.introLine || targetNpc.greeting || `“${targetNpc.name}”`;
        setOverworldDialogue({
          active: true,
          speakerName: targetNpc.name,
          text: introText,
          onComplete: () => {
            setHarborNpcs((prev) =>
              prev.map((n) =>
                n.id === targetNpc.id
                  ? {
                      ...n,
                      hasSeenIntro: true,
                      currentDialogueIndex: 0,
                      isInteracting: false,
                      movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                    }
                  : n,
              ),
            );
          },
        });
        return;
      }

      promptPoetChoiceMenu(
        targetNpc.name,
        targetNpc.greeting || targetNpc.normalLines?.[0] || 'Care to share a verse along the shore?',
        targetNpc.normalLines || targetNpc.talkLines || ['“The sea remembers everything.”'],
        '',
        undefined,
        () => {
          setHarborNpcs((prev) =>
            prev.map((n) =>
              n.id === targetNpc.id
                ? {
                    ...n,
                    isInteracting: false,
                    movement: n.movement ? { ...n.movement, pauseTimer: 2.5 } : undefined,
                  }
                : n,
            ),
          );
        },
      );
      return;
    }

    // Check Signpost
    const screenData = buildHarborScreen1();
    const facingObj = screenData.objects[facingY]?.[facingX];

    // Shel Silverstein's "The Giving Tree" Stump at X: 16, Y: 14
    if (
      currentScreenId === 'HARBOR' &&
      (facingObj === HARBOR_TILES.GIVING_TREE_STUMP || (facingX === 16 && facingY === 14))
    ) {
      const clicks = givingTreeClicksRef.current;
      givingTreeClicksRef.current = clicks + 1;
      setGivingTreeClicks(clicks + 1);

      if (clicks % 2 === 0) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: 'Old Tree Stump',
          text: 'A wide, sun-warmed tree stump cut flush near the grass. A single red apple rests by its roots.',
        });
      } else {
        const leadId = activePlayerPoetId || playerLineup[0] || 'MARY_OLIVER';
        const leadPoetObj = getPoetById(leadId);
        const maxHp = leadPoetObj.hp;

        if (leadId === activePlayerPoetId) {
          const nextHp = Math.min(maxHp, playerHpRef.current + 5);
          setPlayerHp(nextHp);
          playerHpRef.current = nextHp;
          playerDisplayHpRef.current = nextHp;
        }
        setLineupHpMap((prev) => ({ ...prev, [leadId]: Math.min(maxHp, (prev[leadId] ?? maxHp) + 5) }));
        lineupHpMapRef.current[leadId] = Math.min(maxHp, (lineupHpMapRef.current[leadId] ?? maxHp) + 5);

        gameAudio.playPowerupChime();
        triggerHaptics([40, 70]);
        setOverworldDialogue({
          active: true,
          speakerName: 'Old Tree Stump',
          text: 'You sit down on the stump and rest a while (+5 HP). The tree seems happy.',
        });
      }
      return;
    }

    // Wordsworth's Golden Daffodil Glade at X: 24..32, Y: 3..7
    if (
      currentScreenId === 'HARBOR' &&
      ((facingX >= 24 && facingX <= 32 && facingY >= 3 && facingY <= 7) ||
       (p.gridX >= 24 && p.gridX <= 32 && p.gridY >= 3 && p.gridY <= 7))
    ) {
      const nextClicks = daffodilClicksRef.current + 1;
      daffodilClicksRef.current = nextClicks;
      setDaffodilClicks(nextClicks);
      propInspectIndexRef.current.DAFFODIL_GLADE = nextClicks;

      gameAudio.playHoverMicroTone();
      triggerHaptics(30);

      const isOdd = nextClicks % 2 !== 0;
      setOverworldDialogue({
        active: true,
        speakerName: 'Golden Daffodil Glade',
        text: isOdd
          ? 'Ten thousand saw I at a glance, / Tossing their heads in sprightly dance.'
          : 'You stand in the coastal breeze. Somehow you know this exact patch of yellow pixels will flash across your inward eye the next time you lie on your couch.',
      });
      return;
    }

    // Check Shaded Meadow Reading Bench in eastern park area (X: 20..21, Y: 12)
    if (
      currentScreenId === 'HARBOR' &&
      ((facingObj === HARBOR_TILES.BENCH_L || facingObj === HARBOR_TILES.BENCH_R) ||
       ((facingX === 20 || facingX === 21) && (facingY === 12 || facingY === 11 || facingY === 13)))
    ) {
      gameAudio.playFootstepWood();
      triggerHaptics(30);
      const benchLines = [
        "A weathered cedar park bench set peacefully within a quiet reading park framed by green park trees.",
        "Scratched into the cedar armrest in fine Arabic script: 'We have on this earth what makes life worth living.'",
        "Wild poppies, marigolds, bluebells, and clover blossom in the gentle breeze across the verdant grass.",
      ];
      const curBenchIdx = (propInspectIndexRef.current.CANTO1_BENCH ?? 0) % benchLines.length;
      propInspectIndexRef.current.CANTO1_BENCH = (curBenchIdx + 1) % benchLines.length;
      setOverworldDialogue({
        active: true,
        speakerName: 'READING BENCH',
        text: benchLines[curBenchIdx],
      });
      return;
    }

    if (facingObj === HARBOR_TILES.SIGNPOST || (facingX === 14 && facingY === 2) || (facingX === 16 && facingY === 1)) {
      gameAudio.playCrispClick();
      triggerHaptics(30);
      const signpostLines = [
        'PARNASSUS: Mount of the Muses. The ascent begins along the water.',
        'A carved wooden signpost: “The climb is steep, but the air grows clearer.”',
        'Faint charcoal scrawl at the base reads: “Allons! The road is before us!”',
      ];
      const curSignIdx = propInspectIndexRef.current.SIGNPOST % signpostLines.length;
      propInspectIndexRef.current.SIGNPOST = (curSignIdx + 1) % signpostLines.length;
      setOverworldDialogue({
        active: true,
        speakerName: 'SIGNPOST',
        text: signpostLines[curSignIdx],
      });
      return;
    }

    // Check Wild Goose (Swimming pond geese & Dynamic wandering land goose)
    const lg = landGooseRef.current;
    const isFacingLandGoose =
      currentScreenId === 'HARBOR' &&
      lg &&
      (Math.hypot(
        (lg.pxX + 8) - (facingX * TILE_SIZE + 8),
        (lg.pxY + 8) - (facingY * TILE_SIZE + 8),
      ) < 20 ||
        (Math.round(lg.pxX / TILE_SIZE) === facingX && Math.round(lg.pxY / TILE_SIZE) === facingY));

    const wg = waterGooseRef.current;
    const isFacingWaterGoose =
      currentScreenId === 'HARBOR' &&
      wg &&
      (Math.hypot(
        (wg.pxX + 8) - (facingX * TILE_SIZE + 8),
        (wg.pxY + 8) - (facingY * TILE_SIZE + 8),
      ) < 22 ||
        (Math.round(wg.pxX / TILE_SIZE) === facingX && Math.round(wg.pxY / TILE_SIZE) === facingY));

    if (
      isFacingLandGoose ||
      isFacingWaterGoose ||
      facingObj === HARBOR_TILES.GOOSE_WATER ||
      facingObj === HARBOR_TILES.GOOSE_LAND ||
      (facingX >= 3 && facingX <= 11 && facingY >= 4 && facingY <= 9 && (facingObj === HARBOR_TILES.POND_LILY_PADS || facingObj === HARBOR_TILES.REED))
    ) {
      gameAudio.playGooseHonk();
      triggerHaptics(30);
      const geeseLines = [
        'HONK. The wild goose ruffles its feathers and eyes you with dignified curiosity.',
        'HONK! HONK! The goose tilts its head, inspecting your satchel for breadcrumbs.',
        'A soft contented honk. It resumes floating peacefully across the ripple.',
      ];
      const curGooseIdx = propInspectIndexRef.current.GEESE % geeseLines.length;
      propInspectIndexRef.current.GEESE = (curGooseIdx + 1) % geeseLines.length;
      setOverworldDialogue({
        active: true,
        speakerName: 'GOOSE',
        text: geeseLines[curGooseIdx],
      });
      if (isFacingLandGoose && lg) {
        lg.facing = p.pxX > lg.pxX ? 'RIGHT' : 'LEFT';
        lg.state = 'IDLE';
        lg.stateTimer = 3.0;
      }
      if (isFacingWaterGoose && wg) {
        wg.facing = p.pxX > wg.pxX ? 'RIGHT' : 'LEFT';
        wg.state = 'DRIFT';
        wg.stateTimer = 3.5;
      }
      return;
    }

    // Check Milestone
    if (facingObj === HARBOR_TILES.MILESTONE || (facingX === 14 && facingY === 16) || (facingX === 13 && facingY === 16)) {
      gameAudio.playCrispClick();
      triggerHaptics(30);
      const milestoneLines = [
        "PARNASSUS: MILE 0. Chiseled into salt-pitted coastal granite.",
        "Carved below the numeral: 'As you set out for Ithaka, hope your road is a long one.'",
        "A single spear of summer grass grows from a crevice beside the Roman zero.",
      ];
      const curMileIdx = propInspectIndexRef.current.MILESTONE % milestoneLines.length;
      propInspectIndexRef.current.MILESTONE = (curMileIdx + 1) % milestoneLines.length;
      setOverworldDialogue({
        active: true,
        speakerName: 'MILESTONE',
        text: milestoneLines[curMileIdx],
      });
      return;
    }

    // Check Moored Sailboat
    if (
      facingObj === HARBOR_TILES.BOAT_TL ||
      facingObj === HARBOR_TILES.BOAT_TR ||
      facingObj === HARBOR_TILES.BOAT_BL ||
      facingObj === HARBOR_TILES.BOAT_BR ||
      (facingX <= 2 && facingY >= 21 && facingY <= 23)
    ) {
      gameAudio.playHoverMicroTone();
      triggerHaptics(30);
      const skiffLines = [
        'A sturdy wooden skiff moored to the pier post. The sails are furled tight.',
        'The hull bobs gently against the salt tide. Oars rest neatly beneath the thwart.',
        'Carved into the transom: “PASSAGE TO THE HEIGHTS”. Salt spray coats the wood.',
      ];
      const curSkiffIdx = propInspectIndexRef.current.SKIFF % skiffLines.length;
      propInspectIndexRef.current.SKIFF = (curSkiffIdx + 1) % skiffLines.length;
      setOverworldDialogue({
        active: true,
        speakerName: 'SKIFF',
        text: skiffLines[curSkiffIdx],
      });
      return;
    }

    // Check Cargo Crates on Pier & Beach
    if (
      facingObj === HARBOR_TILES.CRATE_STACK_TL ||
      facingObj === HARBOR_TILES.CRATE_STACK_TR ||
      facingObj === HARBOR_TILES.CRATE_STACK_BL ||
      facingObj === HARBOR_TILES.CRATE_STACK_BR
    ) {
      gameAudio.playPageTurn();
      triggerHaptics(30);
      const cratesLines = [
        "Rough pine crates stamped 'ROME BROTHERS PRINTERS — BROOKLYN, 1855' with brass corner plates.",
        "Inside the top crate: unbound green-cloth quarto volumes typeset by Whitman's own ink-stained thumbs.",
        "A shipping manifest pinned to the lid reads: 'Sandalwood, cedarwood, and sweet white wine.'",
      ];
      const curCrateIdx = propInspectIndexRef.current.CRATES % cratesLines.length;
      propInspectIndexRef.current.CRATES = (curCrateIdx + 1) % cratesLines.length;
      setOverworldDialogue({
        active: true,
        speakerName: 'CRATES',
        text: cratesLines[curCrateIdx],
      });
      return;
    }

    // Check Pier Mooring Posts & Coils of Rope
    if (
      currentScreenId === 'HARBOR' &&
      (facingObj === HARBOR_TILES.PIER_POST_TL ||
       facingObj === HARBOR_TILES.PIER_POST_BL ||
       facingObj === HARBOR_TILES.PIER_POST_TR ||
       facingObj === HARBOR_TILES.PIER_POST_BR ||
       facingObj === HARBOR_TILES.PIER_POST_MID ||
       ((facingY === 21 || facingY === 23) && (facingX === 2 || facingX === 5 || facingX === 8 || facingX === 11 || facingX === 15)))
    ) {
      gameAudio.playPageTurn();
      triggerHaptics(30);
      setOverworldDialogue({
        active: true,
        speakerName: 'MOORING BOLLARD',
        text: 'A sturdy weathered oak mooring post wrapped with salt-crusted coils of heavy hemp rope, wet from the sea spray.',
      });
      return;
    }

    // =========================================================================
    // CANTO I: EASTERN COVE MARITIME LANDMARKS INSPECTION HANDLERS
    // =========================================================================
    if (currentScreenId === 'HARBOR') {
      if (
        (facingX === 6 || facingX === 7) && facingY === 19
      ) {
        gameAudio.playFootstepWood();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: 'OVERTURNED SKIFF',
          text: 'A weathered pine skiff resting upside-down on the sandy berm, drying in the morning sun.',
        });
        return;
      }
      if ((facingX === 15 || facingX === 13 || facingX === 14) && (facingY === 19 || facingY === 18)) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: 'TRAIL SIGNPOST',
          text: '↑ Path to the Town Gate\n→ The Bight Boathouse & Lighthouse',
        });
        return;
      }
      if (
        facingObj === HARBOR_TILES.BARREL_WOOD ||
        ((facingX === 7 || facingX === 8) && (facingY === 18 || facingY === 19))
      ) {
        gameAudio.playFootstepWood();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: 'OAK CASK',
          text: 'Heavy round oak casks bound with dark iron hoops and brass bung plugs, smelling of salt spray, molasses, and aged cider.',
        });
        return;
      }

      const cavafyNpc = harborNpcsRef.current.find((n) => n.id === 'npc_cavafy' || n.poetId === 'CAVAFY');
      const isCavafyInside = cavafyNpc?.cavafyRoutine?.phase === 'INSIDE';

      const isBoathouseDoorway = (facingX === 26 && facingY === 19) || (p.gridX === 26 && p.gridY === 20 && p.dir === 'UP');
      const isLighthouseBeaconArea =
        ((facingX >= 31 && facingX <= 35) && (facingY >= 14 && facingY <= 20)) ||
        ((p.gridY === 19 || p.gridY === 20) && (p.gridX >= 32 && p.gridX <= 34) && p.dir === 'UP');

      // If Cavafy is inside, inspecting the lighthouse door or beacon:
      if (isCavafyInside && (isBoathouseDoorway || isLighthouseBeaconArea || ((facingX >= 26 && facingX <= 27) && (facingY === 19 || facingY === 20)))) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "LIGHTHOUSE DOOR",
          text: "The brass latch is warm. You can hear Cavafy upstairs tending the Fresnel lantern.",
          onComplete: () => {
            gameAudio.playCrispClick();
            setHarborNpcs((prev) =>
              prev.map((n) => {
                if (n.id === 'npc_cavafy' || n.poetId === 'CAVAFY') {
                  return {
                    ...n,
                    x: 27,
                    y: 20,
                    pxX: 26.5 * TILE_SIZE,
                    pxY: 19.5 * TILE_SIZE,
                    opacity: 1.0,
                    facing: 'DOWN',
                    walkStep: 0,
                    isMoving: false,
                    isInteracting: false,
                    cavafyRoutine: n.cavafyRoutine
                      ? {
                          ...n.cavafyRoutine,
                          phase: 'POST_EXIT_GAZE',
                          timer: 2.5,
                        }
                      : undefined,
                  };
                }
                return n;
              }),
            );
          },
        });
        return;
      }

      // 1. The Bight Boathouse Doorway at X: 26, Y: 19 (Facing UP from doorstep at Y: 20 or standing on doorway)
      if (isBoathouseDoorway) {
        transitionOverworldScreen('ROOM_BOATHOUSE', 7, 10, 'UP');
        return;
      }

      // 2. The Bight Boathouse Building Footprint at X: 24..29, Y: 16..19
      if (facingX >= 24 && facingX <= 29 && facingY >= 16 && facingY <= 19) {
        gameAudio.playCrispClick();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "THE BIGHT BOATHOUSE",
          text: "The Bight Boathouse: a weathered cedar sliphouse smelling of creosote, copper paint, and salt tide.",
        });
        return;
      }

      // 3. Timber Side-Dock with Brooklyn Cargo Crates at X: 22..23, Y: 17..18
      if ((facingX === 22 || facingX === 23) && (facingY === 17 || facingY === 18)) {
        gameAudio.playPageTurn();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "BROOKLYN CARGO CRATES",
          text: "Heavy cedar crates stacked on the side-dock stamped 'ROME BROTHERS PRINTERS — BROOKLYN, 1855' beside coils of tarred mooring hemp.",
        });
        return;
      }

      // 4. Crossing-Bar Lighthouse Beacon at X: 32..34, Y: 14..18 (inspectable from adjacent sand at Y: 19..20)
      if (
        ((facingX >= 31 && facingX <= 35) && (facingY >= 14 && facingY <= 20)) ||
        ((p.gridY === 19 || p.gridY === 20) && (p.gridX >= 32 && p.gridX <= 34) && p.dir === 'UP')
      ) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(30);
        setOverworldDialogue({
          active: true,
          speakerName: "CROSSING-BAR LIGHTHOUSE",
          text: "The Crossing-Bar Lighthouse Beacon pulsing with steady amber light across the shoals. 'Sunset and evening star, / And one clear call for me! / And may there be no moaning of the bar, / When I put out to sea.'",
        });
        return;
      }

      // 4.5 Upper Cove Meadow Pine Grove & Wildflowers at X: 31..35, Y: 10..14
      if (facingX >= 31 && facingX <= 35 && facingY >= 10 && facingY <= 14) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        setOverworldDialogue({
          active: true,
          speakerName: "UPPER COVE MEADOW",
          text: "Charming coastal pines with dark teal-green boughs and clusters of seaside lavender, sea pinks, and yellow poppies blooming among smooth grey granite rocks.",
        });
        return;
      }

      // (Shipwreck ribs & corked green bottle removed from Canto I)

      // 7. Jagged dark-granite rocky headland and shallow tidepools at X: 30..35, Y: 19..24
      if (facingX >= 30 && facingX <= 35 && facingY >= 19 && facingY <= 24) {
        gameAudio.playHoverMicroTone();
        triggerHaptics(25);
        setOverworldDialogue({
          active: true,
          speakerName: "ROCKY HEADLAND & TIDEPOOLS",
          text: "Jagged dark-granite sea rocks carved with shallow tidepools where limpets and sea-anemones cling to the salt stone.",
        });
        return;
      }
    }

    // Check Beach Marram Grass & Driftwood
    if (
      currentScreenId === 'HARBOR' &&
      (facingObj === HARBOR_TILES.CLIFFS_MARRAM_GRASS ||
       facingObj === HARBOR_TILES.CLIFFS_SEA_PINK ||
       facingObj === HARBOR_TILES.ROWBOAT_L ||
       facingObj === HARBOR_TILES.ROWBOAT_R ||
       (facingY >= 18 && facingY <= 20 && (facingX === 5 || facingX === 7 || facingX === 16 || facingX === 20)))
    ) {
      gameAudio.playHoverMicroTone();
      triggerHaptics(25);
      setOverworldDialogue({
        active: true,
        speakerName: 'COASTAL SHORE',
        text: 'Swaying sea-grass tufts and delicate pink sea-thrift blossoms growing between scattered sea shells and driftwood on the sand.',
      });
      return;
    }
  }, [activePlayerPoetId, capturedPoetIds, initBattle, promptPoetChoiceMenu, setHarborNpcs, setTownNpcs, setCliffsNpcs, setRuinsNpcs, setTreelineNpcs, setMountainGoatNpcs, setNightingaleNpcs, setLunchNpcs, setForgeNpcs, setBlueHouseNpcs, setKitchenNpcs, setGraveyardNpcs, setWhiteHouseNpcs, setHermitageNpcs, setSummitNpcs, setRentedRoomNpcs, setLyricSanctuaryNpcs, transitionOverworldScreen]);

  // Combat Move Resolution
  const resolveMoveImpact = useCallback(
    (move: PoemMove) => {
      soundtrackEngine.triggerSfxDucking(550, 0.50);
      const pPos = {x: 140, y: 245};
      const ePos = {x: 500, y: 95};
      const isPlayer = turnStageRef.current === 'MOVE_ANIMATING';

      const attackerPoet = isPlayer ? playerPoetRef.current : enemyPoetRef.current;
      const defenderPoet = isPlayer ? enemyPoetRef.current : playerPoetRef.current;

      const attackerSeason = attackerPoet.season;
      const defenderSeason = defenderPoet.season;
      const seasonMultiplier = calculateSeasonMultiplier(attackerSeason, defenderSeason);
      const isSuperEffective = seasonMultiplier >= 1.4;
      const isResisted = seasonMultiplier <= 0.8;

      const isAttackerBuffed = isPlayer ? playerBuffActiveRef.current : enemyBuffActiveRef.current;
      const isAttackerDebuffed = isPlayer ? playerDebuffActiveRef.current : enemyDebuffActiveRef.current;

      if (move.effectType === 'HEAL') {
        const healAmt = BATTLE_CONFIG.healAmount;
        if (isPlayer) {
          const maxHp = playerPoetRef.current.hp;
          const newHp = Math.min(maxHp, playerHpRef.current + healAmt);
          const healed = newHp - playerHpRef.current;
          setPlayerHp(newHp);
          playerHpRef.current = newHp;
          setLineupHpMap((prev) => ({ ...prev, [playerPoetRef.current.id]: newHp }));
          lineupHpMapRef.current[playerPoetRef.current.id] = newHp;
          gameAudio.playPowerupChime();
          spawnParticles(pPos.x, pPos.y, attackerPoet.secondaryColor, 22);
          addFloatingText(pPos.x, pPos.y - 20, `+${healed} HP`, '#059669', 16);
          setOutcomeNarration(`${attackerPoet.name} recited ${move.name}, recovering +${healed} HP!`);
        } else {
          const maxHp = enemyPoetRef.current.hp;
          const newHp = Math.min(maxHp, enemyHpRef.current + healAmt);
          const healed = newHp - enemyHpRef.current;
          setEnemyHp(newHp);
          enemyHpRef.current = newHp;
          gameAudio.playPowerupChime();
          spawnParticles(ePos.x, ePos.y, attackerPoet.secondaryColor, 22);
          addFloatingText(ePos.x, ePos.y - 20, `+${healed} HP`, '#059669', 16);
          setOutcomeNarration(`${attackerPoet.name} recited ${move.name}, recovering +${healed} HP!`);
        }
      } else if (move.effectType === 'BUFF') {
        const buffDur = BATTLE_CONFIG.buffDuration ?? 3;
        if (isPlayer) {
          setPlayerBuffActive(true);
          playerBuffActiveRef.current = true;
          setPlayerBuffTurns(buffDur);
          playerBuffTurnsRef.current = buffDur;
          gameAudio.playPowerupChime();
          addFloatingText(pPos.x, pPos.y - 20, `DAMAGE BUFF (1.35x)!`, '#3b82f6', 15);
        } else {
          setEnemyBuffActive(true);
          enemyBuffActiveRef.current = true;
          setEnemyBuffTurns(buffDur);
          enemyBuffTurnsRef.current = buffDur;
          gameAudio.playPowerupChime();
          addFloatingText(ePos.x, ePos.y - 20, `DAMAGE BUFF (1.35x)!`, '#3b82f6', 15);
        }
        setOutcomeNarration(`${attackerPoet.name}'s outgoing damage is boosted (1.35x) for 3 turns!`);
      } else if (move.effectType === 'DEBUFF') {
        const debuffDur = BATTLE_CONFIG.debuffDuration ?? 3;
        if (isPlayer) {
          setEnemyDebuffActive(true);
          enemyDebuffActiveRef.current = true;
          setEnemyDebuffTurns(debuffDur);
          enemyDebuffTurnsRef.current = debuffDur;
          gameAudio.playShieldBlock();
          addFloatingText(ePos.x, ePos.y - 20, `DAMAGE DEBUFF (0.70x)!`, '#ef4444', 15);
        } else {
          setPlayerDebuffActive(true);
          playerDebuffActiveRef.current = true;
          setPlayerDebuffTurns(debuffDur);
          playerDebuffTurnsRef.current = debuffDur;
          gameAudio.playShieldBlock();
          addFloatingText(pPos.x, pPos.y - 20, `DAMAGE DEBUFF (0.70x)!`, '#ef4444', 15);
        }
        setOutcomeNarration(`${defenderPoet.name}'s damage is reduced to 0.70x for 3 turns!`);
      } else if (move.effectType === 'STATUS') {
        if (isPlayer) {
          // Player applying STATUS to Enemy
          if (enemyStunTokensRef.current > 0 || enemyStunImmuneTurnsRef.current > 0) {
            gameAudio.playShieldBlock();
            addFloatingText(ePos.x, ePos.y - 25, `IMMUNE!`, '#8B5CF6', 15);
            setOutcomeNarration(`${enemyPoetRef.current.name} is immune to Lost for Words!`);
          } else {
            setEnemyStunTokens(1);
            enemyStunTokensRef.current = 1;
            setEnemyLostForWords(true);
            enemyLostForWordsRef.current = true;
            gameAudio.playHoverMicroTone();
            addFloatingText(ePos.x, ePos.y - 25, `LOST FOR WORDS!`, '#8B5CF6', 15);
            setOutcomeNarration(`${enemyPoetRef.current.name} is Lost for Words!`);
          }
        } else {
          // Enemy applying STATUS to Player
          enemyUsedStatusThisRoundRef.current = true;
          if (playerStunTokensRef.current > 0 || playerStunImmuneTurnsRef.current > 0) {
            gameAudio.playShieldBlock();
            addFloatingText(pPos.x, pPos.y - 25, `IMMUNE!`, '#8B5CF6', 15);
            setOutcomeNarration(`${playerPoetRef.current.name} is immune to Lost for Words!`);
          } else {
            setPlayerStunTokens(1);
            playerStunTokensRef.current = 1;
            setPlayerLostForWords(true);
            playerLostForWordsRef.current = true;
            gameAudio.playHoverMicroTone();
            addFloatingText(pPos.x, pPos.y - 25, `LOST FOR WORDS!`, '#8B5CF6', 15);
            setOutcomeNarration(`${playerPoetRef.current.name} is Lost for Words!`);
          }
        }
      } else {
        const baseDmg = move.effectType === 'HEAVY' ? BATTLE_CONFIG.heavyDamage : BATTLE_CONFIG.lightDamage;
        const totalDmg = calculateDamage(
          baseDmg,
          isAttackerBuffed,
          isAttackerDebuffed,
          seasonMultiplier,
        );

        if (isSuperEffective) {
          gameAudio.playSuperEffectiveImpact();
          screenShakeRef.current = 10;
        } else {
          gameAudio.playSwordClash();
          screenShakeRef.current = 6;
        }

        spawnParticles(isPlayer ? ePos.x : pPos.x, isPlayer ? ePos.y : pPos.y, attackerPoet.secondaryColor, 20);

        if (isPlayer) {
          const oldHp = enemyHpRef.current;
          const newHp = Math.max(0, oldHp - totalDmg);
          setEnemyHp(newHp);
          enemyHpRef.current = newHp;
          enemyFlashRef.current = 0.8;

          addFloatingText(ePos.x, ePos.y - 20, `-${totalDmg}`, '#dc2626', 18);
          if (isSuperEffective) addFloatingText(ePos.x, ePos.y - 45, 'SUPER EFFECTIVE! (1.5x)', '#d97706', 13);
          else if (isResisted) addFloatingText(ePos.x, ePos.y - 45, 'NOT VERY EFFECTIVE... (0.75x)', '#64748b', 13);

          if (newHp > 0 && newHp <= enemyMaxHp * 0.5 && oldHp > enemyMaxHp * 0.5) {
            setDialogueLines([`“${defenderPoet.dialogue.midFight}”`]);
            setOutcomeNarration(`${defenderPoet.name} responds with mid-fight determination!`);
          } else if (newHp <= 0) {
            setDialogueLines([`“${defenderPoet.dialogue.lose}”`]);
            setOutcomeNarration(`${defenderPoet.name} was defeated!`);
            soundtrackEngine.playVictoryFanfare();
          } else {
            setOutcomeNarration(`${attackerPoet.name}'s ${move.name} dealt ${totalDmg} damage!`);
          }
        } else {
          const newHp = Math.max(0, playerHpRef.current - totalDmg);
          setPlayerHp(newHp);
          playerHpRef.current = newHp;
          setLineupHpMap((prev) => ({ ...prev, [playerPoetRef.current.id]: newHp }));
          lineupHpMapRef.current[playerPoetRef.current.id] = newHp;
          playerFlashRef.current = 0.8;

          addFloatingText(pPos.x, pPos.y - 20, `-${totalDmg}`, '#dc2626', 18);
          if (isSuperEffective) addFloatingText(pPos.x, pPos.y - 45, 'SUPER EFFECTIVE! (1.5x)', '#d97706', 13);
          else if (isResisted) addFloatingText(pPos.x, pPos.y - 45, 'NOT VERY EFFECTIVE... (0.75x)', '#64748b', 13);

          if (newHp <= 0) {
            setDialogueLines([`${defenderPoet.name} was overwhelmed!`]);
            setOutcomeNarration(`${defenderPoet.name} fell in combat!`);
          } else {
            setOutcomeNarration(`${attackerPoet.name}'s ${move.name} dealt ${totalDmg} damage!`);
          }
        }
      }
    },
    [enemyMaxHp],
  );

  const executePlayerMove = useCallback((move: PoemMove) => {
    const curPoetId = activePlayerPoetId;
    const curReadings = poetReadingsMapRef.current[curPoetId]?.[move.id] ?? move.maxReadings;

    setPoetReadingsMap((prev) => ({
      ...prev,
      [curPoetId]: {
        ...prev[curPoetId],
        [move.id]: Math.max(0, curReadings - 1),
      },
    }));
    poetReadingsMapRef.current[curPoetId] = {
      ...poetReadingsMapRef.current[curPoetId],
      [move.id]: Math.max(0, curReadings - 1),
    };

    // Increment progressive cast count for this move
    const moveKey = `player_${curPoetId}_${move.id}`;
    const nextCount = (moveUsageMapRef.current[moveKey] || 0) + 1;
    moveUsageMapRef.current[moveKey] = nextCount;
    setMoveUsageMap((prev) => ({ ...prev, [moveKey]: nextCount }));

    const currentStanza = getMoveCurrentStanza(move, nextCount);
    const stanzaIdx = getMoveStanzaIndex(move, nextCount);
    setActiveVerseStanza(currentStanza);
    setActiveStanzaIndex(stanzaIdx);

    setActiveMove(move);

    gameAudio.playConfirmSelect();
    triggerHaptics(40);
    setDialogueLines([
      `${playerPoetRef.current.name.toUpperCase()} recited`,
      `${move.name}!`,
    ]);
    setOutcomeNarration('');
    verseStartTimeRef.current = Date.now();
    verseAnimTimerRef.current = 0;
    verseBypassedRef.current = false;
    setIsVerseBypassed(false);
    setTurnStage('MOVE_VERSE');
  }, [activePlayerPoetId]);

  const startEnemyTurn = useCallback(() => {
    soundtrackEngine.triggerSfxDucking(350, 0.88);
    const ePoet = enemyPoetRef.current;

    // Check if enemy has stun token to consume!
    if (enemyStunTokensRef.current > 0) {
      // Consume Stun Token: exactly 1 skipped action
      enemyStunTokensRef.current = 0;
      setEnemyStunTokens(0);
      enemyStunImmuneTurnsRef.current = 1;
      setEnemyStunImmuneTurns(1);
      enemyJustGainedImmunityThisRoundRef.current = true;
      enemySkippedByStunThisRoundRef.current = true;
      setEnemySkippedByStunThisRound(true);
      setEnemyLostForWords(false);
      enemyLostForWordsRef.current = false;

      enemyIntentMoveRef.current = null;
      setEnemyIntentMove(null);

      // Fast Stun (Player acted first via higher SPD in same round) vs Slow Stun (enemy had token from prior round)
      const isInterruptedInSameRound = !isEnemyLeadingTurnRef.current;
      const skipLog = isInterruptedInSameRound
        ? `${ePoet.name} is Lost for Words — their telegraphed stanza is interrupted!`
        : `${ePoet.name} is Lost for Words and cannot recite this turn.`;

      setDialogueLines([skipLog]);
      setOutcomeNarration(`${ePoet.name}'s action was skipped by Lost for Words!`);
      addFloatingText(500, 70, `SKIPPED!`, '#8B5CF6', 16);
      gameAudio.playHoverMicroTone();
      setTurnStage('ENEMY_OUTCOME');
      return;
    }

    const curReadings = enemyReadingsRef.current;
    // Recite the locked telegraphed move!
    const chosenMove = enemyIntentMoveRef.current || ePoet.moves[0];

    const remaining = Math.max(0, (curReadings[chosenMove.id] ?? chosenMove.maxReadings) - 1);
    setEnemyReadings((prev) => ({
      ...prev,
      [chosenMove.id]: remaining,
    }));
    enemyReadingsRef.current[chosenMove.id] = remaining;

    if (chosenMove.effectType === 'STATUS') {
      enemyUsedStatusThisRoundRef.current = true;
    }

    // Increment progressive cast count for this enemy move
    const moveKey = `enemy_${ePoet.id}_${chosenMove.id}`;
    const nextCount = (moveUsageMapRef.current[moveKey] || 0) + 1;
    moveUsageMapRef.current[moveKey] = nextCount;
    setMoveUsageMap((prev) => ({ ...prev, [moveKey]: nextCount }));

    const currentStanza = getMoveCurrentStanza(chosenMove, nextCount);
    const stanzaIdx = getMoveStanzaIndex(chosenMove, nextCount);
    setActiveVerseStanza(currentStanza);
    setActiveStanzaIndex(stanzaIdx);

    setActiveMove(chosenMove);
    setDialogueLines([
      `${ePoet.name.toUpperCase()} recited`,
      `${chosenMove.name}!`,
    ]);
    setOutcomeNarration('');
    verseStartTimeRef.current = Date.now();
    verseAnimTimerRef.current = 0;
    verseBypassedRef.current = false;
    setIsVerseBypassed(false);
    setTurnStage('ENEMY_VERSE');
    gameAudio.playHoverMicroTone();
  }, []);

  const startPlayerMove = (move: PoemMove) => {
    const curPoetId = activePlayerPoetId;
    const curReadings = poetReadingsMapRef.current[curPoetId]?.[move.id] ?? move.maxReadings;

    if (curReadings <= 0) {
      gameAudio.playErrorBuzz();
      triggerHaptics(60);
      addFloatingText(140, 220, `NO READINGS LEFT!`, '#ef4444', 15);
      return;
    }

    // Player UI Feedback: Prevent wasting one of the player's 2 Readings on an immune target
    if (move.effectType === 'STATUS') {
      if (enemyStunTokensRef.current > 0 || enemyStunImmuneTurnsRef.current > 0) {
        gameAudio.playErrorBuzz();
        triggerHaptics(60);
        addFloatingText(500, 70, `IMMUNE - 1 TURN!`, '#8B5CF6', 15);
        setOutcomeNarration(`${enemyPoetRef.current.name} is immune to Lost for Words!`);
        return;
      }
    }

    const playerSpd = playerPoetRef.current.spd;
    const enemySpd = enemyPoetRef.current.spd;
    const enemyIsFaster = enemySpd > playerSpd;

    if (enemyIsFaster) {
      // Enemy is faster: executes telegraphed move first in this round!
      isEnemyLeadingTurnRef.current = true;
      queuedPlayerMoveRef.current = move;
      startEnemyTurn();
    } else {
      // Player is faster or equal speed: player executes first in this round!
      isEnemyLeadingTurnRef.current = false;
      queuedPlayerMoveRef.current = null;
      executePlayerMove(move);
    }
  };

  const awardVictoryLoot = (isCaptured: boolean) => {
    if (isCaptured && !capturedPoetIds.includes(activeEnemyPoetId)) {
      setCapturedPoetIds((prev) => [...prev, activeEnemyPoetId]);
      setPlayerLineup((prev) => (prev.includes(activeEnemyPoetId) ? prev : [...prev, activeEnemyPoetId]));
    }

    if (selectedGameMode === 'GRAND_TOUR') {
      const nextIdx = grandTourCurrentIndex + 1;
      setGrandTourMaxUnlocked((prev) => Math.max(prev, nextIdx));
    }
  };

  // WAKE UP AT THE FOOT OF THE MOUNTAIN ON LOSS
  const handleClimbLoss = useCallback(() => {
    gameAudio.playDefeatMotif();
    gameAudio.playShoreWaveChime();
    setScreenCurtainAlpha(1);
    setIsTransitioningScreen(true);
    isTransitioningScreenRef.current = true;

    setTimeout(() => {
      // Clear battle transient state
      setPlayerBuffActive(false);
      playerBuffActiveRef.current = false;
      setEnemyBuffActive(false);
      enemyBuffActiveRef.current = false;
      setPlayerDebuffActive(false);
      playerDebuffActiveRef.current = false;
      setEnemyDebuffActive(false);
      enemyDebuffActiveRef.current = false;
      setPlayerLostForWords(false);
      playerLostForWordsRef.current = false;
      setEnemyLostForWords(false);
      enemyLostForWordsRef.current = false;

      setActiveMove(null);
      activeMoveRef.current = null;
      vfxRef.current.active = false;
      bookAnimRef.current.active = false;
      screenShakeRef.current = 0;
      particlesRef.current = [];
      floatingTextsRef.current = [];

      // Reset summit gauntlet bosses if summit duel loss
      const summitPoetIds = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'];
      setCapturedPoetIds((prev) => prev.filter((id) => !summitPoetIds.includes(id)));
      setPlayerLineup((prev) => prev.filter((id) => !summitPoetIds.includes(id)));
      summitNpcsRef.current = createFreshSummitNpcs();
      setSummitNpcsState(summitNpcsRef.current);
      rentedRoomNpcsRef.current = createFreshRentedRoomNpcs();
      setRentedRoomNpcsState(rentedRoomNpcsRef.current);
      lyricSanctuaryNpcsRef.current = createFreshLyricSanctuaryNpcs();
      setLyricSanctuaryNpcsState(lyricSanctuaryNpcsRef.current);
      cafeNpcsRef.current = createFreshCafeNpcs();
      setCafeNpcsState(cafeNpcsRef.current);
      shakespeareCoNpcsRef.current = createFreshShakespeareCoNpcs();
      setShakespeareCoNpcsState(shakespeareCoNpcsRef.current);

      // Restore all party members' HP to full (poet.hp = poet.maxHp)
      const restoredHp: Record<string, number> = {};
      for (const pId of playerLineupRef.current) {
        restoredHp[pId] = getPoetById(pId).hp;
      }
      setLineupHpMap(restoredHp);
      lineupHpMapRef.current = restoredHp;

      const initialReadings: Record<string, Record<string, number>> = {};
      for (const p of ALL_POETS) {
        initialReadings[p.id] = createInitialReadingsForPoet(p);
      }
      setPoetReadingsMap(initialReadings);
      poetReadingsMapRef.current = initialReadings;

      // Ensure active player poet is healthy and full HP
      const leadId = playerLineupRef.current[0] || 'WHITMAN';
      const leadPoet = getPoetById(leadId);
      setActivePlayerPoetId(leadPoet.id);
      playerPoetRef.current = leadPoet;
      activeLineupIndexRef.current = 0;
      setPlayerMaxHp(leadPoet.hp);
      setPlayerHp(leadPoet.hp);
      playerHpRef.current = leadPoet.hp;
      playerDisplayHpRef.current = leadPoet.hp;

      // Wake up at the foot of the mountain: Screen 0 (The Harbor), at coordinate (X: 4, Y: 22) on the pier boardwalk
      hasPlayerMovedRef.current = false;
      overworldPlayerRef.current = {
        gridX: 4,
        gridY: 22,
        pxX: 4 * TILE_SIZE,
        pxY: 22 * TILE_SIZE,
        dir: 'RIGHT',
        isMoving: false,
        moveProgress: 0,
        fromX: 4,
        fromY: 22,
        targetX: 4,
        targetY: 22,
        walkStep: 0,
        isGliding: false,
        glideVx: 0,
        glideVy: 0,
      };
      iceSkateTrailsRef.current = [];
      iceShimmerParticlesRef.current = [];
      lastIceFootPosRef.current = null;
      setActiveOverworldScreen('HARBOR');
      activeOverworldScreenRef.current = 'HARBOR';

      // Ensure the battle music cleanly switches back to Harbor ambient/music
      void soundtrackEngine.switchRoom('HARBOR', false);

      // Cleanly reset all lock flags right now so nothing blocks interaction
      setIsCinematicLocked(false);
      setIsTransitioningScreen(false);
      isTransitioningScreenRef.current = false;
      battleExitGraceUntilRef.current = 0;

      // Set gentle notification: "You awaken at the foot of Mount Parnassus to the sound of gentle waves..."
      setOverworldDialogue({
        active: true,
        speakerName: 'AWAKENING',
        text: 'You awaken at the foot of Mount Parnassus to the sound of gentle waves...',
      });

      setCurrentScreen('OVERWORLD');
      setGameState((prev) => ({
        ...prev,
        status: 'PLAYING',
      }));

      setTimeout(() => {
        setScreenCurtainAlpha(0);
        setCinematicCurtainAlpha(0);
        setIsTransitioningScreen(false);
        isTransitioningScreenRef.current = false;
        setIsCinematicLocked(false);
        setIsCinematicHudVisible(true);
        if (typeof window !== 'undefined') {
          window.focus();
        }
      }, 200);
    }, 400);
  }, []);

  const processTurnOutcome = useCallback(() => {
    if (enemyHpRef.current <= 0) {
      setCaptureMethod('DEFEATED');
      const hpBonus = playerHpRef.current * 30;
      const finalScore = 3000 + hpBonus;
      awardVictoryLoot(true);
      const recruitBark = DUELIST_BATTLE_BARKS[enemyPoetRef.current.id]?.recruited || enemyPoetRef.current.dialogue.captured || enemyPoetRef.current.dialogue.lose;
      const formattedRecruit = (recruitBark.startsWith('"') || recruitBark.startsWith('“')) ? recruitBark : `“${recruitBark}”`;
      setDialogueLines([formattedRecruit]);
      setOutcomeNarration(`${enemyPoetRef.current.name} was defeated and joined your Anthology!`);
      setGameState((prev) => ({...prev, status: 'VICTORY', score: prev.score + finalScore}));
      return;
    }

    if (playerHpRef.current <= 0) {
      const curLineup = playerLineupRef.current;
      const nextIndex = activeLineupIndexRef.current + 1;

      // Find next alive poet in lineup
      let foundNextAliveIndex = -1;
      for (let i = nextIndex; i < curLineup.length; i++) {
        const checkHp = lineupHpMapRef.current[curLineup[i]] ?? getPoetById(curLineup[i]).hp;
        if (checkHp > 0) {
          foundNextAliveIndex = i;
          break;
        }
      }

      if (foundNextAliveIndex !== -1) {
        activeLineupIndexRef.current = foundNextAliveIndex;
        const nextPoetId = curLineup[foundNextAliveIndex];
        const nextPoet = getPoetById(nextPoetId);

        setActivePlayerPoetId(nextPoet.id);
        playerPoetRef.current = nextPoet;

        const maxHp = nextPoet.hp;
        const savedHp = lineupHpMapRef.current[nextPoet.id] ?? maxHp;
        setPlayerMaxHp(maxHp);
        setPlayerHp(savedHp);
        playerHpRef.current = savedHp;
        playerDisplayHpRef.current = savedHp;

        setPlayerBuffActive(false);
        playerBuffActiveRef.current = false;
        setPlayerDebuffActive(false);
        playerDebuffActiveRef.current = false;
        setPlayerStunTokens(0);
        playerStunTokensRef.current = 0;
        setPlayerStunImmuneTurns(0);
        playerStunImmuneTurnsRef.current = 0;
        setPlayerLostForWords(false);
        playerLostForWordsRef.current = false;

        gameAudio.playPowerupChime();
        setDialogueLines([
          `Next poet in lineup steps in automatically:`,
          `${nextPoet.name.toUpperCase()}!`,
        ]);
        setOutcomeNarration(`${nextPoet.name} entered the duel automatically!`);
        setTurnStage('ACTIONS');
        return;
      }

      if (selectedGameMode === 'CLIMB') {
        handleClimbLoss();
        return;
      }

      const score = Math.max(100, Math.floor((100 - enemyHpRef.current) * 15));
      setGameState((prev) => ({...prev, status: 'GAME_OVER', score}));
      return;
    }

    // =========================================================================
    // ROUND-END IMMUNITY TICK-DOWN (after both combatants' actions resolved)
    // =========================================================================
    // Player immunity tick-down:
    if (playerStunImmuneTurnsRef.current > 0) {
      if (playerJustGainedImmunityThisRoundRef.current) {
        playerJustGainedImmunityThisRoundRef.current = false;
      } else {
        playerStunImmuneTurnsRef.current = 0;
        setPlayerStunImmuneTurns(0);
      }
    }

    // Enemy immunity tick-down:
    if (enemyStunImmuneTurnsRef.current > 0) {
      if (enemyJustGainedImmunityThisRoundRef.current) {
        enemyJustGainedImmunityThisRoundRef.current = false;
      } else {
        enemyStunImmuneTurnsRef.current = 0;
        setEnemyStunImmuneTurns(0);
      }
    }

    // AI Anti-Spam state transition
    enemyUsedStatusLastRoundRef.current = enemyUsedStatusThisRoundRef.current;
    enemyUsedStatusThisRoundRef.current = false;

    // Reset round-scoped skip flag
    enemySkippedByStunThisRoundRef.current = false;
    setEnemySkippedByStunThisRound(false);

    // Tick Buff / Debuff turns
    if (playerBuffTurnsRef.current > 0) {
      const next = playerBuffTurnsRef.current - 1;
      playerBuffTurnsRef.current = next;
      setPlayerBuffTurns(next);
      if (next === 0) {
        playerBuffActiveRef.current = false;
        setPlayerBuffActive(false);
      }
    }
    if (enemyBuffTurnsRef.current > 0) {
      const next = enemyBuffTurnsRef.current - 1;
      enemyBuffTurnsRef.current = next;
      setEnemyBuffTurns(next);
      if (next === 0) {
        enemyBuffActiveRef.current = false;
        setEnemyBuffActive(false);
      }
    }
    if (playerDebuffTurnsRef.current > 0) {
      const next = playerDebuffTurnsRef.current - 1;
      playerDebuffTurnsRef.current = next;
      setPlayerDebuffTurns(next);
      if (next === 0) {
        playerDebuffActiveRef.current = false;
        setPlayerDebuffActive(false);
      }
    }
    if (enemyDebuffTurnsRef.current > 0) {
      const next = enemyDebuffTurnsRef.current - 1;
      enemyDebuffTurnsRef.current = next;
      setEnemyDebuffTurns(next);
      if (next === 0) {
        enemyDebuffActiveRef.current = false;
        setEnemyDebuffActive(false);
      }
    }

    // Reset round execution state
    isEnemyLeadingTurnRef.current = false;
    queuedPlayerMoveRef.current = null;
    setActiveMove(null);
    setOutcomeNarration('');

    // Pre-round check: What if player is slow-stunned entering this round?
    if (playerStunTokensRef.current > 0) {
      setDialogueLines([
        `${playerPoetRef.current.name.toUpperCase()} is Lost for Words`,
        'and cannot recite this turn.',
      ]);
    } else {
      setDialogueLines(['What will', `${playerPoetRef.current.name.toUpperCase()} compose?`]);
    }

    calculateEnemyIntent();
    setTurnStage('ACTIONS');
  }, [handleClimbLoss, selectedGameMode, calculateEnemyIntent]);

  const startItemCapture = (item: BagItem) => {
    gameAudio.playConfirmSelect();
    triggerHaptics(50);

    setBagInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, count: Math.max(0, i.count - 1) } : i))
    );

    // Capture Window Bonus:
    // Maintain the <= 35% Max HP Blank Book capture threshold whenever enemy.stunTokens > 0
    // OR if the enemy's action was just skipped by "Lost for Words" during the current round.
    const inWindow = checkCaptureWindow(
      enemyHpRef.current,
      enemyPoetRef.current.hp,
      enemyStunTokensRef.current,
      enemySkippedByStunThisRoundRef.current
    );

    const captureMove: PoemMove = {
      id: 'ITEM_CAPTURE',
      name: item.name,
      tag: 'CAPTURE',
      poemTitle: 'Anthology Binding',
      effectType: 'STATUS',
      maxReadings: 99,
      powerLabel: 'BIND',
      descriptionShort: `Attempting to bind ${enemyPoetRef.current.name} into the Anthology!`,
      stanzas: [
        'A blank volume opens wide',
        'To catch the verses cast outside—',
      ],
      progressiveStanzas: [
        ['A blank volume opens wide', 'To catch the verses cast outside—'],
        ['Fresh black ink upon the leaf,', 'Binding every wonder, joy, and grief—'],
        ['The gilded clasp begins to turn,', 'As ancient lines of parchment burn—'],
        [`Will ${enemyPoetRef.current.name} consent within to dwell,`, 'Or let the rhythm break the spell?'],
      ],
      affinity: playerPoetRef.current.season,
    };

    const moveKey = 'player_item_capture';
    const nextCount = (moveUsageMapRef.current[moveKey] || 0) + 1;
    moveUsageMapRef.current[moveKey] = nextCount;
    setMoveUsageMap((prev) => ({ ...prev, [moveKey]: nextCount }));

    const currentStanza = getMoveCurrentStanza(captureMove, nextCount);
    const stanzaIdx = getMoveStanzaIndex(captureMove, nextCount);
    setActiveVerseStanza(currentStanza);
    setActiveStanzaIndex(stanzaIdx);

    setActiveMove(captureMove);
    setDialogueLines([
      `${playerPoetRef.current.name.toUpperCase()} used`,
      `${item.name}!`,
    ]);
    setOutcomeNarration(`Attempting to bind ${enemyPoetRef.current.name} into the Anthology...`);
    verseStartTimeRef.current = Date.now();
    verseAnimTimerRef.current = 0;
    verseBypassedRef.current = false;
    setIsVerseBypassed(false);
    setTurnStage('MOVE_VERSE');

    bookAnimRef.current = {
      active: false,
      startX: 140,
      startY: 245,
      targetX: 500,
      targetY: 95,
      currentX: 140,
      currentY: 245,
      progress: 0,
      phase: 'FLYING',
      wobbleTimer: 0,
      wobbleAngle: 0,
      success: inWindow,
      spriteKey: item.spriteKey || 'item_capture_book',
      itemName: item.name,
    };
  };

  const applyBagItem = (item: BagItem) => {
    if (item.count <= 0) {
      gameAudio.playErrorBuzz();
      triggerHaptics(60);
      return;
    }

    if (item.category === 'CAPTURE') {
      startItemCapture(item);
      return;
    }

    if (item.id === 'BLACK_INK_ELIXIR') {
      setBagInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, count: Math.max(0, i.count - 1) } : i))
      );
      const maxHp = playerPoetRef.current.hp;
      const nextHp = Math.min(maxHp, playerHpRef.current + 40);
      const healed = nextHp - playerHpRef.current;
      setPlayerHp(nextHp);
      playerHpRef.current = nextHp;
      playerDisplayHpRef.current = nextHp;
      setLineupHpMap((prev) => ({ ...prev, [playerPoetRef.current.id]: nextHp }));
      lineupHpMapRef.current[playerPoetRef.current.id] = nextHp;
      gameAudio.playPotionGulp();
      triggerHaptics([40, 70]);
      addFloatingText(140, 220, `+${healed} HP`, '#059669', 16);
      setDialogueLines([
        `${playerPoetRef.current.name.toUpperCase()} drank`,
        `${item.name} (+${healed} HP)!`,
      ]);
      setOutcomeNarration(`${playerPoetRef.current.name} recovered +${healed} HP from ${item.name}!`);
      setTurnStage('MOVE_OUTCOME');
      return;
    }

    if (item.id === 'INSPIRATION_TEA') {
      setBagInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, count: Math.max(0, i.count - 1) } : i))
      );
      const curPoetId = activePlayerPoetId;
      setPoetReadingsMap((prev) => {
        const poetMoves = playerPoetRef.current.moves;
        const updated: Record<string, number> = { ...(prev[curPoetId] || {}) };
        for (const m of poetMoves) {
          updated[m.id] = Math.min(m.maxReadings, (updated[m.id] ?? m.maxReadings) + 1);
        }
        return { ...prev, [curPoetId]: updated };
      });
      poetReadingsMapRef.current[curPoetId] = {
        ...(poetReadingsMapRef.current[curPoetId] || {}),
      };
      for (const m of playerPoetRef.current.moves) {
        poetReadingsMapRef.current[curPoetId][m.id] = Math.min(
          m.maxReadings,
          (poetReadingsMapRef.current[curPoetId][m.id] ?? m.maxReadings) + 1
        );
      }
      gameAudio.playPowerupChime();
      triggerHaptics([40, 80]);
      addFloatingText(140, 220, `+1 READINGS!`, '#3B82F6', 15);
      setDialogueLines([
        `${playerPoetRef.current.name.toUpperCase()} sipped`,
        `${item.name} (+1 Readings)!`,
      ]);
      setOutcomeNarration(`${playerPoetRef.current.name} restored +1 Readings to all moves!`);
      setTurnStage('MOVE_OUTCOME');
      return;
    }
  };

  // Gracefully exit battle from running/fleeing
  const exitBattleFromRun = useCallback(() => {
    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
      runTimeoutRef.current = null;
    }
    isFleeingRef.current = false;
    battleExitGraceUntilRef.current = Date.now() + 2000;

    setScreenCurtainAlpha(1);
    setIsTransitioningScreen(true);

    setTimeout(() => {
      // Clear battle transient state
      setPlayerBuffActive(false);
      playerBuffActiveRef.current = false;
      setEnemyBuffActive(false);
      enemyBuffActiveRef.current = false;
      setPlayerDebuffActive(false);
      playerDebuffActiveRef.current = false;
      setEnemyDebuffActive(false);
      enemyDebuffActiveRef.current = false;
      setPlayerLostForWords(false);
      playerLostForWordsRef.current = false;
      setEnemyLostForWords(false);
      enemyLostForWordsRef.current = false;

      setActiveMove(null);
      activeMoveRef.current = null;
      vfxRef.current.active = false;
      bookAnimRef.current.active = false;
      screenShakeRef.current = 0;
      particlesRef.current = [];
      floatingTextsRef.current = [];

      // Restore health & readings for non-summit duel
      const restoredHp: Record<string, number> = {};
      for (const pId of playerLineupRef.current) {
        restoredHp[pId] = getPoetById(pId).hp;
      }
      setLineupHpMap(restoredHp);
      lineupHpMapRef.current = restoredHp;

      const initialReadings: Record<string, Record<string, number>> = {};
      for (const p of ALL_POETS) {
        initialReadings[p.id] = createInitialReadingsForPoet(p);
      }
      setPoetReadingsMap(initialReadings);
      poetReadingsMapRef.current = initialReadings;

      if (playerPoetRef.current) {
        setPlayerHp(playerPoetRef.current.hp);
        playerHpRef.current = playerPoetRef.current.hp;
        playerDisplayHpRef.current = playerPoetRef.current.hp;
      }

      if (selectedGameMode === 'CLIMB') {
        const p = overworldPlayerRef.current;
        let newGridX = p.gridX;
        let newGridY = p.gridY;
        let newDir: FacingDirection = p.dir;

        // Turn player away from opponent so they are oriented to walk freely
        if (p.dir === 'UP') newDir = 'DOWN';
        else if (p.dir === 'DOWN') newDir = 'UP';
        else if (p.dir === 'LEFT') newDir = 'RIGHT';
        else if (p.dir === 'RIGHT') newDir = 'LEFT';

        // Check if a retreat step back is walkable
        let backX = p.gridX;
        let backY = p.gridY;
        if (p.dir === 'UP') backY += 1;
        else if (p.dir === 'DOWN') backY -= 1;
        else if (p.dir === 'LEFT') backX += 1;
        else if (p.dir === 'RIGHT') backX -= 1;

        const curScreen = activeOverworldScreenRef.current;
        const isInterior =
          curScreen === 'CAFE_DE_FLORE' ||
          curScreen === 'ROOM_CAFE_DE_FLORE' ||
          curScreen === 'SHAKESPEARE_CO' ||
          curScreen === 'ROOM_SHAKESPEARE_CO' ||
          curScreen === 'ROOM_BOATHOUSE' ||
          curScreen === 'BOATHOUSE' ||
          curScreen === 'LYRIC_SANCTUARY' ||
          curScreen === 'RENTED_ROOM' ||
          curScreen === 'HERMITAGE' ||
          curScreen === 'WHITE_HOUSE' ||
          curScreen === 'GRAVEYARD' ||
          curScreen === 'KITCHEN' ||
          curScreen === 'LIBRARY' ||
          curScreen === 'NIGHTINGALE' ||
          curScreen === 'LUNCH_COUNTER' ||
          curScreen === 'FORGE' ||
          curScreen === 'BLUE_HOUSE' ||
          curScreen === 'MOUNTAIN_GOAT';
        const maxCols = isInterior ? 16 : HARBOR_COLS;
        const maxRows = isInterior ? 12 : HARBOR_ROWS;

        if (backX >= 0 && backX < maxCols && backY >= 0 && backY < maxRows) {
          newGridX = backX;
          newGridY = backY;
        }

        overworldPlayerRef.current = {
          gridX: newGridX,
          gridY: newGridY,
          pxX: newGridX * TILE_SIZE,
          pxY: newGridY * TILE_SIZE,
          dir: newDir,
          isMoving: false,
          moveProgress: 0,
          fromX: newGridX,
          fromY: newGridY,
          targetX: newGridX,
          targetY: newGridY,
          walkStep: 0,
          isGliding: false,
          glideVx: 0,
          glideVy: 0,
        };
        iceSkateTrailsRef.current = [];
        iceShimmerParticlesRef.current = [];
        lastIceFootPosRef.current = null;

        const resetNpc = (n: HarborNPC) => ({
          ...n,
          isInteracting: false,
          movement: n.movement
            ? {
                ...n.movement,
                pauseTimer:
                  n.id === 'npc_lunch_stevens'
                    ? 3.5 + Math.random() * 1.5
                    : n.id === 'npc_lunch_ohara'
                    ? 3.0 + Math.random() * 1.5
                    : n.id === 'npc_lunch_wcw'
                    ? 3.5 + Math.random() * 1.5
                    : 2.5,
              }
            : undefined,
        });

        harborNpcsRef.current = harborNpcsRef.current.map((n) => ({
          ...resetNpc(n),
          facing: n.id === 'npc_darwish' || n.poetId === 'DARWISH' ? 'DOWN' : (n.id === 'npc_mary_oliver' || n.poetId === 'MARY_OLIVER') ? 'UP' : (n.id === 'npc_cavafy' || n.poetId === 'CAVAFY') ? 'DOWN' : n.facing,
        }));
        townNpcsRef.current = townNpcsRef.current.map(resetNpc);
        cliffsNpcsRef.current = cliffsNpcsRef.current.map(resetNpc);
        ruinsNpcsRef.current = ruinsNpcsRef.current.map(resetNpc);
        treelineNpcsRef.current = treelineNpcsRef.current.map(resetNpc);
        nightingaleNpcsRef.current = nightingaleNpcsRef.current.map((n) => {
          let restoreFacing = n.facing;
          if (n.id === 'npc_nightingale_hughes' || n.poetId === 'HUGHES') {
            restoreFacing = 'DOWN';
          } else if (n.id === 'npc_nightingale_dylan' || n.poetId === 'DYLAN_THOMAS') {
            restoreFacing = 'UP';
          }
          return {
            ...resetNpc(n),
            facing: restoreFacing,
          };
        });
        lunchNpcsRef.current = lunchNpcsRef.current.map(resetNpc);
        forgeNpcsRef.current = forgeNpcsRef.current.map(resetNpc);
        blueHouseNpcsRef.current = blueHouseNpcsRef.current.map(resetNpc);
        mountainGoatNpcsRef.current = mountainGoatNpcsRef.current.map(resetNpc);
        libraryNpcsRef.current = libraryNpcsRef.current.map(resetNpc);
        kitchenNpcsRef.current = kitchenNpcsRef.current.map(resetNpc);
        graveyardNpcsRef.current = graveyardNpcsRef.current.map(resetNpc);
        whiteHouseNpcsRef.current = whiteHouseNpcsRef.current.map(resetNpc);
        hermitageNpcsRef.current = hermitageNpcsRef.current.map(resetNpc);
        summitNpcsRef.current = summitNpcsRef.current.map(resetNpc);
        rentedRoomNpcsRef.current = rentedRoomNpcsRef.current.map((n) => ({
          ...resetNpc(n),
          facing:
            n.id === 'baudelaire' || n.poetId === 'baudelaire' || n.poetId === 'BAUDELAIRE'
              ? 'RIGHT'
              : n.facing,
        }));
        lyricSanctuaryNpcsRef.current = lyricSanctuaryNpcsRef.current.map(resetNpc);
        cafeNpcsRef.current = cafeNpcsRef.current.map(resetNpc);
        shakespeareCoNpcsRef.current = shakespeareCoNpcsRef.current.map(resetNpc);

        setOverworldDialogue(null);
        setCurrentScreen('OVERWORLD');
        void soundtrackEngine.switchRoom(activeOverworldScreenRef.current, false);
        setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
      } else if (selectedGameMode === 'GRAND_TOUR') {
        setCurrentScreen('GRAND_TOUR_MAP');
        setGameState((prev) => ({ ...prev, status: 'START' }));
      } else {
        setCurrentScreen('FREE_DUEL_SELECT');
        setGameState((prev) => ({ ...prev, status: 'START' }));
      }

      setTimeout(() => {
        setScreenCurtainAlpha(0);
        setIsTransitioningScreen(false);
        isTransitioningScreenRef.current = false;
        setIsCinematicLocked(false);
        setCinematicCurtainAlpha(0);
        setIsCinematicHudVisible(true);
        if (typeof window !== 'undefined') {
          window.focus();
        }
      }, 150);
    }, 200);
  }, [selectedGameMode]);

  const handleRun = useCallback(() => {
    // Only block running if it is a true final climactic battle (Shakespeare or Dante on The Summit)
    const isFinalClimaxBattle =
      activeEnemyPoetId === 'SHAKESPEARE' || activeEnemyPoetId === 'DANTE';

    if (isFinalClimaxBattle) {
      gameAudio.playErrorBuzz();
      triggerHaptics(60);
      setDialogueLines([
        'Cannot flee the final',
        'theatrical summit!',
      ]);
      setTurnStage('RUN_ATTEMPT');
      return;
    }

    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
      runTimeoutRef.current = null;
    }

    isFleeingRef.current = true;
    gameAudio.playHoverMicroTone();
    triggerHaptics([30, 40]);
    setDialogueLines([
      'You bowed respectfully and stepped',
      'away from the verse recital.',
    ]);
    setOutcomeNarration('You fled from the poetic duel!');
    setTurnStage('RUN_ATTEMPT');

    // Auto-complete exit after delay if user does not click/advance
    runTimeoutRef.current = window.setTimeout(() => {
      if (turnStageRef.current === 'RUN_ATTEMPT' && isFleeingRef.current) {
        exitBattleFromRun();
      }
    }, 1600);
  }, [activeEnemyPoetId, exitBattleFromRun]);

  const advanceTurn = useCallback(
    (isManualSkip = true) => {
      if (
        turnStageRef.current === 'MOVE_ANIMATING' ||
        turnStageRef.current === 'ENEMY_ANIMATING'
      ) {
        return;
      }

      const totalChars = dialogueLines.join(' ').length;
      if (displayedChars < totalChars && isManualSkip) {
        setDisplayedChars(totalChars);
        gameAudio.playCrispClick();
        return;
      }

      if (isManualSkip) {
        gameAudio.playCrispClick();
      }

      if (turnStageRef.current === 'INTRO_APPEAR') {
        const pPoet = playerPoetRef.current;
        if (preBattleDialogueIndexRef.current === 0) {
          setPreBattleDialogueIndex(1);
          preBattleDialogueIndexRef.current = 1;
          setDialogueLines([`“${pPoet.dialogue.preFight}”`]);
          gameAudio.playCrispClick();
        } else {
          setDialogueLines([`Begin match, ${playerPoetRef.current.name.toUpperCase()}!`]);
          setTurnStage('INTRO_SEND_OUT');
          gameAudio.playPowerupChime();
        }
      } else if (turnStageRef.current === 'INTRO_SEND_OUT') {
        setDialogueLines(['What will', `${playerPoetRef.current.name.toUpperCase()} compose?`]);
        calculateEnemyIntent();
        setTurnStage('ACTIONS');
      } else if (turnStageRef.current === 'RUN_ATTEMPT') {
        if (isFleeingRef.current) {
          exitBattleFromRun();
        } else {
          setActiveMove(null);
          setOutcomeNarration('');
          setDialogueLines(['What will', `${playerPoetRef.current.name.toUpperCase()} compose?`]);
          calculateEnemyIntent();
          setTurnStage('ACTIONS');
        }
      } else if (
        turnStageRef.current === 'POET_INFO' ||
        turnStageRef.current === 'TURN_STATUS_PROCESS'
      ) {
        setActiveMove(null);
        setOutcomeNarration('');
        setDialogueLines(['What will', `${playerPoetRef.current.name.toUpperCase()} compose?`]);
        calculateEnemyIntent();
        setTurnStage('ACTIONS');
      } else if (turnStageRef.current === 'MASTERPIECE_CINEMATIC') {
        const isPlayer = cinematicPoetName === playerPoetRef.current.name;
        if (isPlayer && activeMoveRef.current) {
          playerLungeXRef.current = 32;
          playerLungeYRef.current = -16;
          setDialogueLines([
            `${playerPoetRef.current.name.toUpperCase()} recited`,
            `${activeMoveRef.current.name}!`,
          ]);
          setTurnStage('MOVE_ANIMATING');
          vfxRef.current = {
            active: true,
            type: activeMoveRef.current.id,
            timer: 0,
            duration: 1.6,
            isPlayerAttacking: true,
            resolved: false,
            isMasterpiece: true,
          };
          gameAudio.playChiptuneExplosion();
        } else if (activeMoveRef.current) {
          enemyLungeXRef.current = -32;
          enemyLungeYRef.current = 16;
          setDialogueLines([
            `${enemyPoetRef.current.name.toUpperCase()} recited`,
            `${activeMoveRef.current.name}!`,
          ]);
          setTurnStage('ENEMY_ANIMATING');
          vfxRef.current = {
            active: true,
            type: activeMoveRef.current.id,
            timer: 0,
            duration: 1.6,
            isPlayerAttacking: false,
            resolved: false,
            isMasterpiece: true,
          };
          gameAudio.playChiptuneExplosion();
        }
      } else if (turnStageRef.current === 'MOVE_VERSE') {
        if (activeMoveRef.current) {
          if (activeMoveRef.current.id === 'ITEM_CAPTURE') {
            bookAnimRef.current.active = true;
            bookAnimRef.current.progress = 0;
            bookAnimRef.current.phase = 'FLYING';
            vfxRef.current = {
              active: true,
              type: 'BOOK_CAPTURE',
              spriteKey: bookAnimRef.current.spriteKey || 'item_capture_book',
              timer: 0,
              duration: 2.2,
              isPlayerAttacking: true,
              resolved: false,
            };
            gameAudio.playArcadeLaser();

            setTimeout(() => {
              bookAnimRef.current.phase = 'WOBBLE_1';
              gameAudio.playCrispClick();
              triggerHaptics(30);

              setTimeout(() => {
                bookAnimRef.current.phase = 'WOBBLE_2';
                gameAudio.playCrispClick();
                triggerHaptics(35);
                screenShakeRef.current = 3;

                setTimeout(() => {
                  bookAnimRef.current.phase = 'WOBBLE_3';
                  gameAudio.playCrispClick();
                  triggerHaptics(40);
                  screenShakeRef.current = 5;
                }, 600);
              }, 600);
            }, 700);
          } else {
            playerLungeXRef.current = 28;
            playerLungeYRef.current = -14;
            vfxRef.current = {
              active: true,
              type: activeMoveRef.current.id,
              timer: 0,
              duration: 1.5,
              isPlayerAttacking: true,
              resolved: false,
            };
            gameAudio.playSwordClash();
          }

          setDialogueLines([
            `${playerPoetRef.current.name.toUpperCase()} recited`,
            `${activeMoveRef.current.name}!`,
          ]);
          setTurnStage('MOVE_ANIMATING');
        }
      } else if (turnStageRef.current === 'ENEMY_VERSE') {
        if (activeMoveRef.current) {
          enemyLungeXRef.current = -28;
          enemyLungeYRef.current = 14;
          setDialogueLines([
            `${enemyPoetRef.current.name.toUpperCase()} recited`,
            `${activeMoveRef.current.name}!`,
          ]);
          setTurnStage('ENEMY_ANIMATING');
          vfxRef.current = {
            active: true,
            type: activeMoveRef.current.id,
            timer: 0,
            duration: 1.5,
            isPlayerAttacking: false,
            resolved: false,
          };
          gameAudio.playSwordClash();
        }
      } else if (turnStageRef.current === 'MOVE_OUTCOME') {
        if (activeMoveRef.current?.id === 'ITEM_CAPTURE') {
          if (bookAnimRef.current.success) {
            setCaptureMethod('CAPTURED');
            const hpBonus = playerHpRef.current * 45;
            const finalScore = 5000 + hpBonus;
            awardVictoryLoot(true);
            setGameState((prev) => ({
              ...prev,
              status: 'VICTORY',
              score: prev.score + finalScore,
            }));
            return;
          } else {
            if (isEnemyLeadingTurnRef.current) {
              isEnemyLeadingTurnRef.current = false;
              processTurnOutcome();
            } else {
              startEnemyTurn();
            }
            return;
          }
        }

        if (enemyHpRef.current <= 0) {
          setCaptureMethod('DEFEATED');
          const hpBonus = playerHpRef.current * 30;
          const finalScore = 3000 + hpBonus;
          awardVictoryLoot(true);
          const recruitBark = DUELIST_BATTLE_BARKS[enemyPoetRef.current.id]?.recruited || enemyPoetRef.current.dialogue.captured || enemyPoetRef.current.dialogue.lose;
          const formattedRecruit = (recruitBark.startsWith('"') || recruitBark.startsWith('“')) ? recruitBark : `“${recruitBark}”`;
          setDialogueLines([formattedRecruit]);
          setOutcomeNarration(`${enemyPoetRef.current.name} was defeated and joined your Anthology!`);
          setGameState((prev) => ({
            ...prev,
            status: 'VICTORY',
            score: prev.score + finalScore,
          }));
          return;
        }

        // Check if enemy already led this turn
        if (isEnemyLeadingTurnRef.current) {
          isEnemyLeadingTurnRef.current = false;
          queuedPlayerMoveRef.current = null;
          processTurnOutcome();
        } else {
          startEnemyTurn();
        }
      } else if (turnStageRef.current === 'ENEMY_OUTCOME') {
        // If enemy was leading this turn (Slot 1) and queued player move exists (Slot 2)
        if (isEnemyLeadingTurnRef.current && queuedPlayerMoveRef.current) {
          const queuedMove = queuedPlayerMoveRef.current;
          queuedPlayerMoveRef.current = null;

          if (playerHpRef.current <= 0) {
            isEnemyLeadingTurnRef.current = false;
            processTurnOutcome();
          } else if (playerStunTokensRef.current > 0) {
            // Player has stun token! Consume it!
            playerStunTokensRef.current = 0;
            setPlayerStunTokens(0);
            playerStunImmuneTurnsRef.current = 1;
            setPlayerStunImmuneTurns(1);
            playerJustGainedImmunityThisRoundRef.current = true;
            setPlayerLostForWords(false);
            playerLostForWordsRef.current = false;

            // Fast Stun (Enemy acted first and landed STATUS earlier in same round)
            const skipLog = `${playerPoetRef.current.name} is Lost for Words — their telegraphed stanza is interrupted!`;
            setDialogueLines([skipLog]);
            setOutcomeNarration(`${playerPoetRef.current.name}'s action was skipped by Lost for Words!`);
            addFloatingText(140, 220, `SKIPPED!`, '#8B5CF6', 16);
            gameAudio.playHoverMicroTone();
            setTurnStage('MOVE_OUTCOME');
          } else {
            executePlayerMove(queuedMove);
          }
        } else {
          isEnemyLeadingTurnRef.current = false;
          queuedPlayerMoveRef.current = null;
          processTurnOutcome();
        }
      }
    },
    [
      cinematicPoetName,
      dialogueLines,
      displayedChars,
      exitBattleFromRun,
      processTurnOutcome,
      startEnemyTurn,
      calculateEnemyIntent,
      executePlayerMove,
    ],
  );

  usePlaygroundGameLifecycle(gameState, sdk);

  // Auto-dismiss awakening notification after 2.5s with clean unlocking
  useEffect(() => {
    if (overworldDialogue?.active && overworldDialogue.speakerName === 'AWAKENING') {
      const timer = window.setTimeout(() => {
        if (overworldDialogueRef.current?.active && overworldDialogueRef.current.speakerName === 'AWAKENING') {
          dismissAwakeningOrDialogue();
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [overworldDialogue?.active, overworldDialogue?.speakerName, dismissAwakeningOrDialogue]);

  // Seamless auto-advance during verse recital (3.5s) for smooth combat pacing
  useEffect(() => {
    if (currentScreen === 'BATTLE' && (turnStage === 'MOVE_VERSE' || turnStage === 'ENEMY_VERSE')) {
      const timer = window.setTimeout(() => {
        if (turnStageRef.current === 'MOVE_VERSE' || turnStageRef.current === 'ENEMY_VERSE') {
          advanceTurn(false);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, turnStage, advanceTurn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      lastInputTimeRef.current = Date.now();
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMusicMute();
        return;
      }
      if (currentScreen === 'OVERWORLD') {
        const isConfirmKey =
          e.code === 'Space' ||
          e.key === ' ' ||
          e.key === 'Space' ||
          e.key === 'Spacebar' ||
          e.code === 'Enter' ||
          e.key === 'Enter' ||
          e.code === 'KeyE' ||
          e.key === 'e' ||
          e.key === 'E' ||
          e.code === 'KeyZ' ||
          e.key === 'z' ||
          e.key === 'Z';

        const isDismissKey =
          isConfirmKey ||
          e.code === 'Escape' ||
          e.key === 'Escape' ||
          e.code === 'KeyX' ||
          e.key === 'x' ||
          e.key === 'X';

        // Awakening / dialogue dismissal can be triggered by Space, Enter, Z, Escape, X, E even if locked
        if (overworldDialogueRef.current?.active) {
          if (!overworldDialogueRef.current.showChoiceMenu) {
            if (isDismissKey) {
              e.preventDefault();
              dismissAwakeningOrDialogue();
              return;
            }
          } else if (overworldDialogueRef.current.choiceOptions) {
            const opts = overworldDialogueRef.current.choiceOptions;
            if (
              isConfirmKey ||
              e.key === '1' ||
              e.key === 't' ||
              e.key === 'T'
            ) {
              e.preventDefault();
              opts.find((o) => o.label === 'TALK')?.action();
              return;
            }
            if ((e.key === '2' && opts.some((o) => o.label === 'DUEL')) || e.key === 'd' || e.key === 'D') {
              e.preventDefault();
              opts.find((o) => o.label === 'DUEL')?.action();
              return;
            }
            if (e.key === 'j' || e.key === 'J' || (e.key === '3' && opts.some((o) => o.label === 'JOIN'))) {
              e.preventDefault();
              opts.find((o) => o.label === 'JOIN')?.action();
              return;
            }
            if (
              e.key === '4' ||
              (e.key === '3' && !opts.some((o) => o.label === 'JOIN')) ||
              (e.key === '2' && !opts.some((o) => o.label === 'DUEL')) ||
              e.key === 'l' ||
              e.key === 'L' ||
              e.key === 'Escape' ||
              e.key === 'x' ||
              e.key === 'X'
            ) {
              e.preventDefault();
              opts.find((o) => o.label === 'LEAVE')?.action();
              return;
            }
          }
        }

        if (isConfirmKey) {
          e.preventDefault();
          if (isSpringMenuOpen) {
            const targetId = capturedPoetIds[selectedSpringPoetIndexRef.current];
            if (targetId) chooseSpringPoet(targetId);
          } else if (endingStage !== 'IDLE' && endingStage !== 'READING_TRANSITION' && endingStage !== 'BLACKOUT_WAIT') {
            advanceEndingSequence();
          } else {
            interactFacingTile();
          }
          return;
        }
      }
      if (currentScreen === 'BATTLE') {
        if (turnStageRef.current === 'FIGHT_MOVES') {
          const keyNum = parseInt(e.key, 10);
          if (keyNum >= 1 && keyNum <= 4) {
            const moveIdx = keyNum - 1;
            const targetMove = playerPoetRef.current.moves[moveIdx];
            if (targetMove) {
              e.preventDefault();
              setSelectedMoveIndex(moveIdx);
              startPlayerMove(targetMove);
            }
          }
        } else if (turnStageRef.current === 'ACTIONS') {
          if (e.key === '1') {
            e.preventDefault();
            gameAudio.playConfirmSelect();
            setSelectedMoveIndex(0);
            setTurnStage('FIGHT_MOVES');
          } else if (e.key === '2') {
            e.preventDefault();
            gameAudio.playConfirmSelect();
            setSelectedBagIndex(0);
            setTurnStage('BAG_MENU');
          } else if (e.key === '3') {
            e.preventDefault();
            gameAudio.playConfirmSelect();
            setCurrentScreen('ANTHOLOGY');
          } else if (e.key === '4' || e.key === 'r' || e.key === 'R' || e.key === 'Escape') {
            e.preventDefault();
            handleRun();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, toggleMusicMute]);

  // --- OVERWORLD STEP UPDATE ---
  const updateOverworld = (dt: number) => {
    animTimeRef.current += dt;
    const p = overworldPlayerRef.current;
    const isDialogueOpen = Boolean(overworldDialogueRef.current?.active) || isSpringMenuOpen || (endingStage !== 'IDLE' && endingStage !== 'READING_TRANSITION');
    const curScreenId = activeOverworldScreenRef.current;

    // Decrement active snow burst timer in ref directly (avoids 60 FPS state updates)
    if (snowBurstTimerRef.current > 0) {
      snowBurstTimerRef.current = Math.max(0, snowBurstTimerRef.current - dt);
    }

    // Waiting by the Bare Tree: Stand still for 10s in Canto V (Treeline) near boundary wall (Y: 6..9, X <= 9)
    if (curScreenId === 'TREELINE') {
      const inIdleZone = p.gridX <= 9 && p.gridY >= 6 && p.gridY <= 9;
      if (treelineIdleTriggeredRef.current) {
        if (treelineTriggerPosRef.current) {
          const dist = Math.hypot(p.gridX - treelineTriggerPosRef.current.x, p.gridY - treelineTriggerPosRef.current.y);
          if (dist >= 3) {
            treelineIdleTriggeredRef.current = false;
            treelineTriggerPosRef.current = null;
            lastInputTimeRef.current = Date.now();
          }
        }
      } else if (inIdleZone && !p.isMoving && !p.isGliding && !isDialogueOpen && endingStage === 'IDLE') {
        const idleDuration = (Date.now() - lastInputTimeRef.current) / 1000;
        if (idleDuration >= 10.0) {
          treelineIdleTriggeredRef.current = true;
          treelineTriggerPosRef.current = { x: p.gridX, y: p.gridY };
          gameAudio.playHoverMicroTone();
          setOverworldDialogue({
            active: true,
            speakerName: "WAITING",
            text: "Nothing happens. Nobody comes, nobody goes. The mountain wind is awfully quiet.",
          });
        }
      } else if (!inIdleZone || p.isMoving) {
        lastInputTimeRef.current = Date.now();
      }
    } else {
      treelineIdleTriggeredRef.current = false;
      treelineTriggerPosRef.current = null;
    }

    // 0. ADVANCE DISSOLVING NPCS (FAREWELL DISSOLVE OVER 450ms)
    let anyDissolveFinished = false;
    const advanceDissolve = (n: HarborNPC): HarborNPC => {
      if (!n.isDissolving) return n;
      const curTimer = (n.dissolveTimer ?? 0) + dt;
      const maxDuration = n.dissolveDuration ?? 0.45;
      if (curTimer >= maxDuration) {
        anyDissolveFinished = true;
        return {
          ...n,
          isDissolving: false,
          dissolveTimer: maxDuration,
          isActive: false,
          isRecruited: true,
          isMoving: false,
          isInteracting: false,
          patrol: undefined,
          movement: undefined,
        };
      }
      return {
        ...n,
        dissolveTimer: curTimer,
        isMoving: false,
        isInteracting: false,
      };
    };

    if (harborNpcsRef.current.some((n) => n.isDissolving)) {
      harborNpcsRef.current = harborNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setHarborNpcsState([...harborNpcsRef.current]);
    }
    if (townNpcsRef.current.some((n) => n.isDissolving)) {
      townNpcsRef.current = townNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setTownNpcsState([...townNpcsRef.current]);
    }
    if (cliffsNpcsRef.current.some((n) => n.isDissolving)) {
      cliffsNpcsRef.current = cliffsNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setCliffsNpcsState([...cliffsNpcsRef.current]);
    }
    if (ruinsNpcsRef.current.some((n) => n.isDissolving)) {
      ruinsNpcsRef.current = ruinsNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setRuinsNpcsState([...ruinsNpcsRef.current]);
    }
    if (treelineNpcsRef.current.some((n) => n.isDissolving)) {
      treelineNpcsRef.current = treelineNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setTreelineNpcsState([...treelineNpcsRef.current]);
    }
    if (nightingaleNpcsRef.current.some((n) => n.isDissolving)) {
      nightingaleNpcsRef.current = nightingaleNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setNightingaleNpcsState([...nightingaleNpcsRef.current]);
    }
    if (lunchNpcsRef.current.some((n) => n.isDissolving)) {
      lunchNpcsRef.current = lunchNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setLunchNpcsState([...lunchNpcsRef.current]);
    }
    if (forgeNpcsRef.current.some((n) => n.isDissolving)) {
      forgeNpcsRef.current = forgeNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setForgeNpcsState([...forgeNpcsRef.current]);
    }
    if (blueHouseNpcsRef.current.some((n) => n.isDissolving)) {
      blueHouseNpcsRef.current = blueHouseNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setBlueHouseNpcsState([...blueHouseNpcsRef.current]);
    }
    if (mountainGoatNpcsRef.current.some((n) => n.isDissolving)) {
      mountainGoatNpcsRef.current = mountainGoatNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setMountainGoatNpcsState([...mountainGoatNpcsRef.current]);
    }
    if (libraryNpcsRef.current.some((n) => n.isDissolving)) {
      libraryNpcsRef.current = libraryNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setLibraryNpcsState([...libraryNpcsRef.current]);
    }
    if (kitchenNpcsRef.current.some((n) => n.isDissolving)) {
      kitchenNpcsRef.current = kitchenNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setKitchenNpcsState([...kitchenNpcsRef.current]);
    }
    if (graveyardNpcsRef.current.some((n) => n.isDissolving)) {
      graveyardNpcsRef.current = graveyardNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setGraveyardNpcsState([...graveyardNpcsRef.current]);
    }
    if (whiteHouseNpcsRef.current.some((n) => n.isDissolving)) {
      whiteHouseNpcsRef.current = whiteHouseNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setWhiteHouseNpcsState([...whiteHouseNpcsRef.current]);
    }
    if (hermitageNpcsRef.current.some((n) => n.isDissolving)) {
      hermitageNpcsRef.current = hermitageNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setHermitageNpcsState([...hermitageNpcsRef.current]);
    }
    if (summitNpcsRef.current.some((n) => n.isDissolving)) {
      summitNpcsRef.current = summitNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setSummitNpcsState([...summitNpcsRef.current]);
    }
    if (rentedRoomNpcsRef.current.some((n) => n.isDissolving)) {
      rentedRoomNpcsRef.current = rentedRoomNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setRentedRoomNpcsState([...rentedRoomNpcsRef.current]);
    }
    if (lyricSanctuaryNpcsRef.current.some((n) => n.isDissolving)) {
      lyricSanctuaryNpcsRef.current = lyricSanctuaryNpcsRef.current.map(advanceDissolve);
      if (anyDissolveFinished) setLyricSanctuaryNpcsState([...lyricSanctuaryNpcsRef.current]);
    }

    // Advance Reading Transition or Credits Scroll
    if (endingStage === 'READING_TRANSITION') {
      setEndingTransitionProgress((prev) => {
        const next = prev + dt / 3.0;
        if (next >= 1) {
          setEndingStage('POEM_TITLE');
          gameAudio.playPowerupChime();
          return 1;
        }
        return next;
      });
    } else if (endingStage === 'CREDITS') {
      setCreditsScrollY((prev) => prev + dt * 24);
    }

    // 1. UPDATE ALL NPC MOVEMENT (PATHS & TURNS) ON ACTIVE SCREEN
    if (!isDialogueOpen && endingStage === 'IDLE') {
      const screenData =
        curScreenId === 'CAFE_DE_FLORE' || curScreenId === 'ROOM_CAFE_DE_FLORE'
          ? buildCafeDeFloreScreen()
          : curScreenId === 'SHAKESPEARE_CO' || curScreenId === 'ROOM_SHAKESPEARE_CO'
          ? buildShakespeareCoScreen()
          : curScreenId === 'LYRIC_SANCTUARY'
          ? buildLyricSanctuaryScreen()
          : curScreenId === 'RENTED_ROOM'
          ? buildRentedRoomScreen()
          : curScreenId === 'SUMMIT'
          ? buildSummitScreen6()
          : curScreenId === 'HERMITAGE'
          ? buildHermitageScreen()
          : curScreenId === 'WHITE_HOUSE'
          ? buildWhiteHouseScreen()
          : curScreenId === 'GRAVEYARD'
          ? buildGraveyardScreen()
          : curScreenId === 'KITCHEN'
          ? buildKitchenScreen()
          : curScreenId === 'LIBRARY'
          ? buildLibraryScreen()
          : curScreenId === 'MOUNTAIN_GOAT'
          ? buildMountainGoatScreen()
          : curScreenId === 'BLUE_HOUSE'
          ? buildBlueHouseScreen()
          : curScreenId === 'FORGE'
          ? buildForgeScreen()
          : curScreenId === 'LUNCH_COUNTER'
          ? buildLunchCounterScreen()
          : curScreenId === 'NIGHTINGALE'
          ? buildNightingaleScreen()
          : curScreenId === 'TREELINE'
          ? buildTreelineScreen5()
          : curScreenId === 'RUINS'
          ? buildRuinsScreen4()
          : curScreenId === 'CLIFFS'
          ? buildCliffsScreen3()
          : curScreenId === 'TOWN'
          ? buildTownScreen2()
          : buildHarborScreen1();

      const currentNpcs =
        curScreenId === 'CAFE_DE_FLORE' || curScreenId === 'ROOM_CAFE_DE_FLORE'
          ? cafeNpcsRef.current
          : curScreenId === 'SHAKESPEARE_CO' || curScreenId === 'ROOM_SHAKESPEARE_CO'
          ? shakespeareCoNpcsRef.current
          : curScreenId === 'ROOM_BOATHOUSE' || curScreenId === 'BOATHOUSE'
          ? []
          : curScreenId === 'LYRIC_SANCTUARY'
          ? lyricSanctuaryNpcsRef.current
          : curScreenId === 'RENTED_ROOM'
          ? rentedRoomNpcsRef.current
          : curScreenId === 'SUMMIT'
          ? summitNpcsRef.current
          : curScreenId === 'HERMITAGE'
          ? hermitageNpcsRef.current
          : curScreenId === 'WHITE_HOUSE'
          ? whiteHouseNpcsRef.current
          : curScreenId === 'GRAVEYARD'
          ? graveyardNpcsRef.current
          : curScreenId === 'KITCHEN'
          ? kitchenNpcsRef.current
          : curScreenId === 'LIBRARY'
          ? libraryNpcsRef.current
          : curScreenId === 'MOUNTAIN_GOAT'
          ? mountainGoatNpcsRef.current
          : curScreenId === 'BLUE_HOUSE'
          ? blueHouseNpcsRef.current
          : curScreenId === 'FORGE'
          ? forgeNpcsRef.current
          : curScreenId === 'LUNCH_COUNTER'
          ? lunchNpcsRef.current
          : curScreenId === 'NIGHTINGALE'
          ? nightingaleNpcsRef.current
          : curScreenId === 'TREELINE'
          ? treelineNpcsRef.current
          : curScreenId === 'RUINS'
          ? ruinsNpcsRef.current
          : curScreenId === 'CLIFFS'
          ? cliffsNpcsRef.current
          : curScreenId === 'TOWN'
          ? townNpcsRef.current
          : harborNpcsRef.current;

      const updateSingleNpc = (npc: HarborNPC): HarborNPC => {
        if (!npc.isActive || npc.isInteracting || npc.isDissolving || npc.isRecruited) return npc;

        // A. TURN RULE: Cycles facing directions at fixed interval
        if (npc.movement?.type === 'TURN') {
          // Burns, Baudelaire, Dickinson, Dante, & WCW: Turns directly to face the player when approached
          if (
            npc.poetId === 'BURNS' ||
            npc.id === 'npc_forge_burns' ||
            npc.poetId === 'BAUDELAIRE' ||
            npc.id === 'npc_goat_baudelaire' ||
            npc.poetId === 'DICKINSON' ||
            npc.id === 'npc_hermitage_dickinson' ||
            npc.poetId === 'DANTE' ||
            npc.id === 'npc_summit_dante' ||
            npc.poetId === 'WCW' ||
            npc.id === 'npc_lunch_wcw'
          ) {
            const curNpcX = (npc.pxX !== undefined ? npc.pxX : npc.x * TILE_SIZE) + 8;
            const curNpcY = (npc.pxY !== undefined ? npc.pxY : npc.y * TILE_SIZE) + 12;
            const distToPlayer = Math.hypot(curNpcX - (p.pxX + 8), curNpcY - (p.pxY + 12));
            if (distToPlayer < 28) {
              let faceDir: FacingDirection = npc.facing;
              if (Math.abs(p.pxX - (npc.pxX ?? npc.x * TILE_SIZE)) > Math.abs(p.pxY - (npc.pxY ?? npc.y * TILE_SIZE))) {
                faceDir = p.pxX > (npc.pxX ?? npc.x * TILE_SIZE) ? 'RIGHT' : 'LEFT';
              } else {
                faceDir = p.pxY > (npc.pxY ?? npc.y * TILE_SIZE) ? 'DOWN' : 'UP';
              }
              return {
                ...npc,
                facing: faceDir,
                movement: {
                  ...npc.movement,
                  timer: 0,
                },
              };
            }
          }

          const move = { ...npc.movement };
          const timer = (move.timer ?? 0) + dt;
          let curIdx = move.currentIndex ?? 0;
          let curFacing = npc.facing;

          if (timer >= move.interval) {
            move.timer = timer % move.interval;
            curIdx = (curIdx + 1) % move.directions.length;
            move.currentIndex = curIdx;
            curFacing = move.directions[curIdx];
          } else {
            move.timer = timer;
          }

          return {
            ...npc,
            facing: curFacing,
            movement: move,
          };
        }

        // B. PATH RULE: Traverses waypoint list in order, pausing at start of each completed loop
        if (npc.movement?.type === 'PATH') {
          const move = { ...npc.movement };
          let newX = npc.x;
          let newY = npc.y;
          let newPxX = npc.pxX !== undefined ? npc.pxX : npc.x * TILE_SIZE;
          let newPxY = npc.pxY !== undefined ? npc.pxY : npc.y * TILE_SIZE;
          let newFacing = npc.facing;
          let newWalkStep = 0;
          let isMoving = false;

          if (move.pauseTimer && move.pauseTimer > 0) {
            move.pauseTimer -= dt;
            newWalkStep = 0;
            newPxX = newX * TILE_SIZE;
            newPxY = newY * TILE_SIZE;
            isMoving = false;

            // Looking around during pause (specifically for Whitman on pier boardwalk)
            if (npc.id === 'npc_whitman' || npc.poetId === 'WHITMAN') {
              if (move.pauseTimer > 2.3) {
                newFacing = 'DOWN'; // Looking south across the ocean waves
              } else if (move.pauseTimer > 1.1) {
                newFacing = newX <= 10 ? 'RIGHT' : 'LEFT'; // Looking along the pier boardwalk
              } else {
                const targetWp = move.waypoints[move.currentWaypointIndex ?? 0];
                if (targetWp) {
                  newFacing = targetWp.x >= newX ? 'RIGHT' : 'LEFT';
                }
              }
            }
          } else if (npc.isMoving && move.stepFrom && move.stepTo) {
            isMoving = true;
            move.stepProgress = (move.stepProgress ?? 0) + dt * move.speed;
            const t = Math.min(1, move.stepProgress);
            
            // Walk cycle frame: alternate between left step (1), passing (2), right step (3), passing (0/2)
            const walkCycle = Math.floor((move.stepProgress ?? 0) * 8) % 4;
            newWalkStep = walkCycle === 0 ? 1 : walkCycle === 1 ? 2 : walkCycle === 2 ? 3 : 0;

            newPxX = (move.stepFrom.x + (move.stepTo.x - move.stepFrom.x) * t) * TILE_SIZE;
            newPxY = (move.stepFrom.y + (move.stepTo.y - move.stepFrom.y) * t) * TILE_SIZE;

            if (t >= 1) {
              newX = move.stepTo.x;
              newY = move.stepTo.y;
              newPxX = newX * TILE_SIZE;
              newPxY = newY * TILE_SIZE;
              isMoving = false;
              newWalkStep = 0;
              move.stepProgress = 0;
              move.stepFrom = undefined;
              move.stepTo = undefined;

              let wpIdx = move.currentWaypointIndex ?? 0;
              const targetWP = move.waypoints[wpIdx];
              if (targetWP && newX === targetWP.x && newY === targetWP.y) {
                if (targetWP.facing) {
                  newFacing = targetWP.facing;
                }
                const pauseDur = targetWP.pause !== undefined ? targetWP.pause : move.pauseAtStart;
                const nextIdx = (wpIdx + 1) % move.waypoints.length;
                move.currentWaypointIndex = nextIdx;
                if (pauseDur > 0 && (nextIdx === 0 || targetWP.pause !== undefined)) {
                  const organicJitter = pauseDur > 4 ? (Math.random() * 2 - 1) : 0;
                  move.pauseTimer = Math.max(1.0, pauseDur + organicJitter);
                } else if (nextIdx === 0 || (newX === move.waypoints[0].x && newY === move.waypoints[0].y)) {
                  const organicJitter = move.pauseAtStart > 4 ? (Math.random() * 2 - 1) : 0;
                  move.pauseTimer = Math.max(1.0, move.pauseAtStart + organicJitter);
                }
              }
            }
          } else {
            // Not currently mid-step: determine next step towards target waypoint
            let wpIdx = move.currentWaypointIndex ?? 0;
            let targetWP = move.waypoints[wpIdx];
            if (targetWP && newX === targetWP.x && newY === targetWP.y) {
              if (targetWP.facing) {
                newFacing = targetWP.facing;
              }
              const pauseDur = targetWP.pause !== undefined ? targetWP.pause : move.pauseAtStart;
              wpIdx = (wpIdx + 1) % move.waypoints.length;
              move.currentWaypointIndex = wpIdx;
              targetWP = move.waypoints[wpIdx];
              if (pauseDur > 0 && (wpIdx === 0 || targetWP?.pause !== undefined)) {
                const organicJitter = pauseDur > 4 ? (Math.random() * 2 - 1) : 0;
                move.pauseTimer = Math.max(1.0, pauseDur + organicJitter);
                return {
                  ...npc,
                  x: newX,
                  y: newY,
                  pxX: newX * TILE_SIZE,
                  pxY: newY * TILE_SIZE,
                  facing: newFacing,
                  walkStep: 0,
                  isMoving: false,
                  movement: move,
                };
              }
              if (wpIdx === 0 || (newX === move.waypoints[0].x && newY === move.waypoints[0].y)) {
                const organicJitter = move.pauseAtStart > 4 ? (Math.random() * 2 - 1) : 0;
                move.pauseTimer = Math.max(1.0, move.pauseAtStart + organicJitter);
                return {
                  ...npc,
                  x: newX,
                  y: newY,
                  pxX: newX * TILE_SIZE,
                  pxY: newY * TILE_SIZE,
                  facing: newFacing,
                  walkStep: 0,
                  isMoving: false,
                  movement: move,
                };
              }
            }

            if (targetWP) {
              let nextStepX = newX;
              let nextStepY = newY;
              if (targetWP.x !== newX) {
                nextStepX += targetWP.x > newX ? 1 : -1;
                newFacing = targetWP.x > newX ? 'RIGHT' : 'LEFT';
              } else if (targetWP.y !== newY) {
                nextStepY += targetWP.y > newY ? 1 : -1;
                newFacing = targetWP.y > newY ? 'DOWN' : 'UP';
              }

              // Senghor, Hopkins, Omar Khayyam, Allen Ginsberg, Coleridge, Berry, Milton, Shakespeare, Li Bai, O'Hara, Stevens, WCW player approach check
              if (
                npc.id === 'npc_senghor' ||
                npc.poetId === 'SENGHOR' ||
                npc.id === 'npc_cliffs_hopkins' ||
                npc.poetId === 'HOPKINS' ||
                npc.id === 'npc_goat_khayyam' ||
                npc.poetId === 'OMAR_KHAYYAM' ||
                npc.id === 'npc_goat_ginsberg' ||
                npc.poetId === 'GINSBERG' ||
                npc.id === 'npc_hermitage_coleridge' ||
                npc.poetId === 'COLERIDGE' ||
                npc.id === 'npc_hermitage_berry' ||
                npc.poetId === 'BERRY' ||
                npc.id === 'npc_summit_milton' ||
                npc.poetId === 'MILTON' ||
                npc.id === 'npc_summit_shakespeare' ||
                npc.poetId === 'SHAKESPEARE' ||
                npc.id === 'npc_ruins_li_bai' ||
                npc.poetId === 'LI_BAI' ||
                npc.id === 'npc_lunch_ohara' ||
                npc.poetId === 'OHARA' ||
                npc.id === 'npc_lunch_stevens' ||
                npc.poetId === 'STEVENS' ||
                npc.id === 'npc_lunch_wcw' ||
                npc.poetId === 'WCW'
              ) {
                const distToPlayer = Math.hypot((newPxX + 8) - (p.pxX + 8), (newPxY + 12) - (p.pxY + 12));
                if (distToPlayer < 24) {
                  let faceDir: FacingDirection = newFacing;
                  if (Math.abs(p.pxX - newPxX) > Math.abs(p.pxY - newPxY)) {
                    faceDir = p.pxX > newPxX ? 'RIGHT' : 'LEFT';
                  } else {
                    faceDir = p.pxY > newPxY ? 'DOWN' : 'UP';
                  }
                  return {
                    ...npc,
                    x: newX,
                    y: newY,
                    pxX: newX * TILE_SIZE,
                    pxY: newY * TILE_SIZE,
                    facing: faceDir,
                    walkStep: 0,
                    isMoving: false,
                    movement: {
                      ...move,
                      pauseTimer: Math.max(move.pauseTimer ?? 0, 1.5),
                    },
                  };
                }
              }

              // Collision check: Solid tiles, dedicated passable chairs/stools, player tile
              const isDanteSolid = curScreenId === 'SUMMIT' && nextStepX === 12 && nextStepY === 4 && !capturedPoetIds.includes('DANTE');
              const isUnobstructedRuinsPassage =
                curScreenId === 'RUINS' &&
                ((nextStepX === 18 && nextStepY >= 12 && nextStepY <= 14) ||
                 ((nextStepX === 13 || nextStepX === 14) && nextStepY === 12) || // Culvert crossing
                 ((nextStepX >= 12 && nextStepX <= 15) && (nextStepY === 8 || nextStepY === 9)) || // Arched bridge
                 (nextStepX === 19 && nextStepY === 13) ||
                 (nextStepX === 20 && nextStepY === 13) ||
                 (nextStepX >= 16 && nextStepX <= 21 && (nextStepY === 14 || nextStepY === 17)) ||
                 ((nextStepX === 16 || nextStepX === 21) && (nextStepY === 15 || nextStepY === 16)));
              const isSolid = !isUnobstructedRuinsPassage && (isDanteSolid || (screenData.solid[nextStepY]?.[nextStepX] ?? true));
              const isDedicated = move.dedicatedPassableTiles?.some((tile) => tile.x === nextStepX && tile.y === nextStepY);
              const isPlayerOccupying =
                (p.gridX === nextStepX && p.gridY === nextStepY) ||
                (p.isMoving && p.targetX === nextStepX && p.targetY === nextStepY);
              const isOccupiedByOtherNpc =
                (curScreenId === 'LIBRARY' || curScreenId === 'LUNCH_COUNTER') &&
                currentNpcs.some(
                  (other) =>
                    other.id !== npc.id &&
                    other.isActive &&
                    !other.isDissolving &&
                    !other.isRecruited &&
                    !(other.poetId && capturedPoetIds.includes(other.poetId)) &&
                    ((other.x === nextStepX && other.y === nextStepY) ||
                      (other.isMoving &&
                        other.movement?.type === 'PATH' &&
                        other.movement.stepTo?.x === nextStepX &&
                        other.movement.stepTo?.y === nextStepY)),
                );

              if ((!isSolid || isDedicated) && !isPlayerOccupying && !isOccupiedByOtherNpc) {
                isMoving = true;
                move.stepFrom = { x: newX, y: newY };
                move.stepTo = { x: nextStepX, y: nextStepY };
                move.stepProgress = 0;
                newWalkStep = 1;
              } else {
                isMoving = false;
                newWalkStep = 0;
              }
            }
          }

          return {
            ...npc,
            x: newX,
            y: newY,
            pxX: newPxX,
            pxY: newPxY,
            facing: newFacing,
            walkStep: newWalkStep,
            isMoving,
            movement: move,
          };
        }

        // C. LEGACY 2-POINT PATROL (Whitman & Darwish on Screen 1)
        if (npc.patrol) {
          const pat = { ...npc.patrol };
          let newX = npc.x;
          let newY = npc.y;
          let newPxX = npc.pxX !== undefined ? npc.pxX : npc.x * TILE_SIZE;
          let newPxY = npc.pxY !== undefined ? npc.pxY : npc.y * TILE_SIZE;
          let newFacing = npc.facing;
          let newWalkStep = npc.walkStep ?? 0;
          let isMoving = false;

          if (pat.state === 'IDLE_P1') {
            pat.pauseTimer -= dt;
            newFacing = pat.idleFacingP1;
            newWalkStep = 0;
            newPxX = pat.p1.x * TILE_SIZE;
            newPxY = pat.p1.y * TILE_SIZE;
            newX = pat.p1.x;
            newY = pat.p1.y;

            if (pat.pauseTimer <= 0) {
              pat.state = 'WALKING_TO_P2';
              pat.currentStepProgress = 0;
              pat.stepFrom = { x: pat.p1.x, y: pat.p1.y };
              const nextStepX = pat.p1.x + (pat.p2.x > pat.p1.x ? 1 : pat.p2.x < pat.p1.x ? -1 : 0);
              const nextStepY = pat.p1.y + (pat.p2.y > pat.p1.y ? 1 : pat.p2.y < pat.p1.y ? -1 : 0);
              pat.stepTo = { x: nextStepX, y: nextStepY };
              newFacing = pat.p2.x > pat.p1.x ? 'RIGHT' : pat.p2.x < pat.p1.x ? 'LEFT' : pat.p2.y > pat.p1.y ? 'DOWN' : 'UP';
            }
          } else if (pat.state === 'WALKING_TO_P2') {
            isMoving = true;
            newFacing = pat.p2.x > pat.p1.x ? 'RIGHT' : pat.p2.x < pat.p1.x ? 'LEFT' : pat.p2.y > pat.p1.y ? 'DOWN' : 'UP';
            pat.currentStepProgress += dt * pat.walkSpeed;

            const strideFrame = (pat.stepFrom.x + pat.stepFrom.y) % 2 === 0 ? 1 : 3;
            newWalkStep = pat.currentStepProgress < 0.65 ? strideFrame : 2;

            const t = Math.min(1, pat.currentStepProgress);
            newPxX = (pat.stepFrom.x + (pat.stepTo.x - pat.stepFrom.x) * t) * TILE_SIZE;
            newPxY = (pat.stepFrom.y + (pat.stepTo.y - pat.stepFrom.y) * t) * TILE_SIZE;

            if (pat.currentStepProgress >= 1) {
              newX = pat.stepTo.x;
              newY = pat.stepTo.y;
              newPxX = newX * TILE_SIZE;
              newPxY = newY * TILE_SIZE;
              pat.currentStepProgress = 0;

              if (newX === pat.p2.x && newY === pat.p2.y) {
                pat.state = 'IDLE_P2';
                pat.pauseTimer = pat.pauseDuration;
                newFacing = pat.idleFacingP2;
                newWalkStep = 0;
                isMoving = false;
              } else {
                pat.stepFrom = { x: newX, y: newY };
                const nextStepX = newX + (pat.p2.x > newX ? 1 : pat.p2.x < newX ? -1 : 0);
                const nextStepY = newY + (pat.p2.y > newY ? 1 : pat.p2.y < newY ? -1 : 0);
                pat.stepTo = { x: nextStepX, y: nextStepY };
              }
            }
          } else if (pat.state === 'IDLE_P2') {
            pat.pauseTimer -= dt;
            newFacing = pat.idleFacingP2;
            newWalkStep = 0;
            newPxX = pat.p2.x * TILE_SIZE;
            newPxY = pat.p2.y * TILE_SIZE;
            newX = pat.p2.x;
            newY = pat.p2.y;

            if (pat.pauseTimer <= 0) {
              pat.state = 'WALKING_TO_P1';
              pat.currentStepProgress = 0;
              pat.stepFrom = { x: pat.p2.x, y: pat.p2.y };
              const nextStepX = pat.p2.x + (pat.p1.x > pat.p2.x ? 1 : pat.p1.x < pat.p2.x ? -1 : 0);
              const nextStepY = pat.p2.y + (pat.p1.y > pat.p2.y ? 1 : pat.p1.y < pat.p2.y ? -1 : 0);
              pat.stepTo = { x: nextStepX, y: nextStepY };
              newFacing = pat.p1.x > pat.p2.x ? 'RIGHT' : pat.p1.x < pat.p2.x ? 'LEFT' : pat.p1.y > pat.p2.y ? 'DOWN' : 'UP';
            }
          } else if (pat.state === 'WALKING_TO_P1') {
            isMoving = true;
            newFacing = pat.p1.x > pat.p2.x ? 'RIGHT' : pat.p1.x < pat.p2.x ? 'LEFT' : pat.p1.y > pat.p2.y ? 'DOWN' : 'UP';
            pat.currentStepProgress += dt * pat.walkSpeed;

            const strideFrame = (pat.stepFrom.x + pat.stepFrom.y) % 2 === 0 ? 1 : 3;
            newWalkStep = pat.currentStepProgress < 0.65 ? strideFrame : 2;

            const t = Math.min(1, pat.currentStepProgress);
            newPxX = (pat.stepFrom.x + (pat.stepTo.x - pat.stepFrom.x) * t) * TILE_SIZE;
            newPxY = (pat.stepFrom.y + (pat.stepTo.y - pat.stepFrom.y) * t) * TILE_SIZE;

            if (pat.currentStepProgress >= 1) {
              newX = pat.stepTo.x;
              newY = pat.stepTo.y;
              newPxX = newX * TILE_SIZE;
              newPxY = newY * TILE_SIZE;
              pat.currentStepProgress = 0;

              if (newX === pat.p1.x && newY === pat.p1.y) {
                pat.state = 'IDLE_P1';
                pat.pauseTimer = pat.pauseDuration;
                newFacing = pat.idleFacingP1;
                newWalkStep = 0;
                isMoving = false;
              } else {
                pat.stepFrom = { x: newX, y: newY };
                const nextStepX = newX + (pat.p1.x > newX ? 1 : pat.p1.x < newX ? -1 : 0);
                const nextStepY = newY + (pat.p1.y > newY ? 1 : pat.p1.y < newY ? -1 : 0);
                pat.stepTo = { x: nextStepX, y: nextStepY };
              }
            }
          }

          return {
            ...npc,
            x: newX,
            y: newY,
            pxX: newPxX,
            pxY: newPxY,
            facing: newFacing,
            walkStep: newWalkStep,
            isMoving,
            patrol: pat,
          };
        }

        // D. C. P. CAVAFY AUTONOMOUS PATROL & LIGHTHOUSE ROUTINE
        if (npc.cavafyRoutine) {
          const rout = { ...npc.cavafyRoutine };
          let newPxX = npc.pxX !== undefined ? npc.pxX : 25 * TILE_SIZE;
          let newPxY = npc.pxY !== undefined ? npc.pxY : 19.5 * TILE_SIZE;
          let newFacing = npc.facing;
          let newWalkStep = 0;
          let isMoving = false;
          let newOpacity = npc.opacity !== undefined ? npc.opacity : 1.0;
          const speed = rout.speed || 0.75;
          const pauseDur = rout.pauseDuration || 2.5;

          switch (rout.phase) {
            case 'STROLL_WEST': {
              isMoving = true;
              newFacing = 'LEFT';
              const distTiles = Math.abs(rout.targetX - rout.startX);
              rout.progress += (dt * speed) / distTiles;
              const t = Math.min(1, rout.progress);
              const curTileX = rout.startX + (rout.targetX - rout.startX) * t;
              newPxX = curTileX * TILE_SIZE;
              newPxY = rout.targetY * TILE_SIZE;
              newWalkStep = Math.floor(animTimeRef.current * 4.0) % 4;
              newOpacity = 1.0;

              if (t >= 1) {
                newPxX = rout.targetX * TILE_SIZE;
                isMoving = false;
                newWalkStep = 0;
                newFacing = 'DOWN';
                rout.phase = 'PAUSE_WEST';
                rout.timer = pauseDur;
              }
              break;
            }
            case 'PAUSE_WEST': {
              isMoving = false;
              newWalkStep = 0;
              newFacing = 'DOWN';
              newOpacity = 1.0;
              rout.timer -= dt;
              if (rout.timer <= 0) {
                rout.phase = 'STROLL_EAST';
                rout.startX = 23.5;
                rout.targetX = 26.5;
                rout.progress = 0;
                newFacing = 'RIGHT';
              }
              break;
            }
            case 'STROLL_EAST': {
              isMoving = true;
              newFacing = 'RIGHT';
              const distTiles = Math.abs(rout.targetX - rout.startX);
              rout.progress += (dt * speed) / distTiles;
              const t = Math.min(1, rout.progress);
              const curTileX = rout.startX + (rout.targetX - rout.startX) * t;
              newPxX = curTileX * TILE_SIZE;
              newPxY = rout.targetY * TILE_SIZE;
              newWalkStep = Math.floor(animTimeRef.current * 4.0) % 4;
              newOpacity = 1.0;

              if (t >= 1) {
                newPxX = rout.targetX * TILE_SIZE;
                isMoving = false;
                newWalkStep = 0;
                newFacing = 'DOWN';
                rout.phase = 'PAUSE_EAST';
                rout.timer = pauseDur;
              }
              break;
            }
            case 'PAUSE_EAST': {
              isMoving = false;
              newWalkStep = 0;
              newFacing = 'DOWN';
              newOpacity = 1.0;
              rout.timer -= dt;
              if (rout.timer <= 0) {
                rout.phase = 'THRESHOLD_PAUSE';
                newFacing = 'UP';
                rout.timer = 1.8;
              }
              break;
            }
            case 'THRESHOLD_PAUSE': {
              isMoving = false;
              newWalkStep = 0;
              newFacing = 'UP';
              newOpacity = 1.0;
              rout.timer -= dt;
              if (rout.timer <= 0) {
                gameAudio.playCrispClick();
                rout.phase = 'ENTERING_DOOR';
                rout.timer = 0.8;
              }
              break;
            }
            case 'ENTERING_DOOR': {
              isMoving = true;
              newFacing = 'UP';
              newWalkStep = Math.floor(animTimeRef.current * 4.0) % 4;
              rout.timer -= dt;
              const fadeT = Math.max(0, rout.timer / 0.8);
              newOpacity = fadeT;
              newPxY = (19.5 - (1 - fadeT) * 0.4) * TILE_SIZE;
              if (rout.timer <= 0) {
                newOpacity = 0.0;
                rout.phase = 'INSIDE';
                rout.timer = 10.0;
                isMoving = false;
                newWalkStep = 0;
              }
              break;
            }
            case 'INSIDE': {
              isMoving = false;
              newWalkStep = 0;
              newOpacity = 0.0;
              rout.timer -= dt;
              if (rout.timer <= 0) {
                gameAudio.playCrispClick();
                rout.phase = 'POST_EXIT_GAZE';
                newPxX = 26.5 * TILE_SIZE;
                newPxY = 19.5 * TILE_SIZE;
                newOpacity = 1.0;
                newFacing = 'DOWN';
                rout.timer = 2.5;
              }
              break;
            }
            case 'POST_EXIT_GAZE': {
              isMoving = false;
              newWalkStep = 0;
              newFacing = 'DOWN';
              newOpacity = 1.0;
              rout.timer -= dt;
              if (rout.timer <= 0) {
                rout.phase = 'STROLL_WEST';
                rout.startX = 26.5;
                rout.targetX = 23.5;
                rout.progress = 0;
                newFacing = 'LEFT';
              }
              break;
            }
          }

          return {
            ...npc,
            x: Math.round(newPxX / TILE_SIZE),
            y: Math.round(newPxY / TILE_SIZE),
            pxX: newPxX,
            pxY: newPxY,
            facing: newFacing,
            walkStep: newWalkStep,
            isMoving,
            opacity: newOpacity,
            cavafyRoutine: rout,
          };
        }

        // E. MARY OLIVER SHORELINE PATROL & GOOSE FEEDING ROUTINE
        if (npc.maryOliverRoutine) {
          const rout = { ...npc.maryOliverRoutine };
          let newPxX = npc.pxX !== undefined ? npc.pxX : 7 * TILE_SIZE;
          const newPxY = 10 * TILE_SIZE;
          let newFacing = npc.facing;
          let newWalkStep = 0;
          let isMoving = false;
          const speed = rout.speed || 0.85;

          // Advance crumbs flight and ripples if any exist
          if (rout.crumbs && rout.crumbs.length > 0) {
            rout.crumbs = rout.crumbs.map((crumb) => {
              if (crumb.eaten) return crumb;
              if (!crumb.landed) {
                const nextProgress = Math.min(1.0, crumb.progress + dt * 2.2);
                const landed = nextProgress >= 1.0;
                return {
                  ...crumb,
                  progress: nextProgress,
                  landed,
                  rippleTimer: landed ? crumb.rippleTimer + dt : 0,
                };
              } else {
                return {
                  ...crumb,
                  rippleTimer: crumb.rippleTimer + dt,
                };
              }
            });
          }

          // Count down feed cooldown while patrolling or pausing (12-16 seconds)
          if (rout.phase === 'STROLL_EAST' || rout.phase === 'STROLL_WEST' || rout.phase === 'PAUSE') {
            rout.feedCooldown -= dt;
            if (rout.feedCooldown <= 0) {
              rout.phase = 'FEED_REACH';
              rout.timer = 0.5;
              isMoving = false;
              newFacing = 'UP';
              newWalkStep = 0;
            }
          }

          if (rout.phase === 'STROLL_EAST') {
            isMoving = true;
            newFacing = 'RIGHT';
            newPxX += speed * dt * TILE_SIZE;
            newWalkStep = Math.floor(animTimeRef.current * 4.0) % 4;
            if (newPxX >= 10 * TILE_SIZE) {
              newPxX = 10 * TILE_SIZE;
              isMoving = false;
              newWalkStep = 0;
              rout.phase = 'PAUSE';
              rout.timer = 1.8 + Math.random() * 1.2;
              newFacing = 'UP';
            }
          } else if (rout.phase === 'STROLL_WEST') {
            isMoving = true;
            newFacing = 'LEFT';
            newPxX -= speed * dt * TILE_SIZE;
            newWalkStep = Math.floor(animTimeRef.current * 4.0) % 4;
            if (newPxX <= 5 * TILE_SIZE) {
              newPxX = 5 * TILE_SIZE;
              isMoving = false;
              newWalkStep = 0;
              rout.phase = 'PAUSE';
              rout.timer = 1.8 + Math.random() * 1.2;
              newFacing = 'UP';
            }
          } else if (rout.phase === 'PAUSE') {
            isMoving = false;
            newWalkStep = 0;
            newFacing = 'UP';
            rout.timer -= dt;
            if (rout.timer <= 0) {
              rout.phase = newPxX <= 5.5 * TILE_SIZE ? 'STROLL_EAST' : 'STROLL_WEST';
            }
          } else if (rout.phase === 'FEED_REACH') {
            isMoving = false;
            newWalkStep = 0;
            newFacing = 'UP';
            rout.timer -= dt;
            if (rout.timer <= 0) {
              rout.phase = 'FEED_TOSS';
              rout.timer = 0.7;
              // Spawn tiny seed/crumb particles arcing into Goose Pond water at Y ≈ 8.7..8.9
              const baseCx = newPxX + 8;
              const baseCy = newPxY + 4;
              const newCrumbs: PondCrumbParticle[] = [];
              for (let i = 0; i < 5; i++) {
                const targetOffset = (i - 2) * 5 + (Math.random() - 0.5) * 4;
                newCrumbs.push({
                  x: baseCx,
                  y: baseCy,
                  startX: baseCx,
                  startY: baseCy,
                  targetX: baseCx + targetOffset,
                  targetY: 8.8 * TILE_SIZE + (Math.random() * 4 - 2),
                  progress: 0,
                  arcHeight: 14 + Math.random() * 5,
                  landed: false,
                  rippleTimer: 0,
                  eaten: false,
                });
              }
              rout.crumbs = newCrumbs;
            }
          } else if (rout.phase === 'FEED_TOSS') {
            isMoving = false;
            newWalkStep = 0;
            newFacing = 'UP';
            rout.timer -= dt;
            if (rout.timer <= 0) {
              rout.phase = 'WATCH_FEED';
              rout.timer = 4.0;
            }
          } else if (rout.phase === 'WATCH_FEED') {
            isMoving = false;
            newWalkStep = 0;
            newFacing = 'UP';
            rout.timer -= dt;
            if (rout.timer <= 0) {
              rout.crumbs = [];
              rout.phase = newPxX < 7.5 * TILE_SIZE ? 'STROLL_EAST' : 'STROLL_WEST';
              rout.feedCooldown = 12.0 + Math.random() * 4.0; // 12-16 seconds!
            }
          }

          return {
            ...npc,
            x: Math.round(newPxX / TILE_SIZE),
            y: 10,
            pxX: newPxX,
            pxY: newPxY,
            facing: newFacing,
            walkStep: newWalkStep,
            isMoving,
            maryOliverRoutine: rout,
          };
        }

        // F. DEREK WALCOTT BEACH SHORELINE WANDER PATROL & OCEAN GAZE ROUTINE
        if (npc.walcottRoutine) {
          const rout = { ...npc.walcottRoutine };
          let newPxX = npc.pxX !== undefined ? npc.pxX : 18 * TILE_SIZE;
          const newPxY = 19 * TILE_SIZE;
          let newFacing = npc.facing;
          let newWalkStep = 0;
          let isMoving = false;
          const speed = rout.speed || 0.65;
          const pauseDur = rout.pauseDuration || 3.5;

          if (rout.phase === 'STROLL_WEST') {
            isMoving = true;
            newFacing = 'LEFT';
            newPxX -= speed * dt * TILE_SIZE;
            newWalkStep = Math.floor(animTimeRef.current * 3.5) % 4;
            if (newPxX <= 16.0 * TILE_SIZE) {
              newPxX = 16.0 * TILE_SIZE;
              isMoving = false;
              newWalkStep = 0;
              newFacing = 'DOWN'; // Turn south toward ocean waves
              rout.phase = 'PAUSE_WEST';
              rout.timer = pauseDur;
            }
          } else if (rout.phase === 'PAUSE_WEST') {
            isMoving = false;
            newWalkStep = 0;
            newFacing = 'DOWN'; // Gazing out at the blue ocean waves near pier approach
            rout.timer -= dt;
            if (rout.timer <= 0) {
              rout.phase = 'STROLL_EAST';
            }
          } else if (rout.phase === 'STROLL_EAST') {
            isMoving = true;
            newFacing = 'RIGHT';
            newPxX += speed * dt * TILE_SIZE;
            newWalkStep = Math.floor(animTimeRef.current * 3.5) % 4;
            if (newPxX >= 18.0 * TILE_SIZE) {
              newPxX = 18.0 * TILE_SIZE;
              isMoving = false;
              newWalkStep = 0;
              newFacing = 'DOWN'; // Turn south toward ocean waves
              rout.phase = 'PAUSE_EAST';
              rout.timer = pauseDur + 0.5;
            }
          } else if (rout.phase === 'PAUSE_EAST') {
            isMoving = false;
            newWalkStep = 0;
            newFacing = 'DOWN'; // Gazing out at the waves near cargo crates / boathouse deck
            rout.timer -= dt;
            if (rout.timer <= 0) {
              rout.phase = 'STROLL_WEST';
            }
          }

          return {
            ...npc,
            x: Math.round(newPxX / TILE_SIZE),
            y: 19,
            pxX: newPxX,
            pxY: newPxY,
            facing: newFacing,
            walkStep: newWalkStep,
            isMoving,
            walcottRoutine: rout,
          };
        }

        return npc;
      };

      if (curScreenId === 'CAFE_DE_FLORE' || curScreenId === 'ROOM_CAFE_DE_FLORE') {
        cafeNpcsRef.current = cafeNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'SHAKESPEARE_CO' || curScreenId === 'ROOM_SHAKESPEARE_CO') {
        shakespeareCoNpcsRef.current = shakespeareCoNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'LYRIC_SANCTUARY') {
        lyricSanctuaryNpcsRef.current = lyricSanctuaryNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'SUMMIT') {
        summitNpcsRef.current = summitNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'RENTED_ROOM') {
        rentedRoomNpcsRef.current = rentedRoomNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'TOWN') {
        townNpcsRef.current = townNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'CLIFFS') {
        cliffsNpcsRef.current = cliffsNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'RUINS') {
        ruinsNpcsRef.current = ruinsNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'TREELINE') {
        treelineNpcsRef.current = treelineNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'LIBRARY') {
        libraryNpcsRef.current = libraryNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'NIGHTINGALE') {
        nightingaleNpcsRef.current = nightingaleNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'LUNCH_COUNTER') {
        lunchNpcsRef.current = lunchNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'FORGE') {
        forgeNpcsRef.current = forgeNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'BLUE_HOUSE') {
        blueHouseNpcsRef.current = blueHouseNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'KITCHEN') {
        kitchenNpcsRef.current = kitchenNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'GRAVEYARD') {
        graveyardNpcsRef.current = graveyardNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'WHITE_HOUSE') {
        whiteHouseNpcsRef.current = whiteHouseNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'HERMITAGE') {
        hermitageNpcsRef.current = hermitageNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'MOUNTAIN_GOAT') {
        mountainGoatNpcsRef.current = mountainGoatNpcsRef.current.map(updateSingleNpc);
      } else if (curScreenId === 'HARBOR') {
        harborNpcsRef.current = harborNpcsRef.current.map(updateSingleNpc);
      }
    }

    // Update Land Goose atmospheric wander and pecking behavior on Screen 1 (The Harbor)
    if (curScreenId === 'HARBOR' && !isDialogueOpen && endingStage === 'IDLE') {
      const lg = landGooseRef.current;
      if (lg) {
        lg.stateTimer -= dt;

        if (lg.state === 'IDLE') {
          lg.waddleProgress = 0;
          lg.peckProgress = 0;
          if (lg.stateTimer <= 0) {
            // 55% chance to peck at seeds/flowers, 45% chance to waddle
            if (Math.random() < 0.55) {
              lg.state = 'PECK';
              lg.stateTimer = 2.6 + Math.random() * 1.4;
              lg.peckProgress = 0;
            } else {
              lg.state = 'WADDLE';
              lg.startX = lg.x;
              lg.startY = lg.y;
              // Wander radius on the green grass bank beside Mary Oliver and the Goose Pond
              // Near the west/south-west bank of the pond (X: 6.5..8.5, Y: 10.5..12.0)
              const newTargetX = 6.5 + Math.random() * 2.0;
              const newTargetY = 10.5 + Math.random() * 1.5;
              lg.targetX = newTargetX;
              lg.targetY = newTargetY;
              lg.facing = newTargetX >= lg.x ? 'RIGHT' : 'LEFT';
              const dist = Math.hypot(newTargetX - lg.x, newTargetY - lg.y);
              const waddleSpeed = 0.65; // gentle, calm waddling pace
              lg.stateTimer = Math.max(1.0, dist / waddleSpeed);
              lg.waddleProgress = 0;
            }
          }
        } else if (lg.state === 'PECK') {
          lg.waddleProgress = 0;
          const peckDuration = 2.8;
          lg.peckProgress = Math.min(1, lg.peckProgress + dt / peckDuration);
          if (lg.stateTimer <= 0 || lg.peckProgress >= 1) {
            lg.state = 'IDLE';
            lg.stateTimer = 1.8 + Math.random() * 2.0;
            lg.peckProgress = 0;
          }
        } else if (lg.state === 'WADDLE') {
          lg.peckProgress = 0;
          const distTotal = Math.hypot(lg.targetX - lg.startX, lg.targetY - lg.startY);
          const waddleSpeed = 0.65;
          const totalDuration = distTotal > 0.01 ? distTotal / waddleSpeed : 1.0;
          const progress = Math.min(1, (totalDuration - Math.max(0, lg.stateTimer)) / totalDuration);

          const curX = lg.startX + (lg.targetX - lg.startX) * progress;
          const curY = lg.startY + (lg.targetY - lg.startY) * progress;
          lg.x = curX;
          lg.y = curY;
          lg.pxX = curX * TILE_SIZE;
          lg.pxY = curY * TILE_SIZE;
          lg.waddleProgress += dt * 3.2;

          if (progress >= 1 || lg.stateTimer <= 0) {
            lg.x = lg.targetX;
            lg.y = lg.targetY;
            lg.pxX = lg.targetX * TILE_SIZE;
            lg.pxY = lg.targetY * TILE_SIZE;
            lg.state = Math.random() < 0.60 ? 'PECK' : 'IDLE';
            lg.stateTimer = 2.2 + Math.random() * 1.6;
            lg.waddleProgress = 0;
            lg.peckProgress = 0;
          }
        }
      }

      // Update Water Goose gentle swimming routine in pond on Screen 1 (The Harbor)
      const wg = waterGooseRef.current;
      if (wg) {
        // Check if Mary Oliver has thrown active crumbs into the pond
        const maryOliverNpc = harborNpcsRef.current.find(
          (n) => (n.id === 'npc_mary_oliver' || n.poetId === 'MARY_OLIVER') && n.isActive && !n.isRecruited
        );
        const activeCrumbs = maryOliverNpc?.maryOliverRoutine?.crumbs?.filter((c) => c.landed && !c.eaten);

        if (activeCrumbs && activeCrumbs.length > 0) {
          const targetCrumb = activeCrumbs[0];
          const targetTileX = targetCrumb.targetX / TILE_SIZE;
          const targetTileY = Math.max(5.0, Math.min(8.8, targetCrumb.targetY / TILE_SIZE));

          if (wg.state !== 'SWIM_TO_CRUMBS' && wg.state !== 'FEED_PECK') {
            wg.state = 'SWIM_TO_CRUMBS';
            wg.startX = wg.x;
            wg.startY = wg.y;
            wg.targetX = targetTileX;
            wg.targetY = targetTileY;
            wg.facing = targetTileX >= wg.x ? 'RIGHT' : 'LEFT';
            const dist = Math.hypot(targetTileX - wg.startX, targetTileY - wg.startY);
            const feedSwimSpeed = 0.85; // Eager swim toward crumbs!
            wg.stateTimer = Math.max(1.0, dist / feedSwimSpeed);
            wg.swimProgress = 0;
            wg.preenProgress = 0;
          }
        }

        if (wg.state === 'SWIM_TO_CRUMBS') {
          const distTotal = Math.hypot(wg.targetX - wg.startX, wg.targetY - wg.startY);
          const feedSwimSpeed = 0.85;
          const totalDuration = distTotal > 0.01 ? distTotal / feedSwimSpeed : 1.0;
          const progress = Math.min(1, (totalDuration - Math.max(0, wg.stateTimer)) / totalDuration);

          const curX = wg.startX + (wg.targetX - wg.startX) * progress;
          const curY = wg.startY + (wg.targetY - wg.startY) * progress;
          wg.x = curX;
          wg.y = curY;
          wg.pxX = curX * TILE_SIZE;
          wg.pxY = curY * TILE_SIZE;
          wg.swimProgress += dt * 3.0;

          if (Math.abs(wg.targetX - wg.startX) > 0.05) {
            wg.facing = wg.targetX >= wg.startX ? 'RIGHT' : 'LEFT';
          }

          wg.stateTimer -= dt;
          if (progress >= 1 || wg.stateTimer <= 0) {
            wg.x = wg.targetX;
            wg.y = wg.targetY;
            wg.pxX = wg.targetX * TILE_SIZE;
            wg.pxY = wg.targetY * TILE_SIZE;
            wg.state = 'FEED_PECK';
            wg.stateTimer = 2.8;
            wg.swimProgress = 0;
            wg.preenProgress = 0;
          }
        } else if (wg.state === 'FEED_PECK') {
          wg.swimProgress = 0;
          wg.preenProgress += dt * 1.5;
          wg.stateTimer -= dt;

          // As the goose pecks at the crumbs, mark them eaten
          if (wg.stateTimer < 1.4 && maryOliverNpc?.maryOliverRoutine?.crumbs) {
            maryOliverNpc.maryOliverRoutine.crumbs.forEach((c) => {
              c.eaten = true;
            });
          }

          if (wg.stateTimer <= 0) {
            wg.state = 'DRIFT';
            wg.stateTimer = 2.5;
            wg.swimProgress = 0;
            wg.preenProgress = 0;
          }
        } else if (wg.state === 'DRIFT') {
          wg.stateTimer -= dt;
          wg.swimProgress = 0;
          wg.preenProgress = 0;
          if (wg.stateTimer <= 0) {
            // 40% chance to preen/dip bill, 60% chance to swim to next waypoint
            if (Math.random() < 0.4) {
              wg.state = 'PREEN';
              wg.stateTimer = 2.5;
              wg.preenProgress = 0;
            } else {
              wg.state = 'SWIM';
              const nextIdx = (wg.currentWaypointIndex + 1) % WATER_GOOSE_WAYPOINTS.length;
              wg.currentWaypointIndex = nextIdx;
              const nextWp = WATER_GOOSE_WAYPOINTS[nextIdx];
              wg.startX = wg.x;
              wg.startY = wg.y;
              wg.targetX = nextWp.x;
              wg.targetY = nextWp.y;
              wg.facing = nextWp.x >= wg.x ? 'RIGHT' : 'LEFT';

              const dist = Math.hypot(nextWp.x - wg.x, nextWp.y - wg.y);
              const swimSpeed = 0.38; // calm, leisurely swimming glide
              wg.stateTimer = Math.max(1.5, dist / swimSpeed);
              wg.swimProgress = 0;
            }
          }
        } else if (wg.state === 'PREEN') {
          wg.stateTimer -= dt;
          wg.swimProgress = 0;
          const preenDur = 2.5;
          wg.preenProgress = Math.min(1, wg.preenProgress + dt / preenDur);
          if (wg.stateTimer <= 0 || wg.preenProgress >= 1) {
            wg.state = 'SWIM';
            const nextIdx = (wg.currentWaypointIndex + 1) % WATER_GOOSE_WAYPOINTS.length;
            wg.currentWaypointIndex = nextIdx;
            const nextWp = WATER_GOOSE_WAYPOINTS[nextIdx];
            wg.startX = wg.x;
            wg.startY = wg.y;
            wg.targetX = nextWp.x;
            wg.targetY = nextWp.y;
            wg.facing = nextWp.x >= wg.x ? 'RIGHT' : 'LEFT';

            const dist = Math.hypot(nextWp.x - wg.x, nextWp.y - wg.y);
            const swimSpeed = 0.38;
            wg.stateTimer = Math.max(1.5, dist / swimSpeed);
            wg.swimProgress = 0;
            wg.preenProgress = 0;
          }
        } else if (wg.state === 'SWIM') {
          wg.stateTimer -= dt;
          wg.preenProgress = 0;
          const distTotal = Math.hypot(wg.targetX - wg.startX, wg.targetY - wg.startY);
          const swimSpeed = 0.38;
          const totalDuration = distTotal > 0.01 ? distTotal / swimSpeed : 1.5;
          const progress = Math.min(1, (totalDuration - Math.max(0, wg.stateTimer)) / totalDuration);

          const curX = wg.startX + (wg.targetX - wg.startX) * progress;
          const curY = wg.startY + (wg.targetY - wg.startY) * progress;
          wg.x = curX;
          wg.y = curY;
          wg.pxX = curX * TILE_SIZE;
          wg.pxY = curY * TILE_SIZE;
          wg.swimProgress += dt * 1.5;

          // Smoothly face swimming direction
          if (Math.abs(wg.targetX - wg.startX) > 0.05) {
            wg.facing = wg.targetX >= wg.startX ? 'RIGHT' : 'LEFT';
          }

          if (progress >= 1 || wg.stateTimer <= 0) {
            wg.x = wg.targetX;
            wg.y = wg.targetY;
            wg.pxX = wg.targetX * TILE_SIZE;
            wg.pxY = wg.targetY * TILE_SIZE;
            const curWp = WATER_GOOSE_WAYPOINTS[wg.currentWaypointIndex];
            wg.state = 'DRIFT';
            wg.stateTimer = curWp ? curWp.pauseDuration : 3.0;
            wg.swimProgress = 0;
            wg.preenProgress = 0;
          }
        }
      }
    }

    // Update Coastal Dog wander, sniffing and tail-wagging behavior on Screen 3 (The Cliffs)
    if (curScreenId === 'CLIFFS' && !isDialogueOpen && endingStage === 'IDLE') {
      const cd = coastalDogRef.current;
      if (cd && !cd.isInteracting) {
        cd.stateTimer -= dt;

        if (cd.state === 'IDLE') {
          cd.isMoving = false;
          cd.trotProgress = 0;
          cd.sniffProgress = 0;

          if (cd.stateTimer <= 0) {
            // Choose next spot near flowers/rocks on the middle plateau
            const nextIdx = (cd.targetSpotIndex + 1 + Math.floor(Math.random() * 2)) % CLIFFS_DOG_SPOTS.length;
            cd.targetSpotIndex = nextIdx;
            const targetSpot = CLIFFS_DOG_SPOTS[nextIdx];

            cd.startX = cd.x;
            cd.startY = cd.y;
            cd.targetX = targetSpot.x;
            cd.targetY = targetSpot.y;
            cd.facing = targetSpot.x >= cd.x ? 'RIGHT' : 'LEFT';

            const dist = Math.hypot(targetSpot.x - cd.x, targetSpot.y - cd.y);
            const walkSpeed = 0.75; // slow, relaxed walking pace
            cd.state = 'WALK';
            cd.isMoving = true;
            cd.stateTimer = Math.max(1.2, dist / walkSpeed);
          }
        } else if (cd.state === 'WALK') {
          const distTotal = Math.hypot(cd.targetX - cd.startX, cd.targetY - cd.startY);
          const walkSpeed = 0.75;
          const totalDuration = distTotal > 0.01 ? distTotal / walkSpeed : 1.2;
          const progress = Math.min(1, (totalDuration - Math.max(0, cd.stateTimer)) / totalDuration);

          const curX = cd.startX + (cd.targetX - cd.startX) * progress;
          const curY = cd.startY + (cd.targetY - cd.startY) * progress;
          cd.x = curX;
          cd.y = Math.max(4.0, Math.min(6.8, curY));
          cd.pxX = cd.x * TILE_SIZE;
          cd.pxY = cd.y * TILE_SIZE;
          cd.trotProgress += dt * 3.5;
          cd.isMoving = true;

          // Face movement direction
          if (Math.abs(cd.targetX - cd.startX) > Math.abs(cd.targetY - cd.startY)) {
            cd.facing = cd.targetX >= cd.startX ? 'RIGHT' : 'LEFT';
          } else {
            cd.facing = cd.targetY >= cd.startY ? 'DOWN' : 'UP';
          }

          if (progress >= 1 || cd.stateTimer <= 0) {
            cd.x = cd.targetX;
            cd.y = Math.max(4.0, Math.min(6.8, cd.targetY));
            cd.pxX = cd.x * TILE_SIZE;
            cd.pxY = cd.y * TILE_SIZE;
            cd.isMoving = false;
            cd.trotProgress = 0;

            // Stop near flowers and rocks to sniff the ground with a wagging tail
            cd.state = 'SNIFF';
            cd.stateTimer = 3.2 + Math.random() * 1.8;
            cd.sniffProgress = 0;
            const spot = CLIFFS_DOG_SPOTS[cd.targetSpotIndex];
            if (spot?.facing) {
              cd.facing = spot.facing;
            }
          }
        } else if (cd.state === 'SNIFF') {
          cd.isMoving = false;
          cd.trotProgress = 0;
          cd.sniffProgress += dt;

          if (cd.stateTimer <= 0) {
            // After sniffing, short pause or pick next spot
            if (Math.random() < 0.35) {
              cd.state = 'IDLE';
              cd.stateTimer = 1.5 + Math.random() * 1.5;
            } else {
              const nextIdx = (cd.targetSpotIndex + 1 + Math.floor(Math.random() * 2)) % CLIFFS_DOG_SPOTS.length;
              cd.targetSpotIndex = nextIdx;
              const targetSpot = CLIFFS_DOG_SPOTS[nextIdx];

              cd.startX = cd.x;
              cd.startY = cd.y;
              cd.targetX = targetSpot.x;
              cd.targetY = targetSpot.y;
              cd.facing = targetSpot.x >= cd.x ? 'RIGHT' : 'LEFT';

              const dist = Math.hypot(targetSpot.x - cd.x, targetSpot.y - cd.y);
              const walkSpeed = 0.75;
              cd.state = 'WALK';
              cd.isMoving = true;
              cd.stateTimer = Math.max(1.2, dist / walkSpeed);
            }
          }
        }
      }
    }

    // 1.5. UPDATE ICE SKATE TRAILS & SHIMMER PARTICLES
    for (let i = iceSkateTrailsRef.current.length - 1; i >= 0; i--) {
      const trail = iceSkateTrailsRef.current[i];
      trail.life += dt;
      if (trail.life >= trail.maxLife) {
        iceSkateTrailsRef.current.splice(i, 1);
      } else {
        trail.alpha = Math.max(0, 1 - trail.life / trail.maxLife) * 0.70;
      }
    }
    for (let i = iceShimmerParticlesRef.current.length - 1; i >= 0; i--) {
      const pt = iceShimmerParticlesRef.current[i];
      pt.life += dt;
      if (pt.life >= pt.maxLife) {
        iceShimmerParticlesRef.current.splice(i, 1);
      } else {
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha = Math.max(0, 1 - pt.life / pt.maxLife) * 0.85;
      }
    }

    // 1.6. FIGURE SKATER'S GLIDE PHYSICS (THE TREELINE FROZEN LAKE)
    const isTreeline = curScreenId === 'TREELINE';
    const playerFootX = p.pxX + 8;
    const playerFootY = p.pxY + 14;
    const curFootTileX = Math.floor(playerFootX / TILE_SIZE);
    const curFootTileY = Math.floor(playerFootY / TILE_SIZE);
    const isOnIce = isTreeline && isTreelineIceTile(curFootTileX, curFootTileY);

    if (isDialogueOpen && p.isGliding) {
      p.glideVx = 0;
      p.glideVy = 0;
      p.isGliding = false;
    }

    if (isOnIce && !p.isMoving && !isDialogueOpen && endingStage === 'IDLE' && !p.isGliding && (Math.abs(p.glideVx) > 0.1 || Math.abs(p.glideVy) > 0.1)) {
      p.isGliding = true;
    }

    if (isTreeline && p.isGliding && !p.isMoving && !isDialogueOpen && endingStage === 'IDLE') {
      const upAct = Boolean(inputRef.current?.actions.up);
      const downAct = Boolean(inputRef.current?.actions.down);
      const leftAct = Boolean(inputRef.current?.actions.left);
      const rightAct = Boolean(inputRef.current?.actions.right);

      let inX = 0;
      let inY = 0;
      if (leftAct) inX -= 1;
      if (rightAct) inX += 1;
      if (upAct) inY -= 1;
      if (downAct) inY += 1;

      const curSpeed = Math.hypot(p.glideVx, p.glideVy);

      if (inX !== 0 || inY !== 0) {
        const inLen = Math.hypot(inX, inY);
        const normInX = inX / inLen;
        const normInY = inY / inLen;

        if (curSpeed < 8) {
          const pushSpeed = 78;
          p.glideVx = normInX * pushSpeed;
          p.glideVy = normInY * pushSpeed;
          p.dir = Math.abs(normInX) >= Math.abs(normInY) ? (normInX > 0 ? 'RIGHT' : 'LEFT') : (normInY > 0 ? 'DOWN' : 'UP');
          const now = Date.now();
          if (now - lastSkateAudioTimeRef.current > 350) {
            gameAudio.playIceSkateGlide();
            lastSkateAudioTimeRef.current = now;
          }
          triggerHaptics(20);
        } else {
          const steerAccel = 145; // px/s^2 subtle carving curves
          p.glideVx += normInX * steerAccel * dt;
          p.glideVy += normInY * steerAccel * dt;
          const maxSpeed = 84;
          const newSpd = Math.hypot(p.glideVx, p.glideVy);
          if (newSpd > maxSpeed) {
            p.glideVx = (p.glideVx / newSpd) * maxSpeed;
            p.glideVy = (p.glideVy / newSpd) * maxSpeed;
          }
          if (Math.abs(p.glideVx) > Math.abs(p.glideVy) * 1.05) {
            p.dir = p.glideVx > 0 ? 'RIGHT' : 'LEFT';
          } else if (Math.abs(p.glideVy) > Math.abs(p.glideVx) * 1.05) {
            p.dir = p.glideVy > 0 ? 'DOWN' : 'UP';
          }
        }
      }

      // Low friction / drag coefficient (~0.955 per frame)
      const friction = 0.955;
      const dragFactor = Math.pow(friction, dt * 60);
      p.glideVx *= dragFactor;
      p.glideVy *= dragFactor;

      if (Math.hypot(p.glideVx, p.glideVy) < 2.5) {
        p.glideVx = 0;
        p.glideVy = 0;
        p.isGliding = false;
      }

      // Movement & collision detection
      const moveDx = p.glideVx * dt;
      const moveDy = p.glideVy * dt;
      const screenData = buildTreelineScreen5();

      // Test X
      let nextPxX = p.pxX + moveDx;
      const testFootX = nextPxX + 8;
      const testFootY = p.pxY + 14;
      const testTileX = Math.floor(testFootX / TILE_SIZE);
      const testTileY = Math.floor(testFootY / TILE_SIZE);
      const isSolidX = (screenData.solid[testTileY]?.[testTileX] ?? true) ||
        treelineNpcsRef.current.some(n => n.isActive && n.x === testTileX && n.y === testTileY);

      if (isSolidX) {
        p.glideVx = 0;
        nextPxX = p.pxX;
      } else {
        const isNextIceX = isTreelineIceTile(testTileX, testTileY);
        if (!isNextIceX) {
          p.glideVx = 0;
          p.glideVy = 0;
          p.isGliding = false;
          p.pxX = testTileX * TILE_SIZE;
          p.gridX = testTileX;
          p.fromX = testTileX;
          p.targetX = testTileX;
          p.isMoving = false;
          p.walkStep = 0;
          gameAudio.playFootstepStone();
          triggerHaptics(25);
        } else {
          p.pxX = nextPxX;
        }
      }

      // Test Y
      if (p.isGliding) {
        let nextPxY = p.pxY + moveDy;
        const testFootX2 = p.pxX + 8;
        const testFootY2 = nextPxY + 14;
        const testTileX2 = Math.floor(testFootX2 / TILE_SIZE);
        const testTileY2 = Math.floor(testFootY2 / TILE_SIZE);
        const isSolidY = (screenData.solid[testTileY2]?.[testTileX2] ?? true) ||
          treelineNpcsRef.current.some(n => n.isActive && n.x === testTileX2 && n.y === testTileY2);

        if (isSolidY) {
          p.glideVy = 0;
          nextPxY = p.pxY;
        } else {
        const isNextIceY = isTreelineIceTile(testTileX2, testTileY2);
        if (!isNextIceY) {
          p.glideVx = 0;
          p.glideVy = 0;
          p.isGliding = false;
          p.pxY = testTileY2 * TILE_SIZE;
          p.gridY = testTileY2;
          p.fromY = testTileY2;
          p.targetY = testTileY2;
          p.isMoving = false;
          p.walkStep = 0;
          gameAudio.playFootstepSnow();
          triggerHaptics(25);
        } else {
            p.pxY = nextPxY;
          }
        }
      }

      p.gridX = Math.floor((p.pxX + 8) / TILE_SIZE);
      p.gridY = Math.floor((p.pxY + 14) / TILE_SIZE);
      p.fromX = p.gridX;
      p.targetX = p.gridX;
      p.walkStep = 0; // Poised coasting stance, stops footstep pumping!

      // Generate Crystalline Dual-Blade Skate Trails & Ice Shimmer Particles
      const curSpeedNow = Math.hypot(p.glideVx, p.glideVy);
      const curFx = p.pxX + 8;
      const curFy = p.pxY + 14;

      if (curSpeedNow > 8) {
        if (!lastIceFootPosRef.current) {
          lastIceFootPosRef.current = { x: curFx, y: curFy };
        } else {
          const distMoved = Math.hypot(curFx - lastIceFootPosRef.current.x, curFy - lastIceFootPosRef.current.y);
          if (distMoved >= 2.0) {
            const nVx = p.glideVx / curSpeedNow;
            const nVy = p.glideVy / curSpeedNow;
            const perpX = -nVy * 1.5;
            const perpY = nVx * 1.5;

            iceSkateTrailsRef.current.push({
              x1: lastIceFootPosRef.current.x - perpX,
              y1: lastIceFootPosRef.current.y - perpY,
              x2: curFx - perpX,
              y2: curFy - perpY,
              alpha: 0.70,
              life: 0,
              maxLife: 2.2,
            });
            iceSkateTrailsRef.current.push({
              x1: lastIceFootPosRef.current.x + perpX,
              y1: lastIceFootPosRef.current.y + perpY,
              x2: curFx + perpX,
              y2: curFy + perpY,
              alpha: 0.70,
              life: 0,
              maxLife: 2.2,
            });

            lastIceFootPosRef.current = { x: curFx, y: curFy };
          }
        }

        if (Math.random() < 0.65) {
          const nVx = p.glideVx / curSpeedNow;
          const nVy = p.glideVy / curSpeedNow;
          iceShimmerParticlesRef.current.push({
            x: curFx + (Math.random() - 0.5) * 5,
            y: curFy + (Math.random() - 0.5) * 3,
            vx: -nVx * 10 + (Math.random() - 0.5) * 6,
            vy: -nVy * 10 + (Math.random() - 0.5) * 6 - 3,
            size: Math.random() < 0.5 ? 1 : 1.5,
            color: Math.random() < 0.6 ? '#ffffff' : '#bae6fd',
            alpha: 0.85,
            life: 0,
            maxLife: 0.45 + Math.random() * 0.4,
          });
        }

        const now = Date.now();
        if (now - lastSkateAudioTimeRef.current > 550) {
          gameAudio.playIceSkateGlide();
          lastSkateAudioTimeRef.current = now;
        }
      } else {
        lastIceFootPosRef.current = null;
      }
    }

    // 2. UPDATE PLAYER POSITION & SCREEN TRANSITIONS
    if (p.isMoving) {
      const stepSpeed = 4.5;
      const newProgress = Math.min(1, p.moveProgress + dt * stepSpeed);

      const curPxX = (p.fromX + (p.targetX - p.fromX) * newProgress) * TILE_SIZE;
      const curPxY = (p.fromY + (p.targetY - p.fromY) * newProgress) * TILE_SIZE;

      let stepIdx = 0;
      const strideFrame = (p.fromX + p.fromY) % 2 === 0 ? 1 : 3;
      if (newProgress < 0.65) {
        stepIdx = strideFrame;
      } else {
        stepIdx = 2;
      }

      if (newProgress >= 1) {
        const arrivedOnIce = curScreenId === 'TREELINE' && isTreelineIceTile(p.targetX, p.targetY);
        const launchVx = arrivedOnIce ? (p.dir === 'RIGHT' ? 76 : p.dir === 'LEFT' ? -76 : 0) : 0;
        const launchVy = arrivedOnIce ? (p.dir === 'DOWN' ? 76 : p.dir === 'UP' ? -76 : 0) : 0;

        overworldPlayerRef.current = {
          gridX: p.targetX,
          gridY: p.targetY,
          pxX: p.targetX * TILE_SIZE,
          pxY: p.targetY * TILE_SIZE,
          dir: p.dir,
          isMoving: false,
          moveProgress: 0,
          fromX: p.targetX,
          fromY: p.targetY,
          targetX: p.targetX,
          targetY: p.targetY,
          walkStep: 0,
          isGliding: arrivedOnIce,
          glideVx: launchVx,
          glideVy: launchVy,
        };

        if (arrivedOnIce) {
          gameAudio.playIceSkateGlide();
          triggerHaptics(20);
        }

        // Canto I (HARBOR) Door to THE BIGHT BOATHOUSE (X: 26, Y: 19)
        if (curScreenId === 'HARBOR' && p.targetX === 26 && p.targetY === 19) {
          transitionOverworldScreen('ROOM_BOATHOUSE', 7, 10, 'UP');
          return;
        }

        // Boathouse Exit Mat (X: 7..8, Y: 11) -> Back to HARBOR at (X: 26, Y: 20, facing: 'DOWN')
        if ((curScreenId === 'ROOM_BOATHOUSE' || curScreenId === 'BOATHOUSE') && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('HARBOR', 26, 20, 'DOWN');
          return;
        }

        // Screen 0 (Canto I: HARBOR) North Exit (X: 12..13 or legacy 17..18, Y: 0) -> Transition to Screen 1 (Canto II: TOWN) at (17, 26, 'UP')
        if (curScreenId === 'HARBOR' && p.targetY === 0 && (p.targetX === 12 || p.targetX === 13 || p.targetX === 17 || p.targetX === 18)) {
          transitionOverworldScreen('TOWN', 17, 26, 'UP');
          return;
        }

        // Screen 1 (Canto II: TOWN) South Exit (X: 17..18, Y: 27) -> Transition to Screen 0 (Canto I: HARBOR) at (12, 1, 'DOWN')
        if (curScreenId === 'TOWN' && p.targetY === 27 && (p.targetX === 17 || p.targetX === 18) && p.dir === 'DOWN') {
          transitionOverworldScreen('HARBOR', 12, 1, 'DOWN');
          return;
        }

        // Screen 1 (Canto II: TOWN) North Bridge Exit (X: 17..18, Y: 0) -> Transition to Screen 2 (Canto III: CLIFFS) at (17, 26, 'UP')
        if (curScreenId === 'TOWN' && p.targetY === 0 && (p.targetX === 17 || p.targetX === 18)) {
          transitionOverworldScreen('CLIFFS', 17, 26, 'UP');
          return;
        }

        // Screen 2 (Canto III: CLIFFS) South Entrance (X: 17..18, Y: 27) -> Transition to Screen 1 (Canto II: TOWN) at (17, 1, 'DOWN')
        if (curScreenId === 'CLIFFS' && p.targetY === 27 && (p.targetX === 17 || p.targetX === 18) && p.dir === 'DOWN') {
          transitionOverworldScreen('TOWN', 17, 1, 'DOWN');
          return;
        }

        // Screen 2 (Canto III: CLIFFS) North Ascent Trail (X: 17..18, Y: 0) -> Transition to Screen 3 (Canto IV: RUINS) at (17, 26, 'UP')
        if (curScreenId === 'CLIFFS' && p.targetY === 0 && (p.targetX === 17 || p.targetX === 18)) {
          transitionOverworldScreen('RUINS', 17, 26, 'UP');
          return;
        }

        // Screen 3 (Canto IV: RUINS) South Entrance (X: 17..18, Y: 27) -> Transition to Screen 2 (Canto III: CLIFFS) at (17, 1, 'DOWN')
        if (curScreenId === 'RUINS' && p.targetY === 27 && (p.targetX === 17 || p.targetX === 18) && p.dir === 'DOWN') {
          transitionOverworldScreen('CLIFFS', 17, 1, 'DOWN');
          return;
        }

        // Screen 3 (Canto IV: RUINS) North Exit (X: 17..18, Y: 0) -> Transition to Screen 4 (Canto V: TREELINE) at (17, 26, 'UP')
        if (curScreenId === 'RUINS' && p.targetY === 0 && (p.targetX === 17 || p.targetX === 18)) {
          transitionOverworldScreen('TREELINE', 17, 26, 'UP');
          return;
        }

        // Screen 4 (Canto V: TREELINE) South Entrance (X: 17..18, Y: 27) -> Transition to Screen 3 (Canto IV: RUINS) at (17, 1, 'DOWN')
        if (curScreenId === 'TREELINE' && p.targetY === 27 && (p.targetX === 17 || p.targetX === 18) && p.dir === 'DOWN') {
          transitionOverworldScreen('RUINS', 17, 1, 'DOWN');
          return;
        }

        // Screen 4 (Canto V: TREELINE) North Summit Gate (X: 17..18, Y: 0) -> Transition to Screen 5 (Canto VI: SUMMIT) at (17, 26, 'UP')
        if (curScreenId === 'TREELINE' && p.targetY === 0 && (p.targetX === 17 || p.targetX === 18)) {
          transitionOverworldScreen('SUMMIT', 17, 26, 'UP');
          return;
        }

        // Screen 5 (Canto VI: SUMMIT) South Grand Steps (X: 17..18, Y: 27) -> Transition to Screen 4 (Canto V: TREELINE) at (17, 1, 'DOWN')
        if (curScreenId === 'SUMMIT' && p.targetY === 27 && (p.targetX === 17 || p.targetX === 18) && p.dir === 'DOWN') {
          transitionOverworldScreen('TREELINE', 17, 1, 'DOWN');
          return;
        }

        // Screen 5 (SUMMIT) Door to THE LYRIC SANCTUARY (X: 7, Y: 13)
        if (curScreenId === 'SUMMIT' && p.targetY === 13 && p.targetX === 7) {
          transitionOverworldScreen('LYRIC_SANCTUARY', 7, 9, 'UP');
          return;
        }

        // Lyric Sanctuary Exit Door (X: 7..8, Y: 10) -> Back to SUMMIT outside Grove of Apple-Boughs (X: 7, Y: 14 facing DOWN)
        if (curScreenId === 'LYRIC_SANCTUARY' && p.targetY === 10 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('SUMMIT', 7, 14, 'DOWN');
          return;
        }

        // Screen 1 (TOWN) Door to THE RENTED ROOM (Magic Casements, X: 5, Y: 6)
        if (curScreenId === 'TOWN' && p.targetY === 6 && p.targetX === 5) {
          transitionOverworldScreen('RENTED_ROOM', 7, 9, 'UP');
          return;
        }

        // Screen 1 (TOWN) Door to CAFÉ DE FLORE (X: 13, Y: 6)
        if (curScreenId === 'TOWN' && p.targetY === 6 && p.targetX === 13) {
          transitionOverworldScreen('CAFE_DE_FLORE', 7, 10, 'UP');
          return;
        }

        // Screen 1 (TOWN) Door to SHAKESPEARE AND COMPANY (X: 23, Y: 6)
        if (curScreenId === 'TOWN' && p.targetY === 6 && p.targetX === 23) {
          transitionOverworldScreen('SHAKESPEARE_CO', 7, 10, 'UP');
          return;
        }

        // Café de Flore Exit Door (X: 7..8, Y: 11) -> Back to TOWN at (X: 13, Y: 7, 'DOWN')
        if ((curScreenId === 'CAFE_DE_FLORE' || curScreenId === 'ROOM_CAFE_DE_FLORE') && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TOWN', 13, 7, 'DOWN');
          return;
        }

        // Shakespeare and Company Exit Door (X: 7..8, Y: 11) -> Back to TOWN at (X: 23, Y: 7, 'DOWN')
        if ((curScreenId === 'SHAKESPEARE_CO' || curScreenId === 'ROOM_SHAKESPEARE_CO') && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TOWN', 23, 7, 'DOWN');
          return;
        }

        // Rented Room Exit Door (X: 7..8, Y: 10) -> Back to TOWN at (X: 5, Y: 7, 'DOWN')
        if (curScreenId === 'RENTED_ROOM' && p.targetY === 10 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TOWN', 5, 7, 'DOWN');
          return;
        }

        // Screen 1 (TOWN) Door to THE WEARY BLUES (Nightingale, X: 5, Y: 14)
        if (curScreenId === 'TOWN' && p.targetY === 14 && p.targetX === 5) {
          transitionOverworldScreen('NIGHTINGALE', 7, 10, 'UP');
          return;
        }

        // Nightingale Exit Door (X: 7..8, Y: 11) -> Back to TOWN at (X: 5, Y: 15, 'DOWN')
        if (curScreenId === 'NIGHTINGALE' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TOWN', 5, 15, 'DOWN');
          return;
        }

        // Screen 1 (TOWN) Door to THE 12:20 DINER (Lunch Counter, X: 30, Y: 14)
        if (curScreenId === 'TOWN' && p.targetY === 14 && p.targetX === 30) {
          transitionOverworldScreen('LUNCH_COUNTER', 7, 10, 'UP');
          return;
        }

        // Lunch Counter Exit Door (X: 7..8, Y: 11) -> Back to TOWN at (X: 30, Y: 15, 'DOWN')
        if (curScreenId === 'LUNCH_COUNTER' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TOWN', 30, 15, 'DOWN');
          return;
        }

        // Screen 2 (CLIFFS) Door to THE FORGE (X: 11, Y: 11)
        if (curScreenId === 'CLIFFS' && p.targetY === 11 && p.targetX === 11) {
          transitionOverworldScreen('FORGE', 7, 10, 'UP');
          return;
        }

        // Forge Exit Door (X: 7..8, Y: 11) -> Back to CLIFFS at (X: 11, Y: 12, 'DOWN')
        if (curScreenId === 'FORGE' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('CLIFFS', 11, 12, 'DOWN');
          return;
        }

        // Screen 2 (CLIFFS) Door to THE HOUSE OF GREEN WIND (Blue House, X: 25, Y: 20)
        if (curScreenId === 'CLIFFS' && p.targetY === 20 && p.targetX === 25) {
          transitionOverworldScreen('BLUE_HOUSE', 7, 10, 'UP');
          return;
        }

        // Blue House Exit Door (X: 7..8, Y: 11) -> Back to CLIFFS at (X: 25, Y: 21, 'DOWN')
        if (curScreenId === 'BLUE_HOUSE' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('CLIFFS', 25, 21, 'DOWN');
          return;
        }

        // Screen 3 (RUINS) Door to THE MERMAID TAVERN (Mountain Goat, X: 7, Y: 8)
        if (curScreenId === 'RUINS' && p.targetY === 8 && p.targetX === 7) {
          transitionOverworldScreen('MOUNTAIN_GOAT', 7, 10, 'UP');
          return;
        }

        // Mountain Goat Exit Door (X: 7..8, Y: 11) -> Back to RUINS at (X: 7, Y: 9, 'DOWN')
        if (curScreenId === 'MOUNTAIN_GOAT' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('RUINS', 7, 9, 'DOWN');
          return;
        }

        // Screen 3 (RUINS) Door to THE LIBRARY OF BABEL (Library, X: 28, Y: 9)
        if (curScreenId === 'RUINS' && p.targetY === 9 && p.targetX === 28) {
          transitionOverworldScreen('LIBRARY', 7, 10, 'UP');
          return;
        }

        // Library Exit Door (X: 7..8, Y: 11) -> Back to RUINS at (X: 28, Y: 10, 'DOWN')
        if (curScreenId === 'LIBRARY' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('RUINS', 28, 10, 'DOWN');
          return;
        }

        // Screen 4 (TREELINE) Door to THE ARIEL KITCHEN (Kitchen, X: 5, Y: 8)
        if (curScreenId === 'TREELINE' && p.targetY === 8 && p.targetX === 5) {
          transitionOverworldScreen('KITCHEN', 7, 10, 'UP');
          return;
        }

        // Kitchen Exit Door (X: 7..8, Y: 11) -> Back to TREELINE at (X: 5, Y: 9, 'DOWN')
        if (curScreenId === 'KITCHEN' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TREELINE', 5, 9, 'DOWN');
          return;
        }

        // Screen 4 (TREELINE) Gate to WOODLAND OF WEIR (Graveyard, X: 28, Y: 8)
        if (curScreenId === 'TREELINE' && p.targetY === 8 && p.targetX === 28) {
          transitionOverworldScreen('GRAVEYARD', 7, 10, 'UP');
          return;
        }

        // Graveyard Exit Gate (X: 7..8, Y: 11) -> Back to TREELINE at (X: 28, Y: 9, 'DOWN')
        if (curScreenId === 'GRAVEYARD' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TREELINE', 28, 9, 'DOWN');
          return;
        }

        // Screen 4 (TREELINE) Door to HOUSE OF POSSIBILITY (White House, X: 5, Y: 22)
        if (curScreenId === 'TREELINE' && p.targetY === 22 && p.targetX === 5) {
          transitionOverworldScreen('WHITE_HOUSE', 7, 9, 'UP');
          return;
        }

        // White House Exit Stairs (X: 7..8, Y: 10) -> Back to TREELINE at (X: 5, Y: 23, 'DOWN')
        if (curScreenId === 'WHITE_HOUSE' && p.targetY === 10 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TREELINE', 5, 23, 'DOWN');
          return;
        }

        // Screen 4 (TREELINE) Door to WALDEN CABIN (Hermitage, X: 28, Y: 20)
        if (curScreenId === 'TREELINE' && p.targetY === 20 && p.targetX === 28) {
          transitionOverworldScreen('HERMITAGE', 7, 10, 'UP');
          return;
        }

        // Hermitage Exit Door (X: 7..8, Y: 11) -> Back to TREELINE at (X: 28, Y: 21, 'DOWN')
        if (curScreenId === 'HERMITAGE' && p.targetY === 11 && (p.targetX === 7 || p.targetX === 8)) {
          transitionOverworldScreen('TREELINE', 28, 21, 'DOWN');
          return;
        }
      } else {
        overworldPlayerRef.current = {
          ...p,
          moveProgress: newProgress,
          pxX: curPxX,
          pxY: curPxY,
          walkStep: stepIdx,
        };
      }
    }
  };

  // --- CANVAS UPDATE & DRAW LOOP ---
  const update = (deltaTime: number) => {
    animTimeRef.current += deltaTime;

    if (currentScreen === 'OVERWORLD') {
      updateOverworld(deltaTime);
      return;
    }

    if (gameState.status !== 'PLAYING' || currentScreen !== 'BATTLE') return;

    if (turnStageRef.current === 'MOVE_VERSE' || turnStageRef.current === 'ENEMY_VERSE') {
      verseAnimTimerRef.current += deltaTime;
    }

    if (introEnemyOffsetXRef.current > 0) {
      introEnemyOffsetXRef.current = Math.max(0, introEnemyOffsetXRef.current - deltaTime * 600);
    }
    if (introPlayerOffsetXRef.current < 0) {
      introPlayerOffsetXRef.current = Math.min(0, introPlayerOffsetXRef.current + deltaTime * 600);
    }

    if (Math.abs(playerLungeXRef.current) > 0.1 || Math.abs(playerLungeYRef.current) > 0.1) {
      playerLungeXRef.current += (0 - playerLungeXRef.current) * Math.min(1, deltaTime * 8);
      playerLungeYRef.current += (0 - playerLungeYRef.current) * Math.min(1, deltaTime * 8);
    }
    if (Math.abs(enemyLungeXRef.current) > 0.1 || Math.abs(enemyLungeYRef.current) > 0.1) {
      enemyLungeXRef.current += (0 - enemyLungeXRef.current) * Math.min(1, deltaTime * 8);
      enemyLungeYRef.current += (0 - enemyLungeYRef.current) * Math.min(1, deltaTime * 8);
    }

    const isCrisis =
      currentScreenRef.current === 'BATTLE' &&
      gameState.status === 'PLAYING' &&
      playerHpRef.current <= playerMaxHp * 0.5;
    soundtrackEngine.setCrisis(isCrisis);

    const prevPlayerDisp = playerDisplayHpRef.current;
    const prevEnemyDisp = enemyDisplayHpRef.current;

    playerDisplayHpRef.current += (playerHpRef.current - playerDisplayHpRef.current) * Math.min(1, deltaTime * 6);
    enemyDisplayHpRef.current += (enemyHpRef.current - enemyDisplayHpRef.current) * Math.min(1, deltaTime * 6);

    const now = Date.now();
    if (
      (Math.abs(prevPlayerDisp - playerDisplayHpRef.current) > 0.4 ||
        Math.abs(prevEnemyDisp - enemyDisplayHpRef.current) > 0.4) &&
      now - lastHpTickAudioTimeRef.current > 75
    ) {
      gameAudio.playHpDrainTick();
      lastHpTickAudioTimeRef.current = now;
    }

    if (
      playerHpRef.current > 0 &&
      playerHpRef.current <= playerMaxHp * 0.25 &&
      turnStageRef.current === 'ACTIONS' &&
      now - lastLowHpWarningTimeRef.current > 1600
    ) {
      gameAudio.playLowHpAlarm();
      lastLowHpWarningTimeRef.current = now;
    }

    if (screenShakeRef.current > 0) {
      screenShakeRef.current = Math.max(0, screenShakeRef.current - deltaTime * 24);
    }
    if (playerFlashRef.current > 0) {
      playerFlashRef.current = Math.max(0, playerFlashRef.current - deltaTime * 2);
    }
    if (enemyFlashRef.current > 0) {
      enemyFlashRef.current = Math.max(0, enemyFlashRef.current - deltaTime * 2);
    }

    if (enemyHpRef.current <= 0 && (!bookAnimRef.current.active || !bookAnimRef.current.success)) {
      enemyFleeOffsetXRef.current += deltaTime * 550;
      enemyFleeAlphaRef.current = Math.max(0, enemyFleeAlphaRef.current - deltaTime * 1.8);
      if (Math.random() < 0.35 && enemyFleeAlphaRef.current > 0.1) {
        spawnParticles(500 + enemyFleeOffsetXRef.current, 105, '#d97706', 2);
      }
    }

    for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
      const ft = floatingTextsRef.current[i];
      ft.life += deltaTime;
      ft.y += ft.vy * deltaTime;
      if (ft.life >= ft.maxLife) {
        floatingTextsRef.current.splice(i, 1);
      }
    }

    if (vfxRef.current.active) {
      const v = vfxRef.current;
      v.timer += deltaTime;

      if (v.timer >= v.duration && !v.resolved) {
        v.resolved = true;
        v.active = false;

        if (activeMoveRef.current?.id === 'ITEM_CAPTURE') {
          const b = bookAnimRef.current;
          if (b.success) {
            b.phase = 'CAPTURED';
            soundtrackEngine.playVictoryFanfare();
            gameAudio.playLevelUpStinger();
            triggerHaptics([80, 50, 150]);
            const recruitBark = DUELIST_BATTLE_BARKS[enemyPoetRef.current.id]?.recruited || enemyPoetRef.current.dialogue.captured;
            const displayCap = recruitBark.startsWith('"') || recruitBark.startsWith('“') ? recruitBark : `“${recruitBark}”`;
            setDialogueLines([displayCap]);
            setOutcomeNarration(`${enemyPoetRef.current.name} was successfully recruited into your Anthology!`);
          } else {
            b.phase = 'FAILED';
            b.active = false;
            gameAudio.playErrorBuzz();
            triggerHaptics([100, 50, 100]);
            screenShakeRef.current = 10;
            setDialogueLines([`The verse eluded the folio!`]);
            setOutcomeNarration('The capture failed because health was outside the capture window!');
          }
          setTurnStage('MOVE_OUTCOME');
        } else if (activeMoveRef.current) {
          resolveMoveImpact(activeMoveRef.current);

          if (turnStageRef.current === 'MOVE_ANIMATING') {
            setTurnStage('MOVE_OUTCOME');
          } else if (turnStageRef.current === 'ENEMY_ANIMATING') {
            setTurnStage('ENEMY_OUTCOME');
          }
        }
      }
    }

    if (bookAnimRef.current.active) {
      const b = bookAnimRef.current;
      if (b.phase === 'FLYING') {
        b.progress = Math.min(1, b.progress + deltaTime * 1.5);
        const t = b.progress;
        b.currentX = b.startX + (b.targetX - b.startX) * t;
        const arcHeight = 90 * Math.sin(t * Math.PI);
        b.currentY = b.startY + (b.targetY - b.startY) * t - arcHeight;
      } else if (['WOBBLE_1', 'WOBBLE_2', 'WOBBLE_3'].includes(b.phase)) {
        b.wobbleTimer += deltaTime * 14;
        b.wobbleAngle = Math.sin(b.wobbleTimer) * 0.28;
      }
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.life += deltaTime;
      if (p.life >= p.maxLife) {
        particlesRef.current.splice(i, 1);
        continue;
      }
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.vRot && p.rotation !== undefined) {
        p.rotation += p.vRot * deltaTime;
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    prepareCanvas(ctx, canvasWidth, canvasHeight);

    if (currentScreenRef.current === 'OVERWORLD') {
      const curScreen = activeOverworldScreenRef.current;
      const currentNpcs =
        curScreen === 'CAFE_DE_FLORE' || curScreen === 'ROOM_CAFE_DE_FLORE'
          ? cafeNpcsRef.current
          : curScreen === 'SHAKESPEARE_CO' || curScreen === 'ROOM_SHAKESPEARE_CO'
          ? shakespeareCoNpcsRef.current
          : curScreen === 'ROOM_BOATHOUSE' || curScreen === 'BOATHOUSE'
          ? []
          : curScreen === 'LYRIC_SANCTUARY'
          ? lyricSanctuaryNpcsRef.current
          : curScreen === 'RENTED_ROOM'
          ? rentedRoomNpcsRef.current
          : curScreen === 'SUMMIT'
          ? summitNpcsRef.current
          : curScreen === 'HERMITAGE'
          ? hermitageNpcsRef.current
          : curScreen === 'WHITE_HOUSE'
          ? whiteHouseNpcsRef.current
          : curScreen === 'GRAVEYARD'
          ? graveyardNpcsRef.current
          : curScreen === 'KITCHEN'
          ? kitchenNpcsRef.current
          : curScreen === 'LIBRARY'
          ? libraryNpcsRef.current
          : curScreen === 'MOUNTAIN_GOAT'
          ? mountainGoatNpcsRef.current
          : curScreen === 'BLUE_HOUSE'
          ? blueHouseNpcsRef.current
          : curScreen === 'FORGE'
          ? forgeNpcsRef.current
          : curScreen === 'LUNCH_COUNTER'
          ? lunchNpcsRef.current
          : curScreen === 'NIGHTINGALE'
          ? nightingaleNpcsRef.current
          : curScreen === 'TREELINE'
          ? treelineNpcsRef.current
          : curScreen === 'RUINS'
          ? ruinsNpcsRef.current
          : curScreen === 'CLIFFS'
          ? cliffsNpcsRef.current
          : curScreen === 'TOWN'
          ? townNpcsRef.current
          : harborNpcsRef.current;

      drawHarborOverworldScreen(
        ctx,
        canvasWidth,
        canvasHeight,
        {
          x: overworldPlayerRef.current.pxX,
          y: overworldPlayerRef.current.pxY,
          dir: overworldPlayerRef.current.dir,
          isMoving: overworldPlayerRef.current.isMoving,
          walkStep: overworldPlayerRef.current.walkStep,
          isGliding: overworldPlayerRef.current.isGliding,
          glideVx: overworldPlayerRef.current.glideVx,
          glideVy: overworldPlayerRef.current.glideVy,
        },
        currentNpcs,
        animTimeRef.current,
        curScreen,
        {
          hasLaurel,
          weatherSeason: postGameSeason,
          weatherTransitionProgress: endingStage === 'READING_TRANSITION' ? endingTransitionProgress : 1.0,
          springPoet: springPoetStanding,
          landGoose: landGooseRef.current,
          waterGoose: waterGooseRef.current,
          coastalDog: coastalDogRef.current,
          iceSkateTrails: iceSkateTrailsRef.current,
          iceParticles: iceShimmerParticlesRef.current,
          snowBurstTimer: snowBurstTimerRef.current,
          interactionState: interactionCountsRef.current,
        },
      );
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    if (screenShakeRef.current > 0) {
      const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
      const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
      ctx.translate(Math.round(shakeX), Math.round(shakeY));
    }

    const currentArena = getArenaById(activeArenaId);
    const arenaBgAsset = assets[currentArena.bgAssetKey];

    drawPoetArenaBackdrop(
      ctx,
      currentArena,
      canvasWidth,
      canvasHeight,
      animTimeRef.current,
      arenaBgAsset,
    );

    const vignette = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 2,
      120,
      canvasWidth / 2,
      canvasHeight / 2,
      canvasWidth * 0.72,
    );
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const animTime = animTimeRef.current;
    const enemyBob = Math.sin(animTime * 2.3) * 3;
    const playerBob = Math.cos(animTime * 2.6) * 3.5;

    // Dignified Poetic Speaker Aura calculations during verse recitation
    const isPlayerReciting = turnStageRef.current === 'MOVE_VERSE';
    const isEnemyReciting = turnStageRef.current === 'ENEMY_VERSE';
    const vt = verseAnimTimerRef.current;

    let breathLift = 0;
    let auraAlpha = 0;
    let auraScale = 1.0;

    if (isPlayerReciting || isEnemyReciting) {
      if (vt < 0.45) {
        // Swells softly for 450ms
        const p = vt / 0.45;
        const ease = Math.sin(p * Math.PI * 0.5);
        breathLift = ease * 1.8; // 1-2px subtle upward drift of the bust as if taking a dignified breath to speak
        auraAlpha = ease;
        auraScale = 0.88 + ease * 0.22;
      } else if (vt < 1.1) {
        // Settles gently back
        const p = (vt - 0.45) / 0.65;
        const settle = Math.cos(p * Math.PI * 0.5);
        breathLift = 1.0 + settle * 0.8;
        auraAlpha = 0.55 + settle * 0.45;
        auraScale = 1.0 + settle * 0.1;
      } else {
        // Calm lingering poetic breath
        const cycle = Math.sin((vt - 1.1) * 2.0);
        breathLift = 1.0 + cycle * 0.35;
        auraAlpha = 0.55 + cycle * 0.08;
        auraScale = 1.0 + cycle * 0.04;
      }
    }

    // Enemy Platform & Speaker Aura
    const enemyPlatX = 405 + introEnemyOffsetXRef.current;
    const enemyPlatY = 118;
    const enemyPlatW = 190;
    const enemyPlatH = 58;
    const ePoet = enemyPoetRef.current;
    const enemyImg = assets[ePoet.spriteAssetKey || `poet_${ePoet.id.toLowerCase()}`];
    const enemyW = 144;
    const enemyH = 144;
    const enemyX = 500 - 72 + introEnemyOffsetXRef.current + enemyLungeXRef.current + enemyFleeOffsetXRef.current;
    const enemyLift = isEnemyReciting ? breathLift : 0;
    const enemyY = 6 + enemyLungeYRef.current + enemyBob - enemyLift;

    if (isEnemyReciting) {
      drawPoeticSpeakerAura(
        ctx,
        enemyPlatX + enemyPlatW / 2,
        enemyPlatY + enemyPlatH * 0.78,
        enemyX + enemyW / 2,
        enemyY + enemyH * 0.55,
        ePoet.season,
        auraAlpha,
        auraScale,
      );
    }

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(enemyPlatX + enemyPlatW / 2, enemyPlatY + enemyPlatH * 0.78, 88, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (
      assets['battle_platform_enemy'] &&
      assets['battle_platform_enemy'].complete &&
      assets['battle_platform_enemy'].naturalWidth > 0
    ) {
      ctx.drawImage(assets['battle_platform_enemy']!, enemyPlatX, enemyPlatY, enemyPlatW, enemyPlatH);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(500, 145, 90, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Enemy Sprite
    ctx.save();
    const isEnemyCaptured = bookAnimRef.current.active && bookAnimRef.current.phase === 'CAPTURED';
    if (!isEnemyCaptured && enemyFleeAlphaRef.current > 0.01) {
      ctx.globalAlpha = enemyFleeAlphaRef.current;
      if (enemyFlashRef.current > 0 && Math.floor(Date.now() / 70) % 2 === 0) {
        ctx.globalAlpha = 0.2 * enemyFleeAlphaRef.current;
      }
      ctx.imageSmoothingEnabled = false;
      drawPoetPortrait(ctx, ePoet, enemyX, enemyY, enemyW, false, enemyImg, true);
    }
    ctx.restore();

    // Player Platform & Speaker Aura
    const playerPlatX = 42 + introPlayerOffsetXRef.current;
    const playerPlatY = 265;
    const playerPlatW = 210;
    const playerPlatH = 64;
    const pPoet = playerPoetRef.current;
    const playerImg = assets[pPoet.spriteAssetKey || `poet_${pPoet.id.toLowerCase()}`];
    const playerW = 164;
    const playerH = 164;
    const playerX = 145 - 82 + introPlayerOffsetXRef.current + playerLungeXRef.current;
    const playerLift = isPlayerReciting ? breathLift : 0;
    const playerY = 132 + playerLungeYRef.current + playerBob - playerLift;

    if (isPlayerReciting) {
      drawPoeticSpeakerAura(
        ctx,
        playerPlatX + playerPlatW / 2,
        playerPlatY + playerPlatH * 0.8,
        playerX + playerW / 2,
        playerY + playerH * 0.55,
        pPoet.season,
        auraAlpha,
        auraScale,
      );
    }

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(playerPlatX + playerPlatW / 2, playerPlatY + playerPlatH * 0.8, 98, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (
      assets['battle_platform_player'] &&
      assets['battle_platform_player'].complete &&
      assets['battle_platform_player'].naturalWidth > 0
    ) {
      ctx.drawImage(assets['battle_platform_player']!, playerPlatX, playerPlatY, playerPlatW, playerPlatH);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(145, 300, 100, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Player Sprite
    ctx.save();
    if (playerFlashRef.current > 0 && Math.floor(Date.now() / 70) % 2 === 0) {
      ctx.globalAlpha = 0.2;
    }
    ctx.imageSmoothingEnabled = false;
    drawPoetPortrait(ctx, pPoet, playerX, playerY, playerW, false, playerImg, false);
    ctx.restore();

    // Capture Projectile
    if (bookAnimRef.current.active) {
      const b = bookAnimRef.current;
      ctx.save();
      ctx.translate(b.currentX, b.currentY);
      ctx.rotate(b.wobbleAngle);
      const itemSize = 48;
      drawAsset(
        ctx,
        assets[b.spriteKey || 'item_capture_book'],
        -itemSize / 2,
        -itemSize / 2,
        itemSize,
        itemSize,
        (fCtx) => {
          fCtx.fillStyle = '#FFDE00';
          fCtx.fillRect(-itemSize / 2, -itemSize / 2, itemSize, itemSize);
        },
      );
      ctx.restore();
    }

    // Particles
    for (const p of particlesRef.current) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(Math.round(p.x), Math.round(p.y), Math.max(1, p.size / 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Floating Text
    for (const ft of floatingTextsRef.current) {
      ctx.save();
      const alpha = Math.max(0, 1 - ft.life / ft.maxLife);
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${ft.size}px monospace`;
      ctx.fillStyle = '#000000';
      ctx.fillText(ft.text, ft.x + 1, ft.y + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  };

  const updateRef = useRef(update);
  const drawRef = useRef(draw);
  updateRef.current = update;
  drawRef.current = draw;

  // Overworld Grid Movement Helper
  const attemptOverworldMove = useCallback((targetDir: FacingDirection) => {
    if (isTransitioningScreenRef.current) return;
    if (isCinematicLocked) return;
    const p = overworldPlayerRef.current;
    if (overworldDialogueRef.current?.active) return;

    const curScreen = activeOverworldScreenRef.current;
    if (curScreen === 'TREELINE') {
      const footTileX = Math.floor((p.pxX + 8) / TILE_SIZE);
      const footTileY = Math.floor((p.pxY + 14) / TILE_SIZE);
      if (isTreelineIceTile(footTileX, footTileY)) {
        p.isGliding = true;
        p.dir = targetDir;
        p.walkStep = 0;
        const pushSpeed = 78;
        const curSpd = Math.hypot(p.glideVx, p.glideVy);
        if (curSpd < 10) {
          p.glideVx = (targetDir === 'RIGHT' ? pushSpeed : targetDir === 'LEFT' ? -pushSpeed : 0);
          p.glideVy = (targetDir === 'DOWN' ? pushSpeed : targetDir === 'UP' ? -pushSpeed : 0);
          const now = Date.now();
          if (now - lastSkateAudioTimeRef.current > 350) {
            gameAudio.playIceSkateGlide();
            lastSkateAudioTimeRef.current = now;
          }
          triggerHaptics(20);
        }
        return;
      }
    }

    if (p.isMoving) return;

    let targetX = p.gridX;
    let targetY = p.gridY;
    if (targetDir === 'UP') targetY -= 1;
    else if (targetDir === 'DOWN') targetY += 1;
    else if (targetDir === 'LEFT') targetX -= 1;
    else if (targetDir === 'RIGHT') targetX += 1;

    const isInterior =
      curScreen === 'CAFE_DE_FLORE' ||
      curScreen === 'ROOM_CAFE_DE_FLORE' ||
      curScreen === 'SHAKESPEARE_CO' ||
      curScreen === 'ROOM_SHAKESPEARE_CO' ||
      curScreen === 'ROOM_BOATHOUSE' ||
      curScreen === 'BOATHOUSE' ||
      curScreen === 'LYRIC_SANCTUARY' ||
      curScreen === 'RENTED_ROOM' ||
      curScreen === 'HERMITAGE' ||
      curScreen === 'WHITE_HOUSE' ||
      curScreen === 'GRAVEYARD' ||
      curScreen === 'KITCHEN' ||
      curScreen === 'LIBRARY' ||
      curScreen === 'NIGHTINGALE' ||
      curScreen === 'LUNCH_COUNTER' ||
      curScreen === 'FORGE' ||
      curScreen === 'BLUE_HOUSE' ||
      curScreen === 'MOUNTAIN_GOAT';
    const maxCols = isInterior ? 16 : HARBOR_COLS;
    const maxRows = isInterior ? 12 : HARBOR_ROWS;

    // Boundary check
    if (targetX < 0 || targetX >= maxCols || targetY < 0 || targetY >= maxRows) {
      overworldPlayerRef.current = { ...p, dir: targetDir };
      return;
    }

    // Strict barrier: Central water slipway in The Bight Boathouse (X: 5..10, Y: 4..8) is strictly solid (1)
    // Ensures the player cannot step into or walk underneath the water from any direction
    if ((curScreen === 'ROOM_BOATHOUSE' || curScreen === 'BOATHOUSE') && ((targetX >= 5 && targetX <= 10 && targetY >= 4 && targetY <= 8) || (targetX === 13 && targetY === 9))) {
      overworldPlayerRef.current = { ...p, dir: targetDir };
      return;
    }

    // DOOR SYSTEM & INTERIORS:
    // 0. In HARBOR:
    if (curScreen === 'HARBOR') {
      if (targetX === 26 && targetY === 19) {
        transitionOverworldScreen('ROOM_BOATHOUSE', 7, 10, 'UP');
        return;
      }
    }

    // 0b. In ROOM_BOATHOUSE:
    if (curScreen === 'ROOM_BOATHOUSE' || curScreen === 'BOATHOUSE') {
      if ((targetX === 7 || targetX === 8) && targetY === 11) {
        transitionOverworldScreen('HARBOR', 26, 20, 'DOWN');
        return;
      }
    }
    // 1. In TOWN:
    if (curScreen === 'TOWN') {
      if (targetX === 5 && targetY === 14) {
        transitionOverworldScreen('NIGHTINGALE', 7, 10, 'UP');
        return;
      }
      if (targetX === 30 && targetY === 14) {
        transitionOverworldScreen('LUNCH_COUNTER', 7, 10, 'UP');
        return;
      }
      if (targetX === 5 && targetY === 6) {
        transitionOverworldScreen('RENTED_ROOM', 7, 9, 'UP');
        return;
      }
      if (targetX === 13 && targetY === 6) {
        transitionOverworldScreen('CAFE_DE_FLORE', 7, 10, 'UP');
        return;
      }
      if (targetX === 23 && targetY === 6) {
        transitionOverworldScreen('SHAKESPEARE_CO', 7, 10, 'UP');
        return;
      }
    }

    // 2. In CLIFFS:
    if (curScreen === 'CLIFFS') {
      if (targetX === 11 && targetY === 11) {
        transitionOverworldScreen('FORGE', 7, 10, 'UP');
        return;
      }
      if (targetX === 25 && targetY === 20) {
        transitionOverworldScreen('BLUE_HOUSE', 7, 10, 'UP');
        return;
      }
    }

    // 3. In RUINS:
    if (curScreen === 'RUINS') {
      if (targetX === 7 && targetY === 8) {
        transitionOverworldScreen('MOUNTAIN_GOAT', 7, 10, 'UP');
        return;
      }
      if (targetX === 28 && targetY === 9) {
        transitionOverworldScreen('LIBRARY', 7, 10, 'UP');
        return;
      }
    }

    // 4. In TREELINE:
    if (curScreen === 'TREELINE') {
      if (targetX === 5 && targetY === 8) {
        transitionOverworldScreen('KITCHEN', 7, 10, 'UP');
        return;
      }
      if (targetX === 28 && targetY === 8) {
        transitionOverworldScreen('GRAVEYARD', 7, 10, 'UP');
        return;
      }
      if (targetX === 5 && targetY === 22) {
        transitionOverworldScreen('WHITE_HOUSE', 7, 9, 'UP');
        return;
      }
      if (targetX === 28 && targetY === 20) {
        transitionOverworldScreen('HERMITAGE', 7, 10, 'UP');
        return;
      }
    }

    // 5. In SUMMIT:
    if (curScreen === 'SUMMIT') {
      if (targetX === 7 && targetY === 13) {
        transitionOverworldScreen('LYRIC_SANCTUARY', 7, 9, 'UP');
        return;
      }
    }

    // Interior Exits
    if (curScreen === 'NIGHTINGALE' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TOWN', 5, 15, 'DOWN');
      return;
    }
    if (curScreen === 'LUNCH_COUNTER' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TOWN', 30, 15, 'DOWN');
      return;
    }
    if (curScreen === 'RENTED_ROOM' && (targetX === 7 || targetX === 8) && targetY === 10) {
      transitionOverworldScreen('TOWN', 5, 7, 'DOWN');
      return;
    }
    if (curScreen === 'FORGE' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('CLIFFS', 11, 12, 'DOWN');
      return;
    }
    if (curScreen === 'BLUE_HOUSE' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('CLIFFS', 25, 21, 'DOWN');
      return;
    }
    if (curScreen === 'MOUNTAIN_GOAT' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('RUINS', 7, 9, 'DOWN');
      return;
    }
    if (curScreen === 'LIBRARY' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('RUINS', 28, 10, 'DOWN');
      return;
    }
    if (curScreen === 'KITCHEN' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TREELINE', 5, 9, 'DOWN');
      return;
    }
    if (curScreen === 'GRAVEYARD' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TREELINE', 28, 9, 'DOWN');
      return;
    }
    if (curScreen === 'WHITE_HOUSE' && (targetX === 7 || targetX === 8) && targetY === 10) {
      transitionOverworldScreen('TREELINE', 5, 23, 'DOWN');
      return;
    }
    if (curScreen === 'HERMITAGE' && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TREELINE', 28, 21, 'DOWN');
      return;
    }
    if (curScreen === 'LYRIC_SANCTUARY' && (targetX === 7 || targetX === 8) && targetY === 10) {
      transitionOverworldScreen('SUMMIT', 7, 14, 'DOWN');
      return;
    }

    if ((curScreen === 'CAFE_DE_FLORE' || curScreen === 'ROOM_CAFE_DE_FLORE') && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TOWN', 13, 7, 'DOWN');
      return;
    }

    if ((curScreen === 'SHAKESPEARE_CO' || curScreen === 'ROOM_SHAKESPEARE_CO') && (targetX === 7 || targetX === 8) && targetY === 11) {
      transitionOverworldScreen('TOWN', 23, 7, 'DOWN');
      return;
    }

    const screenData =
      curScreen === 'ROOM_BOATHOUSE' || curScreen === 'BOATHOUSE'
        ? buildBoathouseScreen()
        : curScreen === 'LYRIC_SANCTUARY'
        ? buildLyricSanctuaryScreen()
        : curScreen === 'RENTED_ROOM'
        ? buildRentedRoomScreen()
        : curScreen === 'SUMMIT'
        ? buildSummitScreen6()
        : curScreen === 'HERMITAGE'
        ? buildHermitageScreen()
        : curScreen === 'WHITE_HOUSE'
        ? buildWhiteHouseScreen()
        : curScreen === 'GRAVEYARD'
        ? buildGraveyardScreen()
        : curScreen === 'KITCHEN'
        ? buildKitchenScreen()
        : curScreen === 'LIBRARY'
        ? buildLibraryScreen()
        : curScreen === 'MOUNTAIN_GOAT'
        ? buildMountainGoatScreen()
        : curScreen === 'BLUE_HOUSE'
        ? buildBlueHouseScreen()
        : curScreen === 'FORGE'
        ? buildForgeScreen()
        : curScreen === 'LUNCH_COUNTER'
        ? buildLunchCounterScreen()
        : curScreen === 'NIGHTINGALE'
        ? buildNightingaleScreen()
        : curScreen === 'TREELINE'
        ? buildTreelineScreen5()
        : curScreen === 'RUINS'
        ? buildRuinsScreen4()
        : curScreen === 'CLIFFS'
        ? buildCliffsScreen3()
        : curScreen === 'TOWN'
        ? buildTownScreen2()
        : buildHarborScreen1();

    const currentNpcs =
      curScreen === 'ROOM_BOATHOUSE' || curScreen === 'BOATHOUSE'
        ? []
        : curScreen === 'LYRIC_SANCTUARY'
        ? lyricSanctuaryNpcsRef.current
        : curScreen === 'RENTED_ROOM'
        ? rentedRoomNpcsRef.current
        : curScreen === 'SUMMIT'
        ? summitNpcsRef.current
        : curScreen === 'HERMITAGE'
        ? hermitageNpcsRef.current
        : curScreen === 'WHITE_HOUSE'
        ? whiteHouseNpcsRef.current
        : curScreen === 'GRAVEYARD'
        ? graveyardNpcsRef.current
        : curScreen === 'KITCHEN'
        ? kitchenNpcsRef.current
        : curScreen === 'LIBRARY'
        ? libraryNpcsRef.current
        : curScreen === 'MOUNTAIN_GOAT'
        ? mountainGoatNpcsRef.current
        : curScreen === 'BLUE_HOUSE'
        ? blueHouseNpcsRef.current
        : curScreen === 'FORGE'
        ? forgeNpcsRef.current
        : curScreen === 'LUNCH_COUNTER'
        ? lunchNpcsRef.current
        : curScreen === 'NIGHTINGALE'
        ? nightingaleNpcsRef.current
        : curScreen === 'TREELINE'
        ? treelineNpcsRef.current
        : curScreen === 'RUINS'
        ? ruinsNpcsRef.current
        : curScreen === 'CLIFFS'
        ? cliffsNpcsRef.current
        : curScreen === 'TOWN'
        ? townNpcsRef.current
        : harborNpcsRef.current;

    const isDanteBlockingTrail = curScreen === 'SUMMIT' && targetX === 12 && targetY === 4 && !capturedPoetIds.includes('DANTE');
    const isUnobstructedRuinsPassage =
      curScreen === 'RUINS' &&
      ((targetX === 18 && targetY >= 12 && targetY <= 14) ||
       ((targetX === 13 || targetX === 14) && targetY === 12) || // Culvert footbridge
       ((targetX >= 12 && targetX <= 15) && (targetY === 8 || targetY === 9)) || // Arched stone aqueduct bridge
       (targetX === 19 && targetY === 13) ||
       (targetX === 20 && targetY === 13) ||
       (targetX >= 16 && targetX <= 21 && (targetY === 14 || targetY === 17)) ||
       ((targetX === 16 || targetX === 21) && (targetY === 15 || targetY === 16)));
    const isSolid = !isUnobstructedRuinsPassage && (isDanteBlockingTrail || (screenData.solid[targetY]?.[targetX] ?? true));
    const isOccupiedByNpc = currentNpcs.some(
      (npc) =>
        npc.isActive &&
        !npc.isDissolving &&
        !npc.isRecruited &&
        !(npc.poetId && capturedPoetIds.includes(npc.poetId)) &&
        !((npc.id === 'npc_cavafy' || npc.poetId === 'CAVAFY') && (npc.cavafyRoutine?.phase === 'INSIDE' || (npc.opacity !== undefined && npc.opacity <= 0.05))) &&
        ((npc.x === targetX && npc.y === targetY) ||
          (Math.round((npc.pxX ?? npc.x * TILE_SIZE) / TILE_SIZE) === targetX &&
            Math.round((npc.pxY ?? npc.y * TILE_SIZE) / TILE_SIZE) === targetY) ||
          (npc.isMoving &&
            npc.movement?.type === 'PATH' &&
            npc.movement.stepTo?.x === targetX &&
            npc.movement.stepTo?.y === targetY) ||
          (npc.patrol &&
            npc.patrol.stepTo.x === targetX &&
            npc.patrol.stepTo.y === targetY)),
    );

    const lg = landGooseRef.current;
    const isOccupiedByGoose =
      curScreen === 'HARBOR' &&
      lg &&
      (Math.round(lg.x) === targetX && Math.round(lg.y) === targetY);

    const cd = coastalDogRef.current;
    const isOccupiedByDog =
      curScreen === 'CLIFFS' &&
      cd &&
      (Math.round(cd.x) === targetX && Math.round(cd.y) === targetY);

    if (isSolid || isOccupiedByNpc || isOccupiedByGoose || isOccupiedByDog) {
      overworldPlayerRef.current = { ...p, dir: targetDir };
      return;
    }

    // Start walking
    hasPlayerMovedRef.current = true;
    lastInputTimeRef.current = Date.now();

    if (treelineTriggerPosRef.current) {
      const dist = Math.hypot(targetX - treelineTriggerPosRef.current.x, targetY - treelineTriggerPosRef.current.y);
      if (dist >= 3) {
        treelineIdleTriggeredRef.current = false;
        treelineTriggerPosRef.current = null;
      }
    }

    const isPier = curScreen === 'HARBOR' && targetY >= 21 && targetY <= 23 && targetX >= 2 && targetX <= 15;
    const isStudioFloor = curScreen === 'CLIFFS' && targetX >= 13 && targetX <= 22 && targetY <= 2;
    const isInteriorFloor = curScreen === 'ROOM_BOATHOUSE' || curScreen === 'BOATHOUSE' || curScreen === 'LYRIC_SANCTUARY' || curScreen === 'RENTED_ROOM' || curScreen === 'HERMITAGE' || curScreen === 'NIGHTINGALE' || curScreen === 'WHITE_HOUSE' || curScreen === 'BLUE_HOUSE' || curScreen === 'MOUNTAIN_GOAT' || curScreen === 'LIBRARY' || curScreen === 'KITCHEN' || curScreen === 'FORGE';
    const isTargetIce = curScreen === 'TREELINE' && isTreelineIceTile(targetX, targetY);
    const isTargetSnow = (curScreen === 'TREELINE' && !isTargetIce) || (curScreen === 'SUMMIT' && !(targetY >= 7 && targetY <= 10 && targetX >= 16 && targetX <= 21));
    if (isTargetIce) {
      gameAudio.playIceSkateGlide();
    } else if (isTargetSnow) {
      gameAudio.playFootstepSnow();
    } else if (isPier || isStudioFloor || isInteriorFloor || (curScreen === 'SUMMIT' && targetY >= 7 && targetY <= 10 && targetX >= 16 && targetX <= 21)) {
      gameAudio.playFootstepWood();
    } else {
      gameAudio.playFootstepStone();
    }

    const startStride = (p.gridX + p.gridY) % 2 === 0 ? 1 : 3;
    overworldPlayerRef.current = {
      gridX: p.gridX,
      gridY: p.gridY,
      pxX: p.gridX * TILE_SIZE,
      pxY: p.gridY * TILE_SIZE,
      dir: targetDir,
      isMoving: true,
      moveProgress: 0,
      fromX: p.gridX,
      fromY: p.gridY,
      targetX,
      targetY,
      walkStep: startStride,
      isGliding: false,
      glideVx: 0,
      glideVy: 0,
    };
  }, [isCinematicLocked, transitionOverworldScreen]);

  // Mobile D-Pad Continuous Movement Ref & Handlers
  const dpadIntervalRef = useRef<number | null>(null);

  const startDpadMove = useCallback((dir: FacingDirection) => {
    attemptOverworldMove(dir);
    if (dpadIntervalRef.current) clearInterval(dpadIntervalRef.current);
    dpadIntervalRef.current = window.setInterval(() => {
      attemptOverworldMove(dir);
    }, 190);
  }, [attemptOverworldMove]);

  const stopDpadMove = useCallback(() => {
    if (dpadIntervalRef.current) {
      clearInterval(dpadIntervalRef.current);
      dpadIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (dpadIntervalRef.current) {
        clearInterval(dpadIntervalRef.current);
      }
    };
  }, []);

  const advanceTurnRef = useRef(advanceTurn);
  advanceTurnRef.current = advanceTurn;
  const attemptOverworldMoveRef = useRef(attemptOverworldMove);
  attemptOverworldMoveRef.current = attemptOverworldMove;
  const interactFacingTileRef = useRef(interactFacingTile);
  interactFacingTileRef.current = interactFacingTile;
  const advanceOpeningSceneRef = useRef(advanceOpeningScene);
  advanceOpeningSceneRef.current = advanceOpeningScene;
  const activateTitleOptionRef = useRef(activateTitleOption);
  activateTitleOptionRef.current = activateTitleOption;
  const chooseSpringPoetRef = useRef(chooseSpringPoet);
  chooseSpringPoetRef.current = chooseSpringPoet;
  const advanceEndingSequenceRef = useRef(advanceEndingSequence);
  advanceEndingSequenceRef.current = advanceEndingSequence;
  const dismissAwakeningOrDialogueRef = useRef(dismissAwakeningOrDialogue);
  dismissAwakeningOrDialogueRef.current = dismissAwakeningOrDialogue;
  const handleRunRef = useRef(handleRun);
  handleRunRef.current = handleRun;
  const startPlayerMoveRef = useRef(startPlayerMove);
  startPlayerMoveRef.current = startPlayerMove;
  const applyBagItemRef = useRef(applyBagItem);
  applyBagItemRef.current = applyBagItem;

  useEffect(() => {
    let raf = 0;
    const loop = (time: number) => {
      if (inputRef.current) {
        const confirmPressed = inputRef.current.actions.confirm;
        const cancelPressed = inputRef.current.actions.cancel;
        const upPressed = inputRef.current.actions.up;
        const downPressed = inputRef.current.actions.down;
        const leftPressed = inputRef.current.actions.left;
        const rightPressed = inputRef.current.actions.right;

        const screen = currentScreenRef.current;

        if (screen === 'TITLE') {
          if (upPressed && !lastUpRef.current) {
            setTitleMenuIndex((prev) => (prev > 0 ? prev - 1 : TITLE_MENU_ITEMS.length - 1));
            gameAudio.playHoverMicroTone();
          } else if (downPressed && !lastDownRef.current) {
            setTitleMenuIndex((prev) => (prev < TITLE_MENU_ITEMS.length - 1 ? prev + 1 : 0));
            gameAudio.playHoverMicroTone();
          } else if (confirmPressed && !lastConfirmRef.current) {
            activateTitleOptionRef.current(titleMenuIndexRef.current);
          }
        }

        if (screen === 'OPENING_SCENE') {
          if (confirmPressed && !lastConfirmRef.current) {
            advanceOpeningSceneRef.current();
          }
        }

        if (screen === 'OVERWORLD') {
          if (isSpringMenuOpen) {
            if (upPressed && !lastUpRef.current) {
              setSelectedSpringPoetIndex((prev) => Math.max(0, prev - 1));
              gameAudio.playHoverMicroTone();
            } else if (downPressed && !lastDownRef.current) {
              setSelectedSpringPoetIndex((prev) => Math.min(capturedPoetIds.length - 1, prev + 1));
              gameAudio.playHoverMicroTone();
            } else if (confirmPressed && !lastConfirmRef.current) {
              const targetId = capturedPoetIds[selectedSpringPoetIndexRef.current];
              if (targetId) chooseSpringPoetRef.current(targetId);
            } else if (cancelPressed && !lastCancelRef.current) {
              gameAudio.playMenuCancel();
              setIsSpringMenuOpen(false);
            }
          } else if (endingStageRef.current !== 'IDLE' && endingStageRef.current !== 'READING_TRANSITION' && endingStageRef.current !== 'BLACKOUT_WAIT') {
            if (confirmPressed && !lastConfirmRef.current) {
              advanceEndingSequenceRef.current();
            } else if (cancelPressed && !lastCancelRef.current) {
              if (endingStageRef.current === 'CREDITS') {
                advanceEndingSequenceRef.current();
              }
            }
          } else if (confirmPressed && !lastConfirmRef.current) {
            interactFacingTileRef.current();
          } else if (cancelPressed && !lastCancelRef.current && overworldDialogueRef.current?.active && !overworldDialogueRef.current.showChoiceMenu) {
            dismissAwakeningOrDialogueRef.current();
          } else if (!overworldDialogueRef.current?.active) {
            if (upPressed) {
              attemptOverworldMoveRef.current('UP');
            } else if (downPressed) {
              attemptOverworldMoveRef.current('DOWN');
            } else if (leftPressed) {
              attemptOverworldMoveRef.current('LEFT');
            } else if (rightPressed) {
              attemptOverworldMoveRef.current('RIGHT');
            }
          }
        }

        if (screen === 'BATTLE') {
          if (turnStageRef.current === 'ACTIONS') {
            if (leftPressed && !lastLeftRef.current) {
              setSelectedActionIndex((prev) => (prev % 2 === 1 ? prev - 1 : prev));
              gameAudio.playHoverMicroTone();
            } else if (rightPressed && !lastRightRef.current) {
              setSelectedActionIndex((prev) => (prev % 2 === 0 ? prev + 1 : prev));
              gameAudio.playHoverMicroTone();
            } else if (upPressed && !lastUpRef.current) {
              setSelectedActionIndex((prev) => (prev >= 2 ? prev - 2 : prev));
              gameAudio.playHoverMicroTone();
            } else if (downPressed && !lastDownRef.current) {
              setSelectedActionIndex((prev) => (prev < 2 ? prev + 2 : prev));
              gameAudio.playHoverMicroTone();
            }

            if (confirmPressed && !lastConfirmRef.current) {
              const idx = selectedActionIndexRef.current;
              if (idx === 0) {
                gameAudio.playConfirmSelect();
                triggerHaptics(30);
                setSelectedMoveIndex(0);
                setTurnStage('FIGHT_MOVES');
              } else if (idx === 1) {
                gameAudio.playConfirmSelect();
                triggerHaptics(30);
                setSelectedBagIndex(0);
                setTurnStage('BAG_MENU');
              } else if (idx === 2) {
                gameAudio.playConfirmSelect();
                triggerHaptics(30);
                setCurrentScreen('ANTHOLOGY');
              } else if (idx === 3) {
                handleRunRef.current();
              }
            }
          } else if (turnStageRef.current === 'FIGHT_MOVES') {
            const maxIdx = playerPoetRef.current.moves.length - 1;
            if (leftPressed && !lastLeftRef.current) {
              setSelectedMoveIndex((prev) => (prev % 2 === 1 ? prev - 1 : prev));
              gameAudio.playHoverMicroTone();
            } else if (rightPressed && !lastRightRef.current) {
              setSelectedMoveIndex((prev) => (prev % 2 === 0 && prev + 1 <= maxIdx ? prev + 1 : prev));
              gameAudio.playHoverMicroTone();
            } else if (upPressed && !lastUpRef.current) {
              setSelectedMoveIndex((prev) => (prev >= 2 ? prev - 2 : prev));
              gameAudio.playHoverMicroTone();
            } else if (downPressed && !lastDownRef.current) {
              setSelectedMoveIndex((prev) => (prev + 2 <= maxIdx ? prev + 2 : prev));
              gameAudio.playHoverMicroTone();
            }

            if (confirmPressed && !lastConfirmRef.current) {
              const chosenMove = playerPoetRef.current.moves[selectedMoveIndexRef.current];
              if (chosenMove) startPlayerMoveRef.current(chosenMove);
            }

            if (cancelPressed && !lastCancelRef.current) {
              gameAudio.playMenuCancel();
              setTurnStage('ACTIONS');
            }
          } else if (turnStageRef.current === 'BAG_MENU') {
            if (upPressed && !lastUpRef.current) {
              setSelectedBagIndex((prev) => Math.max(0, prev - 1));
              gameAudio.playHoverMicroTone();
            } else if (downPressed && !lastDownRef.current) {
              setSelectedBagIndex((prev) => Math.min(bagInventory.length - 1, prev + 1));
              gameAudio.playHoverMicroTone();
            }

            if (confirmPressed && !lastConfirmRef.current) {
              const chosenItem = bagInventory[selectedBagIndexRef.current];
              if (chosenItem) applyBagItemRef.current(chosenItem);
            }

            if (cancelPressed && !lastCancelRef.current) {
              gameAudio.playMenuCancel();
              setTurnStage('ACTIONS');
            }
          } else if (
            [
              'INTRO_APPEAR',
              'INTRO_SEND_OUT',
              'POET_INFO',
              'RUN_ATTEMPT',
              'TURN_STATUS_PROCESS',
              'MASTERPIECE_CINEMATIC',
              'MOVE_VERSE',
              'MOVE_OUTCOME',
              'ENEMY_VERSE',
              'ENEMY_OUTCOME',
            ].includes(turnStageRef.current)
          ) {
            if (confirmPressed && !lastConfirmRef.current) {
              advanceTurnRef.current(true);
            }
          }
        }

        lastConfirmRef.current = confirmPressed;
        lastCancelRef.current = cancelPressed;
        lastUpRef.current = upPressed;
        lastDownRef.current = downPressed;
        lastLeftRef.current = leftPressed;
        lastRightRef.current = rightPressed;
      }

      if (!isOptionsMenuOpenRef.current && (currentScreenRef.current === 'BATTLE' || currentScreenRef.current === 'OVERWORLD')) {
        stepperRef.current?.(time, (dt) => updateRef.current(dt));
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawRef.current(ctx);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isEnemyDefeatedOrVictory =
    currentScreen === 'BATTLE' && (enemyHp <= 0 || gameState.status === 'VICTORY' || captureMethod !== 'NONE');

  const currentTrackId: TrackId =
    currentScreen === 'BATTLE'
      ? (isEnemyDefeatedOrVictory
          ? 'VICTORY_FANFARE'
          : ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'].includes(activeEnemyPoetId)
          ? 'BOSS_DUEL'
          : 'BATTLE')
      : currentScreen === 'OVERWORLD'
      ? (isSpringMenuOpen || endingStage !== 'IDLE'
          ? 'EPILOGUE'
          : (activeOverworldScreen as TrackId))
      : currentScreen === 'GRAND_TOUR_MAP'
      ? 'ZEN'
      : currentScreen === 'ANTHOLOGY'
      ? 'ANTHOLOGY'
      : 'MENU';

  // Synchronize procedural soundtrack engine with current game track & mute state
  useEffect(() => {
    // Keep startup/preview instantaneous: do not trigger heavy audio synthesis on title screen before user interaction
    if (currentScreen === 'TITLE') {
      soundtrackEngine.stop();
      return;
    }
    if (!isOptionsMenuOpen) {
      void soundtrackEngine.play(currentTrackId);
    } else {
      soundtrackEngine.stop();
    }
  }, [currentTrackId, isOptionsMenuOpen, currentScreen]);

  useEffect(() => {
    soundtrackEngine.setMuted(isMusicMuted);
  }, [isMusicMuted]);

  // SELECTIVE STEM STRIPPING: Silence Voice 1 Lead during overworld & prologue dialogue only (Battle BGM plays full and uninterrupted)
  useEffect(() => {
    const isOverworldDialogueOpen =
      currentScreen === 'OVERWORLD' &&
      (Boolean(overworldDialogue?.active) ||
        isSpringMenuOpen ||
        (endingStage !== 'IDLE' && endingStage !== 'READING_TRANSITION'));

    const isOpeningDialogueOpen = currentScreen === 'OPENING_SCENE';

    const shouldSilenceLeadVoice = isOverworldDialogueOpen || isOpeningDialogueOpen;
    soundtrackEngine.setDucking(shouldSilenceLeadVoice);
  }, [
    currentScreen,
    overworldDialogue,
    isSpringMenuOpen,
    endingStage,
  ]);

  const isDialogueAdvanceable =
    (currentScreen === 'OPENING_SCENE' && !isOpeningBlackout) ||
    (currentScreen === 'BATTLE' &&
      gameState.status === 'PLAYING' &&
      [
        'INTRO_APPEAR',
        'INTRO_SEND_OUT',
        'POET_INFO',
        'RUN_ATTEMPT',
        'TURN_STATUS_PROCESS',
        'MASTERPIECE_CINEMATIC',
        'MOVE_VERSE',
        'MOVE_OUTCOME',
        'ENEMY_VERSE',
        'ENEMY_OUTCOME',
      ].includes(turnStage));

  const renderTypewriterDialogue = () => {
    let charCounter = 0;
    const totalChars = dialogueLines.join(' ').length;
    const isTextComplete = displayedChars >= totalChars;

    return (
      <div
        key={dialogueLines.join('|')}
        className="space-y-1 my-auto min-w-0 w-full overflow-hidden break-words transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-0.5">
        {turnStage === 'INTRO_APPEAR' && (
          <div
            className="flex items-center justify-between pb-1 mb-1.5"
            style={{
              borderBottom: '1px solid #262E4D',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              color: '#F4B41B',
            }}>
            <span className="flex items-center gap-1.5">
              <span>
                ⚔ {(preBattleDialogueIndex % 2 === 0 ? enemyPoet.name : playerPoet.name).toUpperCase()}
              </span>
            </span>
            <span
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                color: '#F4B41B',
              }}>
              {(preBattleDialogueIndex + 1)}/2
            </span>
          </div>
        )}
        <div className="relative">
          {dialogueLines.map((line, lIdx) => {
            const lineStart = charCounter;
            charCounter += line.length + 1;
            const sliceEnd = Math.max(0, displayedChars - lineStart);
            const visiblePart = line.slice(0, sliceEnd);
            return (
              <div
                key={lIdx}
                className="min-h-[1.3em] leading-relaxed text-base sm:text-lg md:text-[22px]"
                style={{
                  fontFamily: line.startsWith('“') || line.startsWith('"') ? 'Georgia, Garamond, serif' : "'VT323', monospace",
                  fontStyle: line.startsWith('“') || line.startsWith('"') ? 'italic' : 'normal',
                  fontSize: line.startsWith('“') || line.startsWith('"') ? '22px' : '23px',
                  letterSpacing: line.startsWith('“') || line.startsWith('"') ? 'normal' : '1px',
                  color: '#F4EFE6',
                }}>
                {visiblePart}
              </div>
            );
          })}

          {isDialogueAdvanceable && isTextComplete && (
            <div
              className="absolute right-0 bottom-0 flex items-center gap-1.5"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
                color: '#F4B41B',
              }}>
              <span
                className="w-2.5 h-2.5 animate-bounce shrink-0 inline-block"
                style={{
                  borderRadius: '0px',
                  background: '#F4B41B',
                }}
              />
              <span className="font-bold tracking-wider hidden sm:inline">
                [Z / TAP]
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const startGrandTourMatch = (poetId: string, index: number) => {
    setSelectedGameMode('GRAND_TOUR');
    setGrandTourCurrentIndex(index);
    const target = getPoetById(poetId);
    const heroId = capturedPoetIds.includes(activePlayerPoetId) ? activePlayerPoetId : capturedPoetIds[0] || 'MARY_OLIVER';
    initBattle(heroId, target.id, target.defaultArenaId || 'MISTY_BAMBOO_GROVE');
  };

  const isEnemyInCaptureWindow = checkCaptureWindow(
    enemyHp,
    enemyMaxHp,
    enemyStunTokens,
    enemySkippedByStunThisRound
  );

  const telegraphInfo = getTelegraphBannerInfo();

  return (
    <div
      onClick={() => {
        if (currentScreen === 'OPENING_SCENE') {
          advanceOpeningScene();
        } else if (currentScreen === 'OVERWORLD') {
          if (overworldDialogueRef.current?.active && !overworldDialogueRef.current.showChoiceMenu) {
            dismissAwakeningOrDialogue();
          } else if (endingStage !== 'IDLE' && endingStage !== 'READING_TRANSITION' && endingStage !== 'BLACKOUT_WAIT') {
            advanceEndingSequence();
          } else if (!overworldDialogueRef.current?.active && !isSpringMenuOpen) {
            interactFacingTile();
          }
        } else if (isDialogueAdvanceable) {
          advanceTurn(true);
        }
      }}
      className={`fixed inset-0 overflow-hidden touch-none flex flex-col items-center justify-center bg-[#0B0D19] text-[#000000] select-none p-1 sm:p-2.5 md:p-3.5 box-border font-mono ${
        isDialogueAdvanceable ? 'cursor-pointer' : ''
      }`}
      style={{ backgroundColor: '#0B0D19' }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        .prologue-quote {
          text-wrap: pretty;
          text-wrap: balance;
        }
        @keyframes prologueSlideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(1.5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        @keyframes verseLetterpressIn {
          0% {
            opacity: 0;
            transform: translateY(3px);
            filter: blur(0.8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }
        @keyframes softQuietBlink {
          0%, 100% {
            opacity: 0.95;
            transform: scale(1);
          }
          50% {
            opacity: 0.28;
            transform: scale(0.96);
          }
        }
        @keyframes floatingCoupletDrift {
          0% {
            opacity: 0;
            transform: translate(-50%, 0px);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -2px);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, -5px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -6px);
          }
        }
      `}</style>

      <BackgroundMusic
        url=""
        isPlaying={false}
        isMuted={isMusicMuted}
        volume={0.55}
      />

      {/* Asset Loading State Screen */}
      {!assetsReady && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0D19] flex flex-col items-center justify-center font-mono text-[#FFE89E] select-none p-4">
          <div
            className="p-6 text-center max-w-sm w-full flex flex-col items-center"
            style={{
              backgroundColor: '#141829',
              border: '3px solid #F4B41B',
              boxShadow: 'inset 0 0 0 2px #0B0D19, 0 8px 0 #06070E',
            }}>
            <div className="text-3xl mb-3 animate-bounce">📖</div>
            <div
              className="font-bold text-sm tracking-widest uppercase mb-2 text-[#F4B41B]"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>
              POCKET POETS
            </div>
            <div
              className="text-lg text-[#C6D0E0]"
              style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
              Preparing the Anthology...
            </div>
            <div className="w-full bg-[#0B0D19] h-2 border border-[#333C57] mt-4 overflow-hidden">
              <div className="bg-[#F4B41B] h-full w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TITLE SCREEN (Option 3: Retro Layered Pixel Backdrop - Direction 1) */}
      {/* ========================================================================= */}
      {currentScreen === 'TITLE' && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-40 bg-[#060919] flex flex-col items-center justify-between text-white overflow-hidden select-none font-mono">
          
          {/* Retro Layered Pixel Backdrop (GBA / SNES style mountain approach) */}
          <TitleRetroVistaCanvas />

          {/* Title Logo & Subhead Hero Area - Subtly balanced against upper twilight sky & mountain silhouette */}
          <div
            className="z-10 w-full flex flex-col items-center px-4 pointer-events-none"
            style={{
              position: 'absolute',
              top: 'clamp(140px, 28vh, 270px)',
              left: 0,
              right: 0,
            }}>
            <PocketPoetsTitleBanner />
          </div>

          {/* Menu Options Grouped Comfortably Below Water Horizon Line (Horizon rendered at 58.33%) */}
          <div
            className="z-10 w-full max-w-lg flex flex-col items-center space-y-1 sm:space-y-1.5 px-4"
            style={{
              position: 'absolute',
              top: 'calc(58.33% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
            <div className="w-full flex flex-col items-center space-y-1 sm:space-y-1.5">
              {TITLE_MENU_ITEMS.map((item, idx) => {
                const isSelected = titleMenuIndex === idx;
                const label = idx === 0 ? (hasStartedClimb || hasSavedClimb ? 'CONTINUE' : 'BEGIN') : item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTitleMenuIndex(idx);
                      activateTitleOption(idx);
                    }}
                    onMouseEnter={() => {
                      if (titleMenuIndex !== idx) {
                        setTitleMenuIndex(idx);
                        gameAudio.playHoverMicroTone();
                      }
                    }}
                    className="group relative flex items-center justify-center py-1.5 sm:py-2 px-4 cursor-pointer focus:outline-none transition-transform duration-150 min-h-[48px]">
                    <div className="flex items-center justify-center min-w-[260px] sm:min-w-[300px]">
                      {/* Golden Quill Cursor (✒) with hard pixel shadow */}
                      <span
                        className={`w-7 sm:w-8 text-right text-[#F4B41B] font-black text-lg sm:text-xl mr-2.5 select-none transition-all duration-150 ${
                          isSelected
                            ? 'opacity-100 translate-x-0 scale-110'
                            : 'opacity-0 -translate-x-3 pointer-events-none'
                        }`}
                        style={{
                          textShadow:
                            '0 2px 0 #0D0E17, 2px 2px 0 #0D0E17, -2px 0 0 #0D0E17, 0 -2px 0 #0D0E17, 2px 0 0 #0D0E17',
                        }}>
                        ✒
                      </span>

                      {/* Menu Option Text in Press Start 2P with hard 2px dark pixel shadow */}
                      <span
                        className={`font-black text-sm sm:text-base md:text-lg tracking-[3px] transition-colors duration-150 ${
                          isSelected
                            ? 'text-[#F4B41B]'
                            : 'text-[#7C8B9E] group-hover:text-[#A0B0C4]'
                        }`}
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          letterSpacing: '3px',
                          textShadow:
                            '0 2px 0 #0D0E17, 2px 2px 0 #0D0E17, -2px 2px 0 #0D0E17, 2px -2px 0 #0D0E17, -2px -2px 0 #0D0E17, 0 -2px 0 #0D0E17, 2px 0 0 #0D0E17, -2px 0 0 #0D0E17',
                        }}>
                        {label}
                      </span>

                      {/* Symmetrical right spacer keeping text centered */}
                      <span className="w-7 sm:w-8 ml-2.5 pointer-events-none" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls Footer / HUD in VT323 */}
          <div
            className="z-10 w-full flex flex-wrap items-center justify-center gap-3 sm:gap-5 pb-4 sm:pb-6 px-4 shrink-0 text-base sm:text-lg md:text-xl text-[#8A99AD] select-none font-normal absolute bottom-0 left-0 right-0"
            style={{
              fontFamily: "'VT323', monospace",
              letterSpacing: '1px',
              textShadow:
                '0 2px 0 #0D0E17, 1px 1px 0 #0D0E17, -1px 0 0 #0D0E17',
            }}>
            <span>
              <span className="text-[#F4B41B] font-bold">[↑↓]</span> SELECT
            </span>
            <span className="text-[#4B5563]">•</span>
            <span>
              <span className="text-[#F4B41B] font-bold">[ENTER / Z]</span> CONFIRM
            </span>
            <span className="text-[#4B5563]">•</span>
            <button
              type="button"
              onClick={toggleMusicMute}
              className="hover:text-[#F4B41B] transition-colors cursor-pointer flex items-center gap-1 font-bold">
              <span className="text-[#F4B41B]">[M]</span>
              <span>SOUND: {isMusicMuted ? 'OFF' : 'ON'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.5 OPENING SCENE (PROLOGUE: Pure frameless typography on #050508) */}
      {/* ========================================================================= */}
      {currentScreen === 'OPENING_SCENE' && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            advanceOpeningScene();
          }}
          className={`fixed inset-0 bg-[#050508] z-50 overflow-y-auto touch-auto flex flex-col justify-between p-4 sm:p-6 md:p-8 cursor-pointer select-none font-mono transition-opacity duration-300 ease-in-out ${
            isOpeningBlackout ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: '#050508' }}>
          
          {/* Top Bar: Progress counter and Skip button */}
          <div className="flex justify-between items-center text-xs text-stone-500 font-mono transition-opacity duration-200 z-10 w-full max-w-4xl mx-auto">
            <span className="text-[10px] sm:text-xs text-stone-500 tracking-widest uppercase">
              PROLOGUE • {openingSceneIndex + 1} / {OPENING_SCENE_DIALOGUE.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipOpeningScene();
              }}
              className="bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700 px-3.5 py-1.5 min-h-[44px] sm:min-h-[48px] rounded-md text-[10px] sm:text-xs uppercase font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center tracking-wider">
              {isMobile ? 'SKIP [TAP]' : 'SKIP [ESC]'}
            </button>
          </div>

          {/* Pure, Frameless Centered Typography */}
          <div
            key={slideRevealKey}
            className={`flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 py-8 text-center select-none ${
              isSlideDissolving || isInBlackWait ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transition: 'opacity 200ms ease-out',
              animation: isSlideDissolving || isInBlackWait
                ? 'none'
                : 'prologueSlideFadeIn 450ms cubic-bezier(0.16, 1, 0.3, 1) both',
            }}>
            {OPENING_SCENE_DIALOGUE[openingSceneIndex]?.speaker ? (
              <div
                className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#F4B41B] font-bold mb-4 sm:mb-6"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '11px',
                }}>
                {OPENING_SCENE_DIALOGUE[openingSceneIndex].speaker}
              </div>
            ) : (
              <div
                className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#F4B41B] font-bold mb-4 sm:mb-6"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '10px',
                }}>
                ✦ THE STARRY EMPYREAN ✦
              </div>
            )}

            <div
              className="prologue-quote leading-relaxed md:leading-[1.65] font-serif w-full mx-auto"
              style={{
                fontFamily: 'Georgia, Garamond, serif',
                fontSize: 'clamp(1.2rem, 2.4vw, 1.55rem)',
                maxWidth: '46ch',
                textWrap: 'balance' as any,
              }}>
              {(() => {
                const tokens = parsePrologueTokens(OPENING_SCENE_DIALOGUE[openingSceneIndex]?.text || '').tokens;
                const elements: React.ReactNode[] = [];

                for (let idx = 0; idx < tokens.length; idx++) {
                  // Pair the last two words in a non-breaking inline container to strictly avoid one-word hanging orphans
                  if (idx === tokens.length - 2 && tokens.length >= 2) {
                    const token1 = tokens[idx];
                    const token2 = tokens[idx + 1];
                    elements.push(
                      <span key={`${slideRevealKey}-last-pair`} className="inline-block whitespace-nowrap">
                        <span
                          className={`inline-block mr-[0.28em] ${
                            token1.isQuoted ? 'italic text-[#FEF08A]' : 'text-[#F4EFE6]'
                          }`}>
                          {token1.word}
                        </span>
                        <span
                          className={`inline-block ${
                            token2.isQuoted ? 'italic text-[#FEF08A]' : 'text-[#F4EFE6]'
                          }`}>
                          {token2.word}
                        </span>
                      </span>
                    );
                    idx++;
                    continue;
                  }

                  const token = tokens[idx];
                  elements.push(
                    <span
                      key={`${slideRevealKey}-${idx}`}
                      className={`inline-block mr-[0.28em] ${
                        token.isQuoted
                          ? 'italic text-[#FEF08A]'
                          : 'text-[#F4EFE6]'
                      }`}>
                      {token.word}
                    </span>
                  );
                }
                return elements;
              })()}
            </div>
          </div>

          {/* Understated Bottom Advance Cue */}
          <div className="w-full max-w-4xl mx-auto flex items-center justify-center py-2 z-10">
            <span
              className="text-[10px] sm:text-xs text-stone-500 font-mono tracking-widest uppercase transition-opacity duration-200"
              style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
              [Z / ENTER / TAP TO ADVANCE] ▶
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.6 NAME & CHARACTER CUSTOMIZATION */}
      {/* ========================================================================= */}
      {currentScreen === 'NAME_ENTRY' && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto touch-auto select-none p-3 sm:p-6 flex items-center justify-center font-mono"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #151A30 0%, #0B0D19 100%)',
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-5 sm:p-7 relative text-[#FFFFFF] animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor: '#141829',
              border: '2px solid #333C57',
              boxShadow: 'inset 0 0 0 2px #0B0D19, 0 8px 0 #06070E',
              borderRadius: '0px',
            }}>
            
            <div className="text-center mb-5">
              <div
                className="font-bold uppercase tracking-widest mb-1.5"
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '18px',
                  letterSpacing: '2px',
                  color: '#F4B41B',
                  textShadow: '0 2px 0 #0B0D19',
                }}>
                ✦ PARNASSUS ASCENT ✦
              </div>
              <h2
                className="font-bold uppercase tracking-wider text-center"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '18px',
                  lineHeight: '1.4',
                  color: '#FFE89E',
                  textShadow: '0 3px 0 #0B0D19',
                }}>
                CREATE YOUR READER
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-6">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center shrink-0">
                <button
                  type="button"
                  title="Click to turn"
                  onClick={rotatePreviewSprite}
                  className="relative p-3 flex items-center justify-center overflow-hidden cursor-pointer group transition-colors"
                  style={{
                    backgroundColor: '#0B0D19',
                    border: '2px solid #333C57',
                    boxShadow: 'inset 0 0 0 2px #06070E, 0 4px 0 #06070E',
                    borderRadius: '0px',
                  }}>
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]" />
                  <div
                    style={{
                      transform: isSpriteHopping ? 'translateY(-2px)' : 'translateY(0)',
                      transition: 'transform 65ms ease-out',
                    }}>
                    <PlayerLivePreview
                      customization={playerCustom}
                      direction={previewDir}
                      walkFrame={previewWalkFrame}
                      scale={4.5}
                      className="relative z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                    />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={rotatePreviewSprite}
                  className="tracking-wide mt-2 flex items-center gap-1.5 cursor-pointer hover:text-[#FFE89E] transition-colors"
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '16px',
                    letterSpacing: '1px',
                    color: '#8E9BB0',
                  }}>
                  <span>Click to turn</span>
                  <span style={{ color: '#F4B41B' }}>↻</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 w-full space-y-4">
                {/* NAME */}
                <div>
                  <div className="flex items-center justify-between uppercase mb-1">
                    <span
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '18px',
                        letterSpacing: '1.5px',
                        color: '#FFE89E',
                      }}>
                      NAME
                    </span>
                    <span
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '16px',
                        letterSpacing: '1px',
                        color: '#8E9BB0',
                      }}>
                      {nameInput.length}/10
                    </span>
                  </div>
                  <input
                    ref={nameInputRef}
                    type="text"
                    autoFocus
                    maxLength={10}
                    value={nameInput}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 10);
                      setNameInput(sanitized);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        submitPlayerName();
                      }
                    }}
                    placeholder="Reader"
                    className="w-full px-3 py-1.5 focus:outline-none tracking-wider placeholder:text-[#475375]"
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '22px',
                      color: '#FFE89E',
                      backgroundColor: '#0E1222',
                      border: '2px solid #333C57',
                      borderRadius: '0px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#F4B41B')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#333C57')}
                  />
                </div>

                {/* ATTIRE */}
                <div>
                  <div
                    className="uppercase mb-1"
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '18px',
                      letterSpacing: '1.5px',
                      color: '#FFE89E',
                    }}>
                    ATTIRE
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        gameAudio.playClothRustle();
                        setPlayerCustom((prev) => ({...prev, style: 'STYLE_A'}));
                      }}
                      className={`py-1.5 px-3 text-center cursor-pointer transition-transform duration-100 ${
                        playerCustom.style === 'STYLE_A'
                          ? 'hover:translate-y-[1px] hover:shadow-[0_3px_0_#9E6B00] active:translate-y-[2px] active:shadow-[0_2px_0_#9E6B00]'
                          : 'hover:border-[#434F75] hover:text-[#FFE89E]'
                      }`}
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '20px',
                        letterSpacing: '1px',
                        borderRadius: '0px',
                        ...(playerCustom.style === 'STYLE_A'
                          ? {
                              backgroundColor: '#F4B41B',
                              color: '#0B0D19',
                              border: '2px solid #FFE89E',
                              boxShadow: '0 4px 0 #9E6B00',
                              fontWeight: 'bold',
                            }
                          : {
                              backgroundColor: '#0E1222',
                              color: '#8E9BB0',
                              border: '2px solid #2A3350',
                              boxShadow: '0 4px 0 #080A14',
                            }),
                      }}>
                      Wayfarer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        gameAudio.playClothRustle();
                        setPlayerCustom((prev) => ({...prev, style: 'STYLE_B'}));
                      }}
                      className={`py-1.5 px-3 text-center cursor-pointer transition-transform duration-100 ${
                        playerCustom.style === 'STYLE_B'
                          ? 'hover:translate-y-[1px] hover:shadow-[0_3px_0_#9E6B00] active:translate-y-[2px] active:shadow-[0_2px_0_#9E6B00]'
                          : 'hover:border-[#434F75] hover:text-[#FFE89E]'
                      }`}
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '20px',
                        letterSpacing: '1px',
                        borderRadius: '0px',
                        ...(playerCustom.style === 'STYLE_B'
                          ? {
                              backgroundColor: '#F4B41B',
                              color: '#0B0D19',
                              border: '2px solid #FFE89E',
                              boxShadow: '0 4px 0 #9E6B00',
                              fontWeight: 'bold',
                            }
                          : {
                              backgroundColor: '#0E1222',
                              color: '#8E9BB0',
                              border: '2px solid #2A3350',
                              boxShadow: '0 4px 0 #080A14',
                            }),
                      }}>
                      Wanderer
                    </button>
                  </div>
                </div>

                {/* SKIN TONE */}
                <div>
                  <div
                    className="uppercase mb-1"
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '18px',
                      letterSpacing: '1.5px',
                      color: '#FFE89E',
                    }}>
                    SKIN TONE
                  </div>
                  <div className="flex items-center gap-3 py-1">
                    {(['FAIR', 'WARM', 'OLIVE', 'DARK'] as PlayerSkinTone[]).map((st) => {
                      const conf = SKIN_TONE_CONFIG[st];
                      const isSelected = playerCustom.skinTone === st;
                      return (
                        <button
                          type="button"
                          key={st}
                          title={conf.label}
                          onClick={() => {
                            gameAudio.playCrispClick();
                            setPlayerCustom((prev) => ({...prev, skinTone: st}));
                          }}
                          className="cursor-pointer relative flex items-center justify-center transition-transform hover:scale-105"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '0px',
                            backgroundColor: conf.previewColor,
                            border: '2px solid #0B0D19',
                            boxShadow: isSelected
                              ? '0 0 0 2px #FFE89E, inset 0 0 0 2px #0B0D19'
                              : 'inset 0 0 0 1px rgba(0,0,0,0.5)',
                            outline: isSelected ? '2px solid #FFE89E' : 'none',
                            outlineOffset: '1px',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={submitPlayerName}
              className="w-full py-2.5 sm:py-3 px-6 min-h-[48px] cursor-pointer flex items-center justify-center gap-2 transition-transform duration-100 hover:translate-y-[1px] hover:shadow-[0_3px_0_#9E6B00] active:translate-y-[2px] active:shadow-[0_2px_0_#9E6B00]"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '24px',
                letterSpacing: '2px',
                fontWeight: 'bold',
                backgroundColor: '#F4B41B',
                color: '#0B0D19',
                border: '2px solid #FFE89E',
                boxShadow: '0 4px 0 #9E6B00',
                borderRadius: '0px',
              }}>
              <span>{isMobile ? 'BEGIN JOURNEY →' : 'BEGIN JOURNEY [ENTER] →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OVERWORLD SCREEN (SCREEN 1: THE HARBOR & SCREEN 2: THE TOWN) */}
      {/* ========================================================================= */}
      {currentScreen === 'OVERWORLD' && (
        <div
          className="w-full max-w-4xl h-full max-h-[670px] flex flex-col min-h-0 min-w-0 overflow-hidden font-mono box-border relative shrink-0"
          style={{
            borderRadius: '0px',
            border: '4px solid #333C57',
            boxShadow: 'inset 0 0 0 4px #0B0D19, 0 12px 0 #06070E',
            backgroundColor: '#0E1120',
          }}>
          
          {/* Top Overworld HUD Bar */}
          <div
            className="h-10 px-3 flex items-center justify-between shrink-0 z-20"
            style={{
              background: '#141829',
              borderBottom: '2px solid #B8860B',
              opacity: isCinematicHudVisible ? 1 : 0,
              transform: isCinematicHudVisible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 600ms ease-out, transform 600ms ease-out',
              pointerEvents: isCinematicHudVisible ? 'auto' : 'none',
            }}>
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span
                className="px-2 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider flex-shrink-0"
                style={{
                  background: '#0B0D19',
                  border: '2px solid #F4B41B',
                  borderRadius: '0px',
                  color: '#FFE89E',
                  fontFamily: "'Press Start 2P', monospace",
                }}>
                {activeOverworldScreen === 'CAFE_DE_FLORE' || activeOverworldScreen === 'ROOM_CAFE_DE_FLORE'
                  ? 'CAFÉ DE FLORE'
                  : activeOverworldScreen === 'SHAKESPEARE_CO' || activeOverworldScreen === 'ROOM_SHAKESPEARE_CO'
                  ? 'SHAKESPEARE & CO.'
                  : activeOverworldScreen === 'ROOM_BOATHOUSE' || activeOverworldScreen === 'BOATHOUSE'
                  ? 'THE BIGHT BOATHOUSE'
                  : activeOverworldScreen === 'RENTED_ROOM'
                  ? 'THE RENTED ROOM'
                  : activeOverworldScreen === 'LYRIC_SANCTUARY'
                  ? 'THE LYRIC SANCTUARY'
                  : (activeOverworldScreen as string) === 'SUMMIT' || (activeOverworldScreen as string) === 'THE SUMMIT'
                  ? 'THE SUMMIT'
                  : activeOverworldScreen === 'HERMITAGE'
                  ? 'THE HERMITAGE'
                  : activeOverworldScreen === 'WHITE_HOUSE'
                  ? 'THE WHITE HOUSE'
                  : activeOverworldScreen === 'GRAVEYARD'
                  ? 'THE GRAVEYARD'
                  : activeOverworldScreen === 'KITCHEN'
                  ? 'THE KITCHEN'
                  : activeOverworldScreen === 'LIBRARY'
                  ? 'THE LIBRARY'
                  : activeOverworldScreen === 'MOUNTAIN_GOAT'
                  ? 'THE MOUNTAIN GOAT'
                  : activeOverworldScreen === 'FORGE'
                  ? 'THE FORGE'
                  : activeOverworldScreen === 'BLUE_HOUSE'
                  ? 'THE BLUE HOUSE'
                  : activeOverworldScreen === 'NIGHTINGALE'
                  ? 'THE NIGHTINGALE'
                  : activeOverworldScreen === 'LUNCH_COUNTER'
                  ? 'THE LUNCH COUNTER'
                  : activeOverworldScreen === 'TREELINE'
                  ? 'THE TREELINE'
                  : activeOverworldScreen === 'RUINS'
                  ? 'THE RUINS'
                  : activeOverworldScreen === 'CLIFFS'
                  ? 'THE CLIFFS'
                  : activeOverworldScreen === 'TOWN'
                  ? 'THE TOWN'
                  : 'THE HARBOR'}
              </span>
              <span className="text-[#C6D0E0] font-mono tracking-wider font-semibold">
                {displayReaderName}
              </span>
              <span
                className="text-base sm:text-lg tracking-wider truncate"
                style={{
                  fontFamily: "'VT323', monospace",
                  color: '#F4B41B',
                }}>
                {(() => {
                  const isPoetRecruited = (id: string): boolean => {
                    const norm = id.toUpperCase();
                    return (
                      capturedPoetIds.some((p) => p.toUpperCase() === norm) ||
                      playerLineup.some((p) =>
                        typeof p === 'string'
                          ? p.toUpperCase() === norm
                          : (p as any)?.id?.toUpperCase() === norm,
                      )
                    );
                  };

                  // Post-Credits / Laureate Completed
                  if (hasLaurel && postGameSeason !== null && endingStage === 'IDLE') {
                    return ' • (POET LAUREATE OF PARNASSUS)';
                  }

                  // Step 1: Has Walt Whitman joined the party?
                  if (!isPoetRecruited('WHITMAN')) {
                    return ' • (VISIT WHITMAN ON PIER)';
                  }

                  // Step 2: Has Mary Oliver been defeated or recruited?
                  if (!isPoetRecruited('MARY_OLIVER')) {
                    return ' • (DUEL MARY OLIVER)';
                  }

                  // Step 3: Has at least 1 Town poet been recruited/defeated?
                  const hasTownPoet = ['RUMI', 'HUGHES', 'DICKINSON', 'BAUDELAIRE'].some(isPoetRecruited);
                  if (!hasTownPoet) {
                    return ' • (SEEK POETS IN TOWN & THE NIGHTINGALE)';
                  }

                  // Step 4: Has at least 1 Cliffs poet been recruited/defeated?
                  const hasCliffsPoet = ['LORCA', 'NERUDA', 'BLAKE', 'ANGELOU'].some(isPoetRecruited);
                  if (!hasCliffsPoet) {
                    return ' • (TEST YOUR VERSE ON THE CLIFFS & FORGE)';
                  }

                  // Step 5: Has at least 1 Ruins poet been recruited/defeated?
                  const hasRuinsPoet = ['LI_BAI', 'BASHO', 'BUKOWSKI', 'SOR_JUANA'].some(isPoetRecruited);
                  if (!hasRuinsPoet) {
                    return ' • (GATHER AUTUMN VOICES IN THE RUINS)';
                  }

                  // Step 6: Has at least 1 Treeline poet been recruited/defeated?
                  const hasTreelinePoet = ['FROST', 'PLATH', 'THOREAU', 'POE'].some(isPoetRecruited);
                  if (!hasTreelinePoet) {
                    return ' • (BRAVE THE WINTER POETS OF THE WOODS)';
                  }

                  // Step 7: Summit Gauntlet
                  if (!isPoetRecruited('SAPPHO')) {
                    return ' • (TRIAL I: SEEK SAPPHO IN THE SANCTUARY)';
                  }
                  if (!isPoetRecruited('SHAKESPEARE')) {
                    return ' • (TRIAL II: CHALLENGE SHAKESPEARE ON STAGE)';
                  }
                  if (!isPoetRecruited('KEATS')) {
                    return ' • (TRIAL III: FACE KEATS ON THE WEST TERRACE)';
                  }
                  if (!isPoetRecruited('DANTE')) {
                    return ' • (FINAL TRIAL: FACE DANTE AT THE SPRING)';
                  }

                  if (!hasLaurel || postGameSeason === null) {
                    return ' • (APPROACH THE CASTALIAN SPRING)';
                  }

                  return ' • (POET LAUREATE OF PARNASSUS)';
                })()}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 mr-1 sm:mr-2">
              <button
                type="button"
                onClick={toggleMusicMute}
                style={{
                  borderRadius: '0px',
                  background: '#1B2138',
                  border: '1px solid #4D5C80',
                  color: '#FFE89E',
                  fontFamily: "'VT323', monospace",
                  boxShadow: '0 2px 0 #06070E',
                }}
                className="h-7 px-2.5 py-0 text-sm sm:text-base flex items-center gap-1.5 cursor-pointer hover:bg-[#252E4D] hover:border-[#F4B41B] hover:text-[#FFFFFF] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
                title="Mute or unmute all sound [M]">
                {isMusicMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                <span>[M] {isMusicMuted ? 'MUTED' : 'SOUND'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  gameAudio.playMenuCancel();
                  setCurrentScreen('TITLE');
                }}
                style={{
                  borderRadius: '0px',
                  background: '#1B2138',
                  border: '1px solid #4D5C80',
                  color: '#FFE89E',
                  fontFamily: "'VT323', monospace",
                  boxShadow: '0 2px 0 #06070E',
                }}
                className="h-7 px-2.5 py-0 text-sm sm:text-base flex items-center gap-1.5 cursor-pointer hover:bg-[#252E4D] hover:border-[#F4B41B] hover:text-[#FFFFFF] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
                title="Return to Title Menu">
                <ArrowLeft size={13} />
                <span>TITLE</span>
              </button>
            </div>
          </div>

          {/* Main 2D Overworld Viewport Area */}
          <div
            className="flex-1 relative w-full h-full min-h-0 overflow-hidden flex items-center justify-center bg-[#0E1120]"
            style={{ backgroundColor: '#0E1120' }}>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                aspectRatio: '640 / 360',
              }}
              className="block select-none"
            />

            {/* 6-Canto Floating Chapter Card Overlay across All 6 Exterior Biomes */}
            <div
              className={`absolute inset-0 pointer-events-none z-30 flex items-center justify-center p-4 ${
                isCantoCardVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transition: isCantoCardVisible
                  ? 'opacity 1100ms ease-out'
                  : 'opacity 1100ms ease-in-out',
              }}>
              <div
                className="px-6 py-4 sm:px-8 sm:py-5 text-center max-w-xl"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.92)',
                  border: '2px solid rgba(244, 180, 27, 0.85)',
                  boxShadow: '0 0 28px rgba(244, 180, 27, 0.30), inset 0 0 16px rgba(0, 0, 0, 0.75)',
                  borderRadius: '0px',
                  transform: isCantoCardVisible ? 'scale(1)' : 'scale(0.96)',
                  transition: isCantoCardVisible
                    ? 'transform 1100ms ease-out, opacity 1100ms ease-out'
                    : 'transform 1100ms ease-in-out, opacity 1100ms ease-in-out',
                }}>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '11px',
                    letterSpacing: '2.5px',
                    lineHeight: '1.6',
                    color: '#FFE89E',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  }}>
                  {cantoCardText}
                </div>
              </div>
            </div>

            {/* Mobile Touch Controls for Overworld */}
            {isMobile && currentScreen === 'OVERWORLD' && endingStage === 'IDLE' && !isSpringMenuOpen && !overworldDialogue?.active && (
              <div
                className="absolute inset-x-0 bottom-2 px-3 flex items-end justify-between pointer-events-none z-30 select-none">
                {/* Virtual D-Pad (Left side) with Continuous Movement on Hold */}
                <div className="grid grid-cols-3 gap-1 pointer-events-auto p-1 bg-black/60 backdrop-blur-xs rounded-xl border border-white/20 shadow-md">
                  <div />
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startDpadMove('UP');
                    }}
                    onPointerUp={stopDpadMove}
                    onPointerLeave={stopDpadMove}
                    onPointerCancel={stopDpadMove}
                    className="w-12 h-12 min-w-[48px] min-h-[48px] bg-[#1E243B] active:bg-[#F4B41B] active:text-black text-[#FFE89E] font-bold rounded-lg border border-[#4D5C80] flex items-center justify-center text-lg active:scale-95 shadow-sm">
                    ▲
                  </button>
                  <div />
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startDpadMove('LEFT');
                    }}
                    onPointerUp={stopDpadMove}
                    onPointerLeave={stopDpadMove}
                    onPointerCancel={stopDpadMove}
                    className="w-12 h-12 min-w-[48px] min-h-[48px] bg-[#1E243B] active:bg-[#F4B41B] active:text-black text-[#FFE89E] font-bold rounded-lg border border-[#4D5C80] flex items-center justify-center text-lg active:scale-95 shadow-sm">
                    ◀
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startDpadMove('DOWN');
                    }}
                    onPointerUp={stopDpadMove}
                    onPointerLeave={stopDpadMove}
                    onPointerCancel={stopDpadMove}
                    className="w-12 h-12 min-w-[48px] min-h-[48px] bg-[#1E243B] active:bg-[#F4B41B] active:text-black text-[#FFE89E] font-bold rounded-lg border border-[#4D5C80] flex items-center justify-center text-lg active:scale-95 shadow-sm">
                    ▼
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startDpadMove('RIGHT');
                    }}
                    onPointerUp={stopDpadMove}
                    onPointerLeave={stopDpadMove}
                    onPointerCancel={stopDpadMove}
                    className="w-12 h-12 min-w-[48px] min-h-[48px] bg-[#1E243B] active:bg-[#F4B41B] active:text-black text-[#FFE89E] font-bold rounded-lg border border-[#4D5C80] flex items-center justify-center text-lg active:scale-95 shadow-sm">
                    ▶
                  </button>
                </div>

                {/* Virtual Action Button (Right side: A / TALK) */}
                <div className="flex gap-2 pointer-events-auto p-1 bg-black/60 backdrop-blur-xs rounded-xl border border-white/20 shadow-md">
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      interactFacingTile();
                    }}
                    className="w-14 h-12 min-w-[48px] min-h-[48px] bg-[#F4B41B] active:bg-[#FFE89E] text-black font-black text-xs rounded-lg border border-white flex flex-col items-center justify-center active:scale-95 shadow-sm"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    <span>A</span>
                    <span className="text-[7px] font-sans font-bold tracking-tight">TALK</span>
                  </button>
                </div>
              </div>
            )}

            {/* Overworld Dialogue Box */}
            {overworldDialogue?.active && endingStage === 'IDLE' && (
              <div
                key={overworldDialogue.speakerName + (overworldDialogue.showChoiceMenu ? '_menu' : '_normal')}
                onClick={overworldDialogue.showChoiceMenu ? undefined : dismissAwakeningOrDialogue}
                className={`absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-40 p-3.5 sm:p-4 transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-1 flex flex-col ${overworldDialogue.showChoiceMenu ? 'gap-3.5' : 'sm:flex-row sm:items-center gap-3'} font-mono ${overworldDialogue.showChoiceMenu ? '' : 'cursor-pointer'}`}
                style={{
                  borderRadius: '0px',
                  background: '#141829',
                  border: '3px solid #FFE89E',
                  boxShadow: 'inset 0 0 0 3px #333C57, 0 6px 0 #06070E',
                }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                  <div
                    className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      borderRadius: '0px',
                      background: '#0B0D19',
                      border: '2px solid #F4B41B',
                      color: '#FFE89E',
                      fontFamily: "'Press Start 2P', monospace",
                    }}>
                    {overworldDialogue.speakerName}
                  </div>
                  <div
                    key={overworldDialogue.text}
                    className="flex-1 text-xs sm:text-sm md:text-base font-serif italic font-bold leading-relaxed animate-in fade-in duration-150"
                    style={{
                      color: '#F4EFE6',
                    }}>
                    {overworldDialogue.text}
                  </div>
                  {overworldDialogue.speakerName === 'AWAKENING' ? (
                    <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissAwakeningOrDialogue();
                        }}
                        style={{
                          borderRadius: '0px',
                          background: '#F4B41B',
                          color: '#0B0D19',
                          border: '2px solid #FFE89E',
                          boxShadow: '0 3px 0 #06070E',
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '10px',
                        }}
                        className="px-3.5 py-2 font-bold cursor-pointer flex items-center gap-1.5 active:scale-95 animate-pulse min-h-[44px]">
                        <span>AWAKEN</span>
                        <span className="hidden sm:inline">[ENTER]</span>
                        <span>▶</span>
                      </button>
                    </div>
                  ) : !overworldDialogue.showChoiceMenu && (
                    <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 animate-bounce shrink-0 inline-block"
                        style={{
                          borderRadius: '0px',
                          background: '#F4B41B',
                        }}
                      />
                      <span
                        className="px-2.5 py-0.5 text-sm sm:text-base font-normal uppercase"
                        style={{
                          borderRadius: '0px',
                          background: '#1E243B',
                          border: '2px solid #5A6988',
                          color: '#F4B41B',
                          fontFamily: "'VT323', monospace",
                        }}>
                        [Z / ENTER / TAP] ▶
                      </span>
                    </div>
                  )}
                </div>

                {overworldDialogue.showChoiceMenu && overworldDialogue.choiceOptions && (
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t-2 border-[#333C57] w-full">
                    {overworldDialogue.choiceOptions.map((opt) => {
                      const isFountain = overworldDialogue.speakerName === 'FOUNTAIN OF THE MUSES';
                      const labelText = isFountain
                        ? (opt.label === 'TALK' ? 'TOSS COIN' : opt.label === 'JOIN' ? 'DRINK' : 'LEAVE')
                        : opt.label;
                      const iconText = isFountain
                        ? (opt.label === 'TALK' ? '🪙' : opt.label === 'JOIN' ? '💧' : '↩')
                        : (opt.label === 'DUEL' ? '⚔' : opt.label === 'TALK' ? '💬' : opt.label === 'JOIN' ? '🤝' : '↩');

                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            opt.action();
                          }}
                          style={{
                            borderRadius: '0px',
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '10px',
                            boxShadow: '0 3px 0 #06070E',
                          }}
                          className={`px-4 py-2.5 min-h-[48px] min-w-[64px] font-bold cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                            opt.label === 'DUEL'
                              ? 'bg-[#EE1515] hover:bg-[#B80D0D] text-white border-2 border-[#FFE89E]'
                              : opt.label === 'TALK'
                              ? 'bg-[#F4B41B] hover:bg-[#FFE89E] text-[#0B0D19] border-2 border-[#FFE89E]'
                              : opt.label === 'JOIN'
                              ? 'bg-[#10B981] hover:bg-[#059669] text-white border-2 border-[#FFE89E]'
                              : 'bg-[#1E243B] hover:bg-[#2A3350] text-[#C5D1E0] border-2 border-[#5A6988]'
                          }`}>
                          <span>{iconText}</span>
                          <span>{labelText}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* THE ENDING SEQUENCE: POEM TITLE TEXT BOX */}
            {endingStage === 'POEM_TITLE' && (
              (() => {
                const poet = chosenEndingPoetId ? getPoetById(chosenEndingPoetId) : playerPoet;
                const heavyMove = poet.moves.find((m) => m.effectType === 'HEAVY');
                const heavyTitle = heavyMove ? `"${heavyMove.poemTitle || heavyMove.name}"` : `"${poet.quote}"`;
                return (
                  <div
                    key="ending_poem_title"
                    onClick={advanceEndingSequence}
                    className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-40 p-3.5 sm:p-4 cursor-pointer transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 font-mono"
                    style={{
                      borderRadius: '0px',
                      background: '#141829',
                      border: '3px solid #FFE89E',
                      boxShadow: 'inset 0 0 0 3px #333C57, 0 6px 0 #06070E',
                    }}>
                    <div
                      className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                      style={{
                        borderRadius: '0px',
                        background: '#0B0D19',
                        border: '2px solid #F4B41B',
                        color: '#FFE89E',
                        fontFamily: "'Press Start 2P', monospace",
                      }}>
                      {poet.name.toUpperCase()}
                    </div>
                    <div
                      className="flex-1 text-xs sm:text-sm md:text-base font-serif italic font-bold leading-relaxed"
                      style={{
                        color: '#F4EFE6',
                      }}>
                      {heavyTitle}
                    </div>
                    <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 animate-bounce shrink-0 inline-block"
                        style={{
                          borderRadius: '0px',
                          background: '#F4B41B',
                        }}
                      />
                      <span
                        className="px-2.5 py-0.5 text-sm sm:text-base font-normal uppercase"
                        style={{
                          borderRadius: '0px',
                          background: '#1E243B',
                          border: '2px solid #5A6988',
                          color: '#F4B41B',
                          fontFamily: "'VT323', monospace",
                        }}>
                        [Z / TAP] ▶
                      </span>
                    </div>
                  </div>
                );
              })()
            )}

            {/* THE ENDING SEQUENCE: LAUREL REVEAL TEXT BOX */}
            {endingStage === 'LAUREL_REVEAL' && (
              <div
                key="ending_laurel_reveal"
                onClick={advanceEndingSequence}
                className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-40 p-3.5 sm:p-4 cursor-pointer transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 font-mono"
                style={{
                  borderRadius: '0px',
                  background: '#141829',
                  border: '3px solid #FFE89E',
                  boxShadow: 'inset 0 0 0 3px #333C57, 0 6px 0 #06070E',
                }}>
                <div
                  className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{
                    borderRadius: '0px',
                    background: '#0B0D19',
                    border: '2px solid #F4B41B',
                    color: '#FFE89E',
                    fontFamily: "'Press Start 2P', monospace",
                  }}>
                  🌿 LAUREL
                </div>
                <div
                  className="flex-1 text-xs sm:text-sm md:text-base font-serif italic font-bold leading-relaxed"
                  style={{
                    color: '#F4EFE6',
                  }}>
                  The laurel is yours.
                </div>
                <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 animate-bounce shrink-0 inline-block"
                    style={{
                      borderRadius: '0px',
                      background: '#F4B41B',
                    }}
                  />
                  <span
                    className="px-2.5 py-0.5 text-sm sm:text-base font-normal uppercase"
                    style={{
                      borderRadius: '0px',
                      background: '#1E243B',
                      border: '2px solid #5A6988',
                      color: '#F4B41B',
                      fontFamily: "'VT323', monospace",
                    }}>
                    [Z / TAP] ▶
                  </span>
                </div>
              </div>
            )}

            {/* SPRING INTERACTION CHOICE MENU (READ ONE) */}
            {isSpringMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs overflow-y-auto touch-auto p-3 sm:p-4 font-mono select-none animate-in fade-in duration-150">
                <div className="min-h-full flex flex-col items-center">
                  <div className="m-auto w-full max-w-md bg-[#FFFFFF] border-4 border-[#000000] rounded-2xl p-4 sm:p-5 shadow-[8px_8px_0_0_#000000] flex flex-col max-h-[85vh] my-2">
                    <div className="flex items-center justify-between border-b-2 border-[#000000] pb-2 mb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#000000]" />
                        <span className="font-black text-sm uppercase tracking-wider text-[#000000]">
                          Read one.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          gameAudio.playMenuCancel();
                          setIsSpringMenuOpen(false);
                        }}
                        className="text-xs font-black px-2.5 py-1 min-w-[36px] min-h-[36px] border border-[#000000] rounded bg-white hover:bg-stone-100 cursor-pointer flex items-center justify-center">
                        ✕
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto touch-auto space-y-1.5 pr-1 min-h-0">
                      {capturedPoetIds.map((pId, idx) => {
                        const poet = getPoetById(pId);
                        const isSelected = selectedSpringPoetIndex === idx;
                        const seasonMeta = SEASON_CONFIG[poet.season];
                        return (
                          <button
                            key={pId}
                            type="button"
                            onClick={() => chooseSpringPoet(pId)}
                            onMouseEnter={() => setSelectedSpringPoetIndex(idx)}
                            className={`w-full p-2.5 min-h-[48px] rounded-xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFDE00] border-[#000000] shadow-[2px_2px_0_0_#000000] scale-[1.01]'
                                : 'bg-white hover:bg-[#FFFDE7] border-[#000000]/40'
                            }`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base">{seasonMeta.symbol}</span>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-black truncate text-[#000000]">
                                  {poet.name} — {seasonMeta.name}
                                </div>
                                <div className="text-[10px] text-[#4B5563] font-bold">
                                  {poet.moves.find((m) => m.effectType === 'HEAVY')?.poemTitle || poet.moves.find((m) => m.effectType === 'HEAVY')?.name || poet.quote}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[#3B4CCA]">➔</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t-2 border-[#000000]/20 flex items-center justify-between text-[10px] text-[#4B5563] font-bold shrink-0">
                      <span>{isMobile ? 'TAP TO CHOOSE' : '[▲/▼] NAVIGATE'}</span>
                      <span>{isMobile ? 'CANCEL [✕]' : '[Z / TAP] CHOOSE'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* THE ENDING SEQUENCE: BLACKOUT DIALOGUES */}
            {endingStage === 'SEASON_EPIGRAPH' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  advanceEndingSequence();
                }}
                className="fixed inset-0 bg-[#000000] z-50 flex flex-col justify-end p-4 sm:p-6 md:p-8 cursor-pointer select-none font-mono">
                <div className="w-full max-w-3xl mx-auto mb-2 sm:mb-4">
                  <div className="bg-[#000000] border-4 border-[#FFFFFF] rounded-2xl p-1 shadow-[6px_6px_0_0_#FFFFFF]">
                    <div className="border-2 border-[#FFFFFF] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5 animate-in fade-in duration-200">
                      <div className="text-sm sm:text-base md:text-lg font-bold text-[#FFFFFF] leading-relaxed tracking-wide min-h-[3.0em] flex items-center font-mono">
                        {SEASON_EPIGRAPHS[postGameSeason || 'SPRING']}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/20">
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                          {postGameSeason || 'SPRING'} EPIGRAPH
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#FFDE00] font-black uppercase tracking-wider">
                          [Z / ENTER / TAP] ▶
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {endingStage === 'WHITMAN_LINE' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  advanceEndingSequence();
                }}
                className="fixed inset-0 bg-[#000000] z-50 flex flex-col justify-end p-4 sm:p-6 md:p-8 cursor-pointer select-none font-mono">
                <div className="w-full max-w-3xl mx-auto mb-2 sm:mb-4">
                  <div className="bg-[#000000] border-4 border-[#FFFFFF] rounded-2xl p-1 shadow-[6px_6px_0_0_#FFFFFF]">
                    <div className="border-2 border-[#FFFFFF] rounded-xl p-4 sm:p-5 flex flex-col gap-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center">
                        <span className="bg-[#FFFFFF] text-[#000000] px-3 py-0.5 rounded text-xs sm:text-sm font-black uppercase tracking-wider font-mono shadow-xs">
                          WHITMAN
                        </span>
                      </div>
                      <div className="text-sm sm:text-base md:text-lg font-bold text-[#FFFFFF] leading-relaxed tracking-wide min-h-[3.0em] flex items-center font-mono">
                        "I stop somewhere waiting for you."
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/20">
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                          IMMORTAL CAMERADO
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#FFDE00] font-black uppercase tracking-wider">
                          [Z / ENTER / TAP] ▶
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {endingStage === 'BLACKOUT_WAIT' && (
              <div className="fixed inset-0 bg-[#000000] z-50" />
            )}

            {/* THE ENDING SEQUENCE: CREDITS SEQUENCE */}
            {endingStage === 'CREDITS' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  advanceEndingSequence();
                }}
                className="fixed inset-0 bg-[#000000] z-50 flex flex-col items-center justify-start overflow-hidden cursor-pointer select-none font-mono">
                <div
                  className="w-full max-w-2xl px-4 text-center text-[#FFFFFF] space-y-2.5 font-mono leading-loose py-20 transition-transform duration-100 ease-linear"
                  style={{
                    transform: `translateY(${Math.max(-2600, 240 - creditsScrollY)}px)`,
                  }}>
                  {CREDITS_LINES.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line === 'POCKET POETS'
                          ? 'text-lg sm:text-2xl font-black text-[#FFDE00] tracking-widest my-4'
                          : line.startsWith('THE ')
                          ? 'text-sm sm:text-base font-black text-[#10B981] tracking-wider mt-6 mb-2 border-b border-white/20 pb-1'
                          : line === 'and you'
                          ? 'text-sm sm:text-base font-black text-[#38BDF8] tracking-widest mt-8'
                          : line === ''
                          ? 'h-3'
                          : 'text-xs sm:text-sm text-stone-200 font-bold tracking-wide'
                      }>
                      {line}
                    </div>
                  ))}
                  <div className="text-base sm:text-xl font-black text-[#FFDE00] tracking-widest mt-2 mb-16">
                    {displayReaderName}
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-stone-900/90 border border-stone-700 px-3 py-1 rounded text-[10px] text-stone-400 font-mono uppercase font-bold shadow-xs animate-pulse">
                  [CLICK / ANY KEY TO SKIP]
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THE GRAND TOUR GAUNTLET MAP */}
      {/* ========================================================================= */}
      {currentScreen === 'GRAND_TOUR_MAP' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[96%] max-w-4xl max-h-[92vh] bg-[#FFFFFF] border-4 border-[#000000] rounded-2xl p-4 sm:p-6 shadow-[10px_10px_0_0_#000000] text-[#000000] flex flex-col font-serif relative overflow-hidden box-border animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b-3 border-[#000000] pb-3 mb-3 font-mono shrink-0">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-[#3B4CCA]" />
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-black uppercase text-[#000000] tracking-wider">
                    THE GRAND TOUR: 4 SEASONS TO APEX
                  </h2>
                  <div className="text-[10px] text-[#4B5563] font-bold">
                    Challenge all 20 poets in historical sequence to complete your Anthology
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  gameAudio.playMenuCancel();
                  setCurrentScreen('TITLE');
                }}
                className="bg-[#FFFFFF] hover:bg-[#FFEB66] border-2 border-[#000000] text-[#000000] rounded-lg px-2.5 py-1 text-xs font-mono font-black transition-colors flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_0_#000000]">
                <ArrowLeft size={13} />
                <span>TITLE</span>
              </button>
            </div>

            <div className="bg-[#FFFDE7] border-3 border-[#000000] rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[3px_3px_0_0_#000000] font-mono shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <PoetPixelAvatar
                  poet={playerPoet}
                  size={44}
                  imageAsset={assets[playerPoet.spriteAssetKey || `poet_${playerPoet.id.toLowerCase()}`]}
                  className="rounded-lg border-2 border-[#000000] bg-[#FFFFFF] shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] text-[#3B4CCA] font-black uppercase">
                    ACTIVE DUELIST ({playerPoet.season} TYPE • {playerPoet.hp} MAX HP)
                  </div>
                  <div className="text-sm sm:text-base font-black truncate font-serif text-[#000000]">
                    {playerPoet.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    gameAudio.playCrispClick();
                    setCurrentScreen('ANTHOLOGY');
                  }}
                  className="py-1.5 px-3 bg-[#3B4CCA] hover:bg-[#2A3693] text-white rounded-lg border-2 border-[#000000] text-xs font-black shadow-[2px_2px_0_0_#000000] cursor-pointer">
                  LINEUP &amp; ROSTER
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 overflow-y-auto flex-1 pr-0.5 font-mono mb-3">
              {CHAPTER_GATES.map((gate) => {
                return (
                  <div key={gate.chapter} className="bg-[#F4F5F9] border-3 border-[#000000] rounded-xl p-2.5 flex flex-col justify-between shadow-[2px_2px_0_0_#000000]">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-[#000000]/20">
                        <span className="text-xs font-black uppercase" style={{ color: gate.paletteColor }}>
                          {gate.name}
                        </span>
                        <span className="text-[9px] font-bold bg-white px-1.5 py-0.2 rounded border border-[#000000]">
                          CH.{gate.chapter}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {gate.poetIds.map((pId) => {
                          const pObj = getPoetById(pId);
                          const isRecruited = capturedPoetIds.includes(pId);
                          const overallIndex = GRAND_TOUR_ROSTER.indexOf(pId);
                          const isUnlocked = overallIndex <= grandTourMaxUnlocked;

                          return (
                            <div
                              key={pId}
                              className={`p-2 rounded-lg border-2 flex items-center justify-between gap-1.5 transition-all ${
                                isRecruited
                                  ? 'bg-[#ECFDF5] border-[#10B981]'
                                  : isUnlocked
                                  ? 'bg-[#FFDE00] border-[#000000] shadow-xs'
                                  : 'bg-white/60 border-stone-300 opacity-60'
                              }`}>
                              <div className="flex items-center gap-2 min-w-0">
                                <PoetPixelAvatar
                                  poet={pObj}
                                  size={32}
                                  imageAsset={assets[pObj.spriteAssetKey || `poet_${pObj.id.toLowerCase()}`]}
                                  className={`rounded border border-[#000000] bg-white ${!isUnlocked ? 'grayscale' : ''}`}
                                />
                                <div className="min-w-0">
                                  <div className="text-[11px] font-black truncate text-[#000000]">
                                    {pObj.name.split(' ').pop()}
                                  </div>
                                  <div className="text-[9px] text-[#4B5563] truncate">
                                    {pObj.season} • {pObj.hp} HP
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isRecruited ? (
                                  <button
                                    type="button"
                                    onClick={() => startGrandTourMatch(pId, overallIndex)}
                                    className="px-2 py-1 bg-white hover:bg-[#FFFDE7] text-[#059669] text-[9px] font-black rounded border border-[#10B981] cursor-pointer">
                                    REPLAY
                                  </button>
                                ) : isUnlocked ? (
                                  <button
                                    type="button"
                                    onClick={() => startGrandTourMatch(pId, overallIndex)}
                                    className="px-2.5 py-1 bg-[#EE1515] hover:bg-[#B80D0D] text-white text-[9px] font-black rounded border border-[#000000] cursor-pointer shadow-xs animate-pulse">
                                    DUEL ⚔️
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-stone-400 font-bold px-1.5 py-0.5">
                                    LOCKED
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* 4. FREE DUEL MODE SELECTION */}
      {/* ========================================================================= */}
      {currentScreen === 'FREE_DUEL_SELECT' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[96%] max-w-4xl max-h-[92vh] bg-[#FFFFFF] border-4 border-[#000000] rounded-2xl p-4 sm:p-6 shadow-[10px_10px_0_0_#000000] text-[#000000] flex flex-col font-serif relative overflow-hidden box-border animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b-3 border-[#000000] pb-3 mb-3 font-mono shrink-0">
              <div className="flex items-center gap-2">
                <Swords size={20} className="text-[#3B4CCA]" />
                <h2 className="text-sm sm:text-base md:text-lg font-black uppercase text-[#000000] tracking-wider">
                  FREE DUEL EXHIBITION MATCH
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  gameAudio.playMenuCancel();
                  setCurrentScreen('TITLE');
                }}
                className="bg-[#FFFFFF] hover:bg-[#FFEB66] border-2 border-[#000000] text-[#000000] rounded-lg px-2.5 py-1 text-xs font-mono font-black transition-colors flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_0_#000000]">
                <ArrowLeft size={13} />
                <span>TITLE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-0.5 font-mono mb-3">
              <div className="bg-[#F4F5F9] border-3 border-[#000000] rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-[#3B4CCA] uppercase mb-2 flex items-center justify-between">
                    <span>YOUR CHAMPION ({Math.max(capturedPoetIds.length, 1)} UNLOCKED)</span>
                    <span className="text-[10px] text-[#000000]">PLAYER 1</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(capturedPoetIds.length > 0 ? capturedPoetIds : ['MARY_OLIVER', 'WHITMAN']).map((cId) => {
                      const pObj = getPoetById(cId);
                      const isSelected = freeDuelPlayerId === cId;
                      return (
                        <button
                          type="button"
                          key={cId}
                          onClick={() => {
                            gameAudio.playConfirmSelect();
                            setFreeDuelPlayerId(cId);
                          }}
                          className={`p-2 rounded-lg border-2 text-left flex items-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FFDE00] border-[#000000] shadow-xs scale-[1.02]'
                              : 'bg-white hover:bg-[#FFFDE7] border-[#000000]'
                          }`}>
                          <PoetPixelAvatar
                            poet={pObj}
                            size={36}
                            imageAsset={assets[pObj.spriteAssetKey || `poet_${pObj.id.toLowerCase()}`]}
                            className="rounded border border-[#000000] bg-white shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[11px] font-black truncate">{pObj.name.split(' ').pop()}</div>
                            <div className="text-[9px] text-[#4B5563]">{pObj.season} • {pObj.hp} HP</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(() => {
                  const pObj = getPoetById(freeDuelPlayerId);
                  return (
                    <div className="bg-white p-2.5 rounded-lg border-2 border-[#000000] text-xs space-y-1">
                      <div className="font-black text-[#000000]">{pObj.name} ({pObj.season} Season • {pObj.hp} Max HP)</div>
                      <div className="text-[10px] text-[#4B5563] italic font-serif">“{pObj.quote}”</div>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-[#F4F5F9] border-3 border-[#000000] rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-[#EE1515] uppercase mb-2 flex items-center justify-between">
                    <span>OPPONENT POET (ALL {ALL_POETS.length} AVAILABLE)</span>
                    <span className="text-[10px] text-[#000000]">CPU</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 max-h-[160px] overflow-y-auto pr-1">
                    {ALL_POETS.map((pObj) => {
                      const isSelected = freeDuelEnemyId === pObj.id;
                      return (
                        <button
                          type="button"
                          key={pObj.id}
                          onClick={() => {
                            gameAudio.playConfirmSelect();
                            setFreeDuelEnemyId(pObj.id);
                          }}
                          className={`p-1.5 rounded-lg border-2 text-left flex items-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#EE1515] text-white border-[#000000] shadow-xs scale-[1.02]'
                              : 'bg-white hover:bg-[#FFFDE7] text-[#000000] border-[#000000]'
                          }`}>
                          <PoetPixelAvatar
                            poet={pObj}
                            size={32}
                            facingLeft={true}
                            imageAsset={assets[pObj.spriteAssetKey || `poet_${pObj.id.toLowerCase()}`]}
                            className="rounded border border-[#000000] bg-white shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-black truncate">{pObj.name.split(' ').pop()}</div>
                            <div className={`text-[8px] ${isSelected ? 'text-white' : 'text-[#4B5563]'}`}>{pObj.season} • {pObj.hp} HP</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(() => {
                  const eObj = getPoetById(freeDuelEnemyId);
                  return (
                    <div className="bg-white p-2.5 rounded-lg border-2 border-[#000000] text-xs space-y-1">
                      <div className="font-black text-[#000000]">{eObj.name} ({eObj.season} Season • {eObj.hp} Max HP)</div>
                      <div className="text-[10px] text-[#4B5563] italic font-serif">“{eObj.dialogue.preFight}”</div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => {
                gameAudio.playConfirmSelect();
                setSelectedGameMode('FREE_DUEL');
                initBattle(freeDuelPlayerId, freeDuelEnemyId, freeDuelArenaId);
              }}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#FFDE00] via-[#FFEB66] to-[#FFDE00] hover:brightness-105 active:scale-[0.98] text-[#000000] font-black text-xs sm:text-sm rounded-xl border-3 border-[#000000] shadow-[3px_3px_0_0_#000000] transition-all cursor-pointer flex items-center justify-center gap-2 font-mono">
              <Swords size={18} className="text-[#3B4CCA]" />
              <span>COMMENCE FREE DUEL ➔</span>
            </button>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* 5. THE ANTHOLOGY */}
      {/* ========================================================================= */}
      {currentScreen === 'ANTHOLOGY' && (
        <MenuOverlay tone="neutral" zIndex={40}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[96%] max-w-5xl max-h-[92vh] bg-[#FFFFFF] border-4 border-[#000000] rounded-2xl p-4 sm:p-6 shadow-[10px_10px_0_0_#000000] text-[#000000] flex flex-col font-serif relative overflow-hidden box-border animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b-3 border-[#000000] pb-3 mb-3 font-mono shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#10B981]" />
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-black uppercase text-[#000000] tracking-wider">
                    THE IMMORTAL ANTHOLOGY ({capturedPoetIds.length}/20 RECRUITED)
                  </h2>
                  <div className="text-[10px] text-[#4B5563] font-bold">
                    Inspect all 20 poets, 4 standardized poems, seasonal advantages, and set your battle lineup
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  gameAudio.playMenuCancel();
                  if (turnStage === 'ACTIONS') {
                    setCurrentScreen('BATTLE');
                  } else if (selectedGameMode === 'CLIMB') {
                    setCurrentScreen('OVERWORLD');
                  } else {
                    setCurrentScreen('TITLE');
                  }
                }}
                className="bg-[#FFFFFF] hover:bg-[#FFEB66] border-2 border-[#000000] text-[#000000] rounded-lg px-2.5 py-1 text-xs font-mono font-black transition-colors flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_0_#000000]">
                <ArrowLeft size={13} />
                <span>{turnStage === 'ACTIONS' ? 'BACK TO DUEL' : selectedGameMode === 'CLIMB' ? 'BACK TO OVERWORLD' : 'TITLE'}</span>
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 overflow-hidden font-mono">
              <div className="w-full md:w-[48%] flex flex-col bg-[#F4F5F9] border-3 border-[#000000] rounded-xl p-2.5 min-h-0">
                <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                  {(['ALL', 'SPRING', 'SUMMER', 'AUTUMN', 'WINTER'] as const).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => {
                        gameAudio.playCrispClick();
                        setAnthologyFilterSeason(s);
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-black border cursor-pointer whitespace-nowrap ${
                        anthologyFilterSeason === s
                          ? 'bg-[#000000] text-white border-[#000000]'
                          : 'bg-white text-[#000000] border-[#000000]'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2 overflow-y-auto flex-1 pr-0.5">
                  {ALL_POETS.filter((p) => anthologyFilterSeason === 'ALL' || p.season === anthologyFilterSeason).map((poet) => {
                    const isRecruited = capturedPoetIds.includes(poet.id);
                    const isSelected = inspectedAnthologyPoetId === poet.id;
                    const isLead = activePlayerPoetId === poet.id;

                    return (
                      <button
                        type="button"
                        key={poet.id}
                        onClick={() => {
                          gameAudio.playCrispClick();
                          setInspectedAnthologyPoetId(poet.id);
                        }}
                        className={`p-1.5 rounded-lg border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#FFDE00] border-[#000000] shadow-xs scale-[1.03]'
                            : isRecruited
                            ? 'bg-white hover:bg-[#FFFDE7] border-[#000000]'
                            : 'bg-stone-200/70 border-stone-300 opacity-60'
                        }`}>
                        {isLead && (
                          <div className="absolute top-1 left-1 bg-[#3B4CCA] text-white text-[7px] font-black px-1 rounded">
                            LEAD
                          </div>
                        )}
                        <PoetPixelAvatar
                          poet={poet}
                          size={40}
                          imageAsset={assets[poet.spriteAssetKey || `poet_${poet.id.toLowerCase()}`]}
                          className={`rounded border border-[#000000] bg-white ${!isRecruited ? 'grayscale opacity-75' : ''}`}
                        />
                        <span className="text-[9px] font-bold uppercase truncate w-full mt-1">
                          {poet.name.split(' ').pop()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(() => {
                const insPoet = getPoetById(inspectedAnthologyPoetId);
                const isRecruited = capturedPoetIds.includes(insPoet.id);
                const isLead = activePlayerPoetId === insPoet.id;
                const sMeta = SEASON_CONFIG[insPoet.season];

                return (
                  <div className="flex-1 bg-white border-3 border-[#000000] rounded-xl p-3.5 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b-2 border-[#000000]/20 pb-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <PoetPixelAvatar
                            poet={insPoet}
                            size={56}
                            imageAsset={assets[insPoet.spriteAssetKey || `poet_${insPoet.id.toLowerCase()}`]}
                            className="rounded-xl border-2 border-[#000000] bg-[#FFFDE7] shadow-xs shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-[9px] font-black px-2 py-0.2 rounded text-white border border-[#000000]"
                                style={{ backgroundColor: sMeta.color }}>
                                {insPoet.season} SEASON ({sMeta.symbol})
                              </span>
                              <span className="text-[9px] font-black text-[#3B4CCA] bg-blue-50 px-1.5 py-0.2 rounded border border-[#3B4CCA]">
                                {insPoet.hp} MAX HP
                              </span>
                              {isRecruited ? (
                                <span className="text-[9px] font-black text-[#059669] bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#10B981]">
                                  RECRUITED ✓
                                </span>
                              ) : (
                                <span className="text-[9px] font-black text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-300">
                                  UNRECRUITED
                                </span>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg font-black font-serif text-[#000000] mt-0.5 truncate">
                              {insPoet.name}
                            </h3>
                            <div className="text-[10px] text-[#4B5563] font-serif italic">
                              {insPoet.title} • {insPoet.lifespan}
                            </div>
                          </div>
                        </div>

                        {isRecruited && (
                          <div>
                            {isLead ? (
                              <span className="text-[10px] font-black bg-[#3B4CCA] text-white px-2.5 py-1 rounded-lg border border-[#000000]">
                                ACTIVE LEAD
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  gameAudio.playConfirmSelect();
                                  setActivePlayerPoetId(insPoet.id);
                                  playerPoetRef.current = insPoet;
                                  setPlayerLineup((prev) => [insPoet.id, ...prev.filter((id) => id !== insPoet.id)]);
                                }}
                                className="px-3 py-1 bg-[#FFDE00] hover:bg-[#FFEB66] text-[#000000] text-[10px] font-black rounded-lg border-2 border-[#000000] shadow-xs cursor-pointer">
                                SET AS LEAD
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="bg-[#FFFDE7] p-2 rounded-lg border border-[#000000]/30 text-[10px]">
                        <span className="font-black text-[#000000]">Type Advantage: </span>
                        <span>{sMeta.name} beats {sMeta.beats} (1.5x damage). Resisted by {sMeta.weakTo} (0.75x).</span>
                      </div>

                      <div className="text-xs text-[#1e293b] font-serif italic border-l-3 border-[#3B4CCA] pl-2.5 py-0.5 bg-[#F4F5F9] rounded-r">
                        “{insPoet.quote}”
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase text-[#000000]">4 STANDARDIZED POEMS (READINGS REFILL EACH FIGHT):</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {insPoet.moves.map((m, idx) => (
                            <div key={m.id} className="p-1.5 bg-[#F4F5F9] rounded border border-[#000000] text-[10px]">
                              <div className="flex items-center justify-between font-black text-[#000000]">
                                <span className="truncate">{idx + 1}. {m.name}</span>
                                <span className="text-[9px] text-[#3B4CCA] bg-white px-1 rounded border border-[#000000]/30">
                                  {m.maxReadings} {m.maxReadings === 1 ? 'Reading' : 'Readings'}
                                </span>
                              </div>
                              <div className="text-[9px] text-[#4B5563] line-clamp-1">{m.descriptionShort}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </MenuOverlay>
      )}

      {/* ========================================================================= */}
      {/* 6. 2D BATTLE SCREEN */}
      {/* ========================================================================= */}
      {currentScreen === 'BATTLE' && (
        <div
          className="w-full max-w-5xl h-full max-h-[670px] flex flex-col min-h-0 min-w-0 overflow-hidden font-mono box-border relative shrink-0"
          style={{
            borderRadius: '0px',
            backgroundColor: '#0B0D19',
            border: '4px solid #333C57',
            boxShadow: 'inset 0 0 0 4px #0B0D19, 0 12px 0 #06070E',
          }}>
          
          <div
            className="flex-1 relative w-full h-full min-h-0 overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: '#0B0D19',
              background: 'radial-gradient(circle at center, #151A30 0%, #0B0D19 100%)',
            }}>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                aspectRatio: '640 / 360',
              }}
              className="block select-none"
            />

            {/* ENEMY HP BOX */}
            <div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-20 w-[190px] sm:w-[220px] md:w-[245px] p-2 sm:p-2.5 text-[#FFE89E] pointer-events-auto font-mono"
              style={{
                borderRadius: '0px',
                background: 'rgba(20, 24, 41, 0.94)',
                border: '2px solid #FFE89E',
                boxShadow: 'inset 0 0 0 2px #333C57, 4px 4px 0 #06070E',
              }}>
              <div
                className="flex items-center justify-between gap-1 mb-1.5 pb-1"
                style={{
                  borderBottom: '1px solid #333C57',
                }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">{SEASON_CONFIG[enemyPoet.season].symbol}</span>
                  <span
                    className="font-black tracking-wider uppercase truncate"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '11px',
                      color: '#FFE89E',
                    }}>
                    {enemyPoet.name.split(' ').pop()}
                  </span>
                </div>
                <span
                  className="font-bold px-1.5 py-0.5"
                  style={{
                    borderRadius: '0px',
                    background: '#0B0D19',
                    border: '1px solid #333C57',
                    color: '#FFE89E',
                    fontFamily: "'VT323', monospace",
                    fontSize: '14px',
                    letterSpacing: '1px',
                  }}>
                  {enemyPoet.season}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-1">
                {enemyStunTokens > 0 && (
                  <span
                    className="font-black px-1.5 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#8B5CF6',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    LOST FOR WORDS
                  </span>
                )}
                {enemyStunImmuneTurns > 0 && (
                  <span
                    className="font-black px-1.5 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#6B7280',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    IMMUNE (1T)
                  </span>
                )}
                {enemyBuffActive && (
                  <span
                    className="font-black px-1 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#3B4CCA',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    BUFF (1.35x)
                  </span>
                )}
                {enemyDebuffActive && (
                  <span
                    className="font-black px-1 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#EE1515',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    DEBUFF (0.70x)
                  </span>
                )}
                {isEnemyInCaptureWindow && (
                  <span
                    className="font-black px-1 py-0.2 animate-pulse"
                    style={{
                      borderRadius: '0px',
                      background: '#F4B41B',
                      color: '#0B0D19',
                      border: '1px solid #FFE89E',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    CAPTURE WINDOW (35%)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="font-black px-1.5 py-0.5 tracking-wider"
                  style={{
                    borderRadius: '0px',
                    background: '#F4B41B',
                    color: '#0B0D19',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '9px',
                  }}>
                  HP
                </span>
                <div
                  className="flex-1 h-3 sm:h-3.5 p-0.5"
                  style={{
                    borderRadius: '0px',
                    backgroundColor: '#0B0D19',
                    border: '2px solid #333C57',
                  }}>
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, (enemyHp / enemyMaxHp) * 100))}%`,
                      borderRadius: '0px',
                      backgroundColor: isEnemyInCaptureWindow
                        ? '#EE1515'
                        : enemyHp / enemyMaxHp > 0.5
                        ? '#2ECC71'
                        : '#F4B41B',
                    }}
                    className={`h-full transition-all duration-300 ${
                      isEnemyInCaptureWindow ? 'animate-pulse' : ''
                    }`}
                  />
                </div>
              </div>

              <div
                className="mt-1 flex items-center justify-between"
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '15px',
                  color: '#C5D1E0',
                  letterSpacing: '1px',
                }}>
                <span>{isEnemyInCaptureWindow ? 'READY TO BIND' : 'WILD POET'}</span>
                <span style={{ color: '#FFE89E' }}>{Math.ceil(Math.max(0, enemyHp))}/{enemyMaxHp}</span>
              </div>
            </div>

            {/* PLAYER HP BOX */}
            <div
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 z-20 w-[200px] sm:w-[230px] md:w-[255px] p-2 sm:p-2.5 text-[#FFE89E] pointer-events-auto font-mono"
              style={{
                borderRadius: '0px',
                background: 'rgba(20, 24, 41, 0.94)',
                border: '2px solid #FFE89E',
                boxShadow: 'inset 0 0 0 2px #333C57, 4px 4px 0 #06070E',
              }}>
              <div
                className="flex items-center justify-between gap-1 mb-1.5 pb-1"
                style={{
                  borderBottom: '1px solid #333C57',
                }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">{SEASON_CONFIG[playerPoet.season].symbol}</span>
                  <span
                    className="font-black tracking-wider uppercase truncate"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '11px',
                      color: '#FFE89E',
                    }}>
                    {playerPoet.name.split(' ').pop()}
                  </span>
                </div>
                <span
                  className="font-bold px-1.5 py-0.5"
                  style={{
                    borderRadius: '0px',
                    background: '#0B0D19',
                    border: '1px solid #333C57',
                    color: '#FFE89E',
                    fontFamily: "'VT323', monospace",
                    fontSize: '14px',
                    letterSpacing: '1px',
                  }}>
                  {playerPoet.season}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-1">
                {playerStunTokens > 0 && (
                  <span
                    className="font-black px-1.5 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#8B5CF6',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    LOST FOR WORDS
                  </span>
                )}
                {playerStunImmuneTurns > 0 && (
                  <span
                    className="font-black px-1.5 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#6B7280',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    IMMUNE (1T)
                  </span>
                )}
                {playerBuffActive && (
                  <span
                    className="font-black px-1 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#3B4CCA',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    BUFF (1.35x)
                  </span>
                )}
                {playerDebuffActive && (
                  <span
                    className="font-black px-1 py-0.2 text-white"
                    style={{
                      borderRadius: '0px',
                      background: '#EE1515',
                      border: '1px solid #333C57',
                      fontFamily: "'VT323', monospace",
                      fontSize: '13px',
                    }}>
                    DEBUFF (0.70x)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="font-black px-1.5 py-0.5 tracking-wider"
                  style={{
                    borderRadius: '0px',
                    background: '#F4B41B',
                    color: '#0B0D19',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '9px',
                  }}>
                  HP
                </span>
                <div
                  className="flex-1 h-3 sm:h-3.5 p-0.5"
                  style={{
                    borderRadius: '0px',
                    backgroundColor: '#0B0D19',
                    border: '2px solid #333C57',
                  }}>
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100))}%`,
                      borderRadius: '0px',
                      backgroundColor:
                        playerHp / playerMaxHp > 0.5
                          ? '#2ECC71'
                          : playerHp / playerMaxHp > 0.2
                          ? '#F4B41B'
                          : '#EE1515',
                    }}
                    className={`h-full transition-all duration-300 ${
                      playerHp / playerMaxHp <= 0.2 ? 'animate-pulse' : ''
                    }`}
                  />
                </div>
              </div>

              <div
                className="mt-1 flex items-center justify-between"
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '15px',
                  color: '#C5D1E0',
                  letterSpacing: '1px',
                }}>
                <span>LINEUP ({activeLineupIndexRef.current + 1}/{playerLineup.length})</span>
                <span style={{ color: '#FFE89E' }}>{Math.ceil(Math.max(0, playerHp))}/{playerMaxHp}</span>
              </div>
            </div>

            {/* MASTERPIECE CINEMATIC */}
            {turnStage === 'MASTERPIECE_CINEMATIC' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  advanceTurn(true);
                }}
                className="absolute inset-0 z-40 bg-[#000000]/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150 font-serif">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    advanceTurn(true);
                  }}
                  className="relative w-full max-w-lg bg-[#FFFFFF] border-4 border-[#000000] rounded-xl p-6 text-center flex flex-col items-center justify-center shadow-[8px_8px_0_0_#FFDE00]">
                  <span className="text-[#3B4CCA] font-mono font-black text-xs uppercase bg-[#FFDE00] px-3 py-1 rounded border-2 border-[#000000] mb-2">
                    ✦ {cinematicBanner} ✦
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#000000] mb-3">
                    {cinematicTitle}
                  </h3>
                  <div className="space-y-1 text-sm italic text-[#242424] font-serif mb-4">
                    {cinematicStanzas.map((l, i) => (
                      <p key={i}>{l}</p>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-black bg-[#FFDE00] border-2 border-[#000000] px-3 py-1 rounded-full animate-pulse">
                    CLICK ANYWHERE TO RECITE ▶
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* PRE-TURN ENEMY INTENT TELEGRAPH BANNER */}
          {['ACTIONS', 'FIGHT_MOVES', 'BAG_MENU'].includes(turnStage) && (
            <div
              className={`mx-2 sm:mx-3 mb-1 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 z-20 select-none animate-in fade-in slide-in-from-bottom-1 duration-200 ${
                telegraphInfo.isHeavy
                  ? 'bg-[#1D172B] border-2 border-[#F4B41B]'
                  : 'bg-[#141829] border-2 border-[#333C57]'
              }`}
              style={{
                borderRadius: '0px',
                boxShadow: telegraphInfo.isHeavy
                  ? 'inset 0 0 0 1px #FFE89E, 0 0 12px rgba(244,180,27,0.35)'
                  : 'inset 0 0 0 1px #232A42',
              }}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase shrink-0 tracking-wider flex items-center gap-1"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    backgroundColor: '#0B0D19',
                    color: telegraphInfo.accent,
                    border: `1px solid ${telegraphInfo.accent}`,
                    borderRadius: '0px',
                  }}>
                  {telegraphInfo.isHeavy ? '⚠ INTENT' : telegraphInfo.tag === 'LOST FOR WORDS' ? '✦ STUNNED' : '⚡ INTENT'}
                </span>
                <span
                  className="truncate text-xs sm:text-sm md:text-base font-serif italic tracking-wide"
                  style={{
                    color: telegraphInfo.isHeavy ? '#FFE89E' : '#F4EFE6',
                    textShadow: telegraphInfo.isHeavy ? '0 1px 2px #0B0D19, 0 0 8px rgba(244,180,27,0.4)' : '0 1px 2px #0B0D19',
                  }}>
                  {telegraphInfo.text}
                </span>
              </div>
              <span
                className="shrink-0 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest hidden sm:inline-block"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '8px',
                  color: telegraphInfo.accent,
                }}>
                [{telegraphInfo.tag}]
              </span>
            </div>
          )}

          {/* BATTLE COMMAND CONSOLE */}
          <div
            onClick={() => {
              if (isDialogueAdvanceable) {
                advanceTurn(true);
              }
            }}
            className="h-[140px] sm:h-[152px] mx-2 sm:mx-3 mb-1.5 sm:mb-2 flex flex-row shrink-0 z-20 overflow-hidden box-border relative"
            style={{
              borderRadius: '0px',
              background: '#141829',
              border: '3px solid #FFE89E',
              boxShadow: 'inset 0 0 0 3px #333C57, 0 6px 0 #06070E',
            }}>
            
            {turnStage === 'FIGHT_MOVES' ? (
              <div className="flex flex-row w-full h-full">
                <div className="flex-1 h-full p-1.5 sm:p-2 grid grid-cols-2 gap-1.5 min-w-0 overflow-y-auto touch-auto">
                  {playerPoet.moves.map((m, idx) => {
                    const isSelected = selectedMoveIndex === idx;
                    const remainingReadings = poetReadingsMap[activePlayerPoetId]?.[m.id] ?? m.maxReadings;
                    const isAvailable = remainingReadings > 0;
                    const isStatusMove = m.effectType === 'STATUS';
                    const isTargetImmune = isStatusMove && (enemyStunTokens > 0 || enemyStunImmuneTurns > 0);
                    const isDisabled = !isAvailable || isTargetImmune;

                    return (
                      <button
                        type="button"
                        key={m.id}
                        disabled={isDisabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isTargetImmune) {
                            gameAudio.playErrorBuzz();
                            triggerHaptics(60);
                            addFloatingText(500, 70, `IMMUNE - 1 TURN!`, '#8B5CF6', 15);
                            return;
                          }
                          if (!isAvailable) {
                            gameAudio.playErrorBuzz();
                            return;
                          }
                          setSelectedMoveIndex(idx);
                          startPlayerMove(m);
                        }}
                        onMouseEnter={() => setSelectedMoveIndex(idx)}
                        style={{
                          borderRadius: '0px',
                          border: isSelected ? '2px solid #FFE89E' : '2px solid #333C57',
                          backgroundColor: isDisabled ? '#0B0D19' : isSelected ? '#1E243B' : '#0E1222',
                          color: isDisabled ? '#64748B' : isSelected ? '#FFE89E' : '#C5D1E0',
                        }}
                        className={`p-1.5 text-left flex items-center justify-between transition-all cursor-pointer min-h-[48px] active:scale-95 ${
                          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}>
                        <div className="min-w-0 flex-1">
                          <div
                            className="font-bold text-xs truncate flex items-center gap-1"
                            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '9px', color: isSelected ? '#FFE89E' : '#F4EFE6' }}>
                            <span className="truncate">{m.name}</span>
                            {isTargetImmune && (
                              <span
                                className="text-[8px] px-1 py-0.2 bg-[#8B5CF6] text-white shrink-0 font-bold"
                                style={{ fontFamily: "'VT323', monospace", fontSize: '13px', borderRadius: '0px' }}>
                                [IMMUNE - 1 TURN]
                              </span>
                            )}
                          </div>
                          <div
                            className="flex items-center gap-1"
                            style={{ fontFamily: "'VT323', monospace", fontSize: '14px', color: '#8E9BB0' }}>
                            <span>{m.powerLabel}</span>
                            <span style={{ color: '#F4B41B' }}>({remainingReadings}/{m.maxReadings})</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const curMove = playerPoet.moves[selectedMoveIndex] || playerPoet.moves[0];
                  const remainingReadings = poetReadingsMap[activePlayerPoetId]?.[curMove.id] ?? curMove.maxReadings;
                  const isStatusMove = curMove.effectType === 'STATUS';
                  const isTargetImmune = isStatusMove && (enemyStunTokens > 0 || enemyStunImmuneTurns > 0);

                  return (
                    <div
                      className="w-[200px] sm:w-[260px] md:w-[280px] h-full p-2 sm:p-2.5 flex flex-col justify-between shrink-0 font-mono"
                      style={{
                        background: '#0E1222',
                        borderLeft: '2px solid #333C57',
                      }}>
                      <div>
                        <div
                          className="font-bold uppercase truncate pb-1 flex justify-between items-center"
                          style={{
                            borderBottom: '1px solid #262E4D',
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '9px',
                            color: '#FFE89E',
                          }}>
                          <span className="truncate">{curMove.name}</span>
                          <span style={{ color: '#F4B41B' }}>{remainingReadings}/{curMove.maxReadings}</span>
                        </div>
                        <div
                          className="pt-1.5 line-clamp-3 leading-relaxed"
                          style={{
                            fontFamily: 'Georgia, Garamond, serif',
                            fontStyle: 'italic',
                            fontSize: '14px',
                            color: '#F4EFE6',
                          }}>
                          {curMove.descriptionShort}
                        </div>
                        {isTargetImmune && (
                          <div
                            className="mt-1 text-[#C4B5FD] font-mono text-[11px] not-italic font-bold"
                            style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
                            [IMMUNE - 1 TURN]: Target cannot be stunned this turn.
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          gameAudio.playMenuCancel();
                          setTurnStage('ACTIONS');
                        }}
                        style={{
                          borderRadius: '0px',
                          background: '#1E243B',
                          border: '2px solid #5A6988',
                          color: '#FFE89E',
                          fontFamily: "'VT323', monospace",
                          fontSize: '18px',
                        }}
                        className="w-full hover:brightness-125 active:scale-95 py-1 min-h-[44px] sm:min-h-[48px] flex items-center justify-center gap-1 cursor-pointer">
                        <ArrowLeft size={14} />
                        <span>BACK</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            ) : turnStage === 'BAG_MENU' ? (
              <div className="flex flex-row w-full h-full">
                <div className="flex-1 h-full p-2.5 sm:p-3 flex flex-col justify-center min-w-0" style={{ color: '#F4EFE6' }}>
                  <div
                    className="font-bold uppercase mb-1"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#FFE89E' }}>
                    {bagInventory[selectedBagIndex]?.name}
                  </div>
                  <div
                    className="leading-relaxed"
                    style={{ fontFamily: 'Georgia, Garamond, serif', fontStyle: 'italic', fontSize: '14px', color: '#C5D1E0' }}>
                    {bagInventory[selectedBagIndex]?.desc}
                  </div>
                </div>

                <div
                  className="w-[200px] sm:w-[240px] h-full p-1.5 sm:p-2 flex flex-col justify-between shrink-0"
                  style={{
                    background: '#0E1222',
                    borderLeft: '2px solid #333C57',
                  }}>
                  <div className="space-y-1 overflow-y-auto touch-auto flex-1 pr-0.5">
                    {bagInventory.map((item, idx) => (
                      <button
                        type="button"
                        key={item.id}
                        disabled={item.count <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBagIndex(idx);
                          applyBagItem(item);
                        }}
                        onMouseEnter={() => setSelectedBagIndex(idx)}
                        style={{
                          borderRadius: '0px',
                          border: selectedBagIndex === idx ? '2px solid #FFE89E' : '2px solid #333C57',
                          background: selectedBagIndex === idx ? '#1E243B' : '#0B0D19',
                          color: item.count <= 0 ? '#64748B' : '#FFE89E',
                          opacity: item.count <= 0 ? 0.5 : 1,
                        }}
                        className="w-full p-2 min-h-[44px] text-left flex items-center justify-between cursor-pointer active:scale-95">
                        <span
                          className="font-bold truncate uppercase flex items-center gap-1.5"
                          style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
                          <span>{item.icon}</span>
                          <span className="truncate">{item.name}</span>
                          <span style={{ color: '#F4B41B' }}>x{item.count}</span>
                        </span>
                        <span
                          className="font-bold"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#F4B41B' }}>
                          {item.category === 'CAPTURE' ? 'BIND' : 'USE'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      gameAudio.playMenuCancel();
                      setTurnStage('ACTIONS');
                    }}
                    style={{
                      borderRadius: '0px',
                      background: '#1E243B',
                      border: '2px solid #5A6988',
                      color: '#FFE89E',
                      fontFamily: "'VT323', monospace",
                      fontSize: '18px',
                    }}
                    className="w-full mt-1 hover:brightness-125 active:scale-95 py-1 min-h-[44px] sm:min-h-[48px] flex items-center justify-center gap-1 cursor-pointer">
                    <ArrowLeft size={14} />
                    <span>BACK</span>
                  </button>
                </div>
              </div>
            ) : (turnStage === 'MOVE_VERSE' || turnStage === 'ENEMY_VERSE') && activeMove ? (
              /* Fine-Press Poetic Recitation in Bottom Battle Console (Metered Couplet Cascade & Dignified Cadence) */
              <div
                key={activeMove.id + turnStage + activeStanzaIndex}
                className="w-full h-full p-2.5 sm:p-3 flex flex-col justify-between min-w-0 relative select-none animate-in fade-in duration-150">
                {/* 1. Header badge in pixel caps with subtle laurel/asterisk glyphs: ✦ WILD GEESE [STANZA 2/4] ✦ */}
                <div
                  className="flex items-center justify-between pb-1 mb-1 border-b border-[#262E4D] w-full shrink-0"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '9px',
                    color: '#FCE182',
                    letterSpacing: '1px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  }}>
                  <span className="flex items-center gap-1.5 truncate">
                    <span>✦</span>
                    <span className="truncate">{(activeMove.poemTitle || activeMove.name).toUpperCase()}</span>
                    {activeMove.progressiveStanzas && activeMove.progressiveStanzas.length > 1 && (
                      <span style={{ color: '#FBE8A6', marginLeft: '4px' }}>
                        [STANZA {activeStanzaIndex + 1}/{activeMove.progressiveStanzas.length}]
                      </span>
                    )}
                    <span>✦</span>
                  </span>
                  <span
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '17px',
                      color: '#FCE182',
                      letterSpacing: '1.5px',
                    }}>
                    {turnStage === 'MOVE_VERSE' ? '✦ RECITAL ✦' : '✦ OPPONENT ✦'}
                  </span>
                </div>

                {/* 2. Metered Couplet Cascade & Typographic Cadence with Literary Dignity Speaker Label */}
                <div className="flex-1 flex flex-col justify-center space-y-0.5 sm:space-y-1 my-auto min-w-0 overflow-hidden pr-20 sm:pr-24">
                  {(() => {
                    const speakerPoet = turnStage === 'MOVE_VERSE' ? playerPoet : enemyPoet;
                    const speakerFullName = speakerPoet.name.toUpperCase();
                    const rawLines = activeVerseStanza.length > 0 ? activeVerseStanza : activeMove.stanzas;

                    return rawLines.map((line, idx) => {
                      const isFirst = idx === 0;
                      const lineDelayMs = idx * 220; // Line 1: ~200-250ms, Line 2 follows with ~220ms poetic breath delay

                      return (
                        <div
                          key={idx}
                          className={`leading-snug text-base sm:text-lg md:text-[21px] truncate tracking-wide ${
                            !isFirst ? 'pl-3 sm:pl-4' : ''
                          }`}
                          style={{
                            fontFamily: "'VT323', monospace",
                            letterSpacing: '0.8px',
                            animation: isVerseBypassed
                              ? 'none'
                              : `verseLetterpressIn 240ms cubic-bezier(0.16, 1, 0.3, 1) ${lineDelayMs}ms both`,
                          }}>
                          {isFirst && (
                            <span
                              className="font-bold mr-2 tracking-wider"
                              style={{
                                color: '#FCE182',
                                textShadow: '0 1px 2px #06070E, 0 0 6px rgba(252, 225, 130, 0.3)',
                              }}>
                              {speakerFullName}:
                            </span>
                          )}
                          <span style={{ fontStyle: 'italic' }}>
                            “{renderGildedPoeticTokens(line)}”
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* 3. Bottom Right Prompt: ■ [Z / SPACE] with soft, quiet blinking cursor */}
                <div
                  className="absolute right-2.5 bottom-2 sm:right-3.5 sm:bottom-2.5 flex items-center gap-1.5 pointer-events-none select-none"
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '18px',
                    color: '#FCE182',
                    letterSpacing: '1px',
                    textShadow: '0 1px 2px #06070E',
                  }}>
                  <span
                    className="w-2.5 h-2.5 inline-block shrink-0"
                    style={{
                      backgroundColor: '#FCE182',
                      boxShadow: '0 0 6px rgba(252, 225, 130, 0.45)',
                      animation: 'softQuietBlink 1.4s ease-in-out infinite',
                    }}
                  />
                  <span className="font-bold tracking-wider">
                    {isMobile ? '■ [TAP]' : '■ [Z / SPACE]'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-row w-full h-full relative">
                <div className="flex-1 h-full p-2.5 sm:p-3 flex items-center justify-between min-w-0">
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full">
                    {renderTypewriterDialogue()}
                    {outcomeNarration && (
                      <div
                        className="mt-1 truncate"
                        style={{
                          fontFamily: 'Georgia, Garamond, serif',
                          fontStyle: 'italic',
                          fontSize: '15px',
                          color: '#F4B41B',
                        }}>
                        {outcomeNarration}
                      </div>
                    )}
                  </div>
                </div>

                {turnStage === 'ACTIONS' && (
                  <div
                    className="w-[200px] sm:w-[240px] md:w-[260px] h-full p-1.5 grid grid-cols-2 gap-1.5 shrink-0 font-mono"
                    style={{
                      background: '#0E1222',
                      borderLeft: '2px solid #333C57',
                    }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // If player is slow-stunned: consume stun token and skip action!
                        if (playerStunTokensRef.current > 0) {
                          playerStunTokensRef.current = 0;
                          setPlayerStunTokens(0);
                          playerStunImmuneTurnsRef.current = 1;
                          setPlayerStunImmuneTurns(1);
                          playerJustGainedImmunityThisRoundRef.current = true;
                          setPlayerLostForWords(false);
                          playerLostForWordsRef.current = false;

                          gameAudio.playHoverMicroTone();
                          addFloatingText(140, 220, `SKIPPED!`, '#8B5CF6', 16);
                          const skipMsg = `${playerPoetRef.current.name} is Lost for Words and cannot recite this turn.`;
                          setDialogueLines([skipMsg]);
                          setOutcomeNarration(`${playerPoetRef.current.name}'s action was skipped by Lost for Words!`);

                          const playerSpd = playerPoetRef.current.spd;
                          const enemySpd = enemyPoetRef.current.spd;
                          if (enemySpd > playerSpd) {
                            // Enemy was faster: enemy acts, player skipped
                            isEnemyLeadingTurnRef.current = true;
                            startEnemyTurn();
                          } else {
                            // Player was faster: player skipped, now enemy acts
                            isEnemyLeadingTurnRef.current = false;
                            setTurnStage('MOVE_OUTCOME');
                          }
                          return;
                        }

                        gameAudio.playConfirmSelect();
                        setTurnStage('FIGHT_MOVES');
                      }}
                      style={{
                        borderRadius: '0px',
                        background: playerStunTokens > 0 ? '#6B7280' : '#F4B41B',
                        color: playerStunTokens > 0 ? '#FFFFFF' : '#0B0D19',
                        border: '2px solid #FFE89E',
                        boxShadow: '0 3px 0 #06070E',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '10px',
                      }}
                      className="p-1.5 font-bold flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] active:scale-95">
                      {playerStunTokens > 0 ? 'SKIPPED' : 'COMPOSE'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        gameAudio.playConfirmSelect();
                        setTurnStage('BAG_MENU');
                      }}
                      style={{
                        borderRadius: '0px',
                        background: '#1E243B',
                        color: '#FFE89E',
                        border: '2px solid #333C57',
                        boxShadow: '0 3px 0 #06070E',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '10px',
                      }}
                      className="p-1.5 font-bold hover:bg-[#252D4A] flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] active:scale-95">
                      CAPTURE
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        gameAudio.playConfirmSelect();
                        setCurrentScreen('ANTHOLOGY');
                      }}
                      style={{
                        borderRadius: '0px',
                        background: '#1E243B',
                        color: '#FFE89E',
                        border: '2px solid #333C57',
                        boxShadow: '0 3px 0 #06070E',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '10px',
                      }}
                      className="p-1.5 font-bold hover:bg-[#252D4A] flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] active:scale-95">
                      ROSTER
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRun();
                      }}
                      style={{
                        borderRadius: '0px',
                        background: '#7A0909',
                        color: '#FFE89E',
                        border: '2px solid #B80D0D',
                        boxShadow: '0 3px 0 #06070E',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '10px',
                      }}
                      className="p-1.5 font-bold hover:bg-[#990D0D] flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] active:scale-95">
                      LEAVE
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GLOBAL SCREEN TRANSITION CURTAIN */}
      <div
        className="fixed inset-0 z-50 bg-[#000000]"
        style={
          isHandshakeCurtainActive
            ? handshakeCurtainStyle
            : {
                opacity: Math.max(screenCurtainAlpha, cinematicCurtainAlpha),
                pointerEvents: screenCurtainAlpha > 0 || cinematicCurtainAlpha > 0 ? 'all' : 'none',
                transition: `opacity ${curtainTransitionDuration}`,
              }
        }
      />

      {/* ========================================================================= */}
      {/* 7. VICTORY & DEFEAT OVERLAYS */}
      {/* ========================================================================= */}
      {gameState.status === 'VICTORY' && currentScreen === 'BATTLE' && (
        <MenuOverlay tone="neutral" zIndex={45}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFFFF] border-4 border-[#000000] rounded-2xl p-5 sm:p-6 shadow-[10px_10px_0_0_#000000] text-center text-[#000000] font-mono relative animate-in fade-in zoom-in-95 duration-200">
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#059669] uppercase tracking-wider mb-2">
              {`${enemyPoet.name.split(' ').pop()?.toUpperCase()} RECRUITED!`}
            </h1>

            <div className="bg-[#FFFDE7] p-3 rounded-xl border-3 border-[#000000] mb-3 flex flex-col items-center">
              <PoetPixelAvatar
                poet={enemyPoet}
                size={64}
                imageAsset={assets[enemyPoet.spriteAssetKey || `poet_${enemyPoet.id.toLowerCase()}`]}
                className="rounded-xl border-2 border-[#10B981] bg-[#FFFFFF] shadow-sm mb-1.5"
              />
              <div className="font-serif italic text-xs text-[#1e293b] font-bold px-2">
                {(() => {
                  const txt = DUELIST_BATTLE_BARKS[enemyPoet.id]?.recruited || enemyPoet.dialogue.captured || enemyPoet.dialogue.lose;
                  return txt.startsWith('"') || txt.startsWith('“') ? txt : `“${txt}”`;
                })()}
              </div>
            </div>

            <div className="bg-[#FFDE00] border-2 border-[#000000] rounded-xl p-2.5 mb-3 text-xs font-bold flex justify-between">
              <span>Total Battle Score:</span>
              <span className="font-black">{gameState.score} PTS</span>
            </div>

            <div className="space-y-2">
              {selectedGameMode === 'CLIMB' ? (
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    gameAudio.playConfirmSelect();
                    const isSummitFight = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'].includes(activeEnemyPoetId);

                    // Dual Recruitment: trigger the 450ms golden dissolve on their overworld sprite!
                    triggerPoetRecruitmentDissolve(activeEnemyPoetId, activeEnemyPoetId);

                    if (!isSummitFight) {
                      // Non-summit: full restore
                      const restoredHp: Record<string, number> = {};
                      for (const pId of playerLineupRef.current) {
                        restoredHp[pId] = getPoetById(pId).hp;
                      }
                      setLineupHpMap(restoredHp);
                      lineupHpMapRef.current = restoredHp;
                      const initialReadings: Record<string, Record<string, number>> = {};
                      for (const p of ALL_POETS) {
                        initialReadings[p.id] = createInitialReadingsForPoet(p);
                      }
                      setPoetReadingsMap(initialReadings);
                      poetReadingsMapRef.current = initialReadings;
                    }

                    // Reset ALL movement locks, screen transitions, curtains, and modals
                    setIsCinematicLocked(false);
                    setIsTransitioningScreen(false);
                    isTransitioningScreenRef.current = false;
                    setScreenCurtainAlpha(0);
                    setCinematicCurtainAlpha(0);
                    setIsCinematicHudVisible(true);
                    setOverworldDialogue(null);
                    overworldDialogueRef.current = null;
                    battleExitGraceUntilRef.current = 0;

                    // Clear battle transient state
                    setPlayerBuffActive(false);
                    playerBuffActiveRef.current = false;
                    setEnemyBuffActive(false);
                    enemyBuffActiveRef.current = false;
                    setPlayerDebuffActive(false);
                    playerDebuffActiveRef.current = false;
                    setEnemyDebuffActive(false);
                    enemyDebuffActiveRef.current = false;
                    setPlayerLostForWords(false);
                    playerLostForWordsRef.current = false;
                    setEnemyLostForWords(false);
                    enemyLostForWordsRef.current = false;
                    setPlayerStunTokens(0);
                    playerStunTokensRef.current = 0;
                    setPlayerStunImmuneTurns(0);
                    playerStunImmuneTurnsRef.current = 0;
                    playerJustGainedImmunityThisRoundRef.current = false;
                    setEnemyStunTokens(0);
                    enemyStunTokensRef.current = 0;
                    setEnemyStunImmuneTurns(0);
                    enemyStunImmuneTurnsRef.current = 0;
                    enemyJustGainedImmunityThisRoundRef.current = false;
                    setEnemySkippedByStunThisRound(false);
                    enemySkippedByStunThisRoundRef.current = false;
                    enemyUsedStatusLastRoundRef.current = false;
                    enemyUsedStatusThisRoundRef.current = false;
                    setActiveMove(null);
                    activeMoveRef.current = null;
                    vfxRef.current.active = false;
                    bookAnimRef.current.active = false;
                    screenShakeRef.current = 0;
                    particlesRef.current = [];
                    floatingTextsRef.current = [];
                    isFleeingRef.current = false;

                    // Reset player movement state
                    const p = overworldPlayerRef.current;
                    p.isMoving = false;
                    p.moveProgress = 0;
                    p.pxX = p.gridX * TILE_SIZE;
                    p.pxY = p.gridY * TILE_SIZE;
                    p.fromX = p.gridX;
                    p.fromY = p.gridY;
                    p.targetX = p.gridX;
                    p.targetY = p.gridY;
                    p.isGliding = false;
                    p.glideVx = 0;
                    p.glideVy = 0;
                    p.walkStep = 0;

                    // Set game state back to PLAYING
                    setGameState((prev) => ({
                      ...prev,
                      status: 'PLAYING',
                    }));

                    setCurrentScreen('OVERWORLD');
                    currentScreenRef.current = 'OVERWORLD';

                    // Switch soundtrack back to overworld room BGM
                    soundtrackEngine.setDucking(false);
                    soundtrackEngine.setCrisis(false);
                    void soundtrackEngine.switchRoom(activeOverworldScreenRef.current, false);

                    if (typeof window !== 'undefined') {
                      window.focus();
                    }
                  }}
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm rounded-xl border-3 border-[#000000] shadow-[3px_3px_0_0_#000000] cursor-pointer">
                  CONTINUE CLIMB ➔
                </button>
              ) : selectedGameMode === 'GRAND_TOUR' ? (
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    gameAudio.playConfirmSelect();
                    setIsCinematicLocked(false);
                    setIsTransitioningScreen(false);
                    isTransitioningScreenRef.current = false;
                    setScreenCurtainAlpha(0);
                    setCinematicCurtainAlpha(0);
                    setGameState((prev) => ({ ...prev, status: 'START' }));
                    setCurrentScreen('GRAND_TOUR_MAP');
                    if (typeof window !== 'undefined') {
                      window.focus();
                    }
                  }}
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm rounded-xl border-3 border-[#000000] shadow-[3px_3px_0_0_#000000] cursor-pointer">
                  CONTINUE GRAND TOUR ➔
                </button>
              ) : (
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    gameAudio.playConfirmSelect();
                    initBattle(activePlayerPoetId, activeEnemyPoetId);
                  }}
                  className="w-full py-3 bg-[#FFDE00] hover:bg-[#FFEB66] text-[#000000] font-black text-xs sm:text-sm rounded-xl border-3 border-[#000000] shadow-[3px_3px_0_0_#000000] cursor-pointer">
                  REMATCH DUEL ➔
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  gameAudio.playCrispClick();
                  setIsCinematicLocked(false);
                  setIsTransitioningScreen(false);
                  isTransitioningScreenRef.current = false;
                  setScreenCurtainAlpha(0);
                  setCinematicCurtainAlpha(0);
                  setOverworldDialogue(null);
                  overworldDialogueRef.current = null;
                  setCurrentScreen('TITLE');
                  setGameState((prev) => ({...prev, status: 'START'}));
                  if (typeof window !== 'undefined') {
                    window.focus();
                  }
                }}
                className="w-full py-2 bg-[#FFFFFF] hover:bg-[#F4F5F9] text-[#000000] font-bold text-xs rounded-xl border-2 border-[#000000] cursor-pointer">
                RETURN TO TITLE SCREEN
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}

      {gameState.status === 'GAME_OVER' && (
        <MenuOverlay tone="neutral" zIndex={45}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFFFF] border-4 border-[#000000] rounded-2xl p-5 sm:p-6 shadow-[10px_10px_0_0_#000000] text-center text-[#000000] font-mono relative animate-in fade-in zoom-in-95 duration-200">
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#EE1515] uppercase tracking-wider mb-2">
              DEFEAT
            </h1>
            <p className="text-xs sm:text-sm text-[#242424] font-serif italic mb-3">
              “Your verses dissolved into quiet mist... Even masters face the struggle of the blank draft.”
            </p>

            <div className="space-y-2">
              {selectedGameMode === 'CLIMB' ? (
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    gameAudio.playConfirmSelect();
                    const isSummitFight = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'].includes(activeEnemyPoetId);

                    if (isSummitFight) {
                      // Summit wipeout: reset all 4 summit poets to uncaptured, restore lineup, teleport to (11, 17) facing UP
                      const summitPoetIds = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'];
                      setCapturedPoetIds((prev) => prev.filter((id) => !summitPoetIds.includes(id)));
                      setPlayerLineup((prev) => prev.filter((id) => !summitPoetIds.includes(id)));

                      summitNpcsRef.current = createFreshSummitNpcs();
                      setSummitNpcsState(summitNpcsRef.current);
                      rentedRoomNpcsRef.current = createFreshRentedRoomNpcs();
                      setRentedRoomNpcsState(rentedRoomNpcsRef.current);
                      lyricSanctuaryNpcsRef.current = createFreshLyricSanctuaryNpcs();
                      setLyricSanctuaryNpcsState(lyricSanctuaryNpcsRef.current);

                      const restoredHp: Record<string, number> = {};
                      for (const pId of playerLineupRef.current) {
                        restoredHp[pId] = getPoetById(pId).hp;
                      }
                      setLineupHpMap(restoredHp);
                      lineupHpMapRef.current = restoredHp;

                      const initialReadings: Record<string, Record<string, number>> = {};
                      for (const p of ALL_POETS) {
                        initialReadings[p.id] = createInitialReadingsForPoet(p);
                      }
                      setPoetReadingsMap(initialReadings);
                      poetReadingsMapRef.current = initialReadings;

                      overworldPlayerRef.current = {
                        gridX: 17,
                        gridY: 26,
                        pxX: 17 * TILE_SIZE,
                        pxY: 26 * TILE_SIZE,
                        dir: 'UP',
                        isMoving: false,
                        moveProgress: 0,
                        fromX: 17,
                        fromY: 26,
                        targetX: 17,
                        targetY: 26,
                        walkStep: 0,
                        isGliding: false,
                        glideVx: 0,
                        glideVy: 0,
                      };
                      iceSkateTrailsRef.current = [];
                      iceShimmerParticlesRef.current = [];
                      lastIceFootPosRef.current = null;
                      setActiveOverworldScreen('SUMMIT');
                      activeOverworldScreenRef.current = 'SUMMIT';
                    } else {
                      hasPlayerMovedRef.current = false;
                      overworldPlayerRef.current = {
                        gridX: 4,
                        gridY: 22,
                        pxX: 4 * TILE_SIZE,
                        pxY: 22 * TILE_SIZE,
                        dir: 'RIGHT',
                        isMoving: false,
                        moveProgress: 0,
                        fromX: 4,
                        fromY: 22,
                        targetX: 4,
                        targetY: 22,
                        walkStep: 0,
                        isGliding: false,
                        glideVx: 0,
                        glideVy: 0,
                      };
                      iceSkateTrailsRef.current = [];
                      iceShimmerParticlesRef.current = [];
                      lastIceFootPosRef.current = null;
                      setActiveOverworldScreen('HARBOR');
                      activeOverworldScreenRef.current = 'HARBOR';

                      const restoredHp: Record<string, number> = {};
                      for (const pId of playerLineupRef.current) {
                        restoredHp[pId] = getPoetById(pId).hp;
                      }
                      setLineupHpMap(restoredHp);
                      lineupHpMapRef.current = restoredHp;

                      const initialReadings: Record<string, Record<string, number>> = {};
                      for (const p of ALL_POETS) {
                        initialReadings[p.id] = createInitialReadingsForPoet(p);
                      }
                      setPoetReadingsMap(initialReadings);
                      poetReadingsMapRef.current = initialReadings;
                    }

                    if (playerPoet) {
                      setPlayerHp(playerPoet.hp);
                      playerHpRef.current = playerPoet.hp;
                    }
                    setPlayerBuffActive(false);
                    playerBuffActiveRef.current = false;
                    setEnemyBuffActive(false);
                    enemyBuffActiveRef.current = false;
                    setPlayerDebuffActive(false);
                    playerDebuffActiveRef.current = false;
                    setEnemyDebuffActive(false);
                    enemyDebuffActiveRef.current = false;
                    setPlayerLostForWords(false);
                    playerLostForWordsRef.current = false;
                    setEnemyLostForWords(false);
                    enemyLostForWordsRef.current = false;
                    setPlayerStunTokens(0);
                    playerStunTokensRef.current = 0;
                    setPlayerStunImmuneTurns(0);
                    playerStunImmuneTurnsRef.current = 0;
                    playerJustGainedImmunityThisRoundRef.current = false;
                    setEnemyStunTokens(0);
                    enemyStunTokensRef.current = 0;
                    setEnemyStunImmuneTurns(0);
                    enemyStunImmuneTurnsRef.current = 0;
                    enemyJustGainedImmunityThisRoundRef.current = false;
                    setEnemySkippedByStunThisRound(false);
                    enemySkippedByStunThisRoundRef.current = false;
                    enemyUsedStatusLastRoundRef.current = false;
                    enemyUsedStatusThisRoundRef.current = false;
                    setActiveMove(null);
                    activeMoveRef.current = null;
                    setIsCinematicLocked(false);
                    setIsTransitioningScreen(false);
                    isTransitioningScreenRef.current = false;
                    setScreenCurtainAlpha(0);
                    setCinematicCurtainAlpha(0);
                    setIsCinematicHudVisible(true);
                    battleExitGraceUntilRef.current = 0;
                    if (typeof window !== 'undefined') {
                      window.focus();
                    }
                    setOverworldDialogue({
                      active: true,
                      speakerName: 'AWAKENING',
                      text: 'You awaken at the foot of Mount Parnassus to the sound of gentle waves...',
                    });
                    setCurrentScreen('OVERWORLD');
                    currentScreenRef.current = 'OVERWORLD';
                    void soundtrackEngine.switchRoom(activeOverworldScreenRef.current, false);
                    setGameState({
                      status: 'PLAYING',
                      score: 500,
                      level: 1,
                    });
                  }}
                  className="w-full py-3 bg-[#FFDE00] hover:bg-[#FFEB66] text-[#000000] font-black text-xs sm:text-sm rounded-xl border-3 border-[#000000] shadow-[3px_3px_0_0_#000000] cursor-pointer">
                  RESPAWN &amp; TRY AGAIN ➔
                </button>
              ) : (
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    gameAudio.playConfirmSelect();
                    initBattle(activePlayerPoetId, activeEnemyPoetId);
                  }}
                  className="w-full py-3 bg-[#FFDE00] hover:bg-[#FFEB66] text-[#000000] font-black text-xs sm:text-sm rounded-xl border-3 border-[#000000] shadow-[3px_3px_0_0_#000000] cursor-pointer">
                  RETRY MATCH (REMATCH)
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  gameAudio.playMenuCancel();
                  setCurrentScreen('TITLE');
                  setGameState((prev) => ({...prev, status: 'START'}));
                }}
                className="w-full py-2 bg-[#FFFFFF] hover:bg-[#F4F5F9] text-[#000000] font-bold text-xs rounded-xl border-2 border-[#000000] cursor-pointer">
                RETURN TO TITLE SCREEN
              </button>
            </div>
          </div>
        </MenuOverlay>
      )}
    </div>
  );
}
