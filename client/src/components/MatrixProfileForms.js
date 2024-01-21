import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MatrixProfileForms = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIndex, setSelectedIndex] = useState('');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
    
        // Prepara i dati da inviare all'API
        const dataToSend = {
            startDate,
            endDate,
            category: selectedCategory,
            index: selectedIndex
        };
    
        try {
            // Esegui la richiesta POST all'API
            const response = await fetch(`http://localhost:5000/api/create_matrix_profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            // Gestisci la risposta
            if (!response.ok) {
                // Gestisci il caso in cui la risposta non è ok (es. errori del server)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Estrai i dati JSON dalla risposta
            const responseData = await response.json();
    
            // Trasforma i dati per il grafico a linee
            const formattedData = responseData.dates.map((date, index) => {
                let value = responseData.values[index];
            
                // Verifica se il valore è in notazione scientifica
                if (value.toString().includes('e')) {
                    // Converti da notazione scientifica a numero decimale e moltiplica se necessario
                    value = parseFloat(value) * 1000000; // Regola il fattore di moltiplicazione se necessario
                }
            
                return { date: date, value: value };
            });
    
            // Imposta i dati trasformati per il grafico
            setChartData(formattedData);
        } catch (error) {
            // Gestisci eventuali errori nella richiesta o nella risposta
            console.error('Si è verificato un errore durante l\'invio dei dati:', error);
        } finally {
            // Imposta il loading su false una volta completata la richiesta
            setIsLoading(false);
        }
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
                            {renderOptions(options1)}
                        </select>
                    </div>

                    <div className="col">
                        <span className="form-label">Indice</span>
                        <select className="form-select" value={selectedIndex} onChange={(e) => setSelectedIndex(e.target.value)}>
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
                <Tooltip formatter={(value) => Number(value).toFixed(2)}/>
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#e800f6" activeDot={{ r: 8 }}/>
            </LineChart>
            </div>
        </div>
    );
}


export default MatrixProfileForms;
