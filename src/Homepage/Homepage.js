import styles from "./Homepage.module.css"
import Api from "../Api/Api"
import React, { useState, useEffect } from "react"

export default function Homepage() {
  const [idToEdit, setIdToEdit] = useState(0)
  const [postTitle, setPostTitle] = useState("")
  const [postBody, setPostBody] = useState("")
  const [posts, setPosts] = useState([])
  const [postsToShow, setPostsToShow] = useState([])
  const [pages, setPages] = useState([])
  const [howManyPostsOnPage, setHowManyPostsOnPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    Api.fetchPosts().then((data) => {
      setPosts(data)
    })
  }, [])

  useEffect(() => {
    const howManyPages = posts.length / howManyPostsOnPage
    for (let i = 1; i <= howManyPages; i += 1) {
      pages.push(i)
    }
    pages.length = howManyPages
  }, [posts])

  useEffect(() => {
    let startIndex = currentPage - 1
    let endIndex

    if (currentPage === 1) {
      startIndex = 0
      endIndex = howManyPostsOnPage
    }
    if (currentPage !== 1) {
      startIndex = (currentPage - 1) * howManyPostsOnPage
      endIndex = startIndex + howManyPostsOnPage
    }

    let arr = []

    for (let i = startIndex; i < endIndex; i += 1) {
      arr.push(posts[i])
    }
    setPostsToShow(arr)
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
    setIdToEdit(0)
  }

  const setPage = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className={styles.Container}>
      {postsToShow[0] ? (
        postsToShow.map((post) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.body}</p>

            {idToEdit === post.id ? (
              <div>
                <textarea onChange={(e) => setPostTitle(e.target.value)} value={postTitle}></textarea>
                <textarea onChange={(e) => setPostBody(e.target.value)} value={postBody}></textarea>
                <div>
                  <button onClick={() => savePost(post.id, post.userId)}>Save</button>
                  <button onClick={() => setIdToEdit(0)}>Close</button>
                </div>
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
    </div>
  )
}
