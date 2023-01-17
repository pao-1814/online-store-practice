import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, toggleCategories, setCategory } from "../../features/categories/categoriesSlice";
import { selectSorting, toggleSorting, setSorting } from "../../features/sorting/sortingSlice";
import { useEffect } from "react";
import searchIcon from '../../assets/icons/search.svg';
import './filters.style.css';
import categoryIcon from '../../assets/icons/categoryIcon.svg';
import greyArrow from '../../assets/icons/grey_arrow.svg';
import sortingIcon from '../../assets/icons/icon_sorting.svg';
import { useNavigate } from "react-router-dom";
import { selectSearch, setSearch } from "../../features/search/searchSlice";

export const Filters = (props) => {
    const {filtersAvailable} = props;
    const dispatch = useDispatch();
    const category = useSelector(selectCategory).category;
    const categoriesList = useSelector(selectCategory).categoriesList;
    const categoryOpen = useSelector(selectCategory).categoryOpen;
    const sorting = useSelector(selectSorting).sorting;
    const sortingOpen = useSelector(selectSorting).sortingOpen;
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
            <>
                <div className="filters__category">
                    <button onClick={() => dispatch(toggleCategories())} className="filters__category-btn">
                        <img src={categoryIcon} alt='category-icon'></img>
                        <p className="category-btn-text">{category ? category : 'Choose Category'}</p>
                        <img src={greyArrow} alt='arrow'></img>
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
                <div className="filters__sorting">
                    <button onClick={() => dispatch(toggleSorting())} className="filters__sorting-btn">
                        <img src={sortingIcon} alt='sorting-icon'></img>
                        <p className="category-btn-text">{sorting ? sorting : 'Sorting'}</p>
                        <img src={greyArrow} alt='arrow'></img>
                    </button>
                    {sortingOpen 
                    ?
                    <div className="filters__categories-list">
                        <button onClick={() => dispatch(setSorting(''))} className="filters__category-item">Default</button>
                        <button onClick={(e) => dispatch(setSorting(e.target.textContent))} className="filters__category-item">Asc</button>
                        <button onClick={(e) => dispatch(setSorting(e.target.textContent))} className="filters__category-item">Desc</button>
                    </div>
                    :
                    <></>
                    }
                </div>
            </>
            :
            <></>
            }
        </div>
    )
}