---
name: figma-landing
description: >-
  Build or continue a single-page landing site from a Figma macet, stage by
  stage. Use this skill whenever the work involves a Figma-based landing/one-
  pager: writing or continuing semantic HTML markup, validating HTML against
  W3C, extracting design tokens or assets from Figma, building or restyling a
  section/modal, writing Mobile-First CSS from tokens, or wiring JS behaviors
  (burger menu, sliders, modals, fetch, pagination). The macet is the spec and
  semantics comes first; every stage has a verifiable gate (W3C validity, macet
  fidelity). Reusable across different macets and requirement sets — read the
  project's CLAUDE.md for which macet, Figma file, stack, and current stage
  apply. Trigger this even when the request doesn't name a stage explicitly, as
  long as it touches building the landing.
---

# figma-landing — поетапна збірка лендінга з макета

Універсальний скіл: макет і вимоги конкретного проєкту — це **змінні входи**.
Спершу прочитай **CLAUDE.md проєкту** (який макет, fileKey, стек, поточний
етап), далі дій за цим скілом.

Два принципи над усім:
- **Макет — це специфікація.** Нічого не вигадуємо: структура, значення,
  ассети — з макета.
- **Семантика передусім, валідність обов'язкова.** Теги за призначенням; кожен
  етап має перевірюваний результат (W3C-валідатор, звірка з макетом).

## Поетапний конвеєр

Етапи йдуть **по черзі**; не починай наступний, поки не закрито «ворота»
попереднього. Повний опис із критеріями — `references/workflow-stages.md`:

1. Семантична HTML-розмітка (без CSS) → валідація (ворота: 0 помилок).
2. Prettier + ассети (SVG-спрайт, растр x1/x2, фавікон).
3. CSS — Mobile First, з токенів Figma у CSS-змінних (ворота: збіг із макетом
   на кожному брейкпоінті + валідний CSS).
4. JS-поведінка — рівно те, що вимагає макет/ТЗ (меню, слайдери, модалки,
   запити, пагінація).
5. Фінал — README, оптимізація, повний прохід валідаторів і чек-листа.

## Цикл по секції

1. Знайди вузол секції в Figma (`references/figma-extraction.md`).
2. **Точні дані:** `get_variable_defs` + `get_code` → CSS custom properties у
   `:root`. Без сирих hex/px.
3. **Ассети:** `download_assets` (іконки → SVG → спрайт; растр + @2x; фавікон).
4. Верстай: семантична розмітка → стилі проти змінних → поведінка.
5. Звір і причеши: пройдись по `references/semantics-checklist.md`, прожени
   валідатор і Prettier.

## Як точно слідувати макету

Деталі — `references/figma-extraction.md`. Коротко: значення беруться з Figma і
централізуються в CSS-змінних; візуальна звірка — накладанням рендера з Figma
на зібрану сторінку на кожній точці перелому.

## Семантика й валідність

Правила й типові помилки валідатора — `references/semantics-checklist.md`.

## Тулінг (важливі межі)

- `download_assets` потребує **edit-доступу** до файлу — тому працюємо з
  **копією користувача** в його чернетках, а не з оригіналом-view-only.
- `get_screenshot` у Claude Code наразі повертає лише **опис** — для звірки
  «оком» бери рендер з `download_assets`.
- Валідація: `validator.w3.org/nu/` (онлайн); офлайн за потреби — `vnu`
  (Java, не Node). Без npm-валідаторів.
