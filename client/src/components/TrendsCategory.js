import { useNavigate, Link } from 'react-router-dom';

const TrendsCategory = () => {
    const navigate = useNavigate();

    const links = [
        { to: '/trends', label: 'Sessismo', category: 'woman_condition'},
        { to: '/trends', label: 'Razzismo', category: 'racism'},
        { to: '/trends', label: 'Cambiamento Climatico', category: 'climate_change'},
      ];
    
      return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0 '>
          <div className="text-center position-absolute top-50 start-50 translate-middle mt-5 features-background">
            <h2 className='display-4' style={{marginTop: '7%', color: '#171717'}}><strong>Categorie</strong></h2>
            <div>
              <ul className="list-unstyled" style={{marginTop: '5%'}}>
                {links.map((link, index) => (
                  <li key={index} style={{marginBottom: '5%'}}>
                    <Link to={link.to + '/' + link.category} className="my-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
};

export default TrendsCategory;