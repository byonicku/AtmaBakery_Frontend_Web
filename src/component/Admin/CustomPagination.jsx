import Pagination from "react-bootstrap/Pagination";
import PropTypes from "prop-types";

CustomPagination.propTypes = {
  totalPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  maxPageNumbers: PropTypes.number,
};

CustomPagination.defaultProps = {
  maxPageNumbers: 5,
};

export default function CustomPagination({
  totalPage,
  currentPage,
  onChangePage,
  maxPageNumbers,
}) {
  let items = [];

  const renderEllipsis = () => {
    items.push(<Pagination.Ellipsis key="ellipsis" />);
  };

  const renderPageNumbers = () => {
    for (let page = 1; page <= totalPage; page++) {
      if (
        page === 1 ||
        page === totalPage ||
        (page >= currentPage - Math.floor(maxPageNumbers / 2) &&
          page <= currentPage + Math.floor(maxPageNumbers / 2))
      ) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onChangePage(page)}
          >
            {page}
          </Pagination.Item>
        );
      } else if (
        items[items.length - 1] !== <Pagination.Ellipsis key="ellipsis" />
      ) {
        renderEllipsis();
      }
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPage) {
      onChangePage(currentPage + 1);
    }
  };

  if (totalPage <= maxPageNumbers) {
    renderPageNumbers();
  } else {
    renderPageNumbers();
    if (
      currentPage > Math.floor(maxPageNumbers / 2) + 1 &&
      currentPage < totalPage - Math.floor(maxPageNumbers / 2)
    ) {
      renderEllipsis();
    }
  }

  items.unshift(
    <Pagination.Prev
      key="prev"
      onClick={handlePrevClick}
      disabled={currentPage === 1}
    />
  );

  items.push(
    <Pagination.Next
      key="next"
      onClick={handleNextClick}
      disabled={currentPage === totalPage}
    />
  );

  return (
    <div className="d-flex justify-content-center">
      <Pagination>{items}</Pagination>
    </div>
  );
}
