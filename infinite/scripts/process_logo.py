import sys
import math
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

def process_logo(input_path, output_png, output_favicon):
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size
    
    # 1. Create a high quality circular mask
    mask_scale = 4
    mask = Image.new('L', (w * mask_scale, h * mask_scale), 0)
    draw = ImageDraw.Draw(mask)
    
    # The gold ring is slightly inset from the edges (approx 1.8% padding)
    cx, cy = (w * mask_scale) / 2.0, (h * mask_scale) / 2.0
    radius = (min(w, h) * mask_scale / 2.0) * 0.985
    
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=255)
    mask = mask.resize((w, h), Image.Resampling.LANCZOS)
    
    # 2. Put alpha mask onto the image
    img.putalpha(mask)
    
    # 3. Enhance brightness and contrast slightly so gold line art pops
    enhancer = ImageEnhance.Contrast(img)
    img_contrasted = enhancer.enhance(1.15)
    # Re-apply alpha channel
    img_contrasted.putalpha(img.split()[3])
    
    # Save main high-res transparent PNG
    img_contrasted.save(output_png, 'PNG', optimize=True)
    print(f"Saved {output_png} ({img_contrasted.size})")
    
    # 4. Generate high-contrast bright favicon (64x64 and 32x32)
    fav = img_contrasted.resize((128, 128), Image.Resampling.LANCZOS)
    fav.save(output_favicon, 'PNG')
    print(f"Saved {output_favicon}")

if __name__ == '__main__':
    src = r"c:\Users\shisui\Desktop\Infinite Horizons\infinite\public\logo-raw.jpg"
    out_png = r"c:\Users\shisui\Desktop\Infinite Horizons\infinite\public\logo-emblem.png"
    out_fav = r"c:\Users\shisui\Desktop\Infinite Horizons\infinite\public\favicon.png"
    process_logo(src, out_png, out_fav)
