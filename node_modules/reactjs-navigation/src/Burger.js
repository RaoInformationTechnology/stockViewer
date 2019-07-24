import React from 'react'
import './navbar.css'
export default class Burger extends React.Component {
	handleClick (){
		this.props.toggler()
	}
	render(){
		let burger = {
			each: {
				background:this.props.color
			},
			main:{
				transform:this.props.transform,
				transition:'.3s ease all'
			}
		}
		return (
			<div
				style    = {burger.main} 
				onClick  = {this.handleClick.bind(this)} 
				className= "mainBurger">
					<div 
						style={burger.each}
						className="burger"></div>
					<div 
						style={burger.each}
						className="burger"></div>
					<div 
						style={burger.each}
						className="burger"></div>
			</div>
		)
	}
}