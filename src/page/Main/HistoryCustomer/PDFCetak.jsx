/* eslint-disable react/prop-types */
import Formatter from "@/assets/Formatter";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf",
      fontWeight: "normal",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Montserrat",
  },
  section: {
    marginBottom: 12,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "normal",
    color: "rgba(18,19,20,0.7)",
  },
  subHeaderTop: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(18,19,20,0.7)",
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 12,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  textCenter: {
    textAlign: "center",
  },
});

const PDFCetak = ({ selectedNota }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Atma Bakery</Text>
        <Text style={styles.subHeaderTop}>
          Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten
          Sleman, Daerah Istimewa Yogyakarta 55281
        </Text>
        <Text style={styles.subHeaderTop}>AtmaBakery@gmail.uajy.ac.id</Text>
        <Text style={styles.subHeaderTop}>012-345-6789</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Nota {selectedNota?.no_nota}</Text>
        <Text style={styles.subHeader}>Status: {selectedNota?.status}</Text>
        <Text style={styles.subHeader}>
          Tanggal Pesan:{" "}
          {Formatter.dateTimeFormatter(selectedNota?.tanggal_pesan)}
        </Text>
        <Text style={styles.subHeader}>
          Lunas Pada: {Formatter.dateTimeFormatter(selectedNota?.tanggal_lunas)}
        </Text>
        <Text style={styles.subHeader}>
          Tanggal Ambil: {Formatter.dateFormatter(selectedNota?.tanggal_ambil)}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Customer</Text>
        <Text style={styles.subHeader}>{selectedNota?.nama}</Text>
        <Text style={styles.subHeader}>{selectedNota?.email}</Text>
        <Text style={styles.subHeader}>{selectedNota?.no_telp}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>
          Tipe Delivery : {selectedNota?.tipe_delivery}
        </Text>
        {selectedNota?.tipe_delivery !== "Ambil" && (
          <View>
            <Text style={styles.subHeader}>{selectedNota?.lokasi}</Text>
            <Text style={styles.subHeader}>{selectedNota?.keterangan}</Text>
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Ringkasan Pesanan</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>No</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Produk</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Jumlah</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Sub Total</Text>
            </View>
          </View>
          {selectedNota?.produk?.map((detail, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{idx + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {detail.id_kategori === "CK"
                    ? `${detail.nama_produk} ${detail.ukuran} Loyang`
                    : detail.nama_produk}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{detail.jumlah}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {Formatter.moneyFormatter(
                    detail.jumlah * detail.harga_saat_beli
                  )}
                </Text>
              </View>
            </View>
          ))}
          {selectedNota?.tipe_delivery === "Kurir" && (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "75%" }]}>
                <Text style={styles.tableCell}>
                  Ongkos Kirim (rad. {selectedNota?.radius} km):
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {Formatter.moneyFormatter(selectedNota?.ongkir)}
                </Text>
              </View>
            </View>
          )}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "75%" }]}>
              <Text style={styles.tableCell}>
                Potongan Poin {selectedNota?.penggunaan_poin} poin:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                -{" "}
                {Formatter.moneyFormatter(selectedNota?.penggunaan_poin * 100)}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "75%" }]}>
              <Text style={styles.tableCell}>Total:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {Formatter.moneyFormatter(selectedNota?.total)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>
          Poin dari pesanan ini: {selectedNota?.penambahan_poin}
        </Text>
        <Text style={styles.subHeader}>
          Total Poin Customer: {selectedNota?.poin_user_setelah_penambahan}
        </Text>
      </View>
    </Page>
  </Document>
);

export default PDFCetak;
