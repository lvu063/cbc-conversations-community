# CBC Conversations Community

## Live Demo
🌐 [communityconversation.netlify.app](https://communityconversation.netlify.app)

## Tech Stack
- **Frontend:** React 18, JavaScript, CSS3
- **Backend:** Express.js, Node.js (REST API — 3 endpoints)
- **Database:** Firebase Realtime Database (real-time sync)
- **Testing:** Jest + React Testing Library + supertest (10/10 tests passing)
- **Deployment:** Netlify (frontend) · GitHub Actions ready

## Features
- Real-time posts, replies, and voting
- Bilingual FR/EN toggle — topic labels translate dynamically
- Post validation via REST API
- 10 automated tests across frontend and backend
- Accessible — keyboard navigable, ARIA labels, focus indicators

## Project Structure
\```
cbc-conversations/
├── client/          # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── App.test.js   # 5 frontend tests
│   │   └── firebase.js
└── server/          # Express.js backend
    ├── index.js
    └── index.test.js     # 5 backend tests
\```

## Running Locally
\```bash
# Frontend
cd client
npm install
npm start

# Backend
cd server
npm install
node index.js
\```

Built by Hai-Huong Le Vu · [linkedin.com/in/hai-huong-le-vu](https://linkedin.com/in/hai-huong-le-vu)
