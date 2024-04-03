import {
    Button,Container,Row,Form,Image,Col,
} from 'react-bootstrap';

import imageBg from "../assets/images/bg.png";


export default function Register() {
  const backgroundStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.5) 50%, #EFAB68 50%, #EFAB68 100%)',
    minHeight: '100vh',
    overflow: 'hidden',
  };
  const linearButton = {
    background: 'linear-gradient(to bottom, #EFAB68, #F48E28 75%)',
    fontSize: '1em',
    border: 'none',
  };
  return (
    <div style={backgroundStyle}>
      <Container>
        <Row className='m-5 no-gutters shadow-lg rounded'>
          <Col sm className='p-0 m-0' style={{  backgroundColor: "#FFEDDB" }}>
            <img src={imageBg} className='p-0 m-0 rounded' style={{ width:"100%", height: "100%"}}/>
          </Col>
          <Col sm style={{  backgroundColor: "#FFFFFF" }}>
            <div className='pt-5 px-5' style={{  color: "black" }}>
              <h1 style={{  fontWeight: "bold", fontSize: "2em"  }} >
                <span>Daftarkan</span> 
                <span style={{  color: "#F48E28" }}> Diri</span> 
                <span> Anda</span>
              </h1>
              <p className='py-2' style={{ fontSize: "1em" }}>Daftar segera dan nikmati produk serta pelayanan kami</p>
            </div>
            
            <Form className='px-5 py-2'>
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>Email</Form.Label>
                <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="email" placeholder="Masukkan alamat email" />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>Nama Lengkap</Form.Label>
                <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="text" placeholder="Masukkan nama lengkap" />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>Nomor Telepon</Form.Label>
                <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="text" placeholder="Masukkan nomor telepon" />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>Tanggal Lahir</Form.Label>
                <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="date" placeholder="Masukkan Tanggal Lahir" />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold" }}>Kata Sandi</Form.Label>
                <Form.Control type="password" style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }}  placeholder="Masukkan kata sandi" />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label style={{ fontWeight: "bold" }}>Konfirmasi Kata Sandi</Form.Label>
                <Form.Control type="password" style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }}  placeholder="Masukkan kembali kata sandi" />
              </Form.Group>
              <Container className='mt-3 d-flex justify-content-start'>
                <Form.Check 
                style={{ color: "#ADADAD", fontSize:'0.8em' }}
                  label={
                    <p>
                      <span>Dengan mencentang kotak centang ini, Anda telah menyetujui </span> 
                      <span> <a href='' style={{  textDecoration: "none" }}>Persyaratan Layanan</a></span> 
                      <span> dan </span>
                      <span> <a href='' style={{  textDecoration: "none" }}>Kebijakan Privasi</a></span> 
                      
                    </p>
                  } 
                />
              </Container>
              <Container className='text-center'>
                <Button className='w-75 mx-5 h-25' style={linearButton} type='submit'>Daftar</Button>
              </Container>
            </Form>
            <Container className='text-center py-3'>
            <div className='px-5' style={{  color: "black" }}>
              <p style={{  fontWeight: "bold", fontSize: "0.85em" }} >
                <span>Sudah memiliki akun?</span> 
                <span> <a href='#' style={{  textDecoration: "none" }}>Masuk Sekarang</a></span>
              </p>
            </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
