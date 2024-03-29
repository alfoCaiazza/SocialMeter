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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSentiment, setSelectedSentiment] = useState('');
    const [selectedSentimentFeelIT, setSelectedSentimentFeelIT] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { category } = useParams();

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
    }, [category]);

    useEffect(() => {
        if (new Date(startDate) >= new Date(endDate)) {
            setErrorMessage('La data di inizio deve essere antecedente alla data di fine.');
        } else {
            setErrorMessage('');
        }
    }, [startDate, endDate]); // This useEffect will be used only when startDate or endDate changed    

    // Truncate text function
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    // Filter posts with key words
    const searchTerms = searchTerm.toLowerCase().split(' ');

    const handleFilter = (post) => {
        // Filter for text content
        const textMatch = searchTerm.length === 0 || post.og_text.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter for the dates
        const postDate = new Date(post.year, post.month - 1, post.day);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        const dateMatch = (!start || postDate >= start) && (!end || postDate <= end);

        // Filter for BERT sentiment
        const sentimentMatch = !selectedSentiment || post.sentiment === selectedSentiment;

        // Filter for Feel-IT sentiment
        const sentimentMatchFeelIt = !selectedSentimentFeelIT || post.sentiment_feel_it === selectedSentimentFeelIT;

        // Filter for emotion
        const emotionMatch = !selectedEmotion || post.emotion === selectedEmotion;

        return textMatch && dateMatch && sentimentMatch && sentimentMatchFeelIt && emotionMatch;
    };

    const filteredPosts = posts.filter(handleFilter);

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

    // Calculates post to show in current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Change current page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const options1 = [
        { value: 'Negativo', label: 'Negativo' },
        { value: 'Positivo', label: 'Positivo' },
        { value: 'Neutrale', label: 'Neutrale' },
    ];
    
    const options2 = [
        { value: 'Rabbia', label: 'Rabbia' },
        { value: 'Gioia', label: 'Gioia' },
        { value: 'Tristezza', label: 'Tristezza' },
        { value: 'Paura', label: 'Paura' },
    ];

    const options3 = [
        { value: 'Negativo', label: 'Negativo ' },
        { value: 'Positivo', label: 'Positivo ' },
    ];

    const renderOptions = (options) => {
        return options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ));
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div className='d-flex justify-content-center' style={{ marginTop: '10%' }}>
                <h2>Consulta i post sulla tematica del {getCategoryString(category)}</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{padding: '4% 0'}}>
                <div className='row'>
                    <div className='col'>
                        <span className="form-label">Cerca</span>
                        <input className="form-control" type="text" placeholder="Filtra post" onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className="col">
                        <span className="form-label">Data di Inizio</span>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} min="2020-1-1"/>
                    </div>
                    <div className="col">
                        <span className="form-label">Data di Fine</span>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} min="2020-1-1" max="2024-1-1"/>
                    </div>
                    <div className="col">
                        <span className="form-label">Sentimento BERT</span>
                        <select className="form-select" value={selectedSentiment} onChange={(e) => setSelectedSentiment(e.target.value)}>
                            <option value="" disabled> </option>
                            {renderOptions(options1)}
                        </select>
                    </div>
                    <div className="col">
                        <span className="form-label">Sentimento Feel-IT</span>
                        <select className="form-select" value={selectedSentimentFeelIT} onChange={(e) => setSelectedSentimentFeelIT(e.target.value)}>
                            <option value="" disabled> </option>
                            {renderOptions(options3)}
                        </select>
                    </div>
                    <div className="col">
                        <span className="form-label">Emozione</span>
                        <select className="form-select" value={selectedEmotion} onChange={(e) => setSelectedEmotion(e.target.value)}>
                            <option value="" disabled> </option>
                            {renderOptions(options2)}
                        </select>
                    </div>
                </div>
            </div>
                {errorMessage && (
                        <div className="errorMessage" role="alert">
                            {errorMessage}
                        </div>
                )}
            <div className='table-responsive'>
                <table className='table table-striped align-middle'>
                    <thead className='table-dark'>
                        <tr>
                            <th style={{width:'30%'}}>Titolo</th>
                            <th>Testo</th>
                            <th>Pubblicazione</th>
                            <th>Sentimento BERT</th>
                            <th>Sentimento Feel-IT</th>
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
                                <td>{post.sentiment_feel_it}</td>
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
