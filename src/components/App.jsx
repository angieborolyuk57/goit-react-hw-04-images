import React, { useState, useEffect } from 'react';
import Searchbar from './SearchBar/SearchBar.jsx';
import ImageGallery from './ImageGallery/ImageGallery.jsx';
import Button from './Button/Button.jsx';
import Modal from './Modal/Modal.jsx';
import Loader from './Loader.jsx';
import { getImages } from 'api/products.js';
import {
  checkResponse,
  onError,
  onInputEmpty,
} from 'api/api.js';

const App = () => {
  const [modal, setModal] = useState({ isOpen: false, visibleData: null });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('love');
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await getImages(searchQuery, page);
        checkResponse(response, page);
        setImages((prevImages) => [...prevImages, ...response.hits]);
        setTotalImages(response.totalHits);
      } catch (error) {
        onError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery, page]);

  const onOpenModal = (data) => {
    setModal({
      isOpen: true,
      visibleData: data,
    });
  };

  const onCloseModal = () => {
    setModal({ isOpen: false, visibleData: null });
  };

  const onSubmit = (searchQuery, form) => {
    if (!searchQuery) {
      onInputEmpty();
      return;
    }
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
    setTotalImages(0);
    form.reset();
  };

  const onLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const showButton = !isLoading && totalImages !== images.length;

  return (
    <div>
      {isLoading && <Loader />}
      <Searchbar onSubmit={onSubmit} />
      {images.length > 0 && (
        <ImageGallery imagesArray={images} onOpenModal={onOpenModal} />
      )}
      {showButton && <Button onLoadMore={onLoadMore} />}
      {modal.isOpen && (
        <Modal visibleData={modal.visibleData} onCloseModal={onCloseModal} />
      )}
    </div>
  );
};

export default App;
