import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MatrixProfileForms = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIndex, setSelectedIndex] = useState('');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const options1 = [
        { value: 'woman_condition', label: 'Sessismo' },
        { value: 'racism', label: 'Razzismo' },
        { value: 'climate_change', label: 'Crisi Climatica' },
    ];
    
    const options2 = [
        { value: 'sentiment', label: 'Sentimento' },
        { value: 'score', label: 'Score' },
        { value: 'tot_comments', label: 'Numero di Commenti' },
    ];

    const renderOptions = (options) => {
        return options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const dataToSend = {
            startDate,
            endDate,
            category: selectedCategory,
            index: selectedIndex
        };
    
        try {
            const response = await fetch(`http://localhost:5000/api/create_matrix_profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const responseData = await response.json();
            const formattedData = responseData.dates.map((date, index) => {
                let value = responseData.values[index];
                let postDetails = responseData.posts[index]; // Assumendo che ogni elemento in 'posts' corrisponda alla stessa data e indice in 'dates' e 'values'
    
                return {
                    date: date,
                    value: value,
                    id: postDetails.id,
                    score: postDetails.score,
                    tot_comments: postDetails.tot_comments,
                    compound: postDetails.compound
                    // Aggiungi qui altre informazioni rilevanti del post
                };
            });
    
            setChartData(formattedData);
        } catch (error) {
            console.error('Si è verificato un errore durante l\'invio dei dati:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p>ID del post: {data.id}</p>
                    <p>Data: {data.date}</p>
                    <p>Valore: {data.value.toFixed(2)}</p>
                    <p>Score: {data.score}</p>
                    <p>Totale Commenti: {data.tot_comments}</p>
                    <p>Sentimento: {data.compound}</p>
                </div>
            );
        }
        return null;
    };

    const onDotClick = (data) => {
        // Assumendo che data contenga l'ID del post o dettagli del post
        setSelectedPost(data);
      };      

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div className='d-flex justify-content-center' style={{ marginTop: '7%' }}>
                <h2>Crea la Matrix Profile in base ai tuoi interessi</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{padding: '4% 0'}}>
                <div className="row">
                    <div className="col">
                        <span className="form-label">Categoria</span>
                        <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="" disabled>Seleziona una categoria</option>
                            {renderOptions(options1)}
                        </select>
                    </div>

                    <div className="col">
                        <span className="form-label">Indice</span>
                        <select className="form-select" value={selectedIndex} onChange={(e) => setSelectedIndex(e.target.value)}>
                            <option value="" disabled>Seleziona un indice</option>
                            {renderOptions(options2)}
                        </select>
                    </div>

                    <div className="col">
                        <span className="form-label">Data di Inizio</span>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} min="2020-1-1"/>
                    </div>

                    <div className="col">
                        <span className="form-label">Data di Fine</span>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} min="2020-1-1" max="2024-1-1"/>
                    </div>

                    <div className="col d-flex align-items-end">
                        <button className="btn btn-dark" type="button" style={{width:'100%'}} onClick={handleSubmit}>Crea</button>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
            <LineChart width={1400} height={380} data={chartData}>
                <XAxis dataKey="date"/>
                <YAxis tickFormatter={(value) => Number(value).toFixed(2)}/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#e800f6" activeDot={{ r: 8, onClick: (e, payload) => onDotClick(payload.payload) }}/>
            </LineChart>
            </div>
            {selectedPost && (
                <div className="post-details-section">
                    {/* Visualizza qui i dettagli del post selezionato */}
                    <h3>Dettagli del Post Selezionato:</h3>
                    {/* Puoi personalizzare questo in base alle tue esigenze */}
                    <p>ID del post: {selectedPost.id}</p>
                    {/* ...altri dettagli... */}
                </div>
            )}
        </div>
    );
}


export default MatrixProfileForms;