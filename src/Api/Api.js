const URL = "https://jsonplaceholder.typicode.com"

const fetchPosts = () => {
  return fetch(`${URL}/posts`).then((response) => response.json())
}

const putPost = (id, data) => {
  return fetch(`${URL}/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json())
}

const deletePost = (id) => {
  return fetch(`${URL}/posts/${id}`, {
    method: "DELETE",
  })
}

export default {
  fetchPosts,
  putPost,
  deletePost,
}
