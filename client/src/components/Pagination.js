const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
    const pageNumbers = [];
    const totalPageNumbers = Math.ceil(totalPosts / postsPerPage);

    // Determina il range di pagine da mostrare
    const pageRangeDisplayed = 2; // Mostra 2 pagine prima e 2 pagine dopo la pagina corrente
    let startPage = Math.max(currentPage - pageRangeDisplayed, 1);
    let endPage = Math.min(currentPage + pageRangeDisplayed, totalPageNumbers);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className={number === currentPage ? 'page-item active' : 'page-item'}>
                        <a href="#!" onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;