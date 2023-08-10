interface NavigateBtnProps {
	total: number;
	page: number;
	setpage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
}

export function NavigateBtn({ total, page, setpage, totalPages }: NavigateBtnProps) {
	return (
		<div className='prev-next-button'>
			<button disabled={page <= 1} onClick={() => setpage(page - 1)}>Prev</button>
			{Array.from({ length: totalPages }).map((_, index) => (
				<button
					key={index}
					disabled={page === index + 1}
					onClick={() => setpage(index + 1)}
				>
					{index + 1}
				</button>
			))}
			<button disabled={page >= totalPages} onClick={() => setpage(page + 1)}>Next</button>
			<p>Total items: {total}</p>
		</div>
	)
}
