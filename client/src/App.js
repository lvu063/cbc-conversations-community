import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import "./App.css";

const TRANSLATIONS = {
  en: {
    title: "CBC Conversations",
    subtitle: "Join the conversation — share your thoughts on CBC content",
    placeholder: "What's on your mind about CBC content?",
    post: "Post",
    reply: "Reply",
    replyPlaceholder: "Write a reply...",
    vote: "👍",
    replies: "replies",
    noPost: "No posts yet. Start the conversation!",
    namePlaceholder: "Your name",
    topic: "Topic",
    topics: ["CBC Gem", "CBC News", "CBC Radio", "CBC Sports", "General"],
  },
  fr: {
    title: "CBC Conversations",
    subtitle: "Rejoignez la conversation — partagez vos réflexions sur le contenu CBC",
    placeholder: "Qu'avez-vous à dire sur le contenu CBC?",
    post: "Publier",
    reply: "Répondre",
    replyPlaceholder: "Écrire une réponse...",
    vote: "👍",
    replies: "réponses",
    noPost: "Aucune publication. Lancez la conversation!",
    namePlaceholder: "Votre nom",
    topic: "Sujet",
    topics: ["CBC Gem", "CBC Nouvelles", "CBC Radio", "CBC Sports", "Général"],
  },
};

function App() {
  const [lang, setLang] = useState("en");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("CBC Gem");
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setPosts(loaded);
      } else {
        setPosts([]);
      }
    });
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    const postsRef = ref(db, "posts");
    await push(postsRef, {
      text: newPost,
      author: name || "Anonymous",
      topic,
      votes: 0,
      timestamp: serverTimestamp(),
      lang,
    });
    setNewPost("");
  };

  const handleVote = async (postId, currentVotes) => {
    const { update } = await import("firebase/database");
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, { votes: (currentVotes || 0) + 1 });
  };

  const handleReply = async (postId) => {
    if (!replyText[postId]?.trim()) return;
    const repliesRef = ref(db, `posts/${postId}/replies`);
    await push(repliesRef, {
      text: replyText[postId],
      author: name || "Anonymous",
      timestamp: serverTimestamp(),
    });
    setReplyText((prev) => ({ ...prev, [postId]: "" }));
    setShowReply((prev) => ({ ...prev, [postId]: false }));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <span className="cbc-logo">CBC</span>
            <div>
              <h1 className="header-title">{t.title}</h1>
              <p className="header-subtitle">{t.subtitle}</p>
            </div>
          </div>
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            aria-label="Toggle language"
          >
            {lang === "en" ? "FR" : "EN"}
          </button>
        </div>
      </header>

      <main className="main">
        <section className="compose" aria-label="New post">
          <div className="compose-row">
            <input
              className="input"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label={t.namePlaceholder}
            />
            <select
              className="select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              aria-label={t.topic}
            >
              {t.topics.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>
          <textarea
            className="textarea"
            placeholder={t.placeholder}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            aria-label={t.placeholder}
            rows={3}
          />
          <button className="btn-primary" onClick={handlePost}>
            {t.post}
          </button>
        </section>

        <section className="feed" aria-label="Community posts">
          {posts.length === 0 && (
            <p className="empty">{t.noPost}</p>
          )}
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-header">
                <span className="post-topic">
                  {(() => {
                    const topicMap = {
                      "CBC Gem": "CBC Gem",
                            "CBC News": "CBC Nouvelles",
                            "CBC Radio": "CBC Radio",
                            "CBC Sports": "CBC Sports",
                            "General": "Général",
                    };
                    return lang === "fr" && topicMap[post.topic] ? topicMap[post.topic] : post.topic;
                  })()}
                </span>
                <span className="post-author">{post.author}</span>
              </div>
              <p className="post-text">{post.text}</p>
              <div className="post-actions">
                <button
                  className="btn-vote"
                  onClick={() => handleVote(post.id, post.votes)}
                  aria-label={t.vote}
                >
                  {t.vote} {post.votes || 0}
                </button>
                <button
                  className="btn-reply"
                  onClick={() => setShowReply((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                >
                  {t.reply}
                </button>
              </div>

              {showReply[post.id] && (
                <div className="reply-compose">
                  <input
                    className="input"
                    placeholder={t.replyPlaceholder}
                    value={replyText[post.id] || ""}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    aria-label={t.replyPlaceholder}
                  />
                  <button className="btn-primary small" onClick={() => handleReply(post.id)}>
                    {t.reply}
                  </button>
                </div>
              )}

              {post.replies && (
                <div className="replies">
                  {Object.entries(post.replies)
                    .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0))
                    .map(([rid, reply]) => (
                      <div key={rid} className="reply">
                        <span className="reply-author">{reply.author}:</span>
                        <span className="reply-text">{reply.text}</span>
                      </div>
                    ))}
                </div>
              )}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;