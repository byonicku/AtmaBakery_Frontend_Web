import Pagination from "react-bootstrap/Pagination";
import propTypes from "prop-types";

CustomPagination.propTypes = {
  totalPage: propTypes.number,
  currentPage: propTypes.number,
  onChangePage: propTypes.func,
};

export default function CustomPagination({
  totalPage,
  currentPage,
  onChangePage,
}) {
  let items = [];

  if (currentPage > 1) {
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => onChangePage(currentPage - 1)}
      />
    );
  }

  for (let page = 1; page <= totalPage; page++) {
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

  if (currentPage < totalPage) {
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => onChangePage(currentPage + 1)}
      />
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <Pagination>{items}</Pagination>
    </div>
  );
}
