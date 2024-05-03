import OutlerHeader from "@/component/Admin/OutlerHeader";

export default function NotFound404() {
  return (
    <>
      <OutlerHeader title="404 Not Found" breadcrumb="Not Found" />
      <section className="content">
        <div
          className="error-message"
          style={{ justifyContent: "center", textAlign: "center" }}
        >
          <span className="error-title">Ooops! 404 Not Found</span>
          <p className="error-description mt-3">
            Halaman ini sedang dalam proses pembangunan atau anda mengakses
            halaman yang tidak tersedia
          </p>
        </div>
      </section>
    </>
  );
}
