import React from 'react'
import './dropdown.css'
import Style from 'style-it'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'
import './navbar.css'

const DropDown = props => {
        return <Style>
        {`
            .dropdown-content {
                transform:scaley(0);
                transition: ${props.animation ? '0.3s ease-in-out transform' : null};
                margin-top:${props.dropdown_marginTop};
                position: absolute;
                background-color: ${props.dropdown_color};
                min-width: ${props.dropdown_minWidth};
                box-shadow: ${props.shadows ? '0px 8px 6px 0px rgba(0,0,0,0.2)' : null};
                z-index: 1;
                text-align:center;
            }
            .dropdown:hover .dropdown-content {
                transform: scaley(1);
                transition: ${props.animation ? '0.3s ease-in-out all' :null}
            }
            .item{
                margin-bottom:${props.dropItem_margin_bottom};
            }
        `}
            <ul className="dropdown-content">
                {    
                    props.dropdownItems.map((ele, i)=>{
                        return  <li    
                                    className ='item' key ={i} >
                                    <NavLink 
                                        className ='item'
                                        to = {`/${ele}`}
                                        exact className="inactive"
                                        activeClassName="active">
                                    {ele}
                                    </NavLink>
                                </li>
                })            
                }
            </ul>
        </Style>
}
DropDown.propTypes = {
    dropdown_color          : PropTypes.string,
    dropdown_minWidth       : PropTypes.string,
    shadows                 : PropTypes.bool,
    dropdownItems           : PropTypes.array.isRequired,
    dropdown_marginTop      : PropTypes.string,
    dropItem_margin_bottom  : PropTypes.string,
}

export default DropDown;