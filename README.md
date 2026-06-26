<div align="center">

# 🌸 Flora — лендінг квіткового магазину

Односторінковий флористичний лендінг

Чистий **HTML + CSS + ванільний JavaScript**.

![HTML5](https://img.shields.io/badge/HTML5-семантика-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Mobile--First-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ванільний-F7DF1E?logo=javascript&logoColor=black)
![W3C](https://img.shields.io/badge/W3C-валідний-005A9C?logo=w3c&logoColor=white)
![Build](https://img.shields.io/badge/збірка-не_потрібна-4CAF50)

</div>

---

## ✨ Можливості

- **Адаптивність** — три брейкпоінти: мобайл `375`, планшет `768`, десктоп `1440`
  (Mobile-First каскад: база → `@media (min-width: 768px)` → `@media (min-width: 1440px)`)
- **Бургер-меню** — доступний перемикач (`aria-expanded`, `Escape`, клік поза меню, скидання на десктопі)
- **Слайдери** — каруселі _Bestsellers_ і _Feedbacks_ на ванільному JS: стрілки, динамічні доти, клавіатура (`←`/`→`), горизонтальний тач-свайп
- **Динамічні дані** — список _Bouquets_ не зашитий у HTML: картки запитуються по HTTP (**axios**, `async/await`) з локального бекенду **json-server** (`db.json`) і вставляються у DOM
- **Пагінація** — кнопка _Show More_ довантажує наступну сторінку (`_page`/`_per_page`) і доповнює сітку; ховається на останній сторінці
- **Фільтрація** — чіпи за ціною (_All / Under \$40 / \$40–\$49 / \$50+_) керують параметрами запиту (`price_lt`/`price_gte`/`price_lte`); зміна фільтра скидає на 1-шу сторінку
- **Модальне вікно** — форма замовлення (кнопка _Order_ на картці), форма підписки у футері, кастомний чекбокс
- **Доступність** — ARIA-ролі та підписи, навігація з клавіатури, `prefers-reduced-motion`, no-JS фолбек `@media (scripting: none)` (усі картки лишаються видимими)
- **Продуктивність** — retina-зображення (`srcset` 1×/2×), `loading="lazy"` нижче згину, явні `width`/`height` проти зсувів верстки
- **Іконки** — зовнішній SVG-спрайт `images/icons.svg`: `<use href="./images/icons.svg#icon-…">`
- **Стандарти** — валідні HTML (Nu) і CSS (Jigsaw)

## 🛠 Стек

| Шар          | Технологія                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| Розмітка     | **HTML5** — семантика (лендмарки, заголовки, списки, `figure`/`blockquote`)      |
| Стилі        | **CSS3** — Mobile-First, кастомні властивості (токени в `:root`), Flexbox і Grid |
| Логіка       | **Ванільний JavaScript** — бургер-меню, каруселі, модалка, рендер списку         |
| HTTP         | **axios** (через CDN) + `async/await`                                            |
| Бекенд (dev) | **json-server** — віддає `db.json` на `http://localhost:3000`                    |
| Нормалізація | **modern-normalize** через CDN                                                   |
| Шрифти       | **Hanuman** + **Roboto** (Google Fonts)                                          |
| Дизайн       | Макет **Figma**                                                                  |

## 🚀 Запуск

Сама сторінка не потребує збірки — її можна просто відкрити:

```bash

open index.html

# …або підняти будь-яким статичним сервером, напр.:
python3 -m http.server   # далі відкрий http://localhost:8000
```

### Бекенд для динамічних даних (json-server)

Список _Bouquets_ підвантажується по HTTP. Щоб віддати дані з `db.json`,
підніми **json-server** (npx, нічого встановлювати не треба). Версію краще
закріпити — без неї `npx` може взяти застарілий кеш зі **зміненим API**:

```bash
npx json-server@1.0.0-beta.15 db.json   # ендпойнт: http://localhost:3000/bouquets
```

**Параметри запитів** (json-server `1.0.0-beta.15`), якими керує фронтенд:

| Призначення | Параметр                             | Приклад                      |
| ----------- | ------------------------------------ | ---------------------------- |
| Пагінація   | `_page`, `_per_page`                 | `?_page=2&_per_page=4`       |
| Фільтр ціни | `price_lt`, `price_gte`, `price_lte` | `?price_gte=40&price_lte=49` |

> Пагінована відповідь — це об'єкт-обгортка `{ data, next, pages, items, … }`
> (рядки в `data`, `next: null` на останній сторінці) — **не** масив; розмір
> сторінки — `_per_page` (а не `_limit`).

Якщо json-server не запущено, сторінка тихо відкочується до прямого читання
`db.json` й застосовує ту саму логіку фільтра/пагінації на клієнті, тож
галерея поводиться однаково (зокрема на GitHub Pages без бекенду).

## 🌐 Live demo

GitHub Pages — https://1neyzer1.github.io/UMT-markup-practice-Kukhta/#about

## 📁 Структура

```text
/
├─ index.html        # семантична розмітка
├─ db.json           # дані для json-server (список bouquets)
├─ css/
│  ├─ reset.css      # скидання поверх modern-normalize
│  └─ styles.css     # токени (:root) + Mobile-First стилі
├─ js/
│  └─ main.js        # бургер-меню, слайдери, модалка, рендер списку
├─ images/           # фото (x1/x2), лого, декор, спрайт, фавікони
└─ README.md
```

## ✅ Валідація

| Перевірка | Інструмент                                                          | Результат                     |
| --------- | ------------------------------------------------------------------- | ----------------------------- |
| HTML      | [validator.w3.org/nu](https://validator.w3.org/nu/)                 | **0 помилок / 0 попереджень** |
| CSS       | [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) | **0 помилок**                 |
| JS        | `node --check`                                                      | **OK**                        |
