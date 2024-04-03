import {
    Button,Container,Row,Form,Image,Col
} from 'react-bootstrap';

import imageBg from "../assets/images/bg.png";
import Register from './Register';


export default function Login() {
  const backgroundStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.5) 50%, #EFAB68 50%, #EFAB68 100%)',
    minHeight: '100vh',
    overflow: 'hidden',
  };
  const linearButton = {
    background: 'linear-gradient(to bottom, #EFAB68, #F48E28 75%)',
    fontSize: '1em',
    border: 'none',
  }
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
                <span>Selamat</span> 
                <span style={{  color: "#F48E28" }}> Datang</span> 
                <span> Kembali</span>
              </h1>
              <p className='py-2' style={{ fontSize: "1em" }}>Masuk ke akun untuk melanjutkan</p>
            </div>
            
            <Form className='px-5 py-2'>
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold", fontSize: "1em" }}>Email</Form.Label>
                <Form.Control style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }} type="email" placeholder="Masukkan alamat email" />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label style={{ fontWeight: "bold" }}>Password</Form.Label>
                <Form.Control type="password" style={{ border:"1px #E5E5E5", backgroundColor:"#F2F2F2" }}  placeholder="Masukkan kata sandi" />
              </Form.Group>
              <Container className='my-3 d-flex justify-content-end'>
                <a href='#' style={{  textDecoration: "none" }}>Lupa Kata Sandi?</a>
              </Container>

              <Container className='text-center'>
                <Button className='w-75 mx-5 my-3 h-25' style={linearButton} type='submit'>Masuk</Button>
              </Container>
            </Form>
            <Container className='text-center'>
            <div className='px-5' style={{  color: "black" }}>
              <p style={{  fontWeight: "bold", fontSize: "0.85em" }} >
                <span>Belum memiliki akun?</span> 
                <span> <a href={Register} style={{  textDecoration: "none" }}>Daftar Sekarang</a></span>
              </p>
            </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
