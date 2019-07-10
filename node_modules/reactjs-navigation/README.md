# reactjs-navigation
A plug and play navigation bar which handles everything through props.


![](https://d2mxuefqeaa7sj.cloudfront.net/s_86591FB794132C7BE9E767197E3584B3C5567A5820418BAE9F8C3775ABA9569E_1525903167955_giphy.gif)



![](https://d2mxuefqeaa7sj.cloudfront.net/s_86591FB794132C7BE9E767197E3584B3C5567A5820418BAE9F8C3775ABA9569E_1525903279861_Screen+Shot+2018-05-10+at+00.00.27.png)
![](https://d2mxuefqeaa7sj.cloudfront.net/s_86591FB794132C7BE9E767197E3584B3C5567A5820418BAE9F8C3775ABA9569E_1525903279879_Screen+Shot+2018-05-10+at+00.00.40.png)


it is fairly simple but is responsive and can have drop downs if required.
The Component should ideally be loaded directly from the Router as shown in the example.

##  INSTALLATION

    `npm i reactjs-navigation --save`
## Usage Example:

    import React from 'react'
        import {
          BrowserRouter as Router,
        } from 'react-router-dom'
        
        import NavBarNPM from 'reactjs-navigation'
        export default ()=> {
            const options = [
              '/',
              'Gallery',
              'Contact'
            ]
            return(
                <Router>
                  <div>
                    <NavBarNPM 
                      pages      ={options}
                    />
                    <div>
                      </div>
                  </div>
                </Router>
            )
          }

   
    
The basic navbar without dropdown  can take the following props, only pages is required as a navbar usually requires at least one!

## Navbar props types:
        background             = string
        pages                  = array(required)
        logo                   = string
        logoheight             = string
        color                  = string
        borderRadius           = string
        imgLogoAlt             = string
        dropdown_color         = string
        iconHeight             = string
        iconBorderRadius       = string
        animation              = string
        iconPosition           = string
        angle                  = number 
        the angle props has to be a number between 0 and 2 and it determines the burger menu angle when the menu is open (mobile view))
        0 45deg,  1 90deg, 2 0deg

    

## NAVBAR PROPS DEFALT VALUES


        background              = 'rgba(1,0,0,.9)'
        pages                   =  ['/','gallery','contact','about']
        logo                    = 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
        logoheight              = '50px'
        color                   = 'white'
        borderRadius            = '30px'
        imgLogoAlt              = 'github'
        iconHeight              = '40px'
        iconBorderRadius        = '10px'
        animation               =  true
        iconPosition            = 'center' (center, 'flex-start', 'flex-end')
        angle                   = 0
##  USING DROPDOWNS

To use dropdowns all you have to do is to pass one or more page as an objects inside the pages array instead of a string using the following format.

    { 'THE_NAME_OF_YOUR_PAGE': { dropdown:['dropdown1', 'dropdown2']}

   

##   DROPDOWN PROPS TYPES


        dropdown_color          = string
        dropdown_minWidth       = string
        shadows                 = bool
        dropdown_marginTop      = string
        dropItem_margin_bottom  = string


## DROPDOWN PROPS DEFALT VALUES
        dropdown_color          = 'rgba(1,0,0,.9)'
        dropdown_minWidth       = '200px'
        shadows                 = false
        dropdown_marginTop      = '55px'
        dropItem_margin_bottom  = '10px'
##  Example passing some optional props and also using dropdowns.
    import React from 'react'
        import {
          BrowserRouter as Router,
        } from 'react-router-dom'
        
        import NavBarNPM from 'reactjs-navigation'
        export default ()=> {
            const options = [
              '/',
              {
                'Products':
              { dropdown:['dropdown1', 'dropdown2']}
              },
              {
                'About us':
                {dropdown:['dropdown1', 'dropdown2']}
              }
            ]
            return(
                <Router>
                  <div>
                    <NavBarNPM 
                      pages      ={options}     
                      background      = 'rgba(1,0,0,.9)'
                      pages           = {options}
                      logo            = 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
                      logoheight      = '50px'
                      color           = 'white'
                      borderRadius    = '30px'
                      imgLogoAlt      = 'github logo'
                      dropdown_color  = 'rgba(1,0,0,.9)'
                    />
                    <div>
                      </div>
                  </div>
                </Router>
            )
          }

    

## Using Icons
    import React from 'react'
    import {
      BrowserRouter as Router,
    } from 'react-router-dom'
    import NavBarNPM from 'reactjs-navigation'
    export default ()=> {
        const options = [
          '/',
          {
            'Products':
          { dropdown:['page1', 'page2']}
          },
          {
            'About us':
            {dropdown:['dropdown1', 'dropdown2']}
          },
        { icon:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqQ1YbQY6mYVrfFroJNRBYoBBbmDhmtV64WRb6EKwvG0-Dcwd7', 
          page:'user',
          hasDropwDown:true,
          dropdowns:['Register','Login'] 
        }
        ]
        return(
            <Router>
              <div>
                <NavBarNPM 
                  pages      ={options}
                  iconPosition = 'center'
                />
                <div>
                  </div>
              </div>
            </Router>
        )
      }



