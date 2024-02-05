const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
    const pageNumbers = [];
    const totalPageNumbers = Math.ceil(totalPosts / postsPerPage);

    // It sets the number of page tho show before and after current page
    const pageRangeDisplayed = 2;
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