
// do something!
import { Nav, NewsList, store } from './components/index.js'
const get = (target) => {
  return document.querySelector(target)
}

let page = 1
const pageSize = 5 // 한 번에 가져오는 데이터 개수
let total = 0 // 현재까지 불러온 데이터 개수
let end = Number.MAX_SAFE_INTEGER // 전역변수로 관리
// const category = ''
let isCategoryChanged = false // 카테고리 처음 변경하면 스크롤 금지

const $root = get('#root')
const API_KEY = 'b011ef58697141568db9adcde2861f3f'
// const API_KEY2 = 'a22384a2f58645b38b03042b371375e0'
// const API_KEY3 = '0c08fa867ea94be184a866d76fe5d0b1'
// const API_KEY4 = 'e3ee7ac1d10142fbba7da5b7fac850d7'

const defaultImgUrl = 'https://image.ajunews.com/content/image/2022/02/20/20220220180523846963.jpg'
const defaultDesc = 'No description available'
// 페이지 로드 처음할 때, 카테고리와 5개의 뉴스기사 보이기

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
// const init = () => {
//   const $nav = document.createElement('nav')
//   const $newsListContainer = document.createElement('div')
//   $nav.classList.add('category-list')
//   $newsListContainer.classList.add('news-list-container')
//   $nav.innerHTML = `
//       <ul>
//         <li id="all" class="category-item active">전체보기</li>
//         <li id="business" class="category-item">비즈니스</li>
//         <li id="entertainment" class="category-item">엔터테인먼트</li>
//         <li id="health" class="category-item">건강</li>
//         <li id="science" class="category-item">과학</li>
//         <li id="sports" class="category-item">스포츠</li>
//         <li id="technology" class="category-item">기술</li>
//       </ul>
//  `
//   $newsListContainer.innerHTML = `<article class="news-list">
//     </article>`

//   const $loader = document.createElement('div')
//   $loader.classList.add('scroll-observer')
//   $loader.innerHTML = `<div class="scroll-observer">
//     <img src="img/ball-triangle.svg" alt="Loading..." />
//   </div>`

//   $root.appendChild($nav)
//   $root.appendChild($newsListContainer)
//   $root.appendChild($loader)
// }

// 카테고리 클릭 시, 카테고리 선택
// const getCategory = (e) => {
//   if (!e.target.classList.contains('category-item')) return
//   const $category = e.target.closest('.category-item')
//   const $newsList = get('.news-list')
//   const $selectedCategory = get('.category-item.active')

//   //   isCategoryChanged = true

//   // 클릭한 카테고리 색상 변경
//   $selectedCategory.classList.remove('active')
//   $category.classList.add('active')
//   category = $category.id
//   $newsList.innerHTML = ''
//   total = 5
//   page = 1
//   console.log('selected ctg: ', category)
//   loadPost()
// }

// 해당 카테고리 전체 기사 개수 구하기

const showPost = (posts) => {
  console.log('posts ', posts)
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

// 데이터 가져오기
const getPost = async (category) => {
  console.log('category in getPost: ', category)
  const API_URL = `https://newsapi.org/v2/top-headlines?country=kr&category=${
        category === 'all' ? '' : category
    }&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`

  try {
    const response = await window.axios.get(API_URL)
    console.log('response in getPost: ', response)
    return response
  } catch (error) {
    console.error(error)
  }

  console.log('cat in getPost: ', category)
  // return response.json() // awiat 한 번 더 해야 json 됨
}

export const loadPost = async (category) => {
  try {
    const response = await getPost(category)
    end = response.data.totalResults
    showPost(response.data.articles)
    isCategoryChanged = false
  } catch (error) {
    console.error(error)
  }
}

// 카테고리를 loadOnScroll에 넘겨줘야하는데
const LoadOnScroll = () => {
  const options = {
    threshold: 1
  }
  const $scrollObserver = get('.scroll-observer')

  // 타겟 요소의 가시성에 변화가 감지되면(threshold와 만나면) callback 실행

  // 타겟 요소가 화면에 안 보이는데 왜 로드를 더 하지..?
  const observer = new IntersectionObserver((entries) => {
    if (total >= end || page > 5) {
      return
    }
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) {
        page++
        total += 5
        console.log('======total=======', total)
        loadPost(store.state.category)
      }
    })
  }, options)
  if ($scrollObserver) {
    observer.observe($scrollObserver)
  }
}

const categoryChange = (category) => {
  console.log('ct: ', category)
  const $newsList = document.querySelector('.news-list')
  $newsList.innerHTML = ''
  page = 1
  total = 0
  isCategoryChanged = true
  // loadPost(category)
}

window.addEventListener('DOMContentLoaded', () => {
  init()
  // $root.addEventListener('click', getCategory) // 카테고리 선택 시, 해당 카테고리 내 기사 개수 구하기
  // loadPost('all')
  LoadOnScroll()
  store.events.subscribe('categoryChange', categoryChange)
})
