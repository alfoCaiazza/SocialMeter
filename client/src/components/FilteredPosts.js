import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import {Link} from 'react-router-dom';
import { useParams } from 'react-router-dom';

const FilteredPosts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const {category} = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios(`http://localhost:5000/api/get_posts?post_category=${category}`);
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
            <div className='text-center' style={{marginTop: "3%"}}>
                <h2 className='display-6' style={{marginTop: '1%', color: '#171717'}}><strong>Consulta i post sulla tematica del {getCategoryString(category)}</strong></h2>
            </div>
            <div style={{marginTop: '3%', marginLeft: '5%', marginBottom: '3%'}}>
                <span>Cerca : </span>
                <input
                    type="text"
                    placeholder="Filtra post"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='table-responsive'>
                <table className='table table-striped align-middle'>
                    <thead className='table-dark'>
                        <tr>
                            <th style={{width:'30%'}}>Titolo</th>
                            <th>Testo</th>
                            <th>Pubblicazione</th>
                            <th>Sentimento</th>
                            <th>Emozione</th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post, index) => (
                            <tr key={index}>
                                <td><Link to={`/post/${post.id}`} style={{textDecoration: 'none', color: '#171717'}}>{post.title}</Link></td>
                                <td className="truncate-text">{truncateText(post.og_text, 50)}</td>
                                <td>{post.day}/{post.month}/{post.year}</td>
                                <td>{post.sentiment}</td>
                                <td>{post.emotion}</td>
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
