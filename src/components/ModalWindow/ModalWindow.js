import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal} from "react-bootstrap";
import styles from './ModalWindow.module.css'

export default function ModalWindow(props) {
  if (props.contactForm !== undefined) {
    return (
      <Modal  
        show={props.show} 
        onHide={props.handleClose} 
        style={{marginTop: '25vh'}}
      >
        <Modal.Body 
          className={styles.modalBody} 
          style={{padding: '0'}}
        >
          {props.body}
        </Modal.Body>
      </Modal>
    )
  } else if (props.techSupport !== undefined) {
    return (
      <Modal 
        show={props.show} 
        onHide={props.handleClose} 
      >
        <Modal.Body 
          className={styles.modalBody} 
          style={{padding: '0'}}
        >
          {props.body}
        </Modal.Body>
      </Modal>
    )
  } else {
    return (
      <Modal 
        show={props.show} 
        onHide={props.handleClose} 
      >
        <Modal.Header 
          closeButton 
          className={styles.modalBody}
        >
          <Modal.Title 
            className={styles.title}
          >
            {props.heading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body 
          className={styles.modalBody} 
          style={{paddingTop: '0px', color: 'white'}}
        >
          {props.body}
        </Modal.Body>
      </Modal>
    )
  }
}