import React, { useState} from 'react';
import axios from 'axios';
import Card from './Card';

const App = () => {
    //componenti React inzializzati con un certo valore di default, vengono utilizzati per gestire lo stato della web app in riferimento a specifici eventi o elementi
    const [subreddit, setSubreddit] = useState('');
    const [keywords, setKeywords] = useState('');
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const getFilteredPosts = async () => {
      try {
        setError(null);
        setLoading(true);
        setPosts([]);
        const response = await axios.get(`http://localhost:5000/filtered_posts?subreddit=${subreddit}&keywords=${keywords}`);
        console.log(response.data);
        setPosts(response.data.posts || []);
      } catch (error) {
        setError('Errore nel recupero dei post.');
        console.error('Error fetching posts:', error);
      }finally{
        setLoading(false);
      }
    };
  
    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0 z'>
            <div className='mb-3 mx-auto' style={{marginTop: '1.5%', width: '70%'}}>
                <div className='container filtered-posts-background'>
                    <div className='text-center' style={{marginTop:'6%', marginBottom: '6%'}}>
                        <p className='display-6'>Filtra i post della subreddit desiderata.</p>
                    </div>
                    <div className='mb-3 text-center' style={{marginLeft: '4%'}}>
                        <div className="row align-items-center">
                            <div className="col-md-5">
                                <label htmlFor='formGroupExampleElementInput' className='form-label d-block text-start'>
                                    Subreddit:
                                    <input type="text" className='form-control' id='formGroupExampleElementInput' placeholder='subreddit' value={subreddit} onChange={(e) => setSubreddit(e.target.value)} />
                                </label>
                            </div>
                            <div className="col-md-5">
                                <label htmlFor='formGroupExampleElementInput2' className='form-label d-block text-start'>
                                    Parole Chiavi:
                                    <input type="text" className='form-control' id='formGroupExampleElementInput2' placeholder='parola,parola,...' value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                                </label>
                            </div>
                            <div className="col-md-1">
                                <button type='button' className='btn btn-dark mt-3' style={{width: '100px'}} onClick={getFilteredPosts}>Filtra</button>
                            </div>
                        </div>
                    </div>
                </div>
        
                {error && <p style={{ color: 'red' }}>{error}</p>}
            
                <h4 style={{ marginBottom: '2%' }}>Post</h4>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col'>
                            <div className='mx-auto'>
                                    {loading && (
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    {!loading && posts.map((post, index) => (
                                    <Card key={index} post={post} />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  export default App;
  