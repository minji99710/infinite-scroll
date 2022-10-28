
import { Nav, NewsList, store } from './components/index.js'
const get = (target) => {
  return document.querySelector(target)
}

let page = 1
let total = 0
let end = Number.MAX_SAFE_INTEGER
const pageSize = 5

const $root = get('#root')
const API_KEY = 'a22384a2f58645b38b03042b371375e0'
// const API_KEY2 = 'b011ef58697141568db9adcde2861f3f'
// const API_KEY3 = '0c08fa867ea94be184a866d76fe5d0b1'
// const API_KEY4 = 'e3ee7ac1d10142fbba7da5b7fac850d7'

const defaultImgUrl = 'https://image.ajunews.com/content/image/2022/02/20/20220220180523846963.jpg'
const defaultDesc = 'No description available'

const init = () => {
  const $loader = document.createElement('div')
  $loader.classList.add('scroll-observer')
  $loader.innerHTML = `
    <img src="img/ball-triangle.svg" alt="Loading..." />
`
  $root.appendChild(Nav())
  $root.appendChild(NewsList())
  $root.appendChild($loader)
}

const showPost = (posts) => {
  const $newsList = get('.news-list')

  posts.forEach((post) => {
    const $post = document.createElement('section')
    $post.classList.add('news-item')
    $post.innerHTML = ` <div class="thumbnail">
        <a href="${post.url}" target="_blank" rel="noopener noreferrer">
          <img
            src="${post.urlToImage || defaultImgUrl}"
            alt="thumbnail" />
        </a>
      </div>
      <div class="contents">
        <h2>
          <a href="${post.url}" target="_blank" rel="noopener noreferrer">
           ${post.title}
          </a>
        </h2>
        <p>
          ${post.description || defaultDesc}
        </p>
      </div>`
    $newsList.appendChild($post)
  })
}

const getPost = async (category) => {
  const API_URL = `https://newsapi.org/v2/top-headlines?country=kr&category=${
        category === 'all' ? '' : category
    }&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`

  try {
    const response = await window.axios.get(API_URL)
    return response
  } catch (error) {
    console.error(error)
  }
}

export const loadPost = async (category) => {
  try {
    const response = await getPost(category)
    end = response.data.totalResults
    showPost(response.data.articles)
  } catch (error) {
    console.error(error)
  }
}

const LoadOnScroll = () => {
  const options = {
    threshold: 1
  }
  const $scrollObserver = get('.scroll-observer')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) {
        page++
        total += 5
        loadPost(store.state.category)
      }
    })
    if (total >= end) {
      // 로더 끄기
      const $loader = get('.scroll-observer')
      $loader.style.display = 'none'
    }
  }, options)
  if ($scrollObserver) {
    observer.observe($scrollObserver)
  }
}

const categoryChange = () => {
  const $newsList = document.querySelector('.news-list')
  $newsList.innerHTML = ''
  page = 1
  total = 0
  const $loader = get('.scroll-observer')
  $loader.style.display = 'block'
}

window.addEventListener('DOMContentLoaded', () => {
  init()
  LoadOnScroll()
  store.events.subscribe('categoryChange', categoryChange)
})
