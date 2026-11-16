# Pocket Poets

A literary RPG. Climb Mount Parnassus, duel the poets, fill your anthology.

Started in Google Playground, now built here.

## Run it

```
npm install
npm run dev
```

`npm run build` writes the finished site to `dist/`.

## Where things are

- `App.tsx` is the whole game: screens, battles, walking.
- `overworldData.ts` is the mountain: every screen, room, prop and character.
- `poetsData.ts` is the roster and their moves.
- `public/assets/` is the art and music.
- `main.tsx`, `styles.css` and `index.html` are what let it run outside Playground. The stand-in for Google's platform is a short script in `index.html`.
