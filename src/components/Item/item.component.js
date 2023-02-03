import React from "react";
import './item.style.css';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { likeItem, selectFavourites } from "../../features/favourites/favouritesSlice";

export const Item = (props) => {
    const {id, imgUrl, title, price} = props;
    const likedItems = useSelector(selectFavourites).likedItems
    const liked = likedItems.includes(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return(
        <div className="homepage-item">
            <div onClick={() => navigate('/products/' + id)} className="homepage-item__img-wrapper">
                <img className="homepage-item__img" src={imgUrl} alt={title}></img>
            </div>
            <p className="homepage-item__title">{title}</p>
            <p className="homepage-item__price">${price}</p>
            <div onClick={() => dispatch(likeItem(id))} className="homepage-item__like">
                <svg width="20" height="19" viewBox="0 0 20 19" fill={liked ? '#FD7114' : 'none'} xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.3944 2.68343C15.3737 0.561572 12.1524 0.444781 10 2.33751C7.84849 0.445673 4.62717 0.561572 2.60557 2.68343C1.56972 3.7711 1 5.21628 1 6.75507C1 8.29386 1.56972 9.73993 2.60557 10.8267L9.03972 17.5828C9.30462 17.8609 9.65274 18 10 18C10.3473 18 10.6954 17.8609 10.9603 17.5828L17.3944 10.8267C18.4303 9.73993 19 8.29475 19 6.75507C19 5.21628 18.4303 3.77021 17.3944 2.68343Z" stroke={liked ? 'none' : "#707070"}/>
                </svg>
            </div>
        </div>
    )
}