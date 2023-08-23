const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let deleteBtn = document.querySelectorAll(".video__comment-deleteBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "video__comment-deleteBtn";
  deleteBtn.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteBtn);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDelete = async (event) => {
  const comment = event.target.parentElement;
  const { id } = comment.dataset;
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ commentId: id }),
  });

  if (response.status === 200) {
    comment.remove();
  }
};

deleteBtn.forEach((btn) => {
  btn.addEventListener("click", handleDelete);
});
