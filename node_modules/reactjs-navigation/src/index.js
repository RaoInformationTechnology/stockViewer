import React from 'react'
import { NavLink } from 'react-router-dom'
import Responsive from 'react-responsive';
import Burger 		from './Burger'
import PropTypes from 'prop-types';
import './navbar.css'
import Style from 'style-it';
import DropDown from './DropDown'
import './dropdown.css'
import './index.css'

const Desktop 	  = props => <Responsive {...props } minWidth = { 600} />;
const Mobile  	  = props => <Responsive {...props } minWidth = { 0 } maxWidth={600}  />;

export default class NavBarNPM extends React.Component{
	constructor(){
		super()
		this.state = {display:'none', scale:'scaley(0)', transform:'', rotateAngle:['45deg', '90deg', '0deg'] }
		this.createNavBar =this.createNavBar.bind(this)

	}
	toogler  = () => {

		var that = this
		var scaleIt = ( key, val, time, key2, val2 ) => {
			setTimeout(()=>{
				that.setState({[key]:val,[key2]:val2})
			},time)
		}
		if (this.state.display === 'none')  {
			that.setState({display:'block', transform:`rotate(${this.state.rotateAngle[this.props.angle]})`},scaleIt('scale', 'scaley(1)',50))
		} else {
			that.setState({transform:'', scale:'scaley(0)'}, scaleIt('display','none',500))
		}
	}

	
	createNavBar(main, size){
		var iconStyle
		if(size != 'smallNav'){
			iconStyle = {
				display:'grid',
				justifyContent: 'center'
			}
		}
		var content;
		var linkTo;
		return this.props.pages.map((ele, i)=>{
			var pageComp;
			if(ele.icon){
				content = <div><img
				style={{
					maxHeight:this.props.iconHeight,
					borderRadius:this.props.iconBorderRadius
				}}
				  alt = {this.props.iconAlt}
				  src = {ele.icon}
				/></div>
				if(ele.hasDropwDown){
					dropdownArray = ele.dropdowns
				}
				linkTo = ele.page
			}
			if(ele === '/'){
				linkTo = ''
				content = <img
              				style={{
              					maxHeight:this.props.logoheight,
              					borderRadius:this.props.borderRadius
							  }}
							  alt = {this.props.imgLogoAlt}
              				  src = {this.props.logo}
              				/>
			}else{
				if(!ele.icon){
					var dropdownArray;
					typeof ele === 'object' ? dropdownArray = ele[Object.keys(ele)[0]].dropdown : null
					typeof ele === 'object' ? content = Object.keys(ele)[0] : content = ele;
					typeof ele === 'object' ? linkTo  = Object.keys(ele)[0] : linkTo = ele;
				}
			}
				pageComp = 				<div
					onClick ={this.toogler}
					className='dropdown'
					style={[main.element, iconStyle]}
              				key = {i}>
						{ dropdownArray ?
						  <li 
						  	style={{
								  color:this.props.color, 
								  display:'flex',
								  alignItems:'center',
								  justifyContent: this.props.iconPosition,
								  height:'50px'
								}}
						  	to={`/${linkTo}`}>
							{content}

									<DropDown 
										dropdown_color     		=   {this.props.dropdown_color}
										dropdownItems 	   		=   {dropdownArray}
										dropdown_minWidth  		=   {this.props.dropdown_minWidth}
										shadows 		   		=   {this.props.shadows}
										dropdown_marginTop 		=   {this.props.dropdown_marginTop}
										dropItem_margin_bottom  =   {this.props.dropItem_margin_bottom}
										animation 				=   {this.props.animation}
									/>

              			</li>
						:
						<NavLink 
							style={{color:this.props.color}}
							to={`/${linkTo}`} 
							exact className="inactive"
							activeClassName="active">
					  {content}


					</NavLink>}
              	</div>
			return pageComp
		})
	}


	render(){


		let main = {
			desktop:{
				display:'grid',
				minHeight:'60px',
				alignItems:'center',
				gridTemplateColumns:`repeat(${this.props.pages.length}, 1fr)`,
				backgroundColor: this.props.background,
				position:'fixed',
				top:0,
				width:'100%',
				zIndex:100
			},
			mobile:{
				display:'grid',
				alignItems:'center',
				gridTemplateColumns:'1fr',
				gridGap:'20px',
				transition:'.5s ease all',
				position:'fixed',
				top:0,
				zIndex:100,
				width:'100%',
				backgroundColor:this.props.background,

			},
			element:{
				padding:'10px',
				textDecoration:'none'
			},
			burger:{
				display:this.state.display,
				transform:this.state.scale,
				transition:'.5s ease all'
			},
			minNav:{
				backgroundColor: this.props.background,
				marginBottom:'100px'
			}
		}
		return ( 
			<Style>
				{`
					.active::after {
						width: 100%;
						transition: width .3s;
						background: ${this.props.color};
					}
				`}
			<div style={main.minNav} className="mobile">
			<Desktop className="desktop">
			<ul style={main.desktop}>

				{this.createNavBar(main)}
			</ul>
			</Desktop>
			<Mobile>
			<Burger 
				color     = "black"
				toggler   = {this.toogler} 
				transform = {this.state.transform}
			/>
			<div style={main.burger}>
				<ul 
				style={main.mobile} className="nav_bar">
				{this.createNavBar(main, 'smallNav')}
			</ul></div>
			</Mobile>
			</div>
		</Style>
		)
	}
}

NavBarNPM.defaultProps = {
	background:'rgba(1,0,0,.9)',
	pages:['/','gallery','contact','about'],
	logo:'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png',
	logoheight:'50px',
	color:'white',
	borderRadius:'30px',
	imgLogoAlt:'github',
    dropdown_color:'rgba(1,0,0,.9)',
    dropdown_minWidth:'200px',
    shadows:false,
    dropdown_marginTop : '55px',
	dropItem_margin_bottom:'10px',
	iconHeight:'40px',
	iconBorderRadius:'10px',
	animation:true,
	iconPosition:'center',
	angle:0
}
NavBarNPM.propTypes = {
	background      		: PropTypes.string,
	pages 	        		: PropTypes.array.isRequired,
	logo 	        		: PropTypes.string,
	logoheight      		: PropTypes.string,
	color 	        		: PropTypes.string,
	borderRadius    		: PropTypes.string,
	imgLogoAlt      		: PropTypes.string,
	dropdown_color 			: PropTypes.string,
	dropdown_minWidth       : PropTypes.string,
    shadows                 : PropTypes.bool,
    dropdownItems           : PropTypes.array,
    dropdown_marginTop      : PropTypes.string,
	dropItem_margin_bottom  : PropTypes.string,
	iconHeight 				: PropTypes.string,
	iconBorderRadius		: PropTypes.string,
	animation				: PropTypes.string,
	iconPosition			: PropTypes.string,
	angle 					: PropTypes.number
}