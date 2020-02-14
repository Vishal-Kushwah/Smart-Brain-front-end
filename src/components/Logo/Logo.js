import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return(
		<div className='ma4'>
			<div className=' ma4 mt0'>
				<Tilt className="Tilt br3 shadow-5" options={{ max : 55 }} style={{ height: 100, width: 100 }} >
				  	<div className="Tilt-inner pa3 "> <img style={{paddingTop:'5px'}} alt='Logo' src={brain}/> </div>
				</Tilt>

			</div>
		</div>
	);
}

export default Logo;