import React from 'react';

const Chemical = ({ id, link, name, picture, price,source }) => (
    <div className="chemContainer">
        {!picture ? <img className="chemImg" src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"/>: <img className="chemImg" src={picture} />}
        <span><a href={link} className="chemName">{name}</a></span>
        <br />
        <span className="chemPrice">${price}</span>
        <br/>
        <span className="source">Source: {source}</span>
    </div>
);

export default Chemical;