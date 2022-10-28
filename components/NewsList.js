// do something!
// 어떻게 newslist를 변경할 건지 update 함수 작성

export default function NewsList () {
  const $newsListContainer = document.createElement('div')
  const $newsList = document.createElement('article')
  $newsListContainer.classList.add('news-list-container')
  $newsList.classList.add('news-list')
  $newsListContainer.appendChild($newsList)

  return $newsListContainer
}
