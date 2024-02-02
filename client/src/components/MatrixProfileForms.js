import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const MatrixProfileForms = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIndex, setSelectedIndex] = useState('');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const options1 = [
        { value: 'woman_condition', label: 'Sessismo' },
        { value: 'racism', label: 'Razzismo' },
        { value: 'climate_change', label: 'Crisi Climatica' },
    ];
    
    const options2 = [
        { value: 'score', label: 'Score' },
        { value: 'tot_comments', label: 'Numero di Commenti' },
        { value: 'tot_posts', label: 'Numero di Post' },
    ];

    const renderOptions = (options) => {
        return options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ));
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate || !selectedCategory || !selectedIndex) {
            setErrorMessage('Per favore, completa tutti i campi del modulo.');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setErrorMessage('La data di inizio deve essere antecedente alla data di fine.');
            return;
        }

        setIsLoading(true);
        setChartData([]);
        setErrorMessage('');

        try {
            const response = await fetch(`http://localhost:5000/api/create_matrix_profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate, category: selectedCategory, index: selectedIndex }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const responseData = await response.json();
    
            const formattedData = responseData.dates.map((date, index) => {
                return {
                    date: date,
                    value: responseData.values[index],
                    ...(selectedIndex !== 'tot_posts' && {
                        id: responseData.posts[index]?.id,
                        score: responseData.posts[index]?.score,
                        tot_comments: responseData.posts[index]?.tot_comments,
                        compound: responseData.posts[index]?.compound
                    })
                };
            });
    
            setChartData(formattedData);
        } catch (error) {
            console.error('Si è verificato un errore durante l\'invio dei dati:', error);
            setErrorMessage('Si è verificato un errore durante il caricamento dei dati.');
        } finally {
            setIsLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        return null;
    };

    const onDotClick = (data) => {
        if (selectedIndex !== 'tot_posts' && data.id) {
            navigate(`/post/${data.id}`);
        }
    };
    
    const getIndexString = (index) => {
        const indexStrings = {
            'tot_comments': 'Commenti Totali per Post',
            'score': 'Score per Post',
            'compound': 'Sentimento per Post',
            'tot_posts': 'Post Totali per Anno'
        };
        return indexStrings[index];
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div className='d-flex justify-content-center' style={{ marginTop: '9%' }}>
                <h2>Personalizza e Osserva l'Evoluzione delle Interazioni</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{padding: '4% 0'}}>
                <div className="row">
                    <div className="col">
                        <span className="form-label">Categoria</span>
                        <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="" disabled>Seleziona</option>
                            {renderOptions(options1)}
                        </select>
                    </div>

                    <div className="col">
                        <span className="form-label">Indice</span>
                        <select className="form-select" value={selectedIndex} onChange={(e) => setSelectedIndex(e.target.value)}>
                            <option value="" disabled>Seleziona</option>
                            {renderOptions(options2)}
                        </select>
                    </div>

                    <div className="col">
                        <span className="form-label">Data di Inizio</span>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} min="2012-01-01" max="2024-01-31"/>
                    </div>

                    <div className="col">
                        <span className="form-label">Data di Fine</span>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} min="2012-01-01" max="2024-01-31"/>
                    </div>

                    <div className="col d-flex align-items-end">
                        <button className="btn btn-dark" type="button" style={{width:'100%'}} onClick={handleSubmit}>Crea</button>
                    </div>
                </div>
            </div>
                {errorMessage && (
                    <div className="errorMessage" role="alert">
                        {errorMessage}
                    </div>
                )}
            <div className="d-flex justify-content-center">
                {isLoading ? (
                    <p>Caricamento in corso...</p>
                ) : chartData.length > 0 ? ( // Mostra il grafico solo se chartData non è vuoto
                    <LineChart width={1400} height={380} data={chartData}>
                        <XAxis dataKey="date"/>
                        <YAxis values='value'/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip content={<CustomTooltip />}/>
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#2fa2d6" activeDot={{ r: 8, onClick: (e, payload) => onDotClick(payload.payload) }} name={getIndexString(selectedIndex)}/>
                    </LineChart>
                ) : null}
            </div>
        </div>
    );
}

export default MatrixProfileForms;
