/* eslint-disable react/prop-types */
import Formatter from "@/assets/Formatter";
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

const Address = ({ no_nota }) => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <View>
        <Text style={styles.invoice}>Nota</Text>
        <Text style={styles.invoiceNumber}>{no_nota}</Text>
      </View>
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

const UserAddress = ({
  keterangan,
  lokasi,
  tipe_delivery,
  tanggal_pesan,
  tanggal_ambil,
  tanggal_lunas,
}) => (
  <View style={styles.titleContainer}>
    <View style={styles.spaceBetween}>
      <View style={{ maxWidth: 200 }}>
        {tipe_delivery !== "Ambil" ? (
          <>
            <Text style={styles.addressTitle}>Dikirim ke </Text>
            <Text style={styles.address}>{keterangan}</Text>
            <Text style={styles.address}>{lokasi}</Text>
          </>
        ) : (
          <Text style={styles.addressTitle}>
            {tipe_delivery === "Ambil" ? "Ambil di Toko" : "Dikirim Ojol"}
          </Text>
        )}
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.addressTitle}>
          Tanggal Pesan: {Formatter.dateTimeFormatter(tanggal_pesan)}
        </Text>
        <Text style={styles.addressTitle}>
          Tanggal Ambil: {Formatter.dateFormatter(tanggal_ambil)}
        </Text>
        <Text style={styles.addressTitle}>
          Tanggal Lunas: {Formatter.dateTimeFormatter(tanggal_lunas)}
        </Text>
      </View>
    </View>
  </View>
);

const TableHead = () => (
  <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
    <View style={styles.theader}>
      <Text>No</Text>
    </View>
    <View style={styles.theader}>
      <Text>Produk</Text>
    </View>
    <View style={styles.theader}>
      <Text>Jumlah</Text>
    </View>
    <View style={styles.theader}>
      <Text>Sub Total</Text>
    </View>
  </View>
);

const TableBody = ({ selectedNota }) => {
  if (!selectedNota?.produk) return null;

  return selectedNota?.produk.map((detail, idx) => (
    <Fragment key={idx}>
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={styles.tbody}>
          <Text>{idx + 1}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>
            {detail.id_kategori === "CK"
              ? `${detail.nama_produk} ${detail.ukuran} Loyang`
              : detail.nama_produk}{" "}
          </Text>
        </View>
        <View style={styles.tbody}>
          <Text>{detail.jumlah}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>
            {Formatter.moneyFormatter(detail.jumlah * detail.harga_saat_beli)}
          </Text>
        </View>
      </View>
    </Fragment>
  ));
};

const TableTotal = ({ selectedNota }) => (
  <>
    {selectedNota?.tipe_delivery === "Kurir" && (
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={styles.tbodyinvis}>
          <Text>Ongkos Kirim (rad. {selectedNota?.radius} km):</Text>
        </View>
        <View style={styles.tbodyinvis} />
        <View style={styles.tbody} />
        <View style={styles.tbodyinvis}>
          <Text>{Formatter.moneyFormatter(selectedNota?.ongkir)}</Text>
        </View>
      </View>
    )}
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.tbodyinvis}>
        <Text>Potongan Poin {selectedNota?.penggunaan_poin} poin:</Text>
      </View>
      <View style={styles.tbodyinvis} />
      <View style={styles.tbody} />
      <View style={styles.tbodyinvis}>
        <Text>
          - {Formatter.moneyFormatter(selectedNota?.penggunaan_poin * 100)}
        </Text>
      </View>
    </View>
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.tbodyinvis}>
        <Text>Total:</Text>
      </View>
      <View style={styles.tbodyinvis} />
      <View style={styles.tbody} />
      <View style={styles.tbodyinvis}>
        <Text>{Formatter.moneyFormatter(selectedNota?.total)}</Text>
      </View>
    </View>
  </>
);

const PDFCetak = ({ selectedNota }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <InvoiceTitle />
      <Address no_nota={selectedNota?.no_nota} />
      <UserAddress
        keterangan={selectedNota?.keterangan}
        lokasi={selectedNota?.lokasi}
        tipe_delivery={selectedNota?.tipe_delivery}
        tanggal_pesan={selectedNota?.tanggal_pesan}
        tanggal_ambil={selectedNota?.tanggal_ambil}
        tanggal_lunas={selectedNota?.tanggal_lunas}
      />
      <TableHead />
      <TableBody selectedNota={selectedNota} />
      <TableTotal selectedNota={selectedNota} />
      <View style={{ maxWidth: 200, marginTop: 14 }}>
        <Text style={styles.address}>
          Poin dari pesanan ini: {selectedNota?.penambahan_poin}
        </Text>
        <Text style={styles.address}>
          Poin User Setelah Penambahan:{" "}
          {selectedNota?.poin_user_setelah_penambahan}
        </Text>
      </View>
    </Page>
  </Document>
);

export default PDFCetak;
