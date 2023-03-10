import React from 'react';
import {Link} from "react-router-dom";
import './ProductCard.scss';
import {IProducts} from "../../models/Interfaces";
import {Rating} from "@mui/material";

interface IProductCardProps {
  product: IProducts,
  setCatName: (name: string) => void,
  setPageNumber: (page: number) => void,
}

const ProductCard: React.FC<IProductCardProps> = ({product, setCatName, setPageNumber}) => {

  const onClickCategory = (category: string) => {
    setPageNumber(1);
    setCatName(category)
  }

  return (
    <div className='productCard'>

      <div className='productCard__images'>
        <img className='productCard__image' src={product?.images[0]} alt={product?.title}/>
        {product?.images.length > 1 && (
          <img className='productCard__image' src={product?.images[1]} alt={product?.title}/>
        )}
        <Link className='productCard__link' to={`/${product.id}`}/>
      </div>

      <div className='productCard__inner'>
        <div className='productCard__info'>
          <div className='productCard__title'>{product.title}</div>
          <div className='productCard__price'>{product.price.toLocaleString('en')}$</div>
        </div>

        <div className='productCard__info'>
          <Rating className='productCard__rating' name="read-only" value={product.rating} size="small" readOnly/>
          <div
            className='productCard__category'
            onClick={() => onClickCategory(product.category)}
          >
            {product.category}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;