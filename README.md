# Spotify Clone
Клон популярного приложения с поддержкой .flac, .wav и .ogg.

## Стек
### Frontend
<ul>
  <li>React</li>
  <li>mobX</li>
  <li>SCSS modules</li>
</ul>

### Backend
<ul>
  <li>PostgreSQL</li>
  <li>Express JS</li>
</ul>

## В разработке
<ul>
  <li><s>Панель создания контента</s></li>
  <ul>
    <li><s>Загрузка и первоначальное редактирование треков</s></li>
    <li><s>Создание альбома</s></li>
    <li><s>Создание плейлиста</s></li>
    <li><s>Создание исполнителя</s></li>
  </ul>
  <li><s>Регистрация и авторизация</s></li>
  <li>Страницы</li>
  <ul>
    <li><s>Главная</s></li>  
    <ul>
      <li><s>Треки</s></li>
      <li>Альбомы</li>
      <li>Плейлисты</li>
    </ul>
    <li>Поиск</li>
    <li><s>Универсальная страница альбома</s></li>
    <li>Универсальная страница плейлиста</li>
  </ul>
  <li>Адаптивное ограничения на кол-во знаков в строках названия трека и имени исполнителя в зависимости от ширины экрана</li>
  <li>AudioPanel в нижней части приложения для управления воспроизведением и звуком</li>
  <ul>
    <li><s>Воспроизведение / пауза</s></li>
    <li><s>Предыдущий трек</s></li>
    <li><s>Следующий трек</s></li>
    <li><s>Перемешать очередь</s></li>
    <li><s>Зациклить трек</s></li>
    <li><s>Полоса и кнопка громкости</s></li>
    <li>Рабочая кнопка добавления / удаления трека из избранного</li>
  </ul>
  <li>Подсветка активного трека в AudioList, даже если он поставлен на паузу</li>
  <li>Воспроизведение очереди с начала, если доиграл последний трек, и была нажата кнопка воспроизведения</li>
</ul>
