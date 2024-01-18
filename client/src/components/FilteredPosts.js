import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import {Link} from 'react-router-dom';

const FilteredPosts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios('http://localhost:5000/api/get_posts');
                setPosts(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    // Funzione per troncare il testo
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    // Filtra i post in base al termine di ricerca
    const searchTerms = searchTerm.toLowerCase().split(' ');

    const filteredPosts = posts.filter(post =>
        searchTerms.every(term =>
            Object.values(post).some(value =>
                value.toString().toLowerCase().includes(term)
            )
        )
    );

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
    };

    const getCategoryString = (category) => {
        const categoryStrings = {
            'woman_condition': 'Sessismo',
            'racism': 'Razzismo',
            'climate_change': 'Clima',
        };
    
        // Return the string for the given category, or a default string if the category is not found
        return categoryStrings[category];
    };

    // Calcola i post da mostrare per la pagina corrente
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Cambia la pagina corrente
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div style={{marginTop: '3%', marginLeft: '5%', marginBottom: '3%'}}>
                <span>Cerca : </span>
                <input
                    type="text"
                    placeholder="Filtra post"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Categoria</th>
                            <th>Titolo</th>
                            <th>Testo</th>
                            <th>Pubblicazione</th>
                            <th>Positività</th>
                            <th>Neutralità</th>
                            <th>Negatività</th>
                            <th>Sentimento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post, index) => (
                            <tr key={index}>
                                <td>{getCategoryString(post.category)}</td>
                                <td><Link to={`/post/${post.id}`} style={{textDecoration: 'none', color: '#171717'}}>{post.title}</Link></td>
                                <td className="truncate-text">{truncateText(post.text, 50)}</td>
                                <td>{formatDate(post.date)}</td>
                                <td>{post.postivity}</td>
                                <td>{post.neutrality}</td>
                                <td>{post.negativity}</td>
                                <td>{post.sentiment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='pagination-container'>
                <Pagination postsPerPage={postsPerPage} totalPosts={filteredPosts.length} currentPage={currentPage} paginate={paginate} />
            </div>
        </div>
    );
};

export default FilteredPosts;
