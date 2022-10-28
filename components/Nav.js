// do something!
import { store } from './index.js'

const get = (target) => {
  return document.querySelector(target)
}
const category = ['all', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']
const name = ['전체보기', '비즈니스', '엔터테인먼트', '건강', '과학', '스포츠', '기술']
const categoryChange = (e) => {
  if (!e.target.classList.contains('category-item')) return
  const $category = e.target.closest('.category-item')
  const $selectedCategory = get('.category-item.active')

  // 클릭한 카테고리 색상 변경
  $selectedCategory.classList.remove('active')
  $category.classList.add('active')
  store.state.category = e.target.id
}

export default function Nav () {
  const $nav = document.createElement('nav')
  const $newsList = document.createElement('ul')
  $nav.classList.add('category-list')
  for (let i = 0; i < 7; i++) {
    const $li = document.createElement('li')
    $li.setAttribute('id', category[i])
    if (i === 0) $li.classList.add('active')
    $li.classList.add('category-item')
    $li.textContent = name[i]
    $newsList.appendChild($li)
  }
  $nav.appendChild($newsList)
  $nav.addEventListener('click', categoryChange)
  return $nav
}
