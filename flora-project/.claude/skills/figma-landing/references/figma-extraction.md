# Витяг токенів і ассетів із Figma (універсально)

Конкретні `fileKey` і node-id поточного проєкту — у **CLAUDE.md проєкту**.
Цей файл описує метод, що не залежить від проєкту.

## Доступ
- Інструментам Figma-MCP потрібен **edit-доступ** до файлу. Тому працюємо з
  **копією в чернетках користувача** (він — редактор), а не з оригіналом
  view-only.
- Альтернатива без edit-доступу: безкоштовний personal access token + Framelink
  MCP (читає через REST API навіть з view-доступом).

## Дизайн-токени
1. `get_variable_defs` на головному фреймі / UI-секції → змінні та стилі
   (кольори, відступи, типографіка).
2. `get_code` на конкретній секції → точна структура й значення (за
   замовчуванням React+Tailwind; у промті проси **plain HTML/CSS**).
3. Звести у **CSS custom properties** в `:root`
   (`--color-*`, `--space-*`, `--fs-*`, `--lh-*`, `--radius-*`, `--shadow-*`).
   Стилі секцій посилаються лише на змінні.
4. Якщо у файлі немає змінних Figma — значення все одно бери з `get_code` і
   централізуй у тих самих CSS-змінних.

## Ассети (`download_assets`)
- **Іконки** → `defaultFormat: "svg"`, далі у спрайт.
- **Растр** → оригінал + варіант **@2x** (`defaultScale: 2`) для retina;
  підключати через `srcset`/`image-set`.
- **Фавікон** → з відповідного вузла/секції макета.
- `download_assets` повертає і рендер вузла (для звірки), і вихідні
  зображення-заливки (jpeg/png/gif/webp). Відео (mp4) так не дістати — лише
  растрові заливки; відео експортувати вручну в Figma.

## Адаптив (Flora — фрейми версій сторінки на сторінці "Design" `5999:10563`)

| Версія | node-id | Ширина = брейкпоінт |
|--------|---------|---------------------|
| Mobile | `8238:18962` (Home • Mobile) | 375 (база) |
| Tablet | `8238:1241` (Home • Tablet) | 768 (`min-width: 768px`) |
| Desktop | `8203:59903` (Home • Desktop) | 1440 (`min-width: 1440px`) |

Адаптивні значення (зафіксовані в `css/styles.css`): бічний відступ контейнера 20→32→80;
вертикальний паддінг секцій 64→64→92; заголовки H1 36→36→56, H2 34→34→48 (Tablet ділить
мобільну шкалу display/Mobile); сітка товарів 1→2→4 колонки. Контейнер max 1280, радіуси 16 — глобальні.

## Межі тулінгу
- `get_screenshot` у Claude Code повертає лише **опис** — для «оком» бери рендер
  з `download_assets`.

## Карта вузлів (Flora — fileKey `gqDYCBRipLWAMZKBxb8zBY`, frame `8203:59903`)

Десктоп-фрейм «Home • Desktop». node-id однакові і в попередній копії `YI2vWsXS5isV02PWSSz1KI`. ✅ = ассет завантажено й оброблено (усі готові).

| Секція / ассет | node-id | Стан | Файл / нотатка |
|----------------|---------|------|----------------|
| Logo (navbar, wordmark) | `8203:59936` | ✅ | `images/logo.svg` (мультиколор) |
| Hero photo (full-bleed) | `8319:327` | ✅ | `images/hero.jpg` +@2x |
| About flower icon | `8203:115574` | ✅ | `images/flower.svg` (декор, мультиколор) |
| About photo | `8203:60168` | ✅ | `images/about.jpg` +@2x |
| Bestseller 1/2/3 | `8209:115929` / `8209:115936` / `8209:115943` | ✅ | `images/bestseller-1..3.jpg` +@2x |
| Slider arrow ← / → | `8209:115979` / `8209:115980` | ✅ | спрайт `#icon-arrow-left/right` |
| Contact icon phone / map | `8203:61099` / `8203:61104` | ✅ | спрайт `#icon-phone/map` |
| Social facebook/instagram/x | `8203:61218` / `8203:61219` / `8203:61220` | ✅ | спрайт `#icon-facebook/instagram/x` |
| Bouquet 1 / 2 | `8203:60888` / `8203:60895` | ✅ | `images/bouquet-1..2.jpg` +@2x |
| Bouquet 3 | `8203:60902` | ✅ | `images/bouquet-3.jpg` +@2x |
| Bouquet 4 | `8203:60909` | ✅ | `images/bouquet-4.jpg` +@2x |
| Bouquet 5 | `8203:60916` | ✅ | `images/bouquet-5.jpg` +@2x |
| Bouquet 6 | `8203:60923` | ✅ | `images/bouquet-6.jpg` +@2x |
| Bouquet 7 | `8203:60930` | ✅ | `images/bouquet-7.jpg` +@2x |
| Bouquet 8 | `8203:60937` | ✅ | `images/bouquet-8.jpg` +@2x |
| Contacts photo | `8203:61108` | ✅ | `images/contacts.jpg` +@2x (display 1280×720) |

Растр беремо з `download_assets` → `rawImages[0].url` (повнорозмірний оригінал), далі `sips -s format jpeg -s formatOptions 80 --resampleWidth <w>` для x1 та `<2w>` для @2x. Tablet/Mobile-фрейми — взяти node-id у файлі при виділенні (для брейкпоінтів етапу 3).
