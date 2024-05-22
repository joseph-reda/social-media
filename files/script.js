const baseUrl = "https://tarmeezacademy.com/api/v1";

//get posts
const token = localStorage.getItem("token");
let currentPage = 1;
let lastPage = 1;

// SCROLL
window.addEventListener("scroll", function () {
  const endOfPage =
    this.window.innerHeight + this.window.pageYOffset >=
    document.body.offsetHeight;

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    updateLogin(currentPage);
  }
});
// END SCROLL

function updateLogin(page = 1) {
  if (token) {
    axios.get(`${baseUrl}/posts?page=${page}`).then((response) => {
      lastPage = response.data.meta.last_page;
      console.log(lastPage);
      posts = response.data.data;
      for (post of posts) {
        let postTitle = "";

        if (post.title != null) {
          postTitle = post.title;
        }

        let content = `
                <div class="post bg-white rounded mb-8">
                <div class="header bg-slate-200 flex gap-2 items-center p-2">
                <img class="w-12 rounded-full ml-2" src=${post.author.profile_image} alt="icon">
                <h6>${post.author.name}</h6>
                </div>
                <div class="p-4">
                <div class="body">
                <img class="pic rounded" src=${post.image} alt="pic">
                <p class="text-slate-500">${post.created_at}</p>
                <h2 class="text-2xl">${post.body}</h2>
                <h4 class="text-xl text-slate-600">${postTitle}</h4>
                <hr class="my-3">
                <h6 class="text-xl text-slate-600 cursor-pointer" onclick="showComments(${post.id})">(${post.comments_count}) comments</h6>
                <div id="comments-${post.id}" class="flex flex-col mt-4 px-3 rounded-3xl text-black text-lg"></div>
                                </div>
                </div>

                <div id="commentsBody" class="ml-5">
                <div class="flex">
                
                <input id="inputNewComment-${post.id}" class="p-5 text-2xl mb-5 outline-none bg-gray-300 rounded-lg" type="text" placeholder="add a new comment">
                <button onclick="addNewComment(${post.id})" class="btn text-white text-lg p-5 bg-blue-500 rounded-3xl mb-5 -ml-5">
                Send
                </button>
                </div>
                
                </div>

                </div>
                `;
        document.getElementById("post").innerHTML += content;
      }
    });

    console.log("is found");
  } else {
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    alert("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  }
}
//end get posts
//logout

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 500);
}
//end logout

//login
function loginClick() {
  const username = document.getElementById("userName-input").value;
  const password = document.getElementById("password-input").value;
  console.log("aaaaaaaaaaaa");

  const params = {
    username: username,
    password: password,
  };
  const url = `${baseUrl}/login`;
  axios
    .post(url, params)
    .then((response) => {
      if (response.data && response.data.token) {
       console.log("nehruggggggg");
      }
    })
    .catch((error) => {
      alert("userame OR password not sucsess");
    });
}
//end login

//create new account
function createAccount() {
  const registerUserName = document.getElementById(
    "register-userName-input"
  ).value;
  const registerName = document.getElementById("register-name-input").value;
  const registerEmail = document.getElementById("register-email-input").value;
  const registerPassword = document.getElementById(
    "register-password-input"
  ).value;
  const registerImage = document.getElementById("register-img").files[0];

  let formData = new FormData();

  formData.append("username", registerUserName);
  formData.append("password", registerPassword);
  formData.append("name", registerName);
  formData.append("email", registerEmail);
  formData.append("image", registerImage);

  const url = `${baseUrl}/register`;

  axios
    .post(url, formData)
    .then((response) => {
      if (response.data && response.data.token) {
        const token = response.data.token;
        const user = response.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "./home.html";

        updateLogin();
      }
    })
    .catch((error) => {
      alert(
        "Registration failed. Please check your information and try again."
      );
    });
}
//end create new account

//create New Post
// document.body.addEventListener("click", function (event) {
//     // Check if the target of the click event is not within the "new-post" element
//     if (!event.target.closest("#new-post") && !event.target.closest("#new")) {
//         // Hide the "new-post" element
//         document.getElementById("new-post").classList.add("hidden");
//     }
// });
function openNewPost() {
  document.getElementById("new-post").classList.remove("hidden");
}

function closeNewPost() {
  document.getElementById("new-post").classList.add("hidden");
}

function createNewPost() {
  closeNewPost();

  let bodyInput = document.getElementById("body-post").value;
  let imgInput = document.getElementById("img-post").files[0];

  let formData = new FormData();
  formData.append("body", bodyInput);
  formData.append("image", imgInput);

  const headers = {
    authorization: `Bearer ${token}`, // Add space after "Bearer"
  };

  const url = `${baseUrl}/posts`;

  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {});
}

//end create New Post

//show Comments

// document.body.addEventListener("click", function (event) {
//     if (!event.target.closest("#new-post") && !event.target.closest("#new")) {
//         // Hide the "new-post" element
//         document.getElementById("new-post").classList.add("hidden");
//     }
// });

//show input create comment
let nnn = false;

function showComments(postId) {
  const url = `${baseUrl}/posts/${postId}`;
  const commentsContainer = document.getElementById(`comments-${postId}`);
  // Clear existing comments
  commentsContainer.innerHTML = "";

  nnn = !nnn;

  axios.get(url).then((response) => {
    comments = response.data.data.comments;
    const userName = response.data.data.author.username;
    for (comment of comments) {
      if (nnn == true) {
        commentsContainer.innerHTML += `
                <div class="flex gap-3 items-center mb-5">

                <span class="comment-img">
                <img class="rounded-full ml-2" src="../img/icon.jpeg" />
                </span>
                
                <div 
                class="flex flex-col bg-gray-300 px-3 py-1 rounded-3xl text-black text-lg">
                <span class="pb-2"><span class="block text-black text-xl">${userName}</span> ${comment.body}</span>
                </div>
                
                </div>
            
                `;
      }
    }
  });
}

//end show Comments

//Create Comments
function addNewComment(postId) {
  let inputNewComment = document.getElementById(
    `inputNewComment-${postId}`
  ).value;

  let params = {
    body: inputNewComment,
  };
  let url = `${baseUrl}/posts/${postId}/comments`;
  console.log(url);

  axios
    .post(url, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data.data.body);
      window.location.reload();
    });
}

//end Create Comments
