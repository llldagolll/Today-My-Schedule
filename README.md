## Features

notion カレンダーの予定を LINE に通知する

## Getting Started

LINE Notify Api key、Notion のインテグレーションのシークレットトークン Api key、データベース ID と Notion で使っている名前を環境変数に追記

```.env
LINE_TOKEN=
NOTION_TOKEN=
DATABASE_ID=
MY_NAME=
```

## NPM Scripts

This template has a few built-in NPM scripts:

| Script              | Action                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`         | Run `main.ts`.                                                                                                                                                                  |
| `npm run typecheck` | Type check using the TypeScript compiler.                                                                                                                                       |
| `npm run format`    | Format using Prettier (also recommended: the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) if you're using VS code.) |
| `npm run build`     | Build JavaScript into the `dist/` directory. You normally shouldn't need this if you're using `npm start`.                                                                      |
