import styles from './admin.module.css'
import Head from 'next/head'
import Header from "../../../src/components/Header/Header";
import Footer from "../../../src/components/Footer/Footer";
import AdminBlocks from "../../../src/components/AdminBlocks/AdminBlocks";

const Admin = (props) => {

  return (
    <div>
      <div className={styles.main}>
        <Head>
         
        </Head>
        <Header white={true}/>
        <div className={styles.container}>
          <AdminBlocks/>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Admin;