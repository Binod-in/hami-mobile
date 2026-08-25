from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/hami-mobile/assets/images/icon.png')
target = Path('/tmp/hami-icon-small.png')
with Image.open(source) as image:
    image = image.convert('RGBA')
    image.thumbnail((512, 512), Image.Resampling.LANCZOS)
    image.save(target, format='PNG', optimize=True, compress_level=9)

for name in ['icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png']:
    Path('/home/ubuntu/hami-mobile/assets/images', name).write_bytes(target.read_bytes())
