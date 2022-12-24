import { Component } from 'react';
import { nanoid } from 'nanoid';

import { Box } from '../components/Box';
import Form from './Form/Form';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactsList/ContactsList';
import { Title, TitleContacts } from './Title/StyledTitle';
import { NotifyFail } from '../services/notify';

const LS_KEY = 'contacts';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem(LS_KEY);
    const parsedContacts = JSON.parse(savedContacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    const prevContacts = prevState.contacts;
    const nextContacts = this.state.contacts;

    if (nextContacts !== prevContacts) {
      localStorage.setItem(LS_KEY, JSON.stringify(nextContacts));
    }
  }

  addContacts = (name, number, e) => {
    const { contacts } = this.state;

    const isNameAdded = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
    const isNumberAdded = contacts.find(contact => contact.number === number);

    if (isNameAdded) {
      NotifyFail(`${name} is already in contacts`);

      return false;
    }
    if (isNumberAdded) {
      NotifyFail(`${number} is already in contacts`);

      return false;
    }

    this.setState(({ contacts }) => ({
      contacts: [...contacts, { id: nanoid(), name, number }],
    }));

    return true;
  };

  deleteContacts = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getFilterContact = () => {
    const { contacts, filter } = this.state;
    const normalizeFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );
  };

  render() {
    const { filter, contacts } = this.state;
    const filteredContacts = this.getFilterContact();

    return (
      <Box p={[4]}>
        <Title>Phonebook</Title>
        <Form onSubmit={this.addContacts} />
        <TitleContacts>Contacts</TitleContacts>
        <Filter onChangeFilter={this.changeFilter} value={filter} />
        <>
          {contacts.length > 0 ? (
            <ContactList
              contacts={filteredContacts}
              onDelete={this.deleteContacts}
            />
          ) : (
            <TitleContacts>Phonebook is empty</TitleContacts>
          )}
        </>
      </Box>
    );
  }
}

export default App;
