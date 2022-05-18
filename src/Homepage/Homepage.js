import Api from "../Api/Api"
import React, { useState, useEffect } from "react"

export default function Homepage() {
  const [idToEdit, setIdToEdit] = useState(0)
  const [postTitle, setPostTitle] = useState("")
  const [postBody, setPostBody] = useState("")
  const [posts, setPosts] = useState([])
  const [postsToShow, setPostsToShow] = useState([])
  const [pages, setPages] = useState([])
  const [howManyPostsOnPage, setHowManyPostsOnPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    Api.fetchPosts().then((data) => {
      setPosts(data)
    })
  }, [])

  useEffect(() => {
    const howManyPages = posts.length / 5
    for (let i = 1; i <= howManyPages; i += 1) {
      pages.push(i)
    }
    pages.length = howManyPages
  }, [posts])

  useEffect(() => {
    setPostsToShow(posts.slice(currentPage, howManyPostsOnPage))
  }, [posts, currentPage])

  const editPost = (id, title, body) => {
    setIdToEdit(id)
    setPostTitle(title)
    setPostBody(body)
  }

  const savePost = (id, userId) => {
    const postToPut = {
      id,
      title: `${postTitle}`,
      body: `${postBody}`,
      userId,
    }

    Api.putPost(id, postToPut).then((answer) => console.log(answer))

    setIdToEdit(0)
  }

  const deletePost = (id) => {
    Api.deletePost(id).then((answer) => console.log(answer))
  }

  const setPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      {postsToShow ? (
        postsToShow.map((post) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.body}</p>

            {idToEdit === post.id ? (
              <div>
                <textarea onChange={(e) => setPostTitle(e.target.value)} value={postTitle}></textarea>
                <textarea onChange={(e) => setPostBody(e.target.value)} value={postBody}></textarea>
                <button onClick={() => savePost(post.id, post.userId)}>Save</button>
              </div>
            ) : null}
            <div>
              <button onClick={() => editPost(post.id, post.title, post.body)}>Edit</button>
              <button onClick={() => deletePost(post.id)}>Remove</button>
            </div>
          </div>
        ))
      ) : (
        <h1>Loading...</h1>
      )}
      <div>
        {pages.map((page) => (
          <button key={page} onClick={() => setPage(page)}>
            {page}
          </button>
        ))}
      </div>
    </>
  )
}
