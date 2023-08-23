interface NavigateBtnProps {
	total: number;
	currentPage: number;
	setpage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
}

export function NavigateBtn({ total, currentPage, setpage, totalPages }: NavigateBtnProps) {
	const MAX_PAGES = 5; // Choose an odd number for symmetry
	const halfWay = Math.ceil(MAX_PAGES / 2);

	const getVisiblePages = () => {
		if (totalPages <= MAX_PAGES) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= halfWay) {
			return Array.from({ length: MAX_PAGES }, (_, i) => i + 1);
		}

		if (currentPage > totalPages - halfWay) {
			return Array.from({ length: MAX_PAGES }, (_, i) => totalPages - MAX_PAGES + i + 1);
		}

		return Array.from({ length: MAX_PAGES }, (_, i) => currentPage - halfWay + i + 1);
	};

	console.log('totalPages', totalPages)
	console.log('currentPage', currentPage)
	console.log('getVisiblePages', getVisiblePages())
	return (
		<>
			<div className='prev-next-button'>
				<button disabled={currentPage <= 1} onClick={() => setpage(1)}>First</button>
				<button disabled={currentPage <= 1} onClick={() => setpage(currentPage - 1)}>&#60;</button>
				{getVisiblePages().map((pageNumber) => (
					<span className={`page-control ${currentPage === pageNumber ? "disabled" : ""}`}
						key={pageNumber}
						onClick={() => setpage(pageNumber)}
					>
						{pageNumber}
					</span>
				))}
				<button disabled={currentPage >= totalPages} onClick={() => setpage(currentPage + 1)}>&#62;</button>
				<button disabled={currentPage >= totalPages} onClick={() => setpage(totalPages)}>Last</button>
				<span> Page {currentPage}/{totalPages}</span>
			</div>
			<span>Total: {total}</span>
		</>
	)
}
