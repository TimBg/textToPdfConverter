# Конвертер тексту в PDF

React додаток для конвертації тексту в PDF формат з можливістю збереження історії конвертацій.

## Технології

- React + TypeScript
- Tailwind CSS для стилізації
- react-pdf для перегляду PDF
- Vitest для тестування
- LocalStorage для збереження історії

## Структура проекту

```
src/
│
├─ components/          # React компоненти
│   ├─ TextInput.tsx    # Поле введення тексту
│   ├─ PdfViewer.tsx    # Компонент перегляду PDF
│   └─ HistoryList.tsx  # Список історії конвертацій
│
├─ hooks/
│   └─ useLocalStorage.ts  # Хук для роботи з localStorage
│
├─ services/
│   └─ pdfApi.ts       # API для роботи з PDF
│
├─ types/
│   └─ index.ts        # TypeScript типи
│
└─ tests/
    └─ pdfApi.test.ts  # Unit тести
```

## Встановлення

1. Клонуйте репозиторій
2. Встановіть залежності:
```bash
npm install
```
3. Запустіть проект:
```bash
npm run dev
```

## Функціонал

- Конвертація тексту в PDF
- Перегляд PDF безпосередньо в браузері
- Збереження історії конвертацій
- Можливість видалення елементів з історії

## API

Для конвертації використовується API:
```
POST http://95.217.134.12:4010/create-pdf?apiKey={API_KEY}
Body: {
    "text": "Текст для конвертації"
}
```

## Тестування

Запуск тестів:
```bash
npm test
```

## Демонстрація

<video
  src="https://raw.githubusercontent.com/TimBg/textToPdfConverter/main/media/demonstration.mov"
  width="640"
  controls>
</video>
