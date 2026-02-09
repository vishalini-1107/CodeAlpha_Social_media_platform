// ---------- LOGIN ----------
function login() {
  const loginUser = document.getElementById("loginUser").value;
  const loginPass = document.getElementById("loginPass").value;
  const loginMsg  = document.getElementById("loginMsg");

  fetch("http://127.0.0.1:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: loginUser,
      password: loginPass
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.msg === "Login success") {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "home.html";
    } else {
      loginMsg.innerText = data.msg;
    }
  })
  .catch(() => {
    loginMsg.innerText = "Server error";
  });
}


// ---------- CREATE POST ----------
function createPost(){
  const postText = document.getElementById("postText");
  const posts = document.getElementById("posts");
  const text = postText.value;

  if(text === "") return;

  const user = JSON.parse(localStorage.getItem("user"));

  fetch("http://localhost:3000/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      content: text
    })
  })
  .then(res => res.json())
  .then(data => {
    if(data.msg === "Post success"){
      const post = document.createElement("div");
      post.className = "post";

      post.innerHTML = `
        <div class="top">
          <b>${user.username}</b>
          <button onclick="follow(this)">Follow</button>
        </div>

        <p>${text}</p>

        <button onclick="likePost(this)">
          ❤️ <span class="like-count">0</span>
        </button>

        <button onclick="openComment(this)">💬 Comment</button>

        <div class="comment-box" style="display:none; margin-top:8px;">
          <input type="text" placeholder="Write a comment..." style="width:70%">
          <button onclick="sendComment(this)">Send</button>
        </div>

        <div class="comments"></div>
      `;

      posts.prepend(post);
      postText.value = "";
    }
  });
}


// ---------- LIKE ----------
function likePost(btn){
  const span = btn.querySelector(".like-count");
  span.innerText = parseInt(span.innerText) + 1;
}


// ---------- COMMENT ----------
function openComment(btn){
  const post = btn.parentElement;
  post.querySelector(".comment-box").style.display = "block";
}

function sendComment(btn){
  const box = btn.parentElement;
  const input = box.querySelector("input");
  const text = input.value;

  if(text === "") return;

  const post = box.parentElement;
  const comments = post.querySelector(".comments");

  const div = document.createElement("div");
  div.innerHTML = `<small>💬 ${text}</small>`;

  comments.appendChild(div);
  input.value = "";
}


// ---------- FOLLOW ----------
let followers = 0;
function follow(btn){
  if(btn.innerText === "Follow"){
    btn.innerText = "Following";
    followers++;
    document.getElementById("followers").innerText = followers;
  }
}


// ---------- LOGOUT ----------
function logout(){
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
function uploadProfile() {
  const file = document.getElementById("imgInput").files[0];
  document.getElementById("imgInput")


  if (!file) {
    alert("Select image");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file);

  fetch("http://127.0.0.1:3000/upload-profile", {
    method: "POST",
    body: formData
  })
 .then(res => res.json())
  .then(data => {
    console.log(data);
    alert(data.msg);
  })
  .catch(err => {
    console.error(err);
    alert("Upload failed");
  })
};
function signup(event){
  event.preventDefault(); // page refresh stop

  const username = document.getElementById("suUser").value;
  const email    = document.getElementById("suEmail").value;
  const pass     = document.getElementById("suPass").value;
  const repass   = document.getElementById("suRePass").value;
  const phone    = document.getElementById("suPhone").value;
  const dob      = document.getElementById("suDob").value;
  const msg      = document.getElementById("signupMsg");

  if(pass !== repass){
    msg.innerText = "Passwords do not match";
    return;
  }

  fetch("http://127.0.0.1:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password: pass,
      phone,
      dob
    })
  })
  .then(res => res.json())
  .then(data => {
    if(data.msg === "Signup success"){
      msg.style.color = "green";
      msg.innerText = "Account created successfully";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      msg.innerText = data.msg;
    }
  })
  .catch(() => {
    msg.innerText = "Server error";
  });
}
