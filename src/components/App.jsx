import { Component } from 'react';
import { SearchBar } from './Gallery/Searchbar/Searchbar';
import { GlobalStyle } from './GlobalStyle/GlobalStyle';
import { ImageGallery } from './Gallery/ImageGallery/ImageGallery';
import fetchImages from './Gallery/API/api';
import { LoadMore } from './Gallery/Button/Button';
import { Container } from 'components/App.styled';
import { ModalOvelay } from './Gallery/Modal/Modal';
import { Loader } from './Gallery/Loader/Loader';
import scrollOnLoad from './Gallery/utils/scrollLoadBtn';

export class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    page: 1,
    largeImage: '',
    error: null,
    isModalOpen: false,
    isLoading: false,
  };

  // Якщо оновився стейт рендеримо картинки
  componentDidUpdate(_, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.getDataImages();
    }
  }

  // При сабміті форми приймає значення інпуту і скидає images та page
  handleSubmitSearchQuery = searchQuery => {
    this.setState({ images: [], searchQuery, page: 1 });
  };

  // Витягуємо дані з фетча і записуємо в стейт
  getDataImages = async () => {
    const { searchQuery, page } = this.state;

    this.setState({ isLoading: true });

    try {
      const { hits } = await fetchImages(searchQuery, page);

      this.setState(({ images, page }) => ({
        images: [...images, ...hits],
        page: page + 1,
      }));

      if (page !== 1) {
        scrollOnLoad();
      }
    } catch (error) {
      this.setState({ error: 'Oops something went wrong...' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // Отримуємо Оригінальне зображення по кліку і відкриваємо модалку
  getLargeImage = largeImage => {
    this.setState({ largeImage, isModalOpen: true });
  };

  // Toggle модалки
  toggleShowModal = () => {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  };

  render() {
    const { images, largeImage, isModalOpen, isLoading, error } = this.state;
    const lengthImages = images.length >= 12;

    return (
      <Container>
        <SearchBar onSubmit={this.handleSubmitSearchQuery} />
        {error}
        <ImageGallery items={images} getItemClick={this.getLargeImage} />
        {isLoading && <Loader />}
        {lengthImages && <LoadMore onLoadMore={() => this.getDataImages} />}
        {isModalOpen && (
          <ModalOvelay
            largeImageURL={largeImage}
            onClick={this.toggleShowModal}
          />
        )}

        <GlobalStyle />
      </Container>
    );
  }
}