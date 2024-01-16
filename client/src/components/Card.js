const Card = ({ title, image, onCardClick }) => {
  return (
      <div className='col' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div className="card" style={{width: '150px'}} onClick={onCardClick}>
              <img src={image} alt={title} style={{maxWidth: '80%', margin:'auto' }} />
              <div className='card-body'>
                  <h6>{title}</h6>
              </div>
          </div>
      </div>
  );
};

export default Card;
