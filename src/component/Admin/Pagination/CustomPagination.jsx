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
    let startPage = 1;
    let endPage = totalPage;

    if (currentPage > Math.floor(maxPageNumbers / 2) + 1) {
      startPage = currentPage - Math.floor(maxPageNumbers / 2);
    }

    if (currentPage < totalPage - Math.floor(maxPageNumbers / 2)) {
      endPage = currentPage + Math.floor(maxPageNumbers / 2);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => onChangePage(1)}>
          {1}
        </Pagination.Item>
      );
      if (startPage > 2) {
        renderEllipsis();
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onChangePage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        renderEllipsis();
      }
      items.push(
        <Pagination.Item
          key={totalPage}
          onClick={() => onChangePage(totalPage)}
        >
          {totalPage}
        </Pagination.Item>
      );
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

  renderPageNumbers();

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
