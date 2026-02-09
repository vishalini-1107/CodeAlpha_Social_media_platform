const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB CONNECTION (MATCH database.sql)
const db = mysql.createConnection({
  host: "127.0.0.1",   // localhost ❌
  user: "root",
  password: "",
  database: "user_auth",
  port: 3307          // 🔴 change if your MySQL port different
});


db.connect(err => {
  if (err) {
    console.log("❌ DB Connection Failed");
    console.log(err);
  } else {
    console.log("✅ DB Connected Successfully");
  }
});

/* ================= SIGNUP ================= */

app.post("/signup", (req, res) => {
  const { username, email, password, phone, dob } = req.body;

  // check existing user
  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, result) => {
    if (err) return res.json({ msg: "DB error" });

    if (result.length > 0) {
      return res.json({ msg: "❌ Username already exists" });
    }

    // insert new user
    const insertSql =
      "INSERT INTO users (username, email, password, phone, dob) VALUES (?,?,?,?,?)";

    db.query(
      insertSql,
      [username, email, password, phone, dob],
      err => {
        if (err) return res.json({ msg: "Signup failed" });

        res.json({ msg: "✅ Signup success" });
      }
    );
  });
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.json({ msg: "DB error" });

    if (result.length === 0) {
      return res.json({ msg: "❌ Invalid username or password" });
    }

    res.json({
      msg: "Login success",
      user: {
        id: result[0].id,
        username: result[0].username
      }
    });
  });
});
/* ================= CREATE POST ================= */
app.post("/post", (req, res) => {
  const { user_id, content } = req.body;

  if (!user_id || !content) {
    return res.json({ msg: "Missing data" });
  }

  const sql = "INSERT INTO posts (user_id, content) VALUES (?, ?)";

  db.query(sql, [user_id, content], err => {
    if (err) {
      console.log(err);
      return res.json({ msg: "Post failed" });
    }

    res.json({ msg: "Post success" });
  });
});


/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
}); 
app.get("/posts", (req, res) => {
  const sql = `
    SELECT 
      posts.id,
      posts.content,
      users.username,
      (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes,
      (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});
app.post("/like", (req, res) => {
  const { post_id, user_id } = req.body;

  const sql = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
  db.query(sql, [post_id, user_id], () => {
    res.json({ msg: "Liked" });
  });
});
app.post("/comment", (req, res) => {
  const { post_id, user_id, comment } = req.body;

  const sql =
    "INSERT INTO comments (post_id, user_id, comment) VALUES (?,?,?)";

  db.query(sql, [post_id, user_id, comment], () => {
    res.json({ msg: "Comment added" });
  });
});
app.post("/follow", (req, res) => {
  const { follower_id, following_id } = req.body;

  const sql =
    "INSERT INTO followers (follower_id, following_id) VALUES (?,?)";

  db.query(sql, [follower_id, following_id], () => {
    res.json({ msg: "Followed" });
  });
});




// ============================================================
// ================= ADDITIONAL REQUIRED CODE =================
// ============================================================

// ---------- PROFILE IMAGE UPLOAD (ADD ONLY) ----------
const multer = require("multer");
const path = require("path");

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// upload route
app.post("/upload-profile", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.json({ msg: "No file selected" });
  }

  res.json({
    msg: "Upload success",
    filename: req.file.filename
  });
});

// ---------- FETCH POSTS (OPTIONAL BUT USEFUL) ----------
app.get("/posts", (req, res) => {
  const sql = `
    SELECT posts.id, posts.content, posts.created_at, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.json({ msg: "Fetch failed" });
    res.json(result);
  });
});

// ==
