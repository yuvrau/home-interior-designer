# DreamHome 3D — Home & Interior Designer

A production-style React + TypeScript + Vite home design workspace with a local-first project model, interactive 2D floor-plan canvas, real-time Three.js 3D scene, asset library, properties editor, multi-floor scaffolding, templates, export/import, undo/redo, responsive layout, and an AI service extension point.

> This repository intentionally uses procedural geometry and simple UI-generated previews instead of bundling copyrighted 3D asset packs. The 3D scene remains functional with primitive meshes.

## 1. Requirements

- Node.js **20+** (Node 22 LTS/current is recommended).
- npm 10+ (or adapt commands for pnpm/yarn).
- A modern Chromium, Firefox, Safari, or Edge browser.
- WebGL 2 is recommended for the Three.js view.

## 2. Installation

From the project directory:

```bash
npm install
```

## 3. Run Development Server

```bash
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173/
```

## 4. Production Build

```bash
npm run build
```

The output is written to `dist/`.

## 5. Production Preview

```bash
npm run preview
```

Open the local URL printed by Vite (normally `http://localhost:4173/`).

## 6. Project Structure

```text
src/
├── components/
│   ├── common/       Reusable modal UI.
│   ├── editor/       Main editor shell.
│   ├── floorplan/    SVG-based interactive 2D canvas.
│   ├── properties/   Selected-object inspector.
│   ├── sidebar/      Searchable asset library and templates.
│   ├── three/        React Three Fiber scene and procedural models.
│   └── toolbar/      Editor commands, view switcher, import/export.
├── data/             Asset catalogue, categories and room-template data.
├── pages/            Landing/product page.
├── services/         Integration boundaries, including the AI service.
├── store/            Zustand project state, history and persistence.
├── types/            Shared TypeScript models.
└── utils/            IDs, project factories, statistics and cloning.
```

## 7. How to Use the Designer

1. Click **Start Designing**.
2. Use **New** for a fresh project.
3. Use the floor selector to switch floors; **Floor** adds another floor.
4. Search the left asset library for walls, rooms, doors, windows and furniture.
5. Click an asset to place it. Objects appear in both the 2D and 3D workspaces.
6. In **2D**, drag objects on the floor-plan canvas. Enable Grid/Snap for cleaner placement.
7. Select an object and edit X/Y/Z, width, height, depth, rotation, material and color in the right inspector.
8. Use room templates and style actions as quick starting points.
9. Switch to **3D** to orbit, pan and zoom around the house.
10. Use **Split** to keep the floor plan and 3D view visible together.
11. Use **Save** to persist the project to browser local storage.
12. Use **Open** to load locally saved projects.
13. Use **Download** to export project JSON and **Import** to restore a JSON file.
14. `Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+S`, Delete are supported.

## 8. How to Add Furniture

Open `src/data/assets.ts` and add an entry to the `assets` array:

```ts
A('furn-new-sofa', 'Designer Sofa', 'Furniture', 'furniture', '▰', 3, 1, 1.2, ['sofa', 'seating'])
```

The asset automatically becomes searchable and can be placed from the Furniture category. The current 3D renderer uses a procedural box fallback; replace it in `src/components/three/Scene3D.tsx` when you want a specialized mesh.

## 9. How to Add Room Templates

Add a key to `roomTemplates` in `src/data/assets.ts` and reference asset IDs:

```ts
'Luxury Study': ['room-6', 'furn-17', 'elec-1', 'elec-3', 'furn-18']
```

For a production template system, extend `applyTemplate()` in `src/store/useDesigner.ts` so each template gets its own positions, rotations and room dimensions.

## 10. How to Add House Styles

Style presets are represented by the `applyTemplate()` example map in the Zustand store. For a full style engine, create a `styles.ts` data file with:

- palette
- wall/floor material
- preferred furniture IDs
- light intensity/color
- decoration IDs

Then add `applyStyle(styleId)` to the store and update selected/all objects in one history transaction.

## 11. How to Add 3D Models

Recommended format: GLB/GLTF.

1. Put licensed models in `public/models/`.
2. Confirm the model license allows redistribution.
3. Add a model URL to the asset definition.
4. Load it with Drei's `useGLTF` in a dedicated component.
5. Keep a primitive fallback so an unavailable model never crashes the editor.
6. For large libraries, lazy-load model components and dispose geometries/materials when removed.

The included scene intentionally works without external model files.

## 12. How to Connect an AI API

The integration boundary is:

```text
src/services/ai.ts
```

`generateLocalDesign()` is a deterministic local mock. Replace it with a request to your own server endpoint, for example `/api/design`. Keep provider API keys on the server; do not put private keys in Vite client environment variables.

Return a structure similar to:

```ts
interface AIPlan {
  summary: string;
  rooms: string[];
  actions: string[];
}
```

A future version can turn `actions` into typed commands such as `ADD_ROOM`, `ADD_ASSET`, `MOVE_OBJECT`, and `APPLY_STYLE`, which can be executed through the Zustand store.

## 13. Troubleshooting

### Blank screen

Open browser DevTools → Console. Confirm Node/npm versions and run:

```bash
rm -rf node_modules dist
npm install
npm run build
```

### npm errors

Use Node 20+ and npm 10+. Delete `node_modules` and reinstall.

### Build errors

Run:

```bash
npm run build
```

The TypeScript compiler runs before Vite's production build so type problems are surfaced early.

### WebGL problems

Enable hardware acceleration and WebGL in the browser. If WebGL is unavailable, the 2D floor-plan view remains usable. A production deployment can add a WebGL capability detector and a friendly fallback screen.

### Missing models

The current application uses procedural boxes, so it does not require external models. If you add GLB files, verify their paths begin at `/models/...` and retain the primitive fallback.

### Storage problems

Projects are stored under the browser local-storage key `dreamhome-projects-v1`. Export projects as JSON for backup. Private/incognito contexts can clear storage when the session ends.

### Browser compatibility

Use a current Chrome/Edge/Firefox/Safari build. Three.js performance depends on GPU capability and browser WebGL support.

## Feature Coverage & Extension Notes

This project is intentionally structured as a real editor foundation rather than a static landing page. It includes the major end-to-end workflows: asset placement, 2D manipulation, 3D inspection, properties, materials/colors, templates, floor scaffolding, local persistence, import/export, history and an AI extension boundary.

Some architecture-grade features (wall topology/automatic enclosed-room solving, advanced collision constraints, physically accurate door swings, photorealistic furniture meshes, PDF vector export, cloud collaboration and server AI execution) require a larger geometry/data layer. The code is organized so those systems can be added without rewriting the UI.

## License

Add your preferred license before public distribution. Do not redistribute third-party models or textures unless their license explicitly permits it.
