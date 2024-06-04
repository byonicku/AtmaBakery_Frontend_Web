import { Table, Spinner } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";

import "@/page/Admin/Page/css/Admin.css";

import OutlerHeader from "@/component/Admin/OutlerHeader";
import NotFound from "@/component/Admin/NotFound";
import CustomPagination from "@/component/Admin/Pagination/CustomPagination";
import APINotifikasi from "@/api/APINotifikasi";

export default function Notifikasi() {
  const [isLoading, setIsLoading] = useState(true);

  const [notifikasi, setNotifikasi] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchNotifikasi = useCallback(
    async (signal) => {
      setIsLoading(true);
      try {
        const response = await APINotifikasi.getNotifikasi(page, signal);
        setNotifikasi(response.data);
        setLastPage(response.last_page);
      } catch (error) {
        // Handle ketika data terakhir di suatu page dihapus, jadi mundur ke page sebelumnya
        // Atau bakal di set ke array kosong kalo hapus semua data di page pertama
        if (page - 1 === 0 || error.code === "ERR_NETWORK") {
          setNotifikasi([]);
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

    fetchNotifikasi(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchNotifikasi]);

  return (
    <>
      <OutlerHeader
        title="Melihat Notifikasi"
        desc="Halaman ini digunakan untuk melihat notifikasi yang masuk untuk customer"
        breadcrumb="Notifikasi Customer"
      />
      <section className="content px-3">
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
        ) : notifikasi?.length > 0 ? (
          <>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ width: "15%" }} className="th-style">
                    Title
                  </th>
                  <th style={{ width: "20%" }} className="th-style">
                    Body
                  </th>
                </tr>
              </thead>

              <tbody>
                {notifikasi.map((notifikasi, index) => (
                  <tr key={index}>
                    <td>{notifikasi.title}</td>
                    <td>{notifikasi.body}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Udah pasti kayak gini untuk pagination, jangan diotak atik :V */}
            {lastPage > 1 && (
              <CustomPagination
                totalPage={lastPage}
                currentPage={page}
                onChangePage={handleChangePage}
              />
            )}
          </>
        ) : (
          <NotFound text={"Belum Ada Notifikasi Disini"} />
        )}
      </section>
    </>
  );
}
