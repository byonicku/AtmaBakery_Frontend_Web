/* eslint-disable react/prop-types */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Fragment } from "react";
import Logo from "@/assets/atma-bakery.png";
import Formatter from "@/assets/Formatter";
import { bulanList } from "./ConstantLaporan";

// Create styles
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  spaceBetween: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#3E3E3E",
  },
  titleContainer: { flexDirection: "row", marginTop: 24 },
  logo: { width: 150 },
  reportTitle: { fontSize: 16, textAlign: "center" },
  addressTitle: { fontSize: 11, fontStyle: "bold" },
  invoice: { fontWeight: "bold", fontSize: 20 },
  invoiceNumber: { fontSize: 11, fontWeight: "bold" },
  address: { fontWeight: 400, fontSize: 10 },
  theader: {
    marginTop: 20,
    fontSize: 10,
    fontStyle: "bold",
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    height: 20,
    backgroundColor: "#DEDEDE",
    borderColor: "whitesmoke",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },
  tbody: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: "whitesmoke",
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  tbodyinvis: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: "whitesmoke",
    borderBottomWidth: 1,
  },
  total: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1.5,
    borderColor: "whitesmoke",
    borderBottomWidth: 1,
  },
  tbody2: { flex: 2, borderRightWidth: 1 },
});

const InvoiceTitle = () => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <Image style={styles.logo} src={Logo} />
      <Text style={styles.reportTitle}>Atma Bakery</Text>
    </View>
  </View>
);
const Address = () => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <View />
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.address}>
          Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok,
        </Text>
        <Text style={styles.address}>
          Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
        </Text>
        <Text style={styles.address}>AtmaBakery@gmail.uajy.ac.id</Text>
        <Text style={styles.address}>012-345-6789</Text>
      </View>
    </View>
  </View>
);

const TanggalCetak = ({ produk, bulan, tahun }) => (
  <>
    <View style={styles.titleContainer}>
      <Text
        style={{
          fontSize: 14,
          marginTop: 10,
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        LAPORAN PENJUALAN BULANAN
      </Text>
    </View>
    <Text style={{ fontSize: 14, marginTop: 5 }}>
      Bulan: {bulanList[bulan - 1]}{" "}
    </Text>
    <Text style={{ fontSize: 14, marginTop: 5 }}>Tahun: {tahun} </Text>
    <View style={{ flexDirection: "row" }}>
      <Text style={{ fontSize: 14, marginTop: 5 }}>Tanggal Cetak: </Text>
      <Text style={{ fontSize: 14, marginTop: 5 }}>
        {produk?.tanggal_cetak}
      </Text>
    </View>
  </>
);

const TableHead = () => (
  <View style={{ width: "100%", flexDirection: "row" }}>
    <View style={styles.theader}>
      <Text>Produk</Text>
    </View>
    <View style={styles.theader}>
      <Text>Kuantitas</Text>
    </View>
    <View style={styles.theader}>
      <Text>Harga</Text>
    </View>
    <View style={styles.theader}>
      <Text>Jumlah Uang</Text>
    </View>
  </View>
);

const TableBody = ({ produk }) => {
  if (!produk?.data) return null;

  const data = produk?.data;

  return data.map((detail, idx) => (
    <Fragment key={idx}>
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={styles.tbody}>
          <Text>
            {detail.id_kategori === "CK"
              ? `${detail.nama_produk} ${detail.ukuran} Loyang`
              : detail.nama_produk}
          </Text>
        </View>
        <View style={styles.tbody}>
          <Text>{detail.kuantitas}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{Formatter.moneyFormatter(detail.harga)}</Text>
        </View>
        <View style={styles.tbodyinvis}>
          <Text>{Formatter.moneyFormatter(detail.total_harga)}</Text>
        </View>
      </View>
    </Fragment>
  ));
};

const TableTotal = ({ produk }) => (
  <View style={{ width: "100%", flexDirection: "row" }}>
    <View style={styles.tbodyinvis}>
      <Text>Total:</Text>
    </View>
    <View style={styles.tbodyinvis} />
    <View style={styles.tbody} />
    <View style={styles.tbodyinvis}>
      <Text>{Formatter.moneyFormatter(produk?.total_keseluruhan)}</Text>
    </View>
  </View>
);

const LaporanPenjualanProdukPerBulan = ({ produk, bulan, tahun }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceTitle />
      <Address />
      <TanggalCetak produk={produk} bulan={bulan} tahun={tahun} />
      <TableHead />
      <TableBody produk={produk} />
      <TableTotal produk={produk} />
    </Page>
  </Document>
);

export default LaporanPenjualanProdukPerBulan;
