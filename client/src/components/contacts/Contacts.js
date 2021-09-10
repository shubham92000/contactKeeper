import React ,{ useContext , Fragment ,useEffect } from 'react';
import { CSSTransition ,TransitionGroup } from 'react-transition-group';
import ContactContext from '../../context/contact/contactContext';
import ContactItem from './ContactItem';
import Spinner from '../layout/Spinner';

const Contacts = () => {
  const contactContext = useContext(ContactContext);
  const { contacts ,filtered , getContacts , loading , clearContacts } = contactContext;

  useEffect(() => {
    getContacts();
    clearContacts();
    //eslint-disable-next-line
  } , []);

  if(contacts!==null && contacts.length === 0 && !loading){
    return ( <h4>Please add a contact</h4> )
  }
  return (
    <Fragment>
      {(contacts!==null && loading!==null) ? (
        <TransitionGroup>
          {filtered !== null ? filtered.map(contact => (
          <CSSTransition key={contact._id} timeout={500} classNames="item"> 
            <ContactItem  contact = {contact}/> 
          </CSSTransition>
          )) : 
          contacts.map(contact => (
          <CSSTransition key={contact._id} timeout={500} classNames="item">
            <ContactItem  contact = {contact}/> 
          </CSSTransition>
          )) }
        </TransitionGroup>
      ) : <Spinner />}
      

      {/* {contacts.map(contact => <ContactItem key={contact._id} contact = {contact}/>)} */}
    </Fragment>
  )
}

export default Contacts;