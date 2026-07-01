<div align="center">

# 🌸 Flora — лендінг квіткового магазину

Односторінковий флористичний лендінг за макетом Figma.

Семантичний **HTML + CSS**, адаптив Mobile-First, мобільне меню на ванільному JS.

![HTML5](https://img.shields.io/badge/HTML5-семантика-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Mobile--First-1572B6?logo=css3&logoColor=white)
![W3C](https://img.shields.io/badge/W3C-валідний-005A9C?logo=w3c&logoColor=white)
![Build](https://img.shields.io/badge/збірка-не_потрібна-4CAF50)

</div>

---

## ✨ Можливості

- **Семантична розмітка** — `header`/`main`/`footer`/`nav`, один `h1`, `h2` на секцію, списки в `ul`, `figure`/`blockquote` у відгуках
- **Адаптивність** — три брейкпоінти: мобайл `375`, планшет `768`, десктоп `1440`
  (Mobile-First каскад: база → `@media (min-width: 768px)` → `@media (min-width: 1440px)`)
- **Дизайн-система** — усі кольори/розміри/відступи винесені в CSS-змінні (`:root`); `font-family` лише на `body`
- **Мобільне меню** — повноекранний оверлей, відкривається класом `is-open` (доступно: `aria-expanded`, `Escape`, клік поза меню, фокус-пастка, скидання на десктопі)
- **Іконки** — зовнішній SVG-спрайт `images/icons.svg` через `<use href="…#icon-…">`
- **Декор + анімація** — багатошаровий фон/градієнт під hero; переходи `250ms cubic-bezier(0.4,0,0.2,1)`; бібліотека анімацій **animate.css**
- **Ретина** — растр `srcset` 1×/2×; фон hero через `@media (min-resolution: 2dppx)`; `loading="lazy"` + явні `width`/`height`
- **Стандарти** — валідні HTML (Nu) і CSS (Jigsaw), чиста консоль, форматування Prettier

## 🛠 Стек

| Шар          | Технологія                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| Розмітка     | **HTML5** — семантика (лендмарки, заголовки, списки, `figure`/`blockquote`)      |
| Стилі        | **CSS3** — Mobile-First, кастомні властивості (токени в `:root`), Flexbox і Grid |
| Логіка       | **Ванільний JavaScript** — лише мобільне меню (`is-open`)                        |
| Анімація     | **animate.css** (через CDN)                                                      |
| Нормалізація | **modern-normalize** через CDN + `css/reset.css`                                 |
| Шрифти       | **Hanuman** + **Roboto** (Google Fonts, одне посилання)                          |
| Дизайн       | Макет **Figma**                                                                  |

## 🚀 Запуск

Без збірки й без встановлення — просто відкрий сторінку:

```bash

open index.html

# …або підняти будь-яким статичним сервером, напр.:
python3 -m http.server   # далі відкрий http://localhost:8000
```

> Спрайт `images/icons.svg` підключається через `<use href="…">`, тож для
> коректного відображення іконок відкривай сторінку по http (не `file://`).

## 🌐 Live demo

GitHub Pages —

## 📁 Структура

```text
/
├─ index.html        # семантична розмітка
├─ css/
│  ├─ reset.css      # скидання поверх modern-normalize
│  └─ styles.css     # токени (:root) + Mobile-First стилі
├─ js/
│  └─ main.js        # мобільне меню (is-open)
├─ images/           # фото (x1/x2), лого, декор, спрайт, фавікони
└─ README.md
```

## ✅ Валідація

| Перевірка | Інструмент                                                          | Результат                     |
| --------- | ------------------------------------------------------------------- | ----------------------------- |
| HTML      | [validator.w3.org/nu](https://validator.w3.org/nu/)                 | **0 помилок / 0 попереджень** |
| CSS       | [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) | **0 помилок**                 |
| JS        | `node --check`                                                      | **OK**                        |
