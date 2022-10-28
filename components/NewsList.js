
export default function NewsList () {
  const $newsListContainer = document.createElement('div')
  const $newsList = document.createElement('article')
  $newsListContainer.classList.add('news-list-container')
  $newsList.classList.add('news-list')
  $newsListContainer.appendChild($newsList)

  return $newsListContainer
}
