import React, {useState} from 'react';
import {Link, useParams} from "react-router-dom";
import './ProductPage.scss'
import {useEditBasketMutation, useGetDetailProductQuery} from "../../store/products/products.api";
import {Button, Rating} from "@mui/material";
// *Import css files for slider*
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {IProductInfo} from "../../models/Interfaces";
import {useAppSelector} from "../../hooks/redux";
import {useActions} from "../../hooks/actions";
import {ReactComponent as InBasketIcon} from "../../assets/img/basket-order.svg";
import {ReactComponent as EditIcon} from "../../assets/img/edit.svg";
import DialogEditProduct from "../../components/DialogEditProduct/DialogEditProduct";

const ProductPage = () => {
  const {id} = useParams();
  const {openBasket} = useActions()
  const [openEditor, setOpenEditor] = useState(false)
  const {isLoading, data} = useGetDetailProductQuery(String(id));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    swipe: false,
    customPaging: (i: number) => <div className='slider__dots'>
      <img className='slider__dots-image' src={data?.images[i]} alt='Dots'/>
    </div>,
  };

  const user = useAppSelector((state) => state.auth.user);
  let newProduct: IProductInfo = {
    id: data?.id || Number(new (Date)),
    title: data?.title || "",
    img: data?.images[0] || "",
    price: data?.price || 0,
    col: 1
  }
  const {setUser} = useActions()
  const [calculateCount] = useEditBasketMutation();
  let isProductInBasket = false
  isProductInBasket = user?.basket ? (user?.basket?.map((elem: IProductInfo) => elem.id)).includes(newProduct.id) : false

  const handleAddToBasket = async () => {
    try {
      let result = await calculateCount({
        ...user,
        basket: !isProductInBasket ? [...user.basket, newProduct] : [...user.basket]
      }).unwrap()
      setUser(result)
      openBasket(true)
    } catch (err) {
      alert("Please, login");
    }
  };

  const handleEditProduct = () => {
    setOpenEditor(true);
  }

  return (
    <main className='productPage'>
      {isLoading
        ? <h2>Loading...</h2>
        : <>
          <Link className='productPage__link' to='/'>Back to homepage</Link>
          <div className='productPage__inner'>
            <div className='productPage__images'>
              <Slider {...settings}>
                {data?.images.map((item, i) => <img src={item} alt='slider' key={i}/>)}
              </Slider>
            </div>

            <div className='productPage__content'>
              <div className='productPage__group'>
                <h1 className='productPage__title'>{data?.title}</h1>
                <Rating className='productPage__rating' name="read-only" value={data?.rating} size="small" readOnly/>
              </div>

              <div className='productPage__group'>
                <h3 className='productPage__price'>{data?.price.toLocaleString('en')}$</h3>
                <h4 className='productPage__stock'>{data?.stock} pieces</h4>
              </div>

              {!isProductInBasket
                ? (<Button
                  className='productPage__buyButton'
                  variant="outlined"
                  disabled={!user.basket}
                  onClick={() => handleAddToBasket().then()}
                >
                  Add to basket
                </Button>)
                : <div className='productPage__inBasket' onClick={() => openBasket(true)}>
                  <InBasketIcon />
                  <div>Already in the basket</div>
                </div>
              }

              {user?.role === 'admin' && (
                <div className='productPage__edit' onClick={() => handleEditProduct()}>
                  <EditIcon />
                  <div>Edit product</div>
                </div>
              )}

              <p className='productPage__description'>
                {data?.description}
              </p>
            </div>
          </div>
          <p
            className='productPage__text'
            dangerouslySetInnerHTML={{__html: data?.text as string}}
          />

          {data?.title && (
            <DialogEditProduct
              product={data}
              openEditor={openEditor}
              setOpenEditor={setOpenEditor} />
          )}
        </>
      }
    </main>
  );
};

export default ProductPage;