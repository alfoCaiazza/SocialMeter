import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const TrendsIndex = () => {
  const links = [
    { to: '/trends_sentiment', label: 'Sentimento', index: 'sentiment', icon: 'bi bi-balloon-heart'},
    { to: '/trends_emotions', label: 'Emozioni', index: 'emotion',  icon: 'bi bi-emoji-wink'},
  ];

  const { category } = useParams();

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0 '>
      <div className="text-center position-absolute top-50 start-50 translate-middle mt-5 features-background">
        <h2 className='display-4' style={{marginTop: '7%', color: '#171717'}}><strong>Scegli i Trend da Visualizzare</strong></h2>
        <div className="d-flex flex-wrap justify-content-center">
          {links.map((link, index) => (
            <Link to={link.to + '/' + category} className="btn btn-primary">
                <div key={index} className="card m-2" style={{width: '18rem'}}>
                    <i className={`bi ${link.icon} card-img-top`} style={{fontSize: '100px', textAlign: 'center', marginTop: '20px'}}></i>
                    <div className="card-body">
                        <h5 className="card-title">{link.label}</h5>
                    </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendsIndex;
