# Android ARCore 3D Monument Model Assets

Place your high-resolution photorealistic `.glb` 3D monument files in this Android assets folder:

- `taj-mahal.glb`
- `qutub-minar.glb`
- `hawa-mahal.glb`
- `great-wall-of-china.glb`
- `eiffel-tower.glb`
- `colosseum.glb`
- `pyramids-of-giza.glb`
- `petra.glb`
- `machu-picchu.glb`
- `big-ben.glb`
- `statue-of-liberty.glb`
- `angkor-wat.glb`

`ArScreen` loads `.glb` assets directly from `assets/ar/[monumentId].glb`.
If an asset file is not present in this folder, `ArScreen` displays a clean status message:
"3D asset missing for [Monument]. Please place [monumentId].glb in assets/ar/"
so it never shows cardboard models or generic boxes.
