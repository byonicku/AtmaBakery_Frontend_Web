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

const TanggalCetak = ({ bahan_baku }) => (
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
        LAPORAN Stok Bahan Baku
      </Text>
    </View>
    <View style={{ flexDirection: "row", marginTop: 4 }}>
      <Text style={{ fontSize: 14, marginTop: 10 }}>Tanggal Cetak: </Text>
      <Text style={{ fontSize: 14, marginTop: 10 }}>
        {bahan_baku?.tanggal_cetak}
      </Text>
    </View>
  </>
);

const TableHead = () => (
  <View style={{ width: "100%", flexDirection: "row" }}>
    <View style={styles.theader}>
      <Text>Nama Bahan Baku</Text>
    </View>
    <View style={styles.theader}>
      <Text>Satuan</Text>
    </View>
    <View style={styles.theader}>
      <Text>Stok</Text>
    </View>
  </View>
);

const TableBody = ({ bahan_baku }) => {
  if (!bahan_baku?.data) return null;

  const data = bahan_baku?.data;

  return data.map((detail, idx) => (
    <Fragment key={idx}>
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={styles.tbody}>
          <Text>{detail.nama_bahan_baku}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{detail.satuan}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{detail.stok}</Text>
        </View>
      </View>
    </Fragment>
  ));
};

const LaporanPenggunaanBahanBaku = ({ bahan_baku }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceTitle />
      <Address />
      <TanggalCetak bahan_baku={bahan_baku} />
      <TableHead />
      <TableBody bahan_baku={bahan_baku} />
    </Page>
  </Document>
);

export default LaporanPenggunaanBahanBaku;
