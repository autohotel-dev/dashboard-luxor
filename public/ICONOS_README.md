# 🎨 Iconos para PWA

## 📋 Iconos Necesarios

Necesitas crear los siguientes iconos en la carpeta `/public/`:

```
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png    ← Para Apple/iOS
icon-192x192.png    ← Android estándar
icon-384x384.png
icon-512x512.png    ← Android adaptive
```

---

## 🚀 Generación Rápida Online

### Opción 1: RealFaviconGenerator (Recomendado)
1. Ve a: https://realfavicongenerator.net/
2. Sube tu logo (mínimo 512x512px)
3. Configura:
   - iOS: ✅ Activar
   - Android: ✅ Activar
   - Windows: ❌ (opcional)
4. Click "Generate"
5. Descargar package
6. Copiar todos los `icon-*` a `/public/`

### Opción 2: PWA Asset Generator
```bash
npm install -g pwa-asset-generator

pwa-asset-generator logo.svg public \
  --icon-only \
  --favicon \
  --type png \
  --padding "10%"
```

---

## 💻 Generación Manual con ImageMagick

### Instalar ImageMagick:
- **Windows:** https://imagemagick.org/script/download.php
- **Mac:** `brew install imagemagick`
- **Linux:** `sudo apt install imagemagick`

### Script Bash:
```bash
#!/bin/bash
# generate-icons.sh

# Logo original (debe ser 512x512 o mayor)
LOGO="logo.png"

# Tamaños necesarios
sizes=(72 96 128 144 152 192 384 512)

# Generar cada tamaño
for size in "${sizes[@]}"; do
  echo "Generando icon-${size}x${size}.png..."
  magick "$LOGO" -resize ${size}x${size} "public/icon-${size}x${size}.png"
done

echo "✅ Iconos generados!"
```

### Script PowerShell (Windows):
```powershell
# generate-icons.ps1

$logo = "logo.png"
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

foreach ($size in $sizes) {
    Write-Host "Generando icon-${size}x${size}.png..."
    magick $logo -resize "${size}x${size}" "public/icon-${size}x${size}.png"
}

Write-Host "✅ Iconos generados!"
```

---

## 🎨 Crear Logo Base

### Photoshop/Illustrator:
1. Crear documento 512x512px
2. Diseñar logo centrado
3. Fondo: #1f2937 (tema oscuro del dashboard)
4. Logo: Blanco o dorado
5. Exportar como PNG

### Figma:
1. Frame 512x512
2. Diseñar logo
3. Export: PNG, 1x
4. Usar como base

### Canva:
1. Custom Size: 512x512px
2. Usar plantilla de ícono de app
3. Descargar PNG

---

## 🏨 Sugerencia de Logo para Luxor

### Opción Simple (Emoji):
```
🏨 en un cuadrado con fondo #1f2937
```

### Opción Texto:
```
"L" grande en fuente elegante
Fondo: #1f2937
Texto: Dorado (#fbbf24)
```

### Opción Profesional:
```
Iniciales "LX" entrelazadas
Estilo: Minimalista
Colores: Blanco/Dorado sobre oscuro
```

---

## 📱 Requisitos por Plataforma

### Android:
- **Mínimo:** 192x192px
- **Recomendado:** 512x512px
- **Formato:** PNG
- **Adaptable:** Márgenes del 10%

### iOS:
- **Tamaño:** 152x152px
- **Formato:** PNG
- **Sin transparencia** (fondo sólido)
- **Sin bordes redondeados** (iOS los agrega)

### Desktop:
- **Tamaño:** 192x192px o 512x512px
- **Formato:** PNG
- **Opcional:** ICO para compatibilidad

---

## ✅ Verificación

### Checklist:
- [ ] Todos los 8 tamaños creados
- [ ] Archivos en `/public/`
- [ ] Nombres exactos (icon-XXxXX.png)
- [ ] Formato PNG
- [ ] Sin transparencia completa
- [ ] Proporciones 1:1 (cuadrados)

### Probar:
1. Abrir DevTools (F12)
2. Application → Manifest
3. Verificar que se cargan todos los iconos
4. Icons section debe mostrar 8 iconos

---

## 🔄 Placeholder Temporal

Mientras creas los iconos, puedes usar un placeholder:

### Con ImageMagick:
```bash
# Crear icono simple con "L"
for size in 72 96 128 144 152 192 384 512; do
  magick -size ${size}x${size} \
    xc:#1f2937 \
    -fill white \
    -font Arial-Bold \
    -pointsize $((size/2)) \
    -gravity center \
    -annotate +0+0 "L" \
    "public/icon-${size}x${size}.png"
done
```

### Online (rápido):
1. https://placeholder.com/
2. Genera: 512x512, color #1f2937
3. Agrega texto "L" en blanco
4. Descargar y usar script de resize

---

## 📝 Notas Importantes

### DO:
- ✅ Usar PNG
- ✅ Fondo sólido
- ✅ Logo centrado
- ✅ Márgenes del 10-15%
- ✅ Alta calidad (512px base)

### DON'T:
- ❌ Transparencia total
- ❌ Bordes redondeados
- ❌ Texto muy pequeño
- ❌ JPG o GIF
- ❌ Logos muy complejos

---

## 🎯 Resultado Esperado

Después de generar, debes tener:

```
public/
├── icon-72x72.png       (5.2 KB)
├── icon-96x96.png       (7.8 KB)
├── icon-128x128.png     (13.9 KB)
├── icon-144x144.png     (17.5 KB)
├── icon-152x152.png     (19.6 KB)
├── icon-192x192.png     (31.4 KB)
├── icon-384x384.png     (125 KB)
└── icon-512x512.png     (223 KB)
```

---

**🎨 Una vez tengas los iconos, la PWA estará 100% funcional!**
