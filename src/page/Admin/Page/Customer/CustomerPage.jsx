import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import { BsSearch, BsInbox } from "react-icons/bs";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import APICust from "@/api/APICustomer";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";

export default function CustomerPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [cust, setCust] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState(null);

  const fetchCust = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APICust.getCustByPage(page, signal);
        setCust(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setCust([]);
        } else {
          setPage(page - 1);
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Pas masuk load customer
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchCust(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchCust]);

  // Search Data
  const fetchCustSearch = async () => {
    if (search.trim() === "") {
      // Kalo spasi doang bakal gabisa
      return;
    }

    setIsLoading(true);

    try {
      const response = await APICust.searchCust(search.trim());
      setCust(response);
    } catch (error) {
      setCust([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OutlerHeader
        title="Kelola Data Customer"
        desc="Lakukan pengelolaan data Customer Atma Bakery"
        breadcrumb="Customer"
      />
      <section className="content px-3">
        <Row className="pb-3 gap-1 gap-lg-0 gap-md-0">
          <Col
            xs={12}
            sm={12}
            lg={6}
            md={12}
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          ></Col>
          <Col
            xs={12}
            sm={12}
            lg={6}
            md={12}
            className="m-0 mb-lg-0 mb-md-0 mb-sm-0 mb-1"
          >
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Cari Customer disini"
                name="search"
                value={search || ""}
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value === "") {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      fetchCust();
                    }
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchCustSearch();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => fetchCustSearch()}
              >
                <BsSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>
        {isLoading ? (
          <div className="text-center">
            <Spinner
              as="span"
              animation="border"
              variant="primary"
              size="lg"
              role="status"
              aria-hidden="true"
            />
            <h6 className="mt-2 mb-0">Loading...</h6>
          </div>
        ) : cust?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "2%" }} className="th-style">
                    Nomor
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Nama
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    Email
                  </th>
                  <th style={{ width: "25%" }} className="th-style">
                    No Telepon
                  </th>
                  <th style={{ width: "23%" }} className="th-style">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {cust.map((cust, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "bolder", textAlign: "center" }}>
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td>{cust.nama}</td>
                    <td>{cust.email}</td>
                    <td>{cust.no_telp}</td>
                    <td>
                      <Row className="gap-1 gap-lg-0 gap-md-0">
                        <Col xs={12} sm={12} md={11} lg={11}>
                          <Link
                            to={`./history/${cust.id_user}`}
                            className={
                              isLoading
                                ? "btn btn-danger custom-danger-btn w-100 me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2 disabled"
                                : "btn btn-danger custom-danger-btn w-100 me-2 me-lg-1 mb-2 mb-lg-1 mb-md-2 mb-sm-2"
                            }
                          >
                            <BsInbox className="mb-1" /> Lihat Detail
                          </Link>
                        </Col>
                      </Row>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Udah pasti kayak gini untuk pagination, jangan diotak atik :V */}
            {lastPage > 1 && !search && (
              <CustomPagination
                totalPage={lastPage}
                currentPage={page}
                onChangePage={handleChangePage}
              />
            )}
          </>
        ) : (
          <NotFound
            text={
              search ? "Customer Tidak Ditemukan" : "Belum Ada Customer Disini"
            }
          />
        )}
      </section>
    </>
  );
}
