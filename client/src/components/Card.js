import { useNavigate } from 'react-router-dom';

const Card = ({ title, category, image, bootstrapIcon }) => {
  const navigate = useNavigate();

  const onCardClick = () => {
      navigate(`/trends/${category}`);
  };

  return (
    <div className='col' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div className="card" style={{width: '150px'}} onClick={onCardClick}>
        <img src={image} alt={category} style={{maxWidth: '80%', margin:'auto' }} />
        <div className='card-body'>
          <h6>{title}</h6>
        </div>
      </div>
    </div>
  );
};

export default Card;
