# cnpr-recognition
based on https://github.com/baygen/CNPR_PoC

## Prerequisites
* Node.js + yarn
* SQLite3
* [openalpr](https://github.com/openalpr/openalpr)
## How to
```bash
git clone "https://github.com/undead404/cnpr-recognition"
cd "cnpr-recognition"
yarn
cat "recognition.sql" | sqlite3 "../recognition.db"
yarn run dev
```
