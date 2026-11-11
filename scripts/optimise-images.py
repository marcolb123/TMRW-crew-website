"""Regenerate lightweight WebP assets; originals are never changed.
Run from the repository root with Python 3 and Pillow installed.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent

def optimise():
    original_bytes = generated_bytes = 0
    count = 0
    for directory in ('media', 'tmrw crew', 'events', 'flags'):
        for source in sorted((ROOT / directory).rglob('*')):
            if source.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
                continue
            target = ROOT / 'optimized' / source.relative_to(ROOT).with_suffix('.webp')
            target.parent.mkdir(parents=True, exist_ok=True)
            with Image.open(source) as image:
                image = ImageOps.exif_transpose(image)
                image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                if image.mode not in ('RGB', 'RGBA'):
                    image = image.convert('RGBA' if 'transparency' in image.info else 'RGB')
                image.save(target, 'WEBP', quality=88, method=6)
            original_bytes += source.stat().st_size
            generated_bytes += target.stat().st_size
            count += 1
    print(f'{count} derivatives: {original_bytes:,} original bytes → {generated_bytes:,} WebP bytes')

if __name__ == '__main__':
    optimise()
