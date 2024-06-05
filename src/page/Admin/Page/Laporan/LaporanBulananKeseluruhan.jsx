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
import ReactPDFChart from "react-pdf-charts";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Bar,
  Line,
  Legend,
} from "recharts";

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

const TanggalCetak = ({ keseluruhan, tahun }) => (
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
        LAPORAN PENJUALAN BULANAN KESELURUHAN
      </Text>
    </View>
    <Text style={{ fontSize: 14, marginTop: 5 }}>Tahun: {tahun} </Text>
    <View style={{ flexDirection: "row" }}>
      <Text style={{ fontSize: 14, marginTop: 5 }}>Tanggal Cetak: </Text>
      <Text style={{ fontSize: 14, marginTop: 5 }}>
        {keseluruhan?.tanggal_cetak}
      </Text>
    </View>
  </>
);

const TableHead = () => (
  <View style={{ width: "100%", flexDirection: "row" }}>
    <View style={styles.theader}>
      <Text>Bulan</Text>
    </View>
    <View style={styles.theader}>
      <Text>Jumlah Transaksi</Text>
    </View>
    <View style={styles.theader}>
      <Text>Jumlah Uang</Text>
    </View>
  </View>
);

const TableBody = ({ keseluruhan }) => {
  if (!keseluruhan?.data) return null;

  const data = keseluruhan?.data;

  return (
    <>
      {data.map((detail, idx) => (
        <Fragment key={idx}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={styles.tbody}>
              <Text>{detail.bulan}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{detail.total_transaksi}</Text>
            </View>
            <View style={styles.tbodyinvis}>
              <Text>{Formatter.moneyFormatter(detail.total_pendapatan)}</Text>
            </View>
          </View>
        </Fragment>
      ))}
    </>
  );
};

const TableTotal = ({ keseluruhan }) => (
  <View style={{ width: "100%", flexDirection: "row" }}>
    <View style={styles.tbodyinvis}>
      <Text>Total:</Text>
    </View>
    <View style={styles.tbody} />
    <View style={styles.tbodyinvis}>
      <Text>
        {Formatter.moneyFormatter(keseluruhan?.total_pendapatan_keseluruhan)}
      </Text>
    </View>
  </View>
);

const Chart = ({ dataBar }) => {
  return (
    <ReactPDFChart height={400} width={400}>
      <ComposedChart data={dataBar} height={250} width={500}>
        <XAxis dataKey="bulan" />
        <YAxis />
        <CartesianGrid isAnimationActive={false} stroke="#f5f5f5" />
        <Area
          isAnimationActive={false}
          type="monotone"
          dataKey="total_pendapatan"
          fill="#8884d8"
          stroke="#8884d8"
        />
        <Bar
          isAnimationActive={false}
          dataKey="total_transaksi"
          fill="#413ea0"
          label={{ position: "top" }}
        />
        <Line
          isAnimationActive={false}
          type="monotone"
          dataKey="total_pendapatan"
          stroke="#ff7300"
        />
        <Legend />
      </ComposedChart>
    </ReactPDFChart>
  );
};

const LaporanBulananKeseluruhan = ({ keseluruhan, tahun }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceTitle />
      <Address />
      <TanggalCetak keseluruhan={keseluruhan} tahun={tahun} />
      <TableHead />
      <TableBody keseluruhan={keseluruhan} />
      <TableTotal keseluruhan={keseluruhan} />
    </Page>
    <Page size="A4" style={styles.page}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontSize: 14,
            marginTop: 10,
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          GRAFIK PENJUALAN BULANAN KESELURUHAN
        </Text>
      </View>
      <Chart dataBar={keseluruhan?.data} />
    </Page>
  </Document>
);

export default LaporanBulananKeseluruhan;
