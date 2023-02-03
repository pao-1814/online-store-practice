import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, toggleCategories, setCategory } from "../../features/categories/categoriesSlice";
import './filters.style.css';
import { useNavigate } from "react-router-dom";
import { selectSearch, setSearch } from "../../features/search/searchSlice";

export const Filters = (props) => {
    const {filtersAvailable} = props;
    const dispatch = useDispatch();
    const category = useSelector(selectCategory).category;
    const categoriesList = useSelector(selectCategory).categoriesList;
    const categoryOpen = useSelector(selectCategory).categoryOpen;
    const navigator = useNavigate();
    const searchStr = useSelector(selectSearch).searchStr;
    return(
        <div className="filters__filters-menu-wrapper">
            <input name="search" onKeyDown={(e) => {
                if(e.key === 'Enter'){
                    navigator('/search/' + searchStr);
                }
            }} onChange={(e) => {dispatch(setSearch(e.target.value))}} type="search" defaultValue={searchStr} className="filters__search" placeholder='&#61442; Search products by name'/>
            {filtersAvailable 
            ? 
                <div className="filters__category">
                    <button onClick={() => dispatch(toggleCategories())} className="filters__category-btn">
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 9H4V5H0V9ZM0 14H4V10H0V14ZM0 4H4V0H0V4ZM5 9H17V5H5V9ZM5 14H17V10H5V14ZM5 0V4H17V0H5Z" fill="#727272"/>
                        </svg>
                        <p className="category-btn-text">{category ? category : 'Choose Category'}</p>
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.14256 7.62263L14.7307 0.206904C15.0092 -0.0569425 15.4723 -0.0701755 15.7649 0.17716C16.0576 0.424495 16.0691 0.838996 15.7904 1.10284L9.06588 8.67222C8.86861 8.85905 8.57881 8.92028 8.32251 8.85227C8.03055 9.06765 7.59773 9.0531 7.32469 8.80862C7.03436 8.54867 0.217836 1.35396 0.217836 1.35396C-0.072612 1.09414 -0.072612 0.672842 0.217836 0.412901C0.508284 0.153081 0.978876 0.153081 1.26934 0.412901L8.14256 7.62263Z" fill="#727272"/>
                        </svg>
                    </button>
                    {categoryOpen 
                    ?
                    <div className="filters__categories-list">
                        <button onClick={() => dispatch(setCategory(''))} className="filters__category-item">All items</button>
                        {categoriesList.map((cat) => {
                            return(
                                <button key={cat} onClick={(e) => dispatch(setCategory(e.target.textContent))} className="filters__category-item">{cat[0].toUpperCase() + cat.substring(1)}</button>
                            )
                        })}
                    </div>
                    :
                    <></>
                    }
                </div>
            :
            <></>
            }
        </div>
    )
}